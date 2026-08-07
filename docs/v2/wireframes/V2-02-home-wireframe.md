# V2-02 — Home: Wireframe (Gate 2)

```text
STATUS: PROPOSTA PARA REVISÃO — não aprovado, não implementar
```

**Branch:** `v2`. Nenhum código alterado. Companheiro de
`V2-02-home-direcao-visual.md` — leia-o primeiro para o conceito, os princípios e as
alternativas descartadas; este documento só detalha estrutura, conteúdo e comportamento por
bloco.

Convenção: `PROPOSTA DE COPY — GATE 2` marca todo texto de exemplo. Nenhum dado empresarial
citado aqui é novo — tudo vem de `src/data/` ou dos documentos normativos listados no item 0
do documento de direção visual.

---

## Header (moldura global, não é uma das 9 seções)

- **Estrutura:** logo à esquerda; navegação central/direita (Equipamentos, Projetos,
  Consultoria, Prova, Empresa); CTA "Orçamento" fixo à direita, preenchimento amarelo.
- **Desktop:** sticky, altura comprimida depois de ~80px de rolagem (token de altura próprio
  da V2 — não herda o `clamp()` exato da V1).
- **Mobile:** logo + hambúrguer + CTA de orçamento sempre visível (não escondido atrás do
  menu); menu abre em painel de tela cheia com os mesmos 5 itens + atalho de WhatsApp.
- **Interação:** `focus-visible` em todo item; menu mobile fecha por clique, `Escape` e
  clique fora — padrão herdado, sem exceção.
- **Ligação com a seção seguinte:** nenhuma — é moldura persistente.

---

## 1. Hero — Equipamentos

- **Posição:** primeira dobra, abaixo do header.
- **Função:** comunicar o que a Bianchini vende, capacidade técnica, e abrir caminho — nessa
  ordem — para Projetos/Consultoria.
- **Estrutura/colunas (desktop ≥1024px):** duas colunas, ~44% texto / ~56% imagem.
- **Conteúdo:**
  - eyebrow (Oswald): `PROPOSTA DE COPY — GATE 2` — ex. "Equipamentos para cozinha
    profissional";
  - H1 (Manrope 800): `PROPOSTA DE COPY — GATE 2` — contrato semântico fixado pela spec V2-01:
    nomeia Equipamentos na primeira frase, cita especificação técnica;
  - lead (1 frase): `PROPOSTA DE COPY — GATE 2` — Projeto/Consultoria como sustentação, não
    abertura;
  - métricas: `heroMetrics` (`src/data/site.ts`) — 18 anos · 3.000+ projetos · Brasil (valor
    "3.000+" com pendência de confirmação comercial já registrada no próprio arquivo — usar
    como está, não arredondar nem re-escrever);
  - seletor de categoria compacto: **6** chips (Cocção, Refrigeração, Mobiliário em inox,
    Exaustão, Preparo, Higienização — as seis frentes de `DECISIONS.md` DEC-007, não só as
    que já têm dataset) sem foto, texto + Oswald pequeno, ordenados na mesma ordem da vitrine
    (seção 2); Preparo/Higienização recebem o rótulo normal, sem marca visual de "pendente" —
    a pendência é de conteúdo do painel de destino, não da existência do chip;
- **CTA:**
  - primário: **Solicitar orçamento de equipamentos** — preenchimento amarelo, `scaleX/scaleY`
    no hover, destino conceitual: página de Equipamentos (V2-03); até existir, contato com
    intenção `equipamentos`;
  - secundário: **Conhecer projetos e consultoria** — link/ghost, âncora para a seção 3 desta
    Home.
- **Imagem:** painel reto, `hero-industrial-kitchen.png` (ou `linha-de-coccao.jpg` como
  alternativa — ver direção visual §5, reuso controlado), moldura técnica (hairline + cotas
  curtas nos cantos), legenda de aplicação sobreposta no rodapé do painel.
- **Hierarquia:** H1/painel (1) → CTA primário (2) → métricas (3) → chips de categoria (4) →
  CTA secundário (5).
- **Comportamento desktop:** duas colunas lado a lado, painel de imagem com moldura técnica,
  chips em linha única (com scroll horizontal só se necessário em telas menores dentro da
  faixa desktop).
