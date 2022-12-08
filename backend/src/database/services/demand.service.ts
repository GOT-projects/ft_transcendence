import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { RelDemand } from "../entities/rel_demand.entity";
import { User } from "../entities/user.entity";

export class CreateRelDemandDto {
    userIdDemand!: number;
    userIdWhoDemand: number | null;
    channelIdWhoDemand: number | null;
}

@Injectable()
export class RelDemandService {
	constructor(
		@InjectRepository(RelDemand) private relDemandRepository: Repository<RelDemand>,
	) {}

	async create(createUserDto: CreateRelDemandDto): Promise<RelDemand> {
		const newFriend = this.relDemandRepository.create(createUserDto);
		return await this.relDemandRepository.save(newFriend);
	}

	async getFriendDemands(user: User): Promise<User[]> {
		const demands = await this.relDemandRepository.find({
			select: ["userWhoDemand"],
			where: [
				{userIdDemand: user.id,  channelIdWhoDemand: undefined }
			],
			relations: ["userWhoDemand"],
		});
		let users: User[] = [];
		for (const demand of demands)
			users.push(demand.userWhoDemand);
		return users;
	}

	async getFriendsDemandsBetween(userWhoDemand: User, userDemand: User): Promise<RelDemand[]> {
		return await this.relDemandRepository.find({
			where: [
				{userIdDemand: userDemand.id, userIdWhoDemand: userWhoDemand.id},
				{userIdWhoDemand: userDemand.id, userIdDemand: userWhoDemand.id}
			]
		});
	}

	async getFriendsDemands(userWhoDemand: User, userDemand: User): Promise<RelDemand[]> {
		return await this.relDemandRepository.find({
			where: [
				{userIdDemand: userDemand.id, userIdWhoDemand: userWhoDemand.id}
			]
		});
	}

	async getChannel(user: User, channel: Channel) {
		return await this.relDemandRepository.find({
			where: [
				{userIdDemand: user.id, channelIdWhoDemand: channel.id}
			]
		});
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.relDemandRepository.delete({
			id
		});
	}
}
