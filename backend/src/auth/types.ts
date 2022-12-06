interface jwtContent {
    userId: number;
    userLogin: string;
    isTwoFactorAuthenticationEnabled?: boolean;
    isTwoFactorAuthenticated?: boolean;
}