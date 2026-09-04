# belentani-unified

Monorepo privado de consolidacion. **Solo codigo y organizacion** — sin branding,
portadas, storytelling ni front-end decorativo. Se construye sobre lo que los
repos ya son (avanzados), sin releerlos a fondo.

## Modelo de entidades

| Entidad | Tipo | Tratamiento |
|---------|------|-------------|
| `belentani` | Artista (persona) | Su obra vive en `artist/`. No es una empresa. |
| AION | Empresa | Consolidar en `apps/aion`. |
| Nexus | Empresa | Consolidar en `apps/nexus`. |
| (sin nombre) | Empresa/proyecto | NO inventar nombres. Va a `apps/<nombre-real>` o `archive/`. |
| `duck-*` | Amigo productor | FUERA. No se fusiona ni se toca. |
| clientes | Trabajo por cliente | `clients/<cliente>` — no se fusionan entre si. |

## Estructura

```
apps/aion/       aplicacion empresa AION
apps/nexus/      aplicacion empresa Nexus
artist/          obra del artista belentani (omega, judas, voz, cv, portal)
packages/        librerias compartidas extraidas
services/        backends / APIs
infra/           github-actions, docker, deploy
tools/           scripts de agente, cli, pipelines low-token (python)
skills/          canon unico de skills (superpowers + openclaw)
clients/         trabajos por cliente (no fusionar)
archive/         duplicados y backups (historia intacta, no borrar)
```

## Reglas

1. Una copia viva por grupo duplicado; el resto -> `archive/`.
2. NO tocar remotos canonicos hasta que el arbol local consolidado este verificado.
3. `duck-*` y `clients/` quedan fuera de la consolidacion de empresas.
4. Skills: canon unico en `skills/`, no duplicar por CLI.
5. Contenido generado = scaffolding/codigo via scripts python low-token.

## Estado

- [ ] Esqueleto + repos locales importados
- [ ] Repos remotos vivos importados
- [ ] Canon skills (superpowers + openclaw)
- [ ] Duplicados -> archive/ verificado
- [ ] Builds OK
