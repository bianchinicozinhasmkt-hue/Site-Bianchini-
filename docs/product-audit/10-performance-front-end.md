# 10 — Performance e arquitetura front-end

Medido contra o build `pAuHB26fH_vBqjacZLUpI`, servido por `next start`, com
**cache desligado**. Desktop: 1440×900, CPU 1×, rede local. Mobile: 390×844,
CPU 4×, 1,6 Mbps / 150ms de latência.

## 1. Saída do build

```
Route (app)                                          Size  First Load JS
┌ ○ /                                             12.9 kB         140 kB
├ ○ /contato                                       5.1 kB         122 kB
├ ○ /solucoes/cozinhas-industriais                2.91 kB         121 kB
└ … 16 rotas restantes                          ≤ 910 B     103–128 kB
+ First Load JS shared by all                      103 kB
```

**Todas as 19 rotas são estáticas (`○`).** 103 kB de JS compartilhado é bom para
Next 15 + React 19. Nenhuma dependência supérflua: `clsx`, `next`, `react`,
`react-dom`, `tailwind-merge`. Zero biblioteca de animação, zero biblioteca de
ícones.

## 2. Métricas de campo simuladas

| rota | ambiente | LCP | FCP | CLS | payload | elemento do LCP |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | desktop | 1.460ms | 984ms | **0** | **1.085 KB** | logo (`w=256`) |
| `/projetos` | desktop | 340ms | 340ms | 0,0005 | 496 KB | `h1` |
| `/contato` | desktop | 256ms | 256ms | 0 | 277 KB | `h1` |
| `/solucoes/cozinhas-industriais` | desktop | 288ms | 288ms | 0 | 353 KB | foto do hero da página |
| `/linhas-de-produtos` | desktop | 252ms | 252ms | 0,0002 | 315 KB | `h1` |
| `/leonardo-bianchini` | desktop | 308ms | 308ms | 0 | 302 KB | retrato |
| `/` | mobile 3G | **2.196ms** | 2.196ms | **0** | 529 KB | `hero-industrial-kitchen.png` (w=640) |
| `/projetos` | mobile 3G | 900ms | 900ms | 0 | 344 KB | parágrafo |
| `/contato` | mobile 3G | 956ms | 956ms | **0,2266** ❌ | 253 KB | parágrafo |
| `/solucoes/cozinhas-industriais` | mobile 3G | 1.120ms | 1.120ms | 0 | 302 KB | `h1` |
| `/linhas-de-produtos` | mobile 3G | 812ms | 812ms | 0 / 0,1278 * | 266 KB | parágrafo |
| `/leonardo-bianchini` | mobile 3G | 908ms | 908ms | 0 | 287 KB | parágrafo |

\* medido 0,1278 numa passagem e 0 em outra — instável, provavelmente troca de
fonte. Marcado como "investigação necessária", não como achado confirmado.

**Leitura:** LCP está bom em todas as rotas. **CLS da home é 0** — resultado
direto dos pisos de altura medidos no hero e nos painéis de aba; é um acerto de
engenharia que deve ser preservado. O único CLS ruim é `/contato`.

## 3. O achado principal: o hero baixa 6 fotografias para mostrar 1

Medido, cache frio, contando só requisições de `/images/hero/`:

| viewport | total | detalhe |
| --- | --- | --- |
| **1440 × 900** | **494 KB** | `linha-de-coccao` em **três** resoluções (w=1080 desktop, w=640 mobile, w=828 `#equipamentos`) · `hero-industrial-kitchen` w=640 · `operacao-comercial` w=640 · `bar-em-inox` em duas |
| **390 × 844** | **288 KB** | os 3 slides pela instância mobile (w=640) **+ os mesmos 3 pela instância desktop** (w=384) |

Duas causas somadas:

