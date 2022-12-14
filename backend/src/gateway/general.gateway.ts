import { Injectable } from "@nestjs/common";
import { GOT } from "shared/types";
import { Socket } from "socket.io";
import { User } from "src/database/entities/user.entity";
import { BlockService } from "src/database/services/block.service";
import { RelDemandService } from "src/database/services/demand.service";
import { GameService } from "src/database/services/game.service";
import { UserService } from "src/database/services/user.service";
import { MyTransform } from "src/utils/transform";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class GeneralGateway {
	constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService,
		private readonly demandService: RelDemandService,
		private readonly blockService: BlockService,
	) {}

	getGOTUserFromUser(user: User): GOT.User {
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

	async getFriendNotif(user: User) {
		const demands = await this.demandService.getFriendDemands(user);
		let users: GOT.User[] = [];
		for (const demand of demands) {
			users.push(this.getGOTUserFromUser(demand));
		}
		return users;
	}

	async getChannelNotif(user: User) {
		const demands = await this.demandService.getChannelDemands(user);
		let channels: GOT.Channel[] = [];
		for (const demand of demands) {
			if (demand.channelWhoDemand)
				channels.push(MyTransform.channelEntityToGot(demand.channelWhoDemand));
		}
		return channels;
	}

	async getProfil(user: User): Promise<GOT.Profile | string> {
		try {
			const stat = await this.gameService.getStatUser(user);
			if (typeof stat === 'string')
				return stat;
			const blocksTmp = await this.blockService.getBlockOfUser(user);
			let blocks: GOT.User[] = [];
			for (const tmp of blocksTmp) {
				blocks.push(this.getGOTUserFromUser(tmp));
			}
			return {
				notif: await this.getFriendNotif(user),
				notifChannel: await this.getChannelNotif(user),
				userInfos: this.getGOTUserFromUser(user),
				stat: stat,
				friends: [],
				blocks
			};
		} catch (error) {
			return error.message;
		}
	}

	async getProfilLogin(login: string): Promise<GOT.HistoryParties | string> {
		try {
			const user = await this.userService.findLogin(login);
			if (user === null)
				return `User with login ${login} not found`;
			const stat = await this.gameService.getStatUser(user);
			if (typeof stat === 'string')
				return stat;
			const parties = await this.gameService.getPartiesOfUser(user);
			return {
				userInfos: this.getGOTUserFromUser(user),
				stat,
				parties 
			};
		} catch (error) {
			return error.message;
		}
	}

	async changeLogin(user: User, login: string): Promise<true | string> {
		try {
			user.login = login;
			//user.username = username;
			await this.userService.update(user.id, user);
			return true;
		} catch (error) {
			return error.message;
		}
	}

	async getLeaderboard(): Promise<GOT.LeaderBoard | string> {
		try {
			const stats = await this.gameService.getStatUsers();
			let leaderboard: GOT.LeaderBoard = [];
			for (const stat of stats) {
				const user = await this.userService.findOne(stat[0]);
				if (user !== null) {
					leaderboard.push({
						userInfos: this.getGOTUserFromUser(user),
						stat: stat[1],
						inGame: (await this.gameService.isInParty(user))?.id
					});
				}
			}
			return leaderboard;
		} catch (error) {
			return error.message;
		}
	}
}
