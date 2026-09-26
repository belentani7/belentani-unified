# SESSION CONTEXT — 2026-09-05

## User Profile
- **Name:** Pedro Belentani
- **PC:** UWE-699260244 (192.168.1.134), Windows 11 Pro, HP EliteBook 850 G6, 15.81GB RAM
- **Network:** 57DIGIFIBRA-FDxz, remote agent at 192.168.1.138 (big-pickle/OpenCode)
- **Style:** Maximum output in single passes, no step-by-step, prefers autonomous delegation

## Active Repos
| Repo | Platform | Purpose | Status |
|------|----------|---------|--------|
| belentani7/belentani-unified | GH Private | Monorepo consolidado | ✅ Main branch, 6 commits |
| belentani7/phoneai | GH Private | Coordinación inter-PC | ✅ Sync |
| belentani7/william.game | GH Private | PolyGlot William | ✅ Duck branch, arcade games |
| belentani7/secure-t | GH Private | Documentación + motor | ✅ Main + GH Pages |
| belentani7/ManosAbiertas | Vercel | Plataforma educativa | ✅ SSO + gamificación |
| belentani7/linguaforge | GH Pages | Plataforma lingüística | ✅ Activo |
| belentani7/lingua-aberta | GH Private | Lingua aberta | ✅ Duck branch |
| belentani7/ux-academy | Vercel | UX Academy | ✅ Activo |

## Completed This Session
1. **Router optimization** — opencode.json with tiers (fast=ollama, standard=deepseek), env-key-only config
2. **William arcade games** — whack + fall with temporizador, voz, XP, build OK, pushed 97ef282
3. **EDU cleanup** — 7 copias muertas a _BACKUPS-EDU, rescates, commits
4. **@edu/engine** — Motor educativo compartido (lesson/quiz/memory/tutor), 8/8 tests, integrado en secure-t
5. **ManosAbiertas gamificación** — QuizQuestion, panel XP/racha, felicitaciones ES/PT-BR
6. **Creative Web Algorithm Skill v3.0** — Instalado en ~/.claude/skills/ y ~/.config/opencode/skills/
7. **Three.js demos** — two standalone HTML demos: threejs-essentials.html + creative-web-experience.html
8. **Demo features:** Boot state machine (9 states), liquid glass + neon hologram + cosmic particles + prism scenes, quality tiers (HIGH/MEDIUM/LOW), bloom post-processing, OrbitControls, FPS counter, parameterized motion

## Project Valuations (0-10)
| Project | Score | Notes |
|---------|-------|-------|
| belentani-unified | 9/10 | Consolidación casi completa, estructura sólida |
| william.game | 7/10 | Funcional, arcade games añadidos, necesita polish |
| secure-t | 8/10 | Documentación + motor educativo, GH Pages activo |
| ManosAbiertas | 8/10 | Gamificación activada, SSO funcional |
| linguaforge | 7/10 | GH Pages OK, contenido estable |
| lingua-aberta | 6/10 | En desarrollo, duck branch |
| ux-academy | 8/10 | Vercel funcional |
| phoneai | 6/10 | Coordinación funcional, necesita actualización |
| opencode-config | 9/10 | Optimizado para ahorro de tokens |
| creative-web-skill | 10/10 | Skill v3.0 completo con todos los recursos |

## Skills Installed
- **creative-web-algorithm v3.0** — `/Users/USER/.claude/skills/creative-web-algorithm/`
  - SKILL.md (observar→clasificar→detectar→arquitectura→visual→material→movimiento→rendimiento→carga→verificar→aceptar)
  - references/recipes.md (liquid glass, bloom config, quality tiers, easing functions, memory management, error boundaries, performance budgets)
  - scripts/verify-build.js (automated build verification)
  - assets/template.html (complete working template)

## Pending Tasks
- [ ] Delete empty repos: `belentani7/edu-backup` (if exists)
- [ ] Belentani Web SaaS GUI plan (not started)
- [ ] Bio improvement (not started)
- [ ] Neon red code theme applied to opencode.json
- [ ] Push all local repo cleanups to remotes
- [ ] Rotate 127 exposed secrets in phoneai history
- [ ] Test creative-web-experience.html in browser
- [ ] Secure T interactive layer full integration (@edu/engine in production)
- [ ] ManosAbiertas FlashCard/CourseLayout activation

## Alert Status
- Hermes gateway: STOPPED (user request)
- Another agent: ACTIVE on secure-t (persistencia real: Drizzle+Supabase+Railway)
- Gitleaks hook: ACTIVE (blocks pushes with secrets in history)
- opencode run: Works with OPENCODE_DISABLE_TUI=1

## Key Files
- `~/.config/opencode/opencode.json` — Optimized router config with neon theme
- `docs/PROGRESO-2026-09-05.md` — Progress documentation
- `demos/creative-web-experience.html` — Rich Three.js demo
- `demos/threejs-essentials.html` — Essential Three.js demo
- `packages/edu-engine/` — @edu/engine package
- `~/.claude/skills/creative-web-algorithm/` — Skill installation
