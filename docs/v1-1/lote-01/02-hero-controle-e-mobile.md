# 02 — Hero: autoplay controlável e navegação na primeira dobra

**Problemas:** P1-03 (autoplay sem pausa) e P1-02 (seletor fora da dobra no toque)
**Arquivos:** `src/hooks/use-carousel.ts`, `src/components/sections/hero-section.tsx`,
`src/components/ui/icons.tsx`, `src/app/globals.css`

---

## 1. Onde a rotação automática passa a existir

A decisão é por **capacidade do aparelho**, não por largura de viewport — uma
janela de desktop estreita continua tendo mouse, e um tablet largo continua não
tendo. `useCarousel` avalia `(hover: none) and (pointer: coarse)` e
`prefers-reduced-motion: reduce`:

| ambiente | rotação | controle de pausa |
| --- | --- | --- |
| ponteiro fino com hover | **ligada**, 6s | **presente** |
| toque (telefone, tablet) | **desligada** | ausente |
| `prefers-reduced-motion: reduce` | **desligada** | ausente |

O controle não é renderizado onde não há rotação: um botão "pausar" sobre algo
parado afirma que existe movimento — o oposto do que `prefers-reduced-motion`
pede.

### Medido no build `dx4d16Grn3O9iTT7lzWpA`

| ambiente | `h1` em t=0 | `h1` em t=7,4s | rotacionou | controle |
| --- | --- | --- | --- | --- |
| 1440×900, ponteiro fino | Projetar para a operação real. | Equipar com retorno calculado. | **sim** | `Pausar rotação dos pilares`, 44×44 |
| 390×844, toque emulado | Projetar para a operação real. | Projetar para a operação real. | **não** | ausente |
| 1440×900, reduced motion | Projetar para a operação real. | Projetar para a operação real. | **não** | ausente |

## 2. O controle de pausa

Fica na linha do marcador do pilar, não na régua do seletor. Três razões
medidas:

1. **A régua não tem largura sobrando.** Em 1024px cada célula tem 86px e
   "EQUIPAMENTOS" pede 77 — um terceiro botão de 44px deixaria 71px e o rótulo
   voltaria a quebrar no meio do glifo.
2. **As setas formam um eixo simétrico** (anterior · estado · próximo). Um
   controle de reprodução no meio dele deixa de ler como navegação.
3. **O marcador é onde o estado da rotação é dito** — "01/03 — PROJETOS" é
   exatamente a informação que o botão controla.

| requisito | atendido |
| --- | --- |
| ≥ 44 × 44px | ✅ medido 44 × 44 nos dois estados |
| integrado à navegação existente | ✅ na linha do marcador |
| não vira caixa dominante | ✅ glifo de 13px, sem moldura, sem preenchimento |
| ícone compreensível | ✅ duas barras / triângulo |
| `aria-label` coerente com o estado | ✅ `Pausar rotação dos pilares` ⇄ `Reproduzir rotação dos pilares` |
| foco visível | ✅ anel `ring-2 ring-ink ring-inset` |
| `Enter` e `Espaço` | ✅ `false → true → false` (Enter, duas vezes) e `false → true` (Espaço) |
| geometria estável ao trocar o ícone | ✅ caixa 44×44 antes e depois |
| sem layout shift | ✅ marcador em y=240 e título em y=278, idênticos antes e depois |
| não indica estado só por cor | ✅ glifo diferente + `aria-pressed` + `aria-label` |

A pausa é **persistente**: medido, o `h1` não mudou nos 7,4s seguintes ao
clique.

## 3. Interação manual não reinicia a rotação

Medido: após clicar no pilar 02, o título permaneceu o mesmo por **5,9s**
(`seguroPor6s: true`) e só voltou a avançar depois (`voltouDepois: true` aos
12,4s). É o comportamento de `markInteraction`, que já existia e continua
valendo.

## 4. Navegação dentro da primeira dobra no toque

