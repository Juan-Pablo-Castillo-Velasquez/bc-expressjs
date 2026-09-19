import { z } from 'zod';

// ============================================
// SCHEMA: Host (locutor)
// ============================================
// Zod valida y sanitiza (previene XSS al rechazar HTML).

const NO_HTML = /^[^<>]*$/;

export const createHostSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(80)
      .regex(NO_HTML, 'First name must not contain HTML characters'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(80)
      .regex(NO_HTML, 'Last name must not contain HTML characters'),
    artisticName: z.string().max(80).regex(NO_HTML).optional(),
    email: z.string().email('Invalid email format'),
    phone: z.string().max(20).optional(),
    bio: z.string().max(500).regex(NO_HTML, 'Bio must not contain HTML characters').optional(),
    photoUrl: z.string().url('Invalid URL').optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
});

export const updateHostSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(80).regex(NO_HTML).optional(),
    lastName: z.string().min(2).max(80).regex(NO_HTML).optional(),
    artisticName: z.string().max(80).regex(NO_HTML).optional(),
    phone: z.string().max(20).optional(),
    bio: z.string().max(500).regex(NO_HTML).optional(),
    photoUrl: z.string().url('Invalid URL').optional(),
    status: z.enum(['active', 'inactive']).optional(),
    // email is intentionally not updatable here — it is the host's
    // unique identity; changing it belongs in a separate, re-verified flow.
  }),
});

export type CreateHostDto = z.infer<typeof createHostSchema>['body'];
export type UpdateHostDto = z.infer<typeof updateHostSchema>['body'];
