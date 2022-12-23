import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Certificate } from "crypto";
import { DeleteResult, Repository } from "typeorm";
import { RelFriend } from "../entities/rel_friend.entity";
import { User } from "../entities/user.entity";

export class CreateRelFriendDto {
	user1Id!: number;
	user2Id!: number;
}

@Injectable()
export class RelFriendService {
	constructor(
		@InjectRepository(RelFriend) private relFriendRepository: Repository<RelFriend>,
	) {}

	async create(createUserDto: CreateRelFriendDto): Promise<RelFriend> {
		if (createUserDto.user1Id < createUserDto.user2Id) {
			const tmp = createUserDto.user1Id;
			createUserDto.user1Id = createUserDto.user2Id;
			createUserDto.user2Id = tmp;
			return await this.create(createUserDto);
		}
		const newFriend = this.relFriendRepository.create(createUserDto);
		return await this.relFriendRepository.save(newFriend);
	}

	async findFriendBetween(user1:User, user2: User): Promise<RelFriend[]> {
		if (user1.id < user2.id)
			return await this.findFriendBetween(user2, user1);
		return await this.relFriendRepository.find({
			where: [
				{user1Id: user1.id, user2Id: user2.id}
			]
		});
	}

	async findFriends(user: User): Promise<User[]> {
		const f1 = await this.relFriendRepository.find({
			select: ["user2"],
			where: [
				{user1Id: user.id}
			],
			relations: ['user2']
		});
		const f2 = await this.relFriendRepository.find({
			select: ["user1"],
			where: [
				{user2Id: user.id}
			],
			relations: ['user1']
		});
		let users: User[] = [];
		for (const tmp of f1)
			users.push(tmp.user2);
		for (const tmp of f2)
			users.push(tmp.user1);
		return users;
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.relFriendRepository.delete({
			id
		});
	}
}
