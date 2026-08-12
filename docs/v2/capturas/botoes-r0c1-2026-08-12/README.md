# R0-C.1 — sistema global de botões (G-6) e o NAV CTA sem ícone

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `b7b456a`
**Escopo:** conformidade do componente compartilhado `Button` e a decisão final sobre o
ícone do NAV CTA. Nenhuma copy, destino, posição, altura ou hierarquia foi alterada.

## Por que esta rodada existiu

R0-C corrigiu o CTA do cabeçalho localmente **porque a variante global não servia**: a
verificação exigida pelo briefing daquela rodada mostrou que o `Button` compartilhado
divergia da própria norma em três pontos. Adotar a variante teria importado os defeitos.

Isso deixou o cabeçalho conforme e o sistema não — e como o `Button` veste 36 botões
renderizados em 15 rotas, qualquer congelamento de seção posterior ficaria refém de uma
mudança global futura. Daí R0-C.1 vir antes de R0-D.

## Inventário — o que existe, e o que era afetado

Varredura estática de `src/**/*.tsx`: **38 instâncias**, 24 arquivos.

| papel | instâncias | variantes |
| --- | ---: | --- |
| PRIMARY | 21 | `primary` (20, sendo 9 implícitas) + `light` (1) |
| SECONDARY | 10 | `secondary` (8) + `light-outline` (2) |
| WHATSAPP | 4 | `whatsapp` (2) + `whatsapp-light` (2) |
| NAV CTA | 1 | `HeaderCta` |
| **V1 órfã** | **2** | `HeroPrimaryCta` / `HeroSecondaryCta` |

**As duas últimas não renderizam.** `sections/hero-section.tsx` é a dobra da V1 e não é
importada por rota nenhuma desde que a V2 passou a usar `v2/hero-stage.tsx` — confirmado
por varredura de imports. Ficaram **fora** de G-6: `CLAUDE.md` congela a V1, e alterá-las
não muda um pixel do que está no ar. São hoje as únicas referências vivas a `shadow-cta`;
se a V1 sair, o token sai junto. Está marcado no próprio arquivo.

Sobram **36 instâncias renderizadas**, e todas passaram a compartilhar uma gramática só.

## G-6 — antes → depois

| | antes | depois |
| --- | --- | --- |
| raio | `3px` na `base` | **`2px`** (doc 01 §7.1: o único do sistema) |
| preenchimento | `scaleX` da esquerda em `primary`/`light`; `scaleY` da base nas outras | **`scaleY` da base em todas** |
| tempo do preenchimento | 280ms `smooth` | **220ms `precise`** (§8) |
| sombra | `shadow-cta` (`0 8px 18px -10px` a 45%) em `primary`/`light` | **nenhuma** — 18px a 45% está fora da whitelist de §14.1 |
| elevação de hover | `-translate-y-[2px]` em `primary`/`light` | **removida** — era o par da sombra |
| pressão | `translate-y` numas, `bg-yellow-deep` noutras | **`scale(0.985)` em 120ms `precise`** em todas (§8) |
| foco | já disparava o preenchimento | mantido, e agora **idêntico** ao hover em 100% dos alvos |

`active:bg-yellow-deep` saiu porque §8 proíbe trocar `background-color` como sinal de
estado — o mecanismo é o preenchimento por `transform`.

A transição tem **duas velocidades de propósito**: cor e borda em 200ms (troca de estado),
pressão em 120ms (resposta). Um único `transition-*` do Tailwind não expressa isso e
encadear dois utilitários não funciona — ambos escrevem `transition-property` e o merge
mantém só o último. Daí a propriedade arbitrária na `base`.

## Medição

Build de **produção**, Chromium 151 headless, `deviceScaleFactor: 1`, `--hide-scrollbars`.
Harness em `medicoes/measure-g6.mjs`. Ele reconhece botão **por construção** — um `a` ou
`button` cujo `::before` é a camada de preenchimento — e não por nome de classe, de modo
que nenhum botão escapa da varredura por ter recebido `className` próprio.

### Resultado

**0 fora da norma**, em 12 combinações rota × viewport:

| viewport | home | contato | soluções | projetos | linhas | obrigado |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1440 | 10 ✅ | 4 ✅ | 7 ✅ | 5 ✅ | 12 ✅ | 3 ✅ |
| 390 | 9 ✅ | 3 ✅ | 6 ✅ | 4 ✅ | 11 ✅ | 2 ✅ |

O critério de cada botão: raio `2px` · `box-shadow: none` · `::before` em `scaleY(0)` com
origem na base · 220ms · `cubic-bezier(0.4, 0, 0.2, 1)`.

### Estados, por papel (1440)

Um alvo por papel em cada rota, medido em repouso → hover → focus-visible → active:

