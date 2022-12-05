import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { Repository } from "typeorm";
import { CreateMessageDto } from "../dtos/message.dto";
import { Message } from "../entities/message.entity";
import { RelUserService } from "./rel_user.service";
import { UserService } from "./user.service";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>,
        private readonly userService: UserService,
        private readonly relUserService: RelUserService,
    ) {}

    async getPrivMessage(login1: string, login2: string) {
        const user1 = await this.userService.findLogin(login1);
        const user2 = await this.userService.findLogin(login2);
        if (!user1 || !user2)
            throw {message: 'user not found'};
        
        const messages = await this.messageRepository.find({
            where: [
                {userIdFrom: user1.id, userIdTo: user2.id},
                {userIdFrom: user2.id, userIdTo: user1.id}
            ],
            order: {
                id: 'ASC'
            }
        });
        let ret: GOT.msg[] = [];
        for (const msg of messages) {
            const userFrom = (msg.userIdFrom === user1.id ? user1 : user2);
            const userTo = (msg.userIdTo === user1.id ? user1 : user2);
            ret.push({
                userFrom,
                userTo,
                msg: msg.message
            });
        }
        return ret;
    }

    async sendPrivMessage(login1: string, login2: string, msg: string): Promise<GOT.msg> {
        const user1 = await this.userService.findLogin(login1);
        const user2 = await this.userService.findLogin(login2);
        if (!user1 || !user2)
            throw {message: 'user not found'};
        await this.relUserService.isBlock(user1, user2);
        const dto: CreateMessageDto = {
            message: msg,
            userIdFrom: user1.id,
            userIdTo: user2.id,
            userChannelTo: null
        };
        const tmp = this.messageRepository.create(dto);
        const newMsg = await this.messageRepository.save(tmp);
        //console.log('new', newMsg);
        return {
            userFrom: user1, 
            userTo: user2,
            msg: newMsg.message
        };
    }
}
