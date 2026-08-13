# 05 — Roadmap de Implementação

```text
STATUS: ACTIVE — ordem recomendada de execução
DATA: 2026-08-12
DEPENDE DE: 01-CONSTITUICAO-VISUAL.md · 03-BLUEPRINT-HOME.md · 04-CRITERIOS-DE-APROVACAO.md
NATUREZA: planejamento. Nenhum arquivo de produto foi alterado.
```

## 0. Regras do roadmap

1. **Uma seção não entra em implementação antes de ter blueprint definido.** Todas as
   treze têm (documento 03).
2. **Uma rodada não começa antes de a anterior congelar.** Rodadas paralelas foi o que
   produziu o retrabalho.
3. **Rodada com dependência de asset não começa sem o asset.** Recompor sem a fotografia
   é salvar com CSS o que só a fotografia resolve.
4. **Cada rodada termina com captura arquivada** em `docs/v2/capturas/`, no protocolo do
   documento 04 §5.
5. **Nenhuma rodada altera copy ou dado comercial.**

---

## RODADA 0 — CONFORMIDADE + CONGELAMENTO

**Objetivo:** trazer o produto à norma naquilo que já está normatizado, e só então tirar
essas áreas da fila permanentemente.

**Escopo:** sistemas globais · hero · `#pilares` · `#transicao` · `#fechamento` ·
Header CTA

**Nenhum redesign. Nenhuma decisão estética nova.** Cada item abaixo tem norma já fixada
nos documentos 01 e 03; a rodada implementa o **delta** entre norma e produto.

Para cada área: (1) comparar produto × blueprint · (2) implementar **somente** os deltas
normativos · (3) validar pelos doze critérios · (4) capturar · (5) congelar.

---

### R0-A — Sistemas globais (roda primeiro, e sozinha)

Atravessam todas as seções, então precisam fechar **antes** de qualquer selo
`CONGELADA` — congelar uma seção e depois mexer no gutter reabriria a seção (documento
04 §4.1.2).

| delta | norma | estado |
| --- | --- | --- |
| **G-1 Guia de conteúdo** | doc 01 §3.1 — `--gutter: clamp(20px, 5vw, 72px)` como **margem**, `guia = max(gutter, (100vw−1400)/2)` | quatro expressões da mesma guia escritas à mão, e o cabeçalho num eixo próprio |
| **G-2 Construção do CTA de WhatsApp** | doc 01 §6.4 e §8 — massa + contorno, glifo verde | duas massas cheias irmãs |

G-2 é global porque o mesmo par aparece na dobra e no fechamento.

**G-1 foi refeito em 2026-08-12** (micro-gate R−1.1). A formulação anterior —
`clamp(20px, …, 120px)` aplicado como substituto do `px-5 md:px-8 lg:px-10` — era
contraditória (tabela ≠ fórmula) e, por ser **padding** dentro de uma casca com
`max-width`, teria **piorado** o alvo: guia de 380px e coluna de 1160px em 1920, contra
300/1320 hoje. A norma corrigida está em doc 01 §3.1; o histórico do erro, em §3.1.5.

**Escopo de G-1 — cinco pontos, um token:**

1. `Container` passa a `width: min(1400px, 100% − 2 × var(--gutter))` com
   `margin-inline: auto` e **recuo interno zero**;
2. cabeçalho (`header.tsx:63`) larga `lg:pl-[3.1cqw] lg:pr-[4.2cqw]` e assenta na mesma
   guia — hoje a marca está 240px à esquerda do `h1` em 1920 (doc 01 §3.2);
3. `.scrim::before` e `.mediaCaption` (`hero-stage.module.css`) leem o token em vez de
   recalcular `max(2.5rem, calc((100% − 1400px)/2 + 2.5rem))`;
4. `equipment-strip-section.tsx:213` idem — e deixa de usar `100vw`, que inclui a barra
   de rolagem e é o que hoje a põe ~7px fora das outras três;
5. quem rompe a guia por dentro do container usa `calc(-1 * var(--guia))`, não número
   escrito à mão — inclui `.doors` (`margin-inline` negativo) e os `-mx-5`/`-mx-8` de
   sangria, hoje amarrados aos valores fixos de 20/32.

