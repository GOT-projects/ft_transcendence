import { User } from "src/database/entities/user.entity";

export interface jwtContent {
	userId: number;
	userLogin: string;
	userEmail: string;
	isTwoFactorAuthenticationEnabled?: boolean;
	isTwoFactorAuthenticated?: boolean;
}

export interface jwtContentComplete {
	userId: number;
	userLogin: string;
	userEmail: string;
	isTwoFactorAuthenticationEnabled?: boolean;
	isTwoFactorAuthenticated?: boolean;
	iat: number;
	exp: number;
}

export interface JwtContent {
	user: User,
	isTwoFactorAuthenticationEnabled?: boolean;
	isTwoFactorAuthenticated?: boolean;
	newUser: boolean;
}
