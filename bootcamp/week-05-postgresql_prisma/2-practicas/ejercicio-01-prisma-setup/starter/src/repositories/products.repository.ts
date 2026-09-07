// src/repositories/products.repository.ts — Acceso a datos con Prisma
// Toda interacción con la base de datos ocurre aquí

import { prisma } from '../lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { CreateProductDto, UpdateProductDto } from '../schemas/product.schema';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// PASO 4A: findAll — Listado paginado de productos
export async function findAll(page: number, limit: number): Promise<PaginatedResult<unknown>> {
  // Una petición, dos queries en paralelo usando Promise.all
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);
  return { data: products, total, page, limit };
}

// PASO 4B: findById — Buscar un producto por ID
export async function findById(id: number) {
  // findUnique retorna null si no existe (NO lanza error)
  // El controller convierte el null en 404
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
}

// PASO 5A: create — Crear un producto nuevo
export async function create(data: CreateProductDto) {
  // P2002 = violación de restricción UNIQUE (sku duplicado)
  try {
    return await prisma.product.create({ data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'El SKU ya existe');
    }
    throw err;
  }
}

// PASO 5B: update — Actualizar un producto existente
export async function update(id: number, data: UpdateProductDto) {
  // P2025 = registro no encontrado (update sobre un ID que no existe)
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Producto no encontrado');
    }
    throw err;
  }
}

// PASO 5C: remove — Eliminar un producto
export async function remove(id: number): Promise<void> {
  // P2025 aplica también a delete — si el ID no existe lanza el error
  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Producto no encontrado');
    }
    throw err;
  }
}
