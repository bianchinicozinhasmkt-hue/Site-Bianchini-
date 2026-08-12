# R0-A — sistemas globais: G-1, G-1b e G-2

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `f52f7bb`
**Escopo:** exclusivamente os três deltas globais. Nenhuma seção foi redesenhada.

O working tree já continha alterações não commitadas da hero (`hero-stage.tsx`,
`hero-stage.module.css`) e do wireframe. Tratadas como base aprovada: nada foi resetado,
descartado ou sobrescrito por versão histórica.

## Como foi medido

Build de **produção** (`next build` + `next start`), Chromium 151 headless,
`deviceScaleFactor: 1`, `--hide-scrollbars`, fontes carregadas, uma navegação por
viewport. O build rodou numa **cópia isolada do repositório** (mesmos fontes,
`node_modules` por junção), porque há um servidor do gestor no ar na porta 3000 que é dono
do `.next`. `npm run lint`, `npm run type-check` e `npm run build` rodaram **também no
repositório**, limpos.

`--hide-scrollbars` é deliberado: a tabela normativa (doc 01 §3.1.2) é definida sobre a
**largura da viewport**, e com a barra ocupando layout todos os valores sairiam ~7px
menores sem que houvesse defeito estrutural. A independência da guia em relação à barra é
verificada por outro caminho — ver `sangria-depois.json`, onde a fotografia de
`#equipamentos` termina a **0,0px** do vidro em todas as larguras.

Metodologia de contraste: a cena é rasterizada com **apenas os textos medidos** ocultos
(scrim, plataforma e superfícies das portas permanecem pintados), e amostra-se o pior
pixel real sob cada caixa contra a cor do próprio texto.

## Arquivos

```
antes/     8 capturas do produto em HEAD f52f7bb
depois/    8 capturas + 2 dos contextos de WhatsApp fora da dobra
medicoes/  as medições cruas e o harness que as produziu
```

Capturas de página inteira são rasterizadas a **0,28×** (`clip.scale`): a home tem 14.500px
em 1920 e 21.600px em 390, e um raster 1:1 estoura o limite de textura do Chromium. O
layout continua em CSS px — a escala é só de rasterização.

## G-1 · guia medida × norma (doc 01 §3.1.2)

| viewport | gutter | casca | `x` casca | recuo interno | **guia** | cabeçalho | `h1` | norma | overflow |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 320 | 20 | 280 | 20 | 0 | **20** | 20 | 20 | 20 ✓ | 0 |
| 390 | 20 | 350 | 20 | 0 | **20** | 20 | 20 | 20 ✓ | 0 |
| 768 | 38,4 | 691,2 | 38,4 | 0 | **38,4** | 38,4 | 38,4 | 38,4 ✓ | 0 |
| 1024 | 51,2 | 921,6 | 51,2 | 0 | **51,2** | 51,2 | 51,2 | 51,2 ✓ | 0 |
| 1366 | 68,3 | 1229,4 | 68,3 | 0 | **68,3** | 68,3 | 68,3 | 68,3 ✓ | 0 |
| 1440 | 72 | 1296 | 72 | 0 | **72** | 72 | 72 | 72 ✓ | 0 |
| 1600 | 72 *(não morde)* | 1400 | 100 | 0 | **100** | 100 | 100 | 100 ✓ | 0 |
| 1920 | 72 *(não morde)* | 1400 | 260 | 0 | **260** | 260 | 260 | 260 ✓ | 0 |

Oito de oito, exatas — não "dentro de 1px". Antes: 20 / 20 / 32 / 40 / 40 / 60 / 140 / 300,
com recuo interno de 20/32/40 somado por dentro da casca.

## G-1b · cabeçalho

| viewport | marca antes | marca depois | `h1` | desvio antes | desvio depois |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 768 | 32 | 38,4 | 38,4 | 0 | **0** |
| 1024 | 31,7 | 51,2 | 51,2 | −8,3 | **0** |
| 1366 | 42,3 | 68,3 | 68,3 | +2,3 | **0** |
| 1440 | 44,6 | 72 | 72 | −15,4 | **0** |
| 1600 | 49,6 | 100 | 100 | −90,4 | **0** |
| 1920 | 59,5 | 260 | 260 | **−240,5** | **0** |

Altura da faixa, escala do logotipo, tipografia da navegação, CTA, estados e menu mobile:
inalterados. Só o eixo horizontal mudou.

## Hero · contraste (piso 4,5:1)

Pior pixel real sob cada caixa, por estado e viewport. **Nenhuma reprovação — o scrim não
precisou mudar.**

