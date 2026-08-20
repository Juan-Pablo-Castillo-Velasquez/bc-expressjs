// ============================================
// TYPES — Contratos de respuesta
// ============================================
// Los contratos de respuesta son el "lenguaje" entre
// tu API y los clientes (frontend, apps móviles, otros servicios).
// Un contrato estable evita romper a los consumidores.

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  pages: number;
}

export type CreateBookDto = Omit<Book, 'id'>;
export type UpdateBookDto = Partial<CreateBookDto>;

// Respuesta para un solo recurso (GET /:id, POST, PUT)
export interface SingleResponse<T> {
  data: T;
}

// Respuesta para colecciones paginadas (GET /)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Contrato de error unificado para toda la API
export interface ErrorResponse {
  error: string;
  message: string;
}
