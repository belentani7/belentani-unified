# PLAN MAESTRO DE UNIFICACIÓN — BELENTANI · JUDAS EXPERIENCE

> **Versión 1.0** · 25 de septiembre de 2026 · Documento vivo
> Objetivo: unificar **todos los proyectos web locales** (5.845 HTMLs únicos del ecosistema Belentani + la Judas Experience) y el **perfil de GitHub @belentani7** en **una sola aplicación coherente**, con un sistema de requisitos de aplicación completo (el "qué" y el "cómo" que todo proyecto real necesita, más allá de las reglas de Cursor).
>
> Fuentes usadas: inventario real de tu disco (`Desktop/BELENTANI-UNIFIED-INFO/`, `Desktop/judas-experience-web/`, `Documents/Proyectos/belentani-unify/`), auditoría de GitHub del 20/9/2026 y la documentación oficial de Cursor (`cursor.com/docs/rules`).

---

## PARTE 0 · DIAGNÓSTICO — qué existe hoy

### 0.1 Inventario local (real, medido)

| Activo | Estado | Dónde |
|---|---|---|
| **5.845 HTMLs únicos** (1.412 MB, de 11.304 con 5.160 grupos duplicados) | Deducuplicados e indexados con hash, CSV, JSON y manifiesto | `Documents/Proyectos/belentani-unify/html-source/` |
| **Portal con buscador** (index.html, 5.845 enlaces) | Generado, funcional | `Desktop/BELENTANI-UNIFIED-INFO/index.html` |
| **Landing unificada** (BELENTANI-UNIFIED.html) | Borrador | mismo directorio |
| **La Judas Experience** (web del artista: 44+ obras, lore, audio, vídeo) | Activa, interfaz congelada por regla de oro | `Desktop/judas-experience-web/` |
| **Plan del OS lírico-neón** (`os.html`: escritorio, dock, ventanas, terminal CAOS) | Fase 1 construida, fases 2–4 pendientes | `Desktop/judas-experience-web/empresa/plan-maximo.md` |
| **Scripts de dedupe y portal** (`belentani_dedupe.py`, `build_portal.py`) | Funcionales, no versionados en GitHub | `belentani-unify/` |
| **Catálogo de canciones, protocolo visual engine, guías** | Documentación dispersa | `_PROYECTOS/` |
| **Audio (stems Belentani)** | Local | `Belentani/` |

### 0.2 Inventario GitHub (@belentani7 — auditoría 20/9/2026)

- **120 repos públicos**, overall **66/100**. Calidad 84 ✅, Actividad 100 ✅, pero **Reputación 0/100 🔴** y Seguridad 76 ⚠️.
- Debilidades concretas: repos HTML sin licencia (`DuckHTML`, `aprende-brasil`), **25 repos sin SECURITY.md**, 0 seguidores → el perfil no comunica el ecosistema.
- Repos del ecosistema ya subidos y sueltos (sin coherencia entre sí): `judas-experience-galactic`, `judas-omega-static`, `omega-infinite-os`, `omega-infinite-v4`, `hack-visual`, `belentani-experience-tour`, `Belentani.cv-ai`, `DuckHTML`…
- Ya existe una guía de estándares propia: `_PROYECTOS/PROYECTO_COMPLETO_GUIDE.md` (estructura de carpetas, secretos, CI/CD) — este plan la adopta y la extiende.

### 0.3 Diagnóstico en una frase

**Tienes un archivo (biblioteca) y no una aplicación**: 5.845 páginas sueltas + 120 repos sueltos + 1 web de artista. Lo que falta no es contenido, es **un sistema** que lo compile, lo publique y lo opere. La tesis del `plan-maximo.md` ya lo dice: *"el caos es el material; el sistema es la forma"*.

---

## PARTE 1 · REQUISITOS COMPLETOS DE APLICACIÓN (los que faltaban al documento anterior)

Toda aplicación real —aunque sean páginas HTML estáticas— necesita cubrir **estas 12 áreas**. El documento de reglas de Cursor solo cubría el área 1.

### Área 1 · Contexto para agentes IA (Cursor y demás)

- Carpeta `.cursor/rules/` con reglas `.mdc` (core siempre aplicada, reglas por capa con globs, reglas manuales para migraciones/deploys).
- `AGENTS.md` en raíz + anidados por subdirectorio (p.ej. `portal/AGENTS.md`, `os/AGENTS.md`).
- `PRD.md` (requisitos de producto), `TECH.md` (decisiones técnicas), `PRODUCT.md` — ya lo define tu PROYECTO_COMPLETO_GUIDE.

### Área 2 · Producto y alcance (el QUÉ)

- **Un solo punto de entrada**: la aplicación unificada (portal) es la puerta; la Judas Experience y el OS son capas dentro, no webs paralelas.
- Definir qué es "v1" y qué NO es (alcance cerrado por fase): sin esto, un proyecto de unificación nunca termina.
- Mapa de navegación único: Inicio → Biblioteca (5.845 docs) → Obra (44+) → OS → Currículum → Contacto/Booking.
- Idiomas: PT · ES · EN · CA (tu bio de GitHub ya lo declara; la web debe cumplirlo).