1. **Duas instâncias no DOM.** A fotografia do hero é renderizada duas vezes —
   painel diagonal (`lg`) e caixa em fluxo (`< lg`) — e as duas existem sempre.
   O `sizes` inverso (`(max-width:1023px) 1px, 60vw` e o oposto) foi feito
   exatamente para impedir o download cruzado, mas **não funciona**: o `srcset`
   que o `next/image` gera para imagem `fill` começa em **w=640**, então "1px"
   resolve para a menor candidata disponível — 640px, não 1px. Medido: 148 KB
   inúteis no desktop, ~76 KB no mobile.
2. **`loading="eager"` nos slides inativos.** Correto pelo motivo documentado
   (o lazy nativo não busca imagem de carrossel com `opacity: 0`), mas
   multiplica por 3.

**Correções possíveis, por risco:**

| opção | ganho estimado | risco |
| --- | --- | --- |
| renderizar só a instância da largura atual (média query no servidor não existe; exige `<picture>` com `source media` ou um único elemento com `object-position` responsivo) | −148 KB desktop / −76 KB mobile | **médio** — mexe na geometria do hero |
| carregar os slides 2 e 3 só depois de `load` (ou na primeira interação) em vez de `eager` | −137 KB no caminho crítico | **baixo** |
| declarar `imageSizes` menores em `next.config.ts` para o truque do `1px` funcionar | −148 KB desktop | **baixo**, mas afeta todo o site |
| reusar a mesma resolução de `linha-de-coccao` entre hero e `#equipamentos` | −111 KB | **baixo** |

Recomendado para V1.1: as opções 2 e 4 (baixo risco, ~248 KB). A opção 1 é V2.

## 4. CLS de `/contato` — causa confirmada

Atribuição do `PerformanceObserver` (390×844, 4× CPU):

```
+0,2265 @4.338ms
   ASIDE.flex.flex-col.gap-8  |  350×213 → 0×0  |  "Falar agora / Prefere conversar direto?…"
```

`ContactForm` usa `useSearchParams`, o que obriga um `<Suspense>`
(`src/app/contato/page.tsx:66`). O servidor renderiza o fallback — uma linha,
"Carregando formulário…" — e a hidratação insere o formulário inteiro, empurrando
o `<aside>` para baixo.

Duas correções, ambas de baixo risco:

- **A:** reservar altura no fallback (`min-height` medida do formulário) —
  1 linha, elimina o shift;
- **B:** ler `?intencao=` sem `useSearchParams` (por `window.location` num
  `useEffect`), dispensando o `Suspense` — o formulário passa a ser renderizado
  no servidor, o que também remove o flash de "Carregando formulário…".

B é a correção certa; A é a segura para aplicar hoje.

## 5. Payload por tipo — home desktop (1.085 KB)

| tipo | KB | observação |
| --- | --- | --- |
| Imagem | **762** | 494 KB só de hero (§3) |
| Script | 198 | 103 KB compartilhado + 13 KB da rota + runtime |
| Documento | 52 | HTML da home (14 seções, muito conteúdo) |
| Fonte | 46 | Manrope 5 pesos + Oswald 3 pesos, auto-hospedadas |
| CSS | 20 | ótimo para 1.081 linhas de fonte |

**Fontes: 8 arquivos.** Manrope em 400/500/600/700/800 e Oswald em 500/600/700.
`layout.tsx` já comenta que "cada peso extra é um arquivo a mais na primeira
pintura". Verificação recomendada (não medida aqui): se 400 e 500 do Manrope, ou
600 e 700 do Oswald, forem intercambiáveis na prática, dá para cortar 2 arquivos.

## 6. Arquitetura front-end

### 6.1 Organização

`layout/` · `ui/` (com `actions/` e `typography/`) · `sections/` · `blocks/` ·
`forms/` · `animations/` · `shared/`, com conteúdo em `data/` e tokens em
`styles/`. **A separação conteúdo × apresentação é real e consistente** — nenhum
texto comercial fixo dentro de componente de seção. Isso é raro e vale muito.

### 6.2 Client Components

Sete: `header`, `mobile-menu`, `whatsapp-float`, `hero-section`, `reveal`,
`photo-reveal`, `contact-form`, mais as seções com aba (`symptoms`, `diagnosis`,
`scope`). Todo o resto é Server Component. Correto e disciplinado.

