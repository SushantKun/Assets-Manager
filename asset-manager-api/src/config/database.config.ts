import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Asset } from '../entities/asset.entity';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { join } from 'path';

dotenv.config();

export const databaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'asset_manager',
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: true, // Set to false in production
    logging: true
}; 