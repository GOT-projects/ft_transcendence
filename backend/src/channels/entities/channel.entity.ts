import { Message } from "src/messages/entities/message.entity";
import { RelUserChannel } from "src/rel_user_channel/entities/rel_user_channel.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { channelStatus } from "../channels.types";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    name: string;

    @Column({
        type: "enum",
        enum: channelStatus,
        default: channelStatus.PUBLIC
    })
    status!: channelStatus;

    @Column({
        nullable: true,
    })
    password?: string;

    @OneToMany(() => Message, (message) => message.channelTo)
    messages: Message[];

    @OneToMany(() => RelUserChannel, (rel) => rel.user)
    usersRel: RelUserChannel[];

}
