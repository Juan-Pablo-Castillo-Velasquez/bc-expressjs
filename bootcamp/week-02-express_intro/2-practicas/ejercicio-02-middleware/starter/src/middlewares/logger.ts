import type { Request, Response, NextFunction } from 'express';

// ============================================
// PASO 1: Middleware de logging
// ============================================
// Este middleware registra cada petición: método, URL, status code y tiempo.
// Descomenta el siguiente export:

export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // El evento 'finish' se dispara cuando Express termina de enviar la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.url} → ${res.statusCode} (${duration}ms)`);
  });

  next();
}

// Placeholder: eliminar cuando descomentes el export de arriba
export function logger(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
