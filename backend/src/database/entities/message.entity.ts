import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message!: number;

    @ManyToOne(() => User, (user) => user.messageFrom)
    userFrom!: User;

    @ManyToOne(() => User, (user) => user.messageTo)
    userTo: User;

    @ManyToOne(() => Channel, (channel) => channel.messages)
    channelTo: Channel;
}
