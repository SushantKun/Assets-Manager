import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Asset } from './entities/asset.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';

dotenv.config();

const testDataSource = new DataSource({
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

console.log('Database config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE
});

testDataSource.initialize()
    .then(() => {
        console.log('Database connection established successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }); 