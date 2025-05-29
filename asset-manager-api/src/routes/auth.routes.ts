import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Register new user
const registerHandler: RequestHandler = async (req, res, next) => {
    try {
        await authController.register(req, res);
    } catch (error) {
        next(error);
    }
};

// Login user
const loginHandler: RequestHandler = async (req, res, next) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        next(error);
    }
};

router.post('/register', registerHandler);
router.post('/login', loginHandler);

export default router; 