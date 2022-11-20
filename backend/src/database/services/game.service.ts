import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOT } from "shared/types";
import { Repository } from "typeorm";
import { Game } from "../entities/game.entity";

@Injectable()
export class GameService {
    constructor( @InjectRepository(Game) private gameRepository: Repository<Game>, ) {}

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
        let ranks: number[] = [];
        allGames.forEach( (game) => {
            if (game.points1 > game.points2) {
                if (ranks[game.user1Id] === undefined)
                    ranks.splice(game.user1Id, 0, 1);
                else
                    ranks[game.user1Id]++;
            } else {
                if (ranks[game.user2Id] === undefined)
                    ranks.splice(game.user2Id, 0, 1);
                else
                    ranks[game.user2Id]++;
            }
        });
        return ranks;
    }

    async getStatUser(userId: number) {
        const games = await this.getGamesOf(userId);
        let stats = new GOT.StatUser();
        stats.defeat = 0;
        stats.rank = ((await this.getRanks())[userId]);
        if (stats.rank === undefined) stats.rank = 999999;
        stats.victory = 0;
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