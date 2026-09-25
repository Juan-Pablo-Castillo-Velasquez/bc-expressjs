import { SponsorModel } from '../models/sponsor.model.js';
import type { ISponsor } from '../models/sponsor.model.js';
import type { CreateSponsorDto, UpdateSponsorDto } from '../types/index.js';

export async function findAllSponsors(createdBy?: string): Promise<ISponsor[]> {
  const filter = createdBy ? { createdBy } : {};
  return SponsorModel.find(filter).lean<ISponsor[]>().exec();
}

export async function findSponsorById(id: string): Promise<ISponsor | null> {
  return SponsorModel.findById(id).lean<ISponsor>().exec();
}

export async function findSponsorByEmail(contactEmail: string): Promise<ISponsor | null> {
  return SponsorModel.findOne({ contactEmail }).lean<ISponsor>().exec();
}

export async function createSponsor(dto: CreateSponsorDto, createdBy: string): Promise<ISponsor> {
  const sponsor = new SponsorModel({ ...dto, createdBy });
  return sponsor.save() as unknown as ISponsor;
}

export async function updateSponsor(id: string, dto: UpdateSponsorDto): Promise<ISponsor | null> {
  return SponsorModel.findByIdAndUpdate(id, dto, { new: true }).lean<ISponsor>().exec();
}

export async function deleteSponsor(id: string): Promise<ISponsor | null> {
  return SponsorModel.findByIdAndDelete(id).lean<ISponsor>().exec();
}
