import { PartialType } from "@nestjs/swagger";
import { UserUserStatus } from "../types/user_user.types";

export class CreateRelUserDto {
    status!: UserUserStatus;
    user1Id!: number;
    user2Id!: number;
}
