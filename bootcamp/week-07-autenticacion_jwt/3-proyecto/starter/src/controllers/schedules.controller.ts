import { Request, Response, NextFunction } from 'express';
import * as schedulesService from '../services/schedules.service';
import { createScheduleSchema, updateScheduleSchema } from '../schemas/schedule.schema';

// ============================================
// CONTROLADOR: Schedule (Horario de emisión)
// ============================================
// Handlers HTTP de cada ruta CRUD del recurso principal.

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedules = await schedulesService.getAll();
    res.status(200).json(schedules);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedule = await schedulesService.getById(req.params.id as string);
    res.status(200).json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
      return;
    }
    const userId = req.user!.sub;
    const schedule = await schedulesService.create(parsed.data, userId);
    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updateScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
      return;
    }
    const schedule = await schedulesService.update(req.params.id as string, parsed.data);
    res.status(200).json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await schedulesService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
