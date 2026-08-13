# R1 — `#equipamentos`

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `20f7e8c`
**Escopo:** recomposição da frente comercial principal (DEC-001) para a silhueta **B —
editorial assimétrica**, e congelamento.

Deltas fechados: **S-01** (densidade), **S-02** (cards), **S-03** (altura), **S-04**
(silhueta) e **S-04b** (protagonismo da fotografia, aberto e fechado nesta rodada).

## Metodologia

Build de produção (`npm run build` + `next start`), Chrome 151 headless,
`deviceScaleFactor: 1`, `--hide-scrollbars`. Antes de cada leitura todos os `.reveal`
recebem `is-visible` e as imagens `loading="lazy"` são promovidas a `eager` — protocolo do
documento 04 §5. Oito viewports: 320 · 390 · 768 · 1024 · 1366 · 1440 · 1600 · 1920.

| arquivo | o que faz |
| --- | --- |
| `medicoes/measure-r1.mjs` | inventário da seção (densidade, cards por construção, hairlines, amarelos, imagens, sangria, massa, ações), varredura de overflow, console/HTTP/imagens/âncoras, assinatura estrutural do dossiê e as capturas |
| `medicoes/comparar.mjs` | antes × depois a partir dos dois `medicao.json`, incluindo o diff nó a nó da rota interna |
| `medicoes/assets.mjs` | dimensão real e peso de cada fotografia candidata, lida do cabeçalho do arquivo |
| `medicoes/contraste-nomes.mjs` | contraste do nome da categoria sobre a fotografia, recompondo imagem + gradiente em canvas |
| `medicoes/zoom-nomes.mjs` | recorte ampliado 4× de cada nome, direto do compositor |
| `medicoes/miniatura.mjs` | teste da miniatura (§29) — a seção reduzida a 200px pelo compositor |
| `medicoes/a11y-e-regressao.mjs` | foco, toque, `prefers-reduced-motion`, semântica e regression check dos congelados |
| `medicoes/antes/` · `medicoes/depois/` | JSON cru e capturas, mesma viewport, mesmo scroll, mesmo DPR |

O contador de densidade é o mesmo de R0-D — **`p` e `h1..h6` visíveis** —, validado
naquela rodada contra os números publicados pela auditoria de 2026-08-10.

## O baseline histórico estava velho — de novo

Os números que a ficha 2 e a matriz cobravam (**2.443 caracteres · 26 blocos · 1.565px**)
são do inventário de 2026-08-10, HEAD `1f96a1f`. A seção foi recomposta no mesmo dia e
corrigida em seguida. Medido em `20f7e8c`, o ponto de partida real era:

| métrica | histórico | **real em `20f7e8c`** | teto |
| --- | ---: | ---: | ---: |
| caracteres | 2.443 | **1.078** | 1.200 |
| blocos | 26 | **14** | 12 |
| cards | 5 | **5** | 0 |
| amarelos | "3, está correto" | **5** | 3 |
| altura em 1440 | 1.565px | **1.379px** | 1.100px |

Duas consequências. **O teto de caracteres já estava cumprido antes da rodada** — o corte
foi feito por função (§8 do briefing), não para atingir um delta aritmético. E **a ficha
errava para os dois lados**: subestimava o amarelo (5, não 3) enquanto superestimava o
texto. É o mesmo padrão que R0-D encontrou em S-08, e a razão de o briefing mandar remedir.

## O defeito que os números não pegavam

A conta que reprovava a seção não estava em documento nenhum:

> a fotografia da **categoria prioritária** ocupava **20,6%** da área da seção, contra
> **24,0%** das quatro secundárias somadas.

Juntas, as secundárias eram maiores que a protagonista. Uma vitrine em que a categoria
prioritária perde em massa para o conjunto do apoio não tem protagonista — tem uma grade
com uma célula grande. Era isso que produzia a leitura de catálogo, não a densidade de
texto. Registrado como **S-04b** para que a mesma conta seja feita em R2 e R6.

## Resultado

