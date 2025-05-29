import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    serialNumber: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    purchasePrice: number;

    @Column({ nullable: true })
    purchaseDate: Date;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    file_path: string;

    @Column({ nullable: true })
    file_type: string;

    @Column({ nullable: true })
    mime_type: string;

    @Column({ type: 'bigint', nullable: true })
    size: number;

    @ManyToOne(() => User, user => user.assets)
    owner: User;

    @ManyToOne(() => Category, category => category.assets, { nullable: true })
    category: Category;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 