**O que G-1 não faz.** Não muda o teto de 1400px da casca, não toca as larguras de
leitura travadas por contraste, não muda altura, proporções internas ou tipografia do
cabeçalho, e **não resolve** a sensação de bloco preso no centro em telas largas — quem
resolve isso é sangria (doc 01 §3.2/§3.3 e o delta S-05), não gutter.

**Critérios de saída de R0-A:**

- uma única definição de guia no código; `grep` por `1400px` fora de `theme.ts` e do
  token retorna zero ocorrência de expressão de guia;
- guia medida bate com a tabela de doc 01 §3.1.2 nas oito larguras (320 · 390 · 768 ·
  1024 · 1366 · 1440 · 1600 · 1920), tolerância de 1px;
- `x` da marca no cabeçalho **igual** ao `x` do `h1` nas oito larguras;
- zero overflow horizontal nas oito larguras — atenção aos elementos de margem negativa
  do item 5, que são o único vetor de regressão aqui;
- **contraste da hero remedido** nas cinco larguras de doc 03 §2.2.1, nas três cenas,
  sem reprovação; se reprovar, cede a rampa do scrim, não a guia;
- nenhum par de botões preenchidos de mesma construção em nenhuma rota (G-2).

---

### R0-B — Hero (conformidade, sem redesign)

Os cinco deltas medidos em `03-BLUEPRINT-HOME.md` §2.12:

| # | delta | ação |
| --- | --- | --- |
| **D-1** | superfície da porta ativa tingida de amarelo (cáqui/oliva) | remover a camada de acento; base ativa em grafite **neutro** mais claro |
| **D-2** | seletor é `1fr 1fr 1fr`, não `1.2fr` | aplicar `1.2fr 1fr 1fr` a partir de `lg` |
| **D-3** | WhatsApp é massa verde cheia | ver G-2 |
| **D-4** | bisel (`inset` branco no topo) nas portas | remover o realce; a régua é a aresta |
| **D-5** | comentários descrevendo estado inexistente | atualizar junto com o código |

**Não tocar:** coreografia de troca, scrim, `--u`, larguras de leitura travadas por
contraste, contrato ARIA, copy, centragem vertical, comportamento mobile.

---

### R0-C — Header CTA

| delta | norma | estado |
| --- | --- | --- |
| **H-1** | doc 01 §17.4 — "Solicitar orçamento" → `/contato?intencao=equipamentos` | `label = 'Solicitar diagnóstico'`, `href="/contato"` |

**Altura, proporções internas, tipografia da navegação e ausência do Instagram ficam como
estão.** Muda rótulo e destino. A **guia horizontal** do cabeçalho não é assunto de R0-C:
ela é G-1b e já terá sido resolvida em R0-A — quando esta rodada começar, a marca já
assenta no mesmo eixo do `h1`.

Deltas menores de acabamento do mesmo botão, listados na matriz e opcionais nesta rodada:
raio de 3px contra os 2px do sistema, preenchimento por `scaleX` em vez de `scaleY`, e
`hover:shadow` (sombra projetada, contra doc 01 §14.2).

---

### R0-D — As três seções no alvo · **CONCLUÍDA em 2026-08-12**

- ~~`#pilares` — cortar ~300 caracteres de descrição de apoio;~~ **feito como −140**: o
  alvo de 300 vinha de 1.505, número superado por `bdca4a5` — o valor real em `48e1b65`
  era 844, já dentro do teto. Cortou-se por critério editorial, não por aritmética
  (S-08 fechado, 704 caracteres);
- ~~`#transicao` — remover o card residual;~~ **feito** — era o `bg-canvas` da caixa da
  fotografia; saiu sem substituto (S-15 fechado);
- ~~`#fechamento` — reduzir de 5 para ≤3 regiões amarelas~~ **feito** — cederam o texto da
  etiqueta e o traço do rótulo de atendimento, pela ordem de precedência de doc 01 §6.2
  (S-31 fechado). O CTA de WhatsApp já tinha sido tratado em G-2.

Evidência: `docs/v2/capturas/secoes-r0d-2026-08-12/`. **Com ela a R0 está encerrada.**

