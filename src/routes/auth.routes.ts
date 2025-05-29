import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Register new user
router.post('/register', (req: Request, res: Response, next: NextFunction) => authController.register(req, res));

// Login user
router.post('/login', (req: Request, res: Response, next: NextFunction) => authController.login(req, res));

export default router; 