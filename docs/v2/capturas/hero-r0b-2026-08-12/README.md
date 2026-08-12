# R0-B — hero: conformidade e congelamento (D-1, D-2, D-4, D-5)

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `2b622a7`
**Escopo:** exclusivamente os quatro deltas abertos da hero. A hero **não foi
redesenhada** — nenhum item da lista de congelados conceituais (doc 03 §2.1) foi tocado.

## Como foi medido

Build de **produção** (`next build` + `next start`), Chromium 151 headless,
`deviceScaleFactor: 1`, `--hide-scrollbars`, fontes carregadas, uma navegação por
viewport. Harness em `medicoes/measure-r0b.mjs`, derivado do de R0-A: mesma conexão CDP
crua e a mesma metodologia de contraste (pior pixel real sob a caixa do texto, com **só**
o texto medido escondido — scrim, `.deck` e superfícies das portas continuam pintados).

**O baseline é real, não deduzido.** `2b622a7` foi construído numa árvore de trabalho
separada (`git worktree`, `node_modules` por junção) e servido em paralelo, de modo que
todo par antes/depois desta pasta vem de duas medições, não de uma medição e uma
lembrança.

### Três coisas que este harness acrescenta ao de R0-A

1. **Cor composta da superfície das portas.** A porta é translúcida sobre fotografia,
   então a pergunta "isto lê como cáqui?" só o pixel rasterizado responde — a cor
   declarada do gradiente não serve. Duas faixas por porta, ambas em região sem texto
   (logo abaixo da régua e logo acima da aresta inferior), mediana por canal para que um
   pico especular da cena atrás não desloque a leitura. De cada amostra saem três
   números: `croma` (max−min dos canais; **0 = neutro puro**), `quente` (r−b) e `cinza`
   (luminância perceptual).
2. **Escala de cinza medida, e não só olhada.** A mesma amostragem roda com
   `filter: grayscale(1)` no documento. O teste do doc 01 §9.4 é de percepção, e a
   captura em cinza está aqui para ele; o número é o que impede que "eu acho que dá para
   ver" substitua a medição.
3. **Isolamento do D-2.** `isolar-d2.mjs` mede a fileira com `1.15fr` e, **no mesmo
   carregamento**, força `repeat(3, 1fr)` e remede. É o que prova que a proporção nova
   não mexeu em altura nenhuma — a exigência de §11 do briefing.

O texto com `opacity` (a etiqueta é `canvas/80`) é **composto sobre o fundo antes** de
entrar na razão de contraste. R0-A usava a cor declarada; a diferença aparece só na
etiqueta e é por isso que o pior valor desta pasta (4,98:1) é mais baixo que o 6,21:1
registrado lá. Não é regressão: o baseline `2b622a7`, medido pelo mesmo método, dá
**exatamente 4,98:1**.

## Arquivos

```
antes/            baseline 2b622a7 — close das portas (cor e cinza) + medicoes/
depois/           o estado desta rodada — heros, close das portas, cinza + medicoes/
medicoes/         o harness, e só ele:
  measure-r0b.mjs   layout, portas, superfícies, teclado, hover, reduced-motion,
                    contraste e capturas
  close.mjs         close-up das portas em cor e em cinza, numa base qualquer
  isolar-d2.mjs     1.15fr × 1fr no mesmo carregamento — a prova de §11
  probe.mjs         largura natural dos `cue` contra a largura útil de cada porta
  troca.mjs         luminância da área de mídia durante a troca de cena
  invisiveis.mjs    o que fica em `opacity: 0` sob `prefers-reduced-motion`
```

As capturas obrigatórias do briefing (§23) estão em `depois/`: hero nos três estados em
1440 e 390, hero de Equipamentos em 1024 e 320, e o close das portas em 1440, 1024 e 390.
O close de **768** foi acrescentado porque §21 exige validação explícita do tablet, e o
par em escala de cinza acompanha cada close.

---

## D-1 · a superfície deixa de ser tingida

Amostra composta no topo da porta, build de produção. `croma` é a distância entre o canal
mais alto e o mais baixo: **é o número que nomeia o cáqui**.

