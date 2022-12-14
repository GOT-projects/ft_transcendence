import { Injectable } from "@nestjs/common";
import { GOT } from "shared/types";
import { Channel } from "src/database/entities/channel.entity";
import { Message } from "src/database/entities/message.entity";
import { RelUserChannel } from "src/database/entities/rel_user_channel.entity";
import { User } from "src/database/entities/user.entity";
import { BlockService } from "src/database/services/block.service";
import { ChannelService } from "src/database/services/channel.service";
import { RelDemandService } from "src/database/services/demand.service";
import { GameService } from "src/database/services/game.service";
import { MessageService } from "src/database/services/message.service";
import { UserService } from "src/database/services/user.service";
import { RelUserChannelService } from "src/database/services/user_channel.service";
import { MyTransform } from "src/utils/transform";
import { UpdateResult } from "typeorm";
import { GeneralGateway } from "./general.gateway";

export interface ChannelAndStatus {
	channel: Channel;
	status: boolean
}

@Injectable()
export class ChatGateway {
	constructor(
		private readonly userService: UserService,
		private readonly generalGateway: GeneralGateway,
		private readonly messageService: MessageService,
		private readonly channelService: ChannelService,
		private readonly demandService: RelDemandService,
		private readonly relUserChannelService: RelUserChannelService,
		private readonly blockService: BlockService,
	) {}

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
				const tmp = MyTransform.privmsgEntityToGotNoId(msg);
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
					let status = true;
					for (const tmp of ret) {
						if (tmp.id === msg.userFrom.id)
							status = false;
					}
					if (status)
						ret.push(this.generalGateway.getGOTUserFromUser(msg.userFrom));
				} else {
					if (msg.userTo !== undefined) {
						let status = true;
						for (const tmp of ret) {
							if (tmp.id === msg.userTo.id)
								status = false;
						}
						if (status)
							ret.push(this.generalGateway.getGOTUserFromUser(msg.userTo));
					}
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
			const block = await this.blockService.getBlock(userTo, user);
			if (block.length === 1)
				return `Message not send, you're block`;
			const ret = await MyTransform.privmsgEntityToGot(tmp, this.userService);
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
			if (rels[0].status === GOT.UserChannelStatus.BAN)
				return `You can't get messages of channel ${chanName} because BAN`;
			const msgs = await this.messageService.getChanmsg(user, channel);
			let ret: GOT.MsgChannel[] = [];
			for (const msg of msgs) {
				const tmp = MyTransform.chanmsgEntityToGotNoId(msg);
				if (tmp !== false)
					ret.push(tmp);
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async getChanUsers(user: User, chanName: string): Promise<GOT.ChannelUsers | string> {
		try {
			const channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel ${chanName} not found`;
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 0)
				return `You're not in the channel ${chanName}`;
			if (rels[0].status === GOT.UserChannelStatus.BAN)
				return `You can't get messages of channel ${chanName} because BAN`;
			const allRels = await this.relUserChannelService.getChanUsersNotBan(user, channel);
			let ret: GOT.ChannelUsers = {
				users: [],
				channel: channel
			};
			for (const rel of allRels) {
				const tmp = this.generalGateway.getGOTUserFromUser(rel.user);
				ret.users.push({
					...tmp,
					status: rel.status
				});
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
				ret.push(MyTransform.channelEntityToGot(channel));
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
			if (rels[0].status === GOT.UserChannelStatus.BAN)
				return `You can't send messages on channel ${chanName} because BAN`;
			const newMessage = await this.messageService.create({
				userIdFrom: user.id,
				userIdTo: null,
				channelIdTo: channel.id,
				message: msg
			});
			return {
				userFrom: this.generalGateway.getGOTUserFromUser(user),
				channel: MyTransform.channelEntityToGot(channel),
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
				ret.push(MyTransform.channelEntityToGot(channel));
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
			if (rels.length !== 0 && rels[0].status === GOT.UserChannelStatus.BAN)
				return `You can't join channel ${chanName} because BAN`;
			if (rels.length === 1)
				return 'You already are in the channel'
			const alreadyDemand = await this.demandService.getChannel(user, channel);
			if (alreadyDemand.length === 1) {
				await this.demandService.delete(alreadyDemand[0].id);
				return await this.relUserChannelService.create({
					userId: user.id,
					channelId: channel.id,
					status: GOT.UserChannelStatus.MEMBER
				});
			}
			if (channel.status === GOT.ChannelStatus.PUBLIC || 
				(channel.status === GOT.ChannelStatus.PROTECTED && password === channel.password)) {
				return await this.relUserChannelService.create({
					userId: user.id,
					channelId: channel.id,
					status: GOT.UserChannelStatus.MEMBER
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
			if (relUser.length === 0 || (relUser[0].status === GOT.UserChannelStatus.BAN))
				return `You have not rights to invite people on channel ${chanName}`;
			const relUserInvite = await this.relUserChannelService.getChannelRel(userInvite, channel);
			// Déjà dans le channel
			if (relUserInvite.length === 1 && relUserInvite[0].status !== GOT.UserChannelStatus.BAN)
				return `User with login ${loginInvite} already in channel ${chanName}`;
			if (relUserInvite.length === 1 && relUserInvite[0].status === GOT.UserChannelStatus.BAN && relUser[0].status !== GOT.UserChannelStatus.MEMBER)
				return `You can't invite user in channel because the user with login ${loginInvite} is ban of the channel ${chanName}`;
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
			if (channel)
				return `Channel ${chan.name} already exist`;
			if (chan.status === GOT.ChannelStatus.PUBLIC) {
				if (chan.password !== undefined)
					return 'No password need when the channel is PUBLIC';
			} else if (chan.status === GOT.ChannelStatus.PROTECTED) {
				if (chan.password === undefined)
					return 'Password need when the channel is PROTECTED';
			} else {
				if (chan.status !== GOT.ChannelStatus.PRIVATE)
					return `The channel status send is unknow - ${chan.status}`;
				else if (chan.password !== undefined)
					return 'No password need when the channel is PRIVATE';
			}
			channel = await this.channelService.create({
				name: chan.name,
				status: chan.status,
				password: ((chan.status === GOT.ChannelStatus.PROTECTED) ? chan.password : undefined)
			});
			await this.relUserChannelService.create({
				userId: user.id,
				channelId: channel.id,
				status: GOT.UserChannelStatus.OWNER
			});
			
		} catch (error) {
			return error.message;
		}
	}

	async replyNotif(user: User, reply: GOT.NotifChoice): Promise<string | ChannelAndStatus> {
		try {
			if (!reply.channel)
				return 'channel not defined';
			const channelReply = await this.channelService.findChanName(reply.channel.name);
			if (channelReply === null)
				return 'channel not found';
			const demands = await this.demandService.getChannel(user, channelReply);
			if (demands.length === 1) {
				await this.demandService.delete(demands[0].id);
				if (reply.accept) {
					await this.relUserChannelService.create({
						userId: user.id,
						channelId: channelReply.id,
						status: GOT.UserChannelStatus.MEMBER
					});
					return {channel: channelReply, status: true};
				}
			} else {
				return "You're reply is refused";
			}
			return {channel: channelReply, status: false};
		} catch (error) {
			return error.message;
		}
	}

	async chanBlock(user:User, chanName: string, loginToBlock: string): Promise<UpdateResult | RelUserChannel | string> {
		try {
			if (user.login === loginToBlock)
				return `You can ban you`;
			const channel = await this.channelService.findChanName(chanName);
			if (channel === null)
				return 'Channel not found';
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 0)
				return `You can ban anybody in channel ${channel.name}, you're not in`;
			if (rels[0].status === GOT.UserChannelStatus.BAN)
				return `You can ban anybody in channel ${channel.name}, you're ban`;
			if (rels[0].status === GOT.UserChannelStatus.MEMBER)
				return `You can ban anybody in channel ${channel.name}, LOW level access`;
			const userToBlock = await this.userService.findLogin(loginToBlock);
			if (userToBlock === null)
				return 'User not found';
			const relTochange = await this.relUserChannelService.getChannelRel(userToBlock, channel);
			if (relTochange.length === 1) {
				if (rels[0].status === GOT.UserChannelStatus.ADMIN && relTochange[0].status === GOT.UserChannelStatus.OWNER)
					return `You can ban owner in channel ${channel.name}, LOW level access, you're admin`;
				relTochange[0].status = GOT.UserChannelStatus.BAN;
				return await this.relUserChannelService.update(relTochange[0].id, relTochange[0]);
			} else {
				return await this.relUserChannelService.create({
					userId: userToBlock.id,
					channelId: channel.id,
					status: GOT.UserChannelStatus.BAN
				});
			}
		} catch (error) {
			return error.message;
		}
	}

	async chanUnblock(user: User, chanName: string, loginToUnblock: string) {
		try {
			if (user.login === loginToUnblock)
				return `You can unblock you`;
			const channel = await this.channelService.findChanName(chanName);
			if (channel === null)
				return 'Channel not found';
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 0)
				return `You can unblock anybody in channel ${channel.name}, you're not in`;
			if (rels[0].status === GOT.UserChannelStatus.BAN)
				return `You can unblock anybody in channel ${channel.name}, you're ban`;
			if (rels[0].status === GOT.UserChannelStatus.MEMBER)
				return `You can unblock anybody in channel ${channel.name}, LOW level access`;
			const userToUnblock = await this.userService.findLogin(loginToUnblock);
			if (userToUnblock === null)
				return 'User not found';
			const relTochange = await this.relUserChannelService.getChannelRel(userToUnblock, channel);
			if (relTochange.length === 1) {
				if (relTochange[0].status === GOT.UserChannelStatus.BAN) {
					return await this.relUserChannelService.remove(relTochange[0].id);
				} else {
					return 'User you want to unban is not ban';
				}
			} else
				return `User you want to ban is not in channel ${chanName}`;
		} catch (error) {
			return error.message;
		}
	}

	async leaveChan(user: User, chanName: string) {
		try {
			const channel = await this.channelService.findChanName(chanName);
			if (channel === null)
				return 'Channel not found';
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 1) {
				if (rels[0].status === GOT.UserChannelStatus.OWNER) {
					await this.channelService.remove(channel.id);
					return true;
				}
				else
					return await this.relUserChannelService.remove(rels[0].id);
			}
			else
				return `You're not in the channel ${chanName}`;
		} catch (error) {
			return error.message;
		}
	}

	async changeStatusChannel(user: User, chan: GOT.Channel): Promise<string | UpdateResult> {
		try {
			let channel = await this.channelService.findChanName(chan.name);
			if (!channel)
				return `Channel not found`;
			if (channel.status === chan.status)
				return `Status unchanged (same)`;
			if (chan.status === GOT.ChannelStatus.PUBLIC) {
				if (chan.password !== undefined)
					return 'No password need when the channel is PUBLIC';
			} else if (chan.status === GOT.ChannelStatus.PROTECTED) {
				if (chan.password === undefined)
					return 'Password need when the channel is PROTECTED';
			} else {
				if (chan.status !== GOT.ChannelStatus.PRIVATE)
					return `The channel status send is unknow - ${chan.status}`;
				else if (chan.password !== undefined)
					return 'No password need when the channel is PRIVATE';
			}
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 1 && (rels[0].status === GOT.UserChannelStatus.OWNER || rels[0].status === GOT.UserChannelStatus.ADMIN)) {
				channel.status = chan.status;
				channel.password = chan.password;
				return await this.channelService.update(channel.id, channel);
			} else
				return `You haven't the rights to change status of channel ${chan.name}`;
		} catch (error) {
			return error.message;
		}
	}

	async changePasswordChannel(user: User, chanName: string, password: string): Promise<string | UpdateResult> {
		try {
			let channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel not found`;
			if (password === undefined)
				return `Password done is undefined`;
			if (channel.status !== GOT.ChannelStatus.PROTECTED)
				return `Password is set only for protected channel`;
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 1 && (rels[0].status === GOT.UserChannelStatus.OWNER || rels[0].status === GOT.UserChannelStatus.ADMIN)) {
				channel.password = password;
				return await this.channelService.update(channel.id, channel);
			} else
				return `You haven't the rights to change password of channel ${chanName}`;
		} catch (error) {
			return error.message;
		}
	}

	async changeNameChannel(user: User, chanName: string, newChanName: string): Promise<string | UpdateResult> {
		try {
			let channel = await this.channelService.findChanName(chanName);
			if (!channel)
				return `Channel not found`;
			const rels = await this.relUserChannelService.getChannelRel(user, channel);
			if (rels.length === 1 && (rels[0].status === GOT.UserChannelStatus.OWNER || rels[0].status === GOT.UserChannelStatus.ADMIN)) {
				channel.name = newChanName;
				return await this.channelService.update(channel.id, channel);
			} else
				return `You haven't the rights to change name of channel ${chanName}`;
		} catch (error) {
			return error.message;
		}
	}
}
