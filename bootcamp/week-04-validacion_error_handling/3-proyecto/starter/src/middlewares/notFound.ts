// ============================================
// MIDDLEWARES — notFound
// ============================================
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// Middleware normal (3 params) — se registra DESPUÉS de todas las rutas.
// Cualquier request que no matcheó ninguna ruta llega aquí.
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.method} ${req.path} no encontrada`));
}
