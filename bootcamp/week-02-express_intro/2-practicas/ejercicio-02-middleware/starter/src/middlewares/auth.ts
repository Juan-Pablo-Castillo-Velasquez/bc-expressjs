import type { Request, Response, NextFunction } from 'express';

// ============================================
// PASO 2: Middleware de autenticación por API key
// ============================================
// Verifica que la petición incluye el header 'x-api-key' con un valor válido.
// Descomenta el siguiente export:

export function auth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}

// Placeholder: eliminar cuando descomentes el export de arriba
export function auth(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
