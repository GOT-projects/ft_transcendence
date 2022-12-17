import { Logger, Paramtype } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/database/services/user.service";
import { ChatGateway } from "./chat.gateway";
import { FriendGateway } from "./friend.gateway";
import { GeneralGateway } from "./general.gateway";
import { User } from "src/database/entities/user.entity";
import { RelDemand } from "src/database/entities/rel_demand.entity";
import { GOT } from "shared/types";
import { Game, gameStatus } from "src/database/entities/game.entity";
import { JwtContent, jwtContentComplete } from "src/auth/types";
import { RelDemandService } from "src/database/services/demand.service";
import { GameService } from "src/database/services/game.service";
import {v4 as uuidv4} from 'uuid';
import { MyTransform } from "src/utils/transform";
import { AppGateway } from "./app.gateway";

export interface Games {
	game: Game;
	spectators: string[];
	socketUser1: string;
	socketUser2: string;
}

export interface StatusGateway {
	waitingUser: User | undefined; 
	waitingInvite: Game | undefined;
	game: Games | undefined;
	spectator: Games | undefined;
}

export interface ClientInfos {
	user: User;
	targetList: StatusGateway,
}

@WebSocketGateway({
	cors: {
		credentials: false,
		origin: '*',
	},
	namespace: 'game'
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly gameService: GameService,
		private readonly appGateway: AppGateway,
		) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');

	// Lists
	private waiting: Map<string, User> = new Map<string, User>();
	private waitingInvite: Map<string, Game> = new Map<string, Game>();
	private games: Map<string, Games> = new  Map<string, Games>();

	/**
	 * Utils
	 */
	private getValue(client: Socket) : StatusGateway{
		let game: Games | undefined = undefined;
		let spectator: Games | undefined = undefined;
		for (const [key, value] of this.games) {
			if (value.socketUser1 === client.id || value.socketUser2 === client.id)
				game = value;
			else if (value.spectators.lastIndexOf(client.id) !== -1)
				spectator = value;
		}
		return {
			waitingUser: this.waiting.get(client.id), 
			waitingInvite: this.waitingInvite.get(client.id),
			game,
			spectator,
		};
	}

	private async deleteSocketData(client: Socket) {
		this.waiting.delete(client.id);
		const invite = this.waitingInvite.get(client.id);
		if (invite !== undefined) {
			this.gameService.delete(invite.id);
			this.waitingInvite.delete(client.id);
		}
		let codeGame: string | undefined = undefined;
		let codeSpectator: string[] = [];
		for (const [code, games] of this.games) {
			if (games.spectators.lastIndexOf(client.id) !== -1)
				codeSpectator.push(code);
			if (games.socketUser1 === client.id || games.socketUser2 === client.id)
				codeGame = code;
		}
		for (const code of codeSpectator) {
			const spectators = this.games.get(code)?.spectators;
			if (spectators) {
				const i = spectators.lastIndexOf(client.id);
				if (i !== -1)
					this.games.get(code)?.spectators.splice(i, 1);
			}
		}
		if (codeGame) {
			const game = this.games.get(codeGame);
			if (game) {
				if (client.id === game.socketUser1)
					game.game.points1 = 0;
				else
					game.game.points2 = 0;
				game.game.status = gameStatus.FINISH;
				this.gameService.update(game.game.id, game.game);
			}
		}
	}

	/**
	 * Need
	 * client_jwt
	 * error_client
	 */
	private async connectUserBody(client: Socket, jwt: string): Promise<ClientInfos | false> {
		try {
			const data: jwtContentComplete = await this.jwtService.verifyAsync(jwt);
			if (data.isTwoFactorAuthenticationEnabled === true && !(data.isTwoFactorAuthenticated)) {
				this.deleteSocketData(client);
				client.emit('error_client', 'Need 2fa');
				return false;
			}
			const user = await this.userService.findUniqueMail(data.userId, data.userEmail);
			if (!user) {
				this.deleteSocketData(client);
				client.emit('error_client', 'User not valid / authorized');
				return false;
			}
			const val = this.getValue(client);
			const infos: ClientInfos = {
				user: user,
				targetList: val,
			}
			if (process.env.TTL_REGENERATE && data.iat + parseInt(process.env.TTL_REGENERATE) < Date.now() / 1000) {
				this.logger.debug(`Refresh jwt for ${client.id} - ${infos.user.login}`);
				client.emit('client_jwt', await this.jwtService.signAsync({
					userId: data.userId,
					userLogin: data.userLogin,
					userEmail: data.userEmail,
					isTwoFactorAuthenticationEnabled: data.isTwoFactorAuthenticationEnabled,
					isTwoFactorAuthenticated: data.isTwoFactorAuthenticated,
				}));
			}
			return infos;
		} catch (error) {
				this.deleteSocketData(client);
				client.emit('error_client', error.message);
			return false;
		}
	}

	private async connectionSecure(client: Socket, jwt: string): Promise<false |ClientInfos> {
		if (jwt === undefined){
			this.logger.debug("JWT not found");
			return false;
		}
		const auth = await this.connectUserBody(client, jwt);
		if (!auth)
			return false;
		return auth;
	}

	private algoGameSendData(codeParty: string) {
		const party = this.games.get(codeParty);
		if (party) {
			if (party.spectators.length !== 0)
				this.server.to(party.spectators).emit('client_spectator', party); // FIXME value send
			this.server.to([party.socketUser1, party.socketUser2]).emit('client_pads', 'send pads if necessary') // FIXME value send
			this.server.to([party.socketUser1, party.socketUser2]).emit('client_ball', 'send pads if necessary') // FIXME value send
		}
	}

	private algoGame(codeParty: string) {
		// 
	}

	/**
	 * Socket routes
	 */
	@SubscribeMessage("server_join_waiting")
	async joinWaiting(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot add in waiting list");
			return ;
		}
		if (this.waiting.size !== 0) {
			const assoc = [...this.waiting][0];
			this.waiting.delete(assoc[0]);
			const user1 = assoc[1];
			const user2 = auth.user;
			const dto = {
				user1Id:user1.id,
				user2Id: user2.id,
				status: gameStatus.IN_PROGRESS
			};
			const tmp = await this.gameService.create(dto);
			const completeGame = await this.gameService.findCompleteGame(dto);
			const code = uuidv4();
			if (completeGame.length === 1) {
				this.games.set(code, {
					game: completeGame[0],
					spectators: [],
					socketUser1: (completeGame[0].user1.id === user1.id ? assoc[0] : client.id),
					socketUser2: (completeGame[0].user1.id === user1.id ? client.id: assoc[0]),
				});
				const start: GOT.InitGame = {
					user1: MyTransform.userEntityToGot(completeGame[0].user1),
					user2: MyTransform.userEntityToGot(completeGame[0].user2),
					points1: 0,
					points2: 0,
					codeParty: code
				};
				this.server.to([client.id, assoc[0]]).emit('init_game', start);
				//TODO tout doux lancer game
			} else {
				client.emit('error_client', 'Game not created')
			}
		} else
			this.waiting.set(client.id, auth.user);
	}

	@SubscribeMessage("server_join_demand")
	async joinDemand(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("login") login: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot add in waiting list");
			return ;
		}
		const user = await this.userService.findLogin(login);
		if (user === null){
			client.emit("error_client", "user not found");
			return ;
		}
		const demands = await this.gameService.getGameUserWhoDemand(auth.user);
		if (demands.length === 0) {
			const game = await this.gameService.create({
				user1Id: auth.user.id,
				user2Id: user.id,
				status: gameStatus.DEMAND
			});
			this.waitingInvite.set(client.id, game);
			client.emit("info_client", `User waiting ${user.login} response`);
			client.emit('client_join_demand', true);
		} else {
			client.emit('error_client', 'User already in demand');
			client.emit('client_join_demand', false);
		}
	}

	@SubscribeMessage("server_join_response")
	async joinResponse(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("login") login: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot add in waiting list");
			return ;
		}
		const user = await this.userService.findLogin(login);
		if (user === null){
			client.emit("error_client", "user not found");
			return ;
		}
		const demands = await this.gameService.getGameUserWhoDemand(user);
		if (demands.length === 1) {
			let socketClient: string | undefined = undefined;
			for (const [key, value] of this.waitingInvite.entries()) {
				if (value.id === demands[0].id)
					socketClient = key;
					break;
			}
			if (socketClient === undefined) {
				client.emit('error_client', `Demand found, but not the client`);
				return ;
			}
			demands[0].status = gameStatus.IN_PROGRESS;
			const game = await this.gameService.update(demands[0].id, demands[0]);
			this.waitingInvite.delete(socketClient);
			const code = uuidv4();
			this.games.set(code, {
				game: demands[0],
				spectators: [],
				socketUser1: (demands[0].user1.id === auth.user.id ? client.id : socketClient),
				socketUser2: (demands[0].user1.id === auth.user.id ? socketClient : client.id),
			});
			const start: GOT.InitGame = {
				user1: MyTransform.userEntityToGot(demands[0].user1),
				user2: MyTransform.userEntityToGot(demands[0].user2),
				points1: 0,
				points2: 0,
				codeParty: code
			};
			this.server.to([client.id, socketClient]).emit('init_game', start);
			//TODO tout doux lancer game
		} else
			client.emit('error_client', 'User already in demand')
	}

	/**
	 * Socket init
	 */

	async afterInit(server: Server) {
		const demands = this.gameService.getGameDemands();
		for (const demand of (await demands)) {
			this.gameService.delete(demand.id);
		}
		const progress = this.gameService.getGamesInProgress();
		for (const game of (await progress)) {
			this.gameService.delete(game.id);
		}
		this.logger.log('Init');
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		this.logger.verbose(`Client disconnected: ${client.id}`);
		this.deleteSocketData(client);
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		let jwt: string | undefined = undefined;
		const authorizationHeader = client.handshake.headers.authorization;
		// Not connected
		if (!authorizationHeader) {
			return await this.handleDisconnect(client);
			this.logger.verbose(`Client connected anonymous: ${client.id}`);
		}
		const bearer : string[] = authorizationHeader.split(' ');
		if (bearer.length !== 2) {
			return await this.handleDisconnect(client);
			this.logger.verbose(`Client connected anonymous: ${client.id}`);
		}
		// Verify token
		jwt = bearer[1];
		console.log('ll', jwt);
		
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return await this.handleDisconnect(client);
		this.logger.verbose(`Client connected: ${client.id}`);
	}
}
