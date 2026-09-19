import rateLimit from 'express-rate-limit';
import cors, { CorsOptions } from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import type { Request, Response, NextFunction } from 'express';

// Global limiter — all endpoints: 100 req / 15 min
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// Auth limiter — login/register only: 5 req / 15 min (brute force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

// CORS whitelist — add your frontend origin here
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3001',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Express 5 turned req.query into a getter-only property (it's now computed
// on demand from req.url — see express/lib/request.js). express-mongo-sanitize's
// own middleware does req[key] = sanitizedTarget for body/params/headers/query,
// which throws "Cannot set property query of #<IncomingMessage> which has only
// a getter" under Express 5.
// Its exported sanitize() helper mutates the target object IN PLACE (deletes/
// renames the prohibited keys directly on the object it's given) and returns
// that same reference, so calling it directly — without reassigning req.query —
// removes the same Mongo operators with identical protection, while staying
// compatible with Express 5's read-only req.query.
export function sanitizeInputs(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) mongoSanitize.sanitize(req.body as Record<string, unknown>);
  if (req.params) mongoSanitize.sanitize(req.params as Record<string, unknown>);
  if (req.query) mongoSanitize.sanitize(req.query as Record<string, unknown>);
  if (req.headers) mongoSanitize.sanitize(req.headers as Record<string, unknown>);
  next();
}
