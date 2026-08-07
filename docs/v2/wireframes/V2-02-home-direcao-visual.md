# V2-02 — Home: Direção Visual (Gate 2)

```text
STATUS: PROPOSTA PARA REVISÃO — não aprovado, não implementar
```

**Branch:** `v2`. Nenhum código, componente, CSS ou asset alterado por esta tarefa — apenas
os dois documentos em `docs/v2/wireframes/`.
**Gate:** 2 — Direção visual e wireframe (`WORKFLOW_IA_V2.md` §3). Depende do Gate 1
aprovado (`docs/v2/specs/V2-01-home-arquitetura.md`, `docs/v2/DECISIONS.md` DEC-012).
Próximo gate possível: 3 — antes disso, nenhuma implementação (`V2-02` de código) começa.
**Data:** 2026-08-07.

Este documento cobre conceito, princípios, hierarquia, tratamento visual, composição,
densidade, motion, responsividade e o que fica para depois. A estrutura seção a seção — com
ASCII wireframes — está em `V2-02-home-wireframe.md`. Os dois se leem juntos.

---

## 0. Fontes lidas e regra de precedência aplicada

Nesta ordem, parando ao encontrar a resposta (`docs/v2/README.md`):

1. `docs/v2/DECISIONS.md` (DEC-001 a DEC-012) — decisões congeladas.
2. `docs/v2/V2_PRODUCT.md` — hierarquia comercial, jornadas, matriz de categorias.
3. `MASTER_BIANCHINI.md` v5.0 — regras duradouras, direção visual (§7–9), motion, roadmap.
4. `docs/v2/specs/V2-01-home-arquitetura.md` — Gate 1 aprovado: 9 seções, conteúdo,
   evidência, estados, responsividade, motion, acessibilidade, eventos.
5. `docs/v2/DESIGN_SYSTEM.md` — tokens confirmados e temas explicitamente `A DEFINIR NO
   GATE 2` (é este documento que os resolve).
6. Referência, sem valor normativo além do que já foi absorvido pelos itens acima:
   `GUIA_COMPLETO_DO_SITE_BIANCHINI.md`, `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`,
   `docs/DESIGN_SPEC.md`, `docs/COMPONENT_MAP.md` (desatualizado, conforme o próprio
   arquivo), `CLAUDE.md` (estado e armadilhas **da V1** — usado aqui só como lição de
   engenharia já validada, nunca como requisito da V2).

**Nenhum conflito documental real foi encontrado.** As cinco fontes normativas (1–5)
concordam entre si em todos os pontos relevantes a este Gate — DEC-001/002/003/005 e
V2_PRODUCT §2/§5 descrevem a mesma hierarquia que o Master §3/§5.1 e a spec V2-01 detalham.
Onde a spec V2-01 já resolveu uma ambiguidade histórica (Consultoria vs. Operação Comercial,
copy do hero, rota dos CTAs — ver DEC-004 e DEC-011), este documento trata a resposta como
fechada e não a reabre. Não há, portanto, nada a reportar como bloqueio de governança — este
Gate segue.

---

## 1. Conceito visual

**Fornecedor técnico + especialista de projeto + operação profissional.**

A Home V2 é uma interface comercial, não uma apresentação institucional. O visitante que já
sabe o que precisa (equipamento) tem de conseguir agir sem ler a empresa inteira; o
visitante que não sabe tem de encontrar, na mesma página, o caminho de Projetos ou
Consultoria sem que isso pareça um desvio.

Isso muda o que "precisão industrial com inteligência operacional e presença premium"
(`MASTER_BIANCHINI.md` §8, conceito herdado — DESIGN_SYSTEM.md §1) significa **nesta**
página: precisão aqui não é decoração técnica (grade cartesiana, numeral gigante, diagonal
por si), é **densidade de decisão por rolagem** — cada seção existe porque resolve uma
pergunta de compra, não porque "parece engenharia".

### 1.1 O que preservar (herdado, decisão congelada — `MASTER_BIANCHINI.md` §23)

- linguagem industrial/técnica, aço inox, grafite, off-white, amarelo como acento;
- fotografia real de cozinha/equipamento/projeto — nunca IA como prova;
- tipografia forte, alto contraste, sensação de precisão;
- Manrope (leitura/interface) + Oswald (rótulo técnico curto) — sem serifada;
- as três curvas de motion e as faixas de duração já validadas (`DESIGN_SYSTEM.md` §6);
- os princípios de acessibilidade e responsividade já validados (`DESIGN_SYSTEM.md` §7/§9).

### 1.2 O que não copiar mecanicamente da V1

A V2 herda a **identidade**, não a **composição do hero da V1**. Especificamente:

- a unidade `--u` do hero V1 é geometria de uma composição específica (mockup 1586×992,
  narrativa que abre por diagnóstico) — não é reaproveitada como mecanismo; a V2 tem geometria
  própria, definida na seção 5 deste documento;
- o painel diagonal (`DiagonalPhoto`, `.diag-panel`/`.diag-keyline`) é um recurso validado,
  mas replicá-lo aqui seria "copiar mecanicamente a V1" pelo que o próprio prompt de direção
  pede para evitar — a V2 usa um recurso de composição próprio (seção 5.1, alternativas de
  Hero);
- o carrossel de slides do hero V1 (`hero-slides.ts`, autoplay) não é herdado — a V2 abre com
  **uma fotografia**, coerente com "hero não pode esconder o produto atrás de storytelling
  rotativo";
- os "tetos" de vocabulário documentados em `CLAUDE.md` (um uso de grade cartesiana, dois
  momentos de diagonal, um blueprint, nenhum numeral gigante) são **lições de engenharia
  validadas da V1**, não requisito da V2 — mas são um bom termômetro: se a V2 recriar os
  mesmos recursos pelos mesmos motivos, é sinal de estar redesenhando a V1 em vez de projetar
  a partir da nova hierarquia comercial.

### 1.3 O que evitar (prompt de direção, item 4)

Excesso de efeito, glassmorphism, gradiente genérico, hero cinematográfico que esconde o
produto, cards demais, borda decorativa sem função, estética genérica de agência, visual de
catálogo barato, texto centralizado em excesso, composição excessivamente simétrica.

---

## 2. Hierarquia visual da página

Ordem de peso comercial, aplicada como ordem de **massa visual** (área + contraste + posição
de leitura), não só como ordem de seção:

1. **Equipamentos** — hero (seção 1) + vitrine (seção 2): duas dobras inteiras, prioridade
   máxima da página.
2. **CTA "Solicitar orçamento de equipamentos"** — maior peso de qualquer controle da página;
   nenhum outro botão compete com ele em tamanho, cor de preenchimento ou posição.
3. **Projetos / Consultoria como sustentação** — seção 3 (peso assimétrico, Equipamentos
   maior) e seções 4–5 (peso igual entre si, menor que Equipamentos).
4. **Prova** (seção 6) — evidência, não conversão; massa média.
5. **Autoridade** (seção 7) — apoio; massa baixa-média.
6. **CTA final** (seção 8) — fechamento, mas com a mesma assimetria da regra de ouro:
   Equipamentos é a ação primária, Projetos/Consultoria são ações secundárias nomeadas, não
   um terceiro botão do mesmo peso.

Essa hierarquia é a mesma do item F/E da spec V2-01 — este documento só a traduz em decisão
de composição.

---

## 3. Tipografia conceitual

Sem token novo — os dois papéis já confirmados (`DESIGN_SYSTEM.md` §3) bastam para toda a
Home V2:

| Papel | Família | Onde na Home V2 |
| --- | --- | --- |
| Leitura/interface | Manrope, 700/800 nos títulos | H1 do hero, H2 de cada seção, parágrafos, formulário, navegação |
| Rótulo técnico curto | Oswald | eyebrow de seção, rótulo de categoria na vitrine (seção 2), numeral dos níveis/etapas se reaproveitados, legenda de documento/render (seção 4), etiqueta de CTA |

