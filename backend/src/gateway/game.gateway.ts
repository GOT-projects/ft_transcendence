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
import { Game } from "src/database/entities/game.entity";
import { JwtContent, jwtContentComplete } from "src/auth/types";
import { RelDemandService } from "src/database/services/demand.service";
import { GameService } from "src/database/services/game.service";

export interface Games {
	game: Game;
	spectators: string[];
	socketUser1: string;
	socketUser2: string;
}

export interface StatusGateway {
	waitingUser: User | undefined; 
	waitingInvite: RelDemand | undefined;
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
		) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');
    private waiting: Map<string, User> = new Map<string, User>();
    private waitingInvite: Map<string, RelDemand> = new Map<string, RelDemand>();
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

	private async connectUserBody(client: Socket, jwt: string): Promise<ClientInfos | false> {
		try {
			const data: jwtContentComplete = await this.jwtService.verifyAsync(jwt);
			if (data.isTwoFactorAuthenticationEnabled === true && !(data.isTwoFactorAuthenticated)) {
				client.emit('error_client', 'Need 2fa');
				return false;
			}
			const user = await this.userService.findUniqueMail(data.userId, data.userEmail);
			if (!user) {
				client.emit('error_client', 'User not valid / authorized');
				return false;
			}
			const val = this.getValue(client);
			const infos: ClientInfos = {
				user: user,
				targetList: val,
			}
			// if (process.env.TTL_REGENERATE && data.iat + parseInt(process.env.TTL_REGENERATE) < Date.now() / 1000) {
			// 	this.logger.debug(`Refresh jwt for ${client.id} - ${infos.user.login}`);
			// 	client.emit('client_jwt', await this.jwtService.signAsync({
			// 		userId: data.userId,
			// 		userLogin: data.userLogin,
			// 		userEmail: data.userEmail,
			// 		isTwoFactorAuthenticationEnabled: data.isTwoFactorAuthenticationEnabled,
			// 		isTwoFactorAuthenticated: data.isTwoFactorAuthenticated,
			// 	}));
			// }
			return infos;
		} catch (error) {
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

	/**
	 * Socket routes
	 */
	@SubscribeMessage("server_join_waiting")
	async joinWaiting(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "cannot add in waiting list");
			return ;
		}
		this.waiting.set(client.id, auth.user);
		//TODO tout doux lancer game
	}

	@SubscribeMessage("server_join_demand")
	async joinDemand(@ConnectedSocket()client: Socket, @MessageBody("Authorization") jwt: string, @MessageBody("login") login: string){
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		if (auth.targetList.game || auth.targetList.spectator || auth.targetList.waitingInvite || auth.targetList.waitingUser){
			client.emit("error_client", "cannot add in waiting list");
			return ;
		}
		const user = await this.userService.findLogin(login);
		if (user === null){
			client.emit("error_client", "user not found");
			return ;
		}
		// const rel = await this.gameService
		this.waiting.set(client.id, auth.user);
	}

	/**
	 * Socket init
	 */

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		let jwt: string | undefined = undefined;
		const authorizationHeader = client.handshake.headers.authorization;
        // Not connected
        if (!authorizationHeader) {
			this.logger.verbose(`Client connected anonymous: ${client.id}`);
			return ;
        }
        const bearer : string[] = authorizationHeader.split(' ');
        if (bearer.length !== 2) {
			this.logger.verbose(`Client connected anonymous: ${client.id}`);
			return ;
        }
        // Verify token
        jwt = bearer[1];
	}
}
