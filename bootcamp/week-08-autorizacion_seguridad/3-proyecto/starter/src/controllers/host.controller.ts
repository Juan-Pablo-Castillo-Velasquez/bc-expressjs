import { Request, Response, NextFunction } from 'express';
import * as hostService from '../services/host.service.js';
import { createHostSchema, updateHostSchema } from '../schemas/host.schema.js';
import { AppError } from '../errors/AppError.js';

// ============================================
// CONTROLADOR: Host (locutor)
// ============================================

export async function getHosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const hosts = await hostService.findAll();
    res.json({ data: hosts, total: hosts.length });
  } catch (err) {
    next(err);
  }
}

export async function getHostById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const host = await hostService.findById(req.params.id);
    if (!host) throw new AppError(404, 'Host not found');
    res.json({ data: host });
  } catch (err) {
    next(err);
  }
}

export async function createHost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = createHostSchema.parse({ body: req.body });
    const host = await hostService.create(body, req.user.sub);
    res.status(201).json({ message: 'Host created', data: host });
  } catch (err) {
    next(err);
  }
}

export async function updateHost(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = updateHostSchema.parse({ body: req.body });
    const host = await hostService.update(
      req.params.id,
      body,
      req.user.sub,
      req.user.role as string
    );

    if (!host) throw new AppError(404, 'Host not found');
    res.json({ message: 'Host updated', data: host });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return next(new AppError(403, 'You can only update hosts you created'));
    }
    next(err);
  }
}

export async function deleteHost(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const host = await hostService.remove(req.params.id);
    if (!host) throw new AppError(404, 'Host not found');
    res.json({ message: 'Host deleted' });
  } catch (err) {
    next(err);
  }
}
