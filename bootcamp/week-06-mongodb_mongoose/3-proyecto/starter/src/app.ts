// src/app.ts — Configuración de la aplicación Express
// Dominio: Radio Comunitaria

import express from 'express';
import sponsorsRouter from './routes/sponsors.routes';
import programsRouter from './routes/programs.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    week: '06',
    project: 'radio-comunitaria-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/sponsors', sponsorsRouter);
app.use('/api/v1/programs', programsRouter);

app.use(notFound);
app.use(errorHandler);
