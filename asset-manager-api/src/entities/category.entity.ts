import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Asset, asset => asset.category)
    assets: Asset[];
} 