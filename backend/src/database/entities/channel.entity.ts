import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { channelStatus } from "../types/channels.types";
import { Message } from "./message.entity";
import { RelUserChannel } from "./rel_user_channel.entity";

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
