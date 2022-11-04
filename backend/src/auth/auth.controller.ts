import { Body, Controller, Get, Headers, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { query } from 'express';

@Controller('auth')
export class AuthController {

    @Get('intra-connect')
    async intra_connect(@Query() infos: any, @Res() req:any) {
        console.log(infos,)
    }

    @Get('getUid')
    getUID() {
        return process.env.API_UID;
    }
}