- **Comportamento mobile (< 768px) — por prioridade de conteúdo, não por obrigação de caber em
  100vh** (correção desta revisão; ver direção visual §7.2). Ordem de prioridade, do que nunca
  cede espaço ao que pode migrar para fora da primeira dobra:

  1. identificação de Equipamentos (eyebrow + H1);
  2. proposta principal (lead, mais curto que no desktop, nunca cortado);
  3. CTA primário ("Solicitar orçamento de equipamentos");
  4. visual/prova de aplicação (fotografia + legenda) — tem leitura própria, não é espremida
     para caber os itens acima;
  5. acesso às categorias (chips) — pode iniciar imediatamente abaixo do hero.

390×844 (viewport mais alto das três larguras móveis de referência — chips normalmente cabem
dentro da própria dobra):

```text
┌───────────────────────────┐
│ HEADER (comprimido)        │
├───────────────────────────┤
│ [ fotografia — painel      │
│   reto, ~35–42% da altura  │
│   do viewport ]             │
│ legenda de aplicação        │
├───────────────────────────┤
│ eyebrow                     │
│ H1 (compacto)                │
│ lead (1 frase curta)        │
│ [Solicitar orçamento de     │
│  equipamentos]  (CTA)       │
│ ▸Cocção ▸Refrig. ▸Inox      │
│  ▸Exaustão ▸Preparo         │
│  ▸Higienização (chips, 6)   │
│ Conhecer projetos e         │
│ consultoria (link)          │
│ 18 anos · 3.000+ · Brasil   │
└───────────────────────────┘
```

360×800 e 320×800 (menos altura disponível — os chips são o primeiro elemento a migrar para
logo abaixo do hero, nunca o H1, o CTA primário ou a fotografia/legenda):

```text
┌───────────────────────────┐
│ HEADER (comprimido)        │
├───────────────────────────┤
│ [ fotografia — painel      │
│   reto ]                    │
│ legenda de aplicação        │
├───────────────────────────┤
│ eyebrow                     │
│ H1 (compacto)                │
│ lead (1 frase curta)        │
│ [Solicitar orçamento de     │
│  equipamentos]  (CTA)       │
│ Conhecer projetos e         │
│ consultoria (link)          │
│ 18 anos · 3.000+ · Brasil   │
└───────────────────────────┘  ← fim do hero
┌───────────────────────────┐
│ ▸Cocção ▸Refrig. ▸Inox      │
│  ▸Exaustão ▸Preparo         │
│  ▸Higienização (chips, 6 —  │
│  abertura visual da seção 2)│
```

  Em ambos os casos as seis categorias continuam representadas nos chips — a diferença entre
  as duas composições é só a posição (dentro do hero ou logo abaixo dele), nunca a quantidade
  ou a legibilidade dos itens.
- **Interação:** chip de categoria rola/navega até o card correspondente na seção 2 (sem
  troca de painel dentro do próprio hero); CTA primário e secundário com os 4 estados padrão.
- **Ligação com a próxima seção:** a legenda de aplicação e os chips já antecipam a vitrine —
  a seção 2 aprofunda a mesma intenção, sem introduzir assunto novo.

---

## 2. Categorias de equipamentos — vitrine

- **Posição:** segunda dobra.
- **Função:** vitrine clicável por categoria, navegação comercial.
- **Estrutura/colunas (desktop ≥1024px):** lista à esquerda (~30%), painel ativo à direita
  (~70%). Seis linhas na lista, sem rolagem interna nas larguras de referência ≥1024px.
- **Conteúdo por categoria — verdade de produto vs. estado de conteúdo** (`DECISIONS.md`
  DEC-007, correção desta revisão — as seis frentes entram na navegação, não só as que já têm
  dataset):

  | # | Categoria | Fonte de conteúdo | O que o painel mostra |
  | --- | --- | --- | --- |
  | 01 | Cocção | `equipmentCategories` (`src/data/equipment-categories.ts`) | foto + benefício + 4 itens + CTA "Ver linha de Cocção" |
  | 02 | Refrigeração | idem | foto + benefício + 4 itens + CTA |
  | 03 | Mobiliário em inox | idem | foto + benefício + 4 itens + CTA |
  | 04 | Exaustão e ventilação | idem | foto + benefício + 4 itens + CTA |
  | 05 | Preparo | **sem dataset** | placeholder editorial: moldura técnica vazia (sem foto) + frase estrutural ("Equipamentos de preparo para cozinha profissional.") + CTA "Ver categoria" |
  | 06 | Higienização | **sem dataset** | placeholder editorial: moldura técnica vazia (sem foto) + frase estrutural ("Equipamentos de higienização para cozinha profissional.") + CTA "Ver categoria" |

  Nenhum equipamento, marca ou descrição factual é inventado para Preparo/Higienização — a
  frase estrutural descreve a função da categoria, não um benefício específico. "Tecnologia de
  cocção" (5ª entrada de `equipmentCategories`, sem par direto nas seis frentes do Master) não
  recebe item próprio nesta vitrine — fica referenciada como aprofundamento dentro do painel
  de Cocção e na página de Equipamentos (V2-03); ver direção visual §8.0.
