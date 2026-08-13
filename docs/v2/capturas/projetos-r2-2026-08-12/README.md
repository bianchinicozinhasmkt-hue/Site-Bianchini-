# R2 — `#projetos`

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `f418ab0`
**Escopo:** conformidade pontual da prova fotográfica principal e congelamento.

Deltas tratados: **S-05** (silhueta e sangria), **S-06** (cards · hairlines · amarelos),
**S-07** (altura e área fotográfica).

## Metodologia

Build de produção (`npm run build` + `next start`), Chrome 151 headless,
`deviceScaleFactor: 1`, `--hide-scrollbars`. Oito viewports: 320 · 390 · 768 · 1024 ·
1366 · 1440 · 1600 · 1920. Protocolo do documento 04 §5, com **duas correções de harness
que esta rodada precisou introduzir** — as duas produziam evidência errada, não número
errado, e estão descritas abaixo porque valem para as próximas rodadas.

| arquivo | o que faz |
| --- | --- |
| `medicoes/measure-r2.mjs` | inventário da seção (densidade, cards por construção, hairlines, amarelos, imagens, sangria por imagem, massa protagonista × apoio, estrutura CSS do mosaico, ações, legendas), varredura de overflow, console/HTTP/imagens/âncoras e assinatura estrutural do dossiê |
| `medicoes/tirar-capturas.mjs` | capturas: seção inteira por largura, momentos (entrando/centro/saindo) e as duas passagens |
| `medicoes/rodar.sh` | corrida completa, **um navegador por passo** |
| `medicoes/juntar.mjs` | consolida os `medicao-<largura>.json` e imprime a tabela de inventário |
| `medicoes/assets.mjs` | dimensão real e peso de cada fotografia do acervo, lidas do cabeçalho do arquivo |
| `medicoes/miniatura.mjs` | teste da miniatura (§25) — `#projetos` e `#equipamentos` reduzidas a 200px pelo compositor, para a comparação lado a lado |
| `medicoes/a11y-e-regressao.mjs` | foco, toque, `prefers-reduced-motion`, semântica e regression check dos congelados |
| `medicoes/antes/` · `medicoes/depois/` | JSON cru e capturas, mesma viewport, mesmo scroll, mesmo DPR |

### Correção de harness 1 — a máscara fechada impedia a fotografia de carregar

`PhotoReveal` não usa `.reveal`: usa `.photo-mask`, que fica em
`clip-path: inset(0 0 100% 0)` até o observador abrir. O protocolo do documento 04 §5 manda
dar `is-visible` aos `.reveal` — e só a eles. Resultado: **o recorte do contêiner zera a
interseção da própria `<img>`**, o lazy loading nativo nunca dispara, e duas das três provas
da frisa ficavam com `currentSrc` vazio. A primeira captura de 320 saiu com o leito claro no
lugar das fotografias, e o inventário registrou `naturalWidth === 0` nelas.

É o mesmo mecanismo que o `CLAUDE.md` já documenta para o `IntersectionObserver` do próprio
`PhotoReveal` — `clip-path` no alvo zera a interseção —, agora aparecendo no carregamento de
imagem. A correção é abrir `.photo-mask`/`.line-mask` junto com `.reveal` **antes** de
promover `loading="lazy"` a `eager`, e depois **esperar a decodificação** (promover só
inicia o carregamento; não espera por ele).

Área e altura não dependiam disso — vêm da caixa, não do pixel —, então os números do
baseline não mudaram quando a correção entrou. A evidência visual, que é o que decide a
rodada, dependia inteiramente.

### Correção de harness 2 — o servidor de produção pode servir build quebrado

Em algum momento da corrida o CSS passou a responder **400** (`/_next/static/css/*.css`), e
a página renderizava sem estilo: `body` em Times New Roman, seção de 533px em vez de
1.387px. A guarda que `measure-r2.mjs` herdou de R1 — conferir se a fonte computada é
Oswald/Manrope antes de medir — **pegou o problema e abortou**, em vez de gravar números
falsos. Foi um `next dev` rodando em paralelo e reescrevendo `.next` sob o `next start`.

Fica a regra: **um processo Next por vez**, e o servidor que serve a medição tem de ter
subido **depois** do build. As capturas tiradas na janela quebrada foram descartadas e
refeitas.

## O baseline histórico estava velho — pela terceira rodada seguida

Os números que a ficha 3 do documento 03 e as linhas S-05/S-06/S-07 da matriz cobravam vêm
do inventário de 2026-08-10 (HEAD `1f96a1f`), antes de a variante `showcase` existir. Medido
em `f418ab0`, o ponto de partida real era outro:

| métrica (1440) | histórico | **real em `f418ab0`** | teto |
| --- | ---: | ---: | ---: |
| altura | 1.593px | **1.422px** | 1.100px |
| área fotográfica | 55% | **64,4%** | ≥70% |
| cards | 6 | **0 autônomos** (4 leitos de fotografia) | ≤4, sem moldura |
| hairlines | 9 | **3** | ≤6 |
| amarelos | 8 | **6** | ≤3 |
| imagens rompendo o container | — | **1** (a protagonista, full-bleed) | ≥1 |

