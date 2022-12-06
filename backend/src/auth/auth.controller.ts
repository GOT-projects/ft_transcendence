import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { stringify } from 'querystring';
import { JWTGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/database/services/user.service';
import { User } from 'src/database/entities/user.entity';

@Controller('auth')
export class AuthController {

    constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
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

    @Post('2fa/generate')
    @UseGuards(JWTGuard)
    async register(@Res() res: Response, @Req() req: Request) {
        try {
            if (!req?.headers?.authorization)
                throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
            const jwt = req.headers.authorization.split(' ')[1];
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
            if (!tmpUser)
                throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
            const { otpAuthUrl } =
            await this.authService.generateTwoFactorAuthenticationSecret(
                tmpUser,
            );
            return res.json(
                await this.authService.generateQrCodeDataURL(otpAuthUrl),
            );
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('2fa/activate')
    @UseGuards(JWTGuard)
    async turnOnTwoFactorAuthentication(@Req() req: Request, @Body() body: any) {
        try {
            if (!req?.headers?.authorization)
                throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
            const jwt = req.headers.authorization.split(' ')[1];
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
            console.log("body", body);
            if (!tmpUser)
                throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
            const isCodeValid =
            this.authService.isTwoFactorAuthenticationCodeValid(
                body.twoFactorAuthenticationCode,
                tmpUser,
            );
            if (!isCodeValid) {
                throw new UnauthorizedException('Wrong authentication code');
            }
            await this.userService.turnOnTwoFactorAuthentication(tmpUser.id);
            
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JWTGuard)
    async authenticate(@Req() req: Request, @Body() body: any) {
        try {
            if (!req?.headers?.authorization)
                throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
            const jwt = req.headers.authorization.split(' ')[1];
            const data: jwtContent = await this.jwtService.verifyAsync(jwt);
            const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
            if (!tmpUser)
                throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
            const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
                body.twoFactorAuthenticationCode,
                tmpUser,
            );
            if (!isCodeValid) {
                throw new UnauthorizedException('Wrong authentication code');
            }
            return this.authService.loginWith2fa(tmpUser);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get('get_intra_url')
    getIntraUrl(@Req() req: Request): string {
        return this.authService.getIntraUrl(req);
    }
}
