import { Injectable } from "@nestjs/common";
import { GOT } from "shared/types";
import { MessageService } from "src/database/services/message.service";

@Injectable()
export class ChatService {
    constructor(
        private readonly messageService: MessageService,
    ) {}

    async getPrivMessage(login: string, loginDemand: string): Promise<GOT.msg[]> {
        try {
            return await this.messageService.getPrivMessage(login, loginDemand);
        } catch (error) {
            return error.message;
        }
    }

    async getPrivMessageUsers(login: string): Promise<GOT.User[]> {
        try {
            return await this.messageService.getPrivMessageUsers(login);
        } catch (error) {
            return error.message;
        }
    }

    async sendPrivMessage(login: string, loginDemand: string, msg: string): Promise<GOT.msg> {
        try {
            return await this.messageService.sendPrivMessage(login, loginDemand, msg);
        } catch (error) {
            return error.message;
        }
    }
}