- **CTA:** por categoria — "Ver linha de [categoria]" quando há dataset, "Ver categoria"
  (rótulo genérico) quando não há; ambos apontam para o mesmo destino conceitual (página de
  Equipamentos, V2-03, seção da categoria). Precedente existente:
  `/linhas-de-produtos/forno-combinado-rational`.
- **Imagem:** uma fotografia real por categoria com dataset (`equipmentCategories[].image`);
  Preparo/Higienização usam a mesma moldura técnica do hero (hairline, sem fotografia) em vez
  de foto — nunca uma foto de outra categoria como substituto.
- **Hierarquia:** categoria ativa (painel completo) > lista de categorias inativas (nome +
  benefício truncado a 1 linha, ou só o nome quando não há benefício, como em Preparo/
  Higienização).
- **Estados essenciais (definição explícita, correção desta revisão):**
  - **Lista completa sempre perceptível:** as seis categorias renderizam sempre, mesma ordem,
    sem paginação, sem "ver mais", sem rolagem interna nas larguras ≥1024px;
  - **Estado ativo:** peso tipográfico + contraste + régua de 2px — três sinais, um
    não-cromático;
  - **Clique/teclado:** clique em qualquer item ativa seu painel; teclado com `↑`/`↓` (ou
    `Tab` entre itens) + `Home`/`End`; `role="tablist"`/`tab`/`tabpanel`; **sem** troca ao
    passar o mouse (lição herdada: `CLAUDE.md`, "hover que não troca o conteúdo");
  - **Categoria ativa por padrão:** Cocção (primeiro item da lista);
  - **Painel contextual:** muda de conteúdo conforme a categoria selecionada, nunca de
    posição/tamanho na tela;
  - **CTA sempre presente:** inclusive para Preparo/Higienização — nunca desabilitado;
  - **Sem JavaScript:** todo o conteúdo das seis categorias está no HTML enviado pelo servidor
    (Server Component); sem JS, a experiência aceitável é a mesma da versão mobile — as seis
    descrições disponíveis em sequência, sem troca de painel interativa;
  - **`prefers-reduced-motion`:** troca de categoria é substituição instantânea de conteúdo
    (sem *crossfade*, sem deslocamento) — não depende de motion para funcionar;
  - **Não é slider:** sem seta de "anterior/próximo", sem numeração de posição (`1 de 6`), sem
    avanço automático — a troca é sempre por seleção direta de um item da lista.
- **Comportamento mobile (< 768px):** sem painel ativo — lista vertical de seis cartões
  simples, todos no mesmo estado (foto ou moldura vazia + nome + benefício/frase estrutural +
  CTA), rolagem vertical, sem carrossel automático.

```text
Desktop (Cocção ativa)                            Desktop (Preparo ativo)
┌───────────────┬─────────────────────┐          ┌───────────────┬─────────────────────┐
│ 01 Cocção ●    │ [fotografia grande]  │          │ 01 Cocção      │ [moldura técnica      │
│ 02 Refrigeração│ benefício completo   │          │ 02 Refrigeração│  vazia — sem foto,    │
│ 03 Mobiliário  │ itens (4)            │          │ 03 Mobiliário  │  sem ícone decorativo]│
│    em inox     │ [Ver linha de        │          │    em inox     │                       │
│ 04 Exaustão    │  Cocção →]           │          │ 04 Exaustão    │ Preparo               │
│ 05 Preparo     │                      │          │ 05 Preparo ●   │ Equipamentos de       │
│ 06 Higienização│                      │          │ 06 Higienização│ preparo para cozinha  │
│                │                      │          │                │ profissional.         │
│                │                      │          │                │ [Ver categoria →]     │
└───────────────┴─────────────────────┘          └───────────────┴─────────────────────┘

Mobile
┌─────────────────────┐
│ [foto] Cocção         │
│  benefício · Ver linha│
├─────────────────────┤
│ [foto] Refrigeração   │
│  ...                  │
├─────────────────────┤
│ [foto] Mobiliário em  │
│  inox · ...           │
├─────────────────────┤
│ [foto] Exaustão       │
│  ...                  │
├─────────────────────┤
│ [moldura vazia]        │
│  Preparo               │
│  [conteúdo/dataset a   │
│   publicar]            │
│  Ver categoria →       │
├─────────────────────┤
│ [moldura vazia]        │
│  Higienização          │
│  [conteúdo/dataset a   │
│   publicar]            │
│  Ver categoria →       │
└─────────────────────┘
```

