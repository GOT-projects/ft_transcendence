import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GOT } from "shared/types";
import { UpdateUserDto } from "./database/dtos/user.dto";
import { User } from "./database/entities/user.entity";
import { GameService } from "./database/services/game.service";
import { RelUserService } from "./database/services/rel_user.service";
import { UserService } from "./database/services/user.service";

@Injectable()
export class AppService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly relUserService: RelUserService,
    ) {}

    async profil(jwt: GOT.Token) {
        try {
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
            const tmpStat = await this.gameService.getStatUser(data.userId);
            const tmpNotif = await this.relUserService.getUsersWaiting(data.userId);
            if (tmpUser === null)
                throw new HttpException('No user', HttpStatus.BAD_REQUEST)
            const ret: GOT.Profile = {
                userInfos: tmpUser,
                stat: tmpStat,
                notif: tmpNotif
            }
            return ret;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async profilLogin(jwt: GOT.Token, login: string) {
        try {
            await this.jwtService.verifyAsync(jwt);
            const tmpUser: User | null = await this.userService.findLogin(login);
            if (tmpUser === null)
            throw new HttpException('No user', HttpStatus.BAD_REQUEST);
            const tmpStat = await this.gameService.getStatUser(tmpUser.id);
            const games = await this.gameService.getGamesOf(tmpUser.id);
            let parties: GOT.Party[] = [];
            games.forEach(async function(elem) {
                parties.push({
                    user1: await this.userService.findOne(elem.user1Id),
                    user2: await this.userService.findOne(elem.user2Id),
                    points1: elem.points1,
                    points2: elem.points2
                });
            });
            const ret: GOT.HistoryParties = {
                userInfos: tmpUser,
                stat: tmpStat,
                parties: parties
            }
            return ret;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async changeUsername(jwt: GOT.Token, username: string) {
        try {
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            let user = await this.userService.findUnique(data.userId, data.userLogin);
            if (!user)
                throw new HttpException('Unauthorized User not found', HttpStatus.UNAUTHORIZED);
            let dto: UpdateUserDto = user;
            dto.username = username;
            const ret = this.userService.update(user.id, dto);
            return ret;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}