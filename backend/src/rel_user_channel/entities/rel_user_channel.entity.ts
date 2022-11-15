import { channel } from "diagnostics_channel";
import { Channel } from "src/channels/entities/channel.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserChannelStatus } from "../user_channel.types";

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
