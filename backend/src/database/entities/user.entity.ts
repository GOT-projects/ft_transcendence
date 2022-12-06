import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";
import { Message } from "./message.entity";
import { RelUser } from "./rel_user.entity";
import { RelUserChannel } from "./rel_user_channel.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true, default: null})
    twoFactorAuthenticationSecret?: string;

    @Column( {unique: true} )
    login!: string;

    @Column()
    username!: string;

    @Column()
    urlImg!: string;

    @Column()
    wallet!: number;

    @Column()
    email!: string;

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
