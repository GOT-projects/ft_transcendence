import { Injectable } from "@nestjs/common";
import { channel } from "diagnostics_channel";
import { GOT } from "shared/types";
import { Channel } from "src/database/entities/channel.entity";
import { Message } from "src/database/entities/message.entity";
import { RelUserChannel, UserChannelStatus } from "src/database/entities/rel_user_channel.entity";
import { User } from "src/database/entities/user.entity";
import { ChannelService } from "src/database/services/channel.service";
import { RelDemandService } from "src/database/services/demand.service";
import { GameService } from "src/database/services/game.service";
import { MessageService } from "src/database/services/message.service";
import { UserService } from "src/database/services/user.service";
import { RelUserChannelService } from "src/database/services/user_channel.service";
import { GeneralGateway } from "./general.gateway";

@Injectable()
export class ChatGateway {
	constructor(
		private readonly userService: UserService,
		private readonly generalGateway: GeneralGateway,
		private readonly messageService: MessageService,
		private readonly channelService: ChannelService,
		private readonly gameService: GameService,
		private readonly demandService: RelDemandService,
		private readonly relUserChannelService: RelUserChannelService,
	) {}

	messageToGOTPriv(msg: Message): GOT.msg | false {
		if (msg.userTo === undefined || msg.userFrom === undefined)
			return false;
		return {
			userFrom: this.generalGateway.getGOTUserFromUser(msg.userFrom),
			userTo: this.generalGateway.getGOTUserFromUser(msg.userTo),
			msg: msg.message
		};
	}

	GOTChannel(channel: Channel): GOT.Channel {
		return {
			id: channel.id,
			name: channel.name,
			status: channel.status
		}
	}

	messageToGOTMsgChannel(msg: Message): GOT.MsgChannel | false {
		if (msg.channelTo === undefined || msg.userFrom === undefined)
			return false;
		return {
			userFrom: this.generalGateway.getGOTUserFromUser(msg.userFrom),
			channel: this.GOTChannel(msg.channelTo),
			msg: msg.message
		};
	}

	/**
	 * Privmsg
	 */

