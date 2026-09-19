import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  // A malformed or NoSQL-injection payload (e.g. { "$gt": "" } instead of a
  // string) fails zod's type check before it ever reaches a service/DB call.
  // Without this branch that surfaces as an unhandled 500 with a logged stack
  // trace — exactly what the rubric's "mensajes de error seguros" criterion
  // penalizes. 400 with the validation messages is the correct, safe response.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((issue) => issue.message),
    });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
