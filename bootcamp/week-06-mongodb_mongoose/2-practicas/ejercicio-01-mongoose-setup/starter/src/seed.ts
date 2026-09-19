// ============================================
// Seed — Insertar datos de prueba en MongoDB
// ============================================
// Ejecutar con: pnpm seed

import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Product } from './models/product.model';

async function seed(): Promise<void> {
  await connectDB();

  await Product.deleteMany({});
  console.log('Collection cleared');

  await Product.insertMany([
    {
      name: 'Camiseta Polo Blanca',
      description: 'Camiseta polo de algodón 100%',
      price: 59900,
      stock: 25,
      sku: 'POLO-WHT-001',
    },
    {
      name: 'Sudadera Negra Premium',
      description: 'Sudadera con capucha y bolsillo frontal',
      price: 89900,
      stock: 15,
      sku: 'SWEAT-BLK-001',
    },
    {
      name: 'Jeans Slim Fit Azul',
      description: 'Jeans de corte slim en denim azul clásico',
      price: 119900,
      stock: 30,
      sku: 'JEAN-BLU-001',
    },
    {
      name: 'Zapatillas Running Pro',
      description: 'Zapatillas ligeras para correr',
      price: 189900,
      stock: 20,
      sku: 'SHOE-RUN-001',
    },
    {
      name: 'Gorra Deportiva',
      description: 'Gorra con visera curva y cierre ajustable',
      price: 39900,
      stock: 50,
      sku: 'CAP-SPT-001',
    },
  ]);

  console.log('Seed completed: 5 products inserted');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
