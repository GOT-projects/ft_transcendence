import { GOT } from "shared/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { RelDemand } from "./rel_demand.entity";
import { RelUserChannel } from "./rel_user_channel.entity";


@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    name!: string;

    @Column({
        type: "enum",
        enum: GOT.ChannelStatus,
        default: GOT.ChannelStatus.PUBLIC
    })
    status!: GOT.ChannelStatus;

    @Column({
        nullable: true,
    })
    password?: string;







    @OneToMany(() => Message, (message) => message.channelTo)
    messages: Message[];

    @OneToMany(() => RelUserChannel, (rel) => rel.user)
    usersRel: RelUserChannel[];

    @OneToMany(() => RelUserChannel, (rel) => rel.channel)
    demands: RelDemand[];
}
