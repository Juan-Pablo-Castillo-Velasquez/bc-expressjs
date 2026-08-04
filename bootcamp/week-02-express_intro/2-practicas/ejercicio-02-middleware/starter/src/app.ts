import express from 'express';
import type { Application } from 'express';
// import { logger } from './middlewares/logger.js';          // se importa en Paso 4
// import { auth } from './middlewares/auth.js';              // se importa en Paso 4
// import { errorHandler } from './middlewares/errorHandler.js'; // se importa en Paso 4

// Store en memoria para las pruebas
interface Item { id: number; name: string; }
const items: Item[] = [
  { id: 1, name: 'item de ejemplo' },
];

export function createApp(): Application {
  const app = express();

  // ============================================
  // PASO 4: Registrar middlewares en orden correcto
  // ============================================
  // Descomenta y ordena correctamente los middlewares:
  //
  // 1. Parseo de JSON
  app.use(express.json());
  //
  // 2. Logger (ver todas las peticiones)
  app.use(logger);
  //
  // 3. Auth (proteger rutas con API key)
  app.use(auth);
  //
  // 4. Rutas
  app.get('/api/v1/items', (_req, res) => { res.json(items); });
  app.post('/api/v1/items', (req, res) => {
    const newItem: Item = { id: items.length + 1, name: req.body.name as string };
    items.push(newItem);
    res.status(201).json(newItem);
  });
  //
  // 5. Handler de rutas no encontradas (404)
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  //
  // 6. Error handler — SIEMPRE el último app.use()
  app.use(errorHandler);

  return app;
}
