import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message!: string;

    @Column()
    userIdFrom!: number;

    @Column({nullable: true})
    userIdTo: number | null;

    @Column({nullable: true})
    channelIdTo: number | null;

    @ManyToOne(() => User, (user) => user.messageFrom, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'userIdFrom'})
    userFrom!: User;

    @ManyToOne(() => User, (user) => user.messageTo, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'userIdTo'})
    userTo?: User;

    @ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'channelIdTo'})
    channelTo?: Channel;
}
