import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserUserStatus } from "../types/user_user.types";
import { User } from "./user.entity";

@Entity()
export class RelUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: UserUserStatus,
        default: UserUserStatus.FRIEND
    })
    status!: UserUserStatus;

    @ManyToOne(() => User, (user) => user.channelsRel)
    user1!: User;

    @ManyToOne(() => User, (user) => user.channelsRel)
    user2!: User;
}
