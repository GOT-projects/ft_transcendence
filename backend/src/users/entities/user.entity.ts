import { Length } from "class-validator";
import { Game } from "src/game/entities/game.entity";
import { Message } from "src/messages/entities/message.entity";
import { RelUser } from "src/rel_users/entities/rel_user.entity";
import { RelUserChannel } from "src/rel_user_channel/entities/rel_user_channel.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column( {unique: true, nullable: true} )
    idIntra?: number;

    @Column( {unique: true} )
    login!: string;

    @Column()
    username!: string;

    @Column()
    urlImg: string;

    @Column()
    wallet: number;

    @OneToMany(() => Message, (message) => message.userFrom)
    messageFrom: Message[];

    @OneToMany(() => Message, (message) => message.userTo)
    messageTo: Message[];

    @OneToMany(() => Game, (game) => game.user1)
    gamesPlayer1: Game[];

    @OneToMany(() => Game, (game) => game.user2)
    gamesPlayer2: Game[];

    @OneToMany(() => RelUserChannel, (rel) => rel.user)
    channelsRel: RelUserChannel[];

    @OneToMany(() => RelUser, (rel) => rel.user1)
    users1Rel: RelUser[];
    @OneToMany(() => RelUser, (rel) => rel.user2)
    users2Rel: RelUser[];

    

}
