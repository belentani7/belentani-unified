# BELENTANI UNIFIED

Portal único del ecosistema **Belentani · Judas Experience**: una aplicación que unifica los 5.845 HTMLs únicos de la biblioteca, la obra del artista y el OS lírico-neón en un solo punto de entrada coherente.

> Plan maestro: [`docs/PLAN-MAESTRO-UNIFICACION.md`](docs/PLAN-MAESTRO-UNIFICACION.md)

## Estructura

```
belentani-unified/
├── .cursor/rules/      # Reglas del ecosistema para agentes IA
├── AGENTS.md           # Instrucciones para agentes (Cursor, aider, etc.)
├── src/
│   ├── portal/         # App principal: buscador + navegación
│   ├── os/             # os.html — GUI lírico-neón (escritorio, dock, terminal CAOS)
│   ├── obra/           # La Judas Experience (interfaz CONGELADA — regla de oro)
│   └── shared/         # Design system: tokens.css, base.css, app.js
├── content/
│   ├── html-source/    # Los 5.845 HTMLs únicos (contenido, tratado como datos)
│   ├── catalogo/       # catalogo.json — fuente única de verdad de las obras
│   └── manifiesto/     # Lore canónico (L0)
├── scripts/            # dedupe, build_portal, index, deploy (Python)
└── docs/               # Plan maestro, auditorías, decisiones
```

## Principios

1. **Contenido ≠ código**: los HTMLs viven en `content/` y se sirven; la app vive en `src/`.
2. **Fuente única de verdad**: `catalogo.json` y `manifest.json` se regeneran por script — nunca se editan a mano.
3. **Regla de oro**: la interfaz de `src/obra/index.html` no se toca; el OS enlaza, no reescribe.
4. **Un design system**: toda página nueva consume `src/shared/tokens.css` — prohibido CSS inline.

## Comandos

```bash
python scripts/build_portal.py    # regenera índice + portal
npm run build                     # build completo (cuando exista package.json)
```

## Idiomas

Conversación y docs: español · Código y comentarios: inglés
UI del portal: PT · ES · EN · CA

## Licencia

MIT (código) — © Belentani (obra artística y contenido)
