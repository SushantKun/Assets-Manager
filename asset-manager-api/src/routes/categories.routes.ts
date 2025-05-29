import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/category.entity';

const router = Router();
const categoryRepository = AppDataSource.getRepository(Category);

// Get all categories
const getAllHandler: RequestHandler = async (req, res, next) => {
    try {
        const categories = await categoryRepository.find();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// Get category by id
const getOneHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['assets']
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        next(error);
    }
};

// Create new category
const createHandler: RequestHandler = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const category = categoryRepository.create({ name, description });
        await categoryRepository.save(category);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

// Update category
const updateHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await categoryRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = name || category.name;
        category.description = description || category.description;

        await categoryRepository.save(category);
        res.json(category);
    } catch (error) {
        next(error);
    }
};

// Delete category
const deleteHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await categoryRepository.remove(category);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

router.get('/', authMiddleware, getAllHandler);
router.get('/:id', authMiddleware, getOneHandler);
router.post('/', authMiddleware, createHandler);
router.put('/:id', authMiddleware, updateHandler);
router.delete('/:id', authMiddleware, deleteHandler);

export default router; 