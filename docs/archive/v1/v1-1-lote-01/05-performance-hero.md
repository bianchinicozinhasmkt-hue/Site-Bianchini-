# 05 — Hero: carregamento duplicado e excessivo das fotografias

**Problema:** P1-06 · **Arquivo:** `src/components/sections/hero-section.tsx`

## 1. Inspeção

| item | estado anterior |
| --- | --- |
| instâncias de `<Image>` por slide | **2** — painel diagonal (`lg`) e caixa em fluxo (`< lg`), as duas sempre no DOM |
| slides | 3 → **6 elementos de imagem** |
| `priority` | só no índice 0 de cada instância (2 preloads) |
| `loading` | `eager` nos índices 1 e 2 das duas instâncias |
| `sizes` desktop | `(max-width: 1023px) 1px, 60vw` |
| `sizes` mobile | `(max-width: 1023px) 100vw, 1px` |
| candidatos escolhidos | 1440: desktop w=1080, **mobile w=640** · 390: mobile w=640, **desktop w=384** |
| imagens ocultas que baixavam | **3 por viewport**, em tamanho cheio |

**Por que `1px` não funcionava.** O `next/image` deriva as larguras candidatas
do `srcset` a partir das razões em **`vw`** declaradas em `sizes`. `1px` não é
uma razão em `vw`: ele é ignorado no cálculo, a menor razão continua sendo a da
outra condição (`60vw` ou `100vw`), e a menor candidata gerada acaba sendo
w=384 ou w=640. O navegador então respeitava o `1px` na hora de escolher — mas
escolhia o menor candidato **existente**, que era grande.

## 2. Correção

### 2.1 `1px` → `1vw`

```
desktop  (max-width: 1023px) 1vw, 60vw
mobile   (max-width: 1023px) 100vw, 1vw
```

Com uma razão de 1vw na conta, a menor passa a ser 0,01 e o `srcset` volta a
incluir as larguras pequenas. Resultado medido: a instância oculta escolhe
**w=16** — 1 KB — em vez de w=640 (66 KB) ou w=384 (36 KB).

A instância visível **não muda**: em 1440px, 60vw = 864px continua resolvendo
para w=1080; em 390px, 100vw continua resolvendo para w=640.

### 2.2 Slides 2 e 3 fora do caminho crítico

Os `<Image>` dos slides inativos só são montados depois do evento `load` da
página — ou imediatamente, se o visitante interagir antes disso
(`markInteraction` também libera). Uma rede de segurança
(`index === activeIndex`) garante montagem no mesmo quadro caso qualquer
caminho troque o slide antes.

**O que mudou é *quando* carregam, não *se* carregam.** Uma vez montados, seguem
com `loading="eager"` — a decisão congelada continua valendo, porque o lazy
nativo não busca imagem de carrossel com `opacity: 0`.

Não foi usado: `unoptimized`, desligar AVIF, trocar imagem, remover `priority`
da imagem crítica nem alterar configuração global.

## 3. Matriz de rede — antes e depois

Contadas apenas as três fotos dos slides
(`hero-industrial-kitchen`, `linha-de-coccao`, `operacao-comercial`), cache
frio.

### Antes — build `UiteCIQWVcn4UiYdRM-mr`

| viewport | peso | req | críticas | detalhe |
| --- | --- | --- | --- | --- |
| 1440 × 900 | **317 KB** | 6 | **6** | desktop w=1080 ×3 (208 KB) + **mobile w=640 ×3 (109 KB, invisível)** |
| 390 × 844 | **168 KB** | 6 | **6** | mobile w=640 ×3 (109 KB) + **desktop w=384 ×3 (59 KB, invisível)** |

### Depois — build `dx4d16Grn3O9iTT7lzWpA`