| viewport | Equipamentos | Projetos | Consultoria |
| ---: | ---: | ---: | ---: |
| 1024 | 6,70 | 8,86 | 14,43 |
| 1366 | 6,59 | 15,04 | 15,21 |
| 1440 | 6,70 | 14,62 | 15,03 |
| 1600 | 7,20 | 9,92 | 14,91 |
| 1920 | **6,21** | 11,49 | 14,91 |

Pior valor de toda a matriz: **6,21:1** (1920, Equipamentos, instrução) — 38% acima do
piso. Caixas medidas: etiqueta, `h1`, intenção e instrução. Ficam de fora os rótulos dos
CTAs (massa opaca com superfície própria, doc 01 §15.3) e os nomes das portas (superfície
translúcida própria). Detalhe por caixa em `medicoes/contraste-depois.json`.

## G-2 · par da dobra

| viewport | primário | WhatsApp antes | WhatsApp depois | razão | altura |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 320 | 269,8 | 228,1 | 228,1 | 1,183 | 48/48 |
| 390 | 269,8 | 228,1 | 228,1 | 1,183 | 48/48 |
| 768 | 297,9 | 249,4 | 249,4 | 1,194 | 58/58 |
| 1024 | 289,9 | 237,4 | 237,4 | 1,221 | 58/58 |
| 1366 | 326,0 | 250,8 | 250,8 | **1,300** | 57,3/57,3 |
| 1440 | 326,0 | 250,8 | 250,8 | **1,300** | 58/58 |
| 1600 | 326,0 | 250,8 | 250,8 | **1,300** | 58/58 |
| 1920 | 326,0 | 250,8 | 250,8 | **1,300** | 58/58 |

A largura do WhatsApp é **idêntica à anterior em todas as larguras**: a borda de 1px
acrescentava 2px e derrubava a razão para 1,290, e o recuo do rótulo foi reduzido de 20
para 19px de cada lado para absorvê-la. Altura e alvo de toque intactos.

**Ressalva registrada:** de 320 a 1024 a razão fica em 1,18–1,22, abaixo do piso de 1,30.
Esse valor **não mudou nesta rodada** — era exatamente o mesmo antes de R0-A, e chegar a
1,30 em 1024 exigiria cortar o recuo de 19 para ~12px, apertando o rótulo contra a norma de
acabamento. Em 320/390 os dois CTAs empilham e a razão de largura deixa de ser sinal de
hierarquia. Nas quatro larguras onde a norma mediu (≥1366) o piso é cumprido, e em todas as
larguras a hierarquia passa a ser **de construção** — uma massa e um contorno — que é o que
o delta pedia.

## Sangria — os dois vetores de regressão do G-1

| viewport | foto de `#equipamentos` até o vidro | legenda sangrada de `#projetos` | mosaico (`wide` em 2xl) |
| ---: | ---: | ---: | --- |
| 1024 | **0,0px** | 51,2 | 921,6 @ 51,2 |
| 1440 | **0,0px** | 72 | 1296 @ 72 |
| 1600 | **0,0px** | 100 | 1456 @ 72 |
| 1920 | **0,0px** | 260 | **1520 @ 200** |

A legenda da fotografia sangrada assenta na guia de conteúdo, não na aresta da janela —
sangria não empresta guia (doc 01 §3.2). O mosaico em 1920 confirma a norma ao pé da letra:
`wide` começa em 200 e `default` em 260.

## Rotas validadas (§19)

As catorze rotas, em 1440: **zero** erro de console, **zero** HTTP ≥400, **zero** imagem
quebrada, **zero** `href` vazio, **zero** overflow de documento. Detalhe em
`medicoes/rotas-depois.json`.

Dois falsos positivos do varredor, verificados e descartados:

- a `ul` do marquee de logotipos excede a viewport por construção (`w-max`) e é recortada
  pelo pai — `documentElement.scrollWidth` e `body.scrollWidth` continuam iguais a
  `clientWidth`. Pré-existente, e é o delta M-1;
- as "âncoras quebradas" nas rotas internas são os cinco itens de `mainNav` (`/#equipamentos`
  etc.), que são âncoras **para a home** e resolvem lá — em `/` a contagem é zero.

## Acessibilidade

- **foco visível:** 22 paradas de `Tab` em 1440, todas com indicador. Zero sem anel;
- **reduced-motion:** nenhum conteúdo invisível, nenhuma máscara fechada, nenhuma animação
  em laço em `main`;
- **menu mobile (390):** abre, lista os 5 itens, fecha por `Escape`, reabre e fecha por
  clique no fundo. Gatilho com alvo de 44px.

## O que esta rodada não fez

Nenhum selo `CONGELADA` foi aplicado. R0-A é pré-condição: ela estabiliza o sistema global
sobre o qual Hero, Pilares, Transição e Fechamento serão avaliados em R0-B/C/D. Proporção
das portas, superfície ativa, bisel, copy e destino do CTA do cabeçalho continuam abertos.
