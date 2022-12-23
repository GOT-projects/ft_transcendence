import { Injectable } from "@nestjs/common";
import { PartialType } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { User } from "../entities/user.entity";

export class CreateChannelDto {
	name!: string;
	status!: GOT.ChannelStatus;
	password?: string;
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
	id!: number;
}


@Injectable()
export class ChannelService {
	constructor( @InjectRepository(Channel) private channelRepository: Repository<Channel>, ) {}

	async create(createChannelDto: CreateChannelDto): Promise<Channel> {
		const newChannel = this.channelRepository.create(createChannelDto);
		await this.channelRepository.save(newChannel);
		return newChannel;
	}

	async findAll(): Promise<Channel[]> {
		return await this.channelRepository.find();
	}

	async countAll() {
		return await this.channelRepository.count();
	}

	async findOne(id: number): Promise<Channel | null> {
		return await this.channelRepository.findOneBy({
			id
		});
	}

	async findChanName(name: string): Promise<Channel | null> {
		return await this.channelRepository.findOneBy({
			name
		});
	}

	async getVisibleChannel(user: User) {
		return await this.channelRepository.find({
			where: [
				{status: GOT.ChannelStatus.PUBLIC},
				{status: GOT.ChannelStatus.PROTECTED},
			]
		});
	}

	async update(id: number, updateChannelDto: UpdateChannelDto): Promise<UpdateResult> {
		return await this.channelRepository.update(id, updateChannelDto);
	}

	async remove(id: number): Promise<DeleteResult> {
		return await this.channelRepository.delete({
			id
		});
	}
}
