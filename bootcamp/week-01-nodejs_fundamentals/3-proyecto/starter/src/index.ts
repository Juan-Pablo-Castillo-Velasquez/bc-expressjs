// ============================================
// ENTRY POINT — Orquesta todo el flujo
// ============================================

import { readPrograms } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { Report } from './types.js';

// TODO: Parsear el argumento --category desde process.argv
// process.argv = ['node', 'script.ts', '--category', 'electronics']
// Si '--category' está en los args, el siguiente elemento es el valor.
// Si no está, el filtro debe ser null.
//
// Ejemplo:
// const args = process.argv.slice(2);
// const categoryIndex = args.indexOf('--category');
// const categoryFilter: string | null = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

function parseCategoryFilter(): string | null {
  const args = process.argv.slice(2);
  const categoryIndex = args.indexOf('--category');
  return categoryIndex !== -1 ? args[categoryIndex + 1] : null;
}

// TODO: Implementar la función main con el siguiente flujo:
// 1. Parsear los argumentos (ver arriba)
// 2. Leer los datos con readItems()
// 3. Filtrar con filterByCategory() pasando el filtro parseado
// 4. Calcular el resumen con calculateSummary()
// 5. Construir el objeto Report con: generatedAt (ISO string), appliedFilter, summary, items filtrados
// 6. Imprimir el resumen en consola (total, activos, precio promedio, categorías)
// 7. Escribir el reporte en disco con writeReport()
//
// Recuerda manejar errores con try/catch y llamar process.exit(1) si algo falla.
//
// Firma esperada:
// async function main(): Promise<void>

// Implementación — dominio Radio Comunitaria
async function main(): Promise<void> {
  try {
    const categoryFilter = parseCategoryFilter();

    const programs = await readPrograms();
    const filtered = filterByCategory(programs, categoryFilter);
    const summary = calculateSummary(filtered);

    const report: Report = {
      generatedAt: new Date().toISOString(),
      appliedFilter: categoryFilter,
      summary,
      items: filtered,
    };

    console.log('--- Resumen de la programación ---');
    console.log(`Total de programas: ${summary.total}`);
    console.log(`Activos: ${summary.active} | Inactivos: ${summary.inactive}`);
    console.log(`Presupuesto semanal promedio: $${summary.averagePrice}`);
    console.log(`Categorías: ${summary.categories.join(', ')}`);
    console.log(
      `Programa con mayor presupuesto: ${summary.mostExpensive.name} ($${summary.mostExpensive.weeklyBudget})`,
    );
    console.log(
      `Programa con menor presupuesto: ${summary.cheapest.name} ($${summary.cheapest.weeklyBudget})`,
    );

    await writeReport(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

// TODO: Llamar main() al final del archivo
// main();

main();
