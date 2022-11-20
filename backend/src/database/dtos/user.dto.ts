import { PartialType } from "@nestjs/swagger";

export class CreateUserDto {
    idIntra?: number;
    login!: string;
    username!: string;
    urlImg!: string;
    wallet!: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
    id!: number;
    username!: string;
}
