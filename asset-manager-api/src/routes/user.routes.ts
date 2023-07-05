import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

interface RequestWithUser extends Request {
    user: {
        userId: number;
        username: string;
    };
}

const router = Router();
const userController = new UserController();

// Update user profile
router.put('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.updateProfile(req as RequestWithUser, res);
  } catch (error) {
    next(error);
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.changePassword(req as RequestWithUser, res);
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.getProfile(req as RequestWithUser, res);
  } catch (error) {
    next(error);
  }
});

export default router; 