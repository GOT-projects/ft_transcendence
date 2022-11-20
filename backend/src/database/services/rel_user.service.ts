import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RelUser } from "../entities/rel_user.entity";
import { User } from "../entities/user.entity";
import { UserUserStatus } from "../types/user_user.types";
import { UserService } from "./user.service";

@Injectable()
export class RelUserService {
    constructor(
        @InjectRepository(RelUser) private relUserRepository: Repository<RelUser>,
        private readonly userService: UserService,
    ) {}

    private async getUsersFromNotif(relUsers: RelUser[]) {
        let ret: User[] = [];
        relUsers.forEach(async relUser =>  {
            let tmp: User | null = await this.userService.findOne(relUser.user1Id);
            if (tmp === null)
                throw new HttpException('WTF db', HttpStatus.BAD_REQUEST);
            ret[relUser.user1Id] = tmp;
        });
        return ret;
    }

    async getUsersWaiting(userId: number) {
        return await this.getUsersFromNotif(await this.relUserRepository.find({
            where: [
                {user2Id: userId, status: UserUserStatus.WAITING}
            ]
        }));
    }
}