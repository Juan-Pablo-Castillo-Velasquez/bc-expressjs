// src/controllers/programs.controller.ts — Capa HTTP para Program

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/programs.service';
import {
  createProgramSchema,
  updateProgramSchema,
  objectIdSchema,
} from '../schemas/program.schema';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const search = req.query['search'] as string | undefined;
    const result = await service.getAll(page, limit, search);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = objectIdSchema.parse(req.params['id']);
    const program = await service.getById(id);
    res.json(program);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createProgramSchema.parse(req.body);
    const program = await service.createProgram(dto);
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = objectIdSchema.parse(req.params['id']);
    const dto = updateProgramSchema.parse(req.body);
    const program = await service.updateProgram(id, dto);
    res.json(program);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = objectIdSchema.parse(req.params['id']);
    await service.deleteProgram(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
