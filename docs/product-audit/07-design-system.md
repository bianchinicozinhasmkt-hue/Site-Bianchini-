# 07 — Sistema de design

O projeto **tem** um sistema de design: `src/styles/` centraliza cores, escala
tipográfica, espaçamento, raios, sombras, curvas e breakpoints, e
`tailwind.config.ts` consome tudo por `theme`. Isso é melhor do que a maioria dos
projetos deste porte. O que falta é **disciplina de uso** — várias decisões vivem
no ponto de uso e não no token.

## 1. Auditoria de consistência

| item | fonte da verdade | estado real |
| --- | --- | --- |
| cores | `src/styles/colors.ts` + `:root` em globals.css | ✅ coerente; a regra do amarelo está documentada e é cumprida |
| tipografia | `src/styles/typography.ts` | ✅ 9 escalas, todas registradas no `tailwind-merge` |
| espaçamento | `Section` (`xs`/`sm`/`default`/`lg`) + `Container` | ✅ |
| **raios** | `src/styles/radius.ts` (`sm:8px`, `DEFAULT:16px`, `lg:24px`) | ⚠️ **divergente** — ver §2.1 |
| sombras | `src/styles/shadows.ts` | ✅ 6 valores, todos usados |
| alturas de controle | `sizes` em `button.tsx` (44/48/56px) | ✅ |
| estados | 4 por botão (padrão, hover, `focus-visible`, `active`) | ✅ verificado no DOM |
| foco | `:focus-visible` global + `.on-dark` | ✅ visível em todos os 16 primeiros stops de teclado |
| breakpoints | `src/styles/breakpoints.ts` | ⚠️ convivem com arbitrários — ver §2.3 |
| containers | `theme.maxWidth.container = 1400px` | ⚠️ **dois valores** — ver §2.2 |
| botões/links/cards/painéis/accordions/abas | primitives próprios | ✅ com uma exceção — §2.4 |

## 2. Divergências concretas

### 2.1 A escala de raios não é a que o site usa

`radius.ts` publica `sm: 8px`, `DEFAULT: 16px`, `lg: 24px`. Contagem no código:

- `rounded-[3px]` — **10 ocorrências** (todos os botões, o gatilho do menu mobile)
- `rounded-sm` (8px) — 20 ocorrências
- `rounded` (16px) / `rounded-lg` (24px) — praticamente ausentes fora de
  `rounded-full`

Ou seja: o raio real do sistema é **3px arbitrário**, o segundo é 8px, e os dois
valores publicados como principais não são usados. Não é um bug — é dívida de
token: quem abrir `radius.ts` para criar um componente novo vai escolher 16px e
sair do sistema sem perceber.

**Correção (V1.1, sem risco visual):** redefinir a escala para o que já é
verdade — `none: 0`, `xs: 3px`, `sm: 8px`, `full: 9999px` — e trocar
`rounded-[3px]` por `rounded-xs`. Zero mudança de pixel.

### 2.2 Dois valores de container

- `src/styles/tokens.ts` → `layout.container = '1720px'`
- `src/styles/theme.ts` → `maxWidth.container = '1400px'` ← **este é o que vale**

`layout` não é importado por nenhum componente (verificado). É código morto que
publica um valor **errado** para quem consultar. Remover ou alinhar.

### 2.3 Breakpoints arbitrários repetidos

Existem 3 ocorrências de `min-[1680px]`, 4 de `[390px]`, além de `min-[360px]`,
`min-[1400px]`. Cada um tem justificativa medida e documentada — `1680px` é o
limiar do `WhatsappFloat`, `390px` é a quebra da caixa de contexto do hero.
O problema é que **nenhum deles tem nome**: `src/styles/breakpoints.ts` existe e
não os contém.

**Correção (V1.1):** nomear em `breakpoints.ts` (`floatSafe: 1680`, `phoneLg: 390`)
e usar `min-[theme(...)]`. Torna a decisão rastreável.

### 2.4 Componentes visualmente iguais, implementados de forma diferente

O padrão **abas** aparece em quatro lugares — hero, `#sintomas`, `#diagnostico`,
`#atuacao` — com o mesmo contrato ARIA (`tablist`/`tab`/`tabpanel`, setas,
`Home`/`End`, roving `tabIndex`) implementado **quatro vezes**, cada uma dentro
da sua seção.

