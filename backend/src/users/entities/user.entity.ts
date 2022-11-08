import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique: true} )
    idIntra: number;

    @Length(2, 15)
    @Column( {unique: true} )
    login: string;

    @Column()
    username: string;

    @Column()
    urlImg: string;

    @Column()
    wallet: number;

}
