import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                username: string;
            };
        }
    }
}

export const authMiddleware: RequestHandler = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        // Verify token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; username: string };

        // Add user info to request
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}; 