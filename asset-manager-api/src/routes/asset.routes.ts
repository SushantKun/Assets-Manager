import { Router } from 'express';
import { AssetController } from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../config/multer.config';

const router = Router();
const assetController = new AssetController();

// All routes require authentication
router.use(authMiddleware);

// Upload new asset
router.post('/', upload.single('file'), assetController.upload);

// Get all assets (with pagination)
router.get('/', assetController.getAll);

// Get single asset
router.get('/:id', assetController.getOne);

// Update asset
router.put('/:id', upload.single('file'), assetController.update);

// Delete asset
router.delete('/:id', assetController.delete);

export const assetRouter = router; 