- **Interação:** `role="tablist"`/`tab`/`tabpanel`, foco visível, touch target ≥44×44px em
  cada linha da lista.
- **Ligação com a próxima seção:** fecha o bloco "Equipamentos primeiro" — a seção 3 é a
  primeira vez que Projetos/Consultoria são nomeados.

---

## 3. "Do projeto à execução" — os três pilares

- **Posição:** terceira dobra.
- **Função:** mostrar integração com peso assimétrico — Equipamentos maior.
- **Fundo:** escuro (`graphite`) — ver justificativa em direção visual §4.
- **Estrutura/colunas (desktop ≥1024px):** grid 2 colunas desiguais — Equipamentos ~55–60%,
  Projetos+Consultoria empilhados nos ~40–45% restantes.
- **Conteúdo:**
  - eyebrow: "Integração"; H2: *"Do projeto à execução."* (assinatura já aprovada,
    `MASTER_BIANCHINI.md` §2.2);
  - cartão Equipamentos: título + fotografia + reforço de 1 frase do que já foi visto nas
    seções 1–2, com link de volta (não um CTA novo de mesmo peso);
  - cartão Projetos: "Quem projeta, especifica.", 2 linhas, link "Fale com um projetista →";
  - cartão Consultoria: "Diagnóstico da operação.", 2 linhas, link "Agendar diagnóstico →".
  - **Correção desta revisão:** nenhum cartão usa retrato de pessoa. A versão anterior deste
    documento reservava "retrato pequeno" em Projetos e Consultoria (inclusive um espaço "a
    nomear" para Consultoria) — isso tornava a composição desta seção dependente de uma
    decisão de conteúdo que não existe hoje (responsável público de Consultoria, ver §5.
    Consultoria e `DECISIONS.md` DEC-004). A identificação de pessoas tem lugar próprio na
    seção 7 (Autoridade); aqui os três cartões comunicam por conteúdo, não por rosto.
- **A diferença de peso entre Equipamentos e os outros dois cartões não é só tamanho físico** —
  é reforçada em quatro dimensões, todas a favor de Equipamentos:
  1. **primeiro ponto de leitura** — cartão Equipamentos é o primeiro bloco da seção;
  2. **CTA de maior prioridade** — o link de Equipamentos aponta para o mesmo CTA primário do
     hero; os de Projetos/Consultoria são links de texto, sem preenchimento de cor;
  3. **evidência visual mais forte** — só o cartão Equipamentos tem fotografia grande nesta
     seção;
  4. **maior área/conteúdo útil** — mais elementos de conteúdo (foto + título + texto + link)
     que os outros dois (título + 2 linhas + link).
- **CTA:** por cartão — os das seções 4/5 já resolvem a conversão; aqui os links são ponte,
  não o CTA final de cada pilar.
- **Imagem:** fotografia de equipamento/aplicação no cartão Equipamentos (reaproveita imagem
  já usada nas seções 1–2); nenhuma imagem nos cartões de Projetos/Consultoria.
- **Prioridade visual:** Equipamentos > Projetos = Consultoria (entre si, iguais).
- **Comportamento desktop:** grid assimétrico fixo, sem interação além dos links.
- **Comportamento mobile:** empilhado, ordem Equipamentos → Projetos → Consultoria (cartão
  Equipamentos mantém a fotografia, só reduz de altura); Projetos e Consultoria com a mesma
  altura/tratamento entre si, **clicáveis de forma independente** um do outro.

```text
┌────────────────────────────────────────────────────────────────┐
│ eyebrow "Integração" · H2 "Do projeto à execução."               │
├───────────────────────────────┬──────────────────────────────┤
│ EQUIPAMENTOS (cartão maior)    │ PROJETOS                       │
│ ← primeiro ponto de leitura    │ "Quem projeta, especifica."    │
│ [fotografia — evidência        │ Fale com um projetista →        │
│  visual mais forte da seção]   ├──────────────────────────────┤
│ reforço de 1 frase + link       │ CONSULTORIA                    │
│  (mesmo CTA de maior            │ "Diagnóstico da operação."     │
│  prioridade do hero)            │ Agendar diagnóstico →           │
└───────────────────────────────┴──────────────────────────────┘
```

- **Ligação com a próxima:** abre caminho para as duas portas independentes (seções 4–5).

---

## 4. Projetos — porta independente

- **Posição:** quarta dobra.
- **Função:** autoridade técnica + entrada própria.
- **Fundo:** claro (`surface`/`canvas`).
- **Estrutura/colunas (desktop ≥1024px):** texto à esquerda (~40%), dois painéis de imagem
  sobrepostos/lado a lado à direita (~60%) — documento + render.
- **Conteúdo:**
  - eyebrow "Projetos"; H2 `PROPOSTA DE COPY — GATE 2` — princípio "quem projeta, especifica";
  - bullets de autoridade técnica (fonte: `scopeLevels` nível 02 `deliverables` — layout
    técnico, plantas de elétrica/hidráulica/gás/esgoto, memorial descritivo, estudo 3D);
- **Evidência:** `planta-executiva.jpg`/`-recorte.jpg` (documento real — rótulo obrigatório
  "Documento de projeto"), `projeto-3d.jpg`/`-recorte.jpg` (render — rótulo obrigatório
  "Estudo 3D — não é obra executada", DEC-008).
- **CTA:** **Fale com um projetista** → destino conceitual: página de Projetos (V2-04); até
  existir, contato com intenção `arquitetura`/`projetos`.
- **Prioridade visual:** média-alta — menor que Equipamentos, igual a Consultoria.
- **Comportamento desktop:** os dois painéis (documento, render) lado a lado ou levemente
  sobrepostos (documento atrás, render à frente, deslocado) — nunca na mesma moldura, para não
  confundir tipo de evidência.
- **Comportamento mobile:** painéis empilhados (documento primeiro, render depois), texto
  acima de ambos.

```text
┌────────────────────────────────────────────────────────────────┐
│ eyebrow "Projetos" · H2 "Quem projeta, especifica."               │
├───────────────────────────────┬──────────────────────────────┤
│ bullets de autoridade técnica   │ [Documento de projeto]          │
│  (layout, fluxo, dimensiona-    │      [Estudo 3D]                │
│   mento, plantas, memorial)     │                                  │
│ [Fale com um projetista]        │                                  │
└───────────────────────────────┴──────────────────────────────┘
```

- **Interação:** nenhuma além de foco/hover padrão dos painéis (leve realce, sem troca de
  conteúdo).
- **Ligação com a próxima:** Consultoria é a outra porta de sustentação, mesma hierarquia.

---

## 5. Consultoria — porta independente

- **Posição:** quinta dobra.
- **Função:** capturar gargalo operacional, oferecer diagnóstico.
- **Não depende de responsável público nomeado (correção desta revisão):** hoje não existe
  decisão confirmada sobre pessoa, foto, nome ou cargo público para este pilar (`V2_PRODUCT.md`
  §4; `DECISIONS.md` DEC-004). Esta seção não estrutura nenhum elemento em torno de uma
  pessoa — comunica diagnóstico → análise → decisão → melhoria operacional inteiramente por
  conteúdo, processo e evidência (ver direção visual §10.1). Classificação: "responsável
  público da Consultoria" é `CONTEÚDO OPCIONAL FUTURO — NÃO BLOQUEADOR` — se confirmado depois,
  entra como reforço (ex.: citação atribuída ou retrato pequeno junto ao CTA), sem alterar a
  arquitetura abaixo.
- **Fundo:** escuro (`graphite`) — diferenciação deliberada de Projetos (ver direção visual
  §10).
- **Estrutura/colunas (desktop ≥1024px):** fotografia à esquerda (~45%), texto + lista de
  frentes à direita (~55%); bloco de desfecho (`diagnosisOutcomes`) em largura total abaixo
  das duas colunas.
- **Conteúdo — progressão diagnóstico → análise → decisão → melhoria:**
  - **Diagnóstico:** eyebrow "Consultoria" (amarelo sobre grafite); H2
    `PROPOSTA DE COPY — GATE 2` — abre pelo sintoma reconhecível, approach de
    `symptomChapters` (ex.: gargalo operacional identificável antes de qualquer oferta);
  - **Análise:** 6 frentes de diagnóstico (`diagnosisAreas`, `src/data/diagnosis.ts`):
    Estrutura e espaço · Fluxo de produção · Equipamentos · Processos e equipe · Custo e
    desperdício · Comercial e demanda — lista compacta (rótulo curto, sem o parágrafo completo
    de cada frente);
  - **Decisão/melhoria:** `diagnosisOutcomes` (`src/data/diagnosis.ts`, 6 itens já existentes,
    reduzidos a rótulo curto) — Identificar a causa, não o sintoma · Estabelecer prioridades ·
    Direcionar o investimento · Evitar a compra errada · Reduzir desperdício · Melhorar o
    resultado da operação. Conteúdo real já existente no dataset, usado aqui pela primeira vez
    na Home para fechar a progressão sem depender de pessoa nomeada.
- **Evidência:** `refrigeradores-verticais.jpg` (já usada com esse papel em `scope-levels.ts`
  nível 01) — fotografia de operação real associada a diagnóstico.
- **CTA:** **Agendar diagnóstico** → destino conceitual: página de Consultoria (V2-05); até
  existir, contato com intenção `consultoria`.
- **Prioridade visual:** igual a Projetos.
- **Comportamento desktop:** lista de 6 frentes e bloco de `diagnosisOutcomes` sem interação
  obrigatória (todos visíveis, sem acordeão) — evita esconder conteúdo essencial atrás de
  clique.
- **Comportamento mobile:** foto acima; lista de frentes completa (6 itens) e
  `diagnosisOutcomes` completo (6 itens), sem corte; CTA ao final. Em telas mais baixas, os
  rótulos de `diagnosisOutcomes` podem entrar como linha inline curta em vez de bloco próprio
  — decisão de densidade da implementação, não de conteúdo.

```text
┌────────────────────────────────────────────────────────────────┐
│ eyebrow "Consultoria" · H2 (abre pelo sintoma)  ← DIAGNÓSTICO      │
├───────────────────────────────┬──────────────────────────────┤
│ [fotografia real de operação]  │ Estrutura e espaço                │
│                                 │ Fluxo de produção                 │
│                                 │ Equipamentos                      │
│                                 │ Processos e equipe                │
│                                 │ Custo e desperdício                │  ← ANÁLISE
│                                 │ Comercial e demanda                │
├───────────────────────────────┴──────────────────────────────┤
│ O que o diagnóstico permite decidir: Identificar a causa ·        │
│ Estabelecer prioridades · Direcionar o investimento ·              │  ← DECISÃO/MELHORIA
│ Evitar a compra errada · Reduzir desperdício · Melhorar o          │
│ resultado da operação                                              │
├────────────────────────────────────────────────────────────────┤
│                                            [Agendar diagnóstico]    │
└────────────────────────────────────────────────────────────────┘
```

- **Ligação com a próxima:** as duas portas independentes fecham antes da prova ampliada.

---

## 6. Prova — quarta dobra comercial

- **Posição:** sexta seção da página.
- **Função:** evidência verificável e autorizada para as três frentes.
- **Fundo:** claro (`canvas`).
- **Estrutura:** três raias empilhadas (não uma galeria única — ver direção visual §11).

### Raia 1 — Projetos (mosaico, não grid)

- `leadProject` (`cozinha-completa.jpg`) em destaque + `featuredProjects` (`bar-inox`,
  `forno-combinado`, `camara-frigorifica`) em colunas (`columns-*` + `break-inside-avoid`,
  lição herdada da V1 para proporções variadas).
- Legenda: só o que já existe em `projects.ts` (título + escopo) — sem cliente/local/prazo.

### Raia 2 — Confiança (logos)

- 10 logos `featured: true` (`src/data/clients.ts`), grade estática com quebra de linha,
  `object-contain`, sem carrossel automático.

### Raia 3 — Depoimentos

- 2 depoimentos identificáveis (`testimonials.ts`) — autor, cargo, organização, retrato; nota
  de que ambos aguardam reconfirmação de autorização antes de publicação.

### Métricas

- `heroMetrics`/`scopeMetrics` reaparecem como legenda numérica pequena junto da raia de
  projetos ou logos — não como bloco isolado repetindo a composição do hero.

- **CTA:** "Ver todos os projetos" → `/projetos`; link secundário textual para `/sobre`.
- **Prioridade visual:** média.
- **Comportamento com conteúdo parcial:** cada raia usa `auto-fit`/mosaico tolerante a
  contagem variável — nenhuma raia depende de um número mínimo de itens.
- **Comportamento mobile:** raias empilhadas na mesma ordem (projetos → logos →
  depoimentos), mosaico de projetos reduz a 1 coluna.
- **Ligação com a próxima:** última seção de conteúdo antes da autoridade condensada.

---

## 7. Autoridade — quem conduz (condensada)

- **Posição:** sétima seção.
- **Função:** apresentar quem responde, uma vez só.
- **Fundo:** claro (`surface`).
- **Estrutura (desktop ≥1024px):** dois retratos lado a lado, largura igual.
- **Conteúdo:** `leadershipTeam` (`src/data/team.ts`) — Leonardo (retrato, nome, "Projetos e
  Equipamentos", 2 bullets reduzidos de `leonardo.bullets`) e Guilherme (retrato, nome,
  "Operação Comercial", 2 bullets reduzidos de `guilherme.bullets`).
- **CTA:** **Conhecer a trajetória** → `/leonardo-bianchini` (rota já existe, dossiê completo,
  não recriado).
- **Prioridade visual:** baixa-média.
- **Comportamento desktop:** dois blocos lado a lado, sem interação além do link.
- **Comportamento mobile:** empilhados, retrato + nome + cargo + 2 bullets cada.

```text
┌────────────────────────────────────────────────────────────────┐
│ eyebrow "Quem conduz"                                             │
├───────────────────────────────┬──────────────────────────────┤
│ [retrato] Leonardo Bianchini    │ [retrato] Guilherme Beghini      │
│ Projetos e Equipamentos         │ Operação Comercial               │
│ · bullet 1                      │ · bullet 1                       │
│ · bullet 2                      │ · bullet 2                       │
├───────────────────────────────┴──────────────────────────────┤
│ [Conhecer a trajetória →]                                         │
└────────────────────────────────────────────────────────────────┘
```

- **Ligação com a próxima:** última seção de conteúdo antes do CTA final.

---

## 8. CTA final

- **Posição:** oitava seção.
- **Função:** fechamento comercial, canal duplo.
- **Fundo:** escuro (`graphite`).
- **Estrutura:** centrada, largura de leitura controlada (não texto solto de ponta a ponta).
- **Conteúdo:** H2 `PROPOSTA DE COPY — GATE 2`; CTA primário (Equipamentos, maior); dois links/
  CTAs secundários nomeados (Projetos, Consultoria — menores, mesmo peso entre si); formulário
  curto (`contact-form.tsx`, sem backend) ou WhatsApp com mensagem contextual.
- **CTA:** ver estrutura acima — três destinos, um deles com peso maior.
- **Evidência:** nenhuma — é ação.
- **Prioridade visual:** alta.
- **Comportamento desktop:** formulário e botão de WhatsApp lado a lado ou em abas simples.
- **Comportamento mobile:** empilhado, CTA primário em largura total, WhatsApp como alternativa
  imediatamente abaixo.
- **Interação:** `?intencao=` herdado da seção de origem do clique; erro de validação
  associado ao campo; popup bloqueado não gera falsa confirmação de envio.
- **Ligação com a próxima:** encerra o conteúdo — rodapé é utilitário.

---

## 9. Rodapé

- **Posição:** última seção.
- **Função:** navegação completa, contato, legal.
- **Conteúdo:** `footerNav` (`src/data/navigation.ts`) — Soluções / Equipamentos / Empresa,
  já organizado; contato (`site.ts`, `contact`), WhatsApp, Instagram institucional.
- **Gap herdado, não resolvido aqui:** CNPJ, razão social, endereço completo ausentes
  (severidade P0 na auditoria da V1) — permanece como pendência de dado, não de wireframe.
- **Prioridade visual:** baixa — utilitário.
- **Comportamento mobile:** três colunas empilhadas, índice completo (mesma lógica da V1).

---

## Responsividade detalhada por viewport

| Viewport | Grupo | Comportamento específico |
| --- | --- | --- |
| 1920×1080 | Desktop largo | hero com folga ampla; as seis categorias no painel ativo, sem rolagem interna |
| 1680×992 | Desktop largo | idem |
| 1440×900 | Desktop | proporção padrão de referência para todos os wireframes acima |
| 1366×768 | Desktop | altura de viewport menor — verificar que as seis linhas da lista de categorias continuam sem rolagem interna nesta faixa |
| 1024×768 | Tablet (paisagem) | testar explicitamente o indicador de categoria ativa (seção 2, agora com seis linhas) e o cartão assimétrico da seção 3 — faixa historicamente problemática (V1: elemento caindo 108–490px fora de posição) |
| 768×1024 | Tablet (retrato) | hero passa a empilhar (imagem acima, texto abaixo) como no mobile, mas com painéis maiores; vitrine de categorias pode manter lista+painel se houver largura, ou já cair para cartões simples — decidir em Gate 3 com protótipo real |
| 390×844 | Mobile | referência principal do wireframe mobile — chips de categoria normalmente cabem dentro da própria dobra do hero (ver seção 1) |
| 360×800 | Mobile | altura mais apertada — chips de categoria migram para logo abaixo do hero (não dentro dele); H1, CTA primário e fotografia/legenda nunca cedem espaço |
| 320×800 | Mobile | faixa mais apertada — mesmo comportamento de 360×800; nenhuma largura testada gera rolagem horizontal |

---

## Assets por bloco — matriz completa

| Bloco | Caminho | Tipo | Uso | Restrição |
| --- | --- | --- | --- | --- |
| Hero | `public/images/hero/hero-industrial-kitchen.png` | fotografia real | painel principal | nenhuma conhecida |
| Hero (alt.) | `public/images/hero/linha-de-coccao.jpg` | fotografia real | alternativa ao painel | já reutilizada em 3 pontos na V1 — limitar repetição na V2 |
| Categoria — Cocção | `public/images/projects/linha-de-fogoes.jpg` | fotografia real | painel ativo/card | nenhuma |
| Categoria — Refrigeração | `public/images/projects/refrigeradores-verticais.jpg` | fotografia real | painel ativo/card | reaproveitada também em Consultoria (seção 5) e Prova — controlar repetição |
| Categoria — Mobiliário em inox | `public/images/projects/mobiliario-inox.jpg` | fotografia real | painel ativo/card | nenhuma |
| Categoria — Exaustão | `public/images/hero/linha-de-coccao.jpg` | fotografia real | painel ativo/card | mesma nota do hero (alt.) |
| Categoria — Preparo | **nenhum asset atribuído** | — | placeholder editorial (moldura técnica vazia) | sem dataset — não substituir por foto de outra categoria; ver §2 |
| Categoria — Higienização | **nenhum asset atribuído** | — | placeholder editorial (moldura técnica vazia) | sem dataset — não substituir por foto de outra categoria; ver §2 |
| Categoria — Tecnologia de cocção (referência, não item de navegação própria) | `public/images/projects/forno-combinado.jpg` | fotografia real | aprofundamento dentro do painel de Cocção / página de Equipamentos (V2-03) | não é uma das seis frentes do Master — ver direção visual §8.0 |
| Projetos | `public/images/projects/planta-executiva.jpg` / `-recorte.jpg` | documento real | painel "Documento de projeto" | rotular explicitamente como documento |
| Projetos | `public/images/projects/projeto-3d.jpg` / `-recorte.jpg` | render | painel "Estudo 3D" | nunca descrever como obra entregue (DEC-008) |
| Projetos (apoio) | `public/images/projects/cozinha-completa.jpg` | fotografia real | reforço de que existe execução real, não só desenho | nenhuma |
| Consultoria | `public/images/projects/refrigeradores-verticais.jpg` | fotografia real | evidência de operação | ver nota de repetição acima |
| Consultoria (alt.) | `public/images/projects/camara-frigorifica.jpg` | fotografia real | alternativa, reduz repetição | nenhuma |
| Prova — raia projetos | `leadProject`/`featuredProjects` (`cozinha-completa`, `bar-inox`, `forno-combinado`, `camara-frigorifica`) | fotografia real | mosaico | sem cliente/local/prazo |
| Prova — raia confiança | `public/images/clients/*.png` (10 `featured: true`) | logotipo | grade estática | só os 10 já aprovados, sem nova autorização |
| Prova — raia depoimentos | `public/images/testimonials/walney-cerqueira.jpg`, `joao-carlos-peres.jpg` | fotografia (retrato) | cards de depoimento | aguardam reconfirmação de autorização |
| Autoridade | `public/images/team/leonardo-bianchini.png`, `foto-recortada-guilherme.png` | fotografia (retrato) | retratos institucionais — **único lugar da Home com retrato de pessoa** (correção desta revisão: seção 3 não usa mais retrato, ver §3) | nenhuma |
| Não recomendado | `public/images/book/dominando-vendas-equipamentos-cozinha.png` | material licenciado | — | fora do escopo desta Home por decisão congelada; fica no dossiê de Leonardo |
| Não recomendado | `public/images/hero/operacao-comercial.png` | fotografia real | — | vinculada ao pilar interno "Operação Comercial", fora do trio público da V2 |
| Disponível, fora do inventário da spec V2-01 | `public/images/team/leonardo-camara-frigorifica.jpg`, `leonardo-forno-combinado.jpg`, `leonardo-linha-de-producao.jpg`, `leonardo-visita-de-fabrica.jpg` | fotografia real | candidatas a diversificar Projetos/Consultoria (Leonardo em ação, não só retrato) | não avaliadas pelo Gate 1 — decisão de conteúdo para o Gate 3 |
