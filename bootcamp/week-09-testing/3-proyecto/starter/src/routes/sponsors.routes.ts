import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from '../controllers/sponsors.controller.js';

export const sponsorsRouter = Router();

sponsorsRouter.get('/',    getAllHandler);
sponsorsRouter.get('/:id', getByIdHandler);

sponsorsRouter.post('/',    authenticate, createHandler);
sponsorsRouter.put('/:id',  authenticate, updateHandler);
sponsorsRouter.delete('/:id', authenticate, deleteHandler);
