//import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import { encode, stringify } from 'querystring';
import { catchError, firstValueFrom } from 'rxjs';
import { json } from 'stream/consumers';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userInfo } from 'os';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @Post('connect_intra')
    async connect_intra(@Req() req: any, @Res() res: any, @Body('code') code: string) {
		if (!code)
			throw new HttpException('empty code', HttpStatus.BAD_REQUEST);
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
			throw new HttpException(error.message + ' PS: INTRA token', error.status);
		}
		const access_token: string = request.data.access_token;
		// Get user infos
		const headers = {
			Authorization: `Bearer ${access_token}`,
		}
		try {
			request = await axios.get('https://api.intra.42.fr/v2/me', { headers, });
		} catch (error) {
			throw new HttpException(error.message + ' PS: INTRA info', error.status);
		}
		const createUserDto: CreateUserDto = {
			idIntra: request.data.id,
			login: request.data.login,
			username: request.data.login,
			urlImg: request.data.image.link,
			wallet: request.data.wallet,
		}
		// Update database
		const user = await this.usersService.add_or_update(createUserDto.idIntra, createUserDto);
		// Create JWT
		let url = new URL(`${ req.protocol }://${ req.hostname }`);
        url.port = '' + process.env.PORT;
        url.pathname = '/';
        url.searchParams.set('code', access_token);
		console.log(url.href);
        res.status(302).redirect(url.href);
        /*
        let result: any;
		try {
			const postData = {
				grant_type: 'authorization_code',
				client_id: process.env.VITE_FT_UID,
				client_secret: process.env.FT_SECRET,
				code: req.body.code,
				// redirect_uri: process.env.VITE_FT_OAUTH_REDIRECT
				redirect_uri: `${getFrontRelativeURL(req)}/login`
			};
			const url = process.env.FT_API;
			result = await axios.post(url, postData);
		} catch (err42) {
			Logger.error(`Unable to connect to 42 API Verify UID, Secret env vars and relative redirect URI ${getFrontRelativeURL(req)}/login : ${err42.message}`, 'API42');
			throw new ForbiddenException("Unauthorized - Unable to connect to 42 API");
		}

		let userInfo: any;
		try {
			const headersRequest = { Authorization: 'Bearer ' + result.data.access_token };
			userInfo = await axios.get(process.env.FT_API_ME, { headers: headersRequest });
		} catch (err42) {
			throw new ForbiddenException("Unauthorized - Unable to get your infos with 42 API");
		}
		const { user, userAuth } = await this.authService.UserConnecting(userInfo);
		delete userAuth.twoFactorSecret;

		if (!user)
			throw new BadRequestException('User is null');

		if (userAuth.has_2fa === true) {
			const jwtToken2FA: string = await this.authService.createTFAToken(user.id);
			userAuth.token_jwt = jwtToken2FA;
			res.json({ auth: userAuth });
		}
		else
			res.json({ auth: userAuth, user: user });
        let url = new URL(`${ req.protocol }://${ req.hostname }`);
        url.port = process.env.PORT;
        url.pathname = '/';
        url.searchParams.set('code', token);

        res.status(302).redirect(url.href);*/
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
