// prisma/seed.ts — Datos iniciales para desarrollo
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos previos para idempotencia
  await prisma.product.deleteMany();

  const products = [
    {
      name: 'Teclado Mecánico',
      description: 'Teclado con switches Blue, retroiluminado',
      price: 89.99,
      stock: 50,
      sku: 'TECH-KB-001',
      active: true,
    },
    {
      name: 'Mouse Inalámbrico',
      description: 'Mouse ergonómico con batería recargable',
      price: 34.99,
      stock: 120,
      sku: 'TECH-MS-002',
      active: true,
    },
    {
      name: 'Monitor 24"',
      description: 'Monitor IPS Full HD 144Hz',
      price: 259.99,
      stock: 20,
      sku: 'TECH-MN-003',
      active: true,
    },
    {
      name: 'Audífonos USB',
      description: 'Audífonos con cancelación de ruido',
      price: 49.99,
      stock: 75,
      sku: 'TECH-HD-004',
      active: true,
    },
    {
      name: 'Webcam HD',
      description: 'Webcam 1080p con micrófono integrado',
      price: 64.99,
      stock: 40,
      sku: 'TECH-WC-005',
      active: false,
    },
  ];

  const result = await prisma.product.createMany({ data: products });
  console.log(`✅ Seed completo: ${result.count} productos creados`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