### Área 3 · Arquitectura y estructura

```
belentani-unified/
├── .cursor/rules/            # reglas del ecosistema
├── AGENTS.md
├── src/
│   ├── portal/               # app principal (buscador + navegación)
│   ├── os/                   # os.html — GUI lírico-neón (L2)
│   ├── obra/                 # index.html Judas Experience (L1)
│   └── shared/               # CSS/JS/tipografía/idiotas comunes
├── content/
│   ├── html-source/          # los 5.845 HTMLs únicos (contenido, no código)
│   ├── manifiesto/           # lore canónico (L0)
│   └── catalogo/             # datos de obras (JSON: fuente única de verdad)
├── scripts/                  # dedupe, build_portal, deploy (Python/Node)
├── docs/                     # PRD, TECH, este plan, auditorías
└── .github/workflows/        # CI/CD (ver Área 8)
```

- **Principio clave**: el contenido (HTMLs) se trata como **datos**, no como código de la app. La app es el portal/buscardor/OS que los sirve.
- **Fuente única de verdad**: un `catalogo.json` de obras y un `manifest.json` de HTMLs. Ningún listado se escribe a mano.

### Área 4 · Identidad visual coherente (tu "coherencia de paquete")

- Un solo design system: vidrio + néon rojo/cian, tipografía del sistema, grano y scanlines (ya fijado en la Judas Experience).
- Archivos compartidos obligatorios: `shared/tokens.css` (colores, espaciados, tipografía), `shared/base.css`, `shared/app.js`.
- Prohibido inline-estilos propios por página nueva; toda página nueva consume los tokens.
- Frecuencia 432 Hz / bio-pulse como identidad (barra de estado del OS ya lo hace).

### Área 5 · SEO, metadatos y descubrimiento

- `<title>`, `<meta description>` y Open Graph completos en **todas** las páginas generadas (og:title, og:image, og:description, canonical).
- `sitemap.xml` + `robots.txt` generados por script desde el manifiesto.
- URL canónicas y títulos con patrón único: `«Título» · Belentani`.
- Página 404 propia del portal.

### Área 6 · Rendimiento y recursos

- Presupuesto: carga inicial < 3 s en 4G; el portal pagina o filtra (nunca renderizar 5.845 enlaces de golpe).
- Índice de búsqueda en JSON pre-compilado (search-as-you-type sin backend).
- Imágenes: lazy loading + dimensiones explícitas; audio/vídeo bajo demanda.
- Lighthouse CI como umbral de calidad (Performance/SEO/A11y ≥ 90).

### Área 7 · Accesibilidad y UX

- Contraste AA en el tema néon (verificar rojo/cian sobre vidrio oscuro).
- Navegación por teclado completa (el OS con ventanas arrastrables DEBE tener fallback de foco/teclado).
- `aria-labels` en iconos, skip-links, `prefers-reduced-motion` respetado.
- Multilingüe real: selector PT/ES/EN/CA persistente.

### Área 8 · Infraestructura, CI/CD y despliegue

- **Hosting**: GitHub Pages para el portal estático (dominio propio en fase 3 del plan-maximo); Vercel para cualquier parte dinámica futura (ya tienes la cuenta).
- **CI/CD** (`.github/workflows/ci-cd.yml` según tu guía): lint → build (regenerar índice/sitemap) → Lighthouse → deploy automático a main.
- Scripts npm/documentados: `build`, `index`, `deploy`, `check`.
- Versionado de releases del portal (tags `vX.Y`), changelog.

### Área 9 · Seguridad y secretos

- `.gitignore` estricto (node_modules, .env, *.log, *.db) — ya en tu guía: adoptarlo en TODOS los repos del ecosistema.
- **Nunca commitear secretos**: claves API solo en variables de entorno de GitHub/Vercel.
- SECURITY.md en los repos principales (remedia el hallazgo de la auditoría).
- HTMLs heredados: escanear antes de publicar (links muertos, contenido privado, datos personales — el index ya guarda rutas originales, filtrar lo privado del índice público).
- Datos personales (emails, teléfonos en HTMLs viejos) → lista de exclusión en el build.

### Área 10 · Legal y licencias

- LICENSE (MIT) en `aprende-brasil`, `DuckHTML` y todos los repos públicos sin licencia (remediación de la auditoría).
- Créditos y derecho de autoría en el pie de todo el portal.
- Los audio (stems Belentani): decidir licencia antes de publicarlos.

### Área 11 · Mantenimiento y evolución

- Protocolo de actualización de tu guía: README actualizado tras cada cambio significativo, Conventional Commits.
- Regla de oro mantenida: `index.html` (obra) no cambia de interfaz; el OS enlaza, no reescribe.
- Rutina mensual: re-correr dedupe si entran HTMLs nuevos, re-generar índice, revisar links muertos.
- Cada sesión con agente termina con: tests/build verde + reglas actualizadas si el agente repitió un error.

