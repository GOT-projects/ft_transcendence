import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { validate } from "class-validator";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
        super({
            clientID: process.env.API_UID,
            clientSecret: process.env.API_SECRET,
            callbackURL: 'http://localhost:3000',
            scope: 'public',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        console.log('accessToken', accessToken);
        console.log('refreshToken',refreshToken);
        console.log('profile', profile);/*
        const user = await this.authService.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName,
        });
        console.log('Validate');
        console.log(user);*/
        return /*user || */null;
    }
}