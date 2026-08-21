// ============================================
// REPOSITORY — Paso 1: acceso a datos
// ============================================
// El repository es la única capa que conoce dónde
// viven los datos. Hoy: array en memoria.
// Mañana (week-05): lo reemplazamos por Prisma sin
// tocar controllers ni services.
//
// Todos los métodos son async aunque no haya I/O real.
// Razón: cuando migremos a Prisma, la firma no cambia.

import { Product, CreateProductDto, UpdateProductDto } from '../types';

const store: Product[] = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, stock: 10, createdAt: new Date().toISOString() },
  { id: 2, name: 'Mouse Inalámbrico', price: 29.99, stock: 50, createdAt: new Date().toISOString() },
  { id: 3, name: 'Teclado Mecánico', price: 89.99, stock: 25, createdAt: new Date().toISOString() },
];
let nextId = 4;

export async function findAll(): Promise<Product[]> {
  // Copia defensiva: no exponemos la referencia interna del array
  return [...store];
}

export async function findById(id: number): Promise<Product | undefined> {
  return store.find((p) => p.id === id);
}

export async function create(dto: CreateProductDto): Promise<Product> {
  const product: Product = {
    id: nextId++,
    ...dto,
    createdAt: new Date().toISOString(),
  };
  store.push(product);
  return { ...product }; // copia defensiva
}

export async function update(
  id: number,
  dto: UpdateProductDto
): Promise<Product | undefined> {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! }; // copia defensiva
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
