// ============================================
// REPOSITORY — Capa de acceso a datos
// ============================================
// Único punto de acceso al store de programas radiales.
// Todos los métodos son async y retornan copias defensivas.

import { Program, CreateProgramDto, UpdateProgramDto } from '../types';

const store: Program[] = [
  {
    id: 1,
    name: 'Voces del Barrio',
    hostName: 'Camila Restrepo',
    schedule: 'Lunes 08:00-09:00',
    sponsor: 'Panadería La Espiga',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Ritmos de mi Tierra',
    hostName: 'Andrés Gómez',
    schedule: 'Martes 18:00-19:30',
    sponsor: 'Sin patrocinador',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Noticiero Comunal',
    hostName: 'Laura Jiménez',
    schedule: 'Miércoles 07:00-07:30',
    sponsor: 'Ferretería El Tornillo',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Charlando con el Vecino',
    hostName: 'Pedro Salazar',
    schedule: 'Jueves 20:00-21:00',
    sponsor: 'Sin patrocinador',
    active: false,
    createdAt: new Date().toISOString(),
  },
];
let nextId = 5;

export async function findAll(): Promise<Program[]> {
  return [...store];
}

export async function findById(id: number): Promise<Program | undefined> {
  return store.find((program) => program.id === id);
}

export async function create(dto: CreateProgramDto): Promise<Program> {
  const program: Program = {
    id: nextId++,
    ...dto,
    createdAt: new Date().toISOString(),
  };
  store.push(program);
  return { ...program };
}

export async function update(id: number, dto: UpdateProgramDto): Promise<Program | undefined> {
  const index = store.findIndex((program) => program.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((program) => program.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
