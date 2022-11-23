import { Logger, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from "@nestjs/websockets";
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

    private getUser(client: Socket) {
        for (let [key, value] of this.users.entries()) {
            if (value.indexOf(client.id) !== -1)
                return key;
        }
    }

    private async connectUser(client: Socket) {
        try {
            const jwt = client.handshake.headers?.authorization?.split(' ')[1];
            if (!jwt) {
                const login: string | undefined = this.getUser(client);
                if (login !== undefined) {
                    const ids = this.users.get(login);
                    if (!ids)
                        return false;
                    const i = ids.indexOf(client.id);
                    if (i !== -1)
                        ids.splice(i, 1);
                        if (ids.length === 0)
                            this.users.delete(login);
                }
                return false;
            }
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const val = this.users.get(data.userLogin);
            if (!val)
                this.users.set(data.userLogin, [client.id]);
            else
                val.push(client.id);
            console.log(this.users);
            return data;         
        } catch (error) {
            const login: string | undefined = this.getUser(client);
            if (login !== undefined) {
                const ids = this.users.get(login);
                if (!ids)
                    return false;
                const i = ids.indexOf(client.id);
                if (i !== -1)
                    ids.splice(i, 1);
                    if (ids.length === 0)
                        this.users.delete(login);
            }
            return false;
        }
    }
    
    //@UseGuards(JWTGuardSocket)
    @SubscribeMessage('server_profil')
    async profil(@ConnectedSocket() client: Socket) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = this.gatewayService.profil(auth);
        if (ret === null) {
            return ;
        }
        client.emit('client_profil', await ret);
    }

    //@UseGuards(JWTGuardSocket)
    @SubscribeMessage('server_profil_login')
    async profilLogin(@ConnectedSocket() client: Socket, @MessageBody('login') login: string) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = this.gatewayService.profilLogin(login);
        if (ret === null) {
            return ;
        }
        client.emit('client_profil_login', await ret);
    }

    //@UseGuards(JWTGuardSocket)
    @SubscribeMessage('server_leaderboard')
    async leaderboard(@ConnectedSocket() client: Socket) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = this.gatewayService.leaderboard();
        if (ret === null) {
            return ;
        }
        client.emit('client_leaderboard', await ret);
    }

    @SubscribeMessage('server_change_username')
    async changeUsername(@ConnectedSocket() client: Socket, @MessageBody('username') username: string) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = this.gatewayService.changeUsername(auth, username);
        if (ret === null) {
            return ;
        }
        this.server.emit('client_change_username', await ret);
        //client.emit('client_change_username', await ret);
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
        this.logger.log(`Client connected: ${client.id}`);
    }
}