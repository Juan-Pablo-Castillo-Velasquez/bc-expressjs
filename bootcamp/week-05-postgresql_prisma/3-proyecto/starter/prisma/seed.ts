// prisma/seed.ts — Datos iniciales del dominio Radio Comunitaria
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed de Radio Comunitaria...');

  // Limpiar datos en orden correcto (hijos antes que padres)
  await prisma.program.deleteMany();
  await prisma.host.deleteMany();

  // Crear hosts primero (para obtener sus IDs)
  const maria = await prisma.host.upsert({
    where: { email: 'maria.rios@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'María Fernanda Ríos',
      bio: 'Periodista comunitaria, conduce el noticiero matutino desde hace 6 años.',
      email: 'maria.rios@radiocomunitaria.co',
    },
  });

  const carlos = await prisma.host.upsert({
    where: { email: 'carlos.perez@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Carlos "El Sonero" Pérez',
      bio: 'Locutor y coleccionista de música tropical, referente del barrio.',
      email: 'carlos.perez@radiocomunitaria.co',
    },
  });

  const andrea = await prisma.host.upsert({
    where: { email: 'andrea.gomez@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Andrea Gómez',
      bio: 'Lideresa social y moderadora de espacios de opinión ciudadana.',
      email: 'andrea.gomez@radiocomunitaria.co',
    },
  });

  const jorge = await prisma.host.upsert({
    where: { email: 'jorge.salazar@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Jorge Iván Salazar',
      bio: 'Ex futbolista local, comenta deportes con pasión y humor.',
      email: 'jorge.salazar@radiocomunitaria.co',
    },
  });

  const rosa = await prisma.host.upsert({
    where: { email: 'rosa.martinez@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Rosa Elena Martínez',
      bio: 'Locutora de música romántica, voz insignia de las tardes.',
      email: 'rosa.martinez@radiocomunitaria.co',
    },
  });

  const sebastian = await prisma.host.upsert({
    where: { email: 'sebastian.torres@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Sebastián Torres',
      bio: 'Estudiante y gestor cultural, impulsa el espacio juvenil de la emisora.',
      email: 'sebastian.torres@radiocomunitaria.co',
    },
  });

  const patricia = await prisma.host.upsert({
    where: { email: 'patricia.lozano@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Dra. Patricia Lozano',
      bio: 'Médica general, orienta a la comunidad en salud preventiva.',
      email: 'patricia.lozano@radiocomunitaria.co',
    },
  });

  const luis = await prisma.host.upsert({
    where: { email: 'luis.diaz@radiocomunitaria.co' },
    update: {},
    create: {
      name: 'Luis Alberto Díaz',
      bio: 'Melómano del vallenato clásico, cierra las noches de la emisora.',
      email: 'luis.diaz@radiocomunitaria.co',
    },
  });

  console.log('✅ 8 hosts creados');

  // Crear programas con FK a sus hosts
  const result = await prisma.program.createMany({
    data: [
      {
        title: 'Despertar Comunitario',
        slug: 'despertar-comunitario',
        description: 'Noticias y actualidad del barrio para empezar el día informado.',
        genre: 'Noticias',
        schedule: 'Lunes a Viernes, 6:00am - 8:00am',
        sponsor: 'Panadería La Espiga',
        hostId: maria.id,
      },
      {
        title: 'Ritmo Barrial',
        slug: 'ritmo-barrial',
        description: 'Los mejores éxitos de salsa y ritmos tropicales para animar la mañana.',
        genre: 'Música',
        schedule: 'Lunes a Viernes, 8:00am - 10:00am',
        sponsor: 'Ferretería El Tornillo Feliz',
        hostId: carlos.id,
      },
      {
        title: 'Voces de la Comuna',
        slug: 'voces-de-la-comuna',
        description: 'Espacio de opinión y debate sobre los temas que afectan a la comunidad.',
        genre: 'Opinión',
        schedule: 'Martes y Jueves, 10:00am - 11:30am',
        sponsor: 'Droguería San Rafael',
        hostId: andrea.id,
      },
      {
        title: 'Deporte Total',
        slug: 'deporte-total',
        description: 'Resumen deportivo local y nacional con entrevistas a deportistas del barrio.',
        genre: 'Deportes',
        schedule: 'Lunes, Miércoles y Viernes, 12:00pm - 1:00pm',
        sponsor: 'Gimnasio PowerFit',
        hostId: jorge.id,
      },
      {
        title: 'Tardes de Bolero',
        slug: 'tardes-de-bolero',
        description: 'Boleros clásicos y baladas para acompañar las tardes.',
        genre: 'Música',
        schedule: 'Lunes a Viernes, 2:00pm - 4:00pm',
        sponsor: 'Floristería Primavera',
        hostId: rosa.id,
      },
      {
        title: 'Jóvenes al Aire',
        slug: 'jovenes-al-aire',
        description: 'Espacio dirigido por y para jóvenes, con música urbana y temas de actualidad juvenil.',
        genre: 'Entretenimiento',
        schedule: 'Sábados, 3:00pm - 5:00pm',
        sponsor: 'Internet Café La Red',
        active: false,
        hostId: sebastian.id,
      },
      {
        title: 'Salud en Comunidad',
        slug: 'salud-en-comunidad',
        description: 'Consejos de salud preventiva y bienestar para toda la familia.',
        genre: 'Salud',
        schedule: 'Miércoles, 5:00pm - 6:00pm',
        sponsor: 'Droguería San Rafael',
        hostId: patricia.id,
      },
      {
        title: 'Noche de Vallenato',
        slug: 'noche-de-vallenato',
        description: 'Lo mejor del vallenato clásico y nuevo para cerrar la noche.',
        genre: 'Música',
        schedule: 'Viernes y Sábados, 8:00pm - 10:00pm',
        sponsor: 'Licorera La Cosecha',
        hostId: luis.id,
      },
    ],
  });

  console.log(`✅ Seed completo: ${result.count} programas creados`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
