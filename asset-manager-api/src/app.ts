import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import assetsRouter from './routes/assets.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import categoriesRouter from './routes/categories.routes';
import tagsRouter from './routes/tags.routes';
import * as dotenv from 'dotenv';

dotenv.config();

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assets', assetsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    }); 