# 🚀 Alibaba Cloud - TUDO PRONTO

**Data:** 2026-09-02  
**Status:** ✅ Skills instalados, esperando API key válida

---

## ✅ O QUE ESTÁ CONFIGURADO

### 1. Console Alibaba Cloud
- **Status:** ✅ Autenticado
- **Workspace:** Belentani (ws-6od6zuvzyzvu6zlw)
- **Região:** ap-southeast-1 (Singapore)

### 2. Skills Bailian (14 total)

#### Core (9 skills via `bl skill init`)
1. **bailian-cli** - Gestão de recursos (apps, memória, RAG, usage)
2. **bailian-docs-llm-wiki** - Documentação lookup
3. **bailian-finetune** - Fine-tuning de modelos (SFT/DPO/CPT)
4. **bailian-gen** - Geração de imagem/vídeo/áudio
5. **bailian-managed-agent** - Gestão declarativa de agentes
6. **bailian-model-recommend** - Recomendação de modelos
7. **bailian-protocol** - Protocolo de execução
8. **bailian-train-deploy** - Pipeline train → deploy → call
9. **bailian-web-search** - Pesquisa web

#### Extras (5 skills adicionais)
10. **spark-video** - Produção de vídeo AI completa
11. **happyhorse-prompt-studio** - Prompts otimizados para vídeo
12. **novel-game** - Transformar histórias em jogos interativos
13. **vox-video-director** - Vídeos estilo Vox (paper-collage)
14. **financial-expert** - Dados financeiros China/HK

### 3. Free Tier Confirmado
- **Texto:** 3M tokens/mês (qwen3.7-max, qwen3.8-flash, qwen3.7-flash)
- **Imagem:** 50 gerações/mês (wan2.1-t2i-plus)
- **Vídeo:** 50 gerações/mês (wan2.1-t2v-plus)
- **Áudio:** 10h TTS + 10h STT/mês
- **Embedding:** 1M tokens/mês

### 4. GitHub Actions Pronto
```
C:\Users\USER\belentani-alibaba-integration\
├── github-actions\deploy.yml
└── config\alibaba-connection.md
```

### 5. Agentes Suportados
- universal, claude-code, codex, cursor, gemini-cli
- github-copilot, hermes, mistral-vibe, opencode
- openclaw, qwen-code, antigravity-cli

---

## ❌ O QUE FALTA

### API Key Válida
**Problema:** A key atual está inválida (HTTP 401)

**Solução:**
1. Vai a: https://dashscope-intl.console.aliyun.com/apiKey
2. Clica "Create New Key"
3. Copia a key (formato: `sk-...`)
4. Actualiza:
```powershell
setx DASHSCOPE_API_KEY "sk-NOVA-KEY-AQUI"
```

### Quick BI
**Status:** Não disponível via CLI  
**Acesso:** Apenas via web console (trial 30 dias)  
**URL:** https://quickbi.console.aliyun.com/

### MCP Servers
**Status:** 0 configurados  
**Nota:** Skills como financial-expert precisam de MCP servers específicos

---

## 🎯 COMO USAR (quando tiveres API key)

### Geração de Conteúdo
```bash
# Imagem
bl gen image --prompt "cyberpunk city at night" --model wan2.7-image

# Vídeo
bl gen video --prompt "futuristic car driving" --model wan2.1-t2v-plus

# Áudio (TTS)
bl gen speech --text "Hello world" --model cosyvoice-v2

# Transcrição (STT)
bl gen asr --audio-file audio.mp3 --model qwen-audio-asr
```

### Gestão de Agentes
```bash
# Inicializar config
bl managed-agent init

# Validar
bl managed-agent validate

# Preview mudanças
bl managed-agent plan

# Aplicar
bl managed-agent apply --yes
```

### Fine-tuning
```bash
# Criar job
bl finetune create --model qwen3.8-flash --dataset data.jsonl

# Ver jobs
bl finetune list

# Monitorizar
bl finetune watch --id <job-id>
```

### Web Search
```bash
bl search web --query "Alibaba Cloud pricing"
```

### Uso e Quotas
```bash
# Resumo geral
bl usage summary

# Free tier
bl usage freetier

# Token plan
bl usage token-plan
```

---

## 📊 MAPEAMENTO: REPOS → SERVIÇOS

### Alta Prioridade
| Repo | Serviço | Skill |
|------|---------|-------|
| Belentani | AI Gateway | bailian-managed-agent |
| noiacore-turbo-v2 | Function Compute | bailian-gen |
| nexus-os | Static + AI | bailian-gen |
| heyduck | OSS + Media | bailian-gen (audio) |

### Média Prioridade
| Repo | Serviço | Skill |
|------|---------|-------|
| Cruzando-el-charco | Static hosting | - |
| MetaSkill | Function Compute | bailian-managed-agent |
| belentani_Omega | OSS Archive | bailian-gen |

### Vídeo/Multimédia
| Repo | Serviço | Skill |
|------|---------|-------|
| Conteúdo criativo | Vídeo AI | spark-video, vox-video-director |
| Prompts vídeo | Optimização | happyhorse-prompt-studio |
| Histórias interactivas | Jogos | novel-game |

---

## 💰 CUSTO

### Free Tier (Mensal)
- **3M tokens** texto (3 modelos × 1M)
- **50 imagens** (wan2.1-t2i)
- **50 vídeos** (wan2.1-t2v)
- **10h TTS** + **10h STT**
- **1M tokens** embedding

### Pay-as-you-go (quando free tier acaba)
- Texto: $0.002-0.014 / 1K tokens
- Imagem: $0.02-0.08 / imagem
- Vídeo: $0.05-0.15 / vídeo
- Áudio: $0.01 / minuto

### Estimativa Realista
- **Uso normal:** $0-5/mês
- **Uso intenso:** $10-20/mês
- **Abuso:** $50+/mês (monitorizar!)

---

## 🔧 COMANDOS RÁPIDOS

### Ver status completo
```powershell
bl auth status
bl skill list
bl usage summary
```

### Testar conexão
```powershell
bl text chat --message "test" --max-tokens 10
```

### Listar modelos
```powershell
bl model list --output json
```

### Ver quotas
```powershell
bl usage freetier --output json
```

---

## 📝 PRÓXIMOS PASSOS

1. **Regenerar API key** (5 min)
   - https://dashscope-intl.console.aliyun.com/apiKey
   
2. **Testar skills** (10 min)
   ```powershell
   bl gen image --prompt "test" --model wan2.7-image
   bl gen video --prompt "test" --model wan2.1-t2v
   ```

3. **Configurar GitHub Secrets** (10 min)
   - Adicionar `ALIBABA_API_KEY` nos repos prioritários
   
4. **Activar GitHub Actions** (5 min)
   - Copiar `deploy.yml` para `.github/workflows/` em cada repo

5. **Explorar Quick BI** (opcional)
   - https://quickbi.console.aliyun.com/

6. **Limpar repos** (15 min)
   - Deletar ~40 backups/vazios

---

## 📚 DOCUMENTAÇÃO

- **Skills:** `bl skill list --output json`
- **Modelos:** `bl model list --output json`
- **Uso:** `bl usage summary`
- **Help:** `bl --help`

---

## 🎉 RESUMO

✅ **14 skills** instalados  
✅ **Console** autenticado  
✅ **Free tier** confirmado (3M tokens + 50 imgs + 50 vids)  
✅ **GitHub Actions** pronto  
✅ **Mapeamento** completo  
⏳ **API key** (precisa regenerar)  

**Custo:** $0-5/mês (free tier cobre 95%)

**Quando tiveres a key, está tudo pronto para usar!**
