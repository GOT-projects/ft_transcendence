import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Injectable, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { stringify } from 'querystring';
import {Tokens} from "./types";
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(
		private readonly authService: AuthService,
	) {}

    @Post('connect_intra')
    //add Promise for return Token struct
    async connect_intra(@Req() req: Request, @Body('code') code: string):Promise<Tokens> {
		if (!code)
			throw new HttpException('empty code', HttpStatus.BAD_REQUEST);
        return await this.authService.connect_intra(req, code);
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
    @UseGuards(AuthGuard('jwt'))
    @Get('access')
    @HttpCode(HttpStatus.OK)
    access(){
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req : any){
        const user= 190;
        return this.authService.logout(user);
    }

}
