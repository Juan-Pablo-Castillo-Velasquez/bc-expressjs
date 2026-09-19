// src/repositories/sponsors.repository.ts — CRUD de Sponsor (entidad secundaria)

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Sponsor } from '../models/sponsor.model';
import { AppError } from '../errors/AppError';
import type { CreateSponsorDto, UpdateSponsorDto } from '../schemas/sponsor.schema';

export async function findAll(): Promise<unknown[]> {
  return Sponsor.find().sort({ companyName: 1 }).lean();
}

export async function findById(id: string): Promise<unknown> {
  try {
    const sponsor = await Sponsor.findById(id).lean();
    if (!sponsor) throw new AppError(404, 'Patrocinador no encontrado');
    return sponsor;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(dto: CreateSponsorDto): Promise<unknown> {
  try {
    const sponsor = await Sponsor.create(dto);
    return sponsor.toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un patrocinador con ese correo');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateSponsorDto): Promise<unknown> {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!sponsor) throw new AppError(404, 'Patrocinador no encontrado');
    return sponsor;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un patrocinador con ese correo');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(id).lean();
    if (!sponsor) throw new AppError(404, 'Patrocinador no encontrado');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