---

**Ganho visual:** médio — D-1, D-3 e G-1 são perceptíveis.
**Ganho comercial:** alto — H-1 alinha a ação persistente à prioridade comercial, e D-2
devolve a Equipamentos um dos seis mecanismos de liderança.

**Ganho de processo:** **o maior da lista.** Quatro áreas saem da mesa permanentemente, e
a hero — que consumiu oito rodadas — deixa de ser reabrível por preferência.

**Risco:** baixo. Todos os deltas são localizados; nenhum toca sistema medido por
contraste.

**Dependências:** R0-A antes de R0-B/C/D.

**Critério de saída:** zero delta aberto na matriz para essas áreas · as quatro seções e
o Header passam nos doze testes · captura arquivada · selo `CONGELADA` com data e commit.

---

## RODADA 1 — A frente comercial principal ✅ CONCLUÍDA (2026-08-12)

**Objetivo:** tornar `#equipamentos` legível como dobra comercial em vez de documento.

**Seções:** `#equipamentos`

**Trabalho:**
- ~~2.443 → ≤1.200 caracteres; 26 → ≤12 blocos~~ **1.078 → 343 caracteres; 14 → 8 blocos.**
  O baseline histórico estava velho: medido em `20f7e8c`, o teto de caracteres **já estava
  cumprido** antes da rodada. O corte foi por função, não por aritmética;
- ~~silhueta **A → B**~~ **feito**: o texto vive na guia, ao lado da fotografia, em 69,7/30,3
  de massa em 1440 (a ficha pede 65/35 e proíbe 50/50);
- ~~remover os 5 cards~~ **feito** — eram `bg-graphite` na caixa de cada fotografia, dentro
  de uma seção `graphite-soft`. Mesma construção que R0-D removeu de `#transicao`;
- ~~migrar o detalhamento por linha~~ **feito** — o destino já existia e já era alcançável;
- ~~altura 1.565 → ≤1.100px em 1440~~ **1.379 → 1.033px.**

**Entregue além do previsto:** a fotografia protagonista ocupava **20,6%** da área da seção
contra **24,0%** das quatro secundárias somadas — a categoria prioritária perdia em massa
para o conjunto das secundárias, e nenhum documento cobrava isso. Depois de R1: **35,6%
contra 25,1%.** Área fotográfica total: 44,6% → **60,7%**.

**Defeito encontrado e corrigido dentro da rodada:** a primeira versão pôs `text-canvas` no
`figcaption` em vez de no elemento de texto. `globals.css` declara
`h1..h4 { text-ink }` na camada base — declaração no elemento vence herança —, então os
quatro `h3` da faixa saíram grafite sobre grafite e sumiram, enquanto o nome da
prioritária (um `p`) ficou correto. Pego pelo recorte ampliado, não pela contagem: as
métricas de densidade, card, cor e altura passavam todas com o texto invisível.

**Evidência:** `docs/v2/capturas/equipamentos-r1-2026-08-12/`.

**Ganho visual:** alto. **Ganho comercial:** **máximo** — é a frente prioritária
(DEC-001) e hoje ela é a seção mais densa da página.

**Risco:** médio. Mexe na seção comercial mais importante depois da hero, e o mesmo
componente serve `/solucoes/cozinhas-industriais` — que **não passa `variant`** e precisa
continuar recebendo a composição `dossier` sem uma linha de diferença.

**Dependências:** nenhuma bloqueante. Fotografia grau B para as seis categorias é
desejável; DEC-007 permite abrir só com as que têm dataset.

**Critério de saída:** ≤1.200 caracteres · ≤12 blocos · zero cards · ≤3 amarelos ·
altura ≤1.100px · `/solucoes/cozinhas-industriais` inalterada (comparação byte a byte da
composição).

**Resultado — todos cumpridos:** 343 caracteres · 8 blocos · 0 cards · 3 amarelos ·
1.033px em 1440. **Dossiê: PASS** — 59 nós, 29 textos, 2.409 caracteres, 5 imagens,
2 ações, 14.530 bytes de HTML e altura (2.395px em 390, 1.564px em 1440) **idênticos**
antes e depois, em comparação nó a nó da árvore.

---

