// ============================================
// Schema y Model de Producto (Mongoose)
// ============================================
//
// Mongoose permite definir la estructura del documento usando Schema.
// La interfaz TypeScript define los tipos de los campos.
// El Model es la clase que usamos para hacer queries a la colección.

import { Schema, model } from 'mongoose';

interface IProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  active: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    description: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      required: [true, 'El SKU es requerido'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<IProduct>('Product', productSchema);
