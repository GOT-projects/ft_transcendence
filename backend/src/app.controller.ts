import { Body, Controller, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { AppService } from "./app.service";
import { JWTGuard } from "./auth/guards/jwt.guard";

@Controller()
@UseGuards(JWTGuard)
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {}

    @Get('profil')
    async profil(@Req() req: Request) {
        if (!req?.headers?.authorization)
            throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.profil(jwt);
    }

    @Get('profil/:login')
    async profilLogin(@Req() req: Request, @Param('login') login: string) {
        if (!req?.headers?.authorization || !login)
            throw new HttpException('No authorization header or no login', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.profilLogin(jwt, login);
    }

    @Get('leaderboard')
    async leaderboard(@Req() req: Request) {
        if (!req?.headers?.authorization)
            throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.leaderboard(jwt);
    }

    @Patch('change_username')
    async changeUsername(@Req() req: Request, @Body('username') username: string) {
        if (!req?.headers?.authorization || !username)
            throw new HttpException('No authorization header or no username', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.changeUsername(jwt, username);
    }

    @Put('change_image')
    @UseInterceptors(FileInterceptor('file'))
    async changeProfileImage(@Req() req: Request, @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10000000 }),
          ],
        }),
      ) file: Express.Multer.File) {
        console.log(file);
        if (!req?.headers?.authorization || !file)
            throw new HttpException('No authorization header or no file', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.changeProfilImage(jwt, file);
    }

    @Get('images/:file')
    async getProfilImage(@Req() req: Request, @Param('file') file: string, @Res() res: Response) {
        if (!req?.headers?.authorization || !file)
            throw new HttpException('No authorization header or no file', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.getProfilImage(jwt, file, res);
    }
}