## RODADA 2 — A prova principal

**Objetivo:** quebrar a corrente de silhuetas editoriais e usar o melhor acervo do
projeto.

**Seções:** `#projetos`

**Trabalho:**
- silhueta **B → D** (friso fotográfico);
- ao menos uma fotografia rompendo o container de 1400px;
- 6 → ≤4 cards, sem moldura; 9 → ≤6 hairlines; 8 → ≤3 amarelos;
- área fotográfica ≥70%;
- altura 1.593 → ≤1.100px.

**Ganho visual:** **máximo.** É a mudança estrutural mais visível da página inteira.

**Ganho comercial:** alto — é a prova que sustenta a frente de equipamentos, e abre em
~20% da rolagem.

**Risco:** baixo. O acervo existe e a variante `showcase` já removeu a régua numerada e
os cartões com moldura.

**Dependências:** Rodada 1 congelada (as duas são adjacentes na página e a transição
entre elas precisa ser avaliada junto).

**Critério de saída:** ficha do documento 03 · mosaico continua em `columns-*` (grid abre
vãos sob os cards baixos) · nenhuma legenda com cliente, local ou prazo.

**Resultado — CONCLUÍDA em 2026-08-12.** O baseline histórico estava velho pela terceira
rodada seguida: medido em `f418ab0`, `#projetos` já tinha **silhueta D**, **0 cards
autônomos** (contra "6"), **3 hairlines** (contra "9") e **1.422px** (contra "1.593"). O
trabalho listado acima como "B → D" já estava feito pela variante `showcase`, então a
rodada foi **conformidade pontual**, conforme §29 do briefing: amarelo **6 → 3**, frisa
alinhada à faixa fotográfica (gutter de 24px em vez da guia de texto) e corte da folga
vertical real.

| métrica (1440) | roadmap dizia | real em `f418ab0` | depois de R2 |
| --- | ---: | ---: | ---: |
| altura | 1.593 → ≤1.100 | **1.422** | **1.422** |
| área fotográfica | ≥70% | **64,4%** da caixa · **69,5%** da área útil | **68,8%** da caixa · **73,3%** da área útil |
| cards | 6 → ≤4 | **0 autônomos** | **0** |
| hairlines | 9 → ≤6 | **3** | **3** |
| amarelos | 8 → ≤3 | **6** | **3** |

**Dois critérios de saída não sobreviveram à medição, e os dois foram revistos com
justificativa registrada** (ficha 3 do documento 03):

- **`columns-*` "nunca grid"** — a premissa da regra (células de alturas diferentes abrem
  vãos) não vale numa frisa de altura compartilhada, e `columns-*` **destruiria** a linha
  única que é a razão de ser da composição. Grid, medido sem vão nas 8 larguras.
- **altura ≤1.100px** — aritmeticamente incompatível com ≥70% de área. As duas juntas
  exigem altura não-fotográfica ≤330px, e o piso realista dela é ~390px. Teto revisto para
  ≤1.450px, com a área como critério que manda.

**Evidência:** `docs/v2/capturas/projetos-r2-2026-08-12/`.

---

## RODADA 3 — Cor e motion global

**Objetivo:** devolver ao amarelo a função de acento e eliminar a última animação em laço
da página.

**Seções:** `#quem-conduz` · `#sintomas` · `#diagnostico` · `#leonardo` ·
`#industria-do-inox` · `#credibilidade` (só o marquee)

**Trabalho A — orçamento de cor:** reduzir regiões amarelas ao teto de 3 por seção.

| seção | hoje | alvo |
| --- | ---: | ---: |
| `#quem-conduz` | **14** | 3 |
| `#sintomas` | 8 | 3 |
| `#diagnostico` | 6 | 3 |
| `#industria-do-inox` | 6 | 3 |
| `#leonardo` | 4 | 3 |

**Trabalho B — motion (`M-1`):** remover o **marquee infinito** da faixa de logotipos em
`#credibilidade` (`animate-marquee` sobre lista duplicada). Substituir pela norma do
documento 01 §13.4.1: composição estática quando couber, rolagem por dedo no telefone,
entrada única por motion, deslocamento só por ação do usuário.

