// ============================================
// APP — Configuración Express
// ============================================
// Al inicio del ejercicio usamos la app-flat para
// verificar que el servidor arranca correctamente.
//
// A medida que avanzas en los pasos, este archivo
// se actualiza automáticamente al descomenta las rutas.

import express from 'express';
import { productsRouter } from './routes/products.routes';

const app = express();

app.use(express.json());

// Ruta de salud — siempre disponible
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '03', exercise: '01-refactor' });
});

// Las rutas de productos se activarán cuando completes el Paso 4
app.use('/api/v1/products', productsRouter);

// Error handler básico
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
