import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { DeleteResult, Repository } from "typeorm";
import { RelBlock } from "../entities/rel_block.entity";
import { User } from "../entities/user.entity";

export class CreateRelBlockDto {
	userIdWhoBlock!: number;
	userIdIsBlock!: number;
}

@Injectable()
export class BlockService {
	constructor(
		@InjectRepository(RelBlock) private relBlockRepository: Repository<RelBlock>,
	) {}

	async create(createUserDto: CreateRelBlockDto): Promise<RelBlock> {
		const newFriend = this.relBlockRepository.create(createUserDto);
		return await this.relBlockRepository.save(newFriend);
	}

	async getBlock(user: User, userToBlock: User) {
		return await this.relBlockRepository.find({
			where: [
				{userIdIsBlock: userToBlock.id, userIdWhoBlock: user.id}
			]
		})
	}

	async getBlockOfUser(user: User) {
		const rels = await this.relBlockRepository.find({
			select: ["userIsBlock"],
			where: [
				{userIdWhoBlock: user.id}
			],
			relations: ["userIsBlock"]
		})
		let users: User[] = [];
		for (const rel of rels) {
			users.push(rel.userIsBlock);
		}
		return users;
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.relBlockRepository.delete({
			id
		});
	}
}