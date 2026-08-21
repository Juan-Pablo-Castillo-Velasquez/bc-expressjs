// ============================================
// SERVICE — Lógica de negocio
// ============================================
// CERO imports de Express. Contiene paginación y
// validaciones de dominio de la radio comunitaria.

import { CreateProgramDto, UpdateProgramDto, Program, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/programs.repository';

// Error de validación de dominio — el controller lo distingue
// de errores inesperados y responde 400 en vez de delegar al
// manejador de errores genérico (500).
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

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
  // Validación de dominio: name, hostName y schedule son obligatorios
  if (!dto.name || !dto.hostName || !dto.schedule) {
    throw new ValidationError('name, hostName and schedule are required');
  }

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
