import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRelUserDto } from "../dtos/rel_user.dto";
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
        for (const relUser of relUsers) {
            let tmp: User | null = await this.userService.findOne(relUser.user1Id);
            console.log('debug', ret)
            if (tmp === null)
                throw {message: 'WTF db'};
            ret.push(tmp);
        }
        console.log('info', relUsers, ret)
        return ret;
    }

    private async getUsersFromFriend(id: number, relUsers: RelUser[]) {
        let ret: User[] = [];
        for (const relUser of relUsers) {
            let tmp: User | null = await this.userService.findOne(relUser.user1Id === id ? relUser.user2Id : relUser.user1Id);
            if (tmp === null)
                throw {message: 'WTF db'};
            ret.push(tmp);
        }
        return ret;
    }

    async getUsersWaiting(userId: number) {
        return await this.getUsersFromNotif(await this.relUserRepository.find({
            where: [
                {user2Id: userId, status: UserUserStatus.WAITING}
            ]
        }));
    }

    async getFriends(id: number) {
        return await this.getUsersFromFriend(id, await this.relUserRepository.find({
            where: [
                {user2Id: id, status: UserUserStatus.FRIEND},
                {user1Id: id, status: UserUserStatus.FRIEND}
            ]
        }));
    }

    async newFriendConfirmation(login: string, loginDemand: string, accept: boolean) {
        if (login === loginDemand)
            throw {message: 'Same users seriously !!!'}
        const user1 = await this.userService.findLogin(loginDemand);
        const user2 = await this.userService.findLogin(login);
        if (!user1 || !user2)
            throw {message: 'user not found'};
        let relations = await this.relUserRepository.find({
            where: {
                user1Id: user1.id,
                user2Id: user2.id,
                status: UserUserStatus.WAITING
            }
        });
        if (relations.length === 0)
            throw {message: 'No friend demand found'};
        let rel = relations[0];
        if (accept === true) {
            rel.status = UserUserStatus.FRIEND;
            return await this.relUserRepository.update(rel.id, rel);
        }
        this.relUserRepository.delete(rel.id);
        return false;
    }

    async demandFriend(login:string, loginDemand: string) {
        if (login === loginDemand)
            throw {message: 'Same users seriously !!!'}
        const user1 = await this.userService.findLogin(login);
        const user2 = await this.userService.findLogin(loginDemand);
        if (!user1 || !user2)
            throw {message: 'user not found'};
        const alreadyFriend = await this.relUserRepository.find({
            where: [
                {user1Id: user1.id, user2Id: user2.id, status: UserUserStatus.FRIEND},
                {user1Id: user2.id, user2Id: user1.id, status: UserUserStatus.FRIEND}
            ]
        });
        if (alreadyFriend.length !== 0)
            throw {message: `users ${login} and ${loginDemand} are already friends`};
        const alreadyExist = await this.relUserRepository.find({
            where: [
                {user1Id: user1.id, user2Id: user2.id, status: UserUserStatus.WAITING}
            ]
        });
        if (alreadyExist.length !== 0)
        throw {message: `user ${login} have already demand ${loginDemand}`};
        const waitingFriend = await this.relUserRepository.find({
            where: [
                {user1Id: user2.id, user2Id: user1.id, status: UserUserStatus.WAITING}
            ]
        });
        if (waitingFriend.length !== 0) {
            waitingFriend[0].status = UserUserStatus.FRIEND;
            await this.relUserRepository.update(waitingFriend[0].id, waitingFriend[0]);
            return waitingFriend[0];
        }
        const dto: CreateRelUserDto = {
            status: UserUserStatus.WAITING,
            user1Id: user1.id,
            user2Id: user2.id
        };
        const newRel = this.relUserRepository.create(dto);
        return await this.relUserRepository.save(newRel);
    }
}
