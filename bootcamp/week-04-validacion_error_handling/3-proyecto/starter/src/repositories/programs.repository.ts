// ============================================
// REPOSITORY — capa de acceso a datos (en memoria)
// ============================================
import { Program } from '../types';

export type CreateProgramRepoDto = Omit<Program, 'id' | 'createdAt'>;
export type UpdateProgramRepoDto = Partial<CreateProgramRepoDto>;

let programs: Program[] = [
  {
    id: 1,
    name: 'Voces del Barrio',
    hostName: 'Camila Restrepo',
    schedule: 'Lunes 08:00-09:00',
    sponsor: 'Panadería La Espiga',
    durationMinutes: 60,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Ritmos de mi Tierra',
    hostName: 'Andrés Gómez',
    schedule: 'Martes 18:00-19:30',
    sponsor: 'Sin patrocinador',
    durationMinutes: 90,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Noticiero Comunal',
    hostName: 'Laura Jiménez',
    schedule: 'Miércoles 07:00-07:30',
    sponsor: 'Ferretería El Tornillo',
    durationMinutes: 30,
    active: true,
    createdAt: new Date(),
  },
];

let nextId = 4;

export async function findAll(): Promise<Program[]> {
  return [...programs];
}

export async function findById(id: number): Promise<Program | undefined> {
  const program = programs.find((p) => p.id === id);
  return program ? { ...program } : undefined;
}

export async function create(dto: CreateProgramRepoDto): Promise<Program> {
  const program: Program = { id: nextId++, ...dto, createdAt: new Date() };
  programs.push(program);
  return { ...program };
}

export async function update(id: number, dto: UpdateProgramRepoDto): Promise<Program | undefined> {
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  programs[index] = { ...programs[index]!, ...dto };
  return { ...programs[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) return false;
  programs.splice(index, 1);
  return true;
}
