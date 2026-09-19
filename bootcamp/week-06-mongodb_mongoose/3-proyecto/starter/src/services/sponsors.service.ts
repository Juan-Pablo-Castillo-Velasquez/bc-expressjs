// src/services/sponsors.service.ts — Lógica de negocio de Sponsor

import * as repo from '../repositories/sponsors.repository';
import type { CreateSponsorDto, UpdateSponsorDto } from '../schemas/sponsor.schema';

export async function getAll() {
  return repo.findAll();
}

export async function getById(id: string) {
  return repo.findById(id);
}

export async function createSponsor(dto: CreateSponsorDto) {
  return repo.create(dto);
}

export async function updateSponsor(id: string, dto: UpdateSponsorDto) {
  return repo.update(id, dto);
}

export async function deleteSponsor(id: string) {
  return repo.remove(id);
}