**Três dos seis tetos já estavam cumpridos antes da rodada**, e a silhueta **D** já existia:
protagonista sangrada de borda a borda, frisa de três provas na mesma altura, legendas
dentro da fotografia, zero moldura, CTA textual. O que a ficha manda **remover** — dois dos
seis cards, cinco das nove hairlines, a moldura dos cartões — já tinha saído na variante
`showcase`. Por isso R2 foi **conformidade pontual**, não recomposição (briefing §29).

## Os deltas que sobraram, e o que se fez com cada um

**Amarelo (6 → 3).** As três provas da frisa nomeavam o segmento em amarelo, do mesmo tom do
rótulo da protagonista. Além de estourar o teto, isso achatava a hierarquia justamente onde
ela precisa aparecer: a prova principal e o apoio marcados com a mesma cor. Agora o amarelo
marca **só** a protagonista (traço da etiqueta + traço e rótulo da ficha principal) e o apoio
se nomeia em branco.

**Área fotográfica (64,4% → ver tabela final).** A frisa assentava na guia de **texto**
(1.296px em 1440), enquanto a protagonista ia de 0 a 1.440 — um degrau de 72px de cada lado,
visível na captura, que partia em dois o que a seção quer que se leia como uma composição
fotográfica só. Agora **o texto fica na guia e a fotografia corre a página**: a frisa usa
gutter de 24px e teto livre. São +96px de largura de fotografia em 1440 **a custo zero de
altura**. A altura da frisa subiu de 22,5rem para 25rem em `xl`, que é o **teto do arquivo
mais fraco** (`camara-frigorifica`, 750 × 400 — `cover` resolve em 1,0 exato, ampliação
zero), não uma escolha de composição.

**Altura (1.422px, teto de 1.100px).** Não é alcançável junto com ≥70% de área, e isso é
aritmética, não implementação. Com `P` = altura da protagonista, `F` = altura da frisa e
`N` = altura não-fotográfica, e como nenhuma faixa é mais larga que a seção:

```
área% ≤ (P + F) / (P + F + N)
≥70%  ⟹  P + F ≥ (7/3)·N
≤1100 ⟹  P + F ≤ 1100 − N
as duas juntas ⟹ N ≤ 330px
```

`N` medido é **462px**; o piso realista dela (padding mínimo, etiqueta + H2 + lead em duas
linhas, vãos curtos, CTA com 44px de alvo) fica em torno de **390px**. Com `N = 390`, o menor
valor compatível com ≥70% é **1.300px de altura**. Abaixo disso só se chega encolhendo
fotografia — exatamente o que o critério de área existe para impedir e o que §17 do briefing
proíbe como caminho.

Então a rodada não perseguiu 1.100px: perseguiu área, cortou `N` onde havia folga real
(padding do topo, vãos da abertura e do fecho) e tratou a altura como consequência. **O teto
de altura da ficha 3 fica registrado como ajuste normativo** — ver `06-MATRIZ-DE-DELTAS.md`.

## `columns-*` × grid — por que o mosaico continua em grid

A ficha manda `columns-*` "nunca grid", porque com proporções variadas o grid alinha pela
célula mais alta e abre vãos sob as células baixas. **Essa falha exige células de alturas
diferentes, e aqui elas não existem:** as três provas compartilham uma altura explícita
(`PROOF_HEIGHT`) e a fotografia preenche por `object-cover`. Medido nas oito larguras, o
`ul` é `display: grid` e as três células têm altura idêntica — vão zero, por construção.

`columns-*` além de desnecessário seria **destrutivo** aqui: multi-coluna distribui os itens
por altura de conteúdo, empilharia duas provas numa coluna e uma na outra, e destruiria a
linha única e o alinhamento de etiqueta/título/escopo que é a razão de ser da frisa. O grid
fica, e a norma vale onde a premissa dela vale.

## Resultado — antes × depois

Mesma viewport, mesmo scroll, mesmo DPR, build de produção.

| largura | altura | | foto % da caixa | | **foto % da área útil** | | amarelos | |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| | antes | depois | antes | depois | antes | depois | antes | depois |
| 320 | 2.184 | **2.164** | 54,8 | 55,3 | 56,9 | **57,4** | 5 | **2** |
| 390 | 2.387 | **2.367** | 63,2 | 63,7 | 65,4 | **66,0** | 5 | **2** |
| 768 | 1.623 | **1.603** | 67,7 | 68,6 | 72,4 | **73,3** | 6 | **3** |
| 1024 | 1.278 | **1.238** | 61,8 | 65,2 | 67,3 | **70,2** | 6 | **3** |
| 1366 | 1.387 | **1.387** | 63,8 | 68,2 | 69,0 | **72,8** | 6 | **3** |
| 1440 | 1.422 | **1.422** | 64,4 | 68,8 | 69,5 | **73,3** | 6 | **3** |
| 1600 | 1.542 | **1.502** | 66,3 | 69,7 | 71,1 | **74,0** | 6 | **3** |
| 1920 | 1.686 | **1.646** | 65,8 | 71,9 | 70,2 | **76,0** | 6 | **3** |

