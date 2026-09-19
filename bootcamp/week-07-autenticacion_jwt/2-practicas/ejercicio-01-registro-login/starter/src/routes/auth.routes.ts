// ============================================
// PASO 5: Rutas de Autenticación
// ============================================
//
// La ruta GET /me debe estar protegida por authMiddleware.

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// PASO 5: Ruta protegida
router.get('/me', authMiddleware, authController.me);

export { router as authRouter };
