import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
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
      let users: User[] = [];
      for (const element of games) {
        if (!(users[element.user1Id])) {
          let tmp = await this.userService.findOne(element.user1Id);
          if (tmp)
            users[element.user1Id] = tmp;
          else
            return ;
        }
        if (!(users[element.user2Id])) {
          let tmp = await this.userService.findOne(element.user2Id);
          if (tmp)
            users[element.user2Id] = tmp;
          else
            return ;
        }
        ret.push({
          points1: element.points1,
          points2: element.points2,
          user1: users[element.user1Id],
          user2: users[element.user2Id]
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
      let users: User[] = [];
      for (const element of games) {
        if (element.user1Id === id || element.user2Id === id) {
          if (!(users[element.user1Id])) {
            let tmp = await this.userService.findOne(element.user1Id);
            if (tmp)
              users[element.user1Id] = tmp;
            else
              return ;
          }
          if (!(users[element.user2Id])) {
            let tmp = await this.userService.findOne(element.user2Id);
            if (tmp)
              users[element.user2Id] = tmp;
            else
              return ;
          }
          ret.push({
            points1: element.points1,
            points2: element.points2,
            user1: users[element.user1Id],
            user2: users[element.user2Id]
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
