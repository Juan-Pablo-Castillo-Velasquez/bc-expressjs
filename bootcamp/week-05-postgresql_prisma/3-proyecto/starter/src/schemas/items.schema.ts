// src/schemas/items.schema.ts — Validación Zod para Program (recurso principal)

import { z } from 'zod';

const GENEROS = ['Noticias', 'Música', 'Opinión', 'Deportes', 'Entretenimiento', 'Salud'] as const;

export const createItemSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(150),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser kebab-case (ej: despertar-comunitario)'),
  description: z.string().max(500).optional(),
  genre: z.enum(GENEROS, { message: `El género debe ser uno de: ${GENEROS.join(', ')}` }),
  schedule: z.string().min(1, 'El horario es requerido').max(120),
  sponsor: z.string().max(120).optional(),
  active: z.boolean().default(true),
  hostId: z.number().int().positive().optional(),
});

export const updateItemSchema = createItemSchema.partial();

export type CreateItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
