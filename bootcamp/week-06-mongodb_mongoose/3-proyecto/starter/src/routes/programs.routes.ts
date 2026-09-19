// src/routes/programs.routes.ts — Rutas CRUD de Program

import { Router } from 'express';
import * as ctrl from '../controllers/programs.controller';

const router = Router();

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getById);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
