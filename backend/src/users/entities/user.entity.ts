import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique: true} )
    idIntra: number;

    @Column( {unique: true} )
    login: string;

    @Column()
    username: string;

    @Column()
    urlImg: string;

    @Column()
    wallet: number;

}
