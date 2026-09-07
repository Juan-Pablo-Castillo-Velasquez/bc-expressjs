// src/repositories/items.repository.ts — Acceso a datos con Prisma
// Recurso principal: Program (dominio Radio Comunitaria)

import { prisma } from '../lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { CreateItemDto, UpdateItemDto } from '../schemas/items.schema';

export async function findAll(page: number, limit: number) {
  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { host: true },
    }),
    prisma.program.count(),
  ]);
  return { data: programs, total, page, limit };
}

export async function findById(id: number) {
  const program = await prisma.program.findUnique({
    where: { id },
    include: { host: true },
  });
  return program;
}

export async function create(data: CreateItemDto) {
  try {
    return await prisma.program.create({ data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'Ya existe un programa con ese slug');
    }
    throw err;
  }
}

export async function update(id: number, data: UpdateItemDto) {
  try {
    return await prisma.program.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Programa no encontrado');
    }
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'Ya existe un programa con ese slug');
    }
    throw err;
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await prisma.program.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Programa no encontrado');
    }
    throw err;
  }
}