| métrica | antes (`20f7e8c`) | depois | teto |
| --- | ---: | ---: | ---: |
| caracteres | 1.078 | **343** | 1.200 |
| blocos de texto | 14 | **8** | 12 |
| cards | 5 | **0** | 0 |
| regiões amarelas | 5 | **3** | 3 |
| hairlines | 2 | **1** | — |
| altura em 1440 | 1.379px | **1.033px** | 1.100px |
| altura em 390 | 2.538px | **1.912px** | — |
| área fotográfica em 1440 | 44,6% | **60,7%** | — |
| protagonista × faixa | 20,6% × 24,0% | **35,6% × 25,1%** | protagonista domina |
| massa foto/texto em 1440 | 61,2% | **69,7%** | nunca 50/50 |
| CTA PRIMARY | 1 | **1** | 1 |

Nas oito larguras: `overflow-x` = 0 · erros de console = 0 · HTTP ≥400 = 0 · imagens
quebradas = 0 · `href` vazio = 0 · âncora quebrada = 0.

### Altura por largura

| largura | antes | depois | Δ |
| ---: | ---: | ---: | ---: |
| 320 | 2.451 | **1.700** | −751 |
| 390 | 2.538 | **1.912** | −626 |
| 768 | 1.882 | **1.496** | −386 |
| 1024 | 1.626 | **798** | −828 |
| 1366 | 1.331 | **988** | −343 |
| 1440 | 1.379 | **1.033** | −346 |
| 1600 | 1.467 | **1.120** | −347 |
| 1920 | 1.571 | **1.252** | −319 |

O teto de 1.100px é da ficha e vale **em 1440**. Acima disso a seção cresce porque a
fotografia é proporcional — e a janela cresce junto: a seção mede 1,15 tela em 1440 e 1,16
em 1920. Não há altura artificial: `vazioBase` é 64px (o `padding-bottom` da seção) em
todas as larguras de desktop, antes e depois.

## O que saiu do texto, e para onde

Nada foi apagado do produto. Cada trecho removido foi conferido no destino **antes** do
corte:

| removido | caracteres | onde já estava publicado |
| --- | ---: | --- |
| 4 parágrafos de benefício da faixa | **441** | `/solucoes/cozinhas-industriais` (dossiê) e `/linhas-de-produtos`, com âncora por categoria |
| benefício da Cocção | **108** | idem — e ele **repetia o próprio H2** ("pelo volume real, não pela ficha técnica") |
| etiqueta "Categoria prioritária" | **21** | rótulo de composição, sem destino: a hierarquia passou a vir da escala |
| nota de fecho — cláusula "avulso × cozinha inteira" | **77** | `faq.ts` (`kitchensFaq[0]`), FAQ de `/solucoes/cozinhas-industriais` e **esta mesma Home**, em `#credibilidade` ("do equipamento avulso à cozinha inteira") |
| nota de fecho — ponteiro de detalhamento por linha | **89** | `/linhas-de-produtos` e `/linhas-de-produtos/forno-combinado-rational`, alcançáveis pelo rodapé |
| **total removido** | **736** | |

Fecha com a medição: 1.078 − 736 = 342, e a linha de capacidade ganhou **1 caractere** — o
ponto final que a oração não tinha quando era subordinada. **343 medidos.**

