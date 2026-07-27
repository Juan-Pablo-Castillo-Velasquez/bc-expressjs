// ============================================
// TIPOS — Adapta estas interfaces a tu dominio
// ============================================
// Renombra 'Item' al recurso de tu dominio asignado.
// Ejemplo: Book, Medicine, Member, Dish, Room...

// TODO: Renombrar 'Item' al recurso de tu dominio asignado
// export interface Item {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   active: boolean;
// }

// TODO: Agregar campos específicos de tu dominio
// Ejemplo para Biblioteca:
// export interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   year: number;
//   available: boolean;
// }

// Dominio asignado: Radio Comunitaria
// Recurso: Program (programa radial)
// - price  → weeklyBudget (costo de producción semanal)
// - stock  → weeklySlots (franjas horarias asignadas por semana)
export interface Program {
  id: string;
  name: string;
  category: string;
  weeklyBudget: number;
  weeklySlots: number;
  active: boolean;
}

// Resumen que el procesador debe calcular
export interface ProgramSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Program;
  cheapest: Program;
  categories: string[];
}

// Reporte final que se escribirá en output/report.json
export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: ProgramSummary;
  items: Program[];
}
