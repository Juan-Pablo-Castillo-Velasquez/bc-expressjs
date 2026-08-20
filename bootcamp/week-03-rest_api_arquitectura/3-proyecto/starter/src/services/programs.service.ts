// ============================================
// SERVICE — Lógica de negocio
// ============================================
// CERO imports de Express. Contiene paginación y
// validaciones de dominio de la radio comunitaria.

import { CreateProgramDto, UpdateProgramDto, Program, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/programs.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Program>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Program | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateProgramDto): Promise<Program> {
  // Regla de negocio: si no se especifica patrocinador, se asume "Sin patrocinador"
  const normalized: CreateProgramDto = {
    ...dto,
    sponsor: dto.sponsor?.trim() ? dto.sponsor : 'Sin patrocinador',
  };
  return repo.create(normalized);
}

export async function update(id: number, dto: UpdateProgramDto): Promise<Program | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;
  return repo.remove(id);
}
