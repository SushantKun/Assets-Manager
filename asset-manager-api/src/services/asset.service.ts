import { AppDataSource } from '../data-source';
import { Asset } from '../entities/asset.entity';
import { User } from '../entities/user.entity';

export class AssetService {
    private assetRepository = AppDataSource.getRepository(Asset);
    private userRepository = AppDataSource.getRepository(User);

    async findAll(): Promise<Asset[]> {
        return this.assetRepository.find({
            relations: ['owner', 'category', 'tags']
        });
    }

    async findById(id: number): Promise<Asset | null> {
        return this.assetRepository.findOne({
            where: { id },
            relations: ['owner', 'category', 'tags']
        });
    }

    async create(data: Partial<Asset>): Promise<Asset> {
        const asset = this.assetRepository.create({
            ...data,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate.toString()) : new Date(),
            isActive: true
        });
        return this.assetRepository.save(asset);
    }

    async update(id: number, data: Partial<Asset>): Promise<Asset | null> {
        const asset = await this.findById(id);
        if (!asset) {
            return null;
        }

        if (data.purchaseDate) {
            data.purchaseDate = new Date(data.purchaseDate.toString());
        }

        Object.assign(asset, data);
        return this.assetRepository.save(asset);
    }

    async delete(id: number): Promise<void> {
        const asset = await this.findById(id);
        if (asset) {
            await this.assetRepository.remove(asset);
        }
    }
} 