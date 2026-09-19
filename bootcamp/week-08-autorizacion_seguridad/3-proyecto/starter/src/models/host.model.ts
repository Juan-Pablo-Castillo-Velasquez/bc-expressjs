import { Schema, model, Document } from 'mongoose';

// ============================================
// MODELO: Host (locutor)
// ============================================
// Recurso principal del dominio "Radio Comunitaria".
// El campo createdBy guarda el ID del usuario que registró al locutor.
// Esto permite que el dueño pueda editar SU registro
// (pero solo admin puede eliminarlo).

export type HostStatus = 'active' | 'inactive';

export interface IHost extends Document {
  firstName: string;
  lastName: string;
  artisticName?: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  status: HostStatus;
  createdBy: string; // user ID — do NOT remove
  createdAt: Date;
  updatedAt: Date;
}

const hostSchema = new Schema<IHost>(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    artisticName: { type: String, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, maxlength: 20 },
    bio: { type: String, trim: true, maxlength: 500 },
    photoUrl: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: String, required: true }, // user ID
  },
  { timestamps: true }
);

export const Host = model<IHost>('Host', hostSchema);
