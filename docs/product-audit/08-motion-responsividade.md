# 08 — Motion e responsividade

## 1. Inventário de motion (extraído do CSS computado da home)

| componente | gatilho | duração | easing | propriedades | função | reduced-motion | avaliação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `.nav-link` (×41) | hover/focus | 200ms | `precise` | color, bg, border | resposta | herda o global | **preservar** |
| setas e abas (×30) | hover/focus | 150ms | `precise` | color, bg | resposta | herda | **preservar** |
| seta do CTA (×27) | hover do grupo | 200ms | `precise` | transform | direção | herda | **preservar** |
| botão (`::before`, ×12) | hover/`focus-visible` | 200–280ms | `precise`/`smooth` | bg, border, color, shadow, transform | preenchimento | herda | **preservar** |
| régua de aba ativa (×9) | troca | 260ms | `precise` | transform | estado | herda | **preservar** |
| `.reveal` (18 no DOM) | IntersectionObserver | 550/650ms | `smooth`/`premium` | opacity, transform | revelação editorial | ✅ neutralizado | **preservar** |
| `.hero-seq` | carga, 1× | 420ms + `--seq` 120–800ms | `premium` | opacity, transform | composição de entrada | ✅ `animation:none` | **preservar** |
| `.hero-curtain` | carga, 1× | 960ms, delay 160ms | `smooth` | transform (polígono do painel) | revelação da fotografia | ✅ `display:none` | **preservar** |
| `.hero-slide-media` | troca de pilar | 700ms | `smooth`+`premium` | opacity, transform 1,5% | substituição | ✅ `transition:none` | **preservar** |
| `.hero-slide-out` / `-content` | troca de pilar | 190 + 460ms | `precise`/`smooth` | opacity, transform | saída e entrada do texto | ✅ + rede de segurança | **preservar** |
| `.photo-mask` (×5) | IO no elemento-pai | 560ms | `premium` | clip-path | entrada de fotografia | ✅ `clip-path:none` | **preservar** |
| `.line-mask` | IO no pai | 650ms | `premium` | clip-path | linha do método | ✅ | **preservar** |
| `.panel-photo` (×6) | troca de aba | 260ms | `precise`/`premium` | opacity, transform | troca sem piscar | ✅ | **preservar** |
| `.panel-wipe` (×4) | troca de nível | 460ms | `premium` | clip-path, opacity | cortina do painel | ✅ bloco próprio | **preservar** |
| `.scope-panel-in` (×4) | troca de aba | 260ms | `premium` | opacity, transform | entrada do painel | ✅ global 0,01ms | **preservar** |
| `.media-zoom img` (×3) | hover | 600ms | `smooth` | transform ≤1.03 | vida na fotografia | ✅ bloco próprio | **preservar** |
| faixa de metadados do projeto (×3) | hover/focus-within | 320ms | `premium` | transform | revelar segmento | ✅ `motion-reduce:` | **preservar** |
| hairline do pilar (×3) | hover | 300ms | `smooth` | **`width`** | crescer o traço | herda | **padronizar** → `transform: scaleX` |
| régua de `#atuacao` (×5) | troca | 260ms | `precise` | **`all`** | estado | herda | **padronizar** → propriedades explícitas |
| `.skip-link` | focus | 200ms | `precise` | `top` | acessibilidade | herda | **preservar** |
| autoplay do hero | temporizador 6s | — | — | troca de slide | demonstrar 3 pilares | ✅ não roda | **redesenhar** (§2) |

### Verificação dos limites do projeto

| regra de `CLAUDE.md` | cumprida? |
| --- | --- |
| três curvas, e só três | ✅ — só `0.4,0,0.2,1`, `0.22,1,0.36,1` e `0.16,1,0.3,1` aparecem no CSS computado |
| faixas de duração (120–1.100ms) | ✅ — mínimo 150ms, máximo 960ms (cortina) |
| sequência do hero uma vez só | ✅ — `settled` desliga `hero-seq` após a primeira troca |
| quatro variantes de `Reveal` | ✅ — `up`, `side`, `settle`, `line` todas presentes no DOM |
| nada em laço, nada pulsando | ✅ — nenhuma `animation-iteration-count` diferente de 1 |
| sem parallax, sem cursor customizado | ✅ |
| nenhuma biblioteca de animação | ✅ — dependências: `clsx`, `next`, `react`, `react-dom`, `tailwind-merge` |
| botão com quatro estados | ✅ |
| `prefers-reduced-motion` completo | ✅ — nenhum conteúdo fica invisível; a cortina some (`display:none`), o autoplay para, as máscaras abrem |

**Este é o capítulo mais bem executado do projeto.** A disciplina de motion é
melhor do que a de qualquer outra dimensão auditada.

## 2. Os dois problemas de motion

### 2.1 Autoplay sem pausa — o único defeito real

Ver `04-auditoria-home.md` §0.2b. Medido: t=0 "Projetar para a operação real.",
t=7s "Equipar com retorno calculado.", t=14s "Estruturar a operação que vende."
Nenhum dos botões do hero pausa. **WCAG 2.2.2, nível A.**

