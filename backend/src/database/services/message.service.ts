import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { GeneralGateway } from "src/gateway/general.gateway";
import { DeleteResult, Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { Message } from "../entities/message.entity";
import { User } from "../entities/user.entity";

export class CreateMessageDto {
	message!: string;
	userIdFrom!: number;
	userIdTo: number | null;
	channelIdTo: number | null;
}

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message) private messageRepository: Repository<Message>,
	) {}

	async create(createMessageDto: CreateMessageDto): Promise<Message> {
		const newMessage = this.messageRepository.create(createMessageDto);
		return await this.messageRepository.save(newMessage);
	}

	async getPrivmsg(user1: User, user2: User) {
		return await this.messageRepository.find({
			select: ["message", "userFrom", "userTo"],
			where: [
				{userIdFrom: user1.id, userIdTo: user2.id},
				{userIdFrom: user2.id, userIdTo: user1.id}
			]
		});
	}

	async getPrivmsgUsers(user: User) {
		return await this.messageRepository.find({
			select: ["userFrom", "userTo"],
			where: [
				{userIdFrom: user.id, channelIdTo: undefined},
				{userIdTo: user.id, channelIdTo: undefined}
			]
		});
	}

	async getPrivmsgSend(user: User, userTo: User, msg: string) {
		return await this.create({
			message: msg,
			userIdFrom: user.id,
			userIdTo: userTo.id,
			channelIdTo: null
		});
	}

	async getChanmsg(user: User, channel: Channel) {
		return await this.messageRepository.find({
			select: ["message", "userFrom", "userTo"],
			where: [
				{userIdFrom: user.id, channelIdTo: channel.id},
				{userIdFrom: user.id, channelIdTo: channel.id}
			]
		});
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.messageRepository.delete({
			id
		});
	}
}