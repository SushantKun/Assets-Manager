import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    category_id!: number;

    @Column({ length: 255, unique: true })
    name!: string;

    @Column('text', { nullable: true })
    description!: string | null;

    @ManyToMany(() => Asset, (asset: Asset) => asset.categories)
    assets!: Asset[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 