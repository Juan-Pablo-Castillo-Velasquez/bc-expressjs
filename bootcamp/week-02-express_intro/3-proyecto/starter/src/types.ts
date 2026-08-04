// ============================================
// TYPES: Interfaz del recurso principal
// ============================================
// Adapta los campos de Item a tu dominio asignado.
//
// Ejemplos por dominio:
// - Biblioteca:   title: string; author: string; isbn: string; year: number;
// - Farmacia:     name: string; price: number; stock: number; category: string;
// - Gimnasio:     name: string; plan: string; memberSince: string;
// - Restaurante:  name: string; price: number; category: string; available: boolean;
// - Hotel:        roomNumber: string; type: string; pricePerNight: number; available: boolean;

// export interface Item {
//   id: number;
//   // TODO: reemplazar estos campos por los de tu dominio
//   name: string;
//   description: string;
// }

// DTO usado para crear un nuevo item (sin id, se genera automáticamente)
// export type CreateItemDto = Omit<Item, "id">;

// // DTO para actualización (todos los campos editables)
// export type UpdateItemDto = Partial<CreateItemDto>;





export enum SponsorType {
  COMMERCIAL = 'commercial',
  NGO = 'ngo',
  GOVERNMENT = 'government',
  INDIVIDUAL = 'individual'
}

export enum GeneralStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';


export interface Program {
  id: number;
  name: string; 
  description?: string;
}

export interface Host {
  id: number;
  firstName: string;
  lastName: string;
  artisticName?: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  status: GeneralStatus;
  createdAt: Date;
}

export interface Schedule {
  id: number;
  programId: number;       // Ahora apunta correctamente a la interfaz Program
  hostId: number;          // Apunta a la interfaz Host
  dayOfWeek: DayOfWeek;
  startTime: string;       // Formato 'HH:mm'
  endTime: string;         // Formato 'HH:mm'
  isRepeating: boolean;
  status: ScheduleStatus;
}

export interface Sponsor {
  id: number;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  sponsorType: SponsorType;
  logoUrl?: string;
  status: GeneralStatus;
  createdAt: Date;
}
export type CreateSponsorDto = Omit<Sponsor, "id">;

// DTO para actualización (todos los campos editables)
export type UpdateSponsorDto = Partial<CreateSponsorDto>;