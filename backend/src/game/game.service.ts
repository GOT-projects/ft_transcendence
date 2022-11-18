import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { gameStatus } from './game.types';

@Injectable()
export class GameService {

  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly userService: UsersService
  ) {}

  
  async leaderboard() {
    try {
      const games =  await this.gameRepository.findBy({ status: gameStatus.FINISH });
      let ret: any = [];
      let i = 0;
      for (const element of games) {
        let user1 = await this.userService.findOne(element.user1Id);
        let user2 = await this.userService.findOne(element.user2Id);
        ret.push({
          points1: element.points1,
          points2: element.points2,
          user1: user1,
          user2: user2
        });
      };
      return ret;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  
  async findUsersParty(id: number) {
    try {
      const games =  await this.gameRepository.findBy({
        status: gameStatus.FINISH,
      });
      let ret: any = [];
      let i = 0;
      for (const element of games) {
        if (element.user1Id === id || element.user2Id === id) {
          let user1 = await this.userService.findOne(element.user1Id);
          let user2 = await this.userService.findOne(element.user2Id);
          ret.push({
            points1: element.points1,
            points2: element.points2,
            user1: user1,
            user2: user2
          });
        }
      };
      return ret;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /*
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }
  
  findOne(id: number) {
    return `This action returns a #${id} game`;
  }
  
  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }
  
  remove(id: number) {
    return `This action removes a #${id} game`;
  }
  */
}
