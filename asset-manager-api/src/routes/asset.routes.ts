import { Router, Request } from 'express';
import { AssetController } from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import * as path from 'path';

interface RequestWithUser extends Request {
    user: {
        userId: number;
        username: string;
    };
    file?: Express.Multer.File;
}

const router = Router();
const assetController = new AssetController();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Create new asset
router.post('/', authMiddleware, upload.single('file'), (req, res) => assetController.upload(req as RequestWithUser, res));

// Get all assets
router.get('/', authMiddleware, (req, res) => assetController.getAll(req as RequestWithUser, res));

// Get one asset
router.get('/:id', authMiddleware, (req, res) => assetController.getOne(req as RequestWithUser, res));

// Update asset
router.put('/:id', authMiddleware, upload.single('file'), (req, res) => assetController.update(req as RequestWithUser, res));

// Delete asset
router.delete('/:id', authMiddleware, (req, res) => assetController.delete(req as RequestWithUser, res));

export default router; 