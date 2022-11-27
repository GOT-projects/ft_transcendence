import { Injectable } from "@nestjs/common";
import { RelUser } from "src/database/entities/rel_user.entity";
import { User } from "src/database/entities/user.entity";
import { RelUserService } from "src/database/services/rel_user.service";
import { UpdateResult } from "typeorm";

@Injectable()
export class FriendService {
    constructor(
        private readonly relUserService: RelUserService,
    ) {}

    async newFriendConfirmation(login: string, loginDemand: string, accept: boolean): Promise<false | UpdateResult | string> {
        try {
            return await this.relUserService.newFriendConfirmation(login, loginDemand, accept);
        } catch (error) {
            return error.message;
        }
    }

    async getNotif(id: number): Promise<User[] | string> {
        try {
            return await this.relUserService.getUsersWaiting(id);
        } catch (error) {
            return error.message;
        }
    }

    async getFriends(id: number): Promise<User[] | string> {
        try {
            return await this.relUserService.getFriends(id);
        } catch (error) {
            return error.message;
        }
    }

    async demandFriend(login:string, loginDemand: string): Promise<RelUser | string> {
        try {
            return await this.relUserService.demandFriend(login, loginDemand);
        } catch (error) {
            return error.message;
        }
    }
}
