import { User } from "src/modules/user/entity/user";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(type => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    userId: number;

    @Column({ default: 1 })
    priority: number;

    @Column({ type: 'timestamp', nullable: true })
    linkedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    doneAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    rejectedAt: Date;

    @ManyToOne(type => User)
    @JoinColumn()
    rejectedBy: User;

    @Column({ nullable: true })
    rejectedById: number;

    @Column({ type: 'timestamp' })
    createdAt: Date;
}
