// ============================================
// SERVICE — Paso 2: lógica de negocio
// ============================================
// El service contiene las reglas del negocio:
// paginación, validaciones de dominio, cálculos.
//
// ⚠️ Regla absoluta: CERO imports de Express aquí.
// Sin Request, sin Response, sin NextFunction.
// Esto hace el service 100% testeable con Jest.

import { CreateProductDto, UpdateProductDto, PaginatedResponse, Product } from '../types';
import * as repo from '../repositories/products.repository';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Product>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Product | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateProductDto): Promise<Product> {
  // Aquí irían validaciones de negocio (ej. precio > 0, stock >= 0)
  return repo.create(dto);
}

export async function update(
  id: number,
  dto: UpdateProductDto
): Promise<Product | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;
  return repo.remove(id);
}
