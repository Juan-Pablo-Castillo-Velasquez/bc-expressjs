// ============================================
// PASO 1: Arrancar el servidor Express
// ============================================
// Descomenta todo el bloque siguiente:

import { createApp } from './app.js';

const PORT = process.env.PORT ?? '3000';
const app = createApp();

app.listen(Number(PORT), () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
