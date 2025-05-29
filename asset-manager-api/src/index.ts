import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import assetsRouter from './routes/assets.routes';
import authRouter from './routes/auth.routes';
import categoriesRouter from './routes/categories.routes';
import tagsRouter from './routes/tags.routes';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/assets', assetsRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established successfully.');
        
        // Start server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

export default app; 