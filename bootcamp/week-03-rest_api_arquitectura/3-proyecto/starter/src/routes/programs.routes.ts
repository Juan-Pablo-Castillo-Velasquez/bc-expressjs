// ============================================
// ROUTES — Mapeo de URLs a controllers
// ============================================
import { Router } from 'express';
import * as controller from '../controllers/programs.controller';

export const programsRouter = Router();

programsRouter.get('/', controller.getAll);
programsRouter.get('/:id', controller.getById);
programsRouter.post('/', controller.create);
programsRouter.put('/:id', controller.update);
programsRouter.delete('/:id', controller.remove);
