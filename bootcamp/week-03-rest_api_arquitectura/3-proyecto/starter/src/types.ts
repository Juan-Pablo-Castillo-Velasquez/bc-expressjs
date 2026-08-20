// ============================================
// TYPES — Dominio: Radio Comunitaria
// ============================================
// Recurso principal de la semana 03: Program (programa radial).
// Un Program se relaciona con un host (locutor/a), un schedule
// (franja horaria) y opcionalmente un sponsor (patrocinador).

export interface Program {
  id: number;
  name: string;          // Nombre del programa, ej: "Voces del Barrio"
  hostName: string;      // Nombre del host/locutor a cargo
  schedule: string;      // Franja horaria, ej: "Lunes 08:00-09:00"
  sponsor: string;       // Patrocinador, "Sin patrocinador" si no aplica
  active: boolean;       // Si el programa sigue al aire
  createdAt: string;
}

// DTO para crear — sin campos auto-generados
export type CreateProgramDto = Omit<Program, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos opcionales
export type UpdateProgramDto = Partial<CreateProgramDto>;

// Contratos de respuesta (genéricos, no cambiar nombres)
export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
