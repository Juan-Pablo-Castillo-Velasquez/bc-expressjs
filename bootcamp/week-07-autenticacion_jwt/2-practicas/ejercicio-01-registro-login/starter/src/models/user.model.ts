// ============================================
// PASO 1: Schema y Model de Usuario
// ============================================
//
// El campo `password` tiene `select: false` para que NO se incluya
// en los resultados de las queries por defecto.
// Cuando necesitas comparar la contraseña (login), debes pedir
// el campo explícitamente con: .select('+password')

import mongoose, { Schema } from 'mongoose';

// Interfaz TypeScript del documento
interface IUser {
  email: string;
  password: string; // hash bcrypt, nunca texto plano
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'Mínimo 8 caracteres'],
      select: false, // nunca se incluye en queries por defecto
    },
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'Mínimo 2 caracteres'],
      maxlength: [80, 'Máximo 80 caracteres'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
