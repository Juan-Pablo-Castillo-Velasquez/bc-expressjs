import { Router } from 'express';
import {
  getHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost,
} from '../controllers/host.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// Políticas de acceso del dominio "Radio Comunitaria":
//   - GET / y GET /:id son públicos: cualquiera puede ver el directorio de locutores
//   - POST requiere autenticación
//   - PATCH requiere autenticación (el service verifica dueño o admin)
//   - DELETE solo admin
//
// IMPORTANTE: requireRole SIEMPRE después de authMiddleware

// GET all — público
router.get('/', getHosts);

// GET by ID — público
router.get('/:id', getHostById);

// POST — crear recurso requiere autenticación
router.post('/', authMiddleware, createHost);

// PATCH — actualizar: autenticado (service verifica si es dueño o admin)
router.patch('/:id', authMiddleware, updateHost);

// DELETE — eliminar: solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), deleteHost);

export default router;
