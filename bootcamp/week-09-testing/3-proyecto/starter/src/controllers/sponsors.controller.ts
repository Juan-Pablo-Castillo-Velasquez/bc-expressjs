import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as sponsorsService from '../services/sponsors.service.js';
import {
  createSponsorSchema,
  updateSponsorSchema,
  sponsorIdSchema,
} from '../validators/sponsors.schema.js';

export async function getAllHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sponsors = await sponsorsService.getAll();
    res.status(200).json({ data: sponsors, total: sponsors.length });
  } catch (err) {
    next(err);
  }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = sponsorIdSchema.parse({ params: req.params });
    const sponsor = await sponsorsService.getById(params.id);
    res.status(200).json({ data: sponsor });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createSponsorSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string };
    const sponsor = await sponsorsService.create(body, user.sub);
    res.status(201).json({ data: sponsor });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = sponsorIdSchema.parse({ params: req.params });
    const { body } = updateSponsorSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string; role: string };
    const sponsor = await sponsorsService.update(params.id, body, user.sub, user.role);
    res.status(200).json({ data: sponsor });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = sponsorIdSchema.parse({ params: req.params });
    const user = res.locals['user'] as { sub: string; role: string };
    await sponsorsService.remove(params.id, user.sub, user.role);
    res.status(204).send();
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}
