import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import internal from "stream";
import { Repository } from "typeorm";
import { Game, gameStatus } from "../entities/game.entity";
import { User } from "../entities/user.entity";
import { UserService } from "./user.service";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game) private gameRepository: Repository<Game>,
		private readonly userService: UserService,
	) {}

	async isInParty(user: User): Promise<Game | undefined> {
		const inProgress = await this.gameRepository.find({
			where: [
				{user1Id: user.id, status: gameStatus.IN_PROGRESS},
				{user2Id: user.id, status: gameStatus.IN_PROGRESS},
			]
		});
		if (inProgress.length === 0)
			return undefined;
		else
			return inProgress[0];
	}

	async getStatUsers(): Promise<Map<number, GOT.StatUser>> {
		let map: Map<number, GOT.StatUser> = new Map<number, GOT.StatUser>();
		const allUsers = await this.userService.findAll();
		for (const user of allUsers)
			map.set(user.id, {victory: 0, defeat: 0, rank: -1});
		const allGames = await this.gameRepository.find();
		// Récupération des défaites et des victoires
		for (const game of allGames) {
			const idVictory = game.points1 > game.points2 ? game.user1Id : game.user2Id;
			const idDefeat = game.user1Id === idVictory ? game.user2Id : game.user1Id;
			const tmpVictory = map.get(idVictory);
			if (tmpVictory === undefined)
				map.set(idVictory, {victory: 1, defeat: 0, rank: -1});
			else {
				tmpVictory.victory += 1;
				map.set(idVictory, tmpVictory);
			}
			const tmpDefeat = map.get(idDefeat);
			if (tmpDefeat === undefined)
				map.set(idDefeat, {victory: 0, defeat: 1, rank: -1});
			else {
				tmpDefeat.defeat += 1;
				map.set(idDefeat, tmpDefeat);
			}
		}
		let newMap: Map<number, GOT.StatUser> = new Map<number, GOT.StatUser>([...map].sort((a: any , b: any) => {
			return (a[1].victory - a[1].defeat) - (b[1].victory - b[1].defeat);
		}));
		let i: number = 1;
		for (const elem of newMap) {
			elem[1].rank = i++;
		}
		return newMap;
	}

	async getStatUser(user: User): Promise<GOT.StatUser | string> {
		const stats = await this.getStatUsers();
		const statUser = stats.get(user.id);
		if (statUser === undefined)
			return 'User statistic problem';
		return statUser;
	}
}