Constantes nas oito larguras, antes e depois: **511 caracteres · 7 blocos · 4 fotografias ·
0 cards autônomos · 3 hairlines · 1 imagem rompendo o container · 1 CTA textual ·
0 overflow · 0 erro de console · 0 falha HTTP · 0 imagem quebrada · 0 âncora quebrada.**

Em 1440 a altura não mudou porque as duas metades do movimento se anularam de propósito: a
frisa **ganhou** 40px (22,5rem → 25rem, o teto do arquivo) e o corte de folga vertical
**devolveu** 40px. O que mudou foi a proporção — `N` (altura não-fotográfica) caiu de
**462px para 422px**, e a frisa passou de 1.264px para 1.360px de largura de fotografia.

### Massa protagonista × apoio

| largura | A/maior B | A/Btotal | A % da área fotográfica |
| ---: | ---: | ---: | ---: |
| 1440 antes | 5,4 | 1,9 | 65,5% |
| **1440 depois** | **4,5** | **1,6** | **61,4%** |
| 1920 depois | 6,0 | 2,1 | 67,6% |
| 390 depois | 1,2 | 0,5 | 32,3% |

A razão caiu em desktop porque a frisa ganhou área — e continua **protagonista folgada**:
1,6× todo o apoio somado, 4,5× a maior prova individual. Em 320/390 a razão é 0,5, e ali a
protagonista se distingue por ser **a única fotografia que toca as duas bordas**; em coluna
única, três apoios empilhados sempre somam mais que uma imagem, e o critério que decide no
telefone é o visual, não a soma. Miniatura: **PASS**.

### Fotografias — nenhuma trocada, nenhuma ampliada

| arquivo | resolução | função | grau | ampliação em 1440 |
| --- | ---: | --- | :---: | ---: |
| `projects/cozinha-completa.jpg` | 1400 × 1050 | **protagonista** — operação inteira construída | A | 1,03× (fonte 1400 → 1440) |
| `hero/bar-em-inox.jpg` | 931 × 1400 | apoio — mobiliário e bar em inox | A | 0,9× |
| `projects/camara-frigorifica.jpg` | 750 × 400 | apoio — cadeia fria | B | 1,0× |
| `projects/fritadeiras-e-chapa.jpg` | 750 × 1000 | apoio — praça de cocção | A | 0,9× |

**Nenhuma troca de asset.** A protagonista é operação real (não documento, não render) e
não tinha defeito objetivo — §7 manda não trocar por estética. `camara-frigorifica`
continua onde estava: **coluna estreita, papel secundário**, exatamente o tratamento que
§24 pede para o arquivo mais fraco do trio. Ela é também o que **limita a altura da
frisa**: 25rem é o ponto em que `cover` resolve em 1,0 exato na coluna estreita, e foi por
isso que a frisa subiu até 25rem e parou ali — o teto é do arquivo, não da composição.

### Legendas — nenhuma atribuição sem fonte

As quatro legendas descrevem o que está na imagem, com texto vindo inteiro de
`src/data/projects.ts`: segmento, título e escopo. **Zero** menção a cliente, local, prazo,
resultado, volume ou marca. O `lead` da Home nomeia o que a Bianchini fez em cada registro
("projetou, especificou, fabricou ou instalou") e diz explicitamente que as legendas não
atribuem cliente, local ou prazo.

### Acessibilidade e congelados

Foco visível 1/1 · alvo de toque 236,5 × 50 em 390 · `aria-labelledby` resolvido ·
4 figuras, 5 legendas, 0 imagem sem `alt` · `prefers-reduced-motion`: 0 elemento preso,
4/4 imagens carregadas, 8 blocos de texto visíveis, console 0.

Regression check dos congelados, todos idênticos ao que foi selado:
cabeçalho 80px com CTA raio 2px e sem sombra · G-1b alinhado (marca x=72 = h1 x=72) ·
dobra 900px · 41 botões, **0 fora da norma** · `#equipamentos` 343c/8b, 3 amarelos,
1.033px, A/Btotal 1,41 com sangria à direita · `#pilares` 704c/11b · `#transicao` 326c/3b ·
`#fechamento` 182c/2b.

**Rota interna intocada.** `/solucoes/cozinhas-industriais` monta a composição `dossier` e
não passa `variant`: assinatura de DOM idêntica antes e depois — 80 nós, 42 textos,
1.182 caracteres, 4 imagens, 2.498px em 390 e 1.641px em 1440.
