// prisma/seed.ts — Seed con relación Category → Products
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed con relaciones...');

  // Limpiar datos en orden correcto (hijos antes que padres)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Crear categorías primero (para obtener sus IDs)
  const perifericos = await prisma.category.upsert({
    where: { name: 'Periféricos' },
    update: {},
    create: { name: 'Periféricos' },
  });

  const audio = await prisma.category.upsert({
    where: { name: 'Audio' },
    update: {},
    create: { name: 'Audio' },
  });

  const video = await prisma.category.upsert({
    where: { name: 'Video' },
    update: {},
    create: { name: 'Video' },
  });

  console.log('✅ Categorías creadas:', perifericos.name, audio.name, video.name);

  // Crear productos con FK a sus categorías
  const result = await prisma.product.createMany({
    data: [
      {
        name: 'Teclado Mecánico',
        description: 'Teclado con switches Blue, retroiluminado',
        price: 89.99,
        stock: 50,
        sku: 'TECH-KB-001',
        categoryId: perifericos.id,
      },
      {
        name: 'Mouse Inalámbrico',
        description: 'Mouse ergonómico con batería recargable',
        price: 34.99,
        stock: 120,
        sku: 'TECH-MS-002',
        categoryId: perifericos.id,
      },
      {
        name: 'Monitor 24"',
        description: 'Monitor IPS Full HD 144Hz',
        price: 259.99,
        stock: 20,
        sku: 'TECH-MN-003',
        categoryId: video.id,
      },
      {
        name: 'Audífonos USB',
        description: 'Audífonos con cancelación de ruido',
        price: 49.99,
        stock: 75,
        sku: 'TECH-HD-004',
        categoryId: audio.id,
      },
      {
        name: 'Webcam HD',
        description: 'Webcam 1080p con micrófono integrado',
        price: 64.99,
        stock: 40,
        sku: 'TECH-WC-005',
        categoryId: video.id,
      },
    ],
  });

  console.log(`✅ Seed completo: ${result.count} productos creados con categorías`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
