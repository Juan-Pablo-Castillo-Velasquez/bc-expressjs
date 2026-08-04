import { Router } from 'express';

// Store en memoria: array de items (se reinicia al reiniciar el servidor)
interface Item {
  id: number;
  name: string;
}

const items: Item[] = [];

export const itemsRouter = Router();

// ============================================
// PASO 3a: GET /items — listar todos
// ============================================
// Descomenta las siguientes líneas:
 itemsRouter.get('/', (_req, res) => {
   res.json(items);
 });

// ============================================
// PASO 3b: POST /items — crear nuevo item
// ============================================
Descomenta las siguientes líneas:
itemsRouter.post('/', (req, res) => {
  const newItem: Item = {
    id: items.length + 1,
    name: req.body.name as string,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// ============================================
// PASO 4a: GET /items/:id — obtener por ID
// ============================================
Descomenta las siguientes líneas:
itemsRouter.get('/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  res.json(item);
});

// ============================================
// PASO 4b: PUT /items/:id — actualizar item
// ============================================
Descomenta las siguientes líneas:
itemsRouter.put('/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  items[index] = { ...items[index], name: req.body.name as string };
  res.json(items[index]);
});

// ============================================
// PASO 4c: DELETE /items/:id — eliminar item
// ============================================
Descomenta las siguientes líneas:
itemsRouter.delete('/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  items.splice(index, 1);
  res.status(204).send();
});
