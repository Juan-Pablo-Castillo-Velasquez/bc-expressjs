// src/models/sponsor.model.ts — Entidad secundaria (sin referencias)
// Dominio: Radio Comunitaria

import { Schema, model } from 'mongoose';

interface ISponsor {
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  sponsorType: 'commercial' | 'ngo' | 'government' | 'individual';
  logoUrl?: string;
  active: boolean;
}

const sponsorSchema = new Schema<ISponsor>(
  {
    companyName: {
      type: String,
      required: [true, 'El nombre de la empresa es requerido'],
      trim: true,
      maxlength: 120,
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'El correo de contacto es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Correo electrónico inválido'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    sponsorType: {
      type: String,
      enum: {
        values: ['commercial', 'ngo', 'government', 'individual'],
        message: 'sponsorType debe ser commercial, ngo, government o individual',
      },
      default: 'commercial',
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// 'Sponsor' (singular) → colección 'sponsors'
export const Sponsor = model<ISponsor>('Sponsor', sponsorSchema);
