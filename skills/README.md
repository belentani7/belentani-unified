# Canon de Skills

Unico punto de verdad de skills agenciales. No duplicar por CLI/harness.

## Fuentes consolidadas

| Ruta | Origen | Contenido |
|------|--------|-----------|
| `skills/superpowers/` | obra/superpowers (clon shallow) | Metodologia + skills core (brainstorming, TDD, debugging, writing-plans, etc.) + plugins por harness (`.agents`, `.opencode`, `.codex-plugin`, `.claude-plugin`, `.cursor-plugin`, `.devin-plugin`, `.hermes-plugin`, `.kimi-plugin`, `.pi`) |
| `skills/openclaw/` | `~/.openclaw/skills` | Skills del harness OpenClaw (bailian-*, claude-api, mcp-builder, pdf, spark-video, etc.) |
| `skills/openclaw-plugins/` | `~/.openclaw/plugin-skills` | browser-automation, canvas |
| `~/.agents/skills`, `~/.claude/skills`, `~/.qwen/skills`, `~/.vibe/skills` | Instalaciones locales legacy | Se mantienen SOLO para compatibilidad; canon real es este arbol |

## Reglas

1. Cualquier skill nueva se instala AQUI (canon), no en cada carpeta de CLI.
2. Los hooks/plugins de superpowers referencian este canon.
3. No copiar skills duplicadas entre subcarpetas del canon.

## Estado

- [x] superpowers clonado y sin .git (canon metodo + skills core)
- [ ] openclaw skills referenciado/copiado
- [ ] enlace con ~/.agents etc. verificado