Regra herdada e reafirmada: Oswald nunca em texto corrido nem em título — a proporção de uso
na V2 é, se algo, **menor** que na V1, porque a Home V2 tem menos numeração decorativa
(nenhum "01/02/03" de seção é obrigatório fora dos blocos que já o usam por função real —
método, níveis).

Escala: reaproveitar as classes já registradas em `tailwind-merge`
(`text-display`/`text-title-1..3`/`text-lead`/`text-body`/`text-body-sm`/`text-caption`/
`text-eyebrow`/`text-numeral`). Nenhum token novo é necessário para o wireframe deste Gate;
se a implementação precisar de uma escala intermediária, ela entra no Design System antes de
ser usada, não como classe solta.

---

## 4. Paleta / tokens

Sem token novo — `src/styles/colors.ts` já cobre todo o vocabulário necessário
(`DESIGN_SYSTEM.md` §2). Aplicação por seção:

| Seção | Fundo | Papel do amarelo |
| --- | --- | --- |
| 1. Hero | `canvas`/`surface` claro | preenchimento do CTA primário; hairline no painel de imagem |
| 2. Categorias | `canvas` claro | preenchimento do indicador ativo (nunca cor de texto) |
| 3. Do projeto à execução | `graphite` escuro (proposta — ver §7) | acento pleno: rótulo, número do cartão Equipamentos, régua do CTA |
| 4. Projetos | `surface`/`canvas` claro | hairline, preenchimento do CTA |
| 5. Consultoria | `graphite` escuro (proposta — ver §10) | acento pleno: marcador de sintoma, índice de frente de diagnóstico |
| 6. Prova | `canvas` claro | preenchimento discreto (borda ativa de carrossel de logos, se houver) |
| 7. Autoridade | `surface` claro | hairline apenas |
| 8. CTA final | `graphite` escuro | preenchimento do CTA primário; textos de apoio em `canvas`/`muted` |
| 9. Rodapé | `graphite` escuro | herdado da V1 |

A alternância clara/escura entre as seções 3–5 não é um teto copiado da V1 (que tinha "dois
pares adjacentes, e só") — é uma decisão nova, justificada em §7 e §10, porque a Home V2 tem
menos seções escuras no total (3 de 9, contra ~metade na V1) e o contraste ajuda a separar
"integração" (seção 3) de "prova de execução" (seção 4, clara/documental) de "diagnóstico"
(seção 5, escura/analítica) sem precisar de mais um recurso decorativo.

**Regra do amarelo não muda:** nunca texto ou indicador de estado sobre fundo claro; livre
sobre `graphite`/`ink`. Estado ativo em fundo claro é sempre grafite, inclusive em
preenchimento de controle (vale para o indicador ativo da vitrine de categorias, seção 2).

---

## 5. Tratamento de imagem

Ordem de evidência (`DECISIONS.md` DEC-008, `DESIGN_SYSTEM.md` §8) aplicada por seção — ver
inventário completo no item 18 do relatório final e na tabela de assets abaixo por bloco no
wireframe. Princípios de composição:

- **Fotografia como conteúdo, não como fundo.** Nenhuma seção usa foto em tela cheia com
  texto sobreposto como recurso principal — é exatamente o "hero cinematográfico que esconde
  o produto" a evitar. Foto sempre em painel dimensionado, com margem de respiro,
  identificável como objeto (equipamento, cozinha, documento), não como textura.
- **Um painel, um propósito.** Painel de fotografia real ≠ painel de documento (planta) ≠
  painel de render (estudo 3D) — os três podem coexistir na seção 4 (Projetos), mas cada um
  leva rótulo próprio (`DEC-008`), nunca a mesma moldura visual sem diferenciação.
- **Reuso controlado.** `linha-de-coccao.jpg` já aparece em 3 pontos da V1 (hero alternativo,
  categoria Exaustão, os 3 recortes de `symptomChapters`) — a V2 deve limitar a repetição do
  mesmo arquivo a no máximo dois papéis distintos na Home para não parecer acervo pequeno
  (ver riscos, item 9 do relatório).
- **`quality` de imagem sempre declarada** em `next.config.ts` antes de qualquer novo valor —
  regra de engenharia herdada, sem exceção.

---

## 6. Composição — princípios gerais

- **Assimetria é o recurso central da página**, não a diagonal. Onde a V1 usava um corte
  geométrico para dar caráter, a V2 usa proporção de coluna desigual (hero, seção 3) e
  hierarquia de lista (vitrine de categorias) — recursos que carregam significado comercial
  direto (isto pesa mais que aquilo), não só estilo.
- **Nenhuma seção nova imita a anterior.** Duas seções consecutivas não repetem mais de dois
  padrões de composição (introdução em duas colunas, lista de itens, divisor, numeração,
  fundo liso, CTA no fim) — princípio herdado do "vocabulário visual" da V1 e reafirmado aqui
  porque a Home V2, mais curta (9 seções vs. 14), tem menos margem para parecer template se
  repetir fórmula.
- **Toda seção responde cinco perguntas antes de existir** (`MASTER_BIANCHINI.md` §8):
  mensagem, prova, massa visual, interação, próximo passo — respondidas seção a seção no
  wireframe.

---

## 7. HERO — alternativas e direção escolhida

`PROPOSTA DE COPY — GATE 2` para todo texto de exemplo citado abaixo.

### Alternativa 1 — Painel diagonal (herda a mecânica da V1)

Coluna de texto à esquerda, painel de fotografia à direita com borda diagonal e keyline
amarela, reaproveitando `.diag-panel`/`.diag-keyline`. Vitrine de categorias entra como
chips sob as métricas.

- Prós: recurso já validado em produção, sensação premium testada, menor risco de engenharia
  nova.
- Contras: é exatamente "copiar mecanicamente a V1" (proibido pelo prompt); a mecânica de
  `--diag`/`clip-path`/`IntersectionObserver` é frágil (três armadilhas documentadas em
  `CLAUDE.md`) e recriar isso para uma composição que ainda não tem mockup aprovado é dívida
  técnica antecipada; a diagonal por si não comunica "aplicação/categoria próxima da primeira
  dobra" — precisaria de um elemento adicional para isso de qualquer forma.

### Alternativa 2 — Painel reto com moldura técnica e legenda de aplicação (recomendada)

Coluna de texto à esquerda (~42–46% da largura), painel de fotografia reto à direita
(~54–58%), sem corte diagonal. O painel recebe uma moldura técnica discreta (hairline +
cotas curtas nos cantos, no mesmo espírito do desenho ortográfico já usado no
`BlueprintCookingLine`, mas sem repetir o próprio componente) e uma **legenda de aplicação**
sobreposta no rodapé do painel — rótulo Oswald pequeno identificando o que está na foto (ex.:
"Linha de cocção em operação — fornos combinados, chapa e exaustão integrados"). Essa legenda
é o "elemento funcional próximo da primeira dobra" pedido no item 6 do prompt: ela já
funciona como ponte para a vitrine de categorias da seção 2, sem precisar da diagonal para
comunicar isso.

- Prós: não copia a V1; a legenda de aplicação cumpre a exigência de "categoria/aplicação
  próxima da primeira dobra" de forma mais direta que um corte geométrico; painel reto é mais
  barato de manter responsivo (sem `--diag`, sem herança de custom property entre wrapper e
  filhos) e mais fácil de testar em todos os 11 viewports de referência; a moldura técnica
  (hairline + cotas) mantém a leitura "engenharia", sem depender de um recurso que já tem três
  armadilhas documentadas.
- Contras: menos "assinatura visual imediatamente reconhecível" que a diagonal do mockup V1 —
  mitigado pelo restante da identidade (cor, tipografia, motion) permanecer igual.

### Direção escolhida: Alternativa 2

Composição do hero (desktop ≥1024px):

```text
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, ver seção 14)                                          │
├───────────────────────────────┬────────────────────────────────────────┤
│ EYEBROW (Oswald, pequeno)      │                                        │
│  "Equipamentos para cozinha    │        PAINEL DE FOTOGRAFIA            │
│   profissional"                │        (reto, moldura técnica,         │
│                                 │         hairline + cotas nos cantos)   │
│ H1 (Manrope 800)                │                                       │
│  PROPOSTA DE COPY — GATE 2:     │   [ fotografia real — cozinha/linha    │
│  nomeia "equipamentos" na       │     de cocção em operação ]            │
│  primeira frase, cita           │                                       │
│  especificação técnica          │                                       │
│                                 │  ┌──────────────────────────────────┐ │
│ Lead (Manrope, 1 frase)         │  │ legenda de aplicação (Oswald sm)│ │
│  capacidade técnica +           │  │ "Linha de cocção em operação —  │ │
│  Projeto/Consultoria como       │  │  fornos combinados, chapa e     │ │
│  sustentação                    │  │  exaustão integrados"           │ │
│                                 │  └──────────────────────────────────┘ │
│ [Solicitar orçamento de         │                                       │
│  equipamentos] (CTA primário,   │                                       │
│  preenchimento amarelo)         │                                       │
│  Conhecer projetos e            │                                       │
│  consultoria (CTA secundário,   │                                       │
│  texto/ghost)                   │                                       │
│                                 │                                       │
│ 18 anos · 3.000+ projetos ·     │                                       │
│ Brasil  (métricas, Oswald)      │                                       │
│                                 │                                       │
│ ▸ Cocção ▸ Refrigeração ▸ Inox  │                                       │
│ ▸ Exaustão ▸ + 1  (seletor de   │                                       │
│  categoria compacto — chips,    │                                       │
│  âncora para a seção 2)         │                                       │
└───────────────────────────────┴────────────────────────────────────────┘
```

O **seletor de categoria compacto** (chips com os nomes das categorias, sem foto) é o
elemento que resolve, ao mesmo tempo, "elemento funcional próximo da primeira dobra" (item 6
do prompt) e a ponte de leitura entre hero e vitrine — clicar em um chip rola/navega até o
card correspondente da seção 2. Ele não substitui a seção 2, é um resumo escaneável dela. Em
desktop, os seis nomes de categoria (ver §8 — correção: seis, não cinco) cabem em uma única
linha de chips sem quebra; se a largura apertar (telas na borda inferior da faixa desktop),
os chips quebram em duas linhas antes de recorrer a rolagem horizontal.

**Prioridade visual dentro do hero (desktop):** 1) Equipamentos (H1 + painel); 2) CTA
primário; 3) métricas/prova técnica; 4) chips de categoria; 5) CTA secundário (Projetos/
Consultoria) — a ordem pedida no item 6 do prompt.