### 6.3 Tamanho e acoplamento

| arquivo | linhas | avaliação |
| --- | --- | --- |
| `hero-section.tsx` | **1.172** | grande, mas **não é código ruim**: ~55% é documentação de decisões medidas. Ainda assim, concentra carrossel + duas montagens + dois módulos + geometria num arquivo só |
| `globals.css` | **1.081** | idem — a documentação vale, o formato pesa |
| `symptoms-section.tsx` | 453 | aceitável |
| `scope-section.tsx` | 422 | aceitável |
| `equipment-lines.ts` | 440 | é dado, não lógica |

**Não usar tamanho de arquivo como critério.** O que de fato é dívida:

1. **O contrato de abas está implementado 4 vezes** (hero, sintomas, diagnóstico,
   atuação) — e é por isso que a mesma falha de contraste aparece em três delas.
   Extrair `useTabs` (comportamento + ARIA) sem tocar na aparência é a
   refatoração de maior retorno do projeto.
2. **Duas instâncias da fotografia do hero** (§3) — condicional por breakpoint
   duplicando DOM e rede.
3. **Componentes de seção só usados pelas rotas órfãs** —
   `problems-section`, `process-section`, `differentials-section`,
   `testimonials-section`, `trust-section`, `comparison-section`,
   `case-study-section`, `segments-section`, `book-section`. **Todos têm
   importador** (verificado: nenhum órfão real), mas todos servem apenas rotas
   fora da navegação principal. Se as rotas antigas forem removidas na V2, ~1.200
   linhas saem junto. **Não remover agora** — as rotas estão no sitemap.
4. **`layout` em `tokens.ts` é código morto** com valor errado (ver `07` §2.2).

### 6.4 O que **não** deve ser tocado

- a geometria `--u` do hero e todo o cálculo de `sizes`/`quality`;
- `PhotoReveal` observando o elemento-pai;
- a flag `data-js` e a condição do `.reveal`;
- `overflow-hidden` nas caixas com `transform`/`clip-path`;
- `whatsappUrl()` como único caminho para `wa.me`;
- o filtro de chaves pessoais em `trackEvent`;
- `images.qualities` em `next.config.ts`.

### 6.5 Refatorações seguras × arriscadas

| seguro | arriscado |
| --- | --- |
| alinhar a escala de raios | mexer na geometria do hero |
| nomear breakpoints arbitrários | trocar as duas instâncias da foto por `<picture>` |
| trocar `transition: all` por propriedades explícitas | reordenar seções da home |
| trocar `transition-[width]` por `scaleX` | fundir `quem-conduz` + `leonardo` |
| reservar altura no fallback do `Suspense` | dividir `globals.css` |
| observar o pai no `Reveal variant="line"` | extrair `useTabs` (fazer com teste) |

### 6.6 Onde faltam testes

Não existe nenhum teste automatizado no projeto. Os quatro pontos que mais
justificam um: (1) ausência de overflow horizontal nos 11 viewports; (2) contrato
ARIA das abas; (3) contraste mínimo dos pares conhecidos; (4) `sizes`/`quality`
declarados em `images.qualities`. Todos são verificáveis por script — os desta
auditoria podem virar a base.

## 7. Classificação das oportunidades

| classe | itens |
| --- | --- |
| **ganho alto, risco baixo** | slides 2 e 3 fora do caminho crítico (−137 KB) · reservar altura no `Suspense` (CLS 0,227 → ~0) · reusar resolução de `linha-de-coccao` (−111 KB) |
| **ganho médio** | `imageSizes` menores no `next.config.ts` (−148 KB no desktop) · reduzir pesos de fonte |
| **micro-otimização** | `transition: all` → explícito · `width` → `scaleX` |
| **risco de perda visual** | instância única da foto do hero · qualquer mexida em `--u` |
| **investigação necessária** | CLS instável de `/linhas-de-produtos` mobile (0 numa passagem, 0,128 em outra) · viabilidade de CSP com nonce sem perder o pré-render |
