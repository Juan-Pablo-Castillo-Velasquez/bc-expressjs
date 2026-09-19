import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter, corsOptions, sanitizeInputs } from './config/security.js';

const app = express();

// ============================================
// PASO 1: Helmet — security headers
// ============================================
// helmet() aplica 12 headers de seguridad HTTP por defecto.
// DEBE ir ANTES de cualquier ruta o middleware de negocio.
app.use(helmet());

// ============================================
// PASO 2 (continuación): Aplicar rate limiter global
// ============================================
app.use(globalLimiter);

// ============================================
// PASO 4 (continuación): Aplicar CORS con opciones
// ============================================
app.options('*splat', cors(corsOptions)); // handle preflight for all routes
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================
// PASO 5: express-mongo-sanitize
// ============================================
// Elimina operadores MongoDB ($gt, $where, etc.) de body, query y params.
// DEBE ir DESPUÉS de express.json() y ANTES de las rutas.
// De lo contrario los inputs ya llegan como objetos parseados con los operadores.
app.use(sanitizeInputs);

// Health check — ruta pública sin auth
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);

export { app };
