---
STATUS: EVIDÊNCIA
tipo: troca dos três assets da primeira dobra
branch: v2
data: 2026-08-09
---

# Hero — as três cenas novas

O gestor entregou três arquivos em `public/images/hero/` e eles substituem as cenas dos três
estados da dobra. Cada um foi para o pilar que o nome indica:

| estado | arquivo novo | substitui |
| --- | --- | --- |
| Equipamentos | `equipamento-hero.png` | `hero-industrial-kitchen.png` |
| Projetos | `projeto-hero.png` | `projeto-3d-hero.jpg` |
| Consultoria | `consultoria.png` | `operacao-comercial.png` |

Os arquivos antigos **não foram apagados** — continuam em `public/`, sem consumidor nesta
rota.

## Os três chegam prontos para este palco

Os três têm **exatamente 1672 × 941**, a mesma moldura, e os três trazem o sujeito à direita
com área escura à esquerda — que é onde a coluna de texto assenta e onde o scrim fecha.
Antes isso valia só para a âncora de Equipamentos; os outros dois dependiam de
`objectPosition` para simular o efeito.

## Corte real de `object-fit: cover`, por viewport

Medido sobre a caixa da própria `<img>` — abaixo de `lg` a cena é uma faixa de `--media-h`
no alto do palco, então usar a caixa do palco superestimaria o corte.

| viewport | caixa da cena | aspecto | corte |
| --- | --- | --- | --- |
| 1920 × 1080 | 1920 × 996 | 1,93 | vertical **8%** |
| 1440 × 900 | 1440 × 820 | 1,76 | lateral **1%** |
| 1280 × 800 | 1280 × 720 | 1,78 | **0%** — proporção exata do arquivo |
| 1024 × 768 | 1024 × 692 | 1,48 | lateral **17%** |
| 768 × 1024 | 768 × 307 | 2,50 | vertical **29%** |
| 390 × 844 | 390 × 253 | 1,54 | lateral **13%** |
| 320 × 720 | 320 × 216 | 1,48 | lateral **17%** |

Em 1280 o corte é zero: a proporção do arquivo é a do palco.

### O que cada `objectPosition` protege

O corte é **lateral** no telefone e no tablet estreito, e **vertical** no desktop largo — os
dois eixos servem breakpoints diferentes, e por isso os dois são declarados.

- **Equipamentos `62% center`** — no telefone o corte lateral tem de trazer o fogão e a
  chapa em vez do corredor vazio. No desktop o corte vertical de 8% não encosta nem na
  coifa nem no piso.
- **Projetos `62% 58%`** — a planta ocupa a metade de baixo do arquivo; puxar o
  enquadramento abaixo do centro mantém o documento inteiro no palco sem perder as pranchas
  do fundo.
- **Consultoria `70% 12%`** — é o único caso em que o corte vertical morde de verdade, porque
  a cabeça começa a ~2% da altura do arquivo. Enquadrar perto do topo protege a cabeça; o
  que se perde é fundo vazio na base. Confirmado no pior caso (768 × 1024, corte vertical de
  29%): a cabeça fica inteira.

## Tratamento tonal — as duas correções foram REMOVIDAS

`.gradeProjetos` e `.gradeConsultoria` saíram. O motivo é medido, não estético.

Metodologia (a mesma das rodadas anteriores): luminância média da cena crua sobre a caixa do
palco, no build de produção, com scrim e conteúdo escondidos, amostragem de 1 em 3 pixels.

| estado | antigo 1920 | antigo 1440 | **novo 1920** | **novo 1440** | **novo 390** |
| --- | --- | --- | --- | --- | --- |
| equipamentos | 102,8 | 102,1 | **68,7** | **69,1** | **33,8** |
| projetos | 154,7 | 155,0 | **69,4** | **68,9** | **33,5** |
| consultoria | 67,2 | 65,3 | **80,8** | **81,7** | **39,7** |
| **amplitude** | **87,5** | **89,7** | **12,1** | **12,8** | **6,2** |

