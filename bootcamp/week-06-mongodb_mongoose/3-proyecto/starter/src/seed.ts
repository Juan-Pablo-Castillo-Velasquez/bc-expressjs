// src/seed.ts — Datos iniciales del dominio Radio Comunitaria
// Ejecutar con: pnpm seed
//
// Los Sponsor (entidad secundaria) se insertan primero para obtener sus _id
// antes de crear los Program (entidad principal) que los referencian.

import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Sponsor } from './models/sponsor.model';
import { Program } from './models/program.model';

async function seed(): Promise<void> {
  await connectDB();

  await Program.deleteMany({});
  await Sponsor.deleteMany({});
  console.log('Collections cleared');

  // Paso A — insertar patrocinadores y capturar sus _id
  const sponsors = await Sponsor.insertMany([
    {
      companyName: 'Panadería La Espiga',
      contactName: 'Don Alberto Ruiz',
      email: 'contacto@panaderialaespiga.co',
      phone: '3011234567',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Ferretería El Tornillo Feliz',
      contactName: 'Marta Osorio',
      email: 'ventas@tornillofeliz.co',
      phone: '3022345678',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Droguería San Rafael',
      contactName: 'Dr. Iván Restrepo',
      email: 'info@drogueriasanrafael.co',
      phone: '3033456789',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Gimnasio PowerFit',
      contactName: 'Camila Vargas',
      email: 'administracion@powerfit.co',
      phone: '3044567890',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Floristería Primavera',
      contactName: 'Luz Elena Cano',
      email: 'pedidos@floristeriaprimavera.co',
      phone: '3055678901',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Internet Café La Red',
      contactName: 'Jhon Fredy Ospina',
      email: 'contacto@cafelared.co',
      phone: '3066789012',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Licorera La Cosecha',
      contactName: 'Wilson Herrera',
      email: 'ventas@licoreralacosecha.co',
      phone: '3077890123',
      sponsorType: 'commercial',
    },
    {
      companyName: 'Fundación Manos Comunitarias',
      contactName: 'Yolanda Prieto',
      email: 'contacto@manoscomunitarias.org',
      phone: '3088901234',
      sponsorType: 'ngo',
    },
    {
      // No se asocia a ningún programa en el seed — queda disponible para asignar vía la API
      companyName: 'Alcaldía Local de la Comuna 4',
      contactName: 'Oficina de Comunicaciones',
      email: 'comunicaciones@comuna4.gov.co',
      phone: '3099012345',
      sponsorType: 'government',
    },
  ]);
  console.log(`Sponsors inserted: ${sponsors.length}`);

  const [laEspiga, tornilloFeliz, sanRafael, powerFit, primavera, laRed, laCosecha, manosComunitarias] = sponsors;

  // Paso B — insertar programas referenciando el _id de su patrocinador
  await Program.insertMany([
    {
      title: 'Despertar Comunitario',
      slug: 'despertar-comunitario',
      description: 'Noticias y actualidad del barrio para empezar el día informado.',
      genre: 'Noticias',
      schedule: 'Lunes a Viernes, 6:00am - 8:00am',
      sponsor: laEspiga._id,
    },
    {
      title: 'Ritmo Barrial',
      slug: 'ritmo-barrial',
      description: 'Los mejores éxitos de salsa y ritmos tropicales para animar la mañana.',
      genre: 'Música',
      schedule: 'Lunes a Viernes, 8:00am - 10:00am',
      sponsor: tornilloFeliz._id,
    },
    {
      title: 'Voces de la Comuna',
      slug: 'voces-de-la-comuna',
      description: 'Espacio de opinión y debate sobre los temas que afectan a la comunidad.',
      genre: 'Opinión',
      schedule: 'Martes y Jueves, 10:00am - 11:30am',
      sponsor: manosComunitarias._id,
    },
    {
      title: 'Deporte Total',
      slug: 'deporte-total',
      description: 'Resumen deportivo local y nacional con entrevistas a deportistas del barrio.',
      genre: 'Deportes',
      schedule: 'Lunes, Miércoles y Viernes, 12:00pm - 1:00pm',
      sponsor: powerFit._id,
    },
    {
      title: 'Tardes de Bolero',
      slug: 'tardes-de-bolero',
      description: 'Boleros clásicos y baladas para acompañar las tardes.',
      genre: 'Música',
      schedule: 'Lunes a Viernes, 2:00pm - 4:00pm',
      sponsor: primavera._id,
    },
    {
      title: 'Jóvenes al Aire',
      slug: 'jovenes-al-aire',
      description: 'Espacio dirigido por y para jóvenes, con música urbana y temas de actualidad juvenil.',
      genre: 'Entretenimiento',
      schedule: 'Sábados, 3:00pm - 5:00pm',
      active: false,
      sponsor: laRed._id,
    },
    {
      title: 'Salud en Comunidad',
      slug: 'salud-en-comunidad',
      description: 'Consejos de salud preventiva y bienestar para toda la familia.',
      genre: 'Salud',
      schedule: 'Miércoles, 5:00pm - 6:00pm',
      sponsor: sanRafael._id,
    },
    {
      title: 'Noche de Vallenato',
      slug: 'noche-de-vallenato',
      description: 'Lo mejor del vallenato clásico y nuevo para cerrar la noche.',
      genre: 'Música',
      schedule: 'Viernes y Sábados, 8:00pm - 10:00pm',
      sponsor: laCosecha._id,
    },
  ]);
  console.log('Programs inserted: 8');

  console.log('Seed completed successfully');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
