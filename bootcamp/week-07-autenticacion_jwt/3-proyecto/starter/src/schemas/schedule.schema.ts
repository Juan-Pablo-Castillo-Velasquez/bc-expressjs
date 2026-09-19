import { z } from 'zod';

// ============================================
// SCHEMA: Schedule (Horario de emisión)
// ============================================
// Validación de entrada para el recurso principal del dominio
// "Radio Comunitaria".

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createScheduleSchema = z.object({
  programTitle: z
    .string()
    .min(2, 'El título del programa debe tener al menos 2 caracteres')
    .max(120, 'Máximo 120 caracteres'),
  hostName: z
    .string()
    .min(2, 'El nombre del locutor debe tener al menos 2 caracteres')
    .max(120, 'Máximo 120 caracteres'),
  dayOfWeek: z.enum(DAYS_OF_WEEK, { error: 'Día de la semana inválido' }),
  startTime: z.string().regex(TIME_REGEX, 'Formato de hora inválido (HH:mm)'),
  endTime: z.string().regex(TIME_REGEX, 'Formato de hora inválido (HH:mm)'),
  isRepeating: z.boolean().default(true),
  status: z.enum(['active', 'cancelled', 'on_hold']).default('active'),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export type CreateScheduleDto = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleDto = z.infer<typeof updateScheduleSchema>;
