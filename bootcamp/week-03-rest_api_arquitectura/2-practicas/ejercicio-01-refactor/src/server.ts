// ============================================
// SERVER — Entry point
// ============================================
import app from './app';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Health: http://localhost:${PORT}/health`);
  console.log(`[server] Products: http://localhost:${PORT}/api/v1/products`);
});
