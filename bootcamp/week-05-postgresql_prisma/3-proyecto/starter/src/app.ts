// src/app.ts — Configuración de la aplicación Express
// Dominio: Radio Comunitaria

import express from 'express';
import itemsRouter from './routes/items.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    week: '05',
    project: 'radio-comunitaria-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/programs', itemsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
