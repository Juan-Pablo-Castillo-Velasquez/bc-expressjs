// ============================================
// PASO 4: Middleware de Autenticación
// ============================================
//
// Lee el access token de la cookie HttpOnly y lo verifica.
// Si el token es válido, agrega el payload a req.user.

import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    next(new AppError(401, 'No autenticado'));
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      next(new AppError(401, 'Token expirado'));
      return;
    }
    next(new AppError(401, 'Token inválido'));
  }
}
