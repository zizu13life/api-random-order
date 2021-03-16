import { User } from "src/modules/user/entity/user";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    description: string;

    @ManyToOne(type => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    userId: number;

    @Column({ default: 1 })
    priority: number;

    @Column({ type: 'timestamp' })
    linkedAt: Date;

    @Column({ type: 'timestamp' })
    doneAt: Date;
}
