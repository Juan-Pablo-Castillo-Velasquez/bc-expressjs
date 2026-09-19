import { ISchedule } from '../models/schedule.model';
import * as schedulesRepository from '../repositories/schedules.repository';
import { CreateScheduleDto, UpdateScheduleDto } from '../schemas/schedule.schema';
import { AppError } from '../errors/AppError';

// ============================================
// SERVICIO: Schedule (Horario de emisión)
// ============================================
// Lógica de negocio del recurso principal del dominio "Radio Comunitaria".

export async function getAll(): Promise<ISchedule[]> {
  return schedulesRepository.findAll();
}

export async function getById(id: string): Promise<ISchedule> {
  const schedule = await schedulesRepository.findById(id);
  if (!schedule) throw new AppError(404, 'Horario no encontrado');
  return schedule;
}

export async function create(dto: CreateScheduleDto, userId: string): Promise<ISchedule> {
  // Regla de negocio: la hora de fin debe ser posterior a la hora de inicio
  if (dto.endTime <= dto.startTime) {
    throw new AppError(400, 'La hora de fin debe ser posterior a la hora de inicio');
  }
  return schedulesRepository.create({ ...dto, createdBy: userId });
}

export async function update(id: string, dto: UpdateScheduleDto): Promise<ISchedule> {
  const existing = await getById(id);

  const nextStart = dto.startTime ?? existing.startTime;
  const nextEnd = dto.endTime ?? existing.endTime;
  if (nextEnd <= nextStart) {
    throw new AppError(400, 'La hora de fin debe ser posterior a la hora de inicio');
  }

  const updated = await schedulesRepository.updateById(id, dto);
  if (!updated) throw new AppError(404, 'Horario no encontrado');
  return updated;
}

export async function remove(id: string): Promise<void> {
  const deleted = await schedulesRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Horario no encontrado');
}
