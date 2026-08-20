# 🚀 Proyecto Semana 03 — API REST con Arquitectura en Capas

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio asignado:** Radio Comunitaria
**Entidades del dominio:** programs, hosts, schedules, sponsors
**Recurso implementado en esta entrega:** `programs`

---

## 🎯 Descripción

API REST para la gestión de **programas radiales** de una emisora comunitaria, construida
con arquitectura en 4 capas (`routes → controllers → services → repositories`) y contratos
de respuesta tipados en TypeScript.

Cada programa (`Program`) representa un espacio al aire y guarda referencia a su host
(locutor/a), su franja horaria (`schedule`) y su patrocinador (`sponsor`), que son los
conceptos centrales del dominio de la radio comunitaria.

## 📦 Modelo de datos

```ts
interface Program {
  id: number;
  name: string;        // Nombre del programa, ej: "Voces del Barrio"
  hostName: string;     // Locutor/a a cargo
  schedule: string;     // Franja horaria, ej: "Lunes 08:00-09:00"
  sponsor: string;      // Patrocinador, "Sin patrocinador" si no aplica
  active: boolean;      // Si sigue al aire
  createdAt: string;
}
```

## 🔌 Endpoints

| Método | Ruta                    | Status | Descripción                          |
|--------|-------------------------|-------:|---------------------------------------|
| GET    | `/api/v1/programs`      | 200    | Listar con paginación `?page&limit`  |
| GET    | `/api/v1/programs/:id`  | 200    | Obtener programa por ID              |
| POST   | `/api/v1/programs`      | 201    | Crear nuevo programa                 |
| PUT    | `/api/v1/programs/:id`  | 200    | Actualizar programa existente        |
| DELETE | `/api/v1/programs/:id`  | 204    | Eliminar programa                    |

### Ejemplos de contrato

```json
// GET /api/v1/programs?page=1&limit=2 → 200
{
  "data": [
    { "id": 1, "name": "Voces del Barrio", "hostName": "Camila Restrepo", "schedule": "Lunes 08:00-09:00", "sponsor": "Panadería La Espiga", "active": true, "createdAt": "..." },
    { "id": 2, "name": "Ritmos de mi Tierra", "hostName": "Andrés Gómez", "schedule": "Martes 18:00-19:30", "sponsor": "Sin patrocinador", "active": true, "createdAt": "..." }
  ],
  "total": 4,
  "page": 1,
  "limit": 2
}

// GET /api/v1/programs/999 → 404
{ "error": "Not Found", "message": "Program 999 not found" }

// POST /api/v1/programs → 201
{ "data": { "id": 5, "name": "Deporte al Aire", "hostName": "Mario Vega", "schedule": "Sabado 10:00-11:00", "sponsor": "Sin patrocinador", "active": true, "createdAt": "..." } }
```

## 🏗️ Arquitectura

- **`routes/programs.routes.ts`** — solo mapea URL + método HTTP → función del controller.
- **`controllers/programs.controller.ts`** — thin controller: extrae `req`, llama al service, responde. Incluye validación básica de campos obligatorios (`name`, `hostName`, `schedule`) antes de delegar al service.
- **`services/programs.service.ts`** — lógica de negocio: paginación y la regla de dominio "si no se especifica patrocinador, se asigna 'Sin patrocinador'". Cero imports de Express.
- **`repositories/programs.repository.ts`** — único punto de acceso al store en memoria, con copias defensivas en cada operación.

## 🛠️ Cómo correrlo

```bash
pnpm install
cp .env.example .env
pnpm dev      # http://localhost:3000
pnpm build    # compila sin errores TypeScript
```

## ✅ Verificación

- `pnpm build` compila sin errores.
- `pnpm dev` levanta el servidor sin errores.
- Los 5 endpoints fueron probados manualmente con `curl` (ver ejemplos arriba): paginación, `GET` por ID, `404` con contrato de error, `POST` con `201`, `PUT` con `200` y `DELETE` con `204`.
