// ============================================
// Seed — categorías y productos relacionados
// ============================================
// IMPORTANTE: las categorías se insertan ANTES que los productos,
// porque los productos necesitan los _id de las categorías.

import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Category } from './models/category.model';
import { Product } from './models/product.model';

async function seed(): Promise<void> {
  await connectDB();

  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('Collections cleared');

  const [ropa, calzado, accesorios] = await Category.insertMany([
    { name: 'Ropa' },
    { name: 'Calzado' },
    { name: 'Accesorios' },
  ]);
  console.log('Categories inserted');

  await Product.insertMany([
    {
      name: 'Camiseta Polo Blanca',
      description: 'Camiseta polo de algodón 100%',
      price: 59900,
      stock: 25,
      sku: 'POLO-WHT-001',
      category: ropa._id,
    },
    {
      name: 'Sudadera Negra Premium',
      description: 'Sudadera con capucha y bolsillo frontal',
      price: 89900,
      stock: 15,
      sku: 'SWEAT-BLK-001',
      category: ropa._id,
    },
    {
      name: 'Zapatillas Running Pro',
      description: 'Zapatillas ligeras para correr',
      price: 189900,
      stock: 20,
      sku: 'SHOE-RUN-001',
      category: calzado._id,
    },
    {
      name: 'Gorra Deportiva',
      description: 'Gorra con visera curva y cierre ajustable',
      price: 39900,
      stock: 50,
      sku: 'CAP-SPT-001',
      category: accesorios._id,
    },
  ]);
  console.log('Seed completed: 3 categories + 4 products inserted');

  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
