/* INSTITUTO UNIVERSAL — Motor académico. Vanilla JS, sin dependencias. */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* ================= DATOS ACADÉMICOS ================= */
  const COURSES = [
    {
      id: "lingua",
      icon: "🜄",
      color: "#2dd4bf",
      title: { es: "Facultad de Lengua", pt: "Faculdade de Língua", en: "Faculty of Language" },
      desc: { es: "Unión de lingua-aberta y linguaforge. Español y portugués como puentes, no como muros.", pt: "União de lingua-aberta e linguaforge. Espanhol e português como pontes, não como muros.", en: "Union of lingua-aberta and linguaforge. Spanish and Portuguese as bridges, not walls." },
      modules: [
        {
          title: { es: "Fonética y Pronunciación", pt: "Fonética e Pronúncia", en: "Phonetics & Pronunciation" },
          lessons: [
            {
              t: { es: "Vocales abiertas y cerradas", pt: "Vogais abertas e fechadas", en: "Open and closed vowels" }, min: 4,
              body: { es: "El español tiene 5 vocales puras: a, e, i, o, u. El portugués añade matices: é (abierta) y ê (cerrada), ó y ô.\n\n**Regla de oro:** en portugués, la diferencia entre 'avó' (abuela) y 'avô' (abuelo) es SOLO la apertura de la vocal.\n\n- a: siempre abierta, como en 'casa'.\n- e: abierta en 'café', cerrada en 'você'.\n- o: abierta en 'pó' (polvo), cerrada en 'pôr' (poner).\n\n**Ejercicio:** di en voz alta 'avó, avô, avó'. Si suenan igual, vuelve a empezar.", pt: "O espanhol tem 5 vogais puras: a, e, i, o, u. O português acrescenta matizes: é (aberta) e ê (fechada), ó e ô.\n\n**Regra de ouro:** a diferença entre 'avó' e 'avô' é APENAS a abertura da vogal.\n\n- a: sempre aberta, como em 'casa'.\n- e: aberta em 'café', fechada em 'você'.\n- o: aberta em 'pó', fechada em 'pôr'.\n\n**Exercício:** diz em voz alta 'avó, avô, avó'. Se soarem iguais, recomeça.", en: "Spanish has 5 pure vowels: a, e, i, o, u. Portuguese adds nuances: é (open) and ê (closed), ó and ô.\n\n**Golden rule:** in Portuguese, the difference between 'avó' (grandmother) and 'avô' (grandfather) is ONLY vowel openness.\n\n- a: always open, as in 'casa'.\n- e: open in 'café', closed in 'você'.\n- o: open in 'pó' (dust), closed in 'pôr' (to put).\n\n**Drill:** say aloud 'avó, avô, avó'. If they sound identical, start over." },
              q: [
                { q: { es: "¿Cuántas vocales puras tiene el español?", pt: "Quantas vogais puras tem o espanhol?", en: "How many pure vowels does Spanish have?" }, o: ["3", "5", "7", "12"], c: 1, e: { es: "Cinco: a, e, i, o, u. El portugués añade apertura.", pt: "Cinco: a, e, i, o, u. O português acrescenta abertura.", en: "Five: a, e, i, o, u. Portuguese adds openness." } },
                { q: { es: "'Avó' y 'avô' se distinguen por…", pt: "'Avó' e 'avô' distinguem-se por…", en: "'Avó' and 'avô' differ by…" }, o: ["Acento gráfico", "Apertura de la vocal", "La consonante final", "El género"], c: 1, e: { es: "La apertura de la o cambia el significado.", pt: "A abertura do o muda o significado.", en: "The openness of the o changes the meaning." } },
                { q: { es: "La vocal 'a' en portugués es…", pt: "A vogal 'a' em português é…", en: "The vowel 'a' in Portuguese is…" }, o: ["Siempre abierta", "Siempre cerrada", "Variable según contexto", "Nasal por defecto"], c: 0, e: { es: "Siempre abierta, como en 'casa'.", pt: "Sempre aberta, como em 'casa'.", en: "Always open, as in 'casa'." } }
              ]
            },
            {
              t: { es: "Nasales: el sonido que no existe en español", pt: "Nasais: o som que não existe no espanhol", en: "Nasals: the sound Spanish lacks" }, min: 5,
              body: { es: "El portugués tiene vocales nasales: ã, õ, y diptongos como ão, õe.\n\n**Cómo producirlas:** deja pasar aire por la nariz mientras pronuncias la vocal. Prueba: 'mão' (mano), 'pão' (pan), 'coração' (corazón).\n\n**Trampa clásica:** 'pão' (pan) vs 'pau' (palo). La tilde marca la nasalidad.\n\n**Español:** no tiene nasales vocálicas; la n/m se pronuncian como consonantes.", pt: "O português tem vogais nasais: ã, õ, e ditongos como ão, õe.\n\n**Como produzi-las:** deixa passar ar pelo nariz enquanto pronuncias a vogal. Tenta: 'mão', 'pão', 'coração'.\n\n**Armadilha clássica:** 'pão' (pão) vs 'pau' (pau). O til marca a nasalidade.\n\n**Espanhol:** não tem nasais vocálicas; n/m pronunciam-se como consoantes.", en: "Portuguese has nasal vowels: ã, õ, and diphthongs like ão, õe.\n\n**How to produce them:** let air pass through your nose while saying the vowel. Try: 'mão' (hand), 'pão' (bread), 'coração' (heart).\n\n**Classic trap:** 'pão' (bread) vs 'pau' (stick). The tilde marks nasality.\n\n**Spanish:** has no nasal vowels; n/m are pronounced as consonants." },
              q: [
                { q: { es: "'Pão' significa…", pt: "'Pão' significa…", en: "'Pão' means…" }, o: ["Palo", "Pan", "Pavo", "Mano"], c: 1, e: { es: "Pão = pan. Pau = palo.", pt: "Pão = pão. Pau = pau.", en: "Pão = bread. Pau = stick." } },
                { q: { es: "¿Cómo se produce una vocal nasal?", pt: "Como se produz uma vogal nasal?", en: "How do you produce a nasal vowel?" }, o: ["Cerrando la garganta", "Dejando pasar aire por la nariz", "Alargando la vocal", "Añadiendo una consonante"], c: 1, e: { es: "Aire por la nariz mientras vibra la vocal.", pt: "Ar pelo nariz enquanto a vogal vibra.", en: "Air through the nose while the vowel vibrates." } },
                { q: { es: "¿Qué marca la nasalidad en portugués?", pt: "O que marca a nasalidade em português?", en: "What marks nasality in Portuguese?" }, o: ["El acento agudo", "La tilde (~)", "La diéresis", "Nada"], c: 1, e: { es: "La tilde (~): ã, õ.", pt: "O til (~): ã, õ.", en: "The tilde (~): ã, õ." } }
              ]
            },
            {
              t: { es: "Falsos amigos ES↔PT", pt: "Falsos amigos ES↔PT", en: "False friends ES↔PT" }, min: 4,
              body: { es: "Palabras parecidas, significados distintos. Las más peligrosas:\n\n| Palabra | ES | PT |\n|---|---|---|\n| apellido | apelido | sobrenome |\n| escritorio | escritório (oficina) | escrivaninha (mesa) |\n| embarazada | embarazada (avergonzada) | grávida |\n| exquisito | exquisito (extraño) | delicioso |\n| vaso | vaso | copo |\n\n**Consejo:** nunca asumas. Verifica cada vez que hables en público.", pt: "Palavras parecidas, significados diferentes. As mais perigosas:\n\n| Palavra | ES | PT |\n|---|---|---|\n| apellido | apelido | sobrenome |\n| escritorio | escritório (oficina) | escrivaninha (mesa) |\n| embarazada | embarazada (envergonhada) | grávida |\n| exquisito | exquisito (estranho) | delicioso |\n| vaso | vaso | copo |\n\n**Conselho:** nunca assumas. Verifica sempre que falares em público.", en: "Similar words, different meanings. The most dangerous:\n\n| Word | ES | PT |\n|---|---|---|\n| apellido | apelido | sobrenome |\n| escritorio | escritório (office) | escrivaninha (desk) |\n| embarazada | embarazada (embarrassed) | grávida |\n| exquisito | exquisito (weird) | delicioso |\n| vaso | vaso | copo |\n\n**Advice:** never assume. Verify every time you speak in public." },
              q: [
                { q: { es: "'Embarazada' en español es…", pt: "'Embarazada' em espanhol é…", en: "'Embarazada' in Spanish is…" }, o: ["Avergonzada", "Grávida", "Feliz", "Cansada"], c: 1, e: { es: "Embarazada = grávida. En portugués, 'embaraçada' = avergonzada.", pt: "Embarazada = grávida. Em português, 'embaraçada' = envergonhada.", en: "Embarazada = pregnant. In Portuguese, 'embaraçada' = embarrassed." } },
                { q: { es: "'Escritorio' en español equivale en portugués a…", pt: "'Escritorio' em espanhol equivale em português a…", en: "Spanish 'escritorio' equals Portuguese…" }, o: ["Escritório", "Escrivaninha", "Estante", "Sótão"], c: 1, e: { es: "Escritorio = escrivaninha (mesa). Escritório = oficina.", pt: "Escritorio = escrivaninha (mesa). Escritório = escritório.", en: "Escritorio = escrivaninha (desk). Escritório = office." } },
                { q: { es: "¿Cuál es la regla frente a falsos amigos?", pt: "Qual é a regra perante falsos amigos?", en: "What is the rule with false friends?" }, o: ["Confiar en la intuición", "Verificar siempre", "Evitar hablar", "Usar solo cognados"], c: 1, e: { es: "Nunca asumir: verificar cada palabra dudosa.", pt: "Nunca assumir: verificar cada palavra duvidosa.", en: "Never assume: verify every doubtful word." } }
              ]
            }
          ]
        },
        {
          title: { es: "Gramática Esencial", pt: "Gramática Essencial", en: "Essential Grammar" },
          lessons: [
            {
              t: { es: "Ser vs Estar: la frontera exacta", pt: "Ser vs Estar: a fronteira exata", en: "Ser vs Estar: the exact boundary" }, min: 5,
              body: { es: "**SER** = esencia, identidad, origen, profesión, hora.\n- Soy Pedro. Es de Brasil. Son las tres.\n\n**ESTAR** = estado, lugar, condición temporal.\n- Estoy cansado. Está en casa. Estamos de paso.\n\n**Prueba rápida:** si puedes añadir 'siempre' → SER. Si añades 'ahora' → ESTAR.\n- Soy feliz (siempre) vs Estoy feliz (ahora).\n\n**Portugués:** 'ser' y 'estar' funcionan igual, pero añade 'ficar' (quedarse/volverse).", pt: "**SER** = essência, identidade, origem, profissão, hora.\n- Sou Pedro. É do Brasil. São três horas.\n\n**ESTAR** = estado, lugar, condição temporária.\n- Estou cansado. Está em casa. Estamos de passagem.\n\n**Teste rápido:** se podes acrescentar 'sempre' → SER. Se acrescentas 'agora' → ESTAR.\n- Sou feliz (sempre) vs Estou feliz (agora).\n\n**Português:** 'ser' e 'estar' funcionam igual, mas acrescenta 'ficar'.", en: "**SER** = essence, identity, origin, profession, time.\n- Soy Pedro (I am Pedro). Es de Brasil. Son las tres.\n\n**ESTAR** = state, place, temporary condition.\n- Estoy cansado (I'm tired). Está en casa. Estamos de paso.\n\n**Quick test:** if you can add 'always' → SER. If you add 'now' → ESTAR.\n- Soy feliz (always) vs Estoy feliz (now).\n\n**Portuguese:** works the same, but adds 'ficar' (to become/stay)." },
              q: [
                { q: { es: "'Soy feliz' (siempre) usa SER porque expresa…", pt: "'Sou feliz' (sempre) usa SER porque expressa…", en: "'Soy feliz' (always) uses SER because it expresses…" }, o: ["Estado temporal", "Esencia", "Lugar", "Opinión"], c: 1, e: { es: "Esencia/identidad permanente.", pt: "Essência/identidade permanente.", en: "Permanent essence/identity." } },
                { q: { es: "'Está en casa' usa ESTAR por…", pt: "'Está em casa' usa ESTAR por…", en: "'Está en casa' uses ESTAR for…" }, o: ["Profesión", "Lugar", "Origen", "Hora"], c: 1, e: { es: "Lugar y condición temporal → ESTAR.", pt: "Lugar e condição temporária → ESTAR.", en: "Place and temporary condition → ESTAR." } },
                { q: { es: "¿Qué verbo añade el portugués al par ser/estar?", pt: "Que verbo acrescenta o português ao par ser/estar?", en: "Which verb does Portuguese add to ser/estar?" }, o: ["Ficar", "Ter", "Haver", "Pôr"], c: 0, e: { es: "'Ficar': quedarse, volverse, ubicarse.", pt: "'Ficar': ficar, tornar-se, localizar-se.", en: "'Ficar': to stay, to become, to be located." } }
              ]
            },
            {
              t: { es: "Preposiciones con movimiento", pt: "Preposições com movimento", en: "Prepositions of movement" }, min: 4,
              body: { es: "El error más común de los hispanohablantes en portugués:\n\n- ES 'voy a' → PT 'vou a' (mismo), pero…\n- ES 'en' (lugar) → PT 'em' + artículo: em + o = **no**, em + a = **na**.\n  - Estou **no** Brasil. Estou **na** escola.\n- ES 'para' → PT 'para' (finalidad) o 'pra' (oral).\n\n**Ejemplos:**\n- Vou a Lisboa / Vou para Lisboa (destino final).\n- Estou no carro, na rua, no trabalho.", pt: "O erro mais comum dos hispanofalantes em português:\n\n- ES 'voy a' → PT 'vou a' (igual), mas…\n- ES 'en' (lugar) → PT 'em' + artigo: em + o = **no**, em + a = **na**.\n  - Estou **no** Brasil. Estou **na** escola.\n- ES 'para' → PT 'para' (finalidade) ou 'pra' (oral).\n\n**Exemplos:**\n- Vou a Lisboa / Vou para Lisboa (destino final).\n- Estou no carro, na rua, no trabalho.", en: "The most common mistake Spanish speakers make in Portuguese:\n\n- ES 'voy a' → PT 'vou a' (same), but…\n- ES 'en' (place) → PT 'em' + article: em + o = **no**, em + a = **na**.\n  - Estou **no** Brasil. Estou **na** escola.\n- ES 'para' → PT 'para' (purpose) or 'pra' (spoken).\n\n**Examples:**\n- Vou a Lisboa / Vou para Lisboa (final destination).\n- Estou no carro, na rua, no trabalho." },
              q: [
                { q: { es: "em + a = …", pt: "em + a = …", en: "em + a = …" }, o: ["Na", "No", "Em", "Nela"], c: 0, e: { es: "em + a = na. em + o = no.", pt: "em + a = na. em + o = no.", en: "em + a = na. em + o = no." } },
                { q: { es: "'Estoy en Brasil' en portugués…", pt: "'Estoy en Brasil' em português…", en: "'Estoy en Brasil' in Portuguese…" }, o: ["Estou em Brasil", "Estou no Brasil", "Estou na Brasil", "Estou Brasil"], c: 1, e: { es: "Estou NO Brasil (Brasil es masculino).", pt: "Estou NO Brasil (Brasil é masculino).", en: "Estou NO Brasil (Brasil is masculine)." } },
                { q: { es: "'Para' en portugués oral puede ser…", pt: "'Para' em português oral pode ser…", en: "Spoken Portuguese 'para' can be…" }, o: ["Pra", "Por", "Em", "De"], c: 0, e: { es: "'Pra' es la forma oral de 'para'.", pt: "'Pra' é a forma oral de 'para'.", en: "'Pra' is the spoken form of 'para'." } }
              ]
            },
            {
              t: { es: "Tiempos verbales que no coinciden", pt: "Tempos verbais que não coincidem", en: "Verb tenses that don't match" }, min: 5,
              body: { es: "Peligro real: el mismo nombre, distinto uso.\n\n- **Pretérito perfecto compuesto**:\n  - ES 'he comido' = acción puntual pasada.\n  - PT 'tenho comido' = acción repetida hasta hoy. Para la puntual se usa 'comi' (pretérito perfeito simples).\n\n- **Futuro de subjuntivo** (solo PT): 'quando eu **fizer**' — el español usa presente de subjuntivo: 'cuando yo **haga**'.\n\n- **Infinitivo personal** (solo PT): 'para eu **fazer**'.\n\n**Regla práctica:** si traduces del español, revisa SIEMPRE 'he + participio' → en PT suele ser pretérito simple.", pt: "Perigo real: o mesmo nome, uso diferente.\n\n- **Pretérito perfeito composto**:\n  - ES 'he comido' = ação pontual passada.\n  - PT 'tenho comido' = ação repetida até hoje. Para a pontual usa-se 'comi' (pretérito perfeito simples).\n\n- **Futuro do subjuntivo** (só PT): 'quando eu **fizer**' — o espanhol usa presente do subjuntivo: 'cuando yo **haga**'.\n\n- **Infinitivo pessoal** (só PT): 'para eu **fazer**'.\n\n**Regra prática:** ao traduzir do espanhol, revê SEMPRE 'he + participio' → em PT costuma ser pretérito simples.", en: "Real danger: same name, different use.\n\n- **Pretérito perfecto compuesto**:\n  - ES 'he comido' = one-off past action.\n  - PT 'tenho comido' = repeated action up to today. For one-off, use 'comi' (simple past).\n\n- **Future subjunctive** (PT only): 'quando eu **fizer**' — Spanish uses present subjunctive: 'cuando yo **haga**'.\n\n- **Personal infinitive** (PT only): 'para eu **fazer**'.\n\n**Practical rule:** when translating from Spanish, always re-check 'he + participle' → in PT it's usually simple past." },
              q: [
                { q: { es: "'Tenho comido' en portugués significa…", pt: "'Tenho comido' em português significa…", en: "Portuguese 'tenho comido' means…" }, o: ["Comí una vez", "He comido repetidamente hasta hoy", "Comeré mañana", "Estoy comiendo ahora"], c: 1, e: { es: "Acción repetida hasta el presente.", pt: "Ação repetida até ao presente.", en: "Repeated action up to the present." } },
                { q: { es: "'Cuando yo haga' en portugués natural es…", pt: "'Cuando yo haga' em português natural é…", en: "'Cuando yo haga' in natural Portuguese is…" }, o: ["Quando eu faço", "Quando eu fizer", "Quando eu fazia", "Quando eu farei"], c: 1, e: { es: "Futuro de subjuntivo: 'quando eu fizer'.", pt: "Futuro do subjuntivo: 'quando eu fizer'.", en: "Future subjunctive: 'quando eu fizer'." } },
                { q: { es: "El infinitivo personal existe…", pt: "O infinitivo pessoal existe…", en: "The personal infinitive exists…" }, o: ["En español", "En portugués", "En ambos", "En ninguno"], c: 1, e: { es: "Solo en portugués: 'para eu fazer'.", pt: "Só em português: 'para eu fazer'.", en: "Only in Portuguese: 'para eu fazer'." } }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "cyber",
      icon: "🛡",
      color: "#d90429",
      title: { es: "Facultad de Ciberseguridad", pt: "Faculdade de Cibersegurança", en: "Faculty of Cybersecurity" },
      desc: { es: "Heredera de secure-t. Defiende, detecta, responde. Lo que ningún curso te cuenta.", pt: "Herdeira de secure-t. Defende, deteta, responde. O que nenhum curso te conta.", en: "Heir of secure-t. Defend, detect, respond. What no other course tells you." },
      modules: [
        {
          title: { es: "Fundamentos de Defensa", pt: "Fundamentos de Defesa", en: "Defense Fundamentals" },
          lessons: [
            {
              t: { es: "El modelo CIA: la tríada sagrada", pt: "O modelo CIA: a tríade sagrada", en: "The CIA model: the sacred triad" }, min: 4,
              body: { es: "Toda la seguridad se resume en tres propiedades:\n\n- **C**onfidencialidad: solo quien debe, lee. (cifrado, permisos)\n- **I**ntegridad: nada cambia sin autorización. (hashes, firmas)\n- **A**vailability: el servicio responde cuando se necesita. (redundancia, anti-DDoS)\n\n**Ejemplo:** tu cuenta bancaria.\n- Confidencialidad: nadie ve tu saldo.\n- Integridad: nadie altera una transferencia.\n- Disponibilidad: puedes pagar un sábado a las 3am.\n\n**Reflejo profesional:** ante cualquier decisión de seguridad, pregúntate: ¿qué tríada protejo y qué sacrifico?", pt: "Toda a segurança resume-se em três propriedades:\n\n- **C**onfidencialidade: só quem deve, lê. (cifragem, permissões)\n- **I**ntegridade: nada muda sem autorização. (hashes, assinaturas)\n- **D**isponibilidade: o serviço responde quando é preciso. (redundância, anti-DDoS)\n\n**Exemplo:** a tua conta bancária.\n- Confidencialidade: ninguém vê o teu saldo.\n- Integridade: ninguém altera uma transferência.\n- Disponibilidade: podes pagar num sábado às 3h.\n\n**Reflexo profissional:** perante qualquer decisão, pergunta: que tríade protejo e o que sacrifico?", en: "All security boils down to three properties:\n\n- **C**onfidentiality: only those authorized can read. (encryption, permissions)\n- **I**ntegrity: nothing changes without authorization. (hashes, signatures)\n- **A**vailability: the service responds when needed. (redundancy, anti-DDoS)\n\n**Example:** your bank account.\n- Confidentiality: nobody sees your balance.\n- Integrity: nobody alters a transfer.\n- Availability: you can pay on Saturday at 3am.\n\n**Professional reflex:** before any security decision, ask: which triad do I protect and what do I sacrifice?" },
              q: [
                { q: { es: "Un hash SHA-256 protege principalmente…", pt: "Um hash SHA-256 protege principalmente…", en: "A SHA-256 hash mainly protects…" }, o: ["Confidencialidad", "Integridad", "Disponibilidad", "Velocidad"], c: 1, e: { es: "El hash detecta cambios no autorizados = integridad.", pt: "O hash deteta alterações não autorizadas = integridade.", en: "The hash detects unauthorized changes = integrity." } },
                { q: { es: "Un ataque DDoS atenta contra…", pt: "Um ataque DDoS atenta contra…", en: "A DDoS attack targets…" }, o: ["Disponibilidad", "Integridad", "Confidencialidad", "Todas por igual"], c: 0, e: { es: "DDoS = Denegación de servicio = disponibilidad.", pt: "DDoS = Negação de serviço = disponibilidade.", en: "DDoS = Denial of Service = availability." } },
                { q: { es: "Cifrar un disco protege…", pt: "Cifrar um disco protege…", en: "Encrypting a disk protects…" }, o: ["Disponibilidad", "Confidencialidad", "Integridad", "Rendimiento"], c: 1, e: { es: "El cifrado oculta el contenido = confidencialidad.", pt: "A cifragem oculta o conteúdo = confidencialidade.", en: "Encryption hides content = confidentiality." } }
              ]
            },
            {
              t: { es: "Contraseñas sin mitos", pt: "Palavras-passe sem mitos", en: "Passwords without myths" }, min: 5,
              body: { es: "Los mitos que cuestan vidas digitales:\n\n**Mito 1:** 'Cambiar cada 30 días es más seguro.' → Falso. La rotación forzada genera contraseñas débiles. Cambia solo ante sospecha.\n\n**Mito 2:** 'Caracteres raros = segura.' → Falso. La LONGITUD importa más. 4 palabras aleatorias > 10 caracteres raros.\n\n**Verdad:**\n- Usa un gestor de contraseñas (Bitwarden, 1Password).\n- 2FA en TODO: correo, GitHub, banca.\n- Frase de contraseña: 'luna-silla-faro-93-queso' es mejor que 'P@ssw0rd!'.\n\n**Hábito:** una contraseña única por servicio. Siempre.", pt: "Os mitos que custam vidas digitais:\n\n**Mito 1:** 'Mudar a cada 30 dias é mais seguro.' → Falso. A rotação forçada gera palavras-passe fracas. Muda apenas perante suspeita.\n\n**Mito 2:** 'Caracteres raros = segura.' → Falso. O COMPRIMENTO importa mais. 4 palavras aleatórias > 10 caracteres raros.\n\n**Verdade:**\n- Usa um gestor (Bitwarden, 1Password).\n- 2FA em TUDO: e-mail, GitHub, banco.\n- Frase-passe: 'lua-cadeira-farol-93-queijo' é melhor que 'P@ssw0rd!'.\n\n**Hábito:** uma palavra-passe única por serviço. Sempre.", en: "Myths that cost digital lives:\n\n**Myth 1:** 'Changing every 30 days is safer.' → False. Forced rotation breeds weak passwords. Change only on suspicion.\n\n**Myth 2:** 'Rare characters = secure.' → False. LENGTH matters more. 4 random words > 10 rare characters.\n\n**Truth:**\n- Use a password manager (Bitwarden, 1Password).\n- 2FA on EVERYTHING: email, GitHub, banking.\n- Passphrase: 'moon-chair-lighthouse-93-cheese' beats 'P@ssw0rd!'.\n\n**Habit:** one unique password per service. Always." },
              q: [
                { q: { es: "¿Qué importa más en una contraseña?", pt: "O que importa mais numa palavra-passe?", en: "What matters most in a password?" }, o: ["Caracteres raros", "Longitud", "Mayúsculas", "Números"], c: 1, e: { es: "La longitud (entropía) domina.", pt: "O comprimento (entropia) domina.", en: "Length (entropy) dominates." } },
                { q: { es: "La rotación forzada cada 30 días…", pt: "A rotação forçada a cada 30 dias…", en: "Forced 30-day rotation…" }, o: ["Mejora la seguridad", "Genera contraseñas débiles", "Es obligatoria por ley", "Solo aplica a bancos"], c: 1, e: { es: "NIST lo desaconseja: produce 'Password1!, Password2!'…", pt: "O NIST desaconselha: produz 'Password1!, Password2!'…", en: "NIST advises against it: it produces 'Password1!, Password2!'…" } },
                { q: { es: "La defensa #1 contra robo de cuenta es…", pt: "A defesa #1 contra roubo de conta é…", en: "The #1 defense against account theft is…" }, o: ["Antivirus", "2FA", "VPN", "Firewall"], c: 1, e: { es: "2FA bloquea el 99% de los ataques con contraseña robada.", pt: "2FA bloqueia 99% dos ataques com palavra-passe roubada.", en: "2FA blocks 99% of attacks with stolen passwords." } }
              ]
            },
            {
              t: { es: "Phishing: el arte de no morder", pt: "Phishing: a arte de não morder", en: "Phishing: the art of not biting" }, min: 5,
              body: { es: "El 90% de las brechas empiezan con un clic.\n\n**Señales de phishing:**\n1. Urgencia falsa: '¡Tu cuenta será borrada en 24h!'\n2. Remitente casi idéntico: 'bank0.com' en vez de 'banko.com'.\n3. Enlaces sospechosos: pasa el ratón y LEE la URL real.\n4. Adjuntos inesperados: 'factura.pdf.exe'.\n\n**Protocolo de 10 segundos:**\n- ¿Esperabas este mensaje? ¿Conoces al remitente?\n- ¿Hay urgencia artificial? ¿Pide credenciales?\n- Si dudas: abre el sitio oficial ESCRIBIENDO la URL tú mismo.\n\n**Reflejo:** nunca compartas códigos 2FA por teléfono ni chat. Nadie legítimo los pide.", pt: "90% das brechas começam com um clique.\n\n**Sinais de phishing:**\n1. Urgência falsa: 'A tua conta será apagada em 24h!'\n2. Remetente quase idêntico: 'bank0.com' em vez de 'banko.com'.\n3. Links suspeitos: passa o rato e LÊ o URL real.\n4. Anexos inesperados: 'fatura.pdf.exe'.\n\n**Protocolo de 10 segundos:**\n- Esperavas esta mensagem? Conheces o remetente?\n- Há urgência artificial? Pede credenciais?\n- Em dúvida: abre o site oficial ESCREVENDO o URL tu mesmo.\n\n**Reflexo:** nunca partilhes códigos 2FA por telefone ou chat. Ninguém legítimo os pede.", en: "90% of breaches start with a click.\n\n**Phishing signs:**\n1. Fake urgency: 'Your account will be deleted in 24h!'\n2. Nearly identical sender: 'bank0.com' instead of 'banko.com'.\n3. Suspicious links: hover and READ the real URL.\n4. Unexpected attachments: 'invoice.pdf.exe'.\n\n**10-second protocol:**\n- Were you expecting this message? Do you know the sender?\n- Artificial urgency? Asking for credentials?\n- In doubt: open the official site by TYPING the URL yourself.\n\n**Reflex:** never share 2FA codes by phone or chat. No legitimate service asks for them." },
              q: [
                { q: { es: "Señal clásica de phishing…", pt: "Sinal clássico de phishing…", en: "Classic phishing sign…" }, o: ["Urgencia artificial", "Firma del banco", "URL correcta", "Mensaje sin enlaces"], c: 0, e: { es: "La urgencia artificial presiona para clicar sin pensar.", pt: "A urgência artificial pressiona para clicar sem pensar.", en: "Artificial urgency pressures you to click without thinking." } },
                { q: { es: "Ante un correo sospechoso, lo correcto es…", pt: "Perante um e-mail suspeito, o correto é…", en: "With a suspicious email, you should…" }, o: ["Clicar para comprobar", "Abrir el adjunto", "Escribir la URL oficial a mano", "Responder pidiendo verificación"], c: 2, e: { es: "Nunca uses el enlace del correo: escribe la URL tú.", pt: "Nunca uses o link do e-mail: escreve o URL tu.", en: "Never use the email's link: type the URL yourself." } },
                { q: { es: "¿Quién puede pedirte legítimamente tu código 2FA?", pt: "Quem pode pedir-te legitimamente o código 2FA?", en: "Who can legitimately ask for your 2FA code?" }, o: ["Tu banco por teléfono", "El soporte técnico", "Nadie", "Tu jefe"], c: 2, e: { es: "Nadie. El 2FA es personal e intransferible.", pt: "Ninguém. O 2FA é pessoal e intransmissível.", en: "Nobody. 2FA is personal and non-transferable." } }
              ]
            }
          ]
        },
        {
          title: { es: "Detección y Respuesta", pt: "Deteção e Resposta", en: "Detection & Response" },
          lessons: [
            {
              t: { es: "Logs: leer la escena del crimen", pt: "Logs: ler a cena do crime", en: "Logs: reading the crime scene" }, min: 5,
              body: { es: "Sin logs no hay forense. Con logs mal leídos, tampoco.\n\n**Los 3 logs que todo sistema debe tener:**\n1. **Acceso:** quién entró, desde dónde, cuándo.\n2. **Cambio:** quién modificó qué y desde qué IP.\n3. **Error:** qué falló y en qué orden.\n\n**Preguntas forenses:**\n- ¿El ataque fue externo o interno? (IP, zona horaria, patrón)\n- ¿Qué tocó después de entrar? (secuencia de eventos)\n- ¿Qué se llevó? (datos accedidos, descargas)\n\n**Herramienta mental:** reconstruye la línea de tiempo antes de actuar. Actuar primero borra evidencia.", pt: "Sem logs não há perícia. Com logs mal lidos, também não.\n\n**Os 3 logs que todo o sistema deve ter:**\n1. **Acesso:** quem entrou, de onde, quando.\n2. **Mudança:** quem alterou o quê e de que IP.\n3. **Erro:** o que falhou e em que ordem.\n\n**Perguntas forenses:**\n- O ataque foi externo ou interno? (IP, fuso horário, padrão)\n- O que tocou depois de entrar? (sequência de eventos)\n- O que levou? (dados acedidos, downloads)\n\n**Ferramenta mental:** reconstrói a linha do tempo antes de agir. Agir primeiro apaga evidência.", en: "No logs, no forensics. Badly read logs, still no forensics.\n\n**The 3 logs every system must have:**\n1. **Access:** who entered, from where, when.\n2. **Change:** who modified what and from which IP.\n3. **Error:** what failed and in what order.\n\n**Forensic questions:**\n- Was the attack external or internal? (IP, timezone, pattern)\n- What did they touch after entering? (event sequence)\n- What did they take? (accessed data, downloads)\n\n**Mental tool:** rebuild the timeline before acting. Acting first erases evidence." },
              q: [
                { q: { es: "Antes de responder a un incidente, primero…", pt: "Antes de responder a um incidente, primeiro…", en: "Before responding to an incident, first…" }, o: ["Borrar los logs", "Cambiar contraseñas", "Reconstruir la línea de tiempo", "Apagar el servidor"], c: 2, e: { es: "Preservar evidencia: reconstruir antes de tocar nada.", pt: "Preservar evidência: reconstruir antes de tocar em nada.", en: "Preserve evidence: rebuild before touching anything." } },
                { q: { es: "Un log de acceso NO responde…", pt: "Um log de acesso NÃO responde…", en: "An access log does NOT answer…" }, o: ["Quién entró", "Desde dónde", "Qué intención tenía", "Cuándo"], c: 2, e: { es: "La intención se infiere, no se loguea.", pt: "A intenção infere-se, não se regista.", en: "Intent is inferred, not logged." } },
                { q: { es: "¿Cuántos tipos de logs mínimos necesita un sistema?", pt: "Quantos tipos de logs mínimos precisa um sistema?", en: "How many minimum log types does a system need?" }, o: ["1", "2", "3", "10"], c: 2, e: { es: "Tres: acceso, cambio, error.", pt: "Três: acesso, mudança, erro.", en: "Three: access, change, error." } }
              ]
            },
            {
              t: { es: "Respuesta: contención, erradicación, recuperación", pt: "Resposta: contenção, erradicação, recuperação", en: "Response: containment, eradication, recovery" }, min: 5,
              body: { es: "El ciclo que separa a un profesional de un aficionado:\n\n1. **Contención** (minutos): cortar el acceso sin destruir evidencia. Aislar red, congelar cuentas, snapshot del sistema.\n2. **Erradicación** (horas): eliminar la causa raíz — no el síntoma. Backdoor, credencial robada, vulnerabilidad.\n3. **Recuperación** (días): restaurar servicio desde copias limpias, verificar integridad.\n4. **Lecciones** (post-mortem): qué falló, qué cambia, quién lo valida.\n\n**Error mortal:** recuperar primero y preguntar después. Si no erradicas la causa, el atacante vuelve a entrar por la misma puerta.", pt: "O ciclo que separa um profissional de um amador:\n\n1. **Contenção** (minutos): cortar o acesso sem destruir evidência. Isolar rede, congelar contas, snapshot do sistema.\n2. **Erradicação** (horas): eliminar a causa raiz — não o sintoma. Backdoor, credencial roubada, vulnerabilidade.\n3. **Recuperação** (dias): restaurar serviço de cópias limpas, verificar integridade.\n4. **Lições** (post-mortem): o que falhou, o que muda, quem valida.\n\n**Erro mortal:** recuperar primeiro e perguntar depois. Sem erradicar a causa, o atacante volta pela mesma porta.", en: "The cycle that separates professionals from amateurs:\n\n1. **Containment** (minutes): cut access without destroying evidence. Isolate network, freeze accounts, snapshot the system.\n2. **Eradication** (hours): remove the root cause — not the symptom. Backdoor, stolen credential, vulnerability.\n3. **Recovery** (days): restore service from clean backups, verify integrity.\n4. **Lessons** (post-mortem): what failed, what changes, who validates.\n\n**Fatal mistake:** recover first, ask later. If you don't eradicate the cause, the attacker re-enters through the same door." },
              q: [
                { q: { es: "El primer paso de respuesta es…", pt: "O primeiro passo de resposta é…", en: "The first response step is…" }, o: ["Recuperación", "Contención", "Post-mortem", "Comunicado público"], c: 1, e: { es: "Contener: cortar acceso preservando evidencia.", pt: "Conter: cortar acesso preservando evidência.", en: "Contain: cut access while preserving evidence." } },
                { q: { es: "Erradicación significa eliminar…", pt: "Erradicação significa eliminar…", en: "Eradication means removing…" }, o: ["El síntoma", "La causa raíz", "Los logs", "Al usuario"], c: 1, e: { es: "Causa raíz: backdoor, credencial, vulnerabilidad.", pt: "Causa raiz: backdoor, credencial, vulnerabilidade.", en: "Root cause: backdoor, credential, vulnerability." } },
                { q: { es: "¿Cuándo se hace el post-mortem?", pt: "Quando se faz o post-mortem?", en: "When is the post-mortem done?" }, o: ["Nunca", "Antes de contener", "Después de recuperar", "Solo si hay demanda"], c: 2, e: { es: "Después: aprender para no repetir.", pt: "Depois: aprender para não repetir.", en: "After: learn so it doesn't repeat." } }
              ]
            },
            {
              t: { es: "Backups que sí funcionan: 3-2-1", pt: "Backups que funcionam: 3-2-1", en: "Backups that work: 3-2-1" }, min: 4,
              body: { es: "Regla 3-2-1:\n\n- **3** copias de tus datos.\n- **2** medios diferentes (disco + nube).\n- **1** copia fuera de casa (off-site).\n\n**Y lo que nadie dice:** un backup no verificado NO es un backup.\n- Restaura de prueba cada 3 meses.\n- Un backup cifrado sin guardar la clave = dato perdido con candado.\n- Ransomware cifra backups conectados: la copia off-site es la única salvación.\n\n**Checklist:** ¿cuándo fue la última restauración real? Si no lo sabes, tu backup es una promesa.", pt: "Regra 3-2-1:\n\n- **3** cópias dos teus dados.\n- **2** meios diferentes (disco + nuvem).\n- **1** cópia fora de casa (off-site).\n\n**E o que ninguém diz:** um backup não verificado NÃO é um backup.\n- Restaura de teste a cada 3 meses.\n- Um backup cifrado sem guardar a chave = dado perdido com cadeado.\n- Ransomware cifra backups ligados: a cópia off-site é a única salvação.\n\n**Checklist:** quando foi a última restauração real? Se não sabes, o teu backup é uma promessa.", en: "The 3-2-1 rule:\n\n- **3** copies of your data.\n- **2** different media (disk + cloud).\n- **1** copy off-site.\n\n**And what nobody says:** an unverified backup is NOT a backup.\n- Test-restore every 3 months.\n- An encrypted backup without the key = lost data with a lock.\n- Ransomware encrypts connected backups: the off-site copy is your only salvation.\n\n**Checklist:** when was your last real restore? If you don't know, your backup is a promise." },
              q: [
                { q: { es: "La regla 3-2-1 propone…", pt: "A regra 3-2-1 propõe…", en: "The 3-2-1 rule proposes…" }, o: ["3 copias, 2 medios, 1 off-site", "3 discos, 2 servidores, 1 usuario", "3 días, 2 semanas, 1 mes", "3 copias, 2 usuarios, 1 nube"], c: 0, e: { es: "3 copias / 2 medios / 1 fuera de casa.", pt: "3 cópias / 2 meios / 1 fora de casa.", en: "3 copies / 2 media / 1 off-site." } },
                { q: { es: "Un backup sin verificar es…", pt: "Um backup sem verificar é…", en: "An unverified backup is…" }, o: ["Perfectamente válido", "Una promesa", "Obligatorio por ley", "Más seguro"], c: 1, e: { es: "Hasta que no restauras, no sabes si sirve.", pt: "Até restaurares, não sabes se serve.", en: "Until you restore, you don't know if it works." } },
                { q: { es: "Ante ransomware, la copia salvadora es…", pt: "Perante ransomware, a cópia salvadora é…", en: "Against ransomware, the saving copy is…" }, o: ["La del mismo disco", "La de la red local", "La off-site desconectada", "La más reciente"], c: 2, e: { es: "Ransomware cifra todo lo conectado.", pt: "Ransomware cifra tudo o que está ligado.", en: "Ransomware encrypts everything connected." } }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ia",
      icon: "◉",
      color: "#d4af37",
      title: { es: "Facultad de IA Aplicada", pt: "Faculdade de IA Aplicada", en: "Faculty of Applied AI" },
      desc: { es: "Heredera de manos-abiertas. De cero a agente productivo. Sin humo, con práctica.", pt: "Herdeira de manos-abiertas. De zero a agente produtivo. Sem fumo, com prática.", en: "Heir of manos-abiertas. From zero to productive agent. No hype, practice only." },
      modules: [
        {
          title: { es: "Pensar con IA", pt: "Pensar com IA", en: "Thinking with AI" },
          lessons: [
            {
              t: { es: "Qué es un modelo de lenguaje", pt: "O que é um modelo de linguagem", en: "What a language model is" }, min: 4,
              body: { es: "Un LLM es un predictor de la siguiente palabra, entrenado con miles de millones de textos.\n\n**Qué implica:**\n- No piensa: calcula probabilidades. Sorprendentemente bien, pero calcula.\n- No sabe: recita patrones. Por eso 'alucina' con confianza.\n- No recuerda entre sesiones: su memoria es el contexto que le das.\n\n**Consecuencia práctica:**\n- Dale contexto → calidad sube.\n- Pídele evidencia → error baja.\n- Trata su salida como borrador, no como verdad.\n\n**Frase para tu vida:** 'El modelo propone, yo verifico.'", pt: "Um LLM é um preditor da palavra seguinte, treinado com milhares de milhões de textos.\n\n**O que implica:**\n- Não pensa: calcula probabilidades. Surpreendentemente bem, mas calcula.\n- Não sabe: recita padrões. Por isso 'alucina' com confiança.\n- Não lembra entre sessões: a sua memória é o contexto que lhe dás.\n\n**Consequência prática:**\n- Dá-lhe contexto → a qualidade sobe.\n- Pede-lhe evidência → o erro desce.\n- Trata a saída como rascunho, não como verdade.\n\n**Frase para a tua vida:** 'O modelo propõe, eu verifico.'", en: "An LLM predicts the next word, trained on billions of texts.\n\n**What that implies:**\n- It doesn't think: it computes probabilities. Surprisingly well, but it computes.\n- It doesn't know: it recites patterns. That's why it 'hallucinates' with confidence.\n- It doesn't remember between sessions: its memory is the context you give it.\n\n**Practical consequence:**\n- Give it context → quality rises.\n- Ask for evidence → error drops.\n- Treat its output as draft, not truth.\n\n**Phrase for life:** 'The model proposes, I verify.'" },
              q: [
                { q: { es: "Un LLM fundamentalmente…", pt: "Um LLM fundamentalmente…", en: "An LLM fundamentally…" }, o: ["Piensa como humano", "Predice la siguiente palabra", "Busca en internet", "Tiene memoria propia"], c: 1, e: { es: "Predicción estadística de texto.", pt: "Predição estatística de texto.", en: "Statistical text prediction." } },
                { q: { es: "La 'alucinación' ocurre porque el modelo…", pt: "A 'alucinação' ocorre porque o modelo…", en: "'Hallucination' happens because the model…" }, o: ["Miente a propósito", "Recita patrones sin verificar", "Está roto", "No tiene datos"], c: 1, e: { es: "Genera lo más probable, no lo más cierto.", pt: "Gera o mais provável, não o mais certo.", en: "Generates the most likely, not the most true." } },
                { q: { es: "La mejor actitud ante la salida del modelo…", pt: "A melhor atitude perante a saída do modelo…", en: "The best attitude toward model output…" }, o: ["Aceptarla como verdad", "Verificarla siempre", "Ignorarla", "Creerla si suena bien"], c: 1, e: { es: "'El modelo propone, yo verifico.'", pt: "'O modelo propõe, eu verifico.'", en: "'The model proposes, I verify.'" } }
              ]
            },
            {
              t: { es: "El arte del prompt", pt: "A arte do prompt", en: "The art of the prompt" }, min: 5,
              body: { es: "Un buen prompt tiene 4 partes:\n\n1. **ROL:** 'Actúa como auditor de seguridad senior.'\n2. **CONTEXTO:** 'Estoy auditando un SaaS con 470 repositorios…'\n3. **TAREA:** 'Encuentra patrones de secretos expuestos.'\n4. **FORMATO:** 'Responde en tabla con severidad.'\n\n**Anti-patrones:**\n- 'Hazlo bien' (vacío, sin criterio)\n- Preguntas dobles (el modelo promedia)\n- Sin ejemplos cuando la tarea es ambigua\n\n**Técnica de oro:** few-shot. Dale 1-3 ejemplos de lo que quieres. La precisión se dispara.\n\n**Frase:** 'Un prompt mediocre recibe una respuesta mediocre.'", pt: "Um bom prompt tem 4 partes:\n\n1. **PAPEL:** 'Atua como auditor de segurança sénior.'\n2. **CONTEXTO:** 'Estou a auditar um SaaS com 470 repositórios…'\n3. **TAREFA:** 'Encontra padrões de segredos expostos.'\n4. **FORMATO:** 'Responde em tabela com gravidade.'\n\n**Anti-padrões:**\n- 'Faz bem' (vazio, sem critério)\n- Perguntas duplas (o modelo faz média)\n- Sem exemplos quando a tarefa é ambígua\n\n**Técnica de ouro:** few-shot. Dá-lhe 1-3 exemplos do que queres. A precisão dispara.\n\n**Frase:** 'Um prompt medíocre recebe uma resposta medíocre.'", en: "A good prompt has 4 parts:\n\n1. **ROLE:** 'Act as a senior security auditor.'\n2. **CONTEXT:** 'I'm auditing a SaaS with 470 repositories…'\n3. **TASK:** 'Find patterns of exposed secrets.'\n4. **FORMAT:** 'Answer in a table with severity.'\n\n**Anti-patterns:**\n- 'Do it well' (empty, no criteria)\n- Double questions (the model averages)\n- No examples when the task is ambiguous\n\n**Golden technique:** few-shot. Give 1-3 examples of what you want. Precision skyrockets.\n\n**Phrase:** 'A mediocre prompt gets a mediocre answer.'" },
              q: [
                { q: { es: "Partes de un buen prompt…", pt: "Partes de um bom prompt…", en: "Parts of a good prompt…" }, o: ["Rol, contexto, tarea, formato", "Saludo, tarea, despedida", "Pregunta y esperanza", "Solo la tarea"], c: 0, e: { es: "ROL + CONTEXTO + TAREA + FORMATO.", pt: "PAPEL + CONTEXTO + TAREFA + FORMATO.", en: "ROLE + CONTEXT + TASK + FORMAT." } },
                { q: { es: "Few-shot significa…", pt: "Few-shot significa…", en: "Few-shot means…" }, o: ["Pocos intentos", "Dar ejemplos en el prompt", "Respuesta corta", "Un solo disparo de API"], c: 1, e: { es: "1-3 ejemplos dentro del prompt guían la salida.", pt: "1-3 exemplos dentro do prompt guiam a saída.", en: "1-3 in-prompt examples guide the output." } },
                { q: { es: "Una pregunta doble en un prompt…", pt: "Uma pergunta dupla num prompt…", en: "A double question in a prompt…" }, o: ["Mejora la respuesta", "Hace que el modelo promedie", "Ahorra tokens", "Es obligatoria"], c: 1, e: { es: "Separa: una tarea por prompt.", pt: "Separa: uma tarefa por prompt.", en: "Separate: one task per prompt." } }
              ]
            },
            {
              t: { es: "Agentes: IA que actúa", pt: "Agentes: IA que atua", en: "Agents: AI that acts" }, min: 5,
              body: { es: "Un agente = modelo + herramientas + bucle de decisión.\n\n**Anatomía:**\n- **Modelo** (cerebro): decide qué hacer.\n- **Herramientas** (manos): ejecutar código, leer archivos, llamar APIs.\n- **Bucle** (voluntad): observar → decidir → actuar → observar…\n\n**Dónde fallan los agentes (y cómo se arregla):**\n- Bucle infinito → presupuesto de pasos duro.\n- Herramienta mal usada → descripción exacta de parámetros.\n- Alucinación de acciones → verificación: si el agente afirma X, que lo demuestre con output real.\n\n**Regla Belentani:** el trabajo determinista (retries, routing, aritmética) NUNCA pasa por el modelo. El modelo decide QUÉ; el código decide CÓMO.", pt: "Um agente = modelo + ferramentas + ciclo de decisão.\n\n**Anatomia:**\n- **Modelo** (cérebro): decide o que fazer.\n- **Ferramentas** (mãos): executar código, ler ficheiros, chamar APIs.\n- **Ciclo** (vontade): observar → decidir → agir → observar…\n\n**Onde os agentes falham (e como se corrige):**\n- Ciclo infinito → orçamento de passos duro.\n- Ferramenta mal usada → descrição exata de parâmetros.\n- Alucinação de ações → verificação: se o agente afirma X, que prove com output real.\n\n**Regra Belentani:** o trabalho determinista (retries, routing, aritmética) NUNCA passa pelo modelo. O modelo decide O QUÊ; o código decide COMO.", en: "An agent = model + tools + decision loop.\n\n**Anatomy:**\n- **Model** (brain): decides what to do.\n- **Tools** (hands): run code, read files, call APIs.\n- **Loop** (will): observe → decide → act → observe…\n\n**Where agents fail (and the fix):**\n- Infinite loop → hard step budget.\n- Misused tool → exact parameter descriptions.\n- Hallucinated actions → verification: if the agent claims X, it must prove it with real output.\n\n**Belentani rule:** deterministic work (retries, routing, arithmetic) NEVER goes through the model. The model decides WHAT; code decides HOW." },
              q: [
                { q: { es: "Un agente se compone de…", pt: "Um agente compõe-se de…", en: "An agent is composed of…" }, o: ["Modelo, herramientas, bucle", "Solo un modelo grande", "Base de datos y web", "Prompt y esperanza"], c: 0, e: { es: "Cerebro + manos + voluntad.", pt: "Cérebro + mãos + vontade.", en: "Brain + hands + will." } },
                { q: { es: "Contra bucles infinitos…", pt: "Contra ciclos infinitos…", en: "Against infinite loops…" }, o: ["Más tokens", "Presupuesto de pasos duro", "Modelo mejor", "Ignorarlos"], c: 1, e: { es: "Techo de pasos explícito y fin visible.", pt: "Teto de passos explícito e fim visível.", en: "Explicit step ceiling and visible end." } },
                { q: { es: "La Regla Belentani dice que lo determinista…", pt: "A Regra Belentani diz que o determinista…", en: "The Belentani rule says deterministic work…" }, o: ["Lo hace el modelo", "Lo hace el código", "Se elimina", "Se delega a otro agente"], c: 1, e: { es: "El modelo decide QUÉ, el código decide CÓMO.", pt: "O modelo decide O QUÊ, o código decide COMO.", en: "The model decides WHAT, code decides HOW." } }
              ]
            }
          ]
        },
        {
          title: { es: "Construir con IA", pt: "Construir com IA", en: "Building with AI" },
          lessons: [
            {
              t: { es: "De idea a producto en 90 minutos", pt: "Da ideia ao produto em 90 minutos", en: "From idea to product in 90 minutes" }, min: 5,
              body: { es: "El método que construyó 470 repositorios:\n\n1. **Min 0-15:** define UNA cosa que hace el producto y para quién. Una frase.\n2. **Min 15-45:** genera el esqueleto completo (HTML+CSS+JS o FastAPI). Sin perfección: función.\n3. **Min 45-75:** prueba como usuario. Anota TODO lo que rompe.\n4. **Min 75-90:** arregla solo lo roto. Nada de features nuevas.\n\n**Reglas:**\n- Versión 1 = 1 pantalla, 1 flujo, 1 acción.\n- Si en 90 minutos no funciona, la idea era vaga.\n- El 90% del valor está en el 10% de features.\n\n**Tu turno:** toma una idea de tu inbox (cerebro/inbox/) y cronometra.", pt: "O método que construiu 470 repositórios:\n\n1. **Min 0-15:** define UMA coisa que o produto faz e para quem. Uma frase.\n2. **Min 15-45:** gera o esqueleto completo (HTML+CSS+JS ou FastAPI). Sem perfeição: função.\n3. **Min 45-75:** testa como utilizador. Anota TUDO o que parte.\n4. **Min 75-90:** corrige só o partido. Nada de features novas.\n\n**Regras:**\n- Versão 1 = 1 ecrã, 1 fluxo, 1 ação.\n- Se em 90 minutos não funciona, a ideia era vaga.\n- 90% do valor está em 10% das features.\n\n**A tua vez:** pega numa ideia do teu inbox (cerebro/inbox/) e cronometra.", en: "The method that built 470 repositories:\n\n1. **Min 0-15:** define ONE thing the product does and for whom. One sentence.\n2. **Min 15-45:** generate the complete skeleton (HTML+CSS+JS or FastAPI). No perfection: function.\n3. **Min 45-75:** test as a user. Note EVERYTHING that breaks.\n4. **Min 75-90:** fix only what's broken. No new features.\n\n**Rules:**\n- Version 1 = 1 screen, 1 flow, 1 action.\n- If it doesn't work in 90 minutes, the idea was vague.\n- 90% of the value is in 10% of features.\n\n**Your turn:** take an idea from your inbox (cerebro/inbox/) and time it." },
              q: [
                { q: { es: "El minuto 0-15 se dedica a…", pt: "O minuto 0-15 dedica-se a…", en: "Minutes 0-15 are for…" }, o: ["Escribir código", "Definir una frase de producto", "Elegir framework", "Hacer el logo"], c: 1, e: { es: "Una frase: qué hace y para quién.", pt: "Uma frase: o que faz e para quem.", en: "One sentence: what it does and for whom." } },
                { q: { es: "En la versión 1, si algo no está roto…", pt: "Na versão 1, se algo não está partido…", en: "In version 1, if something isn't broken…" }, o: ["Se mejora igualmente", "No se toca", "Se elimina", "Se duplica"], c: 1, e: { es: "Solo se arregla lo roto. Nada de features nuevas.", pt: "Só se corrige o partido. Nada de features novas.", en: "Fix only what's broken. No new features." } },
                { q: { es: "90 minutos es la prueba de…", pt: "90 minutos é a prova de…", en: "90 minutes is the test of…" }, o: ["Velocidad de tecleo", "Claridad de la idea", "Paciencia", "Suerte"], c: 1, e: { es: "Si no funciona, la idea era vaga.", pt: "Se não funciona, a ideia era vaga.", en: "If it fails, the idea was vague." } }
              ]
            },
            {
              t: { es: "Github Pages: publicar gratis en 5 minutos", pt: "Github Pages: publicar grátis em 5 minutos", en: "GitHub Pages: publish free in 5 minutes" }, min: 4,
              body: { es: "Tu escaparate mundial sin servidor:\n\n1. Crea el repo (o usa carpeta docs/).\n2. Settings → Pages → Source: main/docs.\n3. Pulsa y espera 1 minuto.\n4. URL: https://TU-USUARIO.github.io/TU-REPO/\n\n**O automático:** un workflow en .github/workflows/deploy-pages.yml lo publica en cada push.\n\n**Trucos:**\n- Sin frameworks: HTML+CSS+JS puro = carga instantánea.\n- CNAME propio: dominio tuyo apuntando a Pages.\n- Cada repo = un producto publicado. Gratis, para siempre.\n\n**Acción:** publica la JUDAS EXPERIENCE hoy mismo. Ya tiene el workflow.", pt: "A tua montra mundial sem servidor:\n\n1. Cria o repo (ou usa pasta docs/).\n2. Settings → Pages → Source: main/docs.\n3. Clica e espera 1 minuto.\n4. URL: https://TEU-USER.github.io/TEU-REPO/\n\n**Ou automático:** um workflow em .github/workflows/deploy-pages.yml publica em cada push.\n\n**Truques:**\n- Sem frameworks: HTML+CSS+JS puro = carga instantânea.\n- CNAME próprio: domínio teu a apontar para Pages.\n- Cada repo = um produto publicado. Grátis, para sempre.\n\n**Ação:** publica a JUDAS EXPERIENCE hoje. Já tem o workflow.", en: "Your worldwide showcase without a server:\n\n1. Create the repo (or use docs/ folder).\n2. Settings → Pages → Source: main/docs.\n3. Click and wait 1 minute.\n4. URL: https://YOUR-USER.github.io/YOUR-REPO/\n\n**Or automatic:** a workflow in .github/workflows/deploy-pages.yml publishes on every push.\n\n**Tricks:**\n- No frameworks: pure HTML+CSS+JS = instant load.\n- Custom CNAME: your own domain pointing to Pages.\n- Each repo = one published product. Free, forever.\n\n**Action:** publish JUDAS EXPERIENCE today. It already has the workflow." },
              q: [
                { q: { es: "GitHub Pages sirve desde la carpeta…", pt: "O GitHub Pages serve a partir da pasta…", en: "GitHub Pages serves from the folder…" }, o: ["src/", "docs/", "public/", "dist/"], c: 1, e: { es: "docs/ en rama main (o Actions).", pt: "docs/ na branch main (ou Actions).", en: "docs/ on main (or Actions)." } },
                { q: { es: "El coste de GitHub Pages es…", pt: "O custo do GitHub Pages é…", en: "GitHub Pages costs…" }, o: ["$5/mes", "Gratis", "$20/año", "Depende del tráfico"], c: 1, e: { es: "Gratis para repos públicos.", pt: "Grátis para repos públicos.", en: "Free for public repos." } },
                { q: { es: "Para dominio propio se usa…", pt: "Para domínio próprio usa-se…", en: "For a custom domain you use…" }, o: ["CNAME", "DNS.txt", "MX", "SRV"], c: 0, e: { es: "Archivo CNAME apuntando al dominio.", pt: "Ficheiro CNAME a apontar para o domínio.", en: "CNAME file pointing to the domain." } }
              ]
            },
            {
              t: { es: "Monetizar sin vergüenza", pt: "Monetizar sem vergonha", en: "Monetize without shame" }, min: 5,
              body: { es: "Tu código vale dinero cuando resuelve un problema a alguien que paga.\n\n**Modelos probados (elige uno):**\n1. **Micro-SaaS:** suscripción €9-79/mes por una herramienta concreta.\n2. **Pago único:** €49-499 por producto descargable (PDF, curso, plantilla).\n3. **Freemium:** gratis para uso básico, premium para poder.\n4. **White-label:** tu producto con la marca del cliente, €499+.\n\n**Reglas:**\n- Precio visible desde el día 1. 'Precio a consultar' = cero ventas.\n- Stripe + webhook = cobro automático, cero perseguir facturas.\n- El primer euro vale más que mil seguidores.\n\n**Ejercicio:** ¿cuál de tus repos resuelve un problema que alguien pagaría por resolver?", pt: "O teu código vale dinheiro quando resolve um problema a alguém que paga.\n\n**Modelos comprovados (escolhe um):**\n1. **Micro-SaaS:** subscrição €9-79/mês por uma ferramenta concreta.\n2. **Pagamento único:** €49-499 por produto descarregável (PDF, curso, template).\n3. **Freemium:** grátis para uso básico, premium para poder.\n4. **White-label:** o teu produto com a marca do cliente, €499+.\n\n**Regras:**\n- Preço visível desde o dia 1. 'Preço a consultar' = zero vendas.\n- Stripe + webhook = cobrança automática, zero perseguir faturas.\n- O primeiro euro vale mais que mil seguidores.\n\n**Exercício:** qual dos teus repos resolve um problema que alguém pagaria por resolver?", en: "Your code is worth money when it solves a problem for someone who pays.\n\n**Proven models (pick one):**\n1. **Micro-SaaS:** €9-79/month subscription for a concrete tool.\n2. **One-time:** €49-499 for a downloadable product (PDF, course, template).\n3. **Freemium:** free for basic use, premium for power.\n4. **White-label:** your product with the client's brand, €499+.\n\n**Rules:**\n- Visible pricing from day 1. 'Price on request' = zero sales.\n- Stripe + webhook = automatic billing, zero invoice chasing.\n- The first euro is worth more than a thousand followers.\n\n**Exercise:** which of your repos solves a problem someone would pay to solve?" },
              q: [
                { q: { es: "'Precio a consultar' equivale a…", pt: "'Preço a consultar' equivale a…", en: "'Price on request' equals…" }, o: ["Exclusividad", "Cero ventas", "Más ingresos", "Confianza"], c: 1, e: { es: "Sin precio visible no hay decisión de compra.", pt: "Sem preço visível não há decisão de compra.", en: "No visible price, no purchase decision." } },
                { q: { es: "El cobro automático se logra con…", pt: "A cobrança automática consegue-se com…", en: "Automatic billing is achieved with…" }, o: ["WhatsApp", "Stripe + webhook", "Transferencia manual", "Criptomonedas"], c: 1, e: { es: "Stripe checkout + webhook firmado.", pt: "Stripe checkout + webhook assinado.", en: "Stripe checkout + signed webhook." } },
                { q: { es: "¿Qué vale más al principio?", pt: "O que vale mais no início?", en: "What matters most at the start?" }, o: ["Mil seguidores", "El primer euro", "Un logo bonito", "Un equipo"], c: 1, e: { es: "El primer euro valida el producto real.", pt: "O primeiro euro valida o produto real.", en: "The first euro validates the real product." } }
              ]
            }
          ]
        }
      ]
    }
  ];

  /* ================= ESTADO ================= */
  const LS_KEY = "instituto-universal";
  const state = {
    lang: localStorage.getItem("iu-lang") || "es",
    xp: 0,
    done: {},      /* "courseId|mIdx|lIdx" -> true */
    streak: 0,
    lastDay: null,
    certified: false
  };

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      Object.assign(state, raw);
    } catch (e) { /* primer uso */ }
    const today = new Date().toDateString();
    if (state.lastDay !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.lastDay === yesterday) state.streak += 1; else state.streak = 1;
      state.lastDay = today;
    }
  }
  function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }

  /* ================= I18N ================= */
  const I18N = {
    es: {
      brand: "INSTITUTO UNIVERSAL",
      nav_fac: "Facultades", nav_met: "Método", nav_cert: "Certificado",
      hero_kicker: "UNIVERSIDAD ABIERTA · GRATIS · OFFLINE",
      hero_title: "INSTITUTO<br>UNIVERSAL",
      hero_tagline: "Tres facultades. Cero matrícula. Cero límites. La educación del futuro cabe en un archivo.",
      hero_cta: "EXPLORAR FACULTADES",
      stat_fac: "facultades", stat_mod: "módulos", stat_les: "lecciones", stat_q: "preguntas",
      fac_title: "FACULTADES", fac_sub: "Elige tu camino. Todo tu progreso se guarda en este navegador.",
      back: "Volver a facultades",
      met_title: "EL MÉTODO",
      met1_t: "Microaprendizaje", met1_d: "Lecciones de 5 minutos. El cerebro retiene más en dosis pequeñas y diarias.",
      met2_t: "Evaluación adaptativa", met2_d: "Fallas → repites teoría. Aciertas → sube la dificultad. El examen se adapta a ti.",
      met3_t: "Progreso persistente", met3_d: "XP, rachas y niveles. Tu aprendizaje vive aunque cierres el navegador.",
      met4_t: "Certificado real", met4_d: "Supera un módulo y genera tu certificado firmado por el Instituto.",
      cert_title: "TU CERTIFICADO", cert_sub: "Completa módulos para desbloquearlo. Introduce tu nombre cuando estés listo.",
      cert_btn: "GENERAR", cert_dl: "DESCARGAR PNG",
      foot: "Facultades unificadas: lingua-aberta + linguaforge + secure-t + manos-abiertas. Abierto al mundo.",
      lessons: "lecciones", min: "min", quiz: "PRUEBA DE COMPRENSIÓN",
      quiz_correct: "¡Correcto! +10 XP", quiz_wrong: "Incorrecto. Lee la explicación:",
      next: "SIGUIENTE LECCIÓN", prev: "ANTERIOR", done: "MÓDULO COMPLETO",
      level: "Nivel", racha: "racha", streak: "días", complete: "Completa todas las lecciones del módulo para el certificado.",
      cert_locked: "Completa al menos 6 lecciones para desbloquear el certificado."
    },
    pt: {
      brand: "INSTITUTO UNIVERSAL",
      nav_fac: "Faculdades", nav_met: "Método", nav_cert: "Certificado",
      hero_kicker: "UNIVERSIDADE ABERTA · GRÁTIS · OFFLINE",
      hero_title: "INSTITUTO<br>UNIVERSAL",
      hero_tagline: "Três faculdades. Zero matrícula. Zero limites. A educação do futuro cabe num ficheiro.",
      hero_cta: "EXPLORAR FACULDADES",
      stat_fac: "faculdades", stat_mod: "módulos", stat_les: "lições", stat_q: "perguntas",
      fac_title: "FACULDADES", fac_sub: "Escolhe o teu caminho. Todo o progresso fica neste navegador.",
      back: "Voltar às faculdades",
      met_title: "O MÉTODO",
      met1_t: "Microaprendizagem", met1_d: "Lições de 5 minutos. O cérebro retém mais em doses pequenas e diárias.",
      met2_t: "Avaliação adaptativa", met2_d: "Falhas → repetes teoria. Acertas → sobe a dificuldade. O exame adapta-se a ti.",
      met3_t: "Progresso persistente", met3_d: "XP, sequências e níveis. A tua aprendizagem vive mesmo ao fechares o navegador.",
      met4_t: "Certificado real", met4_d: "Supera um módulo e gera o teu certificado assinado pelo Instituto.",
      cert_title: "O TEU CERTIFICADO", cert_sub: "Completa módulos para o desbloquear. Escreve o teu nome quando estiveres pronto.",
      cert_btn: "GERAR", cert_dl: "DESCARREGAR PNG",
      foot: "Faculdades unificadas: lingua-aberta + linguaforge + secure-t + manos-abiertas. Aberto ao mundo.",
      lessons: "lições", min: "min", quiz: "PROVA DE COMPREENSÃO",
      quiz_correct: "Correto! +10 XP", quiz_wrong: "Incorreto. Lê a explicação:",
      next: "PRÓXIMA LIÇÃO", prev: "ANTERIOR", done: "MÓDULO COMPLETO",
      level: "Nível", racha: "sequência", streak: "dias", complete: "Completa todas as lições do módulo para o certificado.",
      cert_locked: "Completa pelo menos 6 lições para desbloquear o certificado."
    },
    en: {
      brand: "INSTITUTO UNIVERSAL",
      nav_fac: "Faculties", nav_met: "Method", nav_cert: "Certificate",
      hero_kicker: "OPEN UNIVERSITY · FREE · OFFLINE",
      hero_title: "INSTITUTO<br>UNIVERSAL",
      hero_tagline: "Three faculties. Zero tuition. Zero limits. The education of the future fits in one file.",
      hero_cta: "EXPLORE FACULTIES",
      stat_fac: "faculties", stat_mod: "modules", stat_les: "lessons", stat_q: "questions",
      fac_title: "FACULTIES", fac_sub: "Choose your path. All progress is stored in this browser.",
      back: "Back to faculties",
      met_title: "THE METHOD",
      met1_t: "Microlearning", met1_d: "5-minute lessons. The brain retains more in small daily doses.",
      met2_t: "Adaptive assessment", met2_d: "Fail → repeat theory. Pass → difficulty rises. The exam adapts to you.",
      met3_t: "Persistent progress", met3_d: "XP, streaks and levels. Your learning lives on even after closing the browser.",
      met4_t: "Real certificate", met4_d: "Beat a module and generate your certificate signed by the Institute.",
      cert_title: "YOUR CERTIFICATE", cert_sub: "Complete modules to unlock it. Enter your name when ready.",
      cert_btn: "GENERATE", cert_dl: "DOWNLOAD PNG",
      foot: "Unified faculties: lingua-aberta + linguaforge + secure-t + manos-abiertas. Open to the world.",
      lessons: "lessons", min: "min", quiz: "COMPREHENSION TEST",
      quiz_correct: "Correct! +10 XP", quiz_wrong: "Wrong. Read the explanation:",
      next: "NEXT LESSON", prev: "PREVIOUS", done: "MODULE COMPLETE",
      level: "Level", racha: "streak", streak: "days", complete: "Complete every lesson in the module for the certificate.",
      cert_locked: "Complete at least 6 lessons to unlock the certificate."
    }
  };

  function t(k) { return I18N[state.lang][k] || k; }

  let current = { course: null, modIdx: 0, lesIdx: 0, quizDone: false, quizLocked: false };

  /* ================= RENDER ================= */
  function progressOf(course) {
    let total = 0, done = 0;
    course.modules.forEach((m, mi) => m.lessons.forEach((l, li) => {
      total++; if (state.done[course.id + "|" + mi + "|" + li]) done++;
    }));
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  }

  function renderFaculties() {
    const grid = $("#fac-grid");
    grid.innerHTML = COURSES.map((c) => {
      const p = progressOf(c);
      const mods = c.modules.length;
      const les = c.modules.reduce((a, m) => a + m.lessons.length, 0);
      const qs = c.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.q.length, 0), 0);
      return `
      <article class="fac-card reveal in" data-course="${c.id}" style="--fac-c:${c.color}">
        <span class="fac-ico">${c.icon}</span>
        <h3>${c.title[state.lang]}</h3>
        <p>${c.desc[state.lang]}</p>
        <div class="fac-meta">
          <span>${mods} módulos</span><span>${les} ${t("lessons")}</span><span>${qs} ${t("quiz").toLowerCase()}</span>
        </div>
        <div class="fac-progress"><i style="width:${p.pct}%"></i></div>
      </article>`;
    }).join("");
    $$(".fac-card").forEach((card) => {
      card.addEventListener("click", () => openCourse(card.dataset.course));
    });
  }

  function openCourse(id) {
    current.course = COURSES.find((c) => c.id === id);
    current.modIdx = 0; current.lesIdx = 0;
    $("#facultades").hidden = true;
    $("#lecciones").hidden = false;
    renderModuleNav();
    renderLesson();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeCourse() {
    $("#facultades").hidden = false;
    $("#lecciones").hidden = true;
    renderFaculties();
  }

  function renderModuleNav() {
    const nav = $("#lesson-view");
    const modules = current.course.modules;
    nav.innerHTML = `
      <aside class="module-nav">
        <h4>${current.course.title[state.lang]}</h4>
        ${modules.map((m, mi) => `
          <button class="module-item ${mi === current.modIdx ? "active" : ""} ${moduleDone(mi) ? "done" : ""}" data-mod="${mi}">
            ${m.title[state.lang]}
          </button>`).join("")}
      </aside>
      <div class="lesson-card" id="lesson-card"></div>`;
    $$(".module-item").forEach((b) => {
      b.addEventListener("click", () => {
        current.modIdx = parseInt(b.dataset.mod, 10);
        current.lesIdx = 0;
        renderModuleNav(); renderLesson();
      });
    });
  }

  function moduleDone(mi) {
    return current.course.modules[mi].lessons.every((l, li) => state.done[current.course.id + "|" + mi + "|" + li]);
  }

  function renderLesson() {
    const mod = current.course.modules[current.modIdx];
    const les = mod.lessons[current.lesIdx];
    const key = current.course.id + "|" + current.modIdx + "|" + current.lesIdx;
    const total = mod.lessons.length;
    const card = $("#lesson-card");
    const isDone = !!state.done[key];
    const body = les.body[state.lang].replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").split("\n").map((ln) => {
      if (ln.startsWith("- ")) return `<li>${ln.slice(2)}</li>`;
      if (ln.trim() === "") return "";
      return `<p>${ln}</p>`;
    }).join("").replace(/<li>(.+?)<\/li>((<li>.*?<\/li>)*)/g, (m, a, b) => `<ul><li>${a}</li>${b}</ul>`).replace(/(<p><\/p>)/g, "");

    const totalLessons = current.course.modules.reduce((a, m) => a + m.lessons.length, 0);
    const doneLessons = Object.keys(state.done).filter((k) => k.startsWith(current.course.id)).length;

    card.innerHTML = `
      <h3>${les.t[state.lang]}</h3>
      <div class="lesson-meta">${mod.title[state.lang]} · ${current.lesIdx + 1}/${total} · ${les.min} ${t("min")} · ${t("level")}: ${levelName()}</div>
      <div class="lesson-body">${body}</div>
      <div class="quiz-box">
        <h4>${t("quiz")}</h4>
        <p class="quiz-q" id="quiz-q"></p>
        <div id="quiz-opts"></div>
        <div class="quiz-feedback" id="quiz-fb"></div>
      </div>
      <div class="lesson-actions">
        <button id="btn-prev" ${current.lesIdx === 0 ? "disabled" : ""}>${t("prev")}</button>
        <button id="btn-next" class="${isDone ? "primary" : ""}">${isDone ? t("done") : t("next")}</button>
      </div>`;

    const q = les.q[0];
    $("#quiz-q").textContent = q.q[state.lang];
    $("#quiz-opts").innerHTML = q.o.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join("");
    $$(".quiz-opt").forEach((b) => b.addEventListener("click", () => answerQuiz(b, q)));

    $("#btn-prev").addEventListener("click", () => {
      if (current.lesIdx > 0) { current.lesIdx--; renderModuleNav(); renderLesson(); }
    });
    $("#btn-next").addEventListener("click", () => {
      if (current.lesIdx < total - 1) {
        current.lesIdx++; renderModuleNav(); renderLesson();
      } else {
        if (moduleDone(current.modIdx)) {
          addXP(25); save();
          toast("🏆 " + mod.title[state.lang]);
        }
        closeCourse();
      }
    });

    if (isDone) {
      const opts = $$(".quiz-opt");
      opts.forEach((b, i) => {
        b.disabled = true;
        if (i === q.c) b.classList.add("correct");
      });
    }
  }

  function answerQuiz(btn, q) {
    if (state.done[current.course.id + "|" + current.modIdx + "|" + current.lesIdx]) return;
    const i = parseInt(btn.dataset.i, 10);
    const fb = $("#quiz-fb");
    const opts = $$(".quiz-opt");
    opts.forEach((b) => { b.disabled = true; if (parseInt(b.dataset.i, 10) === q.c) b.classList.add("correct"); });
    if (i === q.c) {
      btn.classList.add("correct");
      fb.className = "quiz-feedback show ok";
      fb.textContent = t("quiz_correct");
      state.done[current.course.id + "|" + current.modIdx + "|" + current.lesIdx] = true;
      addXP(10); save();
      renderModuleNav(); renderLesson();
      const el = $("#lesson-card .quiz-box");
      if (el) el.querySelector("#quiz-fb").className = "quiz-feedback show ok";
      if (el) el.querySelector("#quiz-fb").textContent = t("quiz_correct");
    } else {
      btn.classList.add("wrong");
      fb.className = "quiz-feedback show ko";
      fb.textContent = t("quiz_wrong") + " " + q.e[state.lang];
      addXP(2);
      setTimeout(() => {
        opts.forEach((b) => { b.disabled = false; b.classList.remove("wrong", "correct"); });
        fb.className = "quiz-feedback";
      }, 3000);
    }
    save();
  }

  function levelName() {
    if (state.xp < 30) return "Novato";
    if (state.xp < 100) return "Aprendiz";
    if (state.xp < 250) return "Estudiante";
    if (state.xp < 500) return "Erudito";
    return "Maestro";
  }

  function addXP(n) {
    state.xp += n;
    $("#xp-pill").textContent = "🜁 " + state.xp + " XP · " + levelName() + " · " + t("racha") + " " + state.streak + " " + t("streak");
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0b1526;border:1px solid rgba(212,175,55,.5);color:#d4af37;padding:0.9rem 1.6rem;border-radius:8px;z-index:999;font-family:monospace;letter-spacing:.1em;animation:rise .4s";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /* ================= CERTIFICADO ================= */
  function drawCert(name) {
    const cv = $("#cert-canvas");
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    ctx.fillStyle = "#0b1526"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = "rgba(212,175,55,.4)"; ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.font = "700 26px Georgia";
    ctx.fillText("INSTITUTO UNIVERSAL", W / 2, 140);
    ctx.fillStyle = "#e8e4d8";
    ctx.font = "italic 22px Georgia";
    ctx.fillText("Certifica que", W / 2, 210);
    ctx.fillStyle = "#f2dfa0";
    ctx.font = "700 58px Georgia";
    ctx.fillText(name, W / 2, 300);
    ctx.fillStyle = "#9aa3b5";
    ctx.font = "20px Georgia";
    const pct = Math.round(Object.keys(state.done).length / 36 * 100);
    ctx.fillText("ha completado el " + pct + "% del programa académico", W / 2, 380);
    ctx.fillText("con " + state.xp + " XP y una racha de " + state.streak + " días", W / 2, 425);
    ctx.fillStyle = "#d4af37";
    ctx.font = "700 24px Georgia";
    ctx.fillText("Facultades: Lengua · Ciberseguridad · IA Aplicada", W / 2, 500);
    ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 220, 560); ctx.lineTo(W / 2 + 220, 560); ctx.stroke();
    ctx.fillStyle = "#e8e4d8";
    ctx.font = "18px Georgia";
    ctx.fillText(new Date().toLocaleDateString(state.lang, { year: "numeric", month: "long", day: "numeric" }), W / 2, 610);
    ctx.fillStyle = "rgba(212,175,55,.7)";
    ctx.font = "15px Georgia";
    ctx.fillText("belentani.eu · noiacore.com", W / 2, 680);
    cv.hidden = false;
    $("#cert-download").hidden = false;
    $("#cert-download").href = cv.toDataURL("image/png");
  }

  /* ================= BOOT ================= */
  function applyLang() {
    $$("[data-i18n]").forEach((el) => {
      if (el.tagName === "H1" && el.dataset.i18n === "hero_title") {
        el.innerHTML = t("hero_title");
      } else {
        el.textContent = t(el.dataset.i18n);
      }
    });
    $$("[data-lang]").forEach((b) => b.classList.toggle("active", b.dataset.lang === state.lang));
    document.documentElement.lang = state.lang;
    renderFaculties();
  }

  function bind() {
    $$("[data-lang]").forEach((b) => b.addEventListener("click", () => {
      state.lang = b.dataset.lang;
      localStorage.setItem("iu-lang", state.lang);
      applyLang();
    }));
    $("#back-fac").addEventListener("click", closeCourse);
    $("#cert-btn").addEventListener("click", () => {
      const n = $("#cert-name").value.trim();
      const doneCount = Object.keys(state.done).length;
      if (doneCount < 6) { toast(t("cert_locked")); return; }
      drawCert(n || "Estudiante del Instituto");
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  function boot() {
    load();
    bind();
    applyLang();
    addXP(0);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
