// src/repositories/programs.repository.ts — CRUD de Program + populate('sponsor')

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Program } from '../models/program.model';
import { AppError } from '../errors/AppError';
import type { CreateProgramDto, UpdateProgramDto } from '../schemas/program.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export async function findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedResult<unknown>> {
  const skip = (page - 1) * limit;
  const filter = search
    ? { title: { $regex: search, $options: 'i' } }
    : {};

  const [data, total] = await Promise.all([
    Program.find(filter)
      .populate('sponsor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Program.countDocuments(filter),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<unknown> {
  try {
    const program = await Program.findById(id)
      .populate('sponsor')
      .lean();
    if (!program) throw new AppError(404, 'Programa no encontrado');
    return program;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(dto: CreateProgramDto): Promise<unknown> {
  try {
    const program = await Program.create(dto);
    return program.toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un programa con ese slug');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateProgramDto): Promise<unknown> {
  try {
    const program = await Program.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!program) throw new AppError(404, 'Programa no encontrado');
    return program;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un programa con ese slug');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const program = await Program.findByIdAndDelete(id).lean();
    if (!program) throw new AppError(404, 'Programa no encontrado');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
