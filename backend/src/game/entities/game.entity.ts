import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column()
    user1Id!: number;

    @Column()
    user2Id!: number;

    @ManyToOne(() => User, (user) => user.gamesPlayer1)
    @JoinColumn({ name: 'user1Id' })
    user1!: User;

    @ManyToOne(() => User, (user) => user.gamesPlayer2)
    @JoinColumn({ name: 'user2Id' })
    user2!: User;

    @Column({
        type: "enum",
        enum: gameStatus,
        default: gameStatus.IN_PROGRESS
    })
    status!: gameStatus;
}
