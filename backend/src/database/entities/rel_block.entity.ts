import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class RelBlock {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	userIdWhoBlock!: number;

	@Column()
	userIdIsBlock!: number;







	@ManyToOne(() => User, (user) => user.userWhoBlock, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userIdWhoBlock' })
	userWhoBlock!: User;

	@ManyToOne(() => User, (user) => user.userIdIsBlock, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userIdIsBlock' })
	userIsBlock!: User;
}
