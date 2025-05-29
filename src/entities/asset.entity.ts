import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('assets')
export class Asset {
    @PrimaryGeneratedColumn()
    asset_id!: number;

    @Column({ length: 255 })
    title!: string;

    @Column('text', { nullable: true })
    description!: string | null;

    @Column({ length: 1024 })
    file_path!: string;

    @Column({ length: 50 })
    file_type!: string;

    @Column({ length: 100 })
    mime_type!: string;

    @Column('int')
    size!: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    upload_date!: Date;

    @ManyToOne(() => User, (user: User) => user.assets, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToMany(() => Category, (category: Category) => category.assets)
    @JoinTable({
        name: 'asset_categories',
        joinColumn: { name: 'asset_id', referencedColumnName: 'asset_id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'category_id' }
    })
    categories!: Category[];

    @ManyToMany(() => Tag, (tag: Tag) => tag.assets)
    @JoinTable({
        name: 'asset_tags',
        joinColumn: { name: 'asset_id', referencedColumnName: 'asset_id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' }
    })
    tags!: Tag[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 