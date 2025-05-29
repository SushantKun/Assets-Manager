import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AssetController } from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';

const router = Router();
const assetController = new AssetController();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Get all assets
const getAllHandler: RequestHandler = async (req, res, next) => {
    try {
        await assetController.getAll(req, res);
    } catch (error) {
        next(error);
    }
};

// Get asset by id
const getOneHandler: RequestHandler = async (req, res, next) => {
    try {
        await assetController.getOne(req, res);
    } catch (error) {
        next(error);
    }
};

// Create new asset
const createHandler: RequestHandler = async (req: any, res, next) => {
    try {
        await assetController.upload(req, res);
    } catch (error) {
        next(error);
    }
};

// Update asset
const updateHandler: RequestHandler = async (req: any, res, next) => {
    try {
        await assetController.update(req, res);
    } catch (error) {
        next(error);
    }
};

// Delete asset
const deleteHandler: RequestHandler = async (req: any, res, next) => {
    try {
        await assetController.delete(req, res);
    } catch (error) {
        next(error);
    }
};

// Download asset
const downloadHandler: RequestHandler = async (req, res, next) => {
    try {
        await assetController.download(req, res);
    } catch (error) {
        next(error);
    }
};

// Get user's assets
router.get('/user', authMiddleware, async (req, res, next) => {
  try {
    await assetController.getUserAssets(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, getAllHandler);
router.get('/:id', authMiddleware, getOneHandler);
router.get('/:id/download', authMiddleware, downloadHandler);
router.post('/', authMiddleware, upload.single('file'), createHandler);
router.put('/:id', authMiddleware, upload.single('file'), updateHandler);
router.delete('/:id', authMiddleware, deleteHandler);

export default router; 