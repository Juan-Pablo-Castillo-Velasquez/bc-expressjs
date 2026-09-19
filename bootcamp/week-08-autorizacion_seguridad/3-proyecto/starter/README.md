# 🚀 Proyecto Semana 08 — Autorización y Seguridad

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio asignado:** Radio Comunitaria
**Entidades del dominio:** programs, hosts, schedules, sponsors
**Recurso implementado en esta entrega:** `hosts` (locutores) — protegido con RBAC, autorización por dueño, y una capa completa de seguridad HTTP

---

## 🎯 Descripción

API REST que protege el directorio de **locutores** (`Host`) de la emisora comunitaria con
autenticación JWT (Bearer token), autorización por rol y por dueño del recurso, y una capa
de seguridad HTTP completa: Helmet, rate limiting (global + estricto en auth), CORS con
whitelist, y sanitización contra NoSQL injection.

- Auth 100% provista por el starter (JWT en `Authorization: Bearer <token>`, refresh token
  en cookie HttpOnly) — no se tocó.
- `Host` es el recurso nuevo de esta semana: cada locutor queda asociado al usuario
  autenticado que lo registró (`createdBy`).
- Lectura (`GET /`, `GET /:id`) es **pública** — cualquiera puede ver el directorio.
- Crear (`POST`) y editar (`PATCH`) requieren autenticación; **editar** además exige ser el
  dueño del registro o tener rol `admin` (verificado en el servicio, no solo en la ruta).
- Eliminar (`DELETE`) requiere rol `admin` (`requireRole('admin')`).

## 📦 Modelos (Mongoose)

```ts
// User — DADO por el starter, sin cambios
{
  email: string;       // unique
  password: string;    // hash bcrypt, select: false
  name: string;
  role: 'user' | 'admin';
  refreshToken?: string; // select: false
}

// Host (locutor) — recurso principal de esta entrega (colección "hosts")
{
  firstName: string;
  lastName: string;
  artisticName?: string;
  email: string;        // unique
  phone?: string;
  bio?: string;
  photoUrl?: string;
  status: 'active' | 'inactive'; // default 'active'
  createdBy: string;    // user ID de quien lo registró
}
```

## 🔌 Endpoints

| Método | Ruta | Auth | Status | Descripción |
|--------|------|------|-------:|-------------|
| POST   | `/api/v1/auth/register` | pública (rate-limited) | 201 / 400 / 409 | Registro |
| POST   | `/api/v1/auth/login`    | pública (rate-limited) | 200 / 400 / 401 | Login, devuelve `{ accessToken, role }` + cookie `refreshToken` |
| POST   | `/api/v1/auth/refresh`  | cookie `refreshToken` | 200 / 401 | Rota tokens |
| POST   | `/api/v1/auth/logout`   | Bearer | 200 / 401 | Invalida el refresh token |
| GET    | `/api/v1/auth/me`       | Bearer | 200 / 401 | Perfil propio |
| GET    | `/api/v1/users/dashboard` | Bearer | 200 / 401 | Ejemplo de ruta protegida genérica |
| GET    | `/api/v1/hosts`         | **pública** | 200 | Listar locutores activos |
| GET    | `/api/v1/hosts/:id`     | **pública** | 200 / 404 | Ver un locutor |
| POST   | `/api/v1/hosts`         | Bearer | 201 / 400 / 401 | Registrar locutor (Zod valida, bloquea HTML) |
| PATCH  | `/api/v1/hosts/:id`     | Bearer + dueño **o** `admin` | 200 / 400 / 401 / 403 / 404 | Actualizar |
| DELETE | `/api/v1/hosts/:id`     | Bearer + `admin` | 200 / 401 / 403 / 404 | Eliminar |

## 🏗️ Arquitectura

