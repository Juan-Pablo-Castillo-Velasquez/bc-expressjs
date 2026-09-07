// src/app.ts — Ejercicio 02
// Registra productsRouter y categoriesRouter

import express from 'express';
import productsRouter from './routes/products.routes';
import categoriesRouter from './routes/categories.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
