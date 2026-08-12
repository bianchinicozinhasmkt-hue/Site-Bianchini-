# R0-D — `#pilares`, `#transicao` e `#fechamento`

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `48e1b65`
**Escopo:** conformidade e congelamento das três últimas seções da R0. Nenhuma seção foi
redesenhada; nenhuma estrutura, destino, dado ou fotografia mudou.

Deltas fechados: **S-08** (densidade de `#pilares`), **S-15** (card residual de
`#transicao`), **S-31** (orçamento de cor de `#fechamento`).

## Metodologia

Build de produção (`npm run build` + `next start`), Chrome 151 headless,
`deviceScaleFactor: 1`, `--hide-scrollbars`. Antes de cada leitura todos os `.reveal`
recebem `is-visible` e as imagens `loading="lazy"` são promovidas a `eager` — protocolo do
documento 04 §5. Oito viewports: 320 · 390 · 768 · 1024 · 1366 · 1440 · 1600 · 1920.

| arquivo | o que faz |
| --- | --- |
| `medicoes/measure-r0d.mjs` | inventário por seção (densidade, caixa, cards, amarelos, imagens, ações), varredura de overflow em passos de 60% da janela, console/HTTP/imagens/âncoras, e as capturas |
| `medicoes/probe-pilares.mjs` | sonda de altura de `#pilares` — qual coluna dita a linha, quantas linhas cada bloco ocupa |
| `medicoes/rotas-e-a11y.mjs` | as 9 rotas internas que compartilham `FinalCtaSection`, foco, toque, `prefers-reduced-motion` e regression check dos congelados |
| `medicoes/antes/` · `medicoes/depois/` | JSON cru e capturas, mesma viewport, mesmo scroll, mesmo DPR |

### O contador de texto foi validado antes de ser usado

`blocosTexto`/`caracteres` reproduzem o contador da auditoria global de 2026-08-10 — o
conjunto medido é **`p` e `h1..h6` visíveis**. A validação é que ele devolve exatamente os
números publicados por aquela auditoria nas duas seções que ela mesma chama de exemplo
correto de densidade: `#transicao` **326 caracteres / 3 blocos** e `#fechamento`
**182 / 2**, na vírgula.

### O número de `#pilares` na matriz estava velho

Com o mesmo contador validado acima, `#pilares` mede **844 caracteres / 11 blocos** no
`48e1b65` — não os 1.505 / 14 que a matriz registrava. A matriz declara a origem
(inventário de 2026-08-10, HEAD `1f96a1f`) e `bdca4a5` reescreveu a seção **no dia
seguinte**. Conferido no código daquele commit: a seção já tinha os mesmos 11 blocos de
texto, então o teto de 1.200 **já estava cumprido** antes desta rodada.

Consequência prática: os "−300 caracteres" do briefing foram calibrados sobre 1.505 para
chegar a 1.200. Como o ponto de partida real era 844, a rodada cortou pelo critério
editorial (§6 do briefing: redundância primeiro, nunca corte mecânico) e não pela
aritmética antiga — **−140 caracteres, −16,6%**. Cortar 300 sobre 844 exigiria remover a
resposta curta que o próprio briefing manda preservar.

## Resultado

| seção | delta | antes | depois |
| --- | --- | ---: | ---: |
| `#pilares` | S-08 · ≤1.200 caracteres | 844 / 11 blocos | **704 / 11 blocos** |
| `#transicao` | S-15 · zero card | 1 card | **0 cards** |
| `#fechamento` | S-31 · ≤3 amarelos | 5 (≥1024) · 4 (<1024) | **3 (≥1024) · 2 (<1024)** |

Nas oito larguras, nos dois estados: `overflow-x` = 0 · erros de console = 0 · HTTP ≥400 =
0 · imagens quebradas = 0 · `href` vazio = 0 · âncora quebrada = 0.

### `#pilares` — o corte, texto a texto

| bloco | antes | depois | Δ |
| --- | ---: | ---: | ---: |
| apoio do cabeçalho | 186 | 106 | **−80** |
| Equipamentos · resposta | 100 | 100 | 0 |
| Projetos · resposta | 135 | 108 | **−27** |
| Consultoria · resposta | 136 | 103 | **−33** |

O apoio perdeu a oração do meio porque ela é **literal em outra seção da mesma página**:
"não há repasse de culpa entre projetista, fornecedor e instalador" é publicada igual por
`#transicao`, 2.650px abaixo. Quem cede é `#pilares` — lá a frase é o conteúdo do fecho de
capítulo, aqui era o meio de um apoio de três orações.

**Equipamentos ficou intacta de propósito.** É a única resposta sem redundância a cortar, e
encurtar justamente a frente prioritária achataria a assimetria que DEC-001 pede.

#### Por que a altura não cai em 1024/1366/1600/1920 (briefing §8)

Investigado com `probe-pilares.mjs`, não deduzido. **Não há altura artificial:**
`min-height` é `auto` nas três colunas. A altura da linha é ditada pela coluna mais alta, e
em todas as larguras de desktop essa coluna é **Equipamentos** — a que a rodada
deliberadamente não cortou. O corte removeu linhas dentro de Projetos e Consultoria, o que
aparece como folga antes da ação (o `mt-auto` que alinha as três ações pela base, mecanismo
declarado na própria seção).

