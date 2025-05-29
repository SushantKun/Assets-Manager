import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        const connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            username: process.env.DB_USER || 'asset_manager_user',
            password: process.env.DB_PASSWORD || 'admin',
            database: process.env.DB_NAME || 'asset_manager'
        });

        console.log('✅ Database connection has been established successfully.');
        
        // Test query
        const result = await connection.query('SELECT 1 as test');
        console.log('✅ Test query executed successfully:', result);
        
        await connection.close();
        console.log('Connection closed.');
        
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

testConnection().catch(console.error); 