import rateLimit from 'express-rate-limit';
import cors, { CorsOptions } from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import type { Request, Response, NextFunction } from 'express';

// ============================================
// Rate limiter global
// ============================================
// Aplica a TODOS los endpoints: máx 100 requests por IP cada 15 min.
// standardHeaders: 'draft-7' → headers RateLimit-* en todas las respuestas.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// ============================================
// Rate limiter para endpoints de auth
// ============================================
// Aplica SOLO a /login y /register: máx 5 intentos por IP cada 15 min.
// Protege contra ataques de fuerza bruta.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

// ============================================
// CORS con whitelist
// ============================================
// NUNCA usar cors() a secas → permite cualquier origen (inseguro).
// La whitelist permite solo orígenes conocidos.
// credentials: true es necesario para cookies HttpOnly.
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3001', // Otro cliente posible
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej. Postman, curl, server-to-server)
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

// ============================================
// PASO 5 (fix): sanitización compatible con Express 5
// ============================================
// Express 5 convirtió req.query en una propiedad solo-lectura (getter, calculada
// on-demand desde req.url — ver express/lib/request.js). El middleware por defecto
// de express-mongo-sanitize hace `req[key] = sanitizedTarget` para body/params/
// headers/query, lo que lanza "Cannot set property query of #<IncomingMessage>
// which has only a getter" bajo Express 5.
// Su helper exportado `sanitize()` muta el objeto EN SITIO (borra/renombra las
// keys prohibidas directamente sobre el objeto recibido) y devuelve esa misma
// referencia, así que llamarlo directamente — sin reasignar req.query — elimina
// los mismos operadores de Mongo con idéntica protección, compatible con Express 5.
export function sanitizeInputs(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) mongoSanitize.sanitize(req.body as Record<string, unknown>);
  if (req.params) mongoSanitize.sanitize(req.params as Record<string, unknown>);
  if (req.query) mongoSanitize.sanitize(req.query as Record<string, unknown>);
  if (req.headers) mongoSanitize.sanitize(req.headers as Record<string, unknown>);
  next();
}
