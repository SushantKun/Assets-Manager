import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';

interface JwtPayload {
    id: number;
    email: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

        // Get user from database
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { user_id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}; 