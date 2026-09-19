// src/services/programs.service.ts — Lógica de negocio de Program

import * as repo from '../repositories/programs.repository';
import type { CreateProgramDto, UpdateProgramDto } from '../schemas/program.schema';

export async function getAll(page: number, limit: number, search?: string) {
  return repo.findAll(page, limit, search);
}

export async function getById(id: string) {
  return repo.findById(id);
}

export async function createProgram(dto: CreateProgramDto) {
  return repo.create(dto);
}

export async function updateProgram(id: string, dto: UpdateProgramDto) {
  return repo.update(id, dto);
}

export async function deleteProgram(id: string) {
  return repo.remove(id);
}
