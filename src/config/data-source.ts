import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'asset_manager_db',
    synchronize: false, // Set to false in production
    logging: process.env.NODE_ENV === 'development',
    entities: [path.join(__dirname, '..', 'entities', '*.{ts,js}')],
    migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    subscribers: [],
}); 