import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserChannelStatus } from "../types/user_channel.types";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity()
export class RelUserChannel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: UserChannelStatus,
        default: UserChannelStatus.MEMBER
    })
    status!: UserChannelStatus;

    @ManyToOne(() => User, (user) => user.channelsRel)
    user!: User;

    @ManyToOne(() => Channel, (channel) => channel.usersRel)
    channel!: Channel;

}
