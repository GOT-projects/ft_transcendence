import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

export enum UserChannelStatus {
    MEMBER = 'MEMBER',
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    BAN = 'BAN'
}

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

    userId!: number;
    channelId!: number;

    @ManyToOne(() => User, (user) => user.channelsRel)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Channel, (channel) => channel.usersRel)
    @JoinColumn({ name: 'channelId' })
    channel!: Channel;

}
