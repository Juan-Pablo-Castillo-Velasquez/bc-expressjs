// ============================================
// ERRORS — AppError (errores operacionales del dominio)
// ============================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Mantiene la cadena de prototipos correcta al extender una clase nativa
    Object.setPrototypeOf(this, new.target.prototype);
    // Excluye el constructor del stack trace para mayor claridad
    Error.captureStackTrace(this, this.constructor);
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
