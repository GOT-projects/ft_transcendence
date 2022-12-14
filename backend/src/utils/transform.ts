import { GOT } from "shared/types";
import { Channel } from "src/database/entities/channel.entity";
import { Message } from "src/database/entities/message.entity";
import { User } from "src/database/entities/user.entity";

export namespace MyTransform {
	export function userEntityToGot(user: User): GOT.User {
		return {
			id: user.id,
			login: user.login,
			//username: user.username,
			urlImg: user.urlImg,
			wallet: user.wallet,
			email: user.email,
			isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled
		}
	}
	
	export async function privmsgEntityToGot(msg: Message): Promise<GOT.msg | false> {
		if (msg.userIdTo === null)
			return false;
		const userTo = await this.userService.findOne(msg.userIdTo);
		const userFrom = await this.userService.findOne(msg.userIdFrom);
		if (userTo === null || userFrom === null)
			return false;
		return {
			userFrom: userEntityToGot(userFrom),
			userTo: userEntityToGot(userTo),
			msg: msg.message
		};
	}
	
	export function privmsgEntityToGotNoId(msg: Message): GOT.msg | false {
		if (msg.userTo === undefined || msg.userFrom === undefined)
			return false;
		return {
			userFrom: userEntityToGot(msg.userFrom),
			userTo: userEntityToGot(msg.userTo),
			msg: msg.message
		};
	}
	
	export function channelEntityToGot(channel: Channel): GOT.Channel {
		return {
			name: channel.name,
			status: channel.status
		}
	}
	
	export function chanmsgEntityToGotNoId(msg: Message): GOT.MsgChannel | false {
		if (msg.channelTo === undefined || msg.userFrom === undefined)
			return false;
		return {
			userFrom: userEntityToGot(msg.userFrom),
			channel: channelEntityToGot(msg.channelTo),
			msg: msg.message
		};
	}

}
