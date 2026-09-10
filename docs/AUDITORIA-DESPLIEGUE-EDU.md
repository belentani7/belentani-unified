# Auditoría de despliegue y links — Plataformas EDU (2026-09-05)

## Estado real (verificado en vivo, no teoría)

| Repo | Visibilidad | Stack | GitHub Pages | Hosting activo | Estado link |
|---|---|---|---|---|---|
| secure-t | public | TS/Vite/Express | ✅ 200 (belentani7.github.io/secure-t/) | vercel.json presente | ✅ GH Pages OK; homepage vacía en GitHub |
| ManosAbiertas | public | HTML/Next | ✅ 200 | Vercel: `manosabiertas-seven.vercel.app` → **redirige a login SSO Vercel** ⚠️ | Vercel parece desactivado/SSO; GH Pages funciona |
| linguaforge | public | TS | ✅ 200 | home = GH Pages | ✅ |
| lingua-aberta | **privado** (cerrado por secreto) | TS/Vite | ❌ | Vercel `lingua-aberta.vercel.app` 200 | ✅ privado |
| ux-academy-professional-program | public | TS | ✅ | Vercel 200 | ✅ |
| open-school | public | TS/Next | ❌ 404 | — | ⚠️ sin deploy visible |
| nexus-os | public | JS/HTML | ✅ 200 | — | ✅ |

## Notas
- El usuario **cerró (privados) los proyectos más prometedores por secreto**:
  entre ellos `lingua-aberta`. Puede haber más repos EDU ahora privados.
- `ManosAbiertas` en Vercel pide SSO/login (proyecto asociado a cuenta, no público sin sesión). GH Pages sigue siendo el fallback público que funciona.
- Repos públicos HTML estáticos con GH Pages activo (37+): CARQUIDEC, belentani-design-hub, NOIACORE, duck-*, heyduck, Cruzando-el-charco, etc.

## Fuentes abiertas para NO construir de cero
- https://drivedepobre.com/ → banco abierto 957.706 archivos / 53 TB, 7 acervos
  (ENEM, idiomas, libros, medicina, militares, otros cursos, tecnología/programación,
  banco de cuestiones). Vivo (HTTP 200). Útil para material didáctico y preguntas.

## Acciones sugeridas
- [ ] Poner homepage en GitHub de secure-t y open-school
- [ ] Revisar/restaurar Vercel de ManosAbiertas o dejar GH Pages como oficial
- [ ] Decidir visibilidad de repos EDU cerrados por secreto (¿git submodule en monorepo?)
