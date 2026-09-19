// src/controllers/sponsors.controller.ts — Capa HTTP para Sponsor

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/sponsors.service';
import { createSponsorSchema, updateSponsorSchema } from '../schemas/sponsor.schema';
import { objectIdSchema } from '../schemas/program.schema';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sponsors = await service.getAll();
    res.json(sponsors);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = objectIdSchema.parse(req.params['id']);
    const sponsor = await service.getById(id);
    res.json(sponsor);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createSponsorSchema.parse(req.body);
    const sponsor = await service.createSponsor(dto);
    res.status(201).json(sponsor);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = objectIdSchema.parse(req.params['id']);
    const dto = updateSponsorSchema.parse(req.body);
    const sponsor = await service.updateSponsor(id, dto);
    res.json(sponsor);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = objectIdSchema.parse(req.params['id']);
    await service.deleteSponsor(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
