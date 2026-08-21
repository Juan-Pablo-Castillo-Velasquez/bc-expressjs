// ============================================
// TYPES — Dominio: Radio Comunitaria
// ============================================
// Recurso principal: Program (programa radial).
// Un Program se relaciona con un host (locutor/a), un schedule
// (franja horaria), un sponsor (patrocinador) y su duración.

export interface Program {
  id: number;
  name: string; // Nombre del programa, ej: "Voces del Barrio"
  hostName: string; // Locutor/a a cargo
  schedule: string; // Franja horaria, ej: "Lunes 08:00-09:00"
  sponsor: string; // Patrocinador, "Sin patrocinador" si no aplica
  durationMinutes: number; // Duración del programa en minutos
  active: boolean; // Si el programa sigue al aire
  createdAt: Date;
}

// Tipos de respuesta — no necesitan cambio
export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}
