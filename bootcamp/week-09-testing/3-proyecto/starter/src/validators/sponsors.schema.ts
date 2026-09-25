import { z } from 'zod';

// ============================================================
// SCHEMAS ZOD — dominio Radio Comunitaria (Sponsor)
// ============================================================

export const createSponsorSchema = z.object({
  body: z.object({
    name:                z.string().min(2).max(200),
    contactEmail:        z.string().email(),
    contactPhone:        z.string().max(30).optional(),
    contributionAmount:  z.number().min(0).optional(),
    status:              z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateSponsorSchema = z.object({
  body: z.object({
    name:                z.string().min(2).max(200).optional(),
    contactEmail:        z.string().email().optional(),
    contactPhone:        z.string().max(30).optional(),
    contributionAmount:  z.number().min(0).optional(),
    status:              z.enum(['active', 'inactive']).optional(),
  }),
});

export const sponsorIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid MongoDB ID'),
  }),
});
