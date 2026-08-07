# Design System — governança visual

```text
STATUS: ACTIVE (base de governança) — partes marcadas "A DEFINIR NO GATE 2" NÃO são decisão
```

Este documento **não propõe** um design novo para a V2. Ele registra o que já existe e está
confirmado no código/identidade da V1 — que a V2 herda como ponto de partida por decisão
congelada (`MASTER_BIANCHINI.md` §23: identidade grafite/off-white/amarelo, Manrope +
Oswald, precisão premium/industrial são decisões congeladas, não abertas para V2). Qualquer
tema marcado `A DEFINIR NO GATE 2` é isso mesmo: não decidido, não uma opinião congelada por
omissão. Gate 2 (direção visual) é a etapa que resolve esses temas, com wireframe e
aprovação humana — nenhum deles é resolvido aqui.

Fonte técnica dos tokens: `src/styles/` (`colors.ts`, `typography.ts`, `spacing.ts`,
`radius.ts`, `shadows.ts`, `animations.ts`, `breakpoints.ts`, `theme.ts`, `tokens.ts`).
Fonte de composição visual da V1: `MOCKUP_HERO_APROVADO.png` (raiz) +
`GUIA_COMPLETO_DO_SITE_BIANCHINI.md` + `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`. A V2 não
tem mockup próprio ainda — isso é Gate 2.

---

## 1. Princípios visuais já confirmados (herdados da V1, decisão congelada)

- Conceito: precisão industrial com inteligência operacional e presença premium
  (`MASTER_BIANCHINI.md` §8). Não deve parecer template de IA, PDF convertido, catálogo
  industrial antigo, e-commerce genérico, agência ou startup.
- Identidade grafite/off-white/amarelo — ver paleta (§2). Não neon, não glassmorphism, não
  holograma, não executivo genérico, não aparência artificial em conteúdo de prova
  (`MASTER_BIANCHINI.md` §7).
- Cada seção responde a cinco perguntas antes de existir: qual é a mensagem, qual é a
  prova, qual é a massa visual, qual é a interação, qual é o próximo passo.

## 2. Cores (tokens já existentes, `src/styles/colors.ts`)

| Token | Valor | Papel |
| --- | --- | --- |
| `graphite` | `#101010` | institucional — cabeçalho, seções escuras |
| `graphite-deep` | `#0A0B0C` | variação escura |
| `graphite-soft` | `#1A1A1A` | variação suave |
| `graphite-line` | `#2C2C2C` | linha sobre grafite |
| `canvas` | `#EFEDEB` | superfície clara padrão |
| `canvas-deep` | `#E6E3DE` | superfície clara, variação |
| `surface` | `#FFFFFF` | superfície branca |
| `ink` | `#101010` | texto principal |
| `muted` | `#5B6065` | texto auxiliar (5,6:1 sobre `canvas`) |
| `steel` | `#8C9095` | decorativo — não usar para texto auxiliar |
| `line` | `#DCD9D4` | linha/divisor decorativo |
| `yellow` | `#F5C64B` | ação/acento |
| `yellow-bright` | `#FFE379` | amarelo do site oficial |
| `yellow-deep` | `#D9A61B` | variação escura |

**Regra do amarelo (não é opcional, herdada e vale para V2):** sobre `canvas`, `yellow` dá
1,4:1 de contraste — reprova para texto. Em superfície clara, amarelo só entra como
preenchimento (CTA primário, marca-texto) ou hairline decorativa; nunca como texto corrido
nem indicador de estado. Sobre `graphite`/`ink`, `yellow` dá 11,8:1 — livre para texto de
etiqueta, marcador e índice ativo em fundo escuro. Estado ativo em fundo claro é sempre
grafite, inclusive em preenchimento de controle (nó ativo, régua de progresso).

## 3. Tipografia (tokens já existentes)

Duas famílias, papéis fixos, sem serifada no projeto:

- **Manrope** (`font-sans`) — leitura e interface: H1–H4, parágrafos, navegação, campos.
- **Oswald** (`font-condensed`) — só rótulo comercial/técnico curto: botão, etiqueta de
  seção, numeral de métrica, índice, cota. Nunca em texto corrido nem em título.

Escalas customizadas já registradas em `tailwind-merge` (`src/lib/utils.ts`): `text-display`,
`text-title-1..3`, `text-lead`, `text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`,
`text-numeral`. Qualquer escala nova precisa ser registrada no mesmo grupo `font-size`, ou o
merge a interpreta como cor e descarta o tamanho.

## 4. Grid / container / espaçamento

- `Container`, `Section` e `SectionHeader` (`src/components/layout/`) são os primitives de
  layout estrutural — preservar até existir necessidade comprovada de variação.
