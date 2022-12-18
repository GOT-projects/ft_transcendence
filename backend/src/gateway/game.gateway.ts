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

/**
 * Game types
 */

interface ball{
	x: number,
	y: number, 
	radius : number,
	velocityX : number,
	velocityY : number,
	speed : number,
	top: number | undefined,
	bottom: number | undefined,
	left : number | undefined,
	right : number | undefined
}

interface player {
	x: number,
	y : number,
	width : number,
	height : number,
	score : number,
	top: number | undefined,
	bottom: number | undefined,
	left : number | undefined,
	right : number | undefined
}


/**
 * Gateway types
 */

export interface Games {
	game: Game;
	spectators: string[];
	socketUser1: string;
	socketUser2: string;
	player1: player;
	player2: player;
	ball: ball;
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

	private waitUpdate = 50;

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

	private async deleteSocketData(client: Socket): Promise<void> {
		try {
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
		} catch (error) {
			client.emit('error_client', error.message);
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

	private resetBall(ball: ball){
		ball.x = 1000;
		ball.y = 500;
		ball.velocityX = - ball.velocityX;
		ball.speed = 7;
	}

	private collision(b: ball, p: player){
		p.top = p.y;
		p.bottom = p.y + p.height;
		p.left = p.x;
		p.right = p.x + p.width;
		
		b.top = b.y - b.radius;
		b.bottom = b.y + b.radius;
		b.left = b.x - b.radius;
		b.right = b.x + b.radius;
		
		return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
	}

	private algoGameSendData(game: Games) {
		// TODO send datas
		// x [0, 2000]
		// y [0, 1000]

		//TODO trad to ratio
		/*const party = this.games.get(codeParty);
		if (party) {
			if (party.spectators.length !== 0)
				this.server.to(party.spectators).emit('client_spectator', party); // FIXME value send
			this.server.to([party.socketUser1, party.socketUser2]).emit('client_pads', 'send pads if necessary') // FIXME value send
			this.server.to([party.socketUser1, party.socketUser2]).emit('client_ball', 'send pads if necessary') // FIXME value send
		}*/
	}

	private delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}

	private async update(party: Games): Promise<number>{
		if( party.ball.x - party.ball.radius < 0 ){
			party.game.points2++;
			try {
				await this.gameService.update(party.game.id, {points2: party.game.points2});
			} catch (error) {
				this.logger.error(`Update party point2 ${error.message}`);
			}
			this.resetBall(party.ball);
		}else if( party.ball.x + party.ball.radius > 2000){
			party.game.points1++;
			try {
				await this.gameService.update(party.game.id, {points1: party.game.points1});
			} catch (error) {
				this.logger.error(`Update party point1 ${error.message}`);
			}
			this.resetBall(party.ball);
		}
		if (party.game.points1 === 5 || party.game.points2 === 5) {
			try {
				await this.gameService.update(party.game.id, {status: gameStatus.FINISH});
			} catch (error) {
				this.logger.error(`Update finish party ${error.message}`);
			}
			return 1;
		}
		
		// the ball has a velocity
		party.ball.x += party.ball.velocityX;
		party.ball.y += party.ball.velocityY;
			
		// when the ball collides with bottom and top walls we inverse the y velocity.
		if(party.ball.y - party.ball.radius < 0 || party.ball.y + party.ball.radius > 1000){
			party.ball.velocityY = -party.ball.velocityY;
		}
		// we check if the paddle hit the user or the com paddle
		let player = (party.ball.x + party.ball.radius < 2000 / 2) ? party.player1 : party.player2;
		
		// if the ball hits a paddle
		if(this.collision(party.ball, player)){
			// we check where the ball hits the paddle
			let collidePoint = (party.ball.y - (player.y + player.height/2));
			// normalize the value of collidePoint, we need to get numbers between -1 and 1.
			// -player.height/2 < collide Point < player.height/2
			collidePoint = collidePoint / (player.height/2);
			
			// when the ball hits the top of a paddle we want the ball, to take a -45degees angle
			// when the ball hits the center of the paddle we want the ball to take a 0degrees angle
			// when the ball hits the bottom of the paddle we want the ball to take a 45degrees
			// Math.PI/4 = 45degrees
			let angleRad = (Math.PI/4) * collidePoint;
			
			// change the X and Y velocity direction
			let direction = (party.ball.x + party.ball.radius < 2000/2) ? 1 : -1;
			party.ball.velocityX = direction * party.ball.speed * Math.cos(angleRad);
			party.ball.velocityY = party.ball.speed * Math.sin(angleRad);
			
			// speed up the ball everytime a paddle hits it.
			party.ball.speed += 0.1;
		}
		return 0;
	}

	private async algoGame(client: Socket, codeParty: string) {
		// TODO
		let party = this.games.get(codeParty);
		if (party) {
			// TODO send infos start
			await this.delay(3000);
			while ((await this.update(party)) === 0) {
				this.algoGameSendData(party);
				await this.delay(this.waitUpdate);
			}
			const users = [...(party.spectators), party.socketUser1, party.socketUser2];
			this.games.delete(codeParty);
			if (party.game.points1 > party.game.points2)
				this.server.to(users).emit('info_client', `User ${party.game.user1.login} win the game`);
			else
				this.server.to(users).emit('info_client', `User ${party.game.user2.login} win the game`);
			await this.delay(3000);
			this.server.to(users).emit('client_redir', {
				codeParty,
				to: '/leaderboard',
			})
		} else {
			client.emit('error_client', `Party with code ${codeParty} not found`);
		}
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
		console.log('waiting', this.waiting, 'games', this.games);
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
			try {
				const tmp = await this.gameService.create(dto);
				const completeGame = await this.gameService.findCompleteGame(dto);
				const code = uuidv4();
				if (completeGame.length === 1) {
					this.games.set(code, {
						game: completeGame[0],
						spectators: [],
						socketUser1: (completeGame[0].user1.id === user1.id ? assoc[0] : client.id),
						socketUser2: (completeGame[0].user1.id === user1.id ? client.id: assoc[0]),
						player1: {x: 0, y : 500, width : 40, height : 200, score : 0,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
						player2: {x : 2000 - 40, y : 500, width : 40, height : 200, score : 0,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
						ball: {x: 1000, y: 500,  radius : 31.25, velocityX : 5, velocityY : 5, speed : 7,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
					});
					const start: GOT.InitGame = {
						user1: MyTransform.userEntityToGot(completeGame[0].user1),
						user2: MyTransform.userEntityToGot(completeGame[0].user2),
						points1: 0,
						points2: 0,
						codeParty: code
					};
					this.server.to([client.id, assoc[0]]).emit('init_game', start);
					console.log('waiting', this.waiting, 'games', this.games);
					this.algoGame(client, code);
				} else {
					client.emit('error_client', 'Game not created');
				}
			} catch (error) {
				client.emit('error_client', error.message);
			}
		} else
			this.waiting.set(client.id, auth.user);
	}

	@SubscribeMessage("server_left_waiting")
	async leftWaiting(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite){
			client.emit("error_client", "No in waiting list");
			return ;
		}
		this.waiting.delete(client.id);
		client.emit('info_client', `You left the waiting list`);
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
		try {
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
				//client.emit('client_join_demand', true);
			} else {
				client.emit('error_client', 'User already in demand');
				//client.emit('client_join_demand', false);
			}
		} catch (error) {
			client.emit('error_client', error.message);
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
		try {
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
					player1: {x: 0, y : 500, width : 40, height : 200, score : 0,
						top: undefined, bottom: undefined, left : undefined, right : undefined},
					player2: {x : 2000 - 40, y : 500, width : 40, height : 200, score : 0,
						top: undefined, bottom: undefined, left : undefined, right : undefined},
					ball: {x: 1000, y: 500,  radius : 31.25, velocityX : 5, velocityY : 5, speed : 7,
						top: undefined, bottom: undefined, left : undefined, right : undefined},
				});
				const start: GOT.InitGame = {
					user1: MyTransform.userEntityToGot(demands[0].user1),
					user2: MyTransform.userEntityToGot(demands[0].user2),
					points1: 0,
					points2: 0,
					codeParty: code
				};
				this.server.to([client.id, socketClient]).emit('init_game', start);
				this.algoGame(client, code);
			} else
				client.emit('error_client', 'User already in demand')
		} catch (error) {
			client.emit('error_client', error.message);
		}
	}

	@SubscribeMessage("server_join_spectator")
	async joinSpectator(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("codeParty") codeParty: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot visualize");
			return ;
		}
		const party = this.games.get(codeParty);
		if (party && party.spectators.lastIndexOf(client.id) === -1) {
			party.spectators.push(client.id);
			// TODO send infos start
		}
	}

	@SubscribeMessage("server_change_pad")
	async changePad(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("codeParty") codeParty: string,  @MessageBody("padInfo") padInfo: any){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot send send pad information");
			return ;
		}
		const party = this.games.get(codeParty);
		if (party) {
			if (party.socketUser1 === client.id)
				return ; // TODO change pad left
			else if (party.socketUser2 === client.id)
				return ; // TODO change pad right
		}
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
		this.logger.debug('Connection');
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
