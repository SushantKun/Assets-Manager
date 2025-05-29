import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    tag_id!: number;

    @Column({ length: 255, unique: true })
    name!: string;

    @ManyToMany(() => Asset, (asset: Asset) => asset.tags)
    assets!: Asset[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 