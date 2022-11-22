import { Logger, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { JWTGuardSocket } from "../auth/guards/jwt.guard";
import { GatewayService } from "./gateway.service";

//@UseGuards(JWTGuardSocket)
@WebSocketGateway({
    cors: {
        credentials: false,
        origin: '*',
    },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly jwtService: JwtService,
        private readonly gatewayService: GatewayService,
        private readonly appService: AppService,
        ) {}
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
    private users: Map<string, string[]> = new Map<string, string[]>();
    
    //@UseGuards(JWTGuardSocket)
    @SubscribeMessage('server_profil')
    async profil(@ConnectedSocket() client: Socket) {
        const jwt = client.handshake.headers?.authorization?.split(' ')[1];
        if (!jwt) {
            client.disconnect();
            return ;
        }
        const ret = this.appService.profil(jwt);
        client.emit('client_profil', await ret);
    }
    
    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.users.forEach((ids, login) => {
            const i = ids.indexOf(client.id);
            if (i > -1) {
                ids.splice(i, 1);
                if (ids.length === 0)
                    this.users.delete(login);
                console.log(this.users);
                this.logger.log(`Client disconnected: ${client.id}`);
                return;
            }
        });
    }
      
    async handleConnection(client: Socket, ...args: any[]) {
        try {
            const jwt = client.handshake.headers?.authorization?.split(' ')[1];
            if (!jwt) {
                client.disconnect();
                return ;
            }
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const val = this.users.get(data.userLogin);
            if (!val) {
                this.users.set(data.userLogin, [client.id]);
            } else
                val.push(client.id);
            console.log(this.users);            
        } catch (error) {
            client.disconnect();
            return ;
        }
        this.logger.log(`Client connected: ${client.id}`);
    }
}