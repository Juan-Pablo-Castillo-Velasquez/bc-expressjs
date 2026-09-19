import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../config/security.js';

const router = Router();

// ============================================
// PASO 3 (continuación): Aplicar authLimiter a login y register
// ============================================
// authLimiter es más estricto: solo 5 intentos por IP / 15 min.
// Protege contra brute force en endpoints de autenticación.
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);

export default router;
