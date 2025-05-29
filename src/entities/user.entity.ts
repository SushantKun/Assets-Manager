import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column({ length: 255, unique: true })
    username!: string;

    @Column({ length: 255, unique: true })
    email!: string;

    @Column({ length: 255 })
    password_hash!: string;

    @OneToMany(() => Asset, (asset: Asset) => asset.user)
    assets!: Asset[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 