### 7.1 O que diferencia este hero de um template B2B genérico

Um hero B2B genérico é "headline + parágrafo + botão + foto de fundo desfocada, decorativa,
substituível por qualquer stock photo do setor" — o prompt de direção pede explicitamente
para evitar isso. A composição da Alternativa 2 evita esse resultado por quatro decisões
concretas, não por estilo aplicado por cima:

1. **A fotografia não é fundo, é o segundo protagonista da dobra.** Ela ocupa painel próprio
   (~54–58% da largura), com moldura e legenda — nunca fica atrás do texto nem é recortada
   para caber "atmosfera". Se a foto trocar, a legenda de aplicação muda junto — os dois são a
   mesma unidade de conteúdo, não decoração + texto sobreposto.
   - **A leitura do produto é uma exigência de captura, não só de composição:** o
     equipamento/linha em operação precisa estar identificável a olho nu no enquadramento
     escolhido — reconhecível como objeto (fogão, coifa, câmara, bancada), não como uma cena
     genérica de "gente de avental trabalhando". Enquadramento que reduz o equipamento a
     plano de fundo desfocado reprova nesta direção, mesmo que a foto seja real.
2. **Overlay só onde a legibilidade exige.** A única sobreposição sobre a fotografia é a
   legenda de aplicação (rodapé do painel, contraste alto, área contida) — não há gradiente
   cobrindo a foto inteira "por garantia", nem título posicionado sobre a imagem. Texto
   principal (H1, lead, CTA, métricas, chips) vive inteiramente na coluna à esquerda, nunca
   sobre o objeto fotografado.
3. **A moldura técnica (hairline + cotas) é informação, não textura.** Os traços nos cantos do
   painel citam o mesmo vocabulário de desenho técnico já usado no restante do produto
   (`BlueprintCookingLine`) sem repetir o componente — reforçam "isto é especificação de
   engenharia", não um recurso gráfico aplicado para preencher espaço vazio.
4. **O seletor de categoria compacto amarra hero e vitrine em uma única decisão de produto.**
   Um hero genérico termina no botão; este termina no botão **e** em uma prévia navegável do
   que vem a seguir — o visitante nunca precisa adivinhar se existe mais o que ver abaixo do
   CTA.

Consequência prática para o Gate 3: se, durante a implementação, a foto escolhida não permitir
leitura clara do equipamento sem cobri-lo com texto, a foto está errada para este hero — não é
o texto que deve encolher a foto de baixo da caixa, é a foto que precisa ser recapturada ou
substituída por uma que sustente a regra do item 1.

### 7.2 Hero mobile — prioridade, não obrigação de caber tudo em 100vh

A versão anterior deste documento exigia que "H1 + CTA + chips" coubessem sempre antes de
qualquer rolagem em 390×844/360×800/320×800. Correção: isso forçava a primeira dobra do
celular a comprimir texto e navegação para caber uma meta artificial de pixels, o que é
exatamente o tipo de restrição que produz título cortado ou CTA espremido. A regra correta é
de **prioridade de conteúdo**, não de encaixe obrigatório em uma altura fixa:

1. identificação de Equipamentos (eyebrow + H1) — sempre no topo, sempre visível ao abrir a
   página;
2. proposta principal (lead) — pode ser mais curta que no desktop, mas não é cortada;
3. CTA primário ("Solicitar orçamento de equipamentos") — visível o mais cedo possível, sem
   depender de rolar além da primeira tela na maioria dos aparelhos, mas **sem** meta de vh
   fixa;
4. visual/prova de aplicação (fotografia + legenda) — tem leitura própria, não é cortada para
   caber os itens acima;
5. acesso às categorias (chips) — **pode começar imediatamente abaixo do hero**, como abertura
   visual da seção 2, em vez de disputar espaço dentro da primeira dobra, se a largura for
   estreita o suficiente para que os chips comprometam a legibilidade do H1/CTA.

Em 390×844 os chips normalmente cabem dentro da primeira dobra sem prejuízo (viewport mais
alto das três larguras móveis de referência); em 360×800 e especialmente 320×800, onde a
altura disponível é menor, os chips são o primeiro elemento a migrar para logo abaixo do
hero — o H1, o CTA primário e a fotografia/legenda de aplicação nunca são o que cede espaço.
Ver comportamento detalhado por viewport no wireframe.

---

## 8. CATEGORIAS DE EQUIPAMENTOS — alternativas e direção escolhida

### 8.0 Correção desta revisão — verdade de produto vs. estado de conteúdo

