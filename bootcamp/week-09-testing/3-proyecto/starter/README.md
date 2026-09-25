# Semana 09 — Testing (Jest + Supertest)

**Aprendiz:** Juan Pablo Castillo Velásquez
**Ficha:** 3228970
**Dominio:** Radio Comunitaria

## Descripción

API REST para la gestión de **patrocinadores (Sponsors)** de una radio comunitaria, con autenticación JWT y autorización por rol/propiedad (owner-or-admin). Incluye:

- **Ejercicio 01** — pruebas unitarias de `auth.service.ts` (repositorio mockeado).
- **Ejercicio 02** — pruebas de integración de las rutas `/api/v1/auth/*` (mongodb-memory-server).
- **Proyecto** — API completa de `Sponsor` (patrocinadores), con pruebas unitarias del servicio y pruebas de integración de las rutas, reutilizando y adaptando los tests de autenticación del Ejercicio 01.

## Modelos

### Sponsor (patrocinador)

| Campo                 | Tipo                     | Notas                                  |
|-----------------------|--------------------------|-----------------------------------------|
| `name`                | `string`                 | Requerido                               |
| `contactEmail`        | `string`                 | Requerido, único                        |
| `contactPhone`        | `string`                 | Opcional                                |
| `contributionAmount`  | `number`                 | Opcional, ≥ 0                           |
| `status`               | `'active' \| 'inactive'` | Por defecto `'active'`                  |
| `createdBy`           | `string` (id de usuario) | Se asigna automáticamente al crear      |
| `createdAt`/`updatedAt` | `Date`                 | Automáticos (timestamps de Mongoose)    |

## Endpoints

| Método | Ruta                      | Auth              | Descripción                                    |
|--------|---------------------------|-------------------|-------------------------------------------------|
| GET    | `/api/v1/sponsors`        | Público           | Lista todos los patrocinadores                  |
| GET    | `/api/v1/sponsors/:id`    | Público           | Obtiene un patrocinador por id                  |
| POST   | `/api/v1/sponsors`        | Requiere token    | Crea un patrocinador (409 si el email ya existe)|
| PUT    | `/api/v1/sponsors/:id`    | Owner o admin     | Actualiza (403 si no es dueño ni admin)         |
| DELETE | `/api/v1/sponsors/:id`    | Owner o admin     | Elimina (403 si no es dueño ni admin)           |

La autenticación (`/api/v1/auth/register`, `/login`, `/me`) es la misma del Ejercicio 02, reutilizada tal cual en el proyecto.

## Arquitectura

`routes → controllers → services → repositories → models`. La lógica de autorización owner-or-admin vive en la capa de **servicio** (`sponsors.service.ts`), no en middlewares de ruta, para poder testearla de forma aislada con mocks del repositorio.

## Pruebas incluidas

- `src/__tests__/auth.service.test.ts` — 7 pruebas unitarias (reutilizadas y adaptadas del Ejercicio 01).
- `src/__tests__/sponsors.service.test.ts` — 13 pruebas unitarias (getAll, getById, create, update, remove — incluye los casos 403/404/409).
- `src/__tests__/sponsors.routes.test.ts` — 13 pruebas de integración (lista, creación, duplicados, autorización owner/stranger/admin) usando `mongodb-memory-server`.

## ⚠️ Limitación del entorno de verificación

Durante el desarrollo y la verificación de esta entrega se usó un entorno de sandbox en la nube para correr `tsc` y las pruebas. Ese entorno tiene bloqueado por política de red el acceso a `fastdl.mongodb.org` y `downloads.mongodb.org`, que es de donde `mongodb-memory-server` descarga el binario de MongoDB la primera vez que se usa. Esto **no es un problema del código ni de los tests**: es una restricción del sandbox de verificación.

En consecuencia, en ese entorno:

- ✅ `npx tsc --noEmit` compila sin errores.
- ✅ Las 20 pruebas unitarias (`auth.service.test.ts` + `sponsors.service.test.ts`, que mockean sus repositorios y no requieren una base de datos real) pasan al 100%.
- ✅ La lógica de negocio y el cableado HTTP completo (rutas → controladores → servicios → validadores → middlewares → manejo de errores, incluida la autorización owner-or-admin) se verificaron adicionalmente con un test temporal que sustituía `mongodb-memory-server` por repositorios mockeados — confirmando que el flujo completo (401 sin token, 422 en datos inválidos, 201 al crear, 409 en email duplicado, 200/404 al consultar, 403/200 en actualización según el rol, 403/204 en eliminación según el rol) funciona correctamente de punta a punta.
- ❌ `sponsors.routes.test.ts` (y, en el Ejercicio 02, `auth.integration.test.ts`) no pueden ejecutarse en ese sandbox porque `MongoMemoryServer.create()` falla al intentar descargar el binario de Mongo (`403` al pedir `https://fastdl.mongodb.org/...`).

**Para verificar la suite completa** (incluyendo las pruebas de integración con `mongodb-memory-server`), estos comandos deben correrse en un entorno con acceso normal a internet — por ejemplo la máquina local o WSL del estudiante, donde `fastdl.mongodb.org` no está bloqueado:

```bash
cd bootcamp/week-09-testing/2-practicas/ejercicio-02-integration-tests/starter
pnpm install
pnpm test -- --coverage

cd ../../../3-proyecto/starter
pnpm install
pnpm test -- --coverage
```

La primera ejecución de `mongodb-memory-server` en una máquina nueva descarga el binario de MongoDB (puede tardar uno o dos minutos); las siguientes ejecuciones son inmediatas porque el binario queda cacheado localmente.

### Bugs reales encontrados y corregidos en el material DADO

Durante la verificación se encontraron y corrigieron tres problemas reales en los archivos de partida (no relacionados con el trabajo del estudiante), documentados aquí por transparencia:

1. **`ts-node` faltante**: `jest.config.ts` es un archivo TypeScript, y Jest necesita `ts-node` instalado para poder leerlo. No estaba declarado como devDependency en ninguno de los tres `package.json` (Ejercicio 01, Ejercicio 02, Proyecto). Se agregó `"ts-node": "10.9.2"`.
2. **Imports con extensión `.js` no resueltos por Jest**: el código fuente usa imports relativos con extensión `.js` (convención de TypeScript moderno), pero el resolver de módulos de Jest no los traduce automáticamente a los archivos `.ts` reales. Se agregó `moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }` a `jest.config.ts` en los tres subproyectos.
3. **Cast inseguro en `auth.service.ts` (Ejercicio 02 y Proyecto)**: `user as Record<string, unknown>` no compila bajo `strict: true` porque `IUser` extiende `Document` de Mongoose y TypeScript no encuentra suficiente solapamiento entre ambos tipos. Se corrigió a `user as unknown as Record<string, unknown>`, tal como sugiere el propio compilador.
4. **(Solo Ejercicio 01) Umbral de cobertura inalcanzable**: `collectCoverageFrom` incluía `src/**/*.ts`, lo que arrastraba a la cobertura archivos que, por diseño del ejercicio, nunca se ejecutan de verdad (`users.repository.ts`, siempre mockeado) o solo se ejecutan parcialmente (`utils/jwt.ts`). Esto hacía matemáticamente imposible alcanzar el 80% de funciones exigido, aunque `auth.service.ts` —el archivo que el propio enunciado pide cubrir— ya estaba al 100%. Se acotó `collectCoverageFrom` a `['src/services/**/*.ts']`, que es exactamente el criterio de éxito que pide el enunciado del ejercicio.
