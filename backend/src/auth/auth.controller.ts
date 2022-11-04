import { Body, Controller, Get, Header, Headers, HttpException, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { query } from 'express';

@Controller('auth')
export class AuthController {

    @Get('intra-connect')
    async intra_connect(@Query() infos: any, @Res() req:any) {
        console.log(infos,)
    }

    @Post('getUid')
    getUID(@Body('host') host: string) {
        if (!host)
            throw new HttpException('Need hostname of client', HttpStatus.BAD_REQUEST);
        const params: string = `?client_id=${encodeURIComponent('' + process.env.API_UID)}\
&redirect_uri=${encodeURIComponent('http://' + host + ':' + process.env.PORT)}\
&response_type=code`;
        return `https://api.intra.42.fr/oauth/authorize${params}`;
    }
}
