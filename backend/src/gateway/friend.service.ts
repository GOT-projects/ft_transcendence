import { Injectable } from "@nestjs/common";
import { userInfo } from "os";
import { GOT } from "shared/types";
import { Game } from "src/database/entities/game.entity";
import { RelUser } from "src/database/entities/rel_user.entity";
import { User } from "src/database/entities/user.entity";
import { GameService } from "src/database/services/game.service";
import { RelUserService } from "src/database/services/rel_user.service";
import { UpdateResult } from "typeorm";

@Injectable()
export class FriendService {
    constructor(
        private readonly relUserService: RelUserService,
        private readonly gameService: GameService,
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

    async getFriends(id: number): Promise<GOT.Friend[] | string> {
        try {
            const friends_user = await this.relUserService.getFriends(id);
            console.log('friend',friends_user)
            let ret: GOT.Friend[] = [];
            for (const user of friends_user) {
                const inGame: Game[] = await this.gameService.getInGamesOf(user.id);
                if (inGame.length > 0)
                {
                    ret.push({
                        ...user,
                        status: GOT.ProfileStatus.inGame
                    });
                } else {
                    ret.push({
                        ...user,
                        status: GOT.ProfileStatus.offline
                    });
                }
            };
            return ret;
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
