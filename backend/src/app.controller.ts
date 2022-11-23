import { Body, Controller, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { AppService } from "./app.service";
import { JWTGuard } from "./auth/guards/jwt.guard";

@Controller()
//@UseGuards(JWTGuard)
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {}

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
    
    /*@Get('allLeaderBoard')
    async allLeaderBoard(@Req() req: Request, @Body('username') username: string) {
        if (!req?.headers?.authorization || !username)
            throw new HttpException('No authorization header or no username', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.allLeaderBoard(jwt);
    }*/
}