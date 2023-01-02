import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Game, gameStatus } from "../entities/game.entity";
import { User } from "../entities/user.entity";
import { UserService } from "./user.service";
import { PartialType } from "@nestjs/swagger";

export class CreateGameDto {
	user1Id!: number;
	user2Id!: number;
	status!: gameStatus;
}

export class UpdateGameDto extends PartialType(CreateGameDto)  {
	id?: number | undefined;
	points1?: number | undefined;
	points2?: number| undefined;
}

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game) private gameRepository: Repository<Game>,
		private readonly userService: UserService,
	) {}

	async create(createGameDto: CreateGameDto): Promise<Game> {
		const newGame = this.gameRepository.create(createGameDto);
		return await this.gameRepository.save(newGame);
	}

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
		const allGames = await this.gameRepository.find({
			where: [
				{status: gameStatus.FINISH},
				{status: gameStatus.IN_PROGRESS},
			],
		});
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
			if (a[1].victory === a[1].defeat && b[1].victory === b[1].defeat && a[1].defeat === b[1].defeat && a[1].defeat === 0)
				return 0;
			if (a[1].victory === 0 && a[1].defeat === 0)
				return 1;
			if (b[1].victory === 0 && b[1].defeat === 0)
				return -1;
			return (b[1].victory - b[1].defeat) - (a[1].victory - a[1].defeat);
		}));
		let i: number = 1;
		for (const elem of newMap) {
			elem[1].rank = i++;
		}
		return newMap;
	}

	async getPartiesOfUser(user: User): Promise<GOT.Party[]> {
		return await this.gameRepository.find({
			select: ["points1", "points2", "user1", "user2"],
			where: [
				{user1Id: user.id, status: gameStatus.FINISH},
				{user2Id: user.id, status: gameStatus.FINISH},
			],
			relations: ["user1", "user2"]
		});
	}

	async getStatUser(user: User): Promise<GOT.StatUser | string> {
		const stats = await this.getStatUsers();
		const statUser = stats.get(user.id);
		if (statUser === undefined)
			return 'User statistic problem';
		return statUser;
	}

	async getGameDemands(): Promise<Game[]> {
		return this.gameRepository.find({
			where: [
				{status: gameStatus.DEMAND}
			]
		});
	}

	async getGameUserWhoDemand(user: User): Promise<Game[]> {
		return this.gameRepository.find({
			select: ["id", "points1", "points2", "status", "user1", "user2", "user1Id", "user2Id"],
			where: [
				{user1Id: user.id, status: gameStatus.DEMAND}
			],
			relations: ["user1", "user2"]
		});
	}

	async getGameUserWhoIsDemand(userWho: User, userIs: User): Promise<Game[]> {
		return this.gameRepository.find({
			select: ["id", "points1", "points2", "status", "user1", "user2", "user1Id", "user2Id"],
			where: [
				{user1Id: userWho.id, user2Id: userIs.id, status: gameStatus.DEMAND}
			],
			relations: ["user1", "user2"]
		});
	}


	async getGameUserIsDemand(user: User): Promise<Game[]> {
		return this.gameRepository.find({
			select: ["id", "points1", "points2", "status", "user1", "user2", "user1Id", "user2Id"],
			where: [
				{user2Id: user.id, status: gameStatus.DEMAND}
			],
			relations: ["user1", "user2"]
		});
	}

	async getGamesInProgress(): Promise<Game[]> {
		return this.gameRepository.find({
			where: [
				{status: gameStatus.IN_PROGRESS}
			]
		});
	}

	async findCompleteGame(createGameDto: CreateGameDto): Promise<Game[]> {
		return await this.gameRepository.find({
			select: ["id", "points1", "points2", "status", "user1", "user2", "user1Id", "user2Id"],
			where: createGameDto,
			relations: ["user1", "user2"]
		});
	}

	async findUserInGame(user: User) {
		return await this.gameRepository.find({
			select: ["id", "points1", "points2", "status", "user1", "user2", "user1Id", "user2Id"],
			where: [
				{user1Id: user.id, status: gameStatus.IN_PROGRESS},
				{user2Id: user.id, status: gameStatus.IN_PROGRESS},
			],
			relations: ["user1", "user2"]
		});
	}

	async update(id: number, updateGameDto: UpdateGameDto): Promise<UpdateResult> {
		return await this.gameRepository.update(id, updateGameDto);
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.gameRepository.delete({
			id
		});
	}
}