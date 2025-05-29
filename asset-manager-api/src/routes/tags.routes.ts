import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { AppDataSource } from '../data-source';
import { Tag } from '../entities/tag.entity';

const router = Router();
const tagRepository = AppDataSource.getRepository(Tag);

// Get all tags
const getAllHandler: RequestHandler = async (req, res, next) => {
    try {
        const tags = await tagRepository.find();
        res.json(tags);
    } catch (error) {
        next(error);
    }
};

// Get tag by id
const getOneHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tag = await tagRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }

        res.json(tag);
    } catch (error) {
        next(error);
    }
};

// Create new tag
const createHandler: RequestHandler = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const tag = tagRepository.create({ name, description });
        await tagRepository.save(tag);
        res.status(201).json(tag);
    } catch (error) {
        next(error);
    }
};

// Update tag
const updateHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const tag = await tagRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }

        tag.name = name || tag.name;
        tag.description = description || tag.description;

        await tagRepository.save(tag);
        res.json(tag);
    } catch (error) {
        next(error);
    }
};

// Delete tag
const deleteHandler: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tag = await tagRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }

        await tagRepository.remove(tag);
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