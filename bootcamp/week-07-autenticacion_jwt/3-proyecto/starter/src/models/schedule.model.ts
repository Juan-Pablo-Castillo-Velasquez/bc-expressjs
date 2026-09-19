import mongoose, { Document, Schema } from 'mongoose';

// ============================================
// MODELO: Schedule (Horario de emisión)
// ============================================
// Recurso principal del dominio "Radio Comunitaria".
// Representa el horario en que un programa sale al aire con un locutor
// (host) asignado.

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ScheduleStatus = 'active' | 'cancelled' | 'on_hold';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export interface ISchedule extends Document {
  programTitle: string;
  hostName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // Formato 'HH:mm'
  endTime: string; // Formato 'HH:mm'
  isRepeating: boolean;
  status: ScheduleStatus;
  createdBy: mongoose.Types.ObjectId; // referencia al usuario autenticado que lo creó
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    programTitle: {
      type: String,
      required: [true, 'El título del programa es requerido'],
      trim: true,
      minlength: [2, 'Mínimo 2 caracteres'],
      maxlength: [120, 'Máximo 120 caracteres'],
    },
    hostName: {
      type: String,
      required: [true, 'El nombre del locutor es requerido'],
      trim: true,
      minlength: [2, 'Mínimo 2 caracteres'],
      maxlength: [120, 'Máximo 120 caracteres'],
    },
    dayOfWeek: {
      type: String,
      enum: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        message: 'Día de la semana inválido: {VALUE}',
      },
      required: [true, 'El día de la semana es requerido'],
    },
    startTime: {
      type: String,
      required: [true, 'La hora de inicio es requerida'],
      match: [TIME_REGEX, 'Formato de hora inválido (HH:mm)'],
    },
    endTime: {
      type: String,
      required: [true, 'La hora de fin es requerida'],
      match: [TIME_REGEX, 'Formato de hora inválido (HH:mm)'],
    },
    isRepeating: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'cancelled', 'on_hold'],
        message: 'Estado inválido: {VALUE}',
      },
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const ScheduleModel = mongoose.model<ISchedule>('Schedule', scheduleSchema);
