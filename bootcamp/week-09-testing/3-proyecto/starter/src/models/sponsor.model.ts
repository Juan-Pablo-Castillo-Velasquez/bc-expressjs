import mongoose, { Schema, Document } from 'mongoose';
import type { SponsorStatus } from '../types/index.js';

// Dominio: Radio Comunitaria
// Un Sponsor (patrocinador) apoya económicamente a la radio.
export interface ISponsor extends Document {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  contributionAmount?: number;
  status: SponsorStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorSchema = new Schema<ISponsor>(
  {
    name:               { type: String, required: true, trim: true },
    contactEmail:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    contactPhone:       { type: String },
    contributionAmount: { type: Number, min: 0 },
    status:             { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy:          { type: String, required: true },
  },
  { timestamps: true },
);

export const SponsorModel = mongoose.model<ISponsor>('Sponsor', SponsorSchema);
