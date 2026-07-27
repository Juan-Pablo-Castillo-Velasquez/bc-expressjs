// ============================================
// PROCESSOR — Filtra y calcula estadísticas
// ============================================

import type { Program, ProgramSummary } from './types.js';

// TODO: Implementar filterByCategory
// Debe:
// 1. Si categoryFilter es null, retornar todos los items
// 2. Si categoryFilter está definido, retornar solo los items de esa categoría
//    (comparación case-insensitive con .toLowerCase())
// 3. Si no hay items en esa categoría, lanzar un Error que liste las categorías disponibles
//
// Firma esperada:
// export function filterByCategory(items: Item[], categoryFilter: string | null): Item[]

// Implementación — dominio Radio Comunitaria
export function filterByCategory(
  programs: Program[],
  categoryFilter: string | null,
): Program[] {
  if (categoryFilter === null) {
    return programs;
  }

  const normalizedFilter = categoryFilter.toLowerCase();
  const filtered = programs.filter(
    (program) => program.category.toLowerCase() === normalizedFilter,
  );

  if (filtered.length === 0) {
    const availableCategories = Array.from(
      new Set(programs.map((program) => program.category)),
    );
    throw new Error(
      `No hay programas en la categoría "${categoryFilter}". ` +
        `Categorías disponibles: ${availableCategories.join(', ')}`,
    );
  }

  return filtered;
}

// TODO: Implementar calculateSummary
// Debe calcular y retornar un objeto ItemSummary con:
// - total: longitud del array
// - active: items con active === true
// - inactive: items con active === false
// - averagePrice: precio promedio redondeado a 2 decimales
// - mostExpensive: item con el mayor precio
// - cheapest: item con el menor precio
// - categories: array de categorías únicas (sin repetición)
//
// Pistas:
// - Usa .reduce() para sumar precios
// - Usa .filter() para separar activos e inactivos
// - Usa new Set() + Array.from() para categorías únicas
// - Usa Math.max/min o sort para el más caro/barato
//
// Firma esperada:
// export function calculateSummary(items: Item[]): ItemSummary

// Implementación — dominio Radio Comunitaria
export function calculateSummary(programs: Program[]): ProgramSummary {
  if (programs.length === 0) {
    throw new Error('No hay programas para calcular el resumen.');
  }

  const total = programs.length;
  const active = programs.filter((program) => program.active).length;
  const inactive = total - active;

  const totalBudget = programs.reduce(
    (sum, program) => sum + program.weeklyBudget,
    0,
  );
  const averagePrice = Math.round((totalBudget / total) * 100) / 100;

  const mostExpensive = programs.reduce((max, program) =>
    program.weeklyBudget > max.weeklyBudget ? program : max,
  );
  const cheapest = programs.reduce((min, program) =>
    program.weeklyBudget < min.weeklyBudget ? program : min,
  );

  const categories = Array.from(
    new Set(programs.map((program) => program.category)),
  );

  return {
    total,
    active,
    inactive,
    averagePrice,
    mostExpensive,
    cheapest,
    categories,
  };
}
