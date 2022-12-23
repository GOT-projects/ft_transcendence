import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/database/services/user.service";
import { User } from "src/database/entities/user.entity";
import { GOT } from "shared/types";
import { Game, gameStatus } from "src/database/entities/game.entity";
import { jwtContentComplete } from "src/auth/types";
import { GameService } from "src/database/services/game.service";
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

interface Games {
	game: Game;
	spectators: string[];
	socketUser1: string;
	socketUser2: string;
	player1: player;
	player2: player;
	ball: ball;
}

interface StatusGateway {
	waitingUser: User | undefined; 
	waitingInvite: Game | undefined;
	game: Games | undefined;
	spectator: Games | undefined;
}

interface ClientInfos {
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
	private games: Map<number, Games> = new  Map<number, Games>();

	private waitUpdate: number = 33;
	private dimX: number = 2000;
	private dimY: number = 1000;

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
				const user = await this.userService.findOne(invite.user2Id);
				if (user !== null)
					this.appGateway.sendProfilOfUser(user);
				this.waitingInvite.delete(client.id);
			}
			let codeGame: number | undefined = undefined;
			let codeSpectator: number[] = [];
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
						game.game.points1 = -1;
					else
						game.game.points2 = -1;
					game.game.status = gameStatus.FINISH;
					this.gameService.update(game.game.id, game.game);
					const users = [...(game.spectators), (client.id === game.socketUser1 ? game.socketUser2 : game.socketUser1)];
					this.server.to(users).emit('info_client', `User ${client.id === game.socketUser1 ? game.game.user2.login : game.game.user1.login} win the game`);
				}
				this.games.delete(codeGame);
				}
			this.appGateway.sendLeaderboard();
		} catch (error) {
			client.emit('error_client', error.message);
		}
	}

	private async connectUserBody(client: Socket, jwt: string, emit: boolean): Promise<ClientInfos | false> {
		try {
			const data: jwtContentComplete = await this.jwtService.verifyAsync(jwt);
			if (data.isTwoFactorAuthenticationEnabled === true && !(data.isTwoFactorAuthenticated)) {
				this.deleteSocketData(client);
				if (emit)
					client.emit('error_client', 'Need 2fa');
				return false;
			}
			const user = await this.userService.findUniqueMail(data.userId, data.userEmail);
			if (!user) {
				this.deleteSocketData(client);
				if (emit)
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
			if (emit)
				client.emit('error_client', error.message);
			return false;
		}
	}

	private async connectionSecure(client: Socket, jwt: string, emit: boolean): Promise<false | ClientInfos> {
		if (jwt === undefined){
			this.logger.debug("JWT not found");
			return false;
		}
		const auth = await this.connectUserBody(client, jwt, emit);
		if (!auth)
			return false;
		return auth;
	}

	private resetBall(ball: ball){
		ball.x = this.dimY;
		ball.y = 500;
		if (ball.velocityX > 0)
			ball.velocityX = -15;
		else
			ball.velocityX = 15;
		ball.velocityY = 0;
		ball.speed = 10;
	}

	private collision(b: ball, p: player){
		p.top = p.y;
		p.bottom = p.y + p.height;

		p.left = p.x;
		
		p.right = p.x + p.width;
		
		b.top = b.y - b.radius;
		b.bottom = b.y + b.radius;
		b.left = b.x - b.radius ;
		b.right = b.x + b.radius;
		
		return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
	}

	private algoGameSendData(game: Games) {
		const player1: number = (game.player1.y)/ this.dimY;
		const player2: number = (game.player2.y) / this.dimY;
		const ball: GOT.Ball = {
			x: (game.ball.x) / this.dimX,
			y: (game.ball.y) / this.dimY,
		}
		// player gauche
		let actu: GOT.ActuGamePlayer = {
			ball,
			enemyY: player2
		};
		this.server.to(game.socketUser1).emit('client_game_player', actu);
		// player droit
		actu = {
			ball,
			enemyY: player1
		};
		this.server.to(game.socketUser2).emit('client_game_player', actu);
		// spectator
		if (game.spectators.length !== 0) {
			const ret: GOT.ActuGameSpectator = {
				ball,
				player1Y: player1,
				player2Y: player2
			};
			this.server.to(game.spectators).emit('client_game_spectator', ret);
		}
	}

	private algoGameSendPoints(game: Games) {
		const points: GOT.ActuGamePoints = {
			points1: game.game.points1,
			points2: game.game.points2
		}
		this.server.to([game.socketUser1, game.socketUser2, ...game.spectators]).emit('client_game_points', points);
	}

	private delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}

	private async update(party: Games): Promise<number>{
		if( party.ball.x - party.ball.radius < 0){
			party.game.points2++;
			try {
				this.algoGameSendPoints(party);
				await this.gameService.update(party.game.id, {points2: party.game.points2});
			} catch (error) {
				this.logger.error(`Update party point2 ${error.message}`);
			}
			this.resetBall(party.ball);
		} else if(party.ball.x + party.ball.radius > this.dimX){
			party.game.points1++;
			try {
				this.algoGameSendPoints(party);
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

		party.ball.x += party.ball.velocityX;
		party.ball.y += party.ball.velocityY;
			
		if(party.ball.y - party.ball.radius < 0 || party.ball.y + party.ball.radius > this.dimY){
			party.ball.velocityY = -party.ball.velocityY;
		}
		let player = (party.ball.x < this.dimX / 2) ? party.player1 : party.player2;
		
		// if the ball hits a paddle
		if(this.collision(party.ball, player)){
			let collidePoint = (party.ball.y - (player.y + player.height / 2));
			collidePoint = collidePoint / (player.height / 2);
			let angleRad = (Math.PI/4) * collidePoint;
			
			// change the X, Y velocity
			let direction = (party.ball.x + party.ball.radius < this.dimX/2) ? 1 : -1;
			party.ball.velocityX = direction * party.ball.speed * Math.cos(angleRad);
			party.ball.velocityY = party.ball.speed * Math.sin(angleRad);

			party.ball.speed += 2;
		}
		return 0;
	}

	private async algoGame(client: Socket, codeParty: number) {
		// TODO
		let party = this.games.get(codeParty);
		if (party) {
			// TODO send infos start
			let users = [...(party.spectators), party.socketUser1, party.socketUser2];
			this.appGateway.sendLeaderboard();
			await this.delay(3000);
			this.algoGameSendPoints(party);
			while ((await this.update(party)) === 0) {
				this.algoGameSendData(party);
				await this.delay(this.waitUpdate);
				const partyTmp = this.games.get(codeParty);
				if (partyTmp === undefined) {
					this.server.to(users).emit('client_game_finish', true);
					return ;
				}
				users = [...(party.spectators), party.socketUser1, party.socketUser2];
			}
			users = [...(party.spectators), party.socketUser1, party.socketUser2];
			this.server.to(users).emit('client_game_finish', true);
			this.games.delete(codeParty);
			if (party.game.points1 > party.game.points2)
				this.server.to(users).emit('info_client', `User ${party.game.user1.login} win the game`);
			else
				this.server.to(users).emit('info_client', `User ${party.game.user2.login} win the game`);
			await this.delay(3000);
			this.appGateway.sendLeaderboard();
		} else {
			client.emit('error_client', `Party with code ${codeParty} not found`);
		}
	}

	/**
	 * Socket routes
	 */
	@SubscribeMessage("server_join_waiting")
	async joinWaiting(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot add in waiting list");
			return ;
		}
		for (const [_, user] of this.waiting) {
			if (user.id === auth.user.id) {
				client.emit('error_client', `You're already waiting somebody`);
				return ;
			}
		}
		for (const [_, game] of this.waitingInvite) {
			if (game.user1Id === auth.user.id) {
				client.emit('error_client', `You're already waiting for ${game.user2.login}`);
				return ;
			}
		}
		for (const [_, game] of this.games) {
			if (game.game.user1Id === auth.user.id) {
				client.emit('error_client', `You're already in game with ${game.game.user2.login}`);
				return ;
			}
			if (game.game.user2Id === auth.user.id) {
				client.emit('error_client', `You're already in game with ${game.game.user1.login}`);
				return ;
			}
		}
		try {
			const gameIn = await this.gameService.findUserInGame(auth.user);
			if (gameIn.length !== 0) {
				client.emit('error_client', `You're in game, you cannot join waiting list`);
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
				if (completeGame.length === 1) {
					this.games.set(completeGame[0].id, {
						game: completeGame[0],
						spectators: [],
						socketUser1: (completeGame[0].user1.id === user1.id ? assoc[0] : client.id),
						socketUser2: (completeGame[0].user1.id === user1.id ? client.id: assoc[0]),
						player1: {x: 0, y : 500, width : 40, height : 200, score : 0,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
						player2: {x : this.dimX - 40, y : 500, width : 40, height : 200, score : 0,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
							ball: {x: 1000, y: 500,  radius : 25, velocityX : 25, velocityY : 0, speed : 15,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
					});
					const start: GOT.InitGame = {
						user1: MyTransform.userEntityToGot(completeGame[0].user1),
						user2: MyTransform.userEntityToGot(completeGame[0].user2),
						codeParty: completeGame[0].id,
						player: true
					};
					this.server.to([client.id, assoc[0]]).emit('client_init_game', start);
					this.server.to([client.id, assoc[0]]).emit('client_game_points', {
						points1: 0,
						points2: 0
					});
					this.algoGame(client, completeGame[0].id);
				} else {
					client.emit('error_client', 'Game not created');
				}
			} else {
				this.waiting.set(client.id, auth.user);
				client.emit('info_client', `You're in waiting list`);
			}
		} catch (error) {
			client.emit('error_client', error.message);
		}
	}

	@SubscribeMessage("server_left_waiting")
	async leftWaiting(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator){
			client.emit("error_client", "No in waiting list");
			return ;
		}
		if (this.waiting.delete(client.id))
			client.emit('info_client', `You left the waiting list`);
		if (this.waitingInvite.delete(client.id)) {
			if (auth.targetList.waitingInvite) {
				this.gameService.delete(auth.targetList.waitingInvite.id);
				const user = await this.userService.findOne(auth.targetList.waitingInvite.user2Id);
				if (user)
					this.appGateway.sendProfilOfUser(user);
			}
			client.emit('info_client', `You left the waiting list`);
		}
	}

	@SubscribeMessage("server_join_demand")
	async joinDemand(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("login") login: string){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot add in waiting list");
			return ;
		}
		if (login === auth.user.login) {
			client.emit('error_client', `You can't demand yourself to play`);
			return ;
		}
		for (const [sock, user] of this.waiting) {
			if (user.id === auth.user.id) {
				client.emit('error_client', `You're already waiting somebody`);
				return ;
			}
		}
		for (const [sock, game] of this.waitingInvite) {
			if (game.user1Id === auth.user.id) {
				client.emit('error_client', `You're already waiting for ${game.user2.login}`);
				return ;
			}
		}
		for (const [_, game] of this.games) {
			if (game.game.user1Id === auth.user.id) {
				client.emit('error_client', `You're already in game with ${game.game.user2.login}`);
				return ;
			}
			if (game.game.user2Id === auth.user.id) {
				client.emit('error_client', `You're already in game with ${game.game.user1.login}`);
				return ;
			}
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
				client.emit("info_client", `Waiting ${user.login} response`);
				await this.appGateway.sendProfilOfUser(user);
			} else {
				client.emit('error_client', 'User already demand someone');
			}
		} catch (error) {
			client.emit('error_client', error.message);
		}
	}

	@SubscribeMessage("server_join_response")
	async joinResponse(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("login") login: string, @MessageBody("status") status: boolean){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot add in waiting list");
			return ;
		}
		if (login === auth.user.login) {
			client.emit('error_client', `You can't demand yourself to play`);
			return ;
		}
		for (const [sock, user] of this.waiting) {
			if (user.id === auth.user.id) {
				client.emit('error_client', `You're already waiting somebody`);
				return ;
			}
		}
		for (const [sock, game] of this.waitingInvite) {
			if (game.user1Id === auth.user.id) {
				client.emit('error_client', `You're already waiting for ${game.user2.login}`);
				return ;
			}
		}
		for (const [_, game] of this.games) {
			if (game.game.user1Id === auth.user.id) {
				client.emit('error_client', `You're already in game with ${game.game.user2.login}`);
				return ;
			}
			if (game.game.user2Id === auth.user.id) {
				client.emit('error_client', `You're already in game with ${game.game.user1.login}`);
				return ;
			}
		}
		try {
			const user = await this.userService.findLogin(login);
			if (user === null){
				client.emit("error_client", "user not found");
				return ;
			}
			const demands = await this.gameService.getGameUserWhoIsDemand(user, auth.user);
			if (status) {
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
					const game = await this.gameService.update(demands[0].id, {status: gameStatus.IN_PROGRESS});
					this.waitingInvite.delete(socketClient);
					this.games.set(demands[0].id, {
						game: demands[0],
						spectators: [],
						socketUser1: (demands[0].user1.id === auth.user.id ? client.id : socketClient),
						socketUser2: (demands[0].user1.id === auth.user.id ? socketClient : client.id),
						player1: {x: 0, y : 500, width : 40, height : 200, score : 0,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
						player2: {x : this.dimX - 40, y : 500, width : 40, height : 200, score : 0,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
							ball: {x: 1000, y: 500,  radius : 25, velocityX : 25, velocityY : 0, speed : 15,
							top: undefined, bottom: undefined, left : undefined, right : undefined},
					});
					this.appGateway.sendProfilOfUser(auth.user);
					const start: GOT.InitGame = {
						user1: MyTransform.userEntityToGot(demands[0].user1),
						user2: MyTransform.userEntityToGot(demands[0].user2),
						codeParty: demands[0].id,
						player: true
					};
					this.server.to([client.id, socketClient]).emit('client_init_game', start);
					this.server.to([client.id, socketClient]).emit('client_game_points', {
						points1: 0,
						points2: 0
					});
					this.algoGame(client, demands[0].id);
				} else
					client.emit('error_client', `Any demand found`)
			} else {
				if (demands.length === 1) {
					await this.gameService.delete(demands[0].id);
					this.appGateway.sendProfilOfUser(auth.user);
				}
				
				let keyToDelete: string | undefined = undefined;
				for (const [key, val] of this.waitingInvite) {
					if (val.user1Id === user.id && val.user2Id === auth.user.id)
						keyToDelete = key;
				}
				if (keyToDelete) {
					this.server.to([client.id, keyToDelete]).emit('client_invite', 'false');
					this.server.to(keyToDelete).emit('warning_client', `Your demand is refused`);
					this.waitingInvite.delete(keyToDelete);
				}
			}
		} catch (error) {
			client.emit('error_client', error.message);
		}
	}

	@SubscribeMessage("server_join_spectator")
	async joinSpectator(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("codeParty") codeParty: number){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot visualize");
			return ;
		}
		const party = this.games.get(codeParty);
		if (party === undefined) {
			client.emit('warning_client', `Party not found`);
			return ;
		}
		if (party.spectators.lastIndexOf(client.id) === -1) {
			const start: GOT.InitGame = {
				user1: MyTransform.userEntityToGot(party.game.user1),
				user2: MyTransform.userEntityToGot(party.game.user2),
				codeParty: party.game.id,
				player: false
			};
			client.emit('client_init_game', start);
			client.emit('client_game_points', {
				points1: party.game.points1,
				points2: party.game.points2
			});
			party.spectators.push(client.id);
		} else {
			client.emit('error_client', `User already spectator`);
		}
	}

	@SubscribeMessage("server_change_pad")
	async changePad(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("padInfo") padInfo: number){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		if (auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "Cannot send send pad information");
			return ;
		}
		if (auth.targetList.game !== undefined) {
			if (auth.targetList.game.socketUser1 === client.id)
				auth.targetList.game.player1.y = padInfo * this.dimY - 100;
			else if (auth.targetList.game.socketUser2 === client.id)
				auth.targetList.game.player2.y = padInfo * this.dimY - 100;
		} else {
			client.emit("warning_client", "Pad info not send");
		}
	}

	@SubscribeMessage('server_where_am_I')
	async whereAmI(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody('where') where: string){
		this.delay(2).then(async () => {
			const auth = await this.connectionSecure(client, jwt, true);
			if (!auth)
				return ;
			this.logger.debug(where)
			if (where === 'waiting_invite') {
				if (auth.targetList.waitingUser || auth.targetList.spectator || auth.targetList.game)
					this.deleteSocketData(client);
			} else if (where === 'waiting') {
				if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite)
					this.deleteSocketData(client);
			} else if (where === 'spectator') {
				if (auth.targetList.game || auth.targetList.waitingUser || auth.targetList.waitingInvite)
					this.deleteSocketData(client);
			} else if (where === 'in_game') {
				if (auth.targetList.waitingUser || auth.targetList.waitingInvite)
					this.deleteSocketData(client);
			} else {
				if (auth.targetList.waitingUser || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.game)
					this.deleteSocketData(client);
			}
		})
	}

	@SubscribeMessage('server_custom')
	async custom(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody('custom') custom: GOT.CustomGame){
		const auth = await this.connectionSecure(client, jwt, true);
		if (!auth)
			return ;
		try {
			if (custom.ball && custom.color) {
				const values = Object.values(GOT.EnumBall);
				if (!(values.includes(custom.ball as unknown as GOT.EnumBall))) {
					client.emit('error_client', 'Custom information ball is incorrect');
					return;
				}
				if (custom.color.length < 2 || custom.color.length > 7 || custom.color[0] !== '#') {
					client.emit('error_client', 'Custom information color is not hex color');
					return ;
				}
				const hex = '0123456789ABCDEFabcdef'
				for (let index = 1; index < custom.color.length; index++) {
					if (!hex.includes(custom.color[index])) {
						client.emit('error_client', 'Custom information color is not hex color');
						return ;
					}
				}
				this.userService.update(auth.user.id, {
					ball: custom.ball,
					color: custom.color
				});
				this.appGateway.sendProfilOfUser(auth.user);
			} else
				client.emit('error_client', 'Custom informations ball or color is not send');
		} catch (error) {
			client.emit('error_client', error.message);
		}
		if (custom === undefined) {
			client.emit('error_client', 'Custom informations are empty');
			return ;
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

		const auth = await this.connectionSecure(client, jwt, false);
		if (!auth)
			return await this.handleDisconnect(client);
		this.logger.verbose(`Client connected: ${client.id}`);
	}
}
