import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Asset } from './entities/asset.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'asset_manager',
    entities: [User, Asset, Category, Tag],
    synchronize: true,
    logging: true
}); 