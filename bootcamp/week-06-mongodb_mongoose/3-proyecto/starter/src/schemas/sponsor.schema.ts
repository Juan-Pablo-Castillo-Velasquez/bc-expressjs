// src/schemas/sponsor.schema.ts — Validación Zod de Sponsor (entidad secundaria)

import { z } from 'zod';

const SPONSOR_TYPES = ['commercial', 'ngo', 'government', 'individual'] as const;

export const createSponsorSchema = z.object({
  companyName: z.string().min(1, 'El nombre de la empresa es requerido').max(120),
  contactName: z.string().max(100).optional(),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().max(20).optional(),
  sponsorType: z
    .enum(SPONSOR_TYPES, { message: `sponsorType debe ser uno de: ${SPONSOR_TYPES.join(', ')}` })
    .default('commercial'),
  logoUrl: z.string().max(300).optional(),
  active: z.boolean().default(true),
});

export const updateSponsorSchema = createSponsorSchema.partial();

export type CreateSponsorDto = z.infer<typeof createSponsorSchema>;
export type UpdateSponsorDto = z.infer<typeof updateSponsorSchema>;
