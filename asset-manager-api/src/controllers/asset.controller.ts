import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Asset } from '../entities/asset.entity';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Like } from 'typeorm';

interface RequestWithUser extends Request {
    user: {
        userId: number;
        username: string;
    };
    file?: Express.Multer.File;
}

export class AssetController {
    private assetRepository = AppDataSource.getRepository(Asset);
    private userRepository = AppDataSource.getRepository(User);
    private categoryRepository = AppDataSource.getRepository(Category);
    private tagRepository = AppDataSource.getRepository(Tag);

    private getImageUrl(filename: string): string {
        // Get the server's base URL from environment variables or use a default
        const baseUrl = process.env.API_URL || 'http://localhost:3000';
        return `${baseUrl}/uploads/${filename}`;
    }

    // Upload a new asset
    async upload(req: RequestWithUser, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            const uploadedFile = req.file;

            if (!uploadedFile) {
                res.status(400).json({ 
                    success: false,
                    message: 'No file uploaded' 
                });
                return;
            }

            const asset = this.assetRepository.create({
                name,
                description,
                imageUrl: this.getImageUrl(uploadedFile.filename),
                file_path: uploadedFile.path,
                file_type: path.extname(uploadedFile.originalname),
                mime_type: uploadedFile.mimetype,
                size: uploadedFile.size,
                owner: { id: req.user.userId } as User
            });

            const savedAsset = await this.assetRepository.save(asset);

            res.status(201).json({
                success: true,
                asset: {
                    ...savedAsset,
                    imageUrl: this.getImageUrl(uploadedFile.filename)
                },
                message: 'Asset uploaded successfully'
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error creating asset';
            res.status(500).json({ 
                success: false,
                message: errorMessage 
            });
        }
    }

    // Get all assets (with pagination)
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const [assets, total] = await this.assetRepository.findAndCount({
                skip,
                take: limit,
                relations: ['owner', 'category', 'tags'],
                order: { createdAt: 'DESC' }
            });

            res.status(200).json({
                assets: assets.map(asset => ({
                    ...asset,
                    imageUrl: asset.imageUrl ? this.getImageUrl(path.basename(asset.imageUrl)) : null
                })),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Get single asset by ID
    async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const asset = await this.assetRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['owner', 'category', 'tags']
            });

            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            res.status(200).json({
                id: asset.id,
                name: asset.name,
                description: asset.description,
                serialNumber: asset.serialNumber,
                purchasePrice: asset.purchasePrice,
                purchaseDate: asset.purchaseDate,
                location: asset.location,
                imageUrl: asset.imageUrl,
                owner: {
                    id: asset.owner.id,
                    username: asset.owner.username
                },
                category: asset.category,
                tags: asset.tags,
                createdAt: asset.createdAt,
                updatedAt: asset.updatedAt
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Delete asset
    async delete(req: RequestWithUser, res: Response): Promise<void> {
        try {
            const assetId = parseInt(req.params.id);
            const userId = req.user?.userId;

            const asset = await this.assetRepository.findOne({
                where: { id: assetId, owner: { id: userId } }
            });

            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            // Delete the file if it exists
            const existingFile = asset.file_path;
            if (existingFile && fs.existsSync(path.join(__dirname, '../../uploads', existingFile))) {
                fs.unlinkSync(path.join(__dirname, '../../uploads', existingFile));
            }

            await this.assetRepository.remove(asset);
            res.json({ message: 'Asset deleted successfully' });
        } catch (error) {
            console.error('Error deleting asset:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Update asset
    async update(req: RequestWithUser, res: Response): Promise<void> {
        try {
            const assetId = parseInt(req.params.id);
            const userId = req.user?.userId;
            const { name, description, serialNumber, category: categoryId } = req.body;

            // Find the asset
            const asset = await this.assetRepository.findOne({
                where: { id: assetId, owner: { id: userId } },
                relations: ['category']
            });

            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            // Update basic fields
            asset.name = name;
            asset.description = description;
            asset.serialNumber = serialNumber;

            // Update category if provided
            if (categoryId) {
                const category = await this.categoryRepository.findOne({
                    where: { id: parseInt(categoryId) }
                });
                if (category) {
                    asset.category = category;
                }
            }

            // Handle file upload if provided
            if (req.file) {
                // Delete old file if it exists
                if (asset.file_path && fs.existsSync(path.join(__dirname, '../../uploads', asset.file_path))) {
                    fs.unlinkSync(path.join(__dirname, '../../uploads', asset.file_path));
                }

                // Update file information
                asset.file_path = req.file.filename;
                asset.file_type = path.extname(req.file.originalname);
                asset.mime_type = req.file.mimetype;
                asset.size = req.file.size;
            }

            const updatedAsset = await this.assetRepository.save(asset);
            res.json(updatedAsset);
        } catch (error) {
            console.error('Error updating asset:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAssets = async (req: Request, res: Response): Promise<Response> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const queryBuilder = this.assetRepository.createQueryBuilder('asset')
                .leftJoinAndSelect('asset.owner', 'owner')
                .leftJoinAndSelect('asset.category', 'category')
                .leftJoinAndSelect('asset.tags', 'tags');

            if (search) {
                queryBuilder.where('asset.name LIKE :search OR asset.description LIKE :search', {
                    search: `%${search}%`
                });
            }

            const [assets, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return res.json({
                assets,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error getting assets:', error);
            return res.status(500).json({ message: 'Error getting assets' });
        }
    };

    async getAllAssets(req: Request, res: Response): Promise<void> {
        try {
            const assets = await this.assetRepository.find();
            res.json(assets);
        } catch (error) {
            console.error('Error fetching assets:', error);
            res.status(500).json({ message: 'Error fetching assets' });
        }
    }

    async getAssetById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const asset = await this.assetRepository.findOne({
                where: { id: id },
                relations: ['owner', 'category', 'tags']
            });
            
            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            res.json(asset);
        } catch (error) {
            console.error('Error fetching asset:', error);
            res.status(500).json({ message: 'Error fetching asset' });
        }
    }

    async createAsset(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req.user as any).userId;
            const assetData = {
                ...req.body,
                owner: { id: userId }
            };

            const asset = await this.assetRepository.save(assetData);
            res.status(201).json(asset);
        } catch (error) {
            console.error('Error creating asset:', error);
            res.status(500).json({ message: 'Error creating asset' });
        }
    }

    async updateAsset(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const userId = (req.user as any).userId;
            const asset = await this.assetRepository.findOne({
                where: { id: id },
                relations: ['owner']
            });

            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            if (asset.owner.id !== userId) {
                res.status(403).json({ message: 'Not authorized to update this asset' });
                return;
            }

            const updatedAsset = await this.assetRepository.save({
                ...asset,
                ...req.body
            });
            res.json(updatedAsset);
        } catch (error) {
            console.error('Error updating asset:', error);
            res.status(500).json({ message: 'Error updating asset' });
        }
    }

    async deleteAsset(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const userId = (req.user as any).userId;
            const asset = await this.assetRepository.findOne({
                where: { id: id },
                relations: ['owner']
            });

            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            if (asset.owner.id !== userId) {
                res.status(403).json({ message: 'Not authorized to delete this asset' });
                return;
            }

            // Delete file from storage if it exists
            if (asset.imageUrl && fs.existsSync(path.join(__dirname, '../../uploads', path.basename(asset.imageUrl)))) {
                fs.unlinkSync(path.join(__dirname, '../../uploads', path.basename(asset.imageUrl)));
            }

            // Delete from database
            await this.assetRepository.remove(asset);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting asset:', error);
            res.status(500).json({ message: 'Error deleting asset' });
        }
    }

    // Download asset
    async download(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const asset = await this.assetRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!asset) {
                res.status(404).json({ message: 'Asset not found' });
                return;
            }

            // Get the file path
            const filePath = path.join(__dirname, '../../uploads', path.basename(asset.imageUrl));

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ message: 'File not found' });
                return;
            }

            // Set content disposition and send file
            res.setHeader('Content-Disposition', `attachment; filename=${path.basename(asset.imageUrl)}`);
            res.sendFile(filePath);
        } catch (error) {
            console.error('Download error:', error);
            res.status(500).json({ message: 'Error downloading file' });
        }
    }

    async getUserAssets(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req.user as any).userId;
            const assets = await this.assetRepository.find({
                where: { owner: { id: userId } },
                relations: ['owner', 'category', 'tags'],
                order: { createdAt: 'DESC' }
            });
            res.json(assets);
        } catch (error) {
            console.error('Error fetching user assets:', error);
            res.status(500).json({ message: 'Error fetching user assets' });
        }
    }
} 