import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

// Global error handler — always 4 arguments for Express to recognize it
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // A malformed payload fails zod's type check before it ever reaches a
  // service/DB call. Without this branch that surfaces as an unhandled 500
  // with a logged stack trace instead of a clean 400.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((issue) => issue.message),
    });
    return;
  }

  // Unexpected errors — never expose stack traces to clients
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
