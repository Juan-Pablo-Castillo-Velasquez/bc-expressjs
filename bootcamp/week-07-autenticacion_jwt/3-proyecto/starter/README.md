# 🚀 Proyecto Semana 07 — Autenticación con JWT

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio asignado:** Radio Comunitaria
**Entidades del dominio:** programs, hosts, schedules, sponsors
**Recurso implementado en esta entrega:** `schedules` (horarios de emisión) — protegido con autenticación JWT

---

## 🎯 Descripción

API REST con autenticación completa (registro, login, refresh con rotación y logout) que
protege el CRUD de **horarios de emisión** (`Schedule`) de la emisora comunitaria: qué
programa sale al aire, con qué locutor, qué día y en qué franja horaria.

- Auth 100% provista por el starter (bcrypt + JWT access/refresh + cookies HttpOnly) — no se tocó.
- `Schedule` es el recurso nuevo de esta semana: cada horario queda asociado al usuario
  autenticado que lo creó (`createdBy: ObjectId ref 'User'`).
- Todas las rutas de `/api/v1/schedules` exigen `authMiddleware` (cookie `accessToken` válida).
- Regla de negocio propia: `endTime` debe ser posterior a `startTime` (validado en el
  servicio, tanto en creación como en actualización parcial).

## 📦 Modelos (Mongoose)

```ts
// User — DADO por el starter, sin cambios (no se requerían roles adicionales)
{
  email: string;       // unique
  password: string;    // hash bcrypt, select: false
  name: string;
  role: 'user' | 'admin';
  refreshToken?: string; // hash bcrypt del refresh token, select: false
}

// Schedule — recurso principal de esta entrega (colección "schedules")
{
  programTitle: string;
  hostName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;    // 'HH:mm'
  endTime: string;      // 'HH:mm', debe ser posterior a startTime
  isRepeating: boolean; // default true
  status: 'active' | 'cancelled' | 'on_hold'; // default 'active'
  createdBy: ObjectId;  // ref: 'User'
}
```

## 🔌 Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|-------:|-------------|
| POST   | `/api/v1/auth/register`      | 201 / 400 / 409 | Registro (hash bcrypt) |
| POST   | `/api/v1/auth/login`         | 200 / 400 / 401 | Login, emite cookies `accessToken` + `refreshToken` |
| GET    | `/api/v1/auth/me`            | 200 / 401       | Perfil del usuario autenticado |
| POST   | `/api/v1/auth/refresh`       | 200 / 401       | Rota el refresh token y renueva el access token |
| POST   | `/api/v1/auth/logout`        | 200 / 401       | Limpia cookies e invalida el refresh token en DB |
| GET    | `/api/v1/schedules`           | 200 / 401       | Listar horarios (requiere sesión) |
| GET    | `/api/v1/schedules/:id`       | 200 / 401 / 404 | Obtener un horario |
| POST   | `/api/v1/schedules`           | 201 / 400 / 401 | Crear horario (valida con Zod, `endTime > startTime`) |
| PATCH  | `/api/v1/schedules/:id`       | 200 / 400 / 401 / 404 | Actualización parcial |
| DELETE | `/api/v1/schedules/:id`       | 204 / 401 / 404 | Eliminar |

## 🏗️ Arquitectura

- `routes → controllers → services → repositories`, igual que las semanas anteriores.
- Capa de auth (`user.model.ts`, `auth.service.ts`, `auth.controller.ts`, `auth.routes.ts`,
  `utils/jwt.ts`, `middlewares/auth.middleware.ts`) es **DADA** por el starter, no se modificó.
