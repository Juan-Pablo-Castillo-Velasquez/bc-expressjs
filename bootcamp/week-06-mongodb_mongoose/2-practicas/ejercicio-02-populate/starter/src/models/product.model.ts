// ============================================
// Schema de Producto — con referencia a Category
// ============================================
//
// Los productos referencian categorías usando Schema.Types.ObjectId.
// En MongoDB se almacena solo el ObjectId (24 hex chars).
// Al usar .populate('category'), Mongoose lo reemplaza por el objeto completo.

import { Schema, model, Types } from 'mongoose';

interface IProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  active: boolean;
  category: Types.ObjectId;
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es requerida'],
    },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);
