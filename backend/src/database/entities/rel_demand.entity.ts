import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity()
export class RelDemand {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userIdDemand!: number;

    @Column({ nullable: true })
    userIdWhoDemand: number | null;

    @Column({nullable: true})
    channelIdWhoDemand: number | null;

    @ManyToOne(() => User, (user) => user.channelsRel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userIdDemand' })
    userDemand!: User;

    @ManyToOne(() => User, (user) => user.channelsRel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userIdWhoDemand' })
    userWhoDemand!: User;

    @ManyToOne(() => Channel, (channel) => channel.demands, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'channelIdWhoDemand'})
    channelWhoDemand?: Channel;
}
