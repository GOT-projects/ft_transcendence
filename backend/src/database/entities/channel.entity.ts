import { GOT } from "shared/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { RelDemand } from "./rel_demand.entity";
import { RelUserChannel } from "./rel_user_channel.entity";
import * as bcrypt from 'bcrypt';

export async function hashChannelPass(pass?: string) {
	if (pass === undefined) {
		return undefined;
	}
	return await bcrypt.hash(pass, 10);
}

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


	async setPassword(pass?: string) {
		this.password = await hashChannelPass(pass);
	}

	async checkPassword(pass?: string) {
		if (pass === undefined) {
			if (pass === this.password)
				return true;
			return false;
		}
		if (this.password === undefined) {
			if (pass === this.password)
				return true;
			return false;
		}
		return await bcrypt.compare(pass, this.password);
	}
}
