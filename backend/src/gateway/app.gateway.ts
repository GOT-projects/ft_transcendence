import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GOT } from "shared/types";
import { Server, Socket } from "socket.io";
import { JwtContent, jwtContent } from "src/auth/types";
import { User } from "src/database/entities/user.entity";
import { UserService } from "src/database/services/user.service";
import { ChatGateway } from "./chat.gateway";
import { FriendGateway } from "./friend.gateway";
import { GeneralGateway } from "./general.gateway";

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
		private readonly userService: UserService,
		private readonly generalGateway: GeneralGateway,
		private readonly friendGateway: FriendGateway,
		private readonly chatGateway: ChatGateway,
		) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('AppGateway');
	private users: Map<string, string[]> = new Map<string, string[]>();

	/**
	 * Utils
	 */


	private getUser(client: Socket): string | undefined {
		for (let [key, value] of this.users.entries()) {
			if (value.indexOf(client.id) !== -1)
				return key;
		}
	}

	private async connectUserBody(client: Socket, jwt: string): Promise<JwtContent | false> {
		try {
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
			if (data.isTwoFactorAuthenticationEnabled === true && !(data.isTwoFactorAuthenticated)) {
				client.emit('error_client', 'Need 2fa');
				return false;
			}
			const user = await this.userService.findUnique(data.userId, data.userLogin);
			if (!user) {
				client.emit('error_client', 'User not valid / authorized');
				return false;
			}
			const val = this.users.get(data.userLogin);
			if (!val) {
				this.users.set(data.userLogin, [client.id]);
				this.logger.verbose(`Client add ${data.userLogin}: ${client.id}`);
			}
			else if (val.indexOf(client.id) === -1) {
				val.push(client.id);
				this.logger.log(`Client add ${data.userLogin}: ${client.id}`);
			}
			const infos: JwtContent = {
				user: user,
				isTwoFactorAuthenticationEnabled: data.isTwoFactorAuthenticationEnabled,
				isTwoFactorAuthenticated: data.isTwoFactorAuthenticated
			};
			return infos;
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

	private async connectionSecure(client: Socket, jwt: string): Promise<false | JwtContent> {
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
	 * Socket routes General
	 */

	private async getProfilWithFriends(user: User) {
		let ret = await this.generalGateway.getProfil(user);
		if (typeof ret === 'string')
			return ret;
		const friends = await this.friendGateway.getFriends(user);
		if (typeof friends !== 'string') {
			for (const friend of friends) {
				if (friend.status !== GOT.ProfileStatus.inGame && this.users.get(friend.login))
					friend.status = GOT.ProfileStatus.online
			}
			ret.friends = friends;
		}
		return ret;
	}

	@SubscribeMessage('server_profil')
	async getProfil(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.getProfilWithFriends(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', `profil ${ret}`);
			return ;
		}
		client.emit('client_profil', ret);
	}

	@SubscribeMessage('server_profil_login')
	async getProfilLogin(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.generalGateway.getProfilLogin(login);
		if (typeof ret === 'string') {
			client.emit('error_client', 'profil_login' + ret);
			return ;
		}
		client.emit('client_profil_login', ret);
	}

	@SubscribeMessage('server_change_username')
	async changeUsername(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('username') username: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.generalGateway.changeUsername(auth.user, username);
		if (typeof ret === 'string') {
			client.emit('error_client', 'change_username' + ret);
			return ;
		}
		this.getProfil(client, jwt);
	}

	@SubscribeMessage('server_leaderboard')
	async getLeaderboard(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.generalGateway.getLeaderboard();
		if (typeof ret === 'string') {
			client.emit('error_client', 'leaderboard' + ret);
			return ;
		}
		client.emit('client_leaderboard', ret);
	}

	/**
	 * Socket route friends
	 */

	@SubscribeMessage('server_demand_friend')
	async demandFriend(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.friendGateway.demandFriend(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', 'demand_friend' + ret);
			return ;
		}
		const user1 = this.users.get(auth.user.login);
		if (user1) {
			const profil = await this.getProfilWithFriends(auth.user);
			if (typeof profil !== 'string')
				this.server.to(user1).emit('client_profil', profil);
			if (ret.status)
				this.server.to(user1).emit('info_client', `You and user with login ${ret.user.login} are now friend`);
			else
				this.server.to(user1).emit('info_client', `You invite user with login ${login} to be friend`);
		}
		const user2 = this.users.get(ret.user.login);
		if (user2) {
			const profil = await this.getProfilWithFriends(ret.user);
			if (typeof profil !== 'string')
				this.server.to(user2).emit('client_profil', profil);
			if (ret.status)
				this.server.to(user2).emit('info_client', `You and user with login ${auth.user.login} are now friend`);
			else
				this.server.to(user2).emit('info_client', `User with login ${auth.user.login} invite you to be friend`);
		}
	}

	@SubscribeMessage('server_reply_notification')
	async replyNotif(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('reply') reply: GOT.NotifChoice) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.friendGateway.replyNotif(auth.user, reply);
		if (typeof ret === 'string') {
			client.emit('error_client', 'reply_notification' + ret);
			return ;
		}
		const user1 = this.users.get(auth.user.login);
		if (user1) {
			const profil = await this.getProfilWithFriends(auth.user);
			if (typeof profil !== 'string')
				this.server.to(user1).emit('client_profil', profil);
			if (ret.status)
				this.server.to(user1).emit('info_client', `You and user with login ${reply.user.login} are now friend`);
		}
		const user2 = this.users.get(ret.user.login);
		if (user2) {
			const profil = await this.getProfilWithFriends(ret.user);
			if (typeof profil !== 'string')
				this.server.to(user2).emit('client_profil', profil);
			if(ret.status)
				this.server.to(user2).emit('info_client', `You and user with login ${auth.user.login} are now friend`);
			else
				this.server.to(user2).emit('info_client', `User with login ${auth.user.login} refuse your demand`);
		}
	}

	@SubscribeMessage('server_friends')
	async getFriendsFor(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const profil = await this.getProfilWithFriends(auth.user);
		if (typeof profil === 'string') {
			client.emit('error_client', 'friends' + profil);
			return ;
		}
		client.emit('client_profil', profil);
	}

	@SubscribeMessage('server_block_somebody')
	async blockSomebody(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.friendGateway.blockSomebody(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', 'block_somebody' + ret);
			return ;
		}
		const user1 = this.users.get(auth.user.login);
		if (user1) {
			const profil = await this.getProfilWithFriends(auth.user);
			if (typeof profil !== 'string')
				this.server.to(user1).emit('client_profil', profil);
			this.server.to(user1).emit('info_client', `You block user with login ${login}`);
		}
		const user2 = this.users.get(ret.login);
		if (user2) {
			const profil = await this.getProfilWithFriends(ret);
			if (typeof profil !== 'string')
				this.server.to(user2).emit('client_profil', profil);
			this.server.to(user2).emit('info_client', `User with login ${auth.user.login} block you`);
		}
	}

	@SubscribeMessage('server_unblock_somebody')
	async unblockSomebody(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.friendGateway.unblockSomebody(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', 'unblock_somebody' + ret);
			return ;
		}
		const user1 = this.users.get(auth.user.login);
		if (user1) {
			const profil = await this.getProfilWithFriends(auth.user);
			if (typeof profil !== 'string')
				this.server.to(user1).emit('client_profil', profil);
			this.server.to(user1).emit('info_client', `You unblock user with login ${login}`);
		}
		const user2 = this.users.get(ret.login);
		if (user2) {
			const profil = await this.getProfilWithFriends(ret);
			if (typeof profil !== 'string')
				this.server.to(user2).emit('client_profil', profil);
			this.server.to(user2).emit('info_client', `User with login ${auth.user.login} unblock you`);
		}
	}

	/**
	 * socket routes privmsg
	 */


	@SubscribeMessage('server_privmsg')
	async getPrivmsg(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getPrivmsg(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', 'privmsg' + ret);
			return ;
		}
		client.emit('client_privmsg', ret);
	}

	@SubscribeMessage('server_privmsg_users')
	async getPrivmsgUsers(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getPrivmsgUsers(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', 'privmsg_users' + ret);
			return ;
		}
		client.emit('client_privmsg_users', ret);
	}

	@SubscribeMessage('server_privmsg_send')
	async getPrivmsgSend(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string, @MessageBody('msg') msg: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getPrivmsgSend(auth.user, login, msg);
		if (typeof ret === 'string') {
			client.emit('error_client', 'privmsg_send' + ret);
			return ;
		}
		const user = this.users.get(ret.userTo.login);
		if (user) {
			this.server.to(user).emit('client_privmsg_send', ret);
			this.server.to(user).emit('info_client', `User with login ${auth.user.login} send you a private message`);
		}
		const actuUser = this.users.get(auth.user.login);
		const actu = await this.chatGateway.getPrivmsg(auth.user, login);
		if (typeof actu !== 'string' && actuUser) {
			this.server.to(actuUser).emit('client_privmsg', actu);
		}
	}

	@SubscribeMessage('server_users')
	async getUsers(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getUsers(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', 'users' + ret);
			return ;
		}
		client.emit('client_users', ret);
	}

	/**
	 * Socket routes channels
	 */

	@SubscribeMessage('server_chanmsg')
	async getChanmsg(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getChanmsg(auth.user, chanName);
		if (typeof ret === 'string') {
			client.emit('error_client', 'chan_msg' + ret);
			return ;
		}
		client.emit('client_chanmsg', ret);
	}

	@SubscribeMessage('server_chanmsg_users_not_ban')
	async getChanUsersNotBan(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getChanUsersNotBan(auth.user, chanName);
		if (typeof ret === 'string') {
			client.emit('error_client', 'chanmsg_users_not_ban' + ret);
			return ;
		}
		client.emit('client_chanmsg_users_not_ban', ret);
	}

	@SubscribeMessage('server_channels_in')
	async getChannelsIn(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getChannelsIn(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', 'channels_in' + ret);
			return ;
		}
		client.emit('client_channels_in', ret);
	}

	@SubscribeMessage('server_chanmsg_send')
	async chanmsgSend(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('msg') msg: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.chanmsgSend(auth.user, chanName, msg);
		if (typeof ret === 'string') {
			client.emit('error_client', 'chanmsg_send' + ret);
			return ;
		}
		const users = await this.chatGateway.getChanUsersNotBan(auth.user, chanName);
		const actu = await this.chatGateway.getChanmsg(auth.user, chanName);
		if (typeof users !== 'string') {
			let sock: string[] = [];
			for (const tmp of users.users) {
				const tmp2 = this.users.get(tmp.login);
				if (tmp2)
					sock = [...sock, ...tmp2];
			}
			this.server.to(sock).emit('client_info', `Channel ${chanName} received a message`);
			if (typeof actu !== 'string')
				this.server.to(sock).emit('client_chanmsg', actu);
		}
	}

	@SubscribeMessage('server_channels')
	async getChannels(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getChannels(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', 'channels' + ret);
			return ;
		}
		client.emit('client_channels', ret);
	}

	@SubscribeMessage('server_chan_join')
	async joinChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('password') password?: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.joinChannel(auth.user, chanName, password);
		if (typeof ret === 'string') {
			client.emit('error_client', 'chan_join' + ret);
			return ;
		}
		const users = await this.chatGateway.getChanUsersNotBan(auth.user, chanName);
		if (typeof users !== 'string') {
			let sock: string[] = [];
			for (const tmp of users.users) {
				const tmp2 = this.users.get(tmp.login);
				if (tmp2)
					sock = [...sock, ...tmp2];
			}
			this.server.to(sock).emit('client_info', `Channel ${chanName} have a new member ${auth.user.login}`);
			this.server.to(sock).emit('server_chanmsg_users_not_ban', users);
		}
		const back = await this.chatGateway.getChannelsIn(auth.user);
		if (typeof back !== 'string')
			client.emit('client_channels_in', back);
	}

	@SubscribeMessage('server_chanmsg_invite')
	async inviteChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginInvite') loginInvite: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.inviteChannel(auth.user, chanName, loginInvite);
		if (typeof ret === 'string') {
			client.emit('error_client', 'chan_invite' + ret);
			return ;
		}
		const back = await this.chatGateway.getChannelsIn(auth.user);
		if (typeof ret !== 'string')
			client.emit('client_channels_in', back);
	}

	@SubscribeMessage('server_chan_create')
	async createChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chan') chan: GOT.Channel) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.createChannel(auth.user, chan);
		if (typeof ret === 'string') {
			client.emit('error_client', 'chan_create' + ret);
			return ;
		}
		const back = await this.chatGateway.getChannelsIn(auth.user);
		if (typeof ret !== 'string')
			client.emit('client_channels_in', back);
	}


	/**
	 * Socket init
	 */

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
				this.logger.verbose(`Client disconnected ${login}: ${client.id}`);
				status = false;
				return ;
			}
		});
		if (status)
			this.logger.verbose(`Client disconnected anonymous: ${client.id}`);
	}

	async handleConnection(client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth) {
			this.logger.verbose(`Client connected anonymous: ${client.id}`);
			return ;
		}
		this.logger.verbose(`Client connected ${auth.user.login}: ${client.id}`);
		const ret = await this.chatGateway.getUsers(auth.user);
		if (typeof ret !== 'string')
			this.server.emit('client_users', ret);
	}
}