| viewport | ativo antes | croma | ativo depois | croma | inativo depois | croma |
| ---: | --- | ---: | --- | ---: | --- | ---: |
| 390 | rgb(76,68,47) | **29** | rgb(70,70,70) | **0** | rgb(25,25,25) | 0 |
| 768 | rgb(80,71,48) | **32** | rgb(71,71,71) | **0** | rgb(25,25,25) | 0 |
| 1024 | rgb(85,75,50) | **35** | rgb(74,74,73) | **1** | rgb(27,26,26) | 1 |
| 1366 | rgb(82,73,49) | **33** | rgb(73,72,72) | **1** | rgb(26,26,26) | 0 |
| 1440 | rgb(82,73,49) | **33** | rgb(72,72,72) | **0** | rgb(27,26,26) | 1 |
| 1920 | rgb(82,74,50) | **32** | rgb(73,73,73) | **0** | rgb(26,26,26) | 0 |

O deslocamento quente (r−b) cai de **+29…+35 para 0…+1** em todas as larguras. O resíduo
de 1 ponto em 1024/1366/1440 não é tingimento: é a fotografia atravessando os 5% de
transparência da superfície, e ele existe igual nas portas **inativas**, que nunca
tiveram tinta.

Valores declarados, para leitura direta:

```text
              topo            62%             base
inativo   rgba(28,28,28,.90)  rgba(17,17,17,.93)  rgba(20,20,20,.93)
ativo     rgba(78,78,78,.95)  rgba(46,46,46,.96)  rgba(54,54,54,.96)
```

O delta normativo (~48 pontos, doc 01 §9.4) é preservado **e passa a ser neutro**:
`78 × 0,95 − 28 × 0,90 = 48,9` na parada de topo. Antes, os 47,8 pontos equivalentes só
existiam porque o derrame de amarelo clareava o topo do ativo — ou seja, parte do sinal
de estado estava sendo carregada pela própria cor que a norma proíbe.

## D-2 · proporção, e a prova de que ela não custou altura

| viewport | antes | depois | diferença | `heroBottom` antes → depois | alturas |
| ---: | --- | --- | ---: | --- | --- |
| 1024 | 304,5 / 304,5 / 304,5 | **333,5** / 290,0 / 290,0 | +15,0% | 786,9 → **786,9** | 110 → **110** |
| 1366 | 407,1 / 407,1 / 407,1 | **445,9** / 387,8 / 387,7 | +15,0% | 768 → **768** | 96 → **96** |
| 1440 | 429,3 / 429,3 / 429,3 | **470,2** / 408,9 / 408,9 | +15,0% | 900 → **900** | 96 → **96** |
| 1600 | 464,0 / 464,0 / 464,0 | **508,2** / 441,9 / 441,9 | +15,0% | 900 → **900** | 104 → **104** |
| 1920 | 464,0 / 464,0 / 464,0 | **508,2** / 441,9 / 441,9 | +15,0% | 1080 → **1080** | 104 → **104** |

Abaixo de 1024 as três continuam iguais (98,7 em 320 · 122,0 em 390 · 233,1 em 768),
conforme doc 03 §2.12.

**Nenhum rótulo quebra em largura nenhuma.** Medido `scrollWidth === clientWidth` no nome
das três portas nos oito viewports — não há compressão nem corte. O `cue` de Consultoria
ocupa duas linhas em 1024 e em 768, e isso **não é efeito desta rodada**: a frase mede
268,0px naturais a 15px, contra 264,5px de largura útil que a fileira igual oferecia em
1024. Ela já quebrava por 3,5px antes de D-2 existir.

## D-4 · o bisel

`getComputedStyle(.door, '::before').boxShadow`, nos oito viewports:

```text
antes    rgb(245,198,75) 0 3px 0 inset, rgba(0,0,0,.5) 0 -2px 0 inset   (ativa)
         rgba(255,255,255,.16) 0 2px 0 inset, rgba(0,0,0,.5) 0 -2px 0 inset  (inativa)
depois   none
```

