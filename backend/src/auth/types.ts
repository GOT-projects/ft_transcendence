import { User } from "src/database/entities/user.entity";

export interface jwtContent {
    userId: number;
    userLogin: string;
    userEmail: string;
    isTwoFactorAuthenticationEnabled?: boolean;
    isTwoFactorAuthenticated?: boolean;
}

export interface JwtContent {
    user: User,
    isTwoFactorAuthenticationEnabled?: boolean;
    isTwoFactorAuthenticated?: boolean;
}