A revisão anterior deste documento listava cinco categorias na vitrine porque comparou a
arquitetura só contra o dataset de `equipment-categories.ts` — exatamente o erro que DEC-007
já nomeia e corrige ("ausência de dataset não invalida uma categoria empresarial
documentada"). Correção: a vitrine da seção 2 e o seletor de categoria compacto do hero (§7)
navegam **seis** categorias, as seis frentes reconhecidas por `MASTER_BIANCHINI.md` §3.1 e
`DECISIONS.md` DEC-007:

| Categoria | Verdade de produto | Estado de conteúdo | Tratamento na vitrine |
| --- | --- | --- | --- |
| Cocção | confirmada | dataset completo (`equipmentCategories`) | foto real + benefício + itens + CTA |
| Refrigeração | confirmada | dataset completo | idem |
| Mobiliário em inox | confirmada | dataset completo | idem |
| Exaustão e ventilação | confirmada | dataset completo | idem |
| Preparo | confirmada | **sem dataset — pendente de conteúdo** | placeholder editorial (ver §8.0.1) |
| Higienização | confirmada | **sem dataset — pendente de conteúdo** | placeholder editorial (ver §8.0.1) |

**Nota sobre "Tecnologia de cocção":** `equipment-categories.ts` tem uma 5ª entrada de
dataset ("Tecnologia de cocção") sem par direto nas seis frentes nomeadas pelo Master — é uma
categoria de produto real (`V2_PRODUCT.md` §6), mas não uma das seis. Para que a vitrine da
Home comunique com clareza "são seis categorias, não sete/cinco", esta direção **não** dá a
"Tecnologia de cocção" um item de navegação próprio na Home — o conteúdo (fornos combinados
programáveis, cocção assistida, controle de processo) permanece disponível e é referenciado
como aprofundamento dentro do painel de Cocção e na página de Equipamentos (V2-03), sem perder
o dado. Se o Product Owner preferir mantê-la como sétimo item visível, é decisão de conteúdo
para o Gate 3, não uma correção deste Gate.

#### 8.0.1 Placeholder editorial seguro (Preparo / Higienização)

Sem dataset, sem inventar equipamento, marca, imagem ou descrição factual. Estrutura mínima
aceitável para as duas categorias, idêntica em forma ao restante da lista (mesmo peso
tipográfico, mesma posição, mesmo tratamento de estado ativo — nada que sinalize "categoria de
segunda classe"):

```text
Preparo
[imagem/conteúdo a definir]
→ Ver categoria

Higienização
[imagem/conteúdo a definir]
→ Ver categoria
```

Quando ativas (painel selecionado, desktop), o painel mostra o nome, uma frase neutra de
função — ex. "Equipamentos de preparo para cozinha profissional." / "Equipamentos de
higienização para cozinha profissional." (frase estrutural, não benefício específico
inventado) — e o mesmo CTA "Ver categoria", sem itens listados e sem fotografia (a área de
imagem mostra um estado neutro — hairline/moldura técnica vazia, não um ícone genérico de
"em construção", que destoaria do vocabulário visual do produto). O CTA "Ver categoria" leva
ao mesmo destino conceitual das demais (página de Equipamentos, V2-03, seção da categoria) —
não é desabilitado, porque a categoria existe comercialmente mesmo sem dataset publicado
ainda; a página de destino, ao ser implementada, decide se mostra "conteúdo em preparação" ou
já publica o dataset, se ele existir a tempo.

**A ausência de conteúdo definitivo é pendência de implementação/conteúdo, não motivo para
remover a categoria da arquitetura** — ela permanece na lista, no seletor do hero e em
qualquer contagem ("seis categorias") citada no restante deste par de documentos.

### Alternativa 1 — Grade de cards iguais

Seis cards de mesmo tamanho (foto/placeholder + nome + benefício + CTA), grid 3+3 ou 2+2+2.

- Prós: simples de implementar, cada categoria tem a mesma chance de clique.
- Contras: é exatamente o "seis cards idênticos sem hierarquia" que o prompt pede para
  evitar quando existe solução mais forte; com foto em todos os cards ao mesmo tempo, a
  seção compete em massa visual com o hero em vez de aprofundá-lo; com duas categorias sem
  foto real (Preparo, Higienização) ao lado de quatro com fotografia forte, a grade de cards
  iguais **evidencia** a assimetria de conteúdo em vez de escondê-la — os dois placeholders
  ficam visualmente "quebrados" dentro de um padrão que promete simetria; em mobile vira uma
  lista de cards sem diferenciação clara de prioridade.

### Alternativa 2 — Navegação editorial com painel ativo (recomendada)

Lista compacta à esquerda, com as **seis** categorias sempre nomeadas (Oswald, benefício
reduzido a uma linha ou, para Preparo/Higienização, sem linha de benefício — só o rótulo),
painel grande à direita mostrando a categoria ativa. Interação por clique/teclado, sem troca
ao passar o mouse (lição já validada: `CLAUDE.md`, "hover que não troca o conteúdo" — herdada
aqui como prática de engenharia, não como vocabulário visual da V1). Estado ativo com pelo
menos três sinais (peso, contraste, régua), um deles não-cromático — mesmo padrão do seletor
de pilares da V1, que já passou por teclado/ARIA.

- Prós: cria hierarquia real (uma categoria em foco por vez, com mais informação e mais
  massa de fotografia do que qualquer card individual poderia ter); reaproveita um padrão de
  interação já testado em produção (`role="tablist"`); absorve as duas categorias sem
  dataset sem quebrar o padrão — o placeholder de Preparo/Higienização ocupa a mesma linha e
  o mesmo painel que qualquer outra categoria, só com menos conteúdo dentro dele, o que lê
  como "conteúdo a publicar", não como "item incompleto do layout".
- Contras: em mobile o padrão "painel ativo" perde sentido (não há espaço para lista +
  painel lado a lado) — resolvido no comportamento mobile abaixo, que **não** tenta replicar
  o padrão de abas, e sim empilha cards simples, exatamente como a spec V2-01 (item J) já
  pede.

### Direção escolhida: Alternativa 2 (desktop/tablet), lista simples empilhada (mobile)

Desktop (≥1024px), seis categorias, Cocção ativa por padrão:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ eyebrow "Categorias"  ·  H2 "O que a Bianchini especifica e fornece"    │
├───────────────┬──────────────────────────────────────────────────────┤
│ 01 Cocção ●    │              FOTOGRAFIA REAL DA CATEGORIA             │
│ ▸ ativo, régua │              (linha-de-fogoes.jpg)                   │
│   amarela      │                                                      │
│ 02 Refrigeração│  Benefício completo (1–2 frases, reaproveita          │
│ 03 Mobiliário  │  `equipmentCategories[].benefit`)                    │
│    em inox     │                                                      │
│ 04 Exaustão e  │  Itens: Fogões e char-broilers · Chapas e            │
│    ventilação  │  fritadeiras · Fornos combinados · Caldeirões        │
│ 05 Preparo     │                                                      │
│ 06 Higienização│  [Ver linha de Cocção →] (CTA por categoria)         │
└───────────────┴──────────────────────────────────────────────────────┘
```

Mesmo painel, categoria 05 ativa (Preparo — placeholder editorial):

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 01 Cocção      │              [ moldura técnica vazia — hairline,      │
│ 02 Refrigeração│                sem fotografia; nenhum ícone           │
│ 03 Mobiliário  │                decorativo de "em construção" ]        │
│    em inox     │                                                      │
│ 04 Exaustão e  │  Preparo                                              │
│    ventilação  │  Equipamentos de preparo para cozinha profissional.   │
│ 05 Preparo ●   │  [conteúdo/dataset a publicar]                        │
│ ▸ ativo, régua │                                                      │
│   amarela      │  [Ver categoria →]                                    │
│ 06 Higienização│                                                      │
└───────────────┴──────────────────────────────────────────────────────┘
```

**Sem crescer a área do componente:** as seis linhas da lista cabem na mesma altura do painel
sem gerar rolagem interna nas larguras de referência ≥1024px — cada linha é compacta (nome +,
quando existir, 1 linha de benefício truncado); se o benefício truncado não couber em uma
linha, ele é cortado com reticências antes de forçar a lista a crescer além da altura do
painel. Não há setas de "anterior/próximo" nem numeração de posição (`1 de 6`) — esses dois
elementos são o que faria o painel ler como slider publicitário; a troca é sempre por seleção
direta de um item da lista, nunca por avanço sequencial.

**Estados essenciais, definidos explicitamente:**

- **Lista completa sempre perceptível:** as seis categorias renderizam sempre, na mesma
  ordem, sem paginação nem "ver mais" — é isso que garante que nenhuma categoria fique
  escondida.
- **Estado ativo:** peso tipográfico maior + contraste (cor do texto) + régua de 2px (grafite
  em fundo claro) — três sinais, um não-cromático (o peso), consistente com o padrão já
  validado.
- **Clique/teclado:** clique em qualquer item da lista ativa seu painel; navegação por teclado
  com setas `↑`/`↓` (ou `Tab` entre itens) + `Home`/`End` para primeiro/último item,
  `role="tablist"`/`tab`/`tabpanel`, foco visível em todo estado.
- **Categoria ativa por padrão:** Cocção (primeiro item da lista, sem heurística de "mais
  demandada" — não há dado de demanda para basear isso).
- **Painel contextual:** muda de conteúdo (foto ou moldura vazia, benefício ou frase
  estrutural, itens ou ausência deles, CTA) de acordo com a categoria selecionada — nunca
  troca de posição/tamanho na tela, só de conteúdo interno.
- **CTA da categoria:** presente em todo painel, ativo mesmo para Preparo/Higienização — "Ver
  categoria" (rótulo genérico enquanto não há dataset) ou "Ver linha de [categoria]" (quando
  o dataset existir).
- **Sem JavaScript:** todo o conteúdo das seis categorias precisa estar presente no HTML
  enviado pelo servidor (Server Component, sem *fetch* condicionado a clique) — sem JS, a
  experiência aceitável é a lista completa acessível por âncora/rolagem (equivalente ao
  comportamento mobile: as seis descrições disponíveis em sequência, sem a troca de painel
  interativa). A troca de painel via clique é uma camada de aprimoramento progressivo sobre
  esse conteúdo já presente, nunca a única forma de alcançá-lo.
- **`prefers-reduced-motion`:** a troca de categoria ativa é uma substituição de conteúdo
  instantânea (sem *crossfade*, sem deslocamento) — não há necessidade de desligar animação
  porque não há animação de entrada/saída no painel; o único motion associado (realce leve na
  fotografia, §17) já respeita a regra padrão de reduced-motion do restante do produto.

Mobile (< 768px) — cartões simples, rolagem vertical, sem carrossel automático (spec V2-01,
item J), seis categorias, todas com o mesmo tratamento:

```text
┌───────────────────────────┐
│ eyebrow · H2               │
├───────────────────────────┤
│ [foto]  Cocção              │
│         benefício (1 linha) │
│         Ver linha →         │
├───────────────────────────┤
│ [foto]  Refrigeração        │
│         ...                 │
├───────────────────────────┤
│ [foto]  Mobiliário em inox  │
│         ...                 │
├───────────────────────────┤
│ [foto]  Exaustão            │
│         ...                 │
├───────────────────────────┤
│ [moldura vazia]  Preparo    │
│  [conteúdo/dataset a        │
│   publicar]                 │
│  Ver categoria →            │
├───────────────────────────┤
│ [moldura vazia]  Higienização│
│  [conteúdo/dataset a        │
│   publicar]                 │
│  Ver categoria →            │
└───────────────────────────┘
```

Cada card mobile é sempre "ativo" (conteúdo disponível sempre visível, sem estado inativo
esmaecido) — evita o defeito já registrado em `CLAUDE.md` ("lista com maioria de itens
inertes vira tabela de relatório"). Preparo e Higienização recebem exatamente a mesma
moldura/posição/peso tipográfico dos outros quatro cards — a única diferença é o conteúdo
interno (moldura vazia em vez de foto, frase estrutural em vez de benefício, sem lista de
itens), nunca o tratamento visual do card em si.

---

## 9. "DO PROJETO À EXECUÇÃO" — alternativas e direção escolhida

### Alternativa 1 — Banner + par secundário

Faixa horizontal de largura total anunciando Equipamentos (headline + micro-CTA + tira de
fotografia), seguida por um par Projetos/Consultoria lado a lado, menor, sem fotografia
grande.

- Prós: comunica bem "uma coisa domina, duas sustentam" em uma leitura vertical simples.
- Contras: um banner de largura total nesta posição da página (terceira dobra) tende a ler
  como mais uma seção institucional de abertura — o oposto do que a Home V2 quer (evitar
  narrativa longa). Também não usa a palavra "cartão" que a spec V2-01 usa deliberadamente
  (item E.3: "cartão de Equipamentos precisa de tratamento visualmente maior").

### Alternativa 2 — Triptico assimétrico em cartões (recomendada)

Três cartões reais (com borda/fundo próprios, não uma faixa contínua), em grid desigual:
Equipamentos ocupa a maior área (coluna larga, foto grande, CTA), Projetos e Consultoria
dividem o espaço restante, empilhados, texto reduzido e link (não botão de mesmo peso do CTA
de Equipamentos).

- Prós: cumpre literalmente "cartão maior" da spec; mantém a leitura de "três pilares", mas
  sem fingir equivalência.
- Contras: com três cartões de tamanhos diferentes, mobile precisa de uma ordem clara
  (definida abaixo) para não parecer arbitrária.

### Direção escolhida: Alternativa 2

```text
┌────────────────────────────────────────────────────────────────────────┐
│ eyebrow "Integração"  ·  H2 "Do projeto à execução."                    │
├──────────────────────────────────┬───────────────────────────────────┤
│                                    │ PROJETOS                         │
│  EQUIPAMENTOS                     │ "Quem projeta, especifica."        │
│  (cartão maior — ~55–60% largura) │ 2 linhas de texto                  │
│  primeiro ponto de leitura da      │ Fale com um projetista →           │
│  seção                             ├───────────────────────────────────┤
│  fotografia grande — evidência     │ CONSULTORIA                       │
│  visual mais forte da seção        │ "Diagnóstico da operação."         │
│  título + texto: reforça em 1      │ diagnóstico → análise → decisão →  │
│  frase o que já foi visto nas      │ melhoria operacional (ver §10)     │
│  seções 1–2 e aponta de volta      │ 2 linhas de texto                  │
│  para o CTA já visto no hero       │ Agendar diagnóstico →              │
│  (sem repetir botão idêntico —     │                                    │
│  link, não CTA novo)               │                                    │
└──────────────────────────────────┴───────────────────────────────────┘
```

**A assimetria não é só tamanho físico do cartão** — é reforçada em quatro dimensões
independentes, todas a favor de Equipamentos sempre que os três pilares aparecem juntos
(regra de ouro, `MASTER_BIANCHINI.md` §3.4):

1. **Primeiro ponto de leitura:** o cartão Equipamentos ocupa a posição de leitura inicial
   (esquerda, em culturas de leitura ocidental) — o olho chega nele antes de Projetos/
   Consultoria, não só porque é maior, mas porque é o primeiro bloco na ordem do documento.
2. **CTA de maior prioridade:** o link do cartão Equipamentos aponta de volta para o mesmo CTA
   primário já visto no hero ("Solicitar orçamento de equipamentos") — os links de Projetos/
   Consultoria são texto simples ("Fale com um projetista →" / "Agendar diagnóstico →"), sem
   preenchimento de cor, reservando o único preenchimento amarelo da seção para Equipamentos
   caso o cartão inclua um CTA visualmente destacado.
3. **Evidência visual mais forte:** o cartão Equipamentos é o único com fotografia grande
   nesta seção — Projetos e Consultoria comunicam por texto (o próprio cartão é a ponte para a
   evidência completa, que já vive nas seções 4 e 5, não precisa ser duplicada aqui).
4. **Maior área/conteúdo útil:** além da área física maior, o cartão Equipamentos tem mais
   elementos de conteúdo (foto + título + texto + link) do que os cartões de Projetos/
   Consultoria (título + 2 linhas + link) — a diferença de densidade reforça a diferença de
   peso comercial, não só a diferença de metragem.

Mobile: Equipamentos primeiro (cartão largo, mas mais baixo que no desktop, mantendo a
fotografia — não é reduzido a texto puro), depois Projetos, depois Consultoria — os dois
últimos com **peso visual comparável entre si** (mesma altura, mesmo tratamento tipográfico),
conforme já exigido pela spec para as seções 4–5 e aplicado aqui por consistência dentro da
própria seção 3. Projetos e Consultoria continuam **clicáveis de forma independente** um do
outro em qualquer largura — nenhum dos dois é pré-requisito de leitura do outro.

**Correção desta revisão — nenhum retrato de responsável nos cartões de Projetos/
Consultoria.** A versão anterior reservava espaço de retrato + nome em ambos os cartões,
inclusive um "a nomear" para Consultoria. Isso tornava a composição da seção 3 dependente de
uma decisão de conteúdo que não existe hoje (ver §10.1). Correção: nenhum cartão desta seção
usa retrato de pessoa — a identificação "quem faz" já tem lugar próprio na seção 7
(Autoridade) e não precisa ser antecipada aqui. Os três cartões comunicam por conteúdo
(título, texto, e no caso de Equipamentos, fotografia do produto/aplicação), não por rosto.

---

## 10. PROJETOS (seção 4) e CONSULTORIA (seção 5) — tratamento diferenciado

### 10.1 Consultoria não depende de responsável público nomeado

`src/data/pillars.ts` nomeia Guilherme Beghini como responsável por "Operação Comercial" —
que, por DEC-004, não é o pilar público Consultoria; `V2_PRODUCT.md` §4 marca o responsável
público de Consultoria como "a nomear na V2 — não usar Guilherme/Operação Comercial sem
confirmação". Hoje não existe decisão confirmada sobre pessoa, foto, nome ou cargo público
para este pilar.

Correção desta revisão: a seção 5 **não estrutura nenhum elemento em torno dessa pessoa**.
Nem retrato, nem nome, nem citação atribuída aparecem — a composição inteira (abertura pelo
sintoma, evidência fotográfica de operação, as 6 frentes de diagnóstico, o CTA) comunica
diagnóstico → análise → decisão → melhoria operacional inteiramente por **conteúdo, processo
e evidência**, não por autoridade pessoal. Isso já era o padrão de conteúdo desta seção na
versão anterior deste documento (as 6 `diagnosisAreas` sempre foram o conteúdo central) — a
correção é retirar a dependência de retrato que existia na seção 3 (ver §9), não redesenhar a
seção 5 em si.

**Classificação:** "responsável público da Consultoria" é `CONTEÚDO OPCIONAL FUTURO — NÃO
BLOQUEADOR`. Se um dia houver um especialista público confirmado (nome, cargo, retrato
autorizado), ele pode ser incorporado como um elemento adicional de credibilidade — por
exemplo, uma citação curta atribuída dentro do painel de texto da seção 5, ou um retrato
pequeno junto ao CTA — **sem alterar a arquitetura**: a seção já comunica sua mensagem central
sem essa pessoa, então adicioná-la depois é reforço, não correção estrutural.

As duas portas têm a mesma prioridade visual entre si, mas precisam comunicar naturezas
diferentes (prompt, itens 9–10). A diferenciação não vem de tamanho — vem de fundo, tipo de
evidência e estrutura de conteúdo:

| | Projetos (seção 4) | Consultoria (seção 5) |
| --- | --- | --- |
| Fundo | claro (`surface`/`canvas`) | escuro (`graphite`) |
| Evidência dominante | documento (planta) + render (estudo 3D), rotulados | fotografia de operação real + lista de frentes de diagnóstico |
| Estrutura | dois painéis sobrepostos/lado a lado (planta + 3D), texto de autoridade técnica ao lado | abertura pelo sintoma reconhecível (herda o approach de `symptomChapters`), depois as 6 frentes de `diagnosisAreas` em lista compacta |
| Tom | "aqui está o desenho que instrui a obra" | "reconheça o problema antes de ouvir a oferta" |
| CTA | Fale com um projetista | Agendar diagnóstico |

Projetos (desktop):

```text
┌────────────────────────────────────────────────────────────────────────┐
│ eyebrow "Projetos"  ·  H2 "Quem projeta, especifica."                   │
├───────────────────────────────┬────────────────────────────────────────┤
│ Texto de autoridade técnica:   │  ┌───────────────┐                    │
│ layout, fluxo, dimensionamento,│  │ Documento       │ ┌───────────────┐│
│ especificação (scope-levels    │  │ técnico         │ │ Estudo 3D      ││
│ nível 02) — bullets curtos      │  │ (planta-        │ │ (render,       ││
│                                 │  │  executiva.jpg) │ │  pré-fabricação)││
│ [Fale com um projetista]       │  └───────────────┘ └───────────────┘│
│ (CTA)                          │  rótulo explícito em ambos: "Documento │
│                                 │  de projeto" / "Estudo 3D — não é obra │
│                                 │  executada" (DEC-008)                  │
└───────────────────────────────┴────────────────────────────────────────┘
```

Consultoria (desktop, fundo escuro) — a progressão diagnóstico → análise → decisão → melhoria
fica explícita em três blocos de conteúdo, nenhum deles dependente de pessoa:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ eyebrow "Consultoria" (amarelo, fundo escuro)                          │
│ H2 — abre pelo sintoma reconhecível, não pela oferta                    │
│  ex.: "A cozinha liga, mas a operação não acompanha."                   │
│  (PROPOSTA DE COPY — GATE 2, approach de symptomChapters)  ← DIAGNÓSTICO│
├───────────────────────────────┬────────────────────────────────────────┤
│ [fotografia real de operação]  │  6 frentes de diagnóstico, lista        │
│  (refrigeradores-verticais.jpg,│  compacta (ícone/número + rótulo, sem  │
│   já usada com esse papel em   │  parágrafo completo — Estrutura e      │
│   scope-levels nível 01)       │  espaço · Fluxo de produção ·          │
│                                 │  Equipamentos · Processos e equipe ·   │
│                                 │  Custo e desperdício · Comercial e     │  ← ANÁLISE
│                                 │  demanda)                              │
├───────────────────────────────┴────────────────────────────────────────┤
│ O que o diagnóstico permite decidir (`diagnosisOutcomes`, 6 itens,      │
│  reduzidos a rótulo curto): Identificar a causa · Estabelecer           │  ← DECISÃO
│  prioridades · Direcionar o investimento · Evitar a compra errada ·      │
│  Reduzir desperdício · Melhorar o resultado da operação                 │  ← MELHORIA
├───────────────────────────────────────────────────────────────────────┤
│                                          [Agendar diagnóstico] (CTA)     │
└───────────────────────────────────────────────────────────────────────┘
```

O terceiro bloco (`diagnosisOutcomes`, `src/data/diagnosis.ts`) é conteúdo real já existente,
não introduzido por esta revisão como texto novo — só passa a ser usado na Home para fechar a
progressão sem precisar de uma pessoa nomeada: sintoma reconhecível (diagnóstico) → seis
frentes analisadas (análise) → seis consequências de método, não promessas de resultado
(decisão/melhoria) → CTA. Em telas mais baixas (ou se o Gate 3 preferir uma composição mais
compacta), os rótulos de `diagnosisOutcomes` podem entrar como uma linha inline curta em vez
de bloco próprio — decisão de densidade para a implementação, não de conteúdo.

Mobile: foto acima do texto; a lista de 6 frentes de diagnóstico e os 6 itens de
`diagnosisOutcomes` mantêm todos os itens visíveis (não cortam para "principais 3") — são
curtos o suficiente para não pesar a rolagem, e cortar a lista tiraria justamente o que
comunica "diagnóstico completo, não venda apressada".

---

## 11. PROVA (seção 6)

Formato: três "raias" de evidência, não uma galeria única — porque os três tipos de prova
(projeto, logo, depoimento) têm pesos de confiança diferentes e não substituem um ao outro.

1. **Raia de projetos** — `leadProject` (cozinha-completa.jpg) + `featuredProjects` (bar-inox,
   forno-combinado, camara-frigorifica): mosaico em colunas (não grid — lição herdada de
   `CLAUDE.md`, proporções variadas não alinham por célula), sem legenda de cliente/prazo,
   com a legenda de escopo já existente em `projects.ts`.
2. **Raia de confiança** — 10 logos `featured: true`, grade estática com quebra de linha
   (evita carrossel automático — sem problema de WCAG 2.2.2 a herdar); se o comercial liberar
   os 5 logos restantes, a grade cresce sem mudar de padrão.
3. **Raia de depoimento** — os 2 depoimentos identificáveis, lado a lado em desktop, empilhados
   em mobile, com nota de que ambos aguardam reconfirmação de autorização antes de publicação
   (não um bloqueio de wireframe, mas o wireframe não pode "esconder" essa pendência).

**Comportamento com conteúdo parcial:** se um dia houver só 1 depoimento ou só 6 logos, a raia
correspondente reduz de largura/quantidade sem quebrar layout — nenhuma raia depende de um
número mínimo fixo de itens para não parecer vazia (grade com `auto-fit`, mosaico que aceita
de 1 a 4 fotos). Métricas (`heroMetrics`) reaparecem aqui como legenda numérica pequena, não
como bloco novo — evita repetir a mesma composição do hero.

CTA: "Ver todos os projetos" (para `/projetos`) — link para `/sobre` como CTA secundário
textual, resolvendo o "órfã de CTA" já registrado na auditoria da V1.

---

## 12. AUTORIDADE CONDENSADA (seção 7)

Uma seção só, não duas (fusão já recomendada pela própria auditoria da V1 e adotada como
arquitetura-base pela spec V2-01, item E.7). Composição: faixa baixa, dois retratos lado a
lado (Leonardo | Guilherme) em desktop, empilhados em mobile — cada um com nome, cargo e 2
bullets (reduzidos dos 4 de `leadershipTeam`, porque aqui é apresentação, o dossiê completo
já existe em `/leonardo-bianchini`). Nenhuma foto de ação (câmara frigorífica, forno
combinado, visita de fábrica) entra nesta seção — são candidatas melhores para dar textura à
seção de Projetos/Consultoria, evitando repetir o mesmo papel (retrato institucional) que já
está bem resolvido pelos dois retratos de `team.ts`.

CTA único: "Conhecer a trajetória" → `/leonardo-bianchini`.

---

## 13. CTA FINAL (seção 8)

Fundo escuro (`graphite`), fechamento comercial com hierarquia, não três botões iguais:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ H2 "Pronto para especificar, projetar ou diagnosticar?"                 │
│ (PROPOSTA DE COPY — GATE 2)                                             │
│                                                                          │
│ [Solicitar orçamento de equipamentos]  ← CTA primário, preenchimento    │
│                                            amarelo, maior                │
│                                                                          │
│ Fale com um projetista ·  Agendar diagnóstico   ← links/CTAs            │
│                                                     secundários, texto   │
│                                                     ou contorno, menores │
│                                                                          │
│ [Formulário curto]  ou  [Conversar pelo WhatsApp]  (canal duplo,        │
│  herdado da V1 — sem backend real, ver `contact-form.tsx`)              │
└────────────────────────────────────────────────────────────────────────┘
```

O parâmetro `?intencao=` já existente em `whatsapp.ts`/`analytics.ts` carrega a origem do
clique (hero, seção 4, seção 5, aqui) — mantém a regra "um CTA, uma função" mesmo quando os
três aparecem juntos nesta seção.

---

## 14. HEADER / NAVEGAÇÃO

Comportamento conceitual (sem CSS/token fino):

- **Sticky em todas as larguras.** Header comprimido depois de rolar (mesma lógica de altura
  responsiva por `clamp()` já validada, sem herdar o valor exato — token próprio da V2).
- **Ordem dos itens reflete a ordem da Home**, mesma regra já validada na V1 (a ordem do menu
  é a ordem da rolagem, não preferência nominal) — aplicada à nova arquitetura de 9 seções:
  Equipamentos (hero/vitrine) → Projetos → Consultoria → Prova → Empresa (autoridade).
- **CTA destacado sempre visível** — "Orçamento" (forma curta de "Solicitar orçamento de
  equipamentos"), preenchimento amarelo, a única cor de preenchimento no header.
- **Mobile:** menu hambúrguer com os mesmos itens (sem lista paralela — lição herdada:
  `mobileNav` é `mainNav`), CTA de orçamento também visível fora do menu (não escondido atrás
  do hambúrguer), WhatsApp como atalho adicional dentro do menu.
- **Logo:** variante clara (`Logo variant="light"`) sempre que o header estiver sobre conteúdo
  escuro no scroll (se o header adotar fundo semitransparente sobre o hero); variante padrão
  sobre fundo claro.

---

## 15. Mobile como composição própria

Princípios aplicados a todos os blocos (não repetidos por seção no wireframe, exceto onde a
diferença é estrutural):

- primeira dobra do hero comunica "vende equipamentos" **por prioridade de conteúdo, não por
  obrigação de encaixe em 100vh** — identificação de Equipamentos, proposta principal e CTA
  primário nunca cedem espaço; chips de categoria podem migrar para logo abaixo do hero em
  larguras mais apertadas (ver §7.2);
- vitrine de categorias é lista simples, sem painel ativo, com as **seis** categorias sempre
  presentes (Preparo/Higienização com placeholder editorial, mesmo tratamento visual dos
  demais cards — §8);
- seção 3 empilha Equipamentos → Projetos → Consultoria, com Projetos/Consultoria de peso
  comparável e sem retrato de pessoa em nenhum dos três cartões (§9);
- seção 5 (Consultoria) não depende de nenhuma pessoa nomeada em nenhuma largura (§10.1);
- nenhuma informação essencial depende de hover (não há hover em touch);
- zero overflow horizontal em 390/360/320.

Ver a tabela completa por viewport (1920×1080 a 320×800) no wireframe, item "Responsividade
detalhada".

---

## 16. Densidade e ritmo (resumo — detalhe por seção no wireframe)

| Seção | Densidade | Altura relativa (desktop) |
| --- | --- | --- |
| 1. Hero | compacta | ~90–100vh |
| 2. Categorias | média | ~70–85vh |
| 3. Do projeto à execução | média | ~55–70vh |
| 4. Projetos | média | ~60–75vh |
| 5. Consultoria | média | ~60–75vh |
| 6. Prova | ampla (várias raias) | ~75–95vh |
| 7. Autoridade | compacta | ~30–40vh |
| 8. CTA final | compacta | ~35–45vh |
| 9. Rodapé | compacta | utilitário, sem meta de vh |

Total aproximado: ~5,3–6,2 telas de altura em desktop — sensivelmente mais curto que as ~14
seções/~26.000px mobile da V1 (spec V2-01, item A.5), consistente com H4 ("menos seções
institucionais mantém a taxa de rolagem até o CTA final").

---

## 17. Motion

Sem curva nova — as três já confirmadas (`precise`/`smooth`/`premium`,
`DESIGN_SYSTEM.md` §6) cobrem tudo que esta Home precisa:

| Onde | Curva | Duração |
| --- | --- | --- |
| Troca de categoria ativa (seção 2) | `precise` | 160–240ms |
| Entrada de conteúdo ao rolar (todas as seções) | `smooth` | 280–450ms |
| Zoom fotográfico discreto em hover (categoria, projeto) | `precise` | até ~1,03×, 240–420ms |
| Sequência de entrada do hero (uma vez, não repete) | `premium` | até ~750ms, faixa editorial — não a mesma sequência de 1.100ms da V1, que era específica da geometria `--u` |
| Preenchimento de botão (hover/focus-visible) | `precise` | 160–240ms, `scaleX/scaleY`, nunca `width` |

`prefers-reduced-motion`: nenhum conteúdo pode ficar invisível, nenhuma máscara permanece
fechada — mesma regra não-negociável da V1, sem exceção nova. Sem parallax, sem bounce, sem
autoplay incontrolável, sem texto palavra a palavra, sem cursor customizado. Nenhuma
biblioteca de animação.

---

## 18. Responsividade — comportamento por faixa

| Faixa | Larguras de referência | Nota principal |
| --- | --- | --- |
| Desktop largo | 1920×1080, 1680×992 | hero e vitrine cabem lado a lado com folga; as seis categorias visíveis na lista sem rolagem interna |
| Desktop | 1440×900, 1366×768 | mesma lógica, sem o vazio vertical de ~290px já medido no hero V1 nessa faixa — o hero V2 não é centralizado por padrão à toa; a altura do painel de imagem se ajusta ao conteúdo do texto, não sobra vazio |
| Tablet | 1024×768, 768×1024 | testar explicitamente o indicador de categoria ativa nesta faixa — a V1 mediu esse elemento caindo 108–490px fora da posição esperada aqui; não assumir que "funciona em mobile e desktop" cobre tablet |
| Mobile | 390×844, 360×800, 320×800 | ver §7.2/§15; identificação de Equipamentos, proposta principal e CTA primário nunca dependem de rolagem — chips de categoria podem ficar logo abaixo do hero nas larguras mais apertadas |

---

## 19. Direção de assets — inventário conceitual

Classificação completa por seção está no wireframe (item "Assets por bloco"). Resumo por uso:

| Uso | Candidatos principais | Observação |
| --- | --- | --- |
| Hero | `hero-industrial-kitchen.png` (preferencial — já calibrada) | `linha-de-coccao.jpg` como alternativa, mas evitar se já usada em Categorias/Consultoria na mesma página |
| Categorias (4 com dataset) | `linha-de-fogoes.jpg` (Cocção), `refrigeradores-verticais.jpg` (Refrigeração), `mobiliario-inox.jpg` (Mobiliário em inox), `linha-de-coccao.jpg` (Exaustão) | 1 foto por categoria, já existente em `equipment-categories.ts` |
| Categorias (2 sem dataset) | Preparo, Higienização — **nenhum asset atribuído** | placeholder editorial (moldura técnica vazia, sem fotografia) até existir dataset/conteúdo próprio — não usar `forno-combinado.jpg` nem qualquer outra foto de outra categoria como substituto |
| Projetos | `planta-executiva.jpg`/`-recorte.jpg` (documento), `projeto-3d.jpg`/`-recorte.jpg` (render), `cozinha-completa.jpg` (fotografia real de apoio) | render e documento **sempre** rotulados (DEC-008) |
| Consultoria | `refrigeradores-verticais.jpg` (já usada com esse papel em `scope-levels.ts`), `camara-frigorifica.jpg` como alternativa | evitar repetir o mesmo arquivo do hero/categorias |
| Prova | `projects.featuredProjects` + `leadProject`, 10 logos `featured: true`, 2 depoimentos | nenhum caso com problema/resultado verificável ainda existe — herdado como gap, não resolvido aqui |
| Autoridade | `team/leonardo-bianchini.png`, `team/foto-recortada-guilherme.png` | retratos institucionais; fotos de ação de Leonardo (câmara frigorífica, forno combinado, linha de produção, visita de fábrica) ficam disponíveis para Projetos/Consultoria, não para esta seção |
| Não recomendado nesta Home | `book/dominando-vendas-equipamentos-cozinha.png` (fora de escopo por decisão congelada), `hero/operacao-comercial.png` (vinculada ao pilar interno, fora do trio público) | — |

---

## 20. O que fica para implementação (fora de escopo deste Gate)

- token de cor/tipografia/espaçamento novo, caso surja necessidade durante a construção do
  componente — entra no Design System antes de virar classe;
- geometria em pixel exato do painel do hero (proporção de imagem, `sizes`, breakpoints
  exatos) — este documento fixa proporção conceitual (~42–46% / ~54–58%), não medição de
  mockup, porque **não existe mockup pixel-a-pixel aprovado para o hero da V2** (diferente do
  hero V1, que tinha `MOCKUP_HERO_APROVADO.png` como especificação visual);
- variante de `Reveal` (`up`/`side`/`settle`/`line`) por seção — decisão de engenharia;
- copy final de todo texto marcado `PROPOSTA DE COPY — GATE 2` neste documento e no
  wireframe;
- slug/URL definitivo de cada CTA (Equipamentos/Projetos/Consultoria) — destino conceitual já
  fixado na spec V2-01;
- instrumentação real (GTM/GA4) — pré-requisito de implementação, não de wireframe.

---

## Status do Gate 2

| # | Critério | Avaliação |
| --- | --- | --- |
| 1 | Equipamentos domina visualmente a primeira dobra? | `ATENDIDO` — hero de uma dobra só, sem carrossel, painel de foto grande, CTA primário único |
| 2 | CTA comercial principal é óbvio? | `ATENDIDO` — único preenchimento amarelo de maior escala em cada seção onde aparece |
| 3 | Categorias funcionam como navegação? | `ATENDIDO` — painel ativo (desktop) + chips no hero + CTA por categoria; **seis** categorias sempre presentes e perceptíveis (Preparo/Higienização com placeholder editorial, não removidas); estados de teclado, sem-JS e reduced-motion definidos explicitamente (§8) |
| 4 | Projetos tem entrada própria? | `ATENDIDO` — seção 4, CTA nomeado, evidência própria (documento + render) |
| 5 | Consultoria tem entrada própria? | `ATENDIDO` — seção 5, CTA nomeado, tom e fundo deliberadamente distintos de Projetos, **sem depender de responsável público não confirmado** (§10.1) |
| 6 | Os três pilares não parecem equivalentes comercialmente? | `ATENDIDO` — cartão assimétrico na seção 3, com a diferença de peso reforçada em quatro dimensões (primeiro ponto de leitura, CTA de maior prioridade, evidência visual mais forte, maior área/conteúdo), não só tamanho físico (§9) |
| 7 | Integração aparece sem ser imposta? | `ATENDIDO` — seção 3 é oferta, não pré-requisito; CTAs diretos existem antes (1–2) e depois (4–5) dela; Projetos e Consultoria continuam clicáveis de forma independente em qualquer largura |
| 8 | A Home evita narrativa longa obrigatória? | `ATENDIDO` — 9 seções, ~5,3–6,2 telas estimadas vs. ~14 seções da V1 |
| 9 | Prova aparece em momento adequado? | `ATENDIDO` — quarta dobra funcional (seção 6), depois das portas, antes do fechamento |
| 10 | Autoridade foi condensada? | `ATENDIDO` — uma seção, dois retratos, sem dossiê duplicado, sem repetir retrato em outras seções |
| 11 | Mobile foi redesenhado de forma própria? | `ATENDIDO` — categoria vira lista simples com as seis categorias acessíveis; hero mobile define prioridade de conteúdo (identificação → proposta → CTA → visual → categorias) em vez de forçar tudo acima de uma dobra artificial (§7.2) |
| 12 | Motion é funcional? | `ATENDIDO` — reaproveita curvas/tempos confirmados, sem recurso ornamental novo; troca de categoria é substituição instantânea de conteúdo, sem necessidade de suprimir animação sob reduced-motion |
| 13 | Assets reais foram considerados? | `ATENDIDO` — inventário por seção, sem novo asset a criar; Preparo/Higienização marcados explicitamente como sem asset atribuído, sem substituição por foto de outra categoria |
| 14 | Nenhum conteúdo empresarial foi inventado? | `ATENDIDO` — todo texto de exemplo marcado `PROPOSTA DE COPY — GATE 2`; nenhuma métrica, cliente ou resultado novo; placeholders de Preparo/Higienização usam só frase estrutural, sem produto, marca ou imagem inventados |
| 15 | A composição pode ser implementada sem redefinir produto durante o código? | `ATENDIDO` — as seis categorias estão previstas na arquitetura (dataset ou placeholder); Consultoria não depende de pessoa não confirmada; estados essenciais da navegação de categorias (ativo, teclado, sem-JS, reduced-motion) estão definidos; mobile não depende de restrição artificial de primeira dobra. Resta uma pendência de **conteúdo**, não de composição: se/quando Preparo e Higienização ganham dataset próprio é decisão do Product Owner (`V2_PRODUCT.md` §6) — o wireframe já absorve os dois estados (com e sem dataset) sem precisar ser redesenhado quando isso for resolvido |

**Gate 2 recomendado para aprovação: SIM.**
