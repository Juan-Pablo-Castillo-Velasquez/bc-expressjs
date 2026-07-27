# Semana 01 — Procesador de Datos (Node.js + TypeScript)

**Dominio asignado:** Radio Comunitaria
**Recurso principal:** `Program` (programa radial)

## Descripción

Herramienta de línea de comandos que lee la programación de una radio
comunitaria desde `data/programs.json`, calcula un resumen (total,
activos/inactivos, presupuesto semanal promedio, programa más/menos
costoso, categorías) y genera un reporte en `output/report.json`.
Permite filtrar la programación por categoría (género) usando el
argumento `--category`.

### Adaptación del recurso `Item` → `Program`

| Campo genérico | Campo del dominio | Significado                              |
| --------------- | ------------------ | ----------------------------------------- |
| `name`          | `name`              | Nombre del programa                       |
| `category`      | `category`          | Género: noticias, musical, cultural, deportivo, infantil, religioso |
| `price`         | `weeklyBudget`      | Costo de producción semanal (USD)         |
| `stock`         | `weeklySlots`       | Franjas horarias asignadas por semana     |
| `active`        | `active`            | Si el programa sigue al aire actualmente  |

## Cómo correr el proyecto

```bash
pnpm install
pnpm dev                          # sin filtro — muestra toda la programación
pnpm dev -- --category musical    # filtrado por categoría
pnpm build                        # verificación de TypeScript estricto
```

## Ejemplos de ejecución

**Sin filtro:**
```
--- Resumen de la programación ---
Total de programas: 12
Activos: 9 | Inactivos: 3
Presupuesto semanal promedio: $111.45
Categorías: noticias, musical, cultural, deportivo, infantil, religioso
Programa con mayor presupuesto: Tribuna Vecinal ($200)
Programa con menor presupuesto: Palabra de Fe ($40)
Reporte guardado en: output/report.json
```

**Con filtro `--category musical`:**
```
Total de programas: 4
Activos: 1 | Inactivos: 3
Presupuesto semanal promedio: $97.91
Categorías: musical
Programa con mayor presupuesto: Ritmos del Barrio ($120.5)
Programa con menor presupuesto: La Hora del Rock ($75)
```

**Con categoría inexistente (manejo de errores):**
```
Error: No hay programas en la categoría "deportes-extremos". Categorías disponibles: noticias, musical, cultural, deportivo, infantil, religioso
```
(termina con `process.exit(1)`)
