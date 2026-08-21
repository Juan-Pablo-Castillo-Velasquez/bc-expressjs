# 🚀 Proyecto Semana 04 — Validación, Errores y Logging

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio asignado:** Radio Comunitaria
**Entidades del dominio:** programs, hosts, schedules, sponsors
**Recurso implementado en esta entrega:** `programs`

---

## 🎯 Descripción

API REST para la gestión de **programas radiales** de una emisora comunitaria. Sobre la
arquitectura en 4 capas de la semana 03, se integra:

- **Validación de datos con Zod** (`schemas/program.schema.ts`)
- **Manejo estructurado de errores** con `AppError` + error handler global de 4 parámetros
- **Logging profesional** con Winston + Morgan

## 📦 Modelo de datos

```ts
interface Program {
  id: number;
  name: string;            // Nombre del programa, ej: "Voces del Barrio"
  hostName: string;        // Locutor/a a cargo
  schedule: string;        // Franja horaria, ej: "Lunes 08:00-09:00"
  sponsor: string;         // Patrocinador, "Sin patrocinador" por defecto
  durationMinutes: number; // Duración del programa en minutos
  active: boolean;         // Si sigue al aire (default true)
  createdAt: Date;
}
```

## ✅ Validaciones (Zod)

`createProgramSchema` (`src/schemas/program.schema.ts`):

| Campo             | Regla                                              |
|--------------------|-----------------------------------------------------|
| `name`             | string, obligatorio, no vacío                       |
| `hostName`         | string, obligatorio, no vacío                       |
| `schedule`         | string, obligatorio, no vacío                       |
| `sponsor`          | string, opcional, default `"Sin patrocinador"`      |
| `durationMinutes`  | number, obligatorio, entero, `.positive()`          |
| `active`           | boolean, opcional, default `true`                   |

`updateProgramSchema = createProgramSchema.partial()` — todos los campos opcionales,
sin duplicar reglas. Los tipos `CreateProgramDto` / `UpdateProgramDto` se infieren con
`z.infer<typeof schema>`.

El parámetro `:id` de las rutas se valida con `z.coerce.number().int().positive()`.

## 🔌 Endpoints

| Método | Ruta                    | Status | Descripción                          |
|--------|-------------------------|-------:|---------------------------------------|
| GET    | `/api/v1/programs`      | 200    | Listar con paginación `?page&limit`  |
| GET    | `/api/v1/programs/:id`  | 200    | Obtener programa por ID              |
| POST   | `/api/v1/programs`      | 201    | Crear programa (valida con Zod)      |
| PUT    | `/api/v1/programs/:id`  | 200    | Actualizar programa (campos parciales)|
| DELETE | `/api/v1/programs/:id`  | 204    | Eliminar programa                    |

### Ejemplos de contrato

```json
// POST /api/v1/programs con body inválido → 400
{
  "error": "Validation Error",
  "message": "Datos de entrada inválidos",
  "issues": [
    { "field": "hostName", "message": "hostName es obligatorio" },
    { "field": "durationMinutes", "message": "durationMinutes es obligatorio" }
  ]
}

// GET /api/v1/programs/abc → 400 (id no numérico)
{
  "error": "Validation Error",
  "message": "Parámetro inválido",
  "issues": [{ "field": "id", "message": "Invalid input: expected number, received NaN" }]
}

// GET /api/v1/programs/999 → 404
{ "error": "Application Error", "message": "Program 999 not found" }

// GET /ruta-inexistente → 404 (JSON, no HTML)
{ "error": "Application Error", "message": "Ruta GET /ruta-inexistente no encontrada" }

// POST /api/v1/programs válido → 201
{
  "data": {
    "id": 4,
    "name": "Deporte al Aire",
    "hostName": "Mario Vega",
    "schedule": "Sabado 10:00-11:00",
    "sponsor": "Sin patrocinador",
    "durationMinutes": 45,
    "active": true,
    "createdAt": "2026-08-21T00:26:23.866Z"
  }
}
```

## 🏗️ Arquitectura y manejo de errores

- **`routes/programs.routes.ts`** — solo mapea URL + método HTTP → controller.
- **`controllers/programs.controller.ts`** — thin controller: valida `:id` y `body` con
  `.safeParse()`, llama al service y responde. Toda excepción va a `next(err)`.
- **`services/programs.service.ts`** — lógica de negocio; lanza `AppError(404, ...)`
  cuando el recurso no existe.
- **`repositories/programs.repository.ts`** — único punto de acceso al store en memoria,
  con copias defensivas.
- **`errors/AppError.ts`** — clase de error operacional (`statusCode`, `isOperational`).
- **`middlewares/notFound.ts`** — captura rutas no registradas y genera `AppError(404, ...)`.
- **`middlewares/errorHandler.ts`** — único middleware de 4 parámetros, registrado al
  final de `app.ts`. Distingue `ZodError` (400), `AppError` (su propio `statusCode`) y
  error genérico (500, sin stack trace en producción).
- **`config/logger.ts`** — Winston con nivel `http` en desarrollo / `warn` en producción,
  formato coloreado en dev y JSON en producción, archivo `logs/error.log` solo en
  producción. Morgan usa la stream de Winston para loguear cada request.

## 🛠️ Cómo correrlo

```bash
pnpm install
cp .env.example .env
pnpm dev      # http://localhost:3000
pnpm build    # compila sin errores TypeScript
```

## ✅ Verificación

- `pnpm build` compila sin errores (`strict` mode, sin `any`).
- `pnpm dev` levanta el servidor y muestra logs de Winston/Morgan en consola.
- Probado con `curl`: `POST` con body inválido → 400 con `issues[]`, `GET /:id` con id
  no numérico → 400, `GET /:id` inexistente → 404, `GET` a ruta no registrada → 404 en
  JSON, `POST` válido → 201, `PUT` → 200, `DELETE` → 204.
