import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z.string().regex(objectIdRegex, 'ID inválido');

export const createProductSchema = z.object({
  name:        z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(500).optional(),
  price:       z.number({ error: 'El precio es requerido' }).min(0),
  stock:       z.number().int().min(0).default(0),
  sku:         z.string().min(1, 'El SKU es requerido').max(50),
  active:      z.boolean().default(true),
  category:    z.string().regex(objectIdRegex, 'ID de categoría inválido'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
