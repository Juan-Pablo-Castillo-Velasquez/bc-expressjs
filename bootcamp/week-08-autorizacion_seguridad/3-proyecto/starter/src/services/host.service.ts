import { Host, IHost } from '../models/host.model.js';
import type { CreateHostDto, UpdateHostDto } from '../schemas/host.schema.js';

// ============================================
// SERVICIO: Host (locutor)
// ============================================

export async function findAll(): Promise<IHost[]> {
  return Host.find({ status: 'active' }).sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IHost | null> {
  return Host.findById(id);
}

export async function create(data: CreateHostDto, userId: string): Promise<IHost> {
  // createdBy guarda quién registró al locutor (para autorización posterior)
  return Host.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateHostDto,
  requesterId: string,
  requesterRole: string
): Promise<IHost | null> {
  const host = await Host.findById(id);
  if (!host) return null;

  // Un usuario solo puede editar SU registro; admin puede editar cualquiera
  if (requesterRole !== 'admin' && host.createdBy !== requesterId) {
    throw new Error('FORBIDDEN'); // capturado en el controller → AppError(403)
  }

  return Host.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id: string): Promise<IHost | null> {
  // Solo admin — enforced en la ruta
  return Host.findByIdAndDelete(id);
}
