import { PartialType } from "@nestjs/swagger";

export class CreateUserDto {
    twoFactorAuthenticationSecret?: string;
    isTwoFactorAuthenticationEnabled!: boolean;
    login!: string;
    username!: string;
    urlImg!: string;
    wallet!: number;
    email!: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
    id!: number;
    username!: string;
}
