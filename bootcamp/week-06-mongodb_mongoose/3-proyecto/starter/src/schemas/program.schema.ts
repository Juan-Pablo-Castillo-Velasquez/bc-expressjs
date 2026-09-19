// src/schemas/program.schema.ts — Validación Zod de Program (entidad principal)

import { z } from 'zod';

// ObjectId: 24 caracteres hexadecimales
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z.string().regex(objectIdRegex, 'ID inválido');

const GENEROS = ['Noticias', 'Música', 'Opinión', 'Deportes', 'Entretenimiento', 'Salud'] as const;

export const createProgramSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(150),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser kebab-case (ej: despertar-comunitario)'),
  description: z.string().max(500).optional(),
  genre: z.enum(GENEROS, { message: `El género debe ser uno de: ${GENEROS.join(', ')}` }),
  schedule: z.string().min(1, 'El horario es requerido').max(120),
  active: z.boolean().default(true),
  // Campo de referencia — ObjectId del Sponsor que patrocina el programa
  sponsor: z.string().regex(objectIdRegex, 'ID de patrocinador inválido'),
});

export const updateProgramSchema = createProgramSchema.partial();

export type CreateProgramDto = z.infer<typeof createProgramSchema>;
export type UpdateProgramDto = z.infer<typeof updateProgramSchema>;