- `routes → controllers → services → repositories`, igual que las semanas anteriores.
- Capa de auth (`user.model.ts`, `auth.*`, `utils/jwt.ts`, `middlewares/auth.middleware.ts`)
  y la capa de seguridad HTTP base (`config/security.ts`, `app.ts`) vienen **dadas** por el
  starter; lo que se completó esta semana fue `requireRole` (RBAC) y la autorización por
  dueño en `host.service.ts` — igual que en `ejercicio-01`.
- El recurso `item.*` de la plantilla se renombró completo a `host.*` (modelo, schema,
  servicio, controlador y rutas), siguiendo la instrucción explícita del `README` del
  proyecto, igual que en las semanas 06 y 07.
- `app.ts` monta el router en `/api/v1/hosts` (antes `/api/v1/items`).

## ⚠️ Limitación del entorno de verificación (leer antes de correr)

Este proyecto se completó y verificó en un entorno en la nube sin Docker (el daemon no
está disponible), sin acceso de red a `fastdl.mongodb.org`, y sin poder compilar el binario
nativo de `bcrypt` (bloqueado el acceso a los headers de Node en `nodejs.org`) — la misma
limitación documentada en la entrega de la semana 07. Lo que sí se verificó exhaustivamente
sin necesitar base de datos real ni el binario nativo de bcrypt:

- `pnpm install` + `pnpm exec tsc --noEmit` **y** `tsc` (build completo) en los tres
  subproyectos de esta semana (`ejercicio-01`, `ejercicio-02` y este proyecto) — compilan
  sin errores.
- Un servidor HTTP real (`http.createServer(app)` + `fetch` nativo, sobre un puerto
  efímero) para probar la capa de seguridad de punta a punta: headers de Helmet, headers de
  rate limit, whitelist de CORS (origen permitido vs. rechazado), y sanitización contra
  NoSQL injection — sin necesitar Mongo, reemplazando únicamente los métodos estáticos del
  modelo de Mongoose (`Host.findOne/findById/create/findByIdAndUpdate/findByIdAndDelete`)
  por una versión en memoria, igual que se hizo con `Schedule` en la semana 07.
- El flujo completo de RBAC y autorización por dueño sobre `/api/v1/hosts`: 401 sin token,
  403 con token de un usuario que no es ni dueño ni admin, 200 para el dueño o para admin
  en `PATCH`, y 403/200 según rol en `DELETE`. Lo mismo para las rutas `/api/v1/admin/*`
  del `ejercicio-01` (401 sin token, 403 con rol `user`, 200 con rol `admin`).

Durante esta verificación aparecieron **tres bugs reales de la plantilla** (no del código
que yo escribí) que rompían el comportamiento que el propio material de la semana pide, y
los corregí porque sin eso el proyecto no arranca o no cumple lo que pide la rúbrica de
seguridad. Los tres están documentados aquí para que quede claro qué se tocó y por qué:

1. **`app.options('*', cors(corsOptions))` no arranca en Express 5.** Express 5 usa
   internamente `path-to-regexp@8`, que ya no acepta un wildcard `'*'` sin nombre — lanza
   `PathError: Missing parameter name at index 1: *` al importar `app.ts`, es decir, el
   servidor no llega ni a levantar. Esta línea está en `ejercicio-02/starter/src/app.ts` y
   en `3-proyecto/starter/src/app.ts` (este último marcado "no modificar" en su propio
   README, pero tal como está no funciona). Se cambió a la sintaxis que exige Express 5:
   `app.options('*splat', cors(corsOptions))`.