**Nenhum bloco novo foi criado e nenhuma afirmação nova entrou.** A linha de capacidade são
os 52 caracteres que já existiam dentro da nota de 219, promovidos a bloco próprio e
fechados com ponto. Os mesmos quatro verbos já são publicados por `src/data/pillars.ts`
nesta mesma Home ("Especificação dimensionada pelo volume real de produção, fornecimento,
instalação e comissionamento") e por `faq.ts`, `kitchensFaq[2]`.

**Preservado:** o enunciado, o argumento de dimensionamento, os cinco nomes de categoria,
o CTA, e a transcrição de `faq.ts` como **linha de capacidade** — "Especificamos,
fornecemos, instalamos e comissionamos." —, que a ficha 2 manda manter como origem do
enunciado. Ela subiu do rodapé da seção para a coluna de texto, logo acima da ação que
habilita.

## Os cinco cards eram `bg-graphite`

Nenhum tinha borda, raio ou sombra. Os cinco eram a caixa da fotografia carregando
`bg-graphite` (#101010) dentro de uma seção `graphite-soft` (#1A1A1A) — superfície própria
distinta da superfície da seção **é** a construção de card no sistema (doc 01 §7.3).

Mesmo diagnóstico e mesma correção que R0-D aplicou em `#transicao`. Como toda imagem é
`fill` + `object-cover`, o fundo nunca aparecia depois do carregamento: **saiu a caixa, não
a composição.**

O inventário bruto ainda acusa **1 card em 320**: é o próprio CTA, que naquela largura
quebra em duas linhas e passa de 60px de altura, entrando no filtro do detector. Botão
preenchido é **ação**, não caixa de conteúdo — `comparar.mjs` imprime as duas contagens
lado a lado, e a normativa (excluindo `a`/`button`) é **5 → 0** em todas as oito larguras.

## Os dois amarelos que caíram não foram uma rodada de cor

O briefing proíbe rodada de cor aqui. Nenhuma opacidade foi reduzida e nenhum amarelo foi
trocado: as duas regiões excedentes estavam **presas ao conteúdo que a composição removeu**
— a etiqueta "Categoria prioritária" (texto amarelo) e o sublinhado amarelo do link da nota
de fecho. Saíram junto, como consequência.

| # | região | classe | antes | depois |
| --- | --- | --- | :---: | :---: |
| 1 | texto da etiqueta "EQUIPAMENTOS E TECNOLOGIA" | **E · TEXTO** | ✅ | ✅ |
| 2 | traço da etiqueta, 28 × 2 (56px²) | **D · DECORAÇÃO** | ✅ | ✅ |
| 3 | preenchimento do CTA primário | **B · AÇÃO** | ✅ | ✅ |
| 4 | texto "CATEGORIA PRIORITÁRIA" | **E · TEXTO** | ✅ | **saiu com o bloco** |
| 5 | sublinhado de "forno combinado Rational" | **D · DECORAÇÃO** | ✅ | **saiu com a nota** |

## Categorias: verdade empresarial × dataset × fotografia

| frente | dataset | fotografia | na vitrine |
| --- | :---: | :---: | :---: |
| Cocção | ✅ | ✅ `linha-de-fogoes.jpg` | **protagonista** |
| Refrigeração | ✅ | ✅ `refrigeradores-verticais.jpg` | faixa |
| Mobiliário em inox | ✅ | ✅ `mobiliario-inox.jpg` | faixa |
| Exaustão e ventilação | ✅ | ✅ `linha-de-coccao.jpg` | faixa |
| Tecnologia de cocção | ✅ | ✅ `forno-combinado.jpg` | faixa |
| **Preparo** | ❌ | ❌ | **não entra** |
| **Higienização** | ❌ | ❌ | **não entra** |

As cinco publicadas são exatamente o que a ficha 2 especifica ("cinco fotografias de
categoria" + "as outras quatro frentes, como fotografias nomeadas"). **Preparo e
Higienização não foram apagadas de nada**: continuam como frentes empresariais em
`src/data/v2/categories.ts` e em DEC-007, que é explícito em que ausência de dataset não
invalida categoria documentada. Nenhuma fotografia foi inventada, emprestada de outra
categoria ou substituída por ícone. Pendência de acervo **A-3** segue aberta.

`equipment-categories.ts` **não foi tocado** — as duas composições leem o mesmo dataset.

## Fotografia: nenhum asset trocado

§26 exige defeito objetivo para substituir. Não houve.

| categoria | arquivo | resolução | render máx. | fator | grau |
| --- | --- | ---: | ---: | ---: | :---: |
| Cocção | `projects/linha-de-fogoes.jpg` | 1024 × 768 | 920 (1440) · 1.177 (1920) | 0,90× · 1,15× | **B** |
| Refrigeração | `projects/refrigeradores-verticais.jpg` | 940 × 689 | 415 (1920) | 0,44× | **B** |
| Mobiliário em inox | `projects/mobiliario-inox.jpg` | 1170 × 964 | 415 (1920) | 0,35× | **B** |
| Exaustão e ventilação | `hero/linha-de-coccao.jpg` | 787 × 1400 | 415 (1920) | 0,53× | **B** |
| Tecnologia de cocção | `projects/forno-combinado.jpg` | 1109 × 1400 | 415 (1920) | 0,37× | **B** |

Nenhum grau C ou D. No viewport de referência (1440) **nenhum é ampliado**; a única
ampliação é a protagonista em 1920, a 1,15× — longe do borrão que reprovou `ca7a1c3`, que
pedia 1.120px de largura num recorte de 2,5:1.

O único candidato de resolução superior para Cocção seria `hero/equipamento-hero.png`
(1672 × 941), que é **a fotografia da própria hero**: reutilizá-la na seção seguinte
produziria exatamente a leitura de "Hero parte 2" que o briefing §27 proíbe. Descartado.

### Por que a faixa é 5:4, e não 4:3 nem 1:1

Duas das quatro provas são verticais (0,56 e 0,79). Em **4:3** a `linha-de-coccao` mostraria
42% da altura original — recorte agressivo para uma coifa. Em **5:4** mostra 53%, e o
`forno-combinado` 75%. Em **1:1** os recortes ficariam ótimos, mas a faixa passaria de 274
para 342px em 1440 e sozinha recolocaria a seção acima do teto de altura.

## O defeito que só o recorte ampliado pegou

A primeira versão da composição passava **todos** os gates numéricos — 343 caracteres, 8
blocos, 0 cards, 3 amarelos, 1.033px, zero overflow — com os quatro nomes da faixa
**invisíveis**.

A causa: `text-canvas` estava no `figcaption`, e `globals.css:215` declara
`h1..h4 { @apply font-sans font-bold text-ink }` na camada base. Declaração no elemento
vence herança, então os quatro `h3` saíram grafite sobre grafite. O nome da protagonista,
que é um `p`, herdava normalmente e estava correto — o que tornava o defeito ainda menos
visível numa leitura rápida.

Corrigido pondo cor e escala **no próprio elemento de texto**, que é como a versão anterior
já fazia. Duas lições registradas no componente:

- **nenhuma contagem substitui olhar o pixel.** Densidade, card, cor, altura e overflow
  estavam todos conformes com o texto invisível;
- a sonda de contraste também errou antes de acertar: o Chromium **omite** a posição dos
  stops default (`0%` e `100%`), e casar só `cor + posição` reconstruía o gradiente a partir
  de 38% — reprovando um contraste que existe na tela. Corrigido em
  `medicoes/contraste-nomes.mjs`.

Contraste medido depois da correção, recompondo fotografia + gradiente: **8,3 a 14,8:1** de
média sobre a caixa do nome, nas quatro larguras.

## Dossiê — `/solucoes/cozinhas-industriais`

A rota interna **não passa `variant`** e continua recebendo `dossier`. Comparação nó a nó
da árvore (`tag|class` na ordem do documento), em 390 e 1440:

| | 390 | 1440 |
| --- | :---: | :---: |
| nós na árvore | 59 → 59 | 59 → 59 |
| nós diferentes | **0** | **0** |
| textos | 29 → 29 | 29 → 29 |
| caracteres | 2.409 → 2.409 | 2.409 → 2.409 |
| imagens | 5 → 5 | 5 → 5 |
| ações | 2 → 2 | 2 → 2 |
| altura | 2.395 → 2.395px | 1.564 → 1.564px |
| bytes de HTML | 14.530 → 14.530 | 14.530 → 14.530 |

**DOSSIER REGRESSION CHECK: PASS** — zero diferença.

A separação foi reforçada na arquitetura: `note` (a linha de fecho do dossiê) **deixou de
atravessar** para a vitrine, que passou a receber `capability`. Um mesmo nome de prop
servindo dois papéis era o que tornava difícil enxergar que as duas composições não
compartilham mais esse texto.

## Acessibilidade

| teste | resultado |
| --- | --- |
| foco visível | **1/1** alvo (o CTA) dispara sinal computado — `outline: 2px` |
| alvo de toque em 390 | CTA 348,4 × 48 — **acima de 44px** |
| `prefers-reduced-motion: reduce` | **0** elementos invisíveis ou com máscara presa; 5/5 imagens carregadas; 8/8 blocos de texto visíveis; 0 erro de console |
| semântica | `aria-labelledby` resolve; H2 + 4 H3; 5 `figure`/`figcaption`; **0 imagens sem `alt`** |
| tabuláveis | 1, visível — a seção não insere alvo focável invisível |

## Regression check dos congelados

Não reauditado — conferidas as invariantes que R0 registrou ao selá-los.

| congelado | verificação | resultado |
| --- | --- | --- |
| **Header** | rótulo, destino, raio, sombra, altura | `SOLICITAR ORÇAMENTO` → `/contato?intencao=equipamentos`, raio 2px, `box-shadow: none`, 80px — **PASS** |
| **G-1b** | marca do cabeçalho no eixo do `h1` | `x = 72` nos dois — **PASS** |
| **Hero** | `h1`, as três portas, altura da dobra | íntegros, dobra 900px — **PASS** |
| **Button system (G-6)** | 41 botões na Home | **0 fora da norma** — **PASS** |
| **`#pilares`** | selo R0-D: 704 caracteres / 11 blocos | 704 / 11 — **PASS** |
| **`#transicao`** | selo R0-D: 326 / 3 | 326 / 3 — **PASS** |
| **`#fechamento`** | selo R0-D: 182 / 2, 3 amarelos | 182 / 2, 3 — **PASS** |

## Correção documental de `#fechamento` (briefing §40)

A ficha 13 descrevia **PRIMARY + WhatsApp + 2 SECONDARY nomeados**. O produto congelado
monta exatamente dois `LinkButton` (`variant="primary"` e `variant="whatsapp-light"`), e as
três necessidades são nomeadas **na copy**. A divergência era da ficha.

Aplicada a decisão da direção: **alinhar a ficha ao produto**, em HIERARQUIA, CTA e
ELEMENTOS A PRESERVAR. **Nenhum arquivo de produto de `#fechamento` foi tocado.**

## Capturas

`medicoes/antes/shots/` e `medicoes/depois/shots/` — mesmos nomes, mesma viewport, mesmo
scroll, mesmo DPR.

- **seção inteira:** 320 · 390 · 768 · 1024 · 1440 · 1920
- **momentos (1440, 1920, 390):** entrando · centro · saindo
- **passagens:** `hero → equipamentos` e `equipamentos → projetos`, nas três larguras
- **miniatura de inspeção:** `1440-miniatura-200px.png`
- **dossiê:** `390-` e `1440-dossier-cozinhas-industriais.png`
- **recortes 4× dos nomes:** `medicoes/depois/zoom/`

### Nota sobre a captura de seção inteira

A primeira dobra é dimensionada em `svh`, então crescer a janela para caber a seção
**cresce a hero junto** e empurra `#equipamentos` para baixo. Medir o `y` na janela de 900
e rolar até lá com a janela já alta corta a faixa fora do quadro — foi o que aconteceu na
primeira passada. `measure-r1.mjs` mede duas vezes: a primeira só para saber que altura
pedir, a segunda para saber onde rolar.

**As capturas "antes" foram refeitas depois dessa correção**, com o código-fonte revertido
para `20f7e8c` (`git stash`), build de produção próprio e o mesmo harness — para que a
comparação do briefing §36 seja no mesmo viewport, mesmo scroll, mesmo DPR e mesmo tipo de
build. A remedição reproduziu **exatamente** os mesmos números da primeira leitura
(1.078c / 14b / 5 cards / 5 amarelos / 1.379px em 1440; dossiê 2.409c / 59 nós / 14.530
bytes), o que valida o baseline por reprodução independente.

### O antes × depois mais direto é a miniatura

`antes/shots/1440-miniatura-200px.png` × `depois/shots/1440-miniatura-200px.png`, ambas
reduzidas pelo compositor a 200px de largura:

- **antes** — bloco de texto à esquerda, e no rodapé quatro fotografias com legenda por
  baixo, igualmente espaçadas. A 200px isso lê como **grade de produto**: não há
  protagonista, e a seção parece um catálogo;
- **depois** — a fotografia ocupa a maior parte do quadro, a faixa é uma superfície
  fotográfica contínua sem legenda solta, e o olho encontra um protagonista imediato.

É o mesmo teste do briefing §29, e é o que nenhuma das contagens numéricas mostrava.
