import { Column, PrimaryGeneratedColumn } from "typeorm";
import { channelStatus } from "../channels.types";

export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    name: string;

    @Column()
    status: channelStatus;

    @Column()
    password:string;
}