2. **`express-mongo-sanitize@2.2.0` no es compatible con Express 5.** Express 5 convirtió
   `req.query` en una propiedad de solo lectura (se calcula on-demand desde `req.url`). El
   middleware de `express-mongo-sanitize` hace `req.query = sanitizedTarget`, lo cual lanza
   `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter` en
   **cualquier** request — incluido un simple `GET /health` sin query string. Esto rompía
   exactamente lo que la rúbrica pide probar (petición de login con operadores `$gt`
   devolvía `500` en vez de rechazar la inyección). La librería no tiene una versión más
   nueva que lo resuelva (2.2.0 es la última publicada). La corrección: su propio helper
   exportado `sanitize()` ya modifica el objeto recibido *en sitio* y devuelve esa misma
   referencia — no hace falta reasignarlo — así que en `config/security.ts` se agregó
   `sanitizeInputs`, un wrapper de una línea por campo que llama a `sanitize()` sobre
   `body`/`params`/`query`/`headers` sin la reasignación que rompe con Express 5. Misma
   protección, cero incompatibilidad. Aplicado en `ejercicio-02` y en este proyecto.
3. **`errorHandler.ts` no reconocía errores de Zod.** Cualquier body mal formado —
   incluida una inyección NoSQL ya sanitizada, que termina siendo `{}` en vez de un string
   y por lo tanto falla la validación de tipo de Zod antes de llegar al servicio — caía en
   la rama genérica y devolvía `500 Internal server error` en vez de un `400` controlado.
   Se agregó una rama `err instanceof ZodError` que responde `400` con los mensajes de
   validación (sin exponer stack trace), aplicada en los tres subproyectos. Con esto, el
   caso de prueba del README del `ejercicio-02` (`POST /auth/login` con
   `{"email":{"$gt":""},"password":{"$gt":""}}`) devuelve **`400 Bad Request`** en vez del
   `401 Invalid credentials` que el README describe textualmente: una vez que el
   sanitizador elimina los operadores `$gt`, el body queda como `{email: {}, password: {}}`
   — un objeto, no un string — así que Zod lo rechaza por forma inválida *antes* de llegar
   a comparar credenciales. Esto es, si acaso, más seguro que lo descrito (falla más
   temprano, sin tocar la base de datos), y lo importante — que la inyección nunca
   bypasea el login, nunca llega a Mongo, y nunca cae en un 500 con stack trace — se
   cumple igual.

También encontré una inconsistencia menor (documentación, no código) que no requirió
ningún cambio: el `README` del `ejercicio-02` instruye configurar
`standardHeaders: 'draft-7'` en `express-rate-limit`, pero su propia sección "Verifica"
dice que deben aparecer headers `RateLimit-Limit` y `RateLimit-Remaining` por separado —
esos nombres corresponden al formato `draft-6`. Con `draft-7` (lo que el bloque de código
de esa misma PASO realmente pide descomentar, y lo que implementé), el rate limiting
funciona igual de bien, solo que expone un único header combinado `RateLimit: limit=100,
remaining=99, reset=900` más `RateLimit-Policy`, tal como especifica el draft-7 del IETF.
Confirmado con el servidor HTTP real.

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

1. `POST /api/v1/auth/register` → 201 (crea un usuario con rol `user`; para probar rutas
   de admin, cambia el `role` a `'admin'` directamente en Mongo para un segundo usuario)
2. `POST /api/v1/auth/login` → 200, guarda el `accessToken` de la respuesta
3. `GET /api/v1/hosts` sin token → 200 (es pública)
4. `POST /api/v1/hosts` sin token → 401; con `Authorization: Bearer <accessToken>` → 201
5. `PATCH /api/v1/hosts/:id` con el token de OTRO usuario (no dueño, no admin) → 403
6. `PATCH /api/v1/hosts/:id` con tu propio token → 200
7. `DELETE /api/v1/hosts/:id` con un token `user` → 403; con un token `admin` → 200
8. `POST /api/v1/auth/login` 6 veces seguidas con credenciales inválidas → el 6to intento
   → 429 Too Many Requests
9. `POST /api/v1/auth/login` con `{"email":{"$gt":""},"password":{"$gt":""}}` → 400
   (inyección sanitizada y rechazada, ver limitación #3 arriba)
10. Request con header `Origin: http://evil.com` → bloqueado por CORS (whitelist)

## 🛠️ Cómo correrlo

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm dev
```