- **preenchimento**: `matrix(1,0,0,0,0,0)` → `matrix(1,0,0,1,0,0)` em todos;
- **foco = hover**: `true` em **todos** os alvos, com `:focus-visible` confirmado;
- **pressão**: `matrix(0.985, 0, 0, 0.985, 0, 0)` em todos;
- **caixa**: Δ **0,0** entre repouso e hover em todos — nenhum botão muda de tamanho ao
  interagir.

## NAV CTA — sem ícone

Doc 01 §8 sempre listou o papel 5 como "sem ícone" e §17.4 dizia que "o layout do
cabeçalho não muda". As duas conviviam e a seta ficava no meio. A direção resolveu em
favor de §8; a redação de §17.4 foi corrigida para que exista **uma** regra.

| viewport | antes | depois | Δ | vão nav↔cta | faixa | marca = `h1` |
| ---: | ---: | ---: | ---: | ---: | ---: | :---: |
| 1024 | 198,7 × 40 | **170,7 × 40** | −28,0 | 30,7 | 76,4 | ✅ |
| 1366 | 209 × 40 | **181 × 40** | −28,0 | 41,0 | 80 | ✅ |
| 1440 | 209 × 40 | **181 × 40** | −28,0 | 43,2 | 80 | ✅ |
| 1600 | 209 × 40 | **181 × 40** | −28,0 | 48,0 | 80 | ✅ |
| 1920 | 209 × 40 | **181 × 40** | −28,0 | 48,0 | 84 | ✅ |

Os 28px são a seta (16px) mais o `gap-3` (12px). **A largura não foi recomposta com
recuo** — a anatomia é a do papel 5. Altura da faixa, vão até a navegação e guia
horizontal ficaram idênticos; zero overflow em todas.

## Hero — regressão

A dobra congelada usa CTAs próprios (`v2/hero-stage.tsx`), fora do `Button` compartilhado.
Medido depois de G-6, contra o registro de R0-B:

| | valor | esperado |
| --- | --- | --- |
| CTA primário | 326 × 58, raio 2px, sombra `none` | idêntico |
| CTA WhatsApp | 250,8 × 58, contorno, glifo verde | idêntico |
| razão PRIMARY × WhatsApp | **1,300** | 1,300 |
| portas | 470,2 / 408,9 / 408,9 | idêntico |
| razão das portas | **1,15** | 1,15 |
| régua da porta ativa | `3px rgb(245,198,75)` | idêntico |
| régua das inativas | `2px rgba(239,237,235,0.2)` | idêntico |
| sombra nas portas | `none` | `none` |

**HERO REGRESSION CHECK: PASS.** Nada foi editado em `hero-stage.tsx` nem no módulo dela.

## Saúde e acessibilidade

Overflow **0**, imagens quebradas **0**, `href` vazio **0**, âncora quebrada **0** — nos
oito viewports (320 a 1920). Console errors **0**, HTTP ≥400 **0**.

`prefers-reduced-motion`: as durações caem para ~0 (o corte global de `globals.css`) e a
pressão é cancelada por `motion-reduce:active:scale-100` — o **valor**, não só o tempo.
Nenhum botão fica invisível.

---

## Quatro armadilhas do instrumento, registradas

Nenhuma era defeito do produto, e cada uma produziu uma conclusão falsa antes de ser
identificada. Ficam aqui porque a próxima rodada que medir botões vai encontrá-las de novo.

1. **`transform-origin` × `getBoundingClientRect`.** O `::before` é `inset: 0`, então a
   caixa dele é a de **recuo** — altura menos as duas bordas. Comparar a origem com a
   altura border-box acusa divergência em todo botão contornado. Sintoma falso: *"metade
   dos botões fora da norma"*.
2. **Medir `active` com um clique de verdade.** Pressionar e soltar sobre o alvo dispara
   navegação de cliente; a árvore é trocada e as referências guardadas viram nós órfãos,
   que medem `0×0`. Sintoma falso: *"botão sem caixa"*. O release passou a acontecer longe
   do alvo.
3. **`focus()` rola a página.** O ponteiro calculado antes do foco erra o alvo depois
   dele. Sintoma falso: *"a pressão não funciona"*. O ponto é recalculado antes de
   pressionar.
4. **Servidor de produção dessincronizado do build.** Um `next start` que sobrevive a um
   `npm run build` serve HTML de um build e assets de outro: o CSS responde **400** e a
   página renderiza sem estilo, com `document.styleSheets` ainda contando as folhas. Um
   botão de 243 × 50 sai como 161 × 17 e a fonte cai para Times New Roman. Sintoma falso:
   *"o botão perdeu o padding"*. O harness agora **aborta** se a família do rótulo não for
   a do sistema, em vez de gravar evidência inválida.

Todos os números desta pasta vêm de uma passada única, em navegador recém-aberto, contra
um servidor cujo CSS foi verificado respondendo 200.