- Espaçamento estrutural em `src/styles/spacing.ts`; não introduzir valor de tema ad hoc em
  página/seção quando já existir token equivalente.
- A primeira dobra do hero da V1 usa uma unidade própria (`--u`, ver `CLAUDE.md`,
  "Armadilhas conhecidas") — isso é geometria específica do hero **da V1**. A V2 não herda
  automaticamente essa mecânica para o hero de Equipamentos; é um dos temas de Gate 2.

## 5. Estados

Botão tem quatro estados obrigatórios, sempre: padrão, hover, `focus-visible`, `active`. O
preenchimento de hover é `transform: scaleX/scaleY` sobre um `::before`, nunca `width`; o
`focus-visible` dispara o mesmo preenchimento do hover. Anel de foco segue a superfície:
grafite em fundo claro, cor de acento em fundo escuro.

Todo controle de navegação interna (abas, seletor) precisa de três coisas: caixa própria,
hover que não troca conteúdo, e estado ativo com pelo menos três sinais (um não-cromático).

## 6. Motion

Três curvas, só três (`src/styles/animations.ts`):

| curva | cubic-bezier | para quê |
| --- | --- | --- |
| `precise` | `0.4, 0, 0.2, 1` | resposta, hover, foco, pressão |
| `smooth` | `0.22, 1, 0.36, 1` | entrada de conteúdo, troca de estado |
| `premium` | `0.16, 1, 0.3, 1` | revelação editorial |

Faixas de duração: microinterações 160–240ms; painéis/imagens 240–420ms; deslocamento
8–16px; zoom fotográfico até ~1,03×. `prefers-reduced-motion` é requisito: nenhum conteúdo
pode ficar invisível, nenhuma máscara permanece fechada. Evitar: bounce, parallax agressivo,
autoplay incontrolável, texto animado palavra a palavra, cursor customizado. Nenhuma
biblioteca de animação — CSS/Tailwind apenas.

## 7. Acessibilidade

- Uma `h1` por rota; hierarquia semântica sem pular nível.
- Teclado funcional em toda interação, incluindo aba/carrossel (`role="tablist"`, setas,
  `Home`/`End`).
- Foco visível em todo elemento interativo, nos dois fundos.
- Touch targets ≥ 44×44px (exceções documentadas e deliberadas, como o checkbox de
  consentimento de 24px com `label` associado, seguem o mínimo WCAG 2.2 AA 2.5.8).
- Contraste mínimo 4,5:1 para texto.
- Zero overflow horizontal nos viewports de referência (§9).
- ARIA só quando necessária e semanticamente correta.

## 8. Regras de imagem

- Sempre `next/image`, com `sizes`; `fill` exige pai `relative` com altura ou `aspect-*`.
- Logos: `object-contain`. Fotos: `object-cover`.
- **Render vs. fotografia:** render nunca é descrito como obra entregue
  (`docs/v2/DECISIONS.md`, DEC-008). Planta/documento é rotulado como documento.
- Ordem de evidência visual: fotografia real > fotografia de campo > planta/documento real
  > render real identificado > material licenciado de apoio > IA (só quando o contexto
  deixar claro que é comunicação/conceito) — nunca nas seções de prova ou de conversão
  direta sem identificação.
- `quality` de `<Image>` precisa constar em `images.qualities` (`next.config.ts`) — fora da
  lista, o otimizador responde 400 e a imagem some sem aviso.

## 9. Critérios responsivos

Viewports de referência (`MASTER_BIANCHINI.md` §10): 1920×1080, 1680×992, 1586×992,
1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 390×844, 360×800, 320×800.

- Mobile não é desktop comprimido — composição própria.
- Conteúdo essencial nunca depende de hover.
- Zero overflow horizontal em qualquer largura de referência.

## 10. A DEFINIR NO GATE 2

Estes temas **não têm decisão** ainda. Não tratar nada abaixo como padrão implícito:

- Composição/wireframe do hero de Equipamentos da V2 (a geometria `--u` da V1 é específica
  do hero atual, não herdada automaticamente).
- Peso visual assimétrico exato entre Equipamentos e Projetos/Consultoria na seção "Do
  projeto à execução" (a regra de que Equipamentos é maior está decidida; a amplitude
  exata — tamanho de cartão, proporção — não está).
- Tratamento visual da vitrine de categorias (seção 2 da Home V2): grade, carrossel,
  lista — nenhum escolhido.
- Qualquer token novo de cor, tipografia, espaçamento ou radius que a V2 venha a precisar
  além dos já listados aqui.
- Direção de imagem específica para o hero de Equipamentos (qual fotografia, enquadramento).
- Variante de `Reveal` (`up`/`side`/`settle`/`line`) para cada seção nova da V2.
