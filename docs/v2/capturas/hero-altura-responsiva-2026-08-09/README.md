# Hero V2 — altura responsiva (2026-08-09)

`STATUS: REFERENCE` · evidência de validação, não documento de direção.

HEAD inicial: `318aa71`. Escopo: **só a altura da primeira dobra em 1024 e no
telefone.** O ritmo vertical aprovado na rodada anterior fica congelado.

Todas as capturas são da **viewport completa** (sem `captureBeyondViewport`), a
`devicePixelRatio` 1, com as fontes carregadas, contra o build de produção
servido em `localhost:3200`. Cada imagem mostra exatamente o que cabe na
primeira tela — é assim que se lê onde a dobra termina.

## O critério

| viewport | critério | antes | depois |
| --- | --- | --- | --- |
| 1920 × 1080 | `= 1080` | 1080 | **1080** |
| 1440 × 900 | `= 900` | 900 | **900** |
| 1024 × 768 | `≤ 768` | 830 (+62) | **768** |
| 390 × 844 | `≤ 844` | 914,8 (+70,8) | **844** |
| 320 × 568 | o mais próximo possível | 852,4 (+284,4) | **743,2 (+175,2)** |

Não obrigatórios, medidos junto e todos corrigidos:

| viewport | antes | depois |
| --- | --- | --- |
| 1366 × 768 | 768 | 768 |
| 768 × 1024 | 1038 (+14) | **1024** |
| 430 × 932 | 935,6 (+3,6) | **932** |

## Não-regressão no desktop, provada por hash

As capturas de 1920, 1440 e 1366 são **byte a byte idênticas** antes e depois —
nenhuma das três correções desta rodada alcança essas faixas:

```
1920x1080  antes=54b787056b7f2b2d  depois=54b787056b7f2b2d  IDÊNTICO
1440x900   antes=d7d79fc33bceaee1  depois=d7d79fc33bceaee1  IDÊNTICO
1366x768   antes=7becf8468df3979c  depois=7becf8468df3979c  IDÊNTICO
```

## Por que 320 × 568 não fecha, e por que isso não é um item em aberto

Medido zerando `--media-h` no navegador — ou seja, com a fotografia **inteira
fora da composição** — a dobra ainda mede **572,8px** contra os 568 da janela:

```
viewport     com foto   sem foto   janela
320 × 568      743,2      572,8      568   ← não cabe nem sem a cena
320 × 720      788,8      720,0      720
375 × 812      821,9      812,0      812
390 × 844      844,0      844,0      844   ← fecha
```

O piso é o conteúdo que o briefing proíbe tocar: cabeçalho (64), etiqueta,
`h1` em 4 linhas, parágrafo em 4 linhas, o par de CTAs empilhados com 48px de
área de toque cada, e o seletor. Fechar 568 exigiria cortar um deles. Os
743,2px são o melhor resultado possível com esta composição — 109,2px abaixo do
que era, sem esconder nada e sem overflow.

Telefones entre 568 e 844 de altura seguem a mesma curva e melhoraram na mesma
proporção; a partir de 390 × 844 a dobra fecha exatamente.

## Arquivos

- `antes/` e `depois/` — capturas por viewport e por estado, e as medições
  completas em `medicoes-*.json` (posição e altura de cada peça da dobra).
- Estados capturados nos dois viewports de trabalho (1024 e 390):
  Equipamentos, Projetos e Consultoria.
