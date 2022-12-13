import { Injectable } from "@nestjs/common";
import { PartialType } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { RelUserChannel } from "../entities/rel_user_channel.entity";
import { User } from "../entities/user.entity";

export class CreateRelUserChannelDto {
	status!: GOT.UserChannelStatus;
	userId!: number;
	channelId!: number;
}

export class UpdateRelUserChannelDto extends PartialType(CreateRelUserChannelDto) {
	id!: number;
}


@Injectable()
export class RelUserChannelService {
	constructor( @InjectRepository(RelUserChannel) private relUserChannelRepository: Repository<RelUserChannel>, ) {}

	async create(createRelUserChannelDto: CreateRelUserChannelDto): Promise<RelUserChannel> {
		const newRelUserChannel = this.relUserChannelRepository.create(createRelUserChannelDto);
		await this.relUserChannelRepository.save(newRelUserChannel);
		return newRelUserChannel;
	}

	async findAll(): Promise<RelUserChannel[]> {
		return await this.relUserChannelRepository.find();
	}

	async countAll() {
		return await this.relUserChannelRepository.count();
	}

	async findOne(id: number): Promise<RelUserChannel | null> {
		return await this.relUserChannelRepository.findOneBy({
			id
		});
	}

	async getChannelInNOTBan(user: User) {
		const rels = await this.relUserChannelRepository.find({
			select: ["channel", "status", "id", "userId"],
			where: [
				{userId: user.id}
			],
			relations: ["channel"]
		});
		let ret: Channel[] = [];
		for (const rel of rels) {
			if (rel.status !== GOT.UserChannelStatus.BAN)
				ret.push(rel.channel);
		}
		return ret;
	}

	async getChannelRel(user: User, channel: Channel) {
		const rels = await this.relUserChannelRepository.find({
			where: [
				{userId: user.id, channelId: channel.id}
			]
		});
		return rels;
	}

	async getChanUsersNotBan(user: User, channel: Channel) {
		const rels = await this.relUserChannelRepository.find({
			select: ["user", "status"],
			where: [
				{channelId: channel.id},
			],
			relations: ["user"]
		});
		return rels;
	}

	async update(id: number, updateRelUserChannelDto: UpdateRelUserChannelDto): Promise<UpdateResult> {
		return await this.relUserChannelRepository.update(id, updateRelUserChannelDto);
	}

	async remove(id: number): Promise<DeleteResult> {
		return await this.relUserChannelRepository.delete({
			id
		});
	}
}
