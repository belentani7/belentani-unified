# Alibaba Cloud Connection Config

## Workspace Info
- **Workspace ID:** ws-6od6zuvzyzvu6zlw
- **Workspace Name:** Belentani
- **Region:** ap-southeast-1 (Singapore)
- **Console:** https://dashscope-intl.console.aliyun.com/

## API Endpoints
```
Base URL: https://dashscope-intl.aliyuncs.com
Chat: /api/v1/services/aigc/text-generation/generation
Image: /api/v1/services/aigc/image-generation/generation
Video: /api/v1/services/aigc/video-generation/generation
Audio: /api/v1/services/aigc/audio-generation/generation
```

## Modelos Configurados

### Texto (1M tokens/mês grátis cada)
- **qwen3.7-max** - Razoamento complexo, coding
- **qwen3.8-flash** - Tarefas rápidas, chat
- **qwen3.7-flash** - Balanceado
- **deepseek-v4-pro** - Alternativa open-source
- **glm-5.2** - Chinês (se precisar)

### Visão (50 gerações/mês grátis)
- **wan2.1-t2i-plus** - Text-to-image
- **wan2.1-t2v-plus** - Text-to-video
- **wan2.1-i2v-plus** - Image-to-video

### Áudio (10h/mês grátis)
- **cosyvoice-v2** - Text-to-speech (10K chars)
- **qwen-audio-asr** - Speech-to-text (10h)

### Embedding
- **text-embedding-v3** - Vetores para RAG

## Repos → Serviços Alibaba

### Alta Prioridade
| Repo | Serviço Alibaba | Motivo |
|------|----------------|--------|
| Belentani | AI Gateway | Centraliza chamadas AI |
| noiacore-turbo-v2 | Function Compute | BarriServei precisa backend |
| nexus-os | Static + AI | Browser OS usa modelos |
| heyduck | OSS Storage | Mídia pesada (música) |

### Média Prioridade
| Repo | Serviço Alibaba | Motivo |
|------|----------------|--------|
| Cruzando-el-charco | Static hosting | Site informativo |
| MetaSkill | Function Compute | Task router |
| belentani_Omega | OSS Archive | Assets criativos |

### Baixa Prioridade
| Repo | Serviço Alibaba | Motivo |
|------|----------------|--------|
| neon, lofi, swarm, xp | Nenhum (archive) | Projetos pessoais |
| belentaniobjetos | OSS (futuro) | Se crescer |

## Secrets Necessários (GitHub)

Adicionar em cada repo:
```
Settings → Secrets and variables → Actions

ALIBABA_API_KEY = sk-... (regenerar na consola)
ALIBABA_WORKSPACE_ID = ws-6od6zuvzyzvu6zlw
```

## Monitorização

### Comando para ver usage:
```powershell
bl usage summary --output json
```

### Alerta automático (GitHub Action cron):
```yaml
# .github/workflows/monitor-usage.yml
on:
  schedule:
    - cron: '0 9 * * *'  # Diariamente 9am

jobs:
  check-usage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install CLI
        run: npm install -g bailian-cli
      - name: Check usage
        env:
          DASHSCOPE_API_KEY: ${{ secrets.ALIBABA_API_KEY }}
        run: |
          USAGE=$(bl usage summary --output json)
          PERCENT=$(echo $USAGE | jq '.usagePercentage')
          if [ $PERCENT -gt 80 ]; then
            echo "::warning::Usage acima de 80%!"
          fi
```

## Custo Breakdown

### Free Tier (Mensal)
- Texto: 3M tokens (3 modelos × 1M)
- Imagem: 50 gerações
- Vídeo: 50 gerações
- Áudio: 10h TTS + 10h STT
- Embedding: 1M tokens

### Pay-as-you-go (quando free tier acaba)
- Texto: $0.002-0.014 / 1K tokens
- Imagem: $0.02-0.08 / imagem
- Vídeo: $0.05-0.15 / vídeo
- Áudio: $0.01 / minuto

### Estimativa Realista
- **Uso normal:** $0-5/mês (free tier cobre)
- **Uso intenso:** $10-20/mês (alguns vídeos extras)
- **Abuso:** $50+/mês (evitar - monitorizar)

## Deploy Checklist

- [ ] Regenerar API key na consola Alibaba
- [ ] Adicionar `ALIBABA_API_KEY` secret em cada repo prioritário
- [ ] Adicionar `ALIBABA_WORKSPACE_ID` secret em cada repo
- [ ] Criar app "belentani-ai-gateway" no workspace
- [ ] Configurar modelos no app
- [ ] Testar deploy manual: `bl app deploy`
- [ ] Adicionar GitHub Actions workflow em cada repo
- [ ] Configurar monitorização de usage
- [ ] Limpar ~40 repos desnecessários

## Troubleshooting

### Erro 401 (API key inválida)
```
Solução: Regenerar key na consola
```

### Erro "Workspace not found"
```
Solução: bl workspace list --output json
Verificar ID correto
```

### Erro "Model not available"
```
Solução: bl model list --output json
Verificar nome do modelo
```

### Free tier esgotado
```
Solução: 
1. bl usage summary --output json (ver quanto falta)
2. Esperar renovação mensal
3. Ou adicionar cartão para pay-as-you-go
```
