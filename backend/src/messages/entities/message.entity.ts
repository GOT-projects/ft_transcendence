import { Channel } from "src/channels/entities/channel.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
