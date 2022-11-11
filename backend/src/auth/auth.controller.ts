import { Body, Controller, Get, HttpException, HttpStatus, Inject, Injectable, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { stringify } from 'querystring';

@Controller('auth')
export class AuthController {

    constructor(
		private readonly authService: AuthService,
	) {}

    @Post('connect_intra')
    async connect_intra(@Req() req: Request, @Res() res: Response, @Body('code') code: string) {
		if (!code)
			throw new HttpException('empty code', HttpStatus.BAD_REQUEST);
        return await this.authService.connect_intra(req, res, code);
		return 'lol'
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

}