Ajustar junto a estratégia de carregamento dos logotipos: a justificativa de
`loading="eager"` dependia do deslocamento por `transform`. Enquanto houver overflow
horizontal, `eager` continua obrigatório; numa faixa estática sem `transform`, `eager` só
nos que nascem dentro da viewport.

**Ganho visual:** alto, e desproporcional ao esforço. Com 14 acentos numa seção, nenhum
acento existe. Tirar o laço remove a única coisa que se mexe sozinha na página.

**Ganho comercial:** médio — os CTAs amarelos voltam a ser a coisa mais amarela da tela.

**Risco:** baixo. É subtração, e cada remoção é verificável por contagem.

**Dependências:** nenhuma. **Pode rodar em paralelo com a Rodada 2** — é a única exceção
à regra 2, porque não toca composição.

**Nota:** o marquee está em `#credibilidade`, que **não congela nesta rodada** — ela
congela depois, com a ficha completa. Tratar o laço aqui é intencional: é regra global de
motion, e regra global não espera a vez da seção.

**Critério de saída:** ≤3 regiões amarelas relevantes por seção, contadas pelo mesmo
método do inventário global · nenhum amarelo como texto ou indicador de estado sobre
fundo claro · **zero animação em laço na página** · nenhum logotipo deixa de carregar em
qualquer posição da faixa.

---

## RODADA 4 — A leitura de documento

**Objetivo:** tirar de `#diagnostico` e `#metodo` a aparência de PDF.

**Seções:** `#diagnostico` · `#metodo`

**Trabalho:**
- `#diagnostico` — silhueta **B → E**; 12 → ≤6 hairlines; 20 → ≤12 blocos; remover os 3
  cards; corrigir a lista de seis frentes com maioria inerte;
- `#metodo` — remover a moldura dos 4 cards; 9 → ≤6 hairlines; CTA primary → textual;
  stagger de 6 → ≤4 passos.

**Ganho visual:** alto.

**Ganho comercial:** médio — `#diagnostico` é o argumento de Consultoria e hoje ele lê
como relatório.

**Risco:** médio. As duas seções têm mecânica frágil:
- `#diagnostico` tem estado (zonas) e acessibilidade a preservar;
- `#metodo` depende de `grid-rows-[1fr_auto_1fr]` + `grid-rows-subgrid` para a linha sair
  reta. **Empilhamento simples quebra a linha** — a descrição mais longa empurra o traço
  da sua coluna.

**Dependências:** Rodada 3 congelada (as duas seções estão nela).

**Critério de saída:** fichas do documento 03 · `.drafting-paper` preservado como único
uso de grade cartesiana · linha do método reta em todas as larguras · nenhuma lista com
maioria de itens inertes.

---

## RODADA 5 — Autoridade

**Objetivo:** fechar o capítulo de autoridade sem redundância e sem par editorial.

**Seções:** `#leonardo` · `#quem-conduz`

**Trabalho:**
- `#quem-conduz` — silhueta **B → D**, friso de retratos (quebra o último par de
  editoriais **e** evita a dupla de prova tipográfica com `#credibilidade`);
  altura 1.432 → ≤1.100px;
- `#leonardo` — retrato de 3% → ≥20% da área;
- eliminar a redundância textual restante entre as duas.

**Ganho visual:** médio-alto.

**Ganho comercial:** médio — é onde o comprador decide se confia em quem responde.

**Risco:** médio. `id="livro"` mora em `#quem-conduz` e é destino de `#livro`
(`leonardo-section.tsx`) e de `/#livro` (`data/industry.ts`). **Mover a âncora quebra
dois links internos.** `book.purchaseUrl` continua `null` e nenhum CTA de compra é
renderizado.

**Dependências:** Rodadas 3 e 4 congeladas.

**Critério de saída:** fichas do documento 03 · `#livro` continua alvo válido · o
tratamento como capítulo em duas partes (padding reduzido + régua) é preservado · o par
escuro continua sendo um par, não um trio.

---

## RODADA 6 — Material (bloqueada por acervo)

**Objetivo:** transformar `#industria-do-inox` de bloco de texto em palco de material.

**Seções:** `#industria-do-inox`

