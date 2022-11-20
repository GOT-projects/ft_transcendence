import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { stringify } from 'querystring';
import { JWTGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

    constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {}

    @Post('connect_intra')
    async connect_intra(@Req() req: Request, @Res() res: Response, @Body('code') code: string) {
		if (!code)
			throw new HttpException('empty code', HttpStatus.BAD_REQUEST);
        return await this.authService.connect_intra(req, res, code);
    }

    @Post('invite')
    async invite(@Res() res: Response, @Body('login') login: string) {
		if (!login)
			throw new HttpException('empty login', HttpStatus.BAD_REQUEST);
        return await this.authService.invite(res, login);
    }

    @Get('getIntraUrl')
    getIntraUrl(@Req() req: any) {
        const params = stringify({
            client_id: process.env.API_UID,
            redirect_uri: `${ req.protocol }://${ req.hostname }:${process.env.PORT}/waiting`,
            response_type: 'code',
        })
        return `https://api.intra.42.fr/oauth/authorize?${params}`;
    }

    @Get('get')
    async get(@Res() res: Response) {
        const jwt: string = await this.jwtService.signAsync({
            userId: 5555,
        });
        res.header('Authorization', `Bearer ${ jwt }`);
        res.send();
        return ;//jwt;
    }

    @UseGuards(JWTGuard)
    @Get('access')
    access() {
        return 'lol';
    }
}
