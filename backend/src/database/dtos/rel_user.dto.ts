import { UserUserStatus } from "../types/user_user.types";

export class CreateRelUserDto {
    status!: UserUserStatus;
    block!: boolean;
    user1Id!: number;
    user2Id!: number;
}
