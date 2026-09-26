# Instrucciones para agentes IA — belentani-unified

Aplican a Cursor, aider, Claude Code, opencode y cualquier agente que trabaje en este repo.

## Identidad

- Proyecto: **Belentani Unified** — portal único del ecosistema Belentani / Judas Experience.
- Conversación y documentación: **español**. Código, identificadores y comentarios: **inglés**.

## Reglas no negociables

1. **Contenido ≠ código.** Los HTMLs de la biblioteca viven en `content/html-source/` y se tratan como datos inmutables (solo se corrigen por script). El código de la app vive en `src/`. Nunca mezclar.
2. **Fuente única de verdad.** `content/catalogo/catalogo.json` y el manifiesto de HTMLs se **regeneran por script** (`scripts/`). Prohibido editar los listados a mano.
3. **Regla de oro (obra congelada).** No modificar la interfaz de `src/obra/index.html` ni su estética. El OS (`src/os/`) enlaza hacia ella; nunca la reescribe.
4. **Design system obligatorio.** Toda página nueva consume `src/shared/tokens.css` (colores néon rojo/cian, vidrio, tipografía del sistema, grano/scanlines). Prohibido CSS inline o `<style>` duplicado en páginas nuevas.
5. **Privacidad primero.** Nada de datos personales (emails, teléfonos) de los HTMLs heredados en el índice público. El build aplica una lista de exclusión (`scripts/exclusions.txt`).
6. **Secretos.** Nunca commitear claves. Solo variables de entorno (`.env*` está en `.gitignore`).

## Convenciones

- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- UI del portal: PT · ES · EN · CA (textos en `src/portal/i18n/`).
- Metadatos: toda página generada lleva `<title>`, `meta description` y Open Graph completos.
- Rendimiento: el portal nunca renderiza el listado completo sin paginar/filtrar; el buscador usa índice JSON pre-compilado.
- Accesibilidad: navegación por teclado obligatoria en el OS (ventanas arrastrables incluidas), `prefers-reduced-motion` respetado, contraste AA.

## Al terminar una tarea

- Build/script verde antes de cerrar.
- Si el agente repitió un error, proponer añadirlo a `.cursor/rules/`.
