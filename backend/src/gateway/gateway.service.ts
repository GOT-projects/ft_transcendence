import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GOT } from "shared/types";
import { Socket } from "socket.io";
import { UpdateUserDto } from "src/database/dtos/user.dto";
import { User } from "src/database/entities/user.entity";
import { GameService } from "src/database/services/game.service";
import { RelUserService } from "src/database/services/rel_user.service";
import { UserService } from "src/database/services/user.service";

@Injectable()
export class GatewayService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly relUserService: RelUserService,
    ) {}

    async profil(data: jwtContent) {
        try {
            const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
            const tmpStat = this.gameService.getStatUser(data.userId);
            const tmpNotif = this.relUserService.getUsersWaiting(data.userId);
            if (tmpUser === null)
                return null;
            const ret: GOT.Profile = {
                userInfos: tmpUser,
                stat: await tmpStat,
                notif: await tmpNotif
            }
            return ret;
        } catch (error) {
            return null;
        }
    }

    async profilLogin(login: string) {
        try {
            const tmpUser: User | null = await this.userService.findLogin(login);
            if (tmpUser === null)
                return null;
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
            return null;
        }
    }

    async leaderboard() {
        try {
            const ranks = await this.gameService.getRanks();
            let users = await this.userService.findAll();
            let ret: GOT.LeaderBoard = [];
            for (let i = 0; i < ranks.length; i++) {
                const rank = ranks[i];
                for (let j = 0; j < users.length; j++) {
                    const user = users[j];
                    if (user.id === rank.id) {
                        const games = await this.gameService.getInGamesOf(user.id);
                        ret.push({
                            userInfos: user,
                            stat: {
                                victory: rank.val,
                                defeat: rank.lose,
                                rank: i + 1
                            },
                            inGame: (games[0] ? games[0].id : undefined)
                        });
                        users.splice(j, 1);
                        break;
                    }
                }
            }
            let i = ret.length + 1;
            for (let j = 0; j < users.length; j++) {
                const user = users[j];
                ret.push({
                    userInfos: user,
                    stat: {
                        victory: 0,
                        defeat: 0,
                        rank: i++
                    },
                    inGame: undefined
                });
            }
            return ret;
        } catch (error) {
            return null;
        }
    }

    async changeUsername(data: jwtContent, username: string) {
        try {
            let user = await this.userService.findUnique(data.userId, data.userLogin);
            if (!user)
                return null;
            let dto: UpdateUserDto = user;
            dto.username = username;
            const ret = this.userService.update(user.id, dto);
            return ret;
        } catch (error) {
            return null;
        }
    }
}