A aresta superior passou a ser `border-top` — uma aresta desenhada, e não um realce que
simula volume: `2px canvas/20` no inativo, `42%` no hover, `3px` de amarelo cheio no
ativo. As outras três bordas são `0px` e o raio é `0px` nos três estados.

## Escala de cinza — o teste do doc 01 §9.4

Luminância perceptual da superfície, com `grayscale(1)` aplicado ao documento:

| viewport | ativo | inativo | Δ antes | Δ depois |
| ---: | ---: | ---: | ---: | ---: |
| 390 | 71,6 | 31,0 | 37,9 | **40,6** |
| 768 | 72,6 | 31,0 | 40,7 | **41,6** |
| 1024 | 75,4 | 31,9 | 43,5 | **43,5** |
| 1366 | 73,5 | 31,9 | 41,6 | **41,6** |
| 1440 | 73,5 | 31,9 | 41,6 | **41,6** |
| 1920 | 74,4 | 31,9 | 42,6 | **42,5** |

**O resultado que importa: o Δ em cinza não caiu.** Tirar o amarelo da superfície não
custou nada ao sinal não-cromático — em 390 e 768 ele até subiu. É a demonstração de que
o tingimento era poluição cromática, e não parte da hierarquia.

`*-portas-close-cinza.png` é a prova visual, em `antes/` e `depois/`.

## Contraste — 15 pares viewport × estado, método de R0-A com alpha composto

Pior valor por viewport, contando **também** os nomes e as situações das portas (que R0-A
não media, e que D-1 mexe):

| viewport | equipamentos | projetos | consultoria |
| ---: | ---: | ---: | ---: |
| 1024 | 6,26 | 7,94 | 7,70 |
| 1366 | 5,60 | 8,05 | 8,04 |
| 1440 | **4,98** | 8,04 | 8,05 |
| 1600 | 6,42 | 7,57 | 8,05 |
| 1920 | 6,21 | 8,05 | 8,05 |

Pior de toda a matriz: **4,98:1**, contra piso de 4,5. É a etiqueta em 1440 — e o
baseline `2b622a7`, medido pelo mesmo harness, dá **o mesmo 4,98**. O scrim não foi
tocado nesta rodada e não precisou ser.

Nas portas, o movimento é pequeno e todo com folga larga: o nome da porta ativa vai de
9,12 para 8,48:1 em 1440 (a superfície clareou), e o da inativa fica em 11,04:1.

## Interação — `medicoes/interacao.json`

- **teclado**: `foco 0 → ArrowRight 1 → 2 → volta a 0 → End 2 → ArrowLeft 1 → Home 0`.
  Seleção e foco andam juntos, a lista dá a volta, `tabindex` rotativo íntegro (`0,-1,-1`).
- **hover**: sobrevoar a porta 1 com a 0 escolhida **não troca a cena** (`sel` continua 0).
  A fileira fica em `y = 774 / 777 / 780` — escolhida 6px acima, sobrevoada 3px, em
  repouso 0. Alturas idênticas: **nenhum refluxo**.
- **reduced-motion**: quatro elementos em `opacity: 0`, e os quatro são estado inativo com
  `aria-hidden="true"` (as duas cenas não escolhidas e os dois rótulos de CTA não
  escolhidos). A máscara das três cenas está em `0px 0px` — **nada preso fechado**. A cena
  ativa fica opaca, sem `transform` e sem animação.
- **troca de cena** (`troca.mjs`): a luminância da área de mídia evolui de forma monótona
  entre os dois extremos — `77,2 → 58,6` e `58,6 → 61,8`. Nenhuma amostra cai abaixo do
  menor extremo (não há apagão) nem sobe acima do maior (não há dupla exposição).

## O que esta rodada **não** tocou

Scrim, `--u`, coreografia da troca, contrato ARIA, copy, `h1`, largura de leitura,
posição vertical, cenas, assets, alturas das portas, vãos, preload/`priority` e o
cabeçalho (dono: R0-C). O par PRIMARY × WhatsApp foi **verificado, não alterado**: a razão
de largura continua 1,300 em 1366/1440/1600/1920 e 1,18–1,22 abaixo disso, idêntica ao
que R0-A registrou.