O conjunto antigo tinha 87 pontos entre o mais claro e o mais escuro, e era isso que as
correções existiam para fechar. O conjunto novo chega com 12, e os dois primeiros estados
ficam a menos de um ponto um do outro.

Medido com os filtros ainda ligados, Projetos caía de 69,4 para **39,6** — 43% *abaixo* de
Equipamentos, com a planta, que é o assunto da cena, afogada justamente sob a faixa do scrim
onde ela assenta. Consultoria fica 17% acima dos outros dois e assim permanece: a média é
puxada pela camisa branca e pelo fundo iluminado do estúdio, que são o assunto, e
`saturate(0.86)` ali tirava 14% da cor de pele de uma pessoa real para resolver um desvio
que a medição não confirma como problema.

## Contraste do texto sobre as cenas novas

Pior pixel (o mais claro) da área ocupada por cada texto, com o scrim ativo, contra branco.
Exigência do projeto: 4,5:1.

| viewport | estado | `h1` | intenção |
| --- | --- | --- | --- |
| 1920 | equipamentos | 13,88:1 | 13,32:1 |
| 1920 | projetos | 17,52:1 | 17,81:1 |
| 1920 | consultoria | 14,32:1 | 17,77:1 |
| 1440 | equipamentos | 11,74:1 | 13,55:1 |
| 1440 | projetos | 17,90:1 | 18,40:1 |
| 1440 | consultoria | 17,05:1 | 17,95:1 |
| 1024 | equipamentos | **8,62:1** | 13,16:1 |
| 1024 | projetos | 17,73:1 | 18,03:1 |
| 1024 | consultoria | 16,48:1 | 16,04:1 |

Pior caso 8,62:1, quase o dobro do piso. O scrim não precisou de ajuste.

## Legenda de Projetos — DEC-008 preservado, e um defeito antigo corrigido

A cena não é mais um estudo 3D, então a legenda "Estudo 3D de layout — material de projeto,
não obra executada" ficaria falsa. Passou a ser **"Material de projeto — planta técnica"**:
continua declarando o tipo do material, como DEC-008 exige, agora com texto verdadeiro.

A validação de `40ff37a` já tinha registrado, sem corrigir, que a legenda "encosta na borda
direita da janela em 1920". Ela estava presa a `right: 0`, a aresta da **janela** — o único
elemento da dobra fora do eixo que a marca, o título, os CTAs e a régua compartilham. Agora
ela usa a aresta interna do `Container`:

| viewport | legenda termina em | régua termina em | desvio | folga até a janela |
| --- | --- | --- | --- | --- |
| 1920 | 1620 | 1620 | **0px** | 300px |
| 1600 | 1460 | 1460 | **0px** | 140px |
| 1440 | 1380 | 1380 | **0px** | 60px |
| 1280 | 1240 | 1240 | **0px** | 40px |
| 1024 | 984 | 984 | **0px** | 40px |

A legenda continua saindo abaixo de `lg`, como antes — no palco em faixa não sobra altura
para uma linha extra. Com a cena nova o risco que a legenda cobre é menor: uma planta
impressa não se confunde com fotografia de obra executada.

## Testes

| verificação | resultado |
| --- | --- |
| `npm run lint` / `type-check` | limpos |
| `npm run build` | passa (19 rotas estáticas) |
| overflow horizontal 1920 / 1440 / 1024 / 390 / 320 | **0** |
| erros de console | **0** |
| respostas HTTP ≥ 400 | **0** |
| imagens quebradas | **0** (593 URLs de `src`/`srcset` verificadas uma a uma) |
| contraste mínimo do texto da dobra | **8,62:1** |

## Índice das capturas

```
hero-<viewport>-<estado>.png, para
  viewports  1920 · 1440 · 1024 · 768 · 390 · 320
  estados    equipamentos · projetos · consultoria
```

18 arquivos. Cada estado foi ativado pelo próprio seletor antes do disparo — é o que dispara
o carregamento das cenas `lazy`; forçar `opacity` por JS deixava a imagem sem nunca ser
pedida, e uma primeira rodada de medição registrou 16,0 (o grafite do palco) por causa disso.