A modernidade do site não depende disso: a primeira dobra é forte **parada**.

### 2.2 Duas propriedades animadas fora do padrão

- `transition-[width]` na hairline de `#pilares` (3×) — anima layout, não
  composição. Trocar por `scaleX` é gratuito.
- `transition: all` na régua de `#atuacao` (5×) — a única `all` do projeto;
  anima propriedades que ninguém pediu.

Impacto perceptível: nenhum. Impacto de manutenção: é o tipo de exceção que se
multiplica. Item de V1.1 por ser trivial.

## 3. Responsividade — 11 viewports verificados

| viewport | overflow horizontal | altura da home | hero cabe na dobra? | observação |
| --- | --- | --- | --- | --- |
| 1920 × 1080 | **0** | 16.937 | ✅ | `WhatsappFloat` visível (único acima de 1680) |
| 1680 × 992 | **0** | 16.694 | ✅ | limiar do flutuante |
| 1586 × 992 | **0** | 16.528 | ✅ | viewport do mockup |
| 1440 × 900 | **0** | 16.222 | ✅ | |
| 1366 × 768 | **0** | 15.947 | ✅ | o mais apertado do desktop; `--u` limitado pela altura |
| 1280 × 800 | **0** | 15.821 | ✅ | |
| 1024 × 768 | **0** | 16.186 | ✅ | `--u` limitado pela largura |
| 768 × 1024 | **0** | **23.437** | ❌ hero = 1.399px | seletor 325px abaixo da dobra |
| 390 × 844 | **0** | **26.304** | ❌ hero = 1.229px | seletor 327px abaixo |
| 360 × 800 | **0** | **27.122** | ❌ hero = 1.348px | seletor 490px abaixo |
| 320 × 800 | **0** | **28.295** | ❌ hero = 1.321px | seletor 463px abaixo |

**Zero overflow horizontal em todas as onze larguras.** Verificado por
`scrollWidth − clientWidth` no `documentElement`, com varredura de elementos
transbordantes. Isso é resultado de trabalho anterior (as armadilhas de
`transform`/`clip-path` documentadas em `CLAUDE.md`) e deve continuar sendo
verificado a cada mudança.

## 4. O mobile é uma composição própria?

**Parcialmente.** Há adaptação real, não só empilhamento:

- o hero troca o painel diagonal por fotografia em fluxo + faixa grafite;
- o módulo de pilares muda de superfície (claro → escuro) e de montagem
  (setas em fileira própria);
- `#projetos` passa de 3 colunas para 2 a partir de 640px, cortando ~35% de altura;
- a linha do método vira lista;
- pisos de altura medidos por faixa (320 / 360–767 / ≥768) para evitar shift.

Mas o resultado agregado não fecha:

**A home mobile tem 26.304px — 1,65× a home desktop e cerca de 31 alturas de
tela.** O tablet, 23.437px, é 22,9 dobras. Isso não é "mobile como composição
própria"; é a mesma narrativa de 14 seções esticada verticalmente.

Três consequências:

1. **A prova, que abre em 20,5% no desktop, abre em ~21% no mobile — mas isso são
   5.400px.** O visitante precisa rolar 6 telas para chegar à evidência.
2. **A única entrada de WhatsApp em fluxo está a ~24.700px.**
3. **O carrossel do hero é invisível** (§ `04` §0.2a).

**Diagnóstico de natureza:** não é problema de *breakpoint* (o layout responde
corretamente em todas as larguras), nem de *escala* (a tipografia comprime bem),
nem de *altura de conteúdo* isolada. É **problema de composição mobile**: a
decisão de página única de 14 seções foi tomada para o desktop e herdada pelo
telefone sem redução de escopo.

**Caminho para a V2** (não implementar agora): decidir quais seções a home mobile
**resume e linka** em vez de exibir por inteiro. Candidatas naturais, pela
análise de `04`: `atuacao` (5 níveis → 1 parágrafo + link para `/solucoes`),
`industria-do-inox` (→ faixa de desvio) e a fusão `quem-conduz`+`leonardo`.
Estimativa: −6.000 a −8.000px sem perder nenhuma informação do site.

## 5. Verificações específicas de mobile

| item | estado |
| --- | --- |
| menu mobile: abre, foca o primeiro link, trava `body`, Escape fecha e devolve o foco | ✅ verificado |
| retenção de foco (Tab/Shift+Tab não escapam) | ✅ implementada |
| alvos de toque | 4 abaixo de 44px em todo o site — ver `09` §3 |
| teclado virtual em `/contato` | campos com `inputMode` e `autoComplete` corretos ✅ |
| safe areas | `env(safe-area-inset-*)` usado no `WhatsappFloat` ✅ (mas ele é `hidden` abaixo de 1680) |
| elementos fixed/sticky | apenas o cabeçalho; `100dvh` no painel do menu ✅ |
| textos em duas/três linhas | pisos de altura medidos por faixa ✅ |
| alturas pequenas (768 de altura) | `--u` limitado pela altura resolve; hero cabe ✅ |
