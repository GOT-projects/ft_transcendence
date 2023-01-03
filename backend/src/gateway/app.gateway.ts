import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GOT } from "shared/types";
import { Server, Socket } from "socket.io";
import { JwtContent, jwtContentComplete } from "src/auth/types";
import { User } from "src/database/entities/user.entity";
import { UserService } from "src/database/services/user.service";
import { ChatGateway } from "./chat.gateway";
import { FriendGateway } from "./friend.gateway";
import { GeneralGateway } from "./general.gateway";
import { isChanName, isChannel, isLogin, isMessage, isNotifChoice, isPassword } from "src/utils/check";

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

	public async sendProfileToAllFriends(login:string) {
		try {
			const user = await this.userService.findLogin(login);
			if (user) {
				const friends = await this.friendGateway.getFriends(user);
				if (typeof friends !== 'string') {
					for (const friend of friends) {
						const sock = this.users.get(friend.login);
						if (sock !== undefined) {
							const friendUser: User = {
								id: friend.id,
								login: friend.login,
								urlImg: friend.urlImg,
								wallet: friend.wallet,
								email: friend.email,
								ball: friend.ball,
								color: friend.color,
								isTwoFactorAuthenticationEnabled: friend.isTwoFactorAuthenticationEnabled,
								userIdIsBlock: [],
								users1Friend: [],
								users2Friend: [],
								userWhoBlock: [],
								messageFrom: [],
								messageTo: [],
								channelsRel: [],
								gamesPlayer1: [],
								gamesPlayer2: []
							};
							const tmpProfil = await this.getProfilWithFriends(friendUser);
							if (typeof tmpProfil !== 'string')
								this.server.to(sock).emit('client_profil', tmpProfil)
						}
					}
				}
			}
		} catch (error) {}
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
					if (ids.length === 0) {
						this.users.delete(login);
						await this.sendProfileToAllFriends(login);
					}
				}
				return false;
			}
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
			let newUser: boolean = false;
			const val = this.users.get(data.userLogin);
			if (!val) {
				this.users.set(data.userLogin, [client.id]);
				this.logger.verbose(`Client add ${data.userLogin}: ${client.id}`);
				newUser = true;
			}
			else if (val.indexOf(client.id) === -1) {
				val.push(client.id);
				this.logger.log(`Client add ${data.userLogin}: ${client.id}`);
			}
			const infos: JwtContent = {
				user: user,
				isTwoFactorAuthenticationEnabled: data.isTwoFactorAuthenticationEnabled,
				isTwoFactorAuthenticated: data.isTwoFactorAuthenticated,
				newUser
			};
			if (process.env.TTL_REGENERATE && data.iat + parseInt(process.env.TTL_REGENERATE) < Date.now() / 1000) {
				/*console.log('deb', data.iat)
				console.log('dec', parseInt(process.env.TTL_REGENERATE))
				console.log('ref', data.iat + parseInt(process.env.TTL_REGENERATE))
				console.log('now', Date.now() / 1000)
				console.log('fin', data.exp)*/
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
			const login: string | undefined = this.getUser(client);
			if (login !== undefined) {
				const ids = this.users.get(login);
				if (!ids)
					return false;
				const i = ids.indexOf(client.id);
				if (i !== -1)
					ids.splice(i, 1);
				if (ids.length === 0) {
					this.users.delete(login);
					await this.sendProfileToAllFriends(login);
				}
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
		if (!auth) {
			client.emit('client_rm_token', true);
			return false;
		}
		if (auth.newUser) {
			const friends = await this.friendGateway.getFriends(auth.user);
			if (typeof friends !== 'string') {
				for (const friend of friends) {
					const sock = this.users.get(friend.login);
					if (sock !== undefined) {
						const friendUser: User = {
							id: friend.id,
							login: friend.login,
							urlImg: friend.urlImg,
							wallet: friend.wallet,
							email: friend.email,
							ball: friend.ball,
							color: friend.color,
							isTwoFactorAuthenticationEnabled: friend.isTwoFactorAuthenticationEnabled,
							userIdIsBlock: [],
							users1Friend: [],
							users2Friend: [],
							userWhoBlock: [],
							messageFrom: [],
							messageTo: [],
							channelsRel: [],
							gamesPlayer1: [],
							gamesPlayer2: []
						};
						const tmpProfil = await this.getProfilWithFriends(friendUser);
						if (typeof tmpProfil !== 'string')
							this.server.to(sock).emit('client_profil', tmpProfil)
					}
				}
			}
		}
		return auth;
	}

	async sendProfilOfUser(user: User) {
		const sock = this.users.get(user.login);
		if (sock) {
			const ret = await this.getProfilWithFriends(user);
			if (typeof ret !== 'string')
				this.server.to(sock).emit('client_profil', ret);
		}
	}

	async sendLeaderboard() {
		const ret = await this.generalGateway.getLeaderboard();
		if (typeof ret !== 'string')
			this.server.emit('client_leaderboard', ret);
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
			client.emit('error_client', `${ret}`);
			return ;
		}
		client.emit('client_profil', ret);
	}

	@SubscribeMessage('server_profil_login')
	async getProfilLogin(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.generalGateway.getProfilLogin(login);
		if (typeof ret === 'string') {
			client.emit('error_client', 'profil_login' + ret);
			return ;
		}
		client.emit('client_profil_login', ret);
	}

	@SubscribeMessage('server_change_username')
	async changeLogin(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('username') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const socks = this.users.get(auth.user.login);
		const ret = await this.generalGateway.changeLogin(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		if (socks)
			this.users.set(login, socks);
		this.sendProfilOfUser(auth.user);
		this.users.delete(auth.user.login);
		if (socks) {
			try {
				this.server.to(socks).emit('client_jwt', (jwt = await this.jwtService.signAsync({
					userId: auth.user.id,
					userLogin: login,
					userEmail: auth.user.email,
					isTwoFactorAuthenticationEnabled: auth.isTwoFactorAuthenticationEnabled,
					isTwoFactorAuthenticated: auth.isTwoFactorAuthenticated,
				})));
			} catch (error) {}
		}
	}

	@SubscribeMessage('server_leaderboard')
	async getLeaderboard(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.generalGateway.getLeaderboard();
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		this.server.emit('client_leaderboard', ret);
	}

	/**
	 * Socket route friends
	 */

	@SubscribeMessage('server_demand_friend')
	async demandFriend(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.friendGateway.demandFriend(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
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
		if (reply.user) {
			const test = isNotifChoice(reply);
			if (typeof test === 'string') {
				client.emit('error_client', test);
				return ;
			}
			const ret = await this.friendGateway.replyNotif(auth.user, reply);
			if (typeof ret === 'string') {
				client.emit('error_client', ret);
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
		} else if (reply.channel) {
			const ret = await this.chatGateway.replyNotif(auth.user, reply);
			if (typeof ret === 'string') {
				client.emit('error_client', ret);
				return ;
			}
			const users = await this.chatGateway.getChanUsers(auth.user, ret.channel.name);
			const mySock = this.users.get(auth.user.login);
			// global reply
			if (typeof users !== 'string') {
				let sock: string[] = [];
				for (const tmp of users.users) {
					if (tmp.id !== auth.user.id) {
						const tmp2 = this.users.get(tmp.login);
						if (tmp2)
							sock = [...sock, ...tmp2];
					}
				}
				if(ret.status) {
					this.server.to(sock).emit('client_chan_users', users);
					this.server.to(sock).emit('info_client', `User with login ${auth.user.login} join the channel ${reply.channel.name}`);
				}
				else
					this.server.to(sock).emit('warning_client', `User with login ${auth.user.login} refuse refuse to join the channel ${reply.channel.name}`);
			}
			if (mySock && ret.status) {
				this.server.to(mySock).emit('info_client', `You join the channel ${reply.channel.name}`);
				const channelsIn = await this.chatGateway.getChannelsIn(auth.user);
				if (typeof channelsIn !== 'string')
					this.server.to(mySock).emit('client_channels_in', channelsIn);
				this.server.to(mySock).emit('client_chan_users', users);
			}
			if (mySock) {
				const profil = await this.getProfilWithFriends(auth.user);
				if (typeof profil !== 'string')
					this.server.to(mySock).emit('client_profil', profil);
			}
		} else
			client.emit('error_client', 'reply bad format');
	}

	@SubscribeMessage('server_block_somebody')
	async blockSomebody(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.friendGateway.blockSomebody(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
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
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.friendGateway.unblockSomebody(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
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
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.chatGateway.getPrivmsg(auth.user, login);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
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
			client.emit('error_client', ret);
			return ;
		}
		client.emit('client_privmsg_users', ret);
	}

	@SubscribeMessage('server_privmsg_send')
	async getPrivmsgSend(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('login') login: string, @MessageBody('msg') msg: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isLogin(login);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const testMsg = isMessage(msg);
		if (typeof testMsg === 'string') {
			client.emit('error_client', testMsg);
			return ;
		}
		const ret = await this.chatGateway.getPrivmsgSend(auth.user, login, msg);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		const user = this.users.get(ret.userTo.login);
		const actu = await this.chatGateway.getPrivmsg(auth.user, login);
		if (user) {
			if (typeof actu !== 'string')
			this.server.to(user).emit('client_privmsg', actu);
			try {
				const tmpUser = await this.userService.findLogin(login);
				if (tmpUser) {
					const privUser = await this.chatGateway.getPrivmsgUsers(tmpUser);
					if (typeof privUser !== 'string')
						this.server.to(user).emit('client_privmsg_users', privUser);
				}
			} catch (error) {}
			this.server.to(user).emit('info_client', `User with login ${auth.user.login} send you a private message`);
		}
			const actuUser = this.users.get(auth.user.login);
			if (actuUser) {
				const privUser = await this.chatGateway.getPrivmsgUsers(auth.user);
				if (typeof privUser !== 'string')
					this.server.to(actuUser).emit('client_privmsg_users', privUser);
				if (typeof actu !== 'string') {
					this.server.to(actuUser).emit('client_privmsg', actu);
			}
		}
	}

	@SubscribeMessage('server_users')
	async getUsers(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getUsers(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
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
		const test = isChanName(chanName);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.chatGateway.getChanmsg(auth.user, chanName);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('client_chanmsg', ret);
	}

	@SubscribeMessage('server_chan_users')
	async getChanUsers(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isChanName(chanName);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.chatGateway.getChanUsers(auth.user, chanName);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('client_chan_users', ret);
	}

	@SubscribeMessage('server_channels_in')
	async getChannelsIn(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const ret = await this.chatGateway.getChannelsIn(auth.user);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('client_channels_in', ret);
	}

	@SubscribeMessage('server_chanmsg_send')
	async chanmsgSend(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('msg') msg: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isChanName(chanName);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const testMsg = isMessage(msg);
		if (typeof testMsg === 'string') {
			client.emit('error_client', testMsg);
			return ;
		}
		const ret = await this.chatGateway.chanmsgSend(auth.user, chanName, msg);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		const users = await this.chatGateway.getChanUsers(auth.user, chanName);
		const actu = await this.chatGateway.getChanmsg(auth.user, chanName);
		if (typeof users !== 'string') {
			let sock: string[] = [];
			for (const tmp of users.users) {
				const tmp2 = this.users.get(tmp.login);
				if (tmp2)
					sock = [...sock, ...tmp2];
			}
			this.server.to(sock).emit('info_client', `Channel ${chanName} received a message`);
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
			client.emit('error_client', ret);
			return ;
		}
		client.emit('client_channels', ret);
	}

	@SubscribeMessage('server_chan_join')
	async joinChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('password') password?: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const test = isChanName(chanName);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const testPass = isPassword(password);
		if (typeof testPass === 'string') {
			client.emit('error_client', testPass);
			return ;
		}
		const ret = await this.chatGateway.joinChannel(auth.user, chanName, password);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		const users = await this.chatGateway.getChanUsers(auth.user, chanName);
		if (typeof users !== 'string') {
			let sock: string[] = [];
			for (const tmp of users.users) {
				const tmp2 = this.users.get(tmp.login);
				if (tmp2)
					sock = [...sock, ...tmp2];
			}
			this.server.to(sock).emit('info_client', `Channel ${chanName} have a new member ${auth.user.login}`);
			this.server.to(sock).emit('client_chan_users', users);
		}
		const sock = this.users.get(auth.user.login);
		if (sock) {
			const back = await this.chatGateway.getChannelsIn(auth.user);
			if (typeof back !== 'string')
				this.server.to(sock).emit('client_channels_in', back);
		}
	}

	@SubscribeMessage('server_chanmsg_invite')
	async inviteChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginInvite') loginInvite: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const test = isLogin(loginInvite);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.chatGateway.inviteChannel(auth.user, chanName, loginInvite);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		const sock = this.users.get(loginInvite);
		const userToInvite = await this.userService.findLogin(loginInvite);
		if (sock && userToInvite !== null) {
			const profil = await this.getProfilWithFriends(userToInvite);
			if (typeof profil !== 'string'){
				this.server.to(sock).emit('client_profil', profil);
				this.server.to(sock).emit('info_client', `Invitation to join channel ${chanName}`);
			}
		}
		client.emit('info_client', `Channel ${chanName} you invite user with login ${loginInvite}`);
	}

	@SubscribeMessage('server_chan_create')
	async createChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chan') chan: GOT.Channel) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChannel = isChannel(chan);
		if (typeof testChannel === 'string') {
			client.emit('error_client', testChannel);
			return ;
		}
		const ret = await this.chatGateway.createChannel(auth.user, chan);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('info_client', `Channel ${chan.name} created`);
		for (const us of this.users) {
			if (us[0] === auth.user.login) {
				const tmp = await this.chatGateway.getChannelsIn(auth.user);
				if (typeof tmp !== 'string')
					this.server.to(us[1]).emit('client_channels_in', tmp);
				const tmp2 = await this.chatGateway.getChannels(auth.user);
				if (typeof tmp2 !== 'string')
					this.server.to(us[1]).emit('client_channels', tmp2);
			} else {
				const tmpUser = await this.userService.findLogin(us[0]);
				if (tmpUser !== null) {
					const tmp2 = await this.chatGateway.getChannels(tmpUser);
					if (typeof tmp2 !== 'string')
						this.server.to(us[1]).emit('client_channels', tmp2);
				}
			}
		}
	}

	@SubscribeMessage('server_chan_ban_somebody')
	async chanBlock(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginToBan') loginToBan: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const test = isLogin(loginToBan);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.chatGateway.chanBlock(auth.user, chanName, loginToBan);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		const usersOfChannel = await this.chatGateway.getChanUsers(auth.user, chanName);
		if (typeof usersOfChannel !== 'string') {
			let socks: string[] = [];
			for (const userOfChannel of usersOfChannel.users) {
				const sock = this.users.get(userOfChannel.login);
				if (auth.user.login === userOfChannel.login) {
						if (sock)
							this.server.to(sock).emit('client_chan_users', usersOfChannel);
						client.emit('info_client', `You ban from channel ${chanName} user with login ${loginToBan}`);
				} else {
					if (userOfChannel.login === loginToBan && sock) {
						this.server.to(sock).emit('info_client', `You're ban from the channel ${chanName}`);
						this.server.to(sock).emit('client_chan_users', usersOfChannel);
					}
					else if (sock)
						socks = [...socks, ...sock];
				}
			}
			this.server.to(socks).emit('info_client', `User with login ${loginToBan} is now ban from channel ${chanName}`);
			this.server.to(socks).emit('client_chan_users', usersOfChannel);
			const sock = this.users.get(loginToBan);
			const userToBan = await this.userService.findLogin(loginToBan);
			if (sock && userToBan !== null) {
				const chans = await this.chatGateway.getChannels(userToBan);
				if (typeof chans !== 'string')
					this.server.to(sock).emit('client_channels', chans);
			}
		}
	}

	@SubscribeMessage('server_chan_unban_somebody')
	async chanUnblock(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginToUnban') loginToUnban: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const test = isLogin(loginToUnban);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const ret = await this.chatGateway.chanUnblock(auth.user, chanName, loginToUnban);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		const usersOfChannel = await this.chatGateway.getChanUsers(auth.user, chanName);
		if (typeof usersOfChannel !== 'string') {
			let socks: string[] = [];
			for (const userOfChannel of usersOfChannel.users) {
				const sock = this.users.get(userOfChannel.login);
				if (auth.user.login === userOfChannel.login) {
						if (sock)
							this.server.to(sock).emit('client_chan_users', usersOfChannel);
						client.emit('info_client', `You unban from channel ${chanName} user with login ${loginToUnban}`);
				} else {
					if (userOfChannel.login === loginToUnban && sock) {
						this.server.to(sock).emit('info_client', `You're unban from the channel ${chanName}`);
						this.server.to(sock).emit('client_chan_users', usersOfChannel);
					}
					else if (sock)
						socks = [...socks, ...sock];
				}
			}
			this.server.to(socks).emit('client_chan_users', usersOfChannel);
		}
		const sock = this.users.get(loginToUnban);
		const userToUnban = await this.userService.findLogin(loginToUnban);
		if (sock && userToUnban !== null) {
			const inChan = await this.chatGateway.getChannelsIn(userToUnban);
			if (typeof inChan !== 'string')
				this.server.to(sock).emit('client_channels_in', inChan);
			const chans = await this.chatGateway.getChannels(userToUnban);
			if (typeof chans !== 'string')
				this.server.to(sock).emit('client_channels', chans);
		}
	}

	@SubscribeMessage('server_chan_leave')
	async leaveChan(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginWhoLeave') loginWhoLeave: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const test = isLogin(loginWhoLeave);
		if (typeof test === 'string') {
			client.emit('error_client', test);
			return ;
		}
		const usersOfChannelBegin = await this.chatGateway.getChanUsers(auth.user, chanName);
		const ret = await this.chatGateway.leaveChan(auth.user, chanName, loginWhoLeave);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		if (ret === true) {
			let socks: string[] = [];
			for (const us of this.users) {
				socks = [...socks, ...us[1]];
				const tmpUser = await this.userService.findLogin(us[0]);
				if (tmpUser !== null) {
					const tmp = await this.chatGateway.getChannelsIn(tmpUser);
					if (typeof tmp !== 'string')
						this.server.to(us[1]).emit('client_channels_in', tmp);
					const tmp2 = await this.chatGateway.getChannels(tmpUser);
					if (typeof tmp2 !== 'string')
						this.server.to(us[1]).emit('client_channels', tmp2);
				}
			}
			this.server.to(socks).emit('warning_client', `Channel ${chanName} destroyed because owner gone`);
		} else {
			if (typeof usersOfChannelBegin !== 'string') {
				let socks: string[] = [];
				let usersOfChannel: GOT.ChannelUsers = {
					channel: usersOfChannelBegin.channel,
					users: []
				};
				for (const userOfChannel of usersOfChannelBegin.users) {
					if (userOfChannel.login !== loginWhoLeave) {
						const sock = this.users.get(userOfChannel.login);
						if (sock)
							socks = [...socks, ...sock];
						usersOfChannel.users.push(userOfChannel);
					}
				}
				this.server.to(socks).emit('client_chan_users', usersOfChannel);
			}
			const sock = this.users.get(loginWhoLeave);
			if (sock) {
				const tmpUser = await this.userService.findLogin(loginWhoLeave);
				if (tmpUser) {
					const tmp = await this.chatGateway.getChannelsIn(tmpUser);
					if (typeof tmp !== 'string')
						this.server.to(sock).emit('client_channels_in', tmp);
				}
			}
		}
	}

	@SubscribeMessage('server_chan_edit_status')
	async changeStatusChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chan') chan: GOT.Channel) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChannel = isChannel(chan);
		if (typeof testChannel === 'string') {
			client.emit('error_client', testChannel);
			return ;
		}
		const ret = await this.chatGateway.changeStatusChannel(auth.user, chan);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('info_client', `Channel ${chan.name} edit`);
		// actu
		for (const tmp of this.users) {
			if (tmp[0] === auth.user.login) {
				const channelsIn = await this.chatGateway.getChannelsIn(auth.user);
				const channels = await this.chatGateway.getChannels(auth.user);
				this.server.to(tmp[1]).emit('client_channels_in', channelsIn);
				this.server.to(tmp[1]).emit('client_channels', channels);
			} else {
				const userToSend = await this.userService.findLogin(tmp[0]);
				if (userToSend !== null) {
					const channelsIn = await this.chatGateway.getChannelsIn(userToSend);
					const channels = await this.chatGateway.getChannels(userToSend);
					this.server.to(tmp[1]).emit('client_channels_in', channelsIn);
					this.server.to(tmp[1]).emit('client_channels', channels);
				}
			}
		}
	}

	@SubscribeMessage('server_chan_edit_password')
	async changePasswordChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('password') password: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const testPass = isPassword(password);
		if (typeof testPass === 'string') {
			client.emit('error_client', testPass);
			return ;
		}
		const ret = await this.chatGateway.changePasswordChannel(auth.user, chanName, password);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('info_client', `Channel ${chanName} edit`);
	}

	@SubscribeMessage('server_chan_edit_name')
	async changeNameChannel(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('newChanName') newChanName: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const testChanName2 = isChanName(newChanName);
		if (typeof testChanName2 === 'string') {
			client.emit('error_client', testChanName2);
			return ;
		}
		const ret = await this.chatGateway.changeNameChannel(auth.user, chanName, newChanName);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('info_client', `Channel ${newChanName} edit`);
		// actu
		for (const tmp of this.users) {
			if (tmp[0] === auth.user.login) {
				const channelsIn = await this.chatGateway.getChannelsIn(auth.user);
				const channels = await this.chatGateway.getChannels(auth.user);
				this.server.to(tmp[1]).emit('client_channels_in', channelsIn);
				this.server.to(tmp[1]).emit('client_channels', channels);
			} else {
				const userToSend = await this.userService.findLogin(tmp[0]);
				if (userToSend !== null) {
					const channelsIn = await this.chatGateway.getChannelsIn(userToSend);
					const channels = await this.chatGateway.getChannels(userToSend);
					this.server.to(tmp[1]).emit('client_channels_in', channelsIn);
					this.server.to(tmp[1]).emit('client_channels', channels);
				}
			}
		}
	}

	@SubscribeMessage('server_chan_pass_admin')
	async chanPassAdmin(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginToPassAdmin') loginToPassAdmin: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const testLogin = isLogin(loginToPassAdmin);
		if (typeof testLogin === 'string') {
			client.emit('error_client', testLogin);
			return ;
		}
		const ret = await this.chatGateway.chanPassAdmin(auth.user, chanName, loginToPassAdmin);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('info_client', `Channel ${chanName}: ${loginToPassAdmin} is now admin`);
		// actu
		const users = await this.chatGateway.getChanUsers(auth.user, chanName);
		if (typeof users !== 'string') {
			for (const tmp of users.users) {
				const sock = this.users.get(tmp.login);
				if (sock)
					this.server.to(sock).emit('client_chan_users', users);
			}
		}
	}

	@SubscribeMessage('server_chan_pass_member')
	async chanPassMember(@ConnectedSocket() client: Socket, @MessageBody('Authorization') jwt: string, @MessageBody('chanName') chanName: string, @MessageBody('loginToPassMember') loginToPassMember: string) {
		const auth = await this.connectionSecure(client, jwt);
		if (!auth)
			return ;
		const testChanName = isChanName(chanName);
		if (typeof testChanName === 'string') {
			client.emit('error_client', testChanName);
			return ;
		}
		const testLogin = isLogin(loginToPassMember);
		if (typeof testLogin === 'string') {
			client.emit('error_client', testLogin);
			return ;
		}
		const ret = await this.chatGateway.chanPassMember(auth.user, chanName, loginToPassMember);
		if (typeof ret === 'string') {
			client.emit('error_client', ret);
			return ;
		}
		client.emit('info_client', `Channel ${chanName}: ${loginToPassMember} is now member`);
		// actu
		const users = await this.chatGateway.getChanUsers(auth.user, chanName);
		if (typeof users !== 'string') {
			for (const tmp of users.users) {
				const sock = this.users.get(tmp.login);
				if (sock)
					this.server.to(sock).emit('client_chan_users', users);
			}
		}
	}



	/**
	 * Socket init
	 */

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		let status = true;
		for (const [login, ids] of this.users) {
			const i = ids.indexOf(client.id);
			if (i > -1) {
				ids.splice(i, 1);
				if (ids.length === 0) {
					this.users.delete(login);
					try {
						const user = await this.userService.findLogin(login);
						if (user) {
							const friends = await this.friendGateway.getFriends(user);
							if (typeof friends !== 'string') {
								for (const friend of friends) {
									const sock = this.users.get(friend.login);
									if (sock !== undefined) {
										const friendUser: User = {
											id: friend.id,
											login: friend.login,
											urlImg: friend.urlImg,
											wallet: friend.wallet,
											email: friend.email,
											ball: friend.ball,
											color: friend.color,
											isTwoFactorAuthenticationEnabled: friend.isTwoFactorAuthenticationEnabled,
											userIdIsBlock: [],
											users1Friend: [],
											users2Friend: [],
											userWhoBlock: [],
											messageFrom: [],
											messageTo: [],
											channelsRel: [],
											gamesPlayer1: [],
											gamesPlayer2: []
										};
										const tmpProfil = await this.getProfilWithFriends(friendUser);
										if (typeof tmpProfil !== 'string')
											this.server.to(sock).emit('client_profil', tmpProfil)
									}
								}
							}
						}
					} catch (error) {}
				}
				this.logger.verbose(`Client disconnected ${login}: ${client.id}`);
				status = false;
				return ;
			}
		};
		if (status)
			this.logger.verbose(`Client disconnected anonymous: ${client.id}`);
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