### 4.1 O que mudou

- O marcador do pilar **subiu para a coluna clara em toda largura** (antes era
  `hidden lg:block`, com uma segunda instância dentro da faixa grafite abaixo
  da fotografia).
- Abaixo de `lg`, o marcador **é** a navegação: `‹ 01/03 — NOME ›`, com as duas
  setas de 44 × 44 nas pontas.
- A faixa grafite abaixo da fotografia **perdeu a fileira de setas** e mantém
  os três nomes na régua — não há dois seletores completos na mesma tela.
- "01/03" é o indicador de três estados. A numeração continua aparecendo **uma
  vez por estado**, que é a regra congelada da V1.

### 4.2 Geometria medida (build novo)

| viewport | marcador / navegação | título | CTAs | métricas | régua dos 3 nomes | limite | tudo essencial na dobra |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 × 844 | **120** | 175 | 391 | 558 | 1.183 | 844 | ✅ |
| 360 × 800 | **116** | 171 | 383 | 546 | 1.302 | 800 | ✅ |
| 320 × 800 | **116** | 171 | 383 | 546 | 1.275 | 800 | ✅ |
| 768 × 1024 | **136** | 191 | 359 | 460 | 1.361 | 1.024 | ✅ |
| 1024 × 768 | 178 | 211 | — | 571 | **644** | 768 | ✅ |
| 1366 × 768 | 163 | 198 | — | 584 | **664** | 768 | ✅ |
| 1440 × 900 | 240 | 278 | — | 630 | **724** | 900 | ✅ |

Antes: marcador em 952 / 1.071 / 1.020 / 1.166 e seletor em 1.171 / 1.290 /
1.263 / 1.349 — todos fora da dobra.

**Inclusive em 320 × 800**, que o briefing pedia "quando fisicamente viável".

### 4.3 Quebra de palavra

Verificado com `Range.getClientRects()` em todos os viewports: **nenhuma
palavra parte no meio**. Em 320 × 800 "OPERAÇÃO COMERCIAL" quebra **entre as
duas palavras**, em duas linhas — que é o comportamento permitido. A hairline
decorativa some abaixo de 360px para devolver os 20px que fazem a diferença.

### 4.4 Alvos de toque

As duas setas do marcador medem 44 × 44 em todas as larguras. O controle de
pausa também, onde existe.

## 5. O que **não** mudou

O seletor do desktop está visualmente intacto: régua compartilhada, sem caixas,
setas nas extremidades, `grid-cols-3`, estado ativo por peso + contraste +
régua de 2px. A única adição no desktop é o glifo de pausa na linha do
marcador. Comparar `screenshots/before/01-hero-1440-sem-controle-de-pausa.png`
com `screenshots/after/01-hero-1440-com-controle-de-pausa.png`.

Também não mudaram: geometria da diagonal, `--u`, a keyline, o recorte, as
transições, a copy, a fotografia e o enquadramento.

## 6. Reduced motion

| verificação | resultado |
| --- | --- |
| autoplay | desligado |
| controle de pausa | não renderizado |
| cortina do hero | `display: none` |
| conteúdo invisível | nenhum — as 4 camadas `panel-wipe` em `opacity: 0` são as **inativas** do painel de níveis, por construção (a ativa fica opaca) |
| navegação manual | funciona: clique no pilar 03 trocou o `h1` |
| três abas presentes | ✅ |

## 7. Capturas

Antes: `screenshots/before/01-…`, `04-hero-390x844-pilar-0{1,2,3}`,
`04-hero-320x800-pilar-01`, `04-hero-768x1024-pilar-01`.
Depois: `screenshots/after/01-…`, `02-hero-1440-pausado`,
`03-hero-1440-pausa-com-foco`, `04-hero-{390x844,320x800,768x1024}-pilar-0{1,2,3}`,
`05-hero-1440-reduced-motion-sem-controle-de-pausa`, `06-hero-390-reduced-motion`.