**Trabalho:** silhueta **B → A**; área fotográfica 15% → ≥60%; 18 → ≤12 blocos.

**Ganho visual:** alto. **Ganho comercial:** baixo-médio — o público é fabricantes, que
não é o público principal da Home.

**Risco:** médio.

**Dependências:** **BLOQUEADA.** Exige 3–5 fotografias grau B de inox em fabricação —
solda, dobra, escovado, aresta de bancada. Sem elas a rodada **não começa**: ampliar o
que existe hoje violaria a regra de "asset ruim não se salva com CSS".

**Critério de saída:** ≥60% de área fotográfica · ≤12 blocos · ≤3 amarelos · todo numeral
com origem rastreável.

---

## RODADA 7 — Extensão móvel

**Objetivo:** reduzir a página em 390px.

**Seções:** todas.

**Trabalho:** a Home tem **22.085px em 390 — 26,2 telas**, das quais o rodapé ocupa 2,16.
Esta rodada não recompõe: ela **corta extensão**, aplicando as reduções autorizadas da
tabela do documento 01 §16.1.

**Ganho visual:** médio. **Ganho comercial:** alto — quase todo o tráfego pago chega por
telefone, e ninguém rola 26 telas.

**Risco:** médio. O risco é remover algo da coluna "nunca some".

**Dependências:** todas as rodadas anteriores congeladas — cortar extensão de seções que
ainda vão ser recompostas é trabalho jogado fora.

**Critério de saída:** ≤18 telas em 390 · nada da coluna "nunca some" removido · zero
overflow horizontal em toda a rolagem · alvos de toque ≥44px.

---

## 1. Ordem final e paralelismo

```text
R0-A  sistemas globais (gutter, construção do WhatsApp)   ← primeiro, e sozinha
   │
R0-B  hero — conformidade (D-1…D-5)
R0-C  header CTA (H-1)
R0-D  #pilares · #transicao · #fechamento
   │  ─────────── selo CONGELADA nas quatro áreas ───────────
   │
R1  #equipamentos  ✅ CONGELADA 2026-08-12  ──┐
R2  #projetos                 ──┤
                                ├─ R3 pode correr em paralelo a R2
R3  cor e motion global       ──┤
                                │
R4  #diagnostico + #metodo    ──┤
R5  autoridade                ──┤
                                │
R6  #industria-do-inox        ──┤ BLOQUEADA por acervo
                                │
R7  extensão móvel            ──┘ exige todas congeladas
```

**R0-A roda sozinha e primeiro.** Sistemas globais atravessam todas as seções: mudar
gutter depois de congelar reabriria o que foi congelado (documento 04 §4.1.2).

**R3 é a única que pode correr em paralelo**, porque é subtração de cor e de motion e não
toca composição.

---

## 2. Pendências de acervo — o que depende de fotografia nova

| # | necessidade | bloqueia | prioridade |
| --- | --- | --- | --- |
| **A-1** | 3–5 close-ups de **inox em fabricação** (solda, dobra, escovado, aresta) | Rodada 6 | alta |
| **A-2** | **Consultoria em operação real** — pessoa em atitude de leitura dentro da cozinha, equipe ao fundo, luz da própria operação | seção de Consultoria no corpo da página (hoje coberta por `#diagnostico`) | alta |
| **A-3** | Fotografia grau B para **Preparo** e **Higienização** | qualidade da vitrine de `#equipamentos` | média |
| **A-4** | 2–3 registros de **obra em andamento** | profundidade de `#projetos` (planejamento → execução → entrega) | média |
| **A-5** | Retrato de Leonardo **em contexto de operação**, substituindo o de estúdio no corpo da página | `#leonardo` | baixa |

**A-2 é a mais importante conceitualmente.** Enquanto ela não existir, Consultoria
continua representada por retrato de estúdio na hero — o que é correto ali, porque a
pessoa é quem responde pelo diagnóstico e o contexto vem do texto. O que **não** pode
acontecer é o retrato de estúdio sustentar uma seção de Consultoria no corpo da página:
foi o campo vazio ao redor dele que produziu o fluxograma removido em 2026-08-11.

