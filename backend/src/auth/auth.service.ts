import axios from 'axios';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { stringify } from "querystring";
import { CreateUserDto, UserService } from "src/database/services/user.service";
import { User } from 'src/database/entities/user.entity';
import { GOT } from 'shared/types';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { jwtContent } from './types';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly jwtService: JwtService,
	) {}

	getIntraUrl(req: Request) {
		const params = stringify({
			client_id: process.env.API_UID,
			redirect_uri: `${ req.protocol }://${ req.hostname }:${process.env.PORT}/waiting`,
			response_type: 'code',
		})
		return `https://api.intra.42.fr/oauth/authorize?${params}`;
	}

	async connect_intra(req: Request, res: Response, code: string) {
		// Get token
		const data = {
			code: code,
			client_id: '' + process.env.API_UID,
			client_secret: '' + process.env.API_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: `${ req.protocol }://${ req.hostname }:${process.env.PORT}/waiting`,
		}
		let request;
		try {
			request = await axios.post('https://api.intra.42.fr/oauth/token', data);
		} catch (error) {
			throw new HttpException(error.message + ' PS: INTRA token', error.response.status);
		}
		const access_token: string = request.data.access_token;
		// Get user infos
		const headers = {
			Authorization: `Bearer ${access_token}`,
		}
		try {
			request = await axios.get('https://api.intra.42.fr/v2/me', { headers, });
		} catch (error) {
			throw new HttpException(error.message + ' PS: INTRA info', error.response.status);
		}
		const createUserDto: CreateUserDto = {
			isTwoFactorAuthenticationEnabled: false,
			twoFactorAuthenticationSecret: undefined,
			login: request.data.login,
			username: request.data.login,
			urlImg: request.data.image.link,
			wallet: request.data.wallet,
			email: request.data.email,
		}
		this.connect(res, createUserDto);
	}

	async invite(res: Response,login: string) {
		const createUserDto: CreateUserDto = {
			isTwoFactorAuthenticationEnabled: false,
			twoFactorAuthenticationSecret: undefined,
			login: login,
			username: login,
			urlImg: 'https://docs.nestjs.com/assets/logo-small.svg',
			wallet: -1,
			email: login
		}
		this.connect(res, createUserDto);
	}

	private async connect(res: Response, createUserDto: CreateUserDto) {
		try {
			// Update database
			const user: User = await this.usersService.create_or_return(createUserDto.email, createUserDto);
			// Create JWT
			const jwt: string = await this.jwtService.signAsync({
				userId: user.id,
				userLogin: user.login,
				userEmail: user.email,
				isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
				isTwoFactorAuthenticated: false,
			});
			const ret: GOT.Login = {
				access_token: jwt,
				user:  user
			};
			console.log(jwt);
			res.header('Authorization', `Bearer ${ jwt }`);
			res.send(ret);
		} catch (error) {
			throw new HttpException(error.message + ' PS: jwt', error.status);
		}
	}

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
	
		const otpAuthUrl = authenticator.keyuri(
		  user.email,
		  `${process.env.APP_NAME}`,
		  secret,
		);
	
		await this.usersService.setTwoFactorAuthenticationSecret(
		  secret,
		  user.id,
		);
	
		return {
		  secret,
		  otpAuthUrl,
		};
	}

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		if (user.twoFactorAuthenticationSecret === undefined || user.twoFactorAuthenticationSecret === null)
			return false;
		console.log(user.twoFactorAuthenticationSecret)
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret,
		});
	}

	async loginWith2fa(userWithoutPsw: User) {
		const payload: jwtContent = {
			userId: userWithoutPsw.id,
			userLogin: userWithoutPsw.login,
			userEmail: userWithoutPsw.email,
			isTwoFactorAuthenticationEnabled: !!userWithoutPsw.isTwoFactorAuthenticationEnabled,
			isTwoFactorAuthenticated: true,
		};
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
