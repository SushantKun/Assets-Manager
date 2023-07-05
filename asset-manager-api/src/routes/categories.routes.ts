import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/category.entity';
import { authMiddleware } from '../middleware/auth.middleware';

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

// Get one category
const getOneHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        res.json(category);
    } catch (error) {
        next(error);
    }
};

// Create category
const createHandler: RequestHandler = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = categoryRepository.create({ name });
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
        const { name } = req.body;

        const category = await categoryRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        category.name = name;
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
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        await categoryRepository.remove(category);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Routes
router.get('/', authMiddleware, getAllHandler);
router.get('/:id', authMiddleware, getOneHandler);
router.post('/', authMiddleware, createHandler);
router.put('/:id', authMiddleware, updateHandler);
router.delete('/:id', authMiddleware, deleteHandler);

export default router; 