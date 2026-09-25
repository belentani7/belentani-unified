# BELENTANI UNIFIED — el monorepo del universo

Una sola aplicación, un solo universo. **JUDAS · Belentani galactic experience**:
el portal del artista y la capa que unifica todas las apps del ecosistema.

> «El caos es el material; el sistema es la forma.» — *La traición como arte supremo*

## El portal (app principal)

`src/portal-app/` — React 18 + SASS + Three.js (Vite). Una ventana al cosmos:
hero de nebulosa y estrellas, búsqueda en vivo sobre la biblioteca pública y
documentos que se abren **dentro** de la aplicación.

```bash
cd src/portal-app
npm install
npm run dev      # desarrollo
npm run build    # compila a dist/ (portal + biblioteca servida)
```

### Regenerar la biblioteca pública

```bash
python scripts/build_portal.py --copy --max-mb 45
```

- Indexa `content/html-source/` (los HTMLs únicos del universo, sha256).
- Aplica exclusiones de privacidad (`scripts/exclusions.txt`).
- `--max-mb` deja los archivos gigantes fuera del despliegue (límite de hosting).
- Genera `dist/search-index.json`, `dist/collections.json`, `dist/sitemap.xml` y copia las páginas públicas a `dist/html-source/`.

## Ecosistema (apps del monorepo)

| Ruta | Qué es |
|---|---|
| `apps/judas-experience/` | La experiencia del artista |
| `apps/manos-abiertas/` | Educación y herramientas de inclusión |
| `apps/duck-html/` | HTML y web creativa |
| `apps/instituto-universal/` | Campus educativo |
| `artist/` · `skills/` · `campus/` · `neon-mantra/` | Capas del universo |

## Principios

1. **Aplicación, no biblioteca**: el contenido se abre dentro del portal.
2. **Fuente única de verdad**: índice y catálogo regenerados por script, nunca a mano.
3. **Privacidad primero**: exclusiones antes de publicar; nada personal en el índice público.
4. **Regla de oro de la obra**: la interfaz de la Judas Experience original no se reescribe; el portal la integra.

## Licencia

MIT (código) · © Belentani (obra y contenido) · 432 Hz
