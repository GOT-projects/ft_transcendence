import { Injectable } from "@nestjs/common";
import { repl } from "@nestjs/core";
import { GOT } from "shared/types";
import { RelDemand } from "src/database/entities/rel_demand.entity";
import { User } from "src/database/entities/user.entity";
import { BlockService } from "src/database/services/block.service";
import { RelDemandService } from "src/database/services/demand.service";
import { CreateRelFriendDto, RelFriendService } from "src/database/services/friend.service";
import { GameService } from "src/database/services/game.service";
import { UserService } from "src/database/services/user.service";
import { GeneralGateway } from "./general.gateway";
import { MyTransform } from "src/utils/transform";

export interface UserAndStatus {
	user: User;
	status: boolean
}

@Injectable()
export class FriendGateway {
	constructor(
		private readonly userService: UserService,
		private readonly relFriendService: RelFriendService,
		private readonly demandService: RelDemandService,
		private readonly gameService: GameService,
		private readonly blockService: BlockService,
	) {}

	private async addFriend(user1: User, user2: User) {
		if (user1.id === user2.id)
			throw {message: 'Same user no no no'};
		const dto: CreateRelFriendDto = (
			user1.id < user2.id
				? {user1Id: user1.id, user2Id: user2.id}
				: {user1Id: user2.id, user2Id: user1.id}
		);
		await this.relFriendService.create(dto);
	}

	async demandFriend(user: User, login: string): Promise<UserAndStatus | string> {
		try {
			if (user.login === login)
				return "You can't demand yourself as friend";
			const userToDemand = await this.userService.findLogin(login);
			if (userToDemand === null)
				return `User with login ${login} not found`;
			const block = await this.blockService.getBlock(userToDemand, user);
			if (block.length === 1)
				return `${userToDemand.login} blocked you`;
			const alreadyFriend = await this.relFriendService.findFriendBetween(user, userToDemand);
			if (alreadyFriend.length !== 0)
				return `${user.login} and ${userToDemand.login} are already friend`;
			const blockByMe = await this.blockService.getBlock(user, userToDemand);
			if (blockByMe.length === 1) {
				await this.blockService.delete(blockByMe[0].id);
			}
			const demands = await this.demandService.getFriendsDemandsBetween(user, userToDemand);
			let toDelete: RelDemand[] = [];
			for (const demand of demands) {
				if (demand.userIdWhoDemand === user.id && demand.userIdDemand === userToDemand.id)
					return 'User already demand';
				else
					toDelete.push(demand);
			}
			if (toDelete.length !== 0) {
				// 2 demands => friends
				for (const elem of toDelete)
					await this.demandService.delete(elem.id);
				await this.addFriend(user, userToDemand);
				return {user: userToDemand, status: true};
			}
			else {
				await this.demandService.create({
					userIdDemand: userToDemand.id,
					userIdWhoDemand: user.id,
					channelIdWhoDemand: null
				});
				return {user: userToDemand, status: false};
			}
		} catch (error) {
			return error.message;
		}
	}

	async getFriends(user: User): Promise<GOT.Friend[] | string> {
		try {
			const users = await this.relFriendService.findFriends(user);
			let ret: GOT.Friend[] = [];
			for (const tmp of users) {
				const inGame = await this.gameService.isInParty(tmp);
				ret.push({
					...MyTransform.userEntityToGot(tmp),
					status: inGame === undefined ? GOT.ProfileStatus.offline : GOT.ProfileStatus.inGame
				});
			}
			return ret;
		} catch (error) {
			return error.message;
		}
	}

	async replyNotif(user: User, reply: GOT.NotifChoice): Promise<string | UserAndStatus> {
		try {
			if (!reply.user)
				return 'user not defined';
			const userReply = await this.userService.findUnique(reply.user.id, reply.user.login);
			if (userReply === null)
				return 'User not found';
			const demands = await this.demandService.getFriendsDemands(userReply, user);
			if (demands.length === 1) {
				await this.demandService.delete(demands[0].id);
				if (reply.accept) {
					await this.relFriendService.create({
						user1Id: user.id,
						user2Id: userReply.id
					});
					return {user: userReply, status: true};
				}
			} else {
				return "You're reply is refused";
			}
			return {user: userReply, status: false};
		} catch (error) {
			return error.message;
		}
	}

	async blockSomebody(user: User, login: string): Promise<string | User> {
		try {
			const userToBlock = await this.userService.findLogin(login);
			if (userToBlock === null)
				return 'User not found';
			const friends = await this.relFriendService.findFriendBetween(user, userToBlock);
			if ( friends.length !== 0) {
				for (const friend of friends)
					await this.relFriendService.delete(friend.id);
			}
			const demands = await this.demandService.getFriendsDemandsBetween(user, userToBlock);
			if ( demands.length !== 0) {
				for (const demand of demands)
					await this.demandService.delete(demand.id);
			}
			const block = await this.blockService.getBlock(user, userToBlock);
			if (block.length === 0) {
				await this.blockService.create({
					userIdIsBlock: userToBlock.id,
					userIdWhoBlock: user.id
				})
			}
			return userToBlock;
		} catch (error) {
			return error.message;
		}
	}

	async unblockSomebody(user: User, login: string): Promise<string | User> {
		try {
			const userToBlock = await this.userService.findLogin(login);
			if (userToBlock === null)
				return 'User not found';
			const block = await this.blockService.getBlock(user, userToBlock);
			if (block.length === 1)
				await this.blockService.delete(block[0].id);
			else
				return `User with login ${login} not block`;
			return userToBlock;
		} catch (error) {
			return error.message;
		}
	}
}
