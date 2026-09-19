# 🚀 Proyecto Semana 06 — MongoDB + Mongoose

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio asignado:** Radio Comunitaria
**Entidades del dominio:** programs, hosts, schedules, sponsors
**Recurso implementado en esta entrega:** `programs` (entidad principal) y `sponsors` (entidad secundaria)

---

## 🎯 Descripción

API REST para gestionar los **programas** y **patrocinadores** de una emisora comunitaria,
migrando el mismo dominio de la semana 05 (PostgreSQL + Prisma) a **MongoDB + Mongoose**
para comparar ambos enfoques:

- `Program` (principal) referencia a `Sponsor` (secundaria) vía `ObjectId` + `.populate('sponsor')`
- Validación en dos capas: Mongoose (schema) y Zod (request)
- Errores específicos de MongoDB traducidos a `AppError`: `CastError` → 400, código `11000` → 409, documento no encontrado → 404
- Seed reproducible con datos reales del dominio (9 sponsors, 8 programas)

## 📦 Modelos (Mongoose)

```ts
// Sponsor — entidad secundaria (colección "sponsors")
{
  companyName: string;
  contactName?: string;
  email: string;          // unique
  phone?: string;
  sponsorType: 'commercial' | 'ngo' | 'government' | 'individual';
  logoUrl?: string;
  active: boolean;
}

// Program — entidad principal (colección "programs")
{
  title: string;
  slug: string;            // unique, kebab-case
  description?: string;
  genre: 'Noticias' | 'Música' | 'Opinión' | 'Deportes' | 'Entretenimiento' | 'Salud';
  schedule: string;
  active: boolean;
  sponsor: ObjectId;        // ref: 'Sponsor'
}
```

## 🔌 Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|-------:|-------------|
| GET    | `/api/v1/sponsors`      | 200         | Listar patrocinadores |
| GET    | `/api/v1/sponsors/:id`  | 200 / 404   | Obtener patrocinador |
| POST   | `/api/v1/sponsors`      | 201 / 400 / 409 | Crear (valida email único) |
| PUT    | `/api/v1/sponsors/:id`  | 200 / 404   | Actualizar |
| DELETE | `/api/v1/sponsors/:id`  | 204 / 404   | Eliminar |
| GET    | `/api/v1/programs?page&limit&search` | 200 | Listado paginado, incluye `sponsor` poblado |
| GET    | `/api/v1/programs/:id`  | 200 / 404   | Obtener con `sponsor` poblado |
| POST   | `/api/v1/programs`      | 201 / 400 / 409 | Crear (valida `sponsor` como ObjectId, `slug` único) |
| PUT    | `/api/v1/programs/:id`  | 200 / 404   | Actualizar |
| DELETE | `/api/v1/programs/:id`  | 204 / 404   | Eliminar |

## 🏗️ Arquitectura

- `routes → controllers → services → repositories`, igual que las semanas anteriores.
- `models/sponsor.model.ts` / `models/program.model.ts` — a diferencia de otras semanas, la
  plantilla de este proyecto (`3-proyecto/starter`) pedía explícitamente **renombrar**
  `secondary.*` / `primary.*` a los nombres del dominio, así que aquí sí se renombraron
  todos los archivos (`sponsor.*`, `program.*`, `sponsors.*`, `programs.*`) en vez de
  mantener el nombre genérico.
- `objectIdSchema` vive en `schemas/program.schema.ts` y lo reutiliza también
  `sponsors.controller.ts` (mismo patrón que traía el starter original).

## ⚠️ Limitación del entorno de verificación (leer antes de correr)

Este proyecto se completó y verificó en un entorno en la nube sin Docker (el daemon no
está disponible) y sin acceso de red a `fastdl.mongodb.org` (el CDN de binarios de
MongoDB), así que no fue posible levantar un Mongo real aquí. Lo que sí se verificó
exhaustivamente sin necesitar base de datos:

- `pnpm install` + `pnpm exec tsc --noEmit` en los tres subproyectos de esta semana
  (`ejercicio-01`, `ejercicio-02` y este proyecto) — compilan sin errores.
- Los schemas de Mongoose (`.validateSync()`) y de Zod se probaron con datos válidos e
  inválidos (email duplicado, slug con espacios, género inexistente, sponsor faltante) —
  todos los casos se comportan como se espera.
- De paso se corrigieron dos bugs de la plantilla original del bootcamp que impedían
  compilar con las versiones exactas fijadas en `package.json`: faltaban `dotenv` y
  `mongodb` como dependencias directas (el código los usa directamente pero no estaban
  listados), y `z.number({ required_error: ... })` no es válido en Zod 4.3.6 (se cambió a
  `z.number({ error: ... })`, la sintaxis correcta de Zod v4). El mismo fix se aplicó en
  `ejercicio-01` y `ejercicio-02`.

Para dejarlo 100% funcional y tomar las capturas que pide la rúbrica:

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm seed
pnpm dev      # http://localhost:3000
```

Prueba con Postman/Thunder Client:

- `GET /api/v1/sponsors` y `GET /api/v1/programs` (debe traer `sponsor` como objeto, no como ID)
- `POST /api/v1/programs` con un `sponsor` inválido (no ObjectId) → 400
- `POST /api/v1/sponsors` repitiendo un `email` → 409
- `GET /api/v1/programs/000000000000000000000000` (ID válido pero inexistente) → 404

## 🛠️ Cómo correrlo

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm seed
pnpm dev
```
