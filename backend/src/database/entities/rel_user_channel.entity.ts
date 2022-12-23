import { GOT } from "shared/types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity()
export class RelUserChannel {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		type: "enum",
		enum: GOT.UserChannelStatus,
		default: GOT.UserChannelStatus.MEMBER
	})
	status!: GOT.UserChannelStatus;

	@Column()
	userId!: number;
	@Column()
	channelId!: number;

	@ManyToOne(() => User, (user) => user.channelsRel, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User;

	@ManyToOne(() => Channel, (channel) => channel.usersRel, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'channelId' })
	channel!: Channel;

}
