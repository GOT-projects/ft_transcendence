import axios from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';

@Injectable()
export class AuthService {

    constructor (
        private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
    ) {}

    async getToken(userId: number){
        const [at, rt] = await Promise.all([
            //access token
            this.jwtService.signAsync({
                userId,
            },{
                //time in second
                secret: process.env.JWT_TTL,
                expiresIn:60 * 15,
            }),
            //refresh token
            this.jwtService.signAsync({
                userId,
            },{
                //time in second
                secret: process.env.JWT_TTL,
                expiresIn:60 * 15 * 24,
            })
        ])
        return ({
            access_token: at,
            refresh: rt,
        })
    }

    async connect_intra(req: Request, code: string): Promise<Tokens> {
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
			idIntra: request.data.id,
			login: request.data.login,
			username: request.data.login,
			urlImg: request.data.image.link,
			wallet: request.data.wallet,
		}
		// TODO 2FA
		try {
			// Update database
			const user: User = await this.usersService.add_or_update(createUserDto.idIntra, createUserDto);

            //Create JWT in header with Pass Startegy
            const tokens = await this.getToken(user.id); 
            console.log("token gen: ", tokens);
            return tokens;
		} catch (error) {
			throw new HttpException(error.message + ' PS: cookie token', error.status);
		}
    }
    async logout(userId:number){
        //database remome token access
    }
}
