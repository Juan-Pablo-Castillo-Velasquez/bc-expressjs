import { ScheduleModel, ISchedule } from '../models/schedule.model';
import { CreateScheduleDto, UpdateScheduleDto } from '../schemas/schedule.schema';

// ============================================
// REPOSITORIO: Schedule (Horario de emisión)
// ============================================
// Operaciones de base de datos para el recurso principal.

export async function findAll(): Promise<ISchedule[]> {
  return ScheduleModel.find().sort({ dayOfWeek: 1, startTime: 1 });
}

export async function findById(id: string): Promise<ISchedule | null> {
  return ScheduleModel.findById(id);
}

export async function create(
  data: CreateScheduleDto & { createdBy: string }
): Promise<ISchedule> {
  return ScheduleModel.create(data);
}

export async function updateById(
  id: string,
  data: UpdateScheduleDto
): Promise<ISchedule | null> {
  return ScheduleModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await ScheduleModel.findByIdAndDelete(id);
  return result !== null;
}
