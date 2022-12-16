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

    @Put('upload')
    @UseInterceptors(FileInterceptor('file'))
    async changeProfileImage(@Req() req: Request, @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10000000 }),
          ],
        }),
    ) file: Express.Multer.File) {
        if (!req?.headers?.authorization || !file)
            throw new HttpException('No authorization header or no file', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.changeProfilImage(jwt, file);
    }

    @Get('images/:file')
    async getProfilImage(@Req() req: Request, @Param('file') file: string, @Res() res: Response) {
        return await this.appService.getProfilImage(file, res);
    }
}