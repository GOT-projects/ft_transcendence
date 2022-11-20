import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column()
    user1Id!: number;

    @Column()
    user2Id!: number;

    @ManyToOne(() => User, (user) => user.channelsRel)
    @JoinColumn({ name: 'user1Id' })
    user1!: User;

    @ManyToOne(() => User, (user) => user.channelsRel)
    @JoinColumn({ name: 'user2Id' })
    user2!: User;
}
