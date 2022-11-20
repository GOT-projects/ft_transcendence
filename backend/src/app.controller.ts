import { Controller, Get, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AppService } from "./app.service";
import { JWTGuard } from "./auth/guards/jwt.guard";

@Controller()
@UseGuards(JWTGuard)
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {}

    @Get('/profil')
    async profil(@Req() req: Request) {
        if (!req?.headers?.authorization)
        throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
        const jwt = req.headers.authorization.split(' ')[1];
        return await this.appService.profil(jwt);
    }
}