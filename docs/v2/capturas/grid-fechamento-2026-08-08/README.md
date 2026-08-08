# Rodada de malha e fechamento — 2026-08-08

```text
STATUS: EVIDÊNCIA — não é fonte de direção
```

Renders contra o **build de produção** (`npm run build` + `next start`),
`deviceScaleFactor` 1. Rodada cirúrgica: malha da dobra, seletor dos três pilares,
ritmo vertical e fechamento da home. Nenhuma seção V1 foi redesenhada e nenhuma
página interna foi tocada.

## O defeito de malha, medido

Em 1440 × 900 o `Container` resolve em **L=60 / R=1380**. Antes desta rodada:

```text
etiqueta, h1, intenção, CTA, instrução, métricas ..... x = 60
índice de "01 EQUIPAMENTOS" .......................... x = 80    ← 20px fora
seta de "03 CONSULTORIA" ............................. x = 1360  ← 20px dentro
trilhas do seletor ................................... 495 / 413 / 412
```

Todo texto da dobra assentava numa linha-guia e só o do seletor assentava noutra.
Depois:

```text
tudo, inclusive o seletor .......... x = 60 … 1380
trilhas ............................ 440 / 440 / 440
```

Conferido também em 1920 (300…1620, trilhas 440), 1024 (40…984, trilhas 315/314/315)
e 390 (20…370). Zero rolagem horizontal em todas.

## Arquivos

| # | arquivo | o que mostra |
| --- | --- | --- |
| 1 | `01-hero-equipamentos-1440x900.png` | estado inicial |
| 2 | `02-hero-projetos-1440x900.png` | segundo estado |
| 3 | `03-hero-consultoria-1440x900.png` | terceiro estado |
| 4 | `04-hero-equipamentos-1920x1080.png` | guias em 300 / 1620 |
| 5 | `05-hero-equipamentos-390x844.png` | telefone |
| 6 | `06-home-full-1440.png` | home inteira |
| 7 | `07-fechamento-1440x900-a-transicao.png` | quem conduz (escuro) → fechamento (claro) |
| 7 | `07-fechamento-1440x900-b-rodape.png` | fechamento (claro) → rodapé (escuro) |
| 7 | `07-fechamento-390x844-a-transicao.png` | a mesma transição no telefone |
| 7 | `07-fechamento-390x844-b-rodape.png` | faixa fotográfica e entrada do rodapé |
| 8 | `08-seletor-depois-1440.png` | o seletor em detalhe |
| 9 | `09-seletor-antes-depois-1440.png` | **comparativo**, com as guias do `Container` marcadas |

## Verificado no mesmo build

- **Sem salto entre estados:** `h1` / CTA / seletor em 240 / 509 / 715 nos três.
- **Teclado:** `ArrowRight`, `End` e `Home` movem seleção **e** foco.
- **`prefers-reduced-motion`:** troca completa a 60ms, sem deslocamento, nada invisível.
- **Contraste do seletor**, pior pixel de cada cena, com a fotografia aparecendo sob
  a faixa: complemento inativo 5,24 / 6,34 / 5,51:1 — todos acima de 4,5:1. Antes da
  correção de degradê e opacidade, o pior caso era **3,92:1**.
- Zero erro de console e zero resposta HTTP ≥ 400.
