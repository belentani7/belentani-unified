# Verificación de duplicados y limpieza — Proyectos educativos (2026-09-05)

**Resultado de la auditoría (superpowers:git-repo-cleanup + subagentes). NADA borrado aún.**

## Veredicto por proyecto

### secure-t
- **Canónica:** `MIGRADOS-USER\secure-t` (B, HEAD d5b7f350). A (01_PROYECTOS, d401f98a) está 100% contenido en B; B es descendiente (2 commits funcionales extra: TTS Kokoro, instructors+enrollment).
- **Pendiente:** commitear los 3 dirty de B (`.gitignore`, `vercel.json`, `api/index.ts` no commiteado) — si no, se pierde el deploy serverless.
- **Acción:** A → backup. B commitea dirty y es la única viva.

### manos-abiertas
- **Canónica:** `01_PROYECTOS\general\ManosAbiertas` (GIT-VIVA, limpia).
- **Rescatar de STATIC1** (`Videos\DRIVE\...\manos-abiertas-static`): `tools/{calculadora,convertidor-moneda,guia-ia,guia-office}.html` + `scripts/smoke_test.py`.
- **Archivar:** resto de STATIC1 (JSON duplicados, PWA shell), PLATFORM1 (guardar solo README-concepto PT), BELENTANI_OS (vacío).

### linguaforge
- **Canónica:** `MIGRADOS-USER\linguaforge` (GIT). `belentani-unified\apps\linguaforge` = espejo exacto (parte del monorepo, válido).
- **Basura:** NOGIT `01_PROYECTOS\linguaforge` (3 md sueltos). **Backup viejo:** VIDEOS (`Videos\DRIVE\...\linguaforge`, línea manus pre-refactor).

### lingua-aberta
- **Canónica:** `Videos\DRIVE\Documents\lingua-aberta` (git, rama `duck` → rebrand "Open Tongue", ElevenLabs v2.5). 
- **Rescatar de NOGIT** (`01_PROYECTOS\lingua-aberta`): `LICENSE` + `NOTICE-ATRIBUCIONES.md` (no trackeados en duck).
- **Limpiar:** dirty basura `client/public/test.txt`, `test2.txt`.
- **Nota:** el repo no trackea LICENSE/NOTICE/README — decidir si versionarlos.

### ux-academy
- **Única copia** (`MIGRADOS-USER\ux-academy-professional-program`). Nada que purgar.

## Acciones de limpieza propuestas (a confirmar)
1. Mover copias muertas a `C:\Users\USER\Documents\MIGRADOS-USER\_BACKUPS-EDU\<proyecto>\` (NO borrar).
2. Rescatar contenido único primero (tools html, smoke_test, LICENSE/NOTICE).
3. Commitear dirty de secure-t B y de lingua-aberta duck.
4. Repos GitHub duplicados de ManosAbiertas (11) — marcar como archivo/privado tras decidir vivo.

> Estado: AUDITORÍA HECHA. Limpieza física PENDIENTE de confirmación.
