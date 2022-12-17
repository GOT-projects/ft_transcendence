import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/database/services/user.service";
import { ChatGateway } from "./chat.gateway";
import { FriendGateway } from "./friend.gateway";
import { GeneralGateway } from "./general.gateway";




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
		) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');
    private invites: Map<string, string> = new Map<string, string>();
    // private games: ...;
    private waiting: Map<string, string> = new Map<string, string>();
	private users: Map<string, string[]> = new Map<string, string[]>();

	/**
	 * Utils
	 */


	/**
	 * Socket routes
	 */


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
