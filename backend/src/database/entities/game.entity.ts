import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum gameStatus {
	IN_PROGRESS = 'IN_PROGRESS',
	FINISH = 'FINISH',
	DEMAND = `DEMAND`
}

export interface Rank {
	id: number;
	val: number;
	lose: number;
}

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	user1Id!: number;

	@Column()
	user2Id!: number;

	@Column({ default: 0 })
	points1!: number;

	@Column({ default: 0 })
	points2!: number;

	@Column({
		type: "enum",
		enum: gameStatus,
		default: gameStatus.IN_PROGRESS
	})
	status!: gameStatus;





	@ManyToOne(() => User, (user) => user.gamesPlayer1)
	@JoinColumn({ name: 'user1Id' })
	user1!: User;

	@ManyToOne(() => User, (user) => user.gamesPlayer2)
	@JoinColumn({ name: 'user2Id' })
	user2!: User;

}