Onde o corte muda a caixa, ele muda de verdade: **−124px em 320**, −53px em 390, −26px em
768 e −20px em 1440 (onde Consultoria deixou de ser a coluna mais alta). O `vazioBase`
segue em 56px antes e depois — nenhum vão novo se abriu, então não havia espaçamento
decorrente a corrigir.

### `#transicao` — o card era uma superfície, não uma moldura

`div.relative.aspect-[4/3].overflow-hidden.bg-canvas` — a caixa da fotografia carregava
`bg-canvas` (#EFEDEB) dentro de uma seção `canvas-deep` (#E6E3DE). Superfície própria
distinta da superfície da seção **é** a construção de card no sistema (doc 01 §7.3), e era o
único que o inventário achava aqui.

**Removido, nada no lugar** — nem borda, nem régua, nem moldura, nem fundo mais próximo do
tom da seção. Como a fotografia é `fill` + `object-cover`, o fundo nunca aparecia depois do
carregamento: a composição renderizada é idêntica e a altura não muda em nenhuma das oito
larguras. O que sai é a caixa.

### `#fechamento` — quais amarelos ficaram, e por quê

| # | região | classe | antes | depois |
| --- | --- | --- | :---: | :---: |
| 1 | keyline diagonal (`.diag-keyline`) | **A · MARCA** — geometria do mockup, segundo e último uso da diagonal | ✅ | ✅ |
| 2 | CTA primário, 375 × 56 | **B · PRIMARY** — a ação que a página preparou | ✅ | ✅ |
| 3 | traço da etiqueta, 28 × 2 (56px²) | **D · DECORAÇÃO** — hairline, abaixo do piso de relevância de §6.2 | ✅ | ✅ |
| 4 | texto da etiqueta "PRÓXIMO PASSO" | **E · TEXTO/DETALHE** | ✅ | **cedeu** |
| 5 | traço do rótulo de atendimento, 24 × 2 | **D · DECORAÇÃO** | ✅ | **cedeu** |

A escolha de quem cede não é opinião desta rodada: doc 01 §6.2 fixa `MARCA > AÇÃO > ESTADO`
e traz o caso já resolvido — na primeira dobra, que tinha seis regiões, **a etiqueta cedeu o
texto e manteve o traço**, porque etiqueta não é nenhuma das três, é rótulo. Aqui a decisão
é a mesma, com o mesmo valor (`canvas/80`) da hero congelada. O traço do rótulo de
atendimento cede por ser o acento decorativo sobre o **último** item da hierarquia de
leitura da seção.

Nenhuma opacidade foi reduzida para simular a queda: saíram duas massas/acentos.

Efeito colateral medido e bom: sem o traço de 24px, a linha de atendimento passa de duas
linhas para uma e a seção encolhe **13px** em todas as larguras de desktop.

## As 9 rotas internas

`FinalCtaSection` veste a Home e nove rotas. Todas medidas em 1440 depois da mudança:

| rota | amarelos | ações | etiqueta |
| --- | ---: | ---: | --- |
| `/` · `/sobre` · `/projetos` · `/solucoes` · `/solucoes/arquitetura` · `/solucoes/cozinhas-industriais` · `/solucoes/consultoria-para-restaurantes` · `/solucoes/consultoria-para-fabricantes` · `/linhas-de-produtos` · `/leonardo-bianchini` | **3** em todas | **2** em todas | `rgba(239,237,235,0.8)` em todas |

Composição, copy, destinos e número de ações **não mudaram em nenhuma**: o que se propaga é
a conformidade de cor, que é ganho normativo, não regressão. Zero erro de console em todas.

## Acessibilidade

| teste | resultado |
| --- | --- |
| foco visível nas três seções | **6/6 alvos** disparam sinal computado (anel ou preenchimento) |
| alvo de toque em 390 | **nenhum** abaixo de 44px |
| `prefers-reduced-motion: reduce` | **0** elementos invisíveis ou com máscara presa |

## Regression check dos congelados

| congelado | verificação | resultado |
| --- | --- | --- |
| **Header** | rótulo, destino, raio, sombra, altura de faixa | `SOLICITAR ORÇAMENTO` → `/contato?intencao=equipamentos`, raio 2px, `box-shadow: none` — **PASS** |
| **G-1b** | marca do cabeçalho no eixo do `h1` | `x = 72` nos dois — **PASS** |
| **Hero** | `h1` e composição da dobra | íntegros — **PASS** |
| **Button system (G-6)** | 11 botões renderizados na Home | **0 fora da norma** — **PASS** |

## Capturas

`medicoes/antes/shots/` e `medicoes/depois/shots/` — mesmos nomes, mesma viewport, mesmo
scroll, mesmo DPR, para comparação direta.

- **1440:** as três seções entrando · centralizadas · saindo; `fechamento + footer`; e as
  cinco passagens entre vizinhas (`projetos→pilares`, `pilares→sintomas`,
  `diagnostico→transicao`, `transicao→inox`, `credibilidade→fechamento`).
- **390:** as três seções e `fechamento + footer`.
- **1920:** uma captura contextual de cada seção.
