import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class RelFriend {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user1Id!: number;

    @Column()
    user2Id!: number;

    @ManyToOne(() => User, (user) => user.users1Friend)
    @JoinColumn({ name: 'user1Id' })
    user1!: User;

    @ManyToOne(() => User, (user) => user.users2Friend)
    @JoinColumn({ name: 'user2Id' })
    user2!: User;
}