- El recurso `resource.*` de la plantilla se renombró completo a `schedule.*` /
  `schedules.*` (modelo, schema, repositorio, servicio, controlador y rutas), siguiendo la
  instrucción explícita del `README` del proyecto ("Cambia el nombre de este archivo al
  recurso real... no el nombre genérico `resource`"), igual que se hizo en la semana 06.
- `app.ts` monta el router en `/api/v1/schedules` (antes tenía un TODO apuntando a
  `/api/v1/resources`).

## ⚠️ Limitación del entorno de verificación (leer antes de correr)

Este proyecto se completó y verificó en un entorno en la nube sin Docker (el daemon no
está disponible), sin acceso de red a `fastdl.mongodb.org` (CDN de binarios de MongoDB) y
sin poder compilar el binario nativo de `bcrypt` (bloqueado el acceso a los headers de
Node en `nodejs.org`). Por eso no se pudo levantar un Mongo real ni correr `bcrypt.hash`/
`bcrypt.compare` en este entorno. Lo que sí se verificó exhaustivamente sin necesitar
base de datos ni el binario nativo de bcrypt:

- `pnpm install` + `pnpm exec tsc --noEmit` en los tres subproyectos de esta semana
  (`ejercicio-01`, `ejercicio-02` y este proyecto) — compilan sin errores.
- Los schemas de Mongoose (`.validateSync()`) de `User` y `Schedule`, y los schemas de Zod
  (`createScheduleSchema`/`updateScheduleSchema`, `registerSchema`/`loginSchema`) se
  probaron con datos válidos e inválidos (día de la semana inexistente, hora mal
  formateada, estado inválido, campos faltantes) — todos los casos se comportan como se
  espera.
- La firma/verificación de JWT (`signAccessToken`/`verifyAccessToken`,
  `signRefreshToken`/`verifyRefreshToken`) se probó de punta a punta, incluyendo que un
  token firmado con el secreto de access es rechazado al verificarlo con el secreto de
  refresh (y viceversa) — confirma que ambos tokens usan secretos distintos.
- La lógica de negocio del servicio (`schedules.service.ts`) se probó completa —
  create/getById/update/remove, incluyendo el rechazo de horarios donde `endTime` no es
  posterior a `startTime` — reemplazando únicamente la capa de acceso a datos
  (`ScheduleModel`) por una versión en memoria, sin tocar la lógica real del servicio.
- De paso se corrigieron dos bugs que impedían compilar con las versiones exactas fijadas
  en `package.json`: `user.toObject() as Record<string, unknown>` no es válido en
  TypeScript strict con el tipo real que devuelve Mongoose 9.4.1 (hace falta el doble cast
  `as unknown as Record<string, unknown>`, aplicado en `ejercicio-01` y `ejercicio-02`); y
  `req.params.id` en Express 5 + `@types/express` 5.x tipa como `string | string[]`
  (soporta parámetros repetidos), así que se castea explícitamente a `string` en
  `schedules.controller.ts`. También se quitó `declaration`/`declarationMap` de
  `tsconfig.json`: con esas opciones activas, `tsc` fallaba al no poder nombrar
  portablemente el tipo inferido de `app`/`router` dentro de la estructura de
  `node_modules` de pnpm (`TS2742`) — innecesario en un servidor que no se publica como
  librería.

Para dejarlo 100% funcional y tomar las capturas que pide la rúbrica:

```bash
cp .env.example .env
# Genera dos secretos DISTINTOS:
#   openssl rand -base64 64   →  JWT_ACCESS_SECRET
#   openssl rand -base64 64   →  JWT_REFRESH_SECRET
docker compose up -d
pnpm install
pnpm dev      # http://localhost:3000
```

Flujo sugerido con Postman/Thunder Client (el que pide la rúbrica):

1. `POST /api/v1/auth/register` → 201
2. `POST /api/v1/auth/login` → 200, revisar que la respuesta trae las cookies `accessToken` y `refreshToken` (`httpOnly`)
3. `GET /api/v1/schedules` sin cookie → 401
4. `POST /api/v1/schedules` con cookie → 201 (crear un horario del dominio)
5. `GET /api/v1/schedules`, `GET /api/v1/schedules/:id`, `PATCH /api/v1/schedules/:id`, `DELETE /api/v1/schedules/:id`
6. `POST /api/v1/auth/refresh` → 200, nueva cookie `accessToken`
7. `POST /api/v1/auth/logout` → 200, y un `POST /api/v1/auth/refresh` posterior con la cookie vieja → 401

## 🛠️ Cómo correrlo

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm dev
```
