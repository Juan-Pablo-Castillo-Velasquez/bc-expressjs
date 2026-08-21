// ============================================
// SCHEMAS — Program (Radio Comunitaria)
// ============================================
import { z } from 'zod';

export const createProgramSchema = z.object({
  name: z
    .string({ error: 'name es obligatorio' })
    .min(1, 'name no puede estar vacío')
    .trim(),
  hostName: z
    .string({ error: 'hostName es obligatorio' })
    .min(1, 'hostName no puede estar vacío')
    .trim(),
  schedule: z
    .string({ error: 'schedule es obligatorio' })
    .min(1, 'schedule no puede estar vacío')
    .trim(),
  sponsor: z.string().trim().min(1).default('Sin patrocinador'),
  durationMinutes: z
    .number({ error: 'durationMinutes es obligatorio' })
    .int('durationMinutes debe ser un número entero')
    .positive('durationMinutes debe ser mayor a 0'),
  active: z.boolean().default(true),
});

// Reutiliza el schema de creación con .partial() — sin duplicar código
export const updateProgramSchema = createProgramSchema.partial();

// Tipos inferidos desde los schemas (single source of truth)
export type CreateProgramDto = z.infer<typeof createProgramSchema>;
export type UpdateProgramDto = z.infer<typeof updateProgramSchema>;
