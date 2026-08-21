// ============================================
// SERVICE — lógica de negocio (Radio Comunitaria)
// ============================================
import { Program, PaginatedResponse } from '../types';
import * as repo from '../repositories/programs.repository';
import { AppError } from '../errors/AppError';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Program>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Program> {
  const program = await repo.findById(id);
  if (!program) throw new AppError(404, `Program ${id} not found`);
  return program;
}

export async function create(dto: repo.CreateProgramRepoDto): Promise<Program> {
  return repo.create(dto);
}

export async function update(id: number, dto: repo.UpdateProgramRepoDto): Promise<Program> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Program ${id} not found`);
  const updated = await repo.update(id, dto);
  return updated!;
}

export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Program ${id} not found`);
  await repo.remove(id);
}