| viewport | peso | req | **críticas** | detalhe |
| --- | --- | --- | --- | --- |
| 1440 × 900 | **211 KB** | 6 | **34 KB em 2 req** | crítico: w=1080 (33 KB) + w=16 (1 KB) · após `load`: 107+68 KB + 2×1 KB |
| 1366 × 768 | 179 KB | 6 | **23 KB em 2 req** | crítico: w=828 (22 KB) + w=16 (1 KB) |
| 1024 × 768 | 124 KB | 6 | **16 KB em 2 req** | crítico: w=640 (15 KB) + w=16 (1 KB) |
| 768 × 1024 | 161 KB | 6 | **21 KB em 2 req** | crítico: w=828 (20 KB) + w=16 (1 KB) |
| 390 × 844 | **112 KB** | 6 | **15 KB em 2 req** | crítico: w=640 (14 KB) + w=16 (1 KB) |
| 360 × 800 | 56 KB | 6 | **8 KB em 2 req** | crítico: w=384 (7 KB) + w=16 (1 KB) |
| 320 × 800 | 56 KB | 6 | **8 KB em 2 req** | crítico: w=384 (7 KB) + w=16 (1 KB) |

### Resultado

| métrica | 1440 × 900 | 390 × 844 |
| --- | --- | --- |
| fotos do hero, total | 317 → **211 KB** (−33%) | 168 → **112 KB** (−33%) |
| fotos do hero, **caminho crítico** | 317 → **34 KB** (−89%) | 168 → **15 KB** (−91%) |
| duplicação desktop/mobile da mesma foto | 109 KB → **3 KB** | 59 KB → **3 KB** |
| peso total da home | 1.139 → **1.034 KB** | 684 → **628 KB** |

## 4. Critérios de rede

| critério (§8.5) | resultado |
| --- | --- |
| nenhuma duplicação desktop/mobile da mesma fotografia | **parcial, medido**: a instância oculta ainda emite 3 requisições, agora de **~1 KB cada (w=16)** em vez de 14–66 KB. Ver §5 |
| uma imagem visível crítica | ✅ w=1080 em 1440, 33 KB |
| no máximo um recurso adicional antecipado | ✅ o único adicional crítico é o placeholder de 1 KB da instância oculta |
| zero preload não utilizado evitável | ✅ 14 preloads de imagem, **todos utilizados** (2 do hero, 1 do logotipo, 1 de `#sintomas`, 10 dos logos de cliente) |
| redução material do peso da hero | ✅ −33% total, −89% no caminho crítico |
| nenhuma fotografia ausente | ✅ ver §6 |
| zero CLS | ✅ CLS da home = 0 em todos os viewports |

## 5. Residual assumido

A instância oculta continua existindo no DOM e emite **3 requisições de ~1 KB**
(imagens de 16px). Eliminá-la exigiria renderizar apenas a variante do
breakpoint atual, o que só é possível por JavaScript no cliente — e tiraria a
fotografia da primeira dobra do HTML do servidor, degradando o LCP, ou
introduziria divergência de hidratação. A auditoria classificou "instância
única da foto do hero" como **risco de perda visual / V2**, e essa classificação
continua válida.

3 KB é o custo medido dessa decisão. Fica registrado como residual explícito,
não como "zero duplicação".

## 6. Dez ciclos por viewport

`Projetos → Equipamentos → Operação Comercial → Projetos`, dez vezes (30 trocas
por viewport, 150 no total):

| viewport | trocas | fotografia ausente | overflow |
| --- | --- | --- | --- |
| 1440 × 900 | 30/30 | 0 | 0 |
| 1366 × 768 | 30/30 | 0 | 0 |
| 1024 × 768 | 30/30 | 0 | 0 |
| 768 × 1024 | 30/30 | 0 | 0 |
| 390 × 844 | 30/30 | 0 | 0 |

Verificado a cada troca: existe exatamente uma camada `[data-active="true"]`,
ela contém um `<img>`, e esse `<img>` tem `currentSrc` e `naturalWidth > 0`.

## 7. Achado fora do escopo, registrado

`#sintomas` (`symptoms-section.tsx:179`) usa `priority` na primeira fotografia
de capítulo — que é `linha-de-coccao.jpg` a `w=828`, ~107 KB, **preloaded** para
uma seção que começa em y=768. É custo de caminho crítico para conteúdo abaixo
da dobra.

**Não foi alterado**: está fora dos seis problemas deste lote. Fica registrado
para o próximo.
