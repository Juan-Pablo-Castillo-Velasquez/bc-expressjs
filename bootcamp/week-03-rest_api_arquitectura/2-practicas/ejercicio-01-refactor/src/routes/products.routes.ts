// ============================================
// ROUTES — Paso 4: mapeo de rutas
// ============================================
// Las rutas solo conectan URLs con controllers.
// No deben contener nada de lógica.

import { Router } from 'express';
import * as controller from '../controllers/products.controller';

export const productsRouter = Router();

productsRouter.get('/', controller.getAll);
productsRouter.get('/:id', controller.getById);
productsRouter.post('/', controller.create);
productsRouter.put('/:id', controller.update);
productsRouter.delete('/:id', controller.remove);
