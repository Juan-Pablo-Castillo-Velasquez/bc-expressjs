// ============================================
// CONFIG — logger de Winston + stream para Morgan
// ============================================
import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';

const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
);

const prodFormat = format.combine(format.timestamp(), format.json());

export const logger = createLogger({
  level: isDev ? 'http' : 'warn',
  format: isDev ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
    ...(isDev
      ? []
      : [new transports.File({ filename: 'logs/error.log', level: 'error' })]),
  ],
});

// Redirige los logs de acceso HTTP de Morgan hacia Winston (nivel http)
export const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};

const morganFormat = isDev ? 'dev' : 'combined';
export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
