// src/models/program.model.ts — Entidad principal (referencia a Sponsor)
// Dominio: Radio Comunitaria

import { Schema, model, Types } from 'mongoose';

const GENEROS = ['Noticias', 'Música', 'Opinión', 'Deportes', 'Entretenimiento', 'Salud'] as const;

interface IProgram {
  title: string;
  slug: string;
  description?: string;
  genre: (typeof GENEROS)[number];
  schedule: string;
  active: boolean;
  // Referencia a la entidad secundaria — un Sponsor patrocina muchos Programs (1:N)
  sponsor: Types.ObjectId;
}

const programSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: [true, 'El slug es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser kebab-case (ej: despertar-comunitario)'],
    },
    description: {
      type: String,
      maxlength: 500,
    },
    genre: {
      type: String,
      enum: {
        values: GENEROS,
        message: `El género debe ser uno de: ${GENEROS.join(', ')}`,
      },
      required: [true, 'El género es requerido'],
    },
    schedule: {
      type: String,
      required: [true, 'El horario es requerido'],
      trim: true,
      maxlength: 120,
    },
    active: {
      type: Boolean,
      default: true,
    },
    sponsor: {
      type: Schema.Types.ObjectId,
      ref: 'Sponsor',
      required: [true, 'El patrocinador es requerido'],
    },
  },
  { timestamps: true },
);

export const Program = model<IProgram>('Program', programSchema);