### Área 12 · Métricas y KPIs (heredados del plan-maximo + nuevos)

| KPI | Hoy | Objetivo |
|---|---|---|
| Puntos de entrada públicos | ~8 webs sueltas | **1 portal** |
| HTMLs accesibles por buscador | 5.845 (solo local) | 5.845 **publicados** |
| Superficies del OS | 3 apps | ≥ 8 |
| Idiomas | PT (+ES parcial) | PT·ES·EN·CA |
| Seguidores GitHub / reputación | 0 · 0/100 | >50 · >40/100 |
| Repos con licencia + SECURITY | parciales | 100% del ecosistema |
| Lighthouse (perf/SEO) | sin medir | ≥ 90 |

---

## PARTE 2 · PLAN DE UNIFICACIÓN POR FASES

### FASE 0 · Gobierno (1 sesión) — decisión y limpieza
1. Crear repo **`belentani-unified`** (monorepo) con la estructura del Área 3.
2. Mover/organizar: copiar `html-source/` (contenido), scripts, y tomar `judas-experience-web` como origen de `obra/` y `os/`.
3. Reglas Cursor (`00-core.mdc`, reglas por capa) + `AGENTS.md` — según la parte 1, Área 1.
4. Filtrar del índice público lo privado (Área 9: lista de exclusión).

### FASE 1 · Núcleo del portal (1–2 sesiones)
5. `catalogo.json` + `manifest.json` como fuentes únicas de verdad (script genera ambos).
6. Portal v1: buscador con índice JSON pre-compilado, navegación del Área 2, paginación.
7. Design system (`shared/tokens.css`) extraído del look actual de la Judas Experience.

### FASE 2 · Integración del ecosistema (2–3 sesiones)
8. Integrar la obra (enlace/embebido, sin tocar su interfaz — regla de oro).
9. Integrar el OS (`os.html`) como capa de experiencia: dock apuntando a LORE, OBRAS, AUDIO, BIBLIOTECA (nueva app = el buscador), PRENSA, BOOKING, CAOS.
10. Clasificación de los 5.845 HTMLs en colecciones temáticas (usando el manifiesto: rutas y nombres originales) → navegación por colecciones además del buscador.
11. Bilingüe/multilingüe de la UI del portal (PT/ES primero, EN/CA después).

### FASE 3 · Publicación y perfil GitHub (1–2 sesiones)
12. GitHub Pages / dominio propio; CI/CD del Área 8; sitemap, robots, OG.
13. **Reorganización del perfil @belentani7**: perfil README (`belentani7/belentani7`) apuntando al portal como pieza central; pin de los 6 repos del ecosistema; LICENSE + SECURITY.md en los principales; archivar repos obsoletos (esos "webs sueltas" que el portal absorbe) para dejar de competir contigo mismo.
14. Lighthouse ≥ 90; checklist completo del Área 7 y 9 en verde.

### FASE 4 · Carrera y escala (según plan-maximo)
15. Press-kit, booking, newsletter, tienda (fases 3–4 del plan-maximo) integradas en el OS.
16. Analítica sin cookies + KPIs del Área 12 en revisión mensual.

---

## PARTE 3 · REGLAS CURSOR DEL ECOSISTEMA (listas para `.cursor/rules/`)

**00-core.mdc** — `alwaysApply: true`
- Español en la conversación, código y comentarios en inglés.
- El contenido vive en `content/`; la app en `src/`. Nunca mezclar.
- `catalogo.json` y `manifest.json` son fuente única de verdad: regenerar por script, nunca editar a mano los listados.
- No tocar la interfaz de `obra/index.html` (regla de oro del plan-maximo).
- Toda página nueva consume `shared/tokens.css`; prohibido CSS inline.

**portal.mdc** — `globs: src/portal/**`
- Buscador con índice JSON pre-compilado; nunca renderizar el listado completo sin paginar/filtrar.
- Metadatos OG completos en cada página.

**os.mdc** — `globs: src/os/**`
- Ventanas arrastrables sin dependencias externas; navegación por teclado obligatoria.
- Barra de estado: 432 Hz · bio-pulse · hora local.

**content.mdc** — `globs: content/**`
- Contenido inmutable tal cual se deduplicó; correcciones por script, no a mano.
- Privacidad: nada de datos personales en el índice público (lista de exclusión del build).

---

## PARTE 4 · DECISIONES QUE NECESITO DE TI (bloqueantes mínimos)

1. **Nombre/dominio** del portal unificado (¿belentani.com? ¿judas.experience? ¿otro?).
2. **Qué es público y qué es privado** de los 5.845 HTMLs (el filtro del Área 9 lo define tu criterio, no un script).
3. **Licencia** del ecosistema (MIT recomendado para repos de código; la obra musical/artística puede ir aparte con ©).
4. Si el portal **sustituye** a las webs sueltas en GitHub (archivarlas) o convive con ellas.

Con esas 4 respuestas, la Fase 0 puede ejecutarse en la siguiente sesión sin más dependencias.
