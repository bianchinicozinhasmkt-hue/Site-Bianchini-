# 03 — Contraste da legenda em `#atuacao`

**Problema:** P1-04 · **Arquivo:** `src/components/sections/scope-section.tsx`

## 1. Reprodução

| item | valor |
| --- | --- |
| texto | `current.media.caption` — ex.: "Capacidade instalada contra volume real: uma das seis frentes lidas na visita técnica" |
| elemento | `<p class="absolute inset-x-4 bottom-4 max-w-[58ch] text-sm text-white">` |
| cor | `rgb(255,255,255)`, 14px, peso 400 → mínimo **4,5:1** |
| fundo próprio | `rgba(0,0,0,0)` — nenhum |
| scrim | `absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-graphite/90 to-transparent` |
| estado de pior contraste | **nível 01**, `refrigeradores-verticais.jpg` — inox iluminado exatamente sob a faixa do texto |
| viewport | todos os desktops (o painel de mídia só existe a partir de `lg`) |
| razão medida na auditoria | **1,28:1** |

O gradiente resolve o **encontro** da fotografia com a base do painel, não o
contraste do texto: ele nasce transparente no topo dos 40% e só chega a 90% na
borda inferior, enquanto o texto fica 16px acima dela.

## 2. Correção

Duas camadas com papéis separados — o mesmo par que a primeira dobra já usa:

```
gradiente  from-graphite/80 → transparent, h-2/5   assenta a fotografia
superfície linear-gradient(180deg,
             rgba(16,16,16,0.90) 0%,
             rgba(16,16,16,0.96) 60%,
             rgba(16,16,16,0.97) 100%)             sustenta o texto
```

O texto passou de `text-white` para `text-canvas` (#EFEDEB), a cor de texto do
sistema em fundo escuro.

**Em `rgba()` arbitrário, não em `from-graphite/NN`:** a escala de opacidade do
Tailwind 3 não tem todos os passos, e uma classe inexistente desaparece sem
erro de build — já aconteceu no hero e está registrado nas decisões congeladas.

Sombra de texto **não** foi usada: ela melhora a borda do glifo e não muda a
relação de luminância que o WCAG mede.

## 3. Medição depois — em pixel real

Método: o texto é escondido (`visibility: hidden`), a viewport é capturada, a
captura é reinjetada na página como `<img>`, desenhada num `<canvas>` e lida com
`getImageData`. Cada pixel amostrado na caixa do texto é, por construção, fundo
composto de verdade — fotografia + scrim + superfície. O **pixel mais claro**
decide.

| viewport | nível | pior pixel de fundo | razão (pior) | razão (média) | mínimo | resultado |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 × 900 | 01 | rgb(24,23,23) | **15,32:1** | 16,15:1 | 4,5 | ✅ |
| 1440 × 900 | 02 | rgb(25,25,25) | **15,06:1** | 15,82:1 | 4,5 | ✅ |
| 1440 × 900 | 03 | rgb(25,25,25) | **15,06:1** | 16,00:1 | 4,5 | ✅ |
| 1440 × 900 | 04 | rgb(25,25,24) | **15,07:1** | 15,97:1 | 4,5 | ✅ |
| 1440 × 900 | 05 | rgb(22,22,21) | **15,51:1** | 16,01:1 | 4,5 | ✅ |
| 1366 × 768 | 01–05 | rgb(22–25) | **15,06 – 15,51:1** | ~16:1 | 4,5 | ✅ |
| 1024 × 768 | 02 | rgb(25,25,25) | **15,06:1** | 15,93:1 | 4,5 | ✅ |

**11 estados medidos em pixel, nenhuma falha. Pior caso 15,06:1** — contra
1,28:1 antes.

Em 1024 × 768 quatro estados não puderam ser medidos porque o painel é alto e a
legenda não coube inteira na janela na posição de rolagem usada; é limitação da
medição, não do resultado — a superfície é a mesma em todos os viewports, e o
1024/nível 02 medido confirma.

Limite teórico: mesmo se a fotografia sob a legenda fosse **branco puro**, a
composição com `rgba(16,16,16,0.90)` daria rgb(40,40,40) e razão **12,6:1**.

## 4. O que foi preservado

Fotografia, conteúdo, composição do painel 65/35, as etiquetas "Recebe de" /
"Entrega para" nos cantos superiores, os estados ativos, a cortina `panel-wipe`
e a direção visual. A superfície ocupa a altura do texto mais `py-3` — não é
uma faixa pesada cobrindo a fotografia.

Nenhuma regressão nos demais slides: os cinco níveis foram medidos e capturados.

## 5. Capturas

- Antes: `screenshots/before/07-atuacao-1440-nivel-01.png`
- Depois: `screenshots/after/07-atuacao-1440-nivel-0{1,2,3,4,5}.png`
