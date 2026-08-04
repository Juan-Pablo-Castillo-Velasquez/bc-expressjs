import type { Request, Response, NextFunction } from 'express';

// ============================================
// PASO 3: Error handler global
// ============================================
// Express reconoce el error handler por tener EXACTAMENTE 4 parámetros.
// Descomenta el siguiente export:

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // En producción: nunca exponer el stack trace al cliente
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[ERROR] ${err.message}`);
  if (isDev) console.error(err.stack);

  res.status(500).json({
    error: isDev ? err.message : 'Internal server error',
  });
}

// Placeholder: eliminar cuando descomentes el export de arriba
export function errorHandler(
  _err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(500).json({ error: 'Internal server error' });
}
