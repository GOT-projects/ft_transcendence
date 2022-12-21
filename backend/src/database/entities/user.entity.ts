import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";
import { Message } from "./message.entity";
import { RelBlock } from "./rel_block.entity";
import { RelFriend } from "./rel_friend.entity";
import { RelUserChannel } from "./rel_user_channel.entity";
import { GOT } from "shared/types";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({nullable: true, default: null})
	twoFactorAuthenticationSecret?: string;

	@Column()
	isTwoFactorAuthenticationEnabled!: boolean;

	@Column( {unique: true, nullable: false} )
	login!: string;
	/*
	@Column()
	username!: string;
	*/

	@Column()
	urlImg!: string;

	@Column()
	wallet!: number;

	@Column( {unique: true, nullable: false} )
	email!: string;

	@Column({
        type: "enum",
        enum: GOT.EnumBall,
        default: GOT.EnumBall.DEFAULT
    })
    ball!: GOT.EnumBall;

	@Column( {nullable: false, default: '#121212'} )
	color!: string;

	// Messages

	@OneToMany(() => Message, (message) => message.userFrom)
	messageFrom: Message[];

	@OneToMany(() => Message, (message) => message.userTo)
	messageTo: Message[];

	// Games

	@OneToMany(() => Game, (game) => game.user1)
	gamesPlayer1: Game[];

	@OneToMany(() => Game, (game) => game.user2)
	gamesPlayer2: Game[];

	// Channels

	@OneToMany(() => RelUserChannel, (rel) => rel.user)
	channelsRel: RelUserChannel[];

	// Friends

	@OneToMany(() => RelFriend, (rel) => rel.user1)
	users1Friend: RelFriend[];
	@OneToMany(() => RelFriend, (rel) => rel.user2)
	users2Friend: RelFriend[];

	// Block

	@OneToMany(() => RelBlock, (rel) => rel.userWhoBlock)
	userWhoBlock: RelBlock[];
	@OneToMany(() => RelBlock, (rel) => rel.userIdIsBlock)
	userIdIsBlock: RelBlock[];

}
