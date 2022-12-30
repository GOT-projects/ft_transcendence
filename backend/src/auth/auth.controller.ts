import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/database/services/user.service';
import { AuthService } from './auth.service';
import { JWTGuard } from './guards/jwt.guard';
import { jwtContent } from './types';

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
		try {
			return await this.authService.connect_intra(req, res, code);
		} catch (error) {
			throw new HttpException(error.message, error.status);
		}
	}

	@Post('invite')
	async invite(@Res() res: Response, @Body('login') login: string) {
		if (process.env.ENV === 'PROD')
			throw new NotFoundException();
		if (!login)
			throw new HttpException('empty login', HttpStatus.BAD_REQUEST);
		try {
			return await this.authService.invite(res, login);
		} catch (error) {
			throw new HttpException(error.message, error.status);
		}
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
			const { otpAuthUrl, secret } =
			await this.authService.generateTwoFactorAuthenticationSecret(
				tmpUser,
			);
			return res.send({
				qrcode: await this.authService.generateQrCodeDataURL(otpAuthUrl),
				secret
			});
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

	@Get('access')
	async get(@Req() req: Request) {
		try {
			if (!req?.headers?.authorization)
				throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
			const jwt = req.headers.authorization.split(' ')[1];
			const data: jwtContent = await this.jwtService.verifyAsync(jwt);
			const tmpUser: User | null = await this.userService.findUnique(data.userId, data.userLogin);
			if (!tmpUser)
				throw new HttpException('No authorization header', HttpStatus.BAD_REQUEST);
			if (data.isTwoFactorAuthenticationEnabled === true && data.isTwoFactorAuthenticated === false)
				throw new UnauthorizedException();
		} catch (error) {
			throw new UnauthorizedException();
			return false;
		}
	}
}
