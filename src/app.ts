import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes (to be added)
// app.use('/api/auth', authRoutes);
// app.use('/api/assets', assetRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/tags', tagRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

export default app; 