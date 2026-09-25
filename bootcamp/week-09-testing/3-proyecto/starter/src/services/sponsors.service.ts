import { AppError } from '../errors/AppError.js';
import type { ISponsor } from '../models/sponsor.model.js';
import type { CreateSponsorDto, UpdateSponsorDto } from '../types/index.js';
import * as sponsorsRepo from '../repositories/sponsors.repository.js';

export async function getAll(userId?: string): Promise<ISponsor[]> {
  return sponsorsRepo.findAllSponsors(userId);
}

export async function getById(id: string): Promise<ISponsor> {
  const sponsor = await sponsorsRepo.findSponsorById(id);
  if (!sponsor) throw new AppError(404, 'Sponsor not found');
  return sponsor;
}

export async function create(dto: CreateSponsorDto, createdBy: string): Promise<ISponsor> {
  const existing = await sponsorsRepo.findSponsorByEmail(dto.contactEmail);
  if (existing) throw new AppError(409, 'A sponsor with this contact email already exists');

  return sponsorsRepo.createSponsor(dto, createdBy);
}

export async function update(
  id: string,
  dto: UpdateSponsorDto,
  requesterId: string,
  requesterRole: string,
): Promise<ISponsor> {
  const existing = await sponsorsRepo.findSponsorById(id);
  if (!existing) throw new AppError(404, 'Sponsor not found');

  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  const updated = await sponsorsRepo.updateSponsor(id, dto);
  if (!updated) throw new AppError(404, 'Sponsor not found');
  return updated;
}

export async function remove(id: string, requesterId: string, requesterRole: string): Promise<void> {
  const existing = await sponsorsRepo.findSponsorById(id);
  if (!existing) throw new AppError(404, 'Sponsor not found');

  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  await sponsorsRepo.deleteSponsor(id);
}
