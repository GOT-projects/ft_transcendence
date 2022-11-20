import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GOT } from "shared/types";
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
            let ret = new GOT.Profile();
            const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
            const tmpStat = await this.gameService.getStatUser(data.userId);
            const tmpNotif = await this.relUserService.getUsersWaiting(data.userId);
            if (tmpUser === null)
                throw new HttpException('No user', HttpStatus.BAD_REQUEST)
            ret.userInfos = tmpUser;
            ret.stat = tmpStat;
            ret.notif = tmpNotif;
            return ret;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async profilLogin(jwt: GOT.Token, login: string) {
        try {
            await this.jwtService.verifyAsync(jwt);
            let ret = new GOT.HistoryParties();
            const tmpUser: User | null = await this.userService.findLogin(login);
            if (tmpUser === null)
                throw new HttpException('No user', HttpStatus.BAD_REQUEST);
            const tmpStat = await this.gameService.getStatUser(tmpUser.id);
            const tmpNotif = await this.gameService.getGamesOf(tmpUser.id);
            ret.userInfos = tmpUser;
            ret.stat = tmpStat;
            ret.parties = tmpNotif;
            return ret;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}