	async getPrivmsg(user: User, login: string): Promise<GOT.msg[] | string> {
		try {
			const userTo = await this.userService.findLogin(login);
			if (userTo === null)
				return `User ${login} not found`
			const msgs = await this.messageService.getPrivmsg(user, userTo);
			let ret: GOT.msg[] = [];
			for (const msg of msgs) {
				const tmp = this.messageToGOTPriv(msg);
				if (tmp !== false)
					ret.push(tmp);
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async getPrivmsgUsers(user: User): Promise<GOT.User[] | string> {
		try {
			const msgs = await this.messageService.getPrivmsgUsers(user);
			let ret: GOT.User[] = [];
			for (const msg of msgs) {
				if (msg.userFrom.id !== user.id) {
					if (msg.userTo !== undefined)
						ret.push(this.generalGateway.getGOTUserFromUser(msg.userTo));
				} else {
					ret.push(this.generalGateway.getGOTUserFromUser(msg.userFrom));
				}
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async getPrivmsgSend(user: User, login: string, msg: string): Promise<string | GOT.msg> {
		try {
			const userTo = await this.userService.findLogin(login);
			if (userTo === null)
				return `User ${login} not found`
			const tmp = await this.messageService.getPrivmsgSend(user, userTo, msg);
			const ret = this.messageToGOTPriv(tmp);
			if (ret === false)
				return 'Error user transformation'
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async getUsers(user: User): Promise<GOT.User[] | string> {
		try {
			const allUsers = await this.userService.findAll();
			let ret: GOT.User[] = [];
			for (const tmp of allUsers) {
				ret.push(this.generalGateway.getGOTUserFromUser(tmp));
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	/// Channels

	async getChanmsg(user: User, chanName: string): Promise<GOT.MsgChannel[] | string> {
		try {
			const channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel ${chanName} not found`;
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 0)
				return `You're not in the channel ${chanName}`;
			if (rels[0].status === UserChannelStatus.BAN)
				return `You can't get messages of channel ${chanName} because BAN`;
			const msgs = await this.messageService.getChanmsg(user, channel);
			let ret: GOT.MsgChannel[] = [];
			for (const msg of msgs) {
				const tmp = this.messageToGOTMsgChannel(msg);
				if (tmp !== false)
					ret.push(tmp);
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async getChannelsIn(user: User): Promise<GOT.Channel[] | string> {
		try {
			const channels = await this.relUserChannelService.getChannelInNOTBan(user);
			let ret: GOT.Channel[] = [];
			for (const channel of channels) {
				ret.push(this.GOTChannel(channel));
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async chanmsgSend(user: User, chanName: string, msg: string): Promise<GOT.MsgChannel | string> {
		try {
			const channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel ${chanName} not found`;
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 0)
				return `You're not in the channel ${chanName}`;
			if (rels[0].status === UserChannelStatus.BAN)
				return `You can't send messages on channel ${chanName} because BAN`;
			const newMessage = await this.messageService.create({
				userIdFrom: user.id,
				userIdTo: null,
				channelIdTo: channel.id,
				message: msg
			});
			return {
				userFrom: this.generalGateway.getGOTUserFromUser(user),
				channel: this.GOTChannel(channel),
				msg: newMessage.message
			}
		} catch (error) {
			return error.message;
		}
	}

	async getChannels(user: User): Promise<GOT.Channel[] | string> {
		try {
			const channels = await this.channelService.getVisibleChannel(user);
			let ret: GOT.Channel[] = [];
			for (const channel of channels) {
				ret.push(this.GOTChannel(channel));
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async joinChannel(user: User, chanName: string, password?: string): Promise<RelUserChannel | string> {
		try {
			const channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel ${chanName} not found`;
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length !== 0 && rels[0].status === UserChannelStatus.BAN)
				return `You can't join channel ${chanName} because BAN`;
			if (rels.length === 1)
				return 'You already are in the channel'
			const alreadyDemand = await this.demandService.getChannel(user, channel);
			if (alreadyDemand.length === 1) {
				await this.demandService.delete(alreadyDemand[0].id);
				return await this.relUserChannelService.create({
					userId: user.id,
					channelId: channel.id,
					status: UserChannelStatus.MEMBER
				});
			}
			if (channel.status === GOT.ChannelStatus.PUBLIC || 
				(channel.status === GOT.ChannelStatus.PROTECTED && password === channel.password)) {
				return await this.relUserChannelService.create({
					userId: user.id,
					channelId: channel.id,
					status: UserChannelStatus.MEMBER
				});
			}
			return 'Bad password or private channel';
		} catch (error) {
			return error.message;
		}
	}

	async inviteChannel(user: User, chanName: string, loginInvite: string) {
		try {
			const channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel ${chanName} not found`;
			const userInvite = await this.userService.findLogin(loginInvite);
			if (!userInvite)
				return `User with login ${loginInvite} not found`;
			const relUser = await this.relUserChannelService.getChannelRel(user, channel);
			// Pas le droit d'inviter
			if (relUser.length === 0 || (relUser[0].status === UserChannelStatus.BAN))
				return `You have not rights to invite people on channel ${chanName}`;
			const relUserInvite = await this.relUserChannelService.getChannelRel(userInvite, channel);
			// Déjà dans le channel
			if (relUserInvite.length === 1 && relUserInvite[0].status !== UserChannelStatus.BAN)
				return `User with login ${loginInvite} already in channel ${chanName}`;
			const alreadyDemand = await this.demandService.getChannel(userInvite, channel);
			if (alreadyDemand.length === 1)
				return `User with login ${loginInvite} already invite in channel ${chanName}`;
			await this.demandService.create({
				userIdDemand: userInvite.id,
				channelIdWhoDemand: channel.id,
				userIdWhoDemand: null
			});
			return userInvite;
		} catch (error) {
			return error.message;
		}
	}

	async createChannel(user: User, chan: GOT.Channel) {
		try {
			let channel = await this.channelService.findChanName(chan.name);
			if (!channel)
				return `Channel ${chan.name} already exist`;
			channel = await this.channelService.create({
				name: chan.name,
				status: chan.status,
				password: chan.password
			});
			await this.relUserChannelService.create({
				userId: user.id,
				channelId: channel.id,
				status: UserChannelStatus.OWNER
			});
		} catch (error) {
			return error.message;
		}
	}
}