import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
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

    /*async allLeaderBoard(jwt: GOT.Token) {
        try {
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const tmpUser: User[] = await this.userService.findAll();
            const tmpStat = await this.gameService.getStatUser(data.userId);
            const tmpNotif = await this.relUserService.getUsersWaiting(data.userId);
            if (tmpUser === null)
                throw new HttpException('No user', HttpStatus.BAD_REQUEST)
            return tmpUser
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }*/


    async changeProfilImage(jwt: GOT.Token, file: Express.Multer.File) {
        try {
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            let user = await this.userService.findUnique(data.userId, data.userLogin);
            if (!user)
                throw new HttpException('Unauthorized User not found', HttpStatus.UNAUTHORIZED);
            user.urlImg = '/' + file.path;
            await this.userService.update(user.id, user);
            return file;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    
    async getProfilImage(/*jwt: GOT.Token, */file: string, res: Response) {
        try {
            /*const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            let user = await this.userService.findUnique(data.userId, data.userLogin);
            if (!user)
                throw new HttpException('Unauthorized User not found', HttpStatus.UNAUTHORIZED);*/
            return res.sendFile(file, { root: './images' });
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
