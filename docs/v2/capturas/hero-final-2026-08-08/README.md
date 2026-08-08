# Capturas da hero V2 — rodada de aprovação (2026-08-08)

```text
STATUS: EVIDÊNCIA — não é fonte de direção
```

Renders produzidos contra o **build de produção** (`npm run build` + `next start`),
`deviceScaleFactor` 1, fontes carregadas. Substituem a rodada anterior
(`../hero-2026-08-08/`), que foi tirada do servidor de desenvolvimento e antes da
restauração do `h1` aprovado e dos rótulos de CTA travados.

## O que mudou entre as duas rodadas

| item | rodada anterior | esta rodada |
| --- | --- | --- |
| `h1` de Equipamentos | "Equipamentos dimensionados para a sua operação." (encurtado por composição) | **copy aprovada**, 74 caracteres, íntegra |
| corpo do `h1` (desktop) | teto 3,5rem | teto 2,875rem — é o corpo que cede, não a copy |
| CTA Equipamentos | "Solicitar especificação e orçamento" | **"Solicitar orçamento"** |
| CTA Consultoria | "Solicitar diagnóstico operacional" | **"Agendar diagnóstico"** |
| pisos de altura do `h1` | 4,32 / 3,24 / 2,16 / 3,15em | 4,4 / 3,3 / 3,18em (remedidos) |

## Obrigatórias

| # | arquivo | viewport |
| --- | --- | --- |
| 1 | `01-hero-equipamentos-1440x900.png` | 1440 × 900 |
| 2 | `02-hero-projetos-1440x900.png` | 1440 × 900 |
| 3 | `03-hero-consultoria-1440x900.png` | 1440 × 900 |
| 4 | `04-hero-equipamentos-1920x1080.png` | 1920 × 1080 |
| 5 | `05-hero-equipamentos-390x844.png` | 390 × 844 |
| 6 | `06-hero-projetos-390x844.png` | 390 × 844 |
| 7 | `07-hero-consultoria-390x844.png` | 390 × 844 |
| 8 | `08-hero-equipamentos-360x800.png` | 360 × 800 |
| 9 | `09-home-full-1440.png` | página inteira, 1440 |
| 10 | `video/10-interacao-tres-estados-1440x900.webm` | troca 01 → 02 → 03 → 01 → 03 → 02 → 01 |

## Complementares

`extra-hero-1024x768`, `extra-hero-1366x768`, `extra-hero-320x568`,
`extra-hero-768x1024` — as larguras onde a composição tem pior caso conhecido
(1024 é onde a coluna de texto mais se aproxima do plano de projeto; 320 é o piso).

## Medições que acompanham estes renders

**Nenhum elemento se move entre os três estados**, em nenhum dos nove viewports.
Medido no navegador (etiqueta, `h1`, intenção, CTA e faixa de métricas), com os três
estados por viewport:

```text
viewport      h1 (linhas 01/02/03)   altura do h1   y do CTA   overflow-x
320 × 568          4 / 3 / 2            114,4          524,7        0
360 × 800          4 / 3 / 2            117,2          542,7        0
390 × 844          4 / 3 / 2            127,0          580,3        0
768 × 1024         3 / 2 / 2            112,2          694,7        0
1024 × 768         3 / 2 / 2            108,1          424,1        0
1366 × 768         3 / 2 / 2            126,0          437,4        0
1440 × 900         3 / 2 / 2            132,8          506,8        0
1586 × 992         3 / 3 / 2            146,3          559,5        0
1920 × 1080        3 / 3 / 2            146,3          605,5        0
```

Altura do `h1` e `y` do CTA são idênticos nos três estados de cada linha — é isso que
os pisos em `em` (`HEADLINE_MIN` / `INTENT_MIN`, em `hero-stage.tsx`) garantem.

Verificado junto, no mesmo build: teclado (`ArrowRight`/`ArrowLeft`/`Home`/`End` movem
seleção **e** foco, e o `h1` acompanha), `prefers-reduced-motion` (troca completa a 60ms,
sem crossfade e sem deslocamento, nenhum conteúdo invisível), menu mobile (abre e fecha
com `Escape`), zero erro de console e zero resposta HTTP ≥ 400.
