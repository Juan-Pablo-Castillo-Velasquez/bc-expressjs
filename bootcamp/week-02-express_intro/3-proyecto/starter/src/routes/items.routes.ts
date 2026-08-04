import { Router } from 'express';
import * as store from '../store.js';
import type { CreateSponsorDto, UpdateSponsorDto } from '../types.js';

export const sponsorsRouter = Router();

// GET /api/v1/sponsors — Listar todos los patrocinadores
sponsorsRouter.get('/', (_req, res) => {
  res.status(200).json(store.getAll());
});

// GET /api/v1/sponsors/:id — Obtener patrocinador por ID
sponsorsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const sponsor = store.getById(id);

  if (!sponsor) {
    return res.status(404).json({ error: 'Sponsor not found' });
  }

  res.status(200).json(sponsor);
});

// POST /api/v1/sponsors — Crear nuevo patrocinador
sponsorsRouter.post('/', (req, res) => {
  const dto: CreateSponsorDto = req.body;
  const newSponsor = store.create(dto);
  res.status(201).json(newSponsor);
});

// PUT /api/v1/sponsors/:id — Actualizar patrocinador
sponsorsRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const dto: UpdateSponsorDto = req.body;
  const updated = store.update(id, dto);

  if (!updated) {
    return res.status(404).json({ error: 'Sponsor not found' });
  }

  res.status(200).json(updated);
});

// DELETE /api/v1/sponsors/:id — Eliminar patrocinador
sponsorsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const removed = store.remove(id);

  if (!removed) {
    return res.status(404).json({ error: 'Sponsor not found' });
  }

  res.status(204).send();
});