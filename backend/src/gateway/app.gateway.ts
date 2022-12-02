import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from "@nestjs/websockets";
import { GOT } from "shared/types";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { FriendService } from "./friend.service";
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
        private readonly friendService: FriendService,
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

    private async getFriendsList(client: Socket, userId: number) {
        let ret = await this.friendService.getFriends(userId);
        console.log("ret server_friend", ret);
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            return ;
        }
        ret.forEach(friend => {
            if (this.users.get(friend.login) !== undefined)
                friend.status = GOT.ProfileStatus.online;
        });
        return ret;
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
            if (!val) {
                this.users.set(data.userLogin, [client.id]);
                this.logger.verbose(`Client add ${data.userLogin}: ${client.id}`);
            }
            else if (val.indexOf(client.id) === -1) {
                val.push(client.id);
                this.logger.log(`Client add ${data.userLogin}: ${client.id}`);
            }
            console.log('global', this.users);
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
            client.emit('error_client', error.message);
            return false;
        }
    }
    
    @SubscribeMessage('server_profil')
    async profil(@ConnectedSocket() client: Socket) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = await this.gatewayService.profil(auth);
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            return ;
        }
        client.emit('client_profil', ret);
    }

    @SubscribeMessage('server_profil_login')
    async profilLogin(@ConnectedSocket() client: Socket, @MessageBody('login') login: string) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = await this.gatewayService.profilLogin(login);
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            return ;
        }
        client.emit('client_profil_login', ret);
    }

    @SubscribeMessage('server_leaderboard')
    async leaderboard(@ConnectedSocket() client: Socket) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = await this.gatewayService.leaderboard();
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            return ;
        }
        client.emit('client_leaderboard', ret);
    }

    @SubscribeMessage('server_change_username')
    async changeUsername(@ConnectedSocket() client: Socket, @MessageBody('username') username: string) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = await this.gatewayService.changeUsername(auth, username);
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            return ;
        }
        this.server.emit('client_change_username', ret);
    }

    @SubscribeMessage('server_demand_friend')
    async demandFriend(@ConnectedSocket() client: Socket, @MessageBody('login') login: string) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = await this.friendService.demandFriend(auth.userLogin, login);
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            return ;
        }
        let userSockets = this.users.get(auth.userLogin);
        if (userSockets) {
            const tmpNotif = await this.friendService.getNotif(auth.userId);
            if (typeof tmpNotif !== 'string') {
                this.server.to(userSockets).emit('client_notif', tmpNotif);
                
            }
            const tmpFriends = await this.getFriendsList(client, auth.userId);
            if (tmpFriends !== undefined)
                this.server.to(userSockets).emit('client_friends', tmpFriends);
        }
        userSockets = this.users.get(login);
        if (userSockets) {
            const userId = ret.user1Id === auth.userId ? ret.user2Id : ret.user1Id;
            const tmpNotif = await this.friendService.getNotif(userId);
            if (typeof tmpNotif !== 'string')
                this.server.to(userSockets).emit('client_notif', tmpNotif);
            const tmpFriends = await this.getFriendsList(client, userId);
            if (tmpFriends !== undefined)
                this.server.to(userSockets).emit('client_friends', tmpFriends);
        }
    }

    @SubscribeMessage('server_reply_notification')
    async replyNotif(@ConnectedSocket() client: Socket, @MessageBody() reply: GOT.NotifChoice) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        const ret = await this.friendService.newFriendConfirmation(auth.userLogin, reply.user.login, reply.accept);
        if (typeof ret === 'string') {
            client.emit('error_client', ret);
            const tmpNotif = await this.friendService.getNotif(auth.userId);
            console.log("tmpNotif", tmpNotif);
            if (typeof tmpNotif !== 'string')
                client.emit('client_notif', tmpNotif);
            return ;
        }
        if (ret === false) {
            client.emit('error_client', `Cannot add ${reply.user.username} as friend`);
            return ;
        }
        let userSockets = this.users.get(auth.userLogin);
        if (userSockets) {
            const tmpNotif = await this.friendService.getNotif(auth.userId);
            console.log("tmpNotif", tmpNotif);
            if (typeof tmpNotif !== 'string')
                this.server.to(userSockets).emit('client_notif', tmpNotif);
            const tmpFriends = await this.getFriendsList(client, auth.userId);
            console.log("tmpFriends", tmpFriends);
            if (typeof tmpNotif !== 'string')
            if (tmpFriends !== undefined)
                this.server.to(userSockets).emit('client_friends', tmpFriends);
        }
        userSockets = this.users.get(reply.user.login);
        if (userSockets) {
            const tmpFriends = await this.getFriendsList(client, reply.user.id);
            console.log("tmpFriends", tmpFriends);
            if (tmpFriends !== undefined)
                this.server.to(userSockets).emit('client_friends', tmpFriends);
        }
    }

    @SubscribeMessage('server_friends')
    async getFriends(@ConnectedSocket() client: Socket) {
        const auth = await this.connectUser(client);
        if (!auth) {
            return ;
        }
        //TODO je tu doit retourne Friend[] et pas User pour avoir les status online | offline des users
        const ret = await this.getFriendsList(client, auth.userId);
        console.log("ret server_friend", ret);
        if (ret !== undefined) 
            client.emit('client_friends', ret);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        let status = true;
        this.users.forEach((ids, login) => {
            const i = ids.indexOf(client.id);
            if (i > -1) {
                ids.splice(i, 1);
                if (ids.length === 0)
                    this.users.delete(login);
                console.log(this.users);
                this.logger.verbose(`Client disconnected ${login}: ${client.id}`);
                status = false;
                return ;
            }
        });
        if (status)
            this.logger.verbose(`Client disconnected anonymous: ${client.id}`);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const auth = await this.connectUser(client);
        if (!auth) {
            this.logger.verbose(`Client connected anonymous: ${client.id}`);
            return ;
        }
        this.logger.verbose(`Client connected ${auth.userLogin}: ${client.id}`);
    }
}
