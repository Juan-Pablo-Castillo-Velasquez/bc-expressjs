// ============================================
// CONTROLLER — Interfaz HTTP
// ============================================
// Exactamente 3 pasos: extraer → llamar service → responder.
// Sin lógica de negocio. Maneja 404 cuando el service retorna undefined.

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/programs.service';
import { ValidationError } from '../services/programs.service';
import { CreateProgramDto, UpdateProgramDto } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const program = await service.findById(id);
    if (!program) {
      res.status(404).json({ error: 'Not Found', message: `Program ${id} not found` });
      return;
    }
    res.json({ data: program });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateProgramDto;
    const program = await service.create(dto);
    res.status(201).json({ data: program });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: 'Bad Request', message: err.message });
      return;
    }
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const dto = req.body as UpdateProgramDto;
    const program = await service.update(id, dto);
    if (!program) {
      res.status(404).json({ error: 'Not Found', message: `Program ${id} not found` });
      return;
    }
    res.json({ data: program });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const deleted = await service.remove(id);
    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `Program ${id} not found` });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