Isso foi decisão consciente ("não um componente novo de carrossel genérico",
`hero-section.tsx`) e tem uma vantagem real: cada seção controla a própria
composição. Mas o custo já aparece: os cinco pares de contraste abaixo de AA de
`09-acessibilidade.md` §2 estão em **três dessas quatro** implementações — é o
mesmo erro cometido três vezes porque não há um lugar só onde corrigir.

**Não é refatoração para V1.1.** É item de V2: extrair o *comportamento* (hook
`useTabs` com teclado e ARIA) mantendo a *aparência* em cada seção.

### 2.5 Valores arbitrários mais repetidos

`[2px]` ×31 · `[3px]` ×20 · `[2.75rem]` ×16 (o alvo de 44px) · `[9px]` ×8.

Os três primeiros são candidatos óbvios a token: `hairline-strong` (2px),
`radius-xs` (3px) e `min-h-touch` (2.75rem). O último (44px como
`[2.75rem]`) é o mais importante — é um requisito de acessibilidade escrito
como número solto dezesseis vezes.

## 3. Estilos globais frágeis

- `* { @apply border-line }` no `@layer base` — define cor de borda para **todo
  elemento**. Funciona, mas significa que qualquer `border` sem cor herda a cor
  clara, inclusive em superfície escura. Hoje as seções escuras sempre declaram
  `border-white/NN`, então não há sintoma. É uma armadilha latente.
- `html { scroll-smooth }` global — já causou problema na ferramenta de captura
  (documentado) e interage com `scroll-padding-top`. Correto para o produto,
  mas precisa continuar anotado.
- `.reveal` depende de `:root[data-js='on']` gravado por script inline. Solução
  boa e deliberada; **não tocar**.
- `globals.css` tem **1.081 linhas**, das quais boa parte é documentação em
  comentário. O conteúdo é valioso; o formato começa a pesar. Candidato a divisão
  por assunto na V2 (`hero.css`, `motion.css`, `components.css`).

## 4. Estrutura mínima de um sistema de design para a V2

Não implementar agora. É o alvo:

```
src/styles/
  tokens/
    color.ts          cores + a regra do amarelo como função (`accentOn(surface)`)
    type.ts           escalas + o registro do tailwind-merge derivado daqui
    space.ts          espaçamento + os 4 níveis de Section
    radius.ts         none · xs(3) · sm(8) · full   ← alinhado à realidade
    elevation.ts      as 6 sombras
    motion.ts         3 curvas + 5 faixas de duração nomeadas
    breakpoint.ts     inclusive os arbitrários nomeados
    touch.ts          minTarget = 2.75rem
  primitives/         Button, Link, Field, Card, Panel, Accordion, Tabs
  patterns/           SectionHeader, MediaFigure, DeliverableList, ProofRecord
```

Três regras que o sistema precisa carregar como **código**, não como comentário:

1. **`accentOn(surface)`** — hoje "amarelo é preenchimento em fundo claro e texto
   em fundo escuro" é uma regra escrita em `colors.ts` e cumprida à mão em cada
   componente. Como função, deixa de depender de disciplina.
2. **`Tabs`** — o comportamento das quatro seções de aba, num lugar só (§2.4).
3. **`minTarget`** — os 44px como token, não como `[2.75rem]` repetido.

## 5. Risco de manutenção — avaliação honesta

| área | risco |
| --- | --- |
| cores e tipografia | **baixo** — centralizadas e documentadas |
| motion | **baixo** — três curvas, disciplina cumprida |
| raios e breakpoints | **médio** — token diverge do uso |
| abas | **médio** — quatro cópias do mesmo contrato |
| `hero-section.tsx` (1.172 linhas) | **médio-alto** — ver `10-performance-front-end.md` §6 |
| `globals.css` (1.081 linhas) | **médio** |
| documentação (`CLAUDE.md`) | **médio** — três divergências entre doc e código, ver `12-backlog-priorizado.md` P2-08 |

O sistema não impede a V2. Os três itens de médio risco (raios, breakpoints,
abas) são refatorações seguras e isoladas.
