// ============================================
// MIDDLEWARES — errorHandler (4 parámetros)
// ============================================
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import { ErrorResponse, ValidationErrorResponse } from '../types';

// Express detecta un error handler por tener EXACTAMENTE 4 parámetros.
// Debe ser el ÚLTIMO middleware registrado en app.ts.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Error de validación de Zod → 400
  if (err instanceof ZodError) {
    const response: ValidationErrorResponse = {
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      })),
    };
    res.status(400).json(response);
    return;
  }

  // 2. Error operacional del dominio → statusCode propio
  if (err instanceof AppError) {
    logger.warn(`AppError ${err.statusCode}: ${err.message}`);
    const response: ErrorResponse = {
      error: 'Application Error',
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // 3. Error genérico / no controlado → 500
  const isProduction = process.env['NODE_ENV'] === 'production';
  const message = err instanceof Error ? err.message : 'Error desconocido';
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error(`Unhandled error: ${message}`, { stack });

  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: isProduction ? 'Ha ocurrido un error inesperado' : message,
    ...(isProduction ? {} : { stack }),
  };
  res.status(500).json(response);
}
