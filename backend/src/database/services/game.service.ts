import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { Repository } from "typeorm";
import { Game } from "../entities/game.entity";
import { Rank } from "../types/game.types";
import { UserService } from "./user.service";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        private readonly userService: UserService,
    ) {}

    async getGamesOf(userId: number) {
        return await this.gameRepository.find({
            where: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        });
    }

    async getAll() {
        return await this.gameRepository.find();
    }

    async getRanks() {
        const allGames = await this.getAll();
        let ranks: Rank[] = new Array();
        allGames.forEach( (game) => {
            if (game.points1 > game.points2) {
                if (ranks.find(o => o.id === game.user1Id) === undefined)
                    ranks.push({id: game.user1Id, val: 1})
                else
                    ranks.find((o, i) => {
                        if (o.id === game.user1Id) {
                            ranks[i] = {id: o.id, val: o.val + 1};
                            return true;
                        }
                    });
            } else {
                if (ranks.find(o => o.id === game.user2Id) === undefined)
                    ranks.push({id: game.user2Id, val: 1})
                else
                    ranks.find((o, i) => {
                        if (o.id === game.user2Id) {
                            ranks[i] = {id: o.id, val: o.val + 1};
                            return true;
                        }
                    });
            }
        });
        return ranks.sort(function(a,b) {
            return a.val - b.val;
        });
    }

    async getStatUser(userId: number) {
        const games = await this.getGamesOf(userId);
        const ranks = await this.getRanks();
        const max = await this.userService.countAll();
        let stats = new GOT.StatUser();
        stats.defeat = 0;
        stats.victory = 0;
        stats.rank = -1;
        ranks.find((o, i) => {if (o.id === userId) {stats.rank = i + 1; return true}});
        if (games !== null) {
            games.forEach( (game) => {
                if (game.user1Id === userId) {
                    if (game.points1 > game.points2)
                        stats.victory += 1;
                    else
                        stats.defeat += 1;
                } else {
                    if (game.points1 < game.points2)
                        stats.victory += 1;
                    else
                        stats.defeat += 1;
                }
            });
        }
        return stats;
    }
}