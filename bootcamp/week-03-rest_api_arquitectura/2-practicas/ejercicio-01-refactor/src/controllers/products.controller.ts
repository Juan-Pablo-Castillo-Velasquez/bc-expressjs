// ============================================
// CONTROLLER — Paso 3: interfaz HTTP
// ============================================
// El controller hace exactamente 3 cosas:
//   1. Extraer datos de req (params, query, body)
//   2. Llamar al service con esos datos
//   3. Enviar la respuesta con res.json() o res.status()
//
// No contiene lógica de negocio.
// No accede al store directamente.

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/products.service';
import { CreateProductDto, UpdateProductDto } from '../types';

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
    const product = await service.findById(id);
    if (!product) {
      res.status(404).json({ error: 'Not Found', message: `Product ${id} not found` });
      return;
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateProductDto;
    const product = await service.create(dto);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const dto = req.body as UpdateProductDto;
    const product = await service.update(id, dto);
    if (!product) {
      res.status(404).json({ error: 'Not Found', message: `Product ${id} not found` });
      return;
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const deleted = await service.remove(id);
    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `Product ${id} not found` });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
