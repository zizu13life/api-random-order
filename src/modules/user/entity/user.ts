import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  googleId?: string;

  @Column()
  avatar: string;

  @Column({ default: true })
  isActive: boolean;


  @Column({ default: false })
  isAdmin: boolean;
}

/**
 * )))
 */
export enum UserPermissions {
  ADMIN,
}