# `#pilares` — de três cartões numerados a uma composição editorial (2026-08-09)

```text
STATUS: HISTORICAL (evidência de rodada) — não é fonte de direção
```

Evidência da rodada que corrigiu a **apresentação visual** de `#pilares` e o **ritmo** das
duas transições vizinhas. O conteúdo estratégico da rodada anterior (commit `45b5b17`) foi
mantido: perguntas do cliente e rótulos de CTA são idênticos.

- **antes** = `c9c7568` (baseline da rodada)
- **depois** = esta rodada

Ambos capturados com o **mesmo harness**, em build de produção (`next build` + `next start`),
`deviceScaleFactor` 1, fontes carregadas e todos os 17 `.reveal` da home em `is-visible`.

## O que mudou

| | antes | depois |
| --- | --- | --- |
| moldura | borda externa + `gap-px` desenhando divisórias em cruz | nenhuma — três blocos sobre o `canvas` da seção |
| fundo por item | `bg-surface` + hover `bg-canvas-deep` | nenhum |
| numeração | `01 / 02 / 03` | removida, sem substituto |
| etiqueta de situação | `cue` repetindo a régua da primeira dobra | removida |
| separação | caixa | keyline horizontal + espaço + alinhamento |
| hierarquia de Equipamentos | posição `01` + CTA amarelo | posição + keyline grafite 2px + CTA amarelo |
| lista | `<ol>` | `<ul>` |

A régua vertical entre colunas foi deliberadamente **não** usada: keyline horizontal
compartilhada mais régua vertical é o desenho de uma tabela, que era metade da queixa.

## Medições

### 1440×900

| medida | antes | depois | Δ |
| --- | ---: | ---: | ---: |
| altura de `#pilares` | 797px | **598px** | −199px (−25,0%) |
| vão do CTA de Projetos ao título de Pilares | 191px | **147px** | −44px (−23,0%) |
| · base de Projetos (CTA → fim da seção) | 64px | 40px | −24px |
| · topo de Pilares (seção → título) | 127px | 107px | −20px |
| última ação de Pilares → corte escuro | 117px | **56px** | −61px (−52,1%) |
| · base de Pilares (fim das frentes → corte) | 81px | 56px | −25px |
| altura total da home | 16.285px | 16.061px | −224px |

Largura das três áreas: **413px cada**, iguais, com calha de 40px. Antes: 439px cada, dentro
da moldura. Altura de cada frente: 409px → **264px** (−145px), as três idênticas, com
títulos na mesma linha (y=4358) e ações alinhadas pela base.

### 390×844

| medida | antes | depois | Δ |
| --- | ---: | ---: | ---: |
| altura de `#pilares` | 1.789px | **1.279px** | −510px (−28,5%) |
| vão do CTA de Projetos ao título de Pilares | 158px | **122px** | −36px (−22,8%) |
| · base de Projetos (CTA → fim da seção) | 48px | 32px | −16px |
| · topo de Pilares (seção → título) | 110px | 90px | −20px |
| última ação de Pilares → corte escuro | 93px | **48px** | −45px (−48,4%) |
| altura total da home | 26.386px | 25.860px | −526px |

Altura por frente: Equipamentos 459 → **263px**; Projetos 452 → **259px**; Consultoria
404 → **259px**.

### Demais viewports (só depois)

| viewport | altura de `#pilares` |
| --- | ---: |
| 320×720 | 1.469px |
| 390×844 | 1.279px |
| 768×1024 | 1.091px |
| 1024×768 | 620px |
| 1440×900 | 598px |
| 1920×1080 | 626px |

## Verificações

Em 320, 390, 768, 1024, 1440 e 1920, na build de produção:

- overflow horizontal (`scrollWidth − innerWidth`) = **0**
- erros de console = **0**
- respostas HTTP ≥ 400 = **0**
- imagens quebradas = **0**
- `.reveal` sem `is-visible` = **0/17**
- nenhum `01/02/03` no texto de `#pilares`
- nenhum `li` com borda fechada, fundo próprio, radius ou sombra
- nenhuma ação abaixo de 44px (48/44/44px)
- `#pilares` continua sendo destino do menu

Teclado (1440, eventos `Tab` reais): a ordem entra em `#pilares` pelo CTA de Equipamentos e
sai para `#sintomas` — os três recebem `:focus-visible`, com o mesmo preenchimento/sublinhado
do hover (`::before` em `scaleX` no botão, `::after` nos dois `ArrowLink`).

Contraste sobre `canvas` (#EFEDEB): título e pergunta 16,3:1; resposta (`muted`) 5,4:1;
`ArrowLink` 16,3:1; CTA primário (ink sobre `yellow`) 11,8:1. O amarelo aparece uma vez na
seção, como preenchimento de botão.

## Dois achados fora do escopo, pré-existentes e idênticos no antes

Ambos aparecem nas medições dos dois lados e **não** foram introduzidos aqui:

1. `p#hero-seletor-instrucao` é apontado como "texto cortado" em 320/390. É `sr-only` — o
   recorte é intencional. Falso positivo do detector.
2. `div.pointer-events-none.absolute` em `#leonardo` (borrão decorativo em `-right-[6%]`)
   aparece na varredura de overflow a partir de 1024. `scrollWidth − innerWidth` continua 0.

## Nota sobre o harness

A primeira versão do script varria a página em passos de 0,7 × viewport com 90ms de pausa.
Com esse passo o navegador entregava só o estado final de cada salto e **10 dos 17
`.reveal` da home** nunca recebiam `is-visible` — apareciam transparentes na captura, o que
poderia ser lido como bug de composição. O passo foi para 0,35 × viewport com 140ms, com
repetição até zerar os pendentes. Toda captura deste diretório declara `revealPendentes: 0`
em `medicoes-*.json`.
