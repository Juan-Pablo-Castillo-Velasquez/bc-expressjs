// ============================================
// Repositorio de Productos — CRUD con Mongoose
// ============================================

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { AppError } from '../errors/AppError';
import type { CreateProductDto, UpdateProductDto } from '../schemas/product.schema';

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
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const [data, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function findById(id: string): Promise<unknown> {
  try {
    const product = await Product.findById(id).lean();
    if (!product) throw new AppError(404, 'Producto no encontrado');
    return product;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(dto: CreateProductDto): Promise<unknown> {
  try {
    const product = await Product.create(dto);
    return product.toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
      throw new AppError(409, `El ${field} ya está registrado`);
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateProductDto): Promise<unknown> {
  try {
    const product = await Product.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) throw new AppError(404, 'Producto no encontrado');
    return product;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (err instanceof MongoServerError && err.code === 11000) {
      const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
      throw new AppError(409, `El ${field} ya está registrado`);
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) throw new AppError(404, 'Producto no encontrado');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