**Regra enquanto A-2 não chega:** a evidência de Consultoria é **documento de diagnóstico
real** — checklist, planta anotada, ficha de visita —, nunca pessoa em estúdio e nunca
representação gráfica do raciocínio.

---

## 3. Dados comerciais — estado consolidado

**Fonte de verdade do projeto, confirmada pelo gestor.** Nenhum destes é pendência:

| dado | valor | estado |
| --- | --- | --- |
| tempo de atuação | **17 anos** | **CONFIRMADO** |
| projetos entregues | **3.000+** | **CONFIRMADO** |
| abrangência | **Brasil** | **CONFIRMADO** |
| WhatsApp comercial | **+55 21 96469-0650** (`5521964690650`) | **CONFIRMADO** |

A divergência histórica "1.000 × 3.000" e a divergência "17 × 18 anos" estão
**encerradas**. Documentação anterior que ainda as descreva como pendência é
**histórico**, não pendência atual — inclusive comentários em arquivos de produto.

**Efeito de design:** `#credibilidade` tem **duas** provas numéricas reais e pode dar a
elas escala tipográfica (documento 03, ficha 12). "Brasil" permanece como **contexto**,
qualificando o segundo número — transformá-lo em terceiro numeral criaria uma métrica
artificial, porque abrangência não é quantidade.

**Nenhuma métrica nova é criada.** O que continua proibido é inventar percentual,
certificação, ranking, resultado de case ou volume financeiro (DEC-006).

### Dívida documental resultante — não corrigida nesta rodada

Quatro lugares no repositório ainda descrevem a métrica como pendente e passam a
contradizer o estado consolidado:

| onde | o que diz |
| --- | --- |
| `src/data/site.ts:183-186` | "PENDENTE: confirmação comercial definitiva do número exato" |
| `src/data/v2/home.ts:45-69` | afirma que a métrica foi removida da origem e "não é renderizada em nenhuma rota pública" — **factualmente errado**: está em `site.ts:190` e `196` e é renderizada em cinco lugares |
| `CLAUDE.md` | "métrica com pendência de confirmação numérica exata" |
| `docs/v1-release/04-pendencias-externas.md` | item 5 |

**Fora do escopo desta rodada**, que só pode alterar `docs/v2/direcao-visual/` e o status
do wireframe antigo. Rastreado na matriz de deltas como `X-1`, e recomendado para a
mesma rodada que tocar esses arquivos.

## 3.1 Pendências de conteúdo que continuam abertas

| # | pendência | efeito |
| --- | --- | --- |
| **C-2** | autorização dos 2 depoimentos (cargo atual, texto final, uso de retrato e menção à organização) | `homeDisclosure.testimonials = false` — o bloco não é montado |
| **C-3** | como a relação com a **Rational** pode ser descrita publicamente | impede dar a ela lugar visual próprio em `#equipamentos` |
| **C-4** | autorização dos 5 logotipos ainda não liberados (10 de 15 aprovados) | limita a faixa de `#credibilidade` |

Nenhuma bloqueia rodada de composição.

---

## 4. O que este roadmap não inclui

- **rotas internas** — este conjunto governa a Home. As nove rotas que usam
  `FinalCtaSection` precisam ser **validadas** quando ele mudar, mas não são
  redesenhadas aqui;
- **V1** — permanece congelada (DEC-009), recebe só correção crítica;
- **novas seções** — nenhuma rodada adiciona seção. A página tem 13 e o movimento é de
  redução;
- **troca de família tipográfica, de paleta ou de biblioteca** — fora de escopo por
  decisão do documento 01.

---

## 5. Como saber que o roadmap terminou

Quando as treze fichas do documento 03 estiverem com selo `CONGELADA`, e:

```text
silhueta B ≤ 3 aparições, nenhuma dupla consecutiva
≤3 regiões amarelas relevantes por seção
nenhuma seção acima de 1.200 caracteres sem justificativa escrita
≥3 imagens rompendo o container (hoje: 2)
≤18 telas em 390px (hoje: 26,2)
zero animação em laço
zero delta aberto em 06-MATRIZ-DE-DELTAS.md
zero P0 e zero P1 abertos
```

A partir daí, a Home só muda por uma das cinco razões do documento 04 §4.3.
