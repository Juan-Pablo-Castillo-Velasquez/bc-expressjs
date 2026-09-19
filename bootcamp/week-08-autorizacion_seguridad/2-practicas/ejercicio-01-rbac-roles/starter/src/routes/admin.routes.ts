import { Router } from 'express';
import { listUsers, getStats } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// ============================================
// Rutas de admin protegidas con requireRole
// ============================================
//
// Todas las rutas de admin requieren:
//   1. Estar autenticado (authMiddleware)
//   2. Tener el role 'admin' (requireRole)
//
// El orden importa: authMiddleware DEBE ir ANTES que requireRole
// porque requireRole necesita req.user que es poblado por authMiddleware.
router.use(authMiddleware);
router.use(requireRole('admin'));

router.get('/users', listUsers);
router.get('/stats', getStats);

export default router;
