// ============================================
// WRITER — Escribe el reporte en output/report.json
// ============================================

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { Report } from './types.js';

// TODO: Implementar writeReport
// Debe:
// 1. Construir la ruta al directorio output/ usando join() e import.meta.dirname
// 2. Crear el directorio output/ con mkdir() si no existe (usar la opción { recursive: true })
// 3. Serializar el reporte con JSON.stringify(report, null, 2) para formato legible
// 4. Escribir el archivo output/report.json con writeFile
// 5. Loggear en consola la ruta donde se guardó el reporte
//
// Firma esperada:
// export async function writeReport(report: Report): Promise<void>
//
// Nota: mkdir con { recursive: true } no lanza error si el directorio ya existe

// Implementación — dominio Radio Comunitaria
export async function writeReport(report: Report): Promise<void> {
  const outputDir = join(import.meta.dirname, '..', 'output');
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'report.json');
  const serialized = JSON.stringify(report, null, 2);

  await writeFile(outputPath, serialized, 'utf-8');
  console.log(`Reporte guardado en: ${outputPath}`);
}
