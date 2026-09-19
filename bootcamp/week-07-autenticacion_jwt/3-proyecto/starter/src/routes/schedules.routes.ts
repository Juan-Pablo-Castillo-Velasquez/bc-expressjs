import { Router } from 'express';
import * as schedulesController from '../controllers/schedules.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// ============================================
// RUTAS: Schedule (Horario de emisión)
// ============================================
// Todas las rutas están protegidas con authMiddleware.

const router = Router();

// Todas las rutas de este router requieren autenticación
router.use(authMiddleware);

// GET /api/v1/schedules — listar todos
router.get('/', schedulesController.getAll);

// GET /api/v1/schedules/:id — obtener uno por ID
router.get('/:id', schedulesController.getById);

// POST /api/v1/schedules — crear uno nuevo
router.post('/', schedulesController.create);

// PATCH /api/v1/schedules/:id — actualizar parcialmente
router.patch('/:id', schedulesController.update);

// DELETE /api/v1/schedules/:id — eliminar
router.delete('/:id', schedulesController.remove);

export default router;
