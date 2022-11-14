import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { gameStatus } from "../game.types";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column( {
        default: 0
    } )
    points1!: number;

    @Column( {
        default: 0
    } )
    points2!: number;

    @Column( {
        default: 0
    } )
    posBall!: number;

    @Column( {
        default: 0
    } )
    posPlayer1!: number;

    @Column( {
        default: 0
    } )
    posPlayer2!: number;

    @Column()
    sockUser1!: string;

    @Column()
    sockUser2!: string;

    @ManyToOne(() => User, (user) => user.gamesPlayer1)
    user1!: User;

    @ManyToOne(() => User, (user) => user.gamesPlayer2)
    user2!: User;

    @Column({
        type: "enum",
        enum: gameStatus,
        default: gameStatus.IN_PROGRESS
    })
    status!: gameStatus;
}
