// ============================================
// APP — configuración de Express
// Registra middlewares, rutas y manejo de errores
// en el ORDEN CORRECTO.
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import programsRouter from './routes/programs.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Middlewares generales
app.use(express.json());
app.use(morganMiddleware);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '04', project: 'radio-comunitaria-api' });
});

// 2. Rutas del dominio
app.use('/api/v1/programs', programsRouter);

// 3. notFound DESPUÉS de todas las rutas
app.use(notFound);

// 4. errorHandler como ÚLTIMO middleware (4 params)
app.use(errorHandler);

export default app;
