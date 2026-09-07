# 🚀 Proyecto Semana 05 — PostgreSQL + Prisma ORM

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio asignado:** Radio Comunitaria
**Entidades del dominio:** programs, hosts, schedules, sponsors
**Recurso implementado en esta entrega:** `programs` (con relación a `hosts`)

---

## 🎯 Descripción

API REST para la gestión de **programas radiales** de una emisora comunitaria. Sobre la
arquitectura en 4 capas de las semanas anteriores, se reemplaza el store en memoria por
persistencia real con **PostgreSQL + Prisma ORM**:

- Modelo relacional 1:N (`Host` → `Program`)
- Prisma Client como singleton (`src/lib/prisma.ts`)
- Manejo de errores de Prisma (`P2002` duplicado, `P2025` no encontrado) traducidos a `AppError`
- Seed reproducible con datos reales del dominio (8 hosts, 8 programas)

## 📦 Modelo de datos (`prisma/schema.prisma`)

```prisma
model Host {
  id        Int       @id @default(autoincrement())
  name      String
  bio       String?
  email     String    @unique
  programs  Program[]
  createdAt DateTime  @default(now())
}

model Program {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  description String?
  genre       String
  schedule    String
  sponsor     String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  host   Host? @relation(fields: [hostId], references: [id], onDelete: SetNull)
  hostId Int?
}
```

`Host` es el recurso secundario (un host conduce muchos programas). `Program` es el
recurso principal de esta entrega, con `slug` como campo `@unique` para demostrar `P2002`.

## ✅ Validaciones (Zod) — `src/schemas/items.schema.ts`

| Campo         | Regla                                                              |
|---------------|---------------------------------------------------------------------|
| `title`       | string, obligatorio, máx. 150                                      |
| `slug`        | string, obligatorio, kebab-case (`despertar-comunitario`)          |
| `description` | string, opcional, máx. 500                                         |
| `genre`       | enum: Noticias, Música, Opinión, Deportes, Entretenimiento, Salud  |
| `schedule`    | string, obligatorio, máx. 120                                      |
| `sponsor`     | string, opcional, máx. 120                                         |
| `active`      | boolean, opcional, default `true`                                  |
| `hostId`      | number entero positivo, opcional                                   |

`updateItemSchema = createItemSchema.partial()`.

## 🔌 Endpoints

| Método | Ruta                    | Status | Descripción                              |
|--------|-------------------------|-------:|-------------------------------------------|
| GET    | `/api/v1/programs`      | 200    | Listar con paginación `?page&limit`, incluye `host` |
| GET    | `/api/v1/programs/:id`  | 200    | Obtener programa por ID, incluye `host`  |
| POST   | `/api/v1/programs`      | 201    | Crear programa (valida con Zod, `P2002` si el slug existe) |
| PUT    | `/api/v1/programs/:id`  | 200    | Actualizar programa (`P2025` si no existe) |
| DELETE | `/api/v1/programs/:id`  | 204    | Eliminar programa (`P2025` si no existe) |

## 🏗️ Arquitectura

- **`routes/items.routes.ts`** — mapea URL + método HTTP → controller.
- **`controllers/items.controller.ts`** — valida `:id` y `body`, llama al service, responde.
- **`services/items.service.ts`** — lógica de negocio; `getItem` lanza `AppError(404)` si `findById` retorna `null`.
- **`repositories/items.repository.ts`** — único punto de acceso a Prisma; traduce `P2002`/`P2025` a `AppError`.
- **`lib/prisma.ts`** — singleton de `PrismaClient` (patrón `globalForPrisma`, evita agotar conexiones en dev con hot-reload).
- **`errors/AppError.ts`** / **`middlewares/errorHandler.ts`** / **`middlewares/notFound.ts`** — igual que semana 04.
- **`config/logger.ts`** — Winston, usado en `server.ts` para el arranque y en el shutdown.

> Nota: los archivos y funciones mantienen el nombre genérico `items` (`items.schema.ts`,
> `items.repository.ts`, etc.) tal como vienen en el starter del bootcamp — solo se
> adaptó el **contenido** al dominio Radio Comunitaria (modelo `Program`/`Host`, rutas
> `/api/v1/programs`). No se renombraron archivos a propósito.

## ⚠️ Limitación del entorno de verificación (leer antes de correr)

Este proyecto se completó y verificó por lectura/sintaxis en un entorno en la nube sin
Docker y sin acceso de red a `binaries.prisma.sh` (el CDN de donde Prisma descarga el
motor `schema-engine`/`libquery_engine`). Por eso **no fue posible** ejecutar aquí
`pnpm exec prisma generate`, `prisma migrate dev` ni levantar Postgres para probar los
endpoints de punta a punta, y por eso **no se incluye una carpeta `prisma/migrations/`**
en esta entrega — generarla localmente es el primer paso de la lista de abajo.

Para dejarlo 100% funcional en tu máquina:

```bash
docker compose up -d
pnpm install
pnpm exec prisma migrate dev --name init
pnpm exec prisma db seed
pnpm dev      # http://localhost:3000
```

Verifica con `pnpm build` (compila sin errores TypeScript) y con `curl`/Postman contra
`/api/v1/programs`. Después de `prisma migrate dev`, comitea la carpeta
`prisma/migrations/` generada — es obligatoria según la rúbrica de esta semana.

## 🛠️ Cómo correrlo

```bash
cp .env.example .env      # ajusta DATABASE_URL si tu Postgres local difiere
docker compose up -d
pnpm install
pnpm exec prisma migrate dev --name init
pnpm exec prisma db seed
pnpm dev
```
