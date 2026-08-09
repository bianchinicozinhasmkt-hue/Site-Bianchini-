# Hero V2 — harmonia visual e funcional (2026-08-09, 2ª rodada do dia)

```text
STATUS: EVIDÊNCIA — não é fonte de direção
```

HEAD de partida: **`71a2930`** (branch `v2`).

Escopo: primeira dobra (`src/components/v2/hero-stage.tsx` + `hero-stage.module.css`),
faixa de métricas imediatamente abaixo dela, e a navegação do cabeçalho
(`.nav-link` em `src/app/globals.css`, consumida por `src/components/layout/header.tsx`).
`src/components/sections/hero-section.tsx` (componente morto) não foi tocado.

Renders contra o **build de produção** (`npm run build` + `npm run start -p 3200`),
`deviceScaleFactor` 1, fontes e imagens carregadas, via CDP em Chrome headless — sem badge
do Next Dev.

## Capturas

Por viewport (1920×1080, 1440×900, 1024×768, 390×844), com prefixo `antes-` / `depois-`:

| padrão | conteúdo |
| --- | --- |
| `{prefixo}-equipamentos-{vp}.png` | estado Equipamentos, dobra inteira |
| `{prefixo}-projetos-{vp}.png` | estado Projetos |
| `{prefixo}-consultoria-{vp}.png` | estado Consultoria |
| `{prefixo}-detalhe-ctas-{vp}.png` | recorte da linha de ação (CTA principal + WhatsApp) |
| `{prefixo}-detalhe-controles-{vp}.png` | recorte dos três controles de pilar |
| `{prefixo}-detalhe-faixa-{vp}.png` | recorte da faixa de métricas + CTA de categorias |
| `{prefixo}-detalhe-header-1440x900.png` | faixa do cabeçalho (estado de repouso) |

## 1. Controles dos três pilares — conteúdo centrado

Antes o interior de cada controle era `flex w-full items-center` com o texto em `flex-1`
e a seta em `shrink-0`: o rótulo começava a 24px da borda esquerda da trilha e a seta
terminava a 24px da direita, com até **190px de vazio entre os dois**. Era isso que fazia
a área ler como trilha solta — o conteúdo não ocupava o componente, ficava pendurado nas
pontas.

Agora o conteúdo é uma coluna centrada (`justify-content: center` + `text-align: center`
em `.railItem`), e a seta subiu para a **linha do rótulo**. Medido no build de produção,
desvio horizontal entre o centro do conteúdo e o centro da própria trilha:

```text
vp           estado         larguras        vãos        desvio do conteúdo   linha-base
1920x1080    3 estados      352/352/352     80/80       0,0 / 0,0 / 0,0      0,0
1440x900     3 estados      352/352/352     48/48       0,0 / 0,0 / 0,0      0,0
1024x768     3 estados      280/280/280     32/32       0,0 / 0,0 / 0,0      0,0
390x844      3 estados      109/77/99,3     15,6/15,6   0,0 / 0,0 / 0,0      0,0
```

Larguras iguais, vãos uniformes e grupo centrado como conjunto (herdado da rodada
anterior) seguem intactos. Nenhum card, pill, número ou divisória vertical entrou.

## 2. Linha de ação — o par de CTAs

O CTA principal era o único elemento da linha: uma massa amarela de ~295 × 58px sozinha
numa coluna de 768px. Parte da "sensação de vazio mal resolvido" vinha daí.

O segundo CTA entra ao lado, no **mesmo sistema dimensional** — medido:

```text
vp           altura CTA principal   altura CTA WhatsApp   lado a lado?
1920x1080            58                     58            sim (x 300→595 · 611→880)
1440x900             58                     58            sim (x  60→355 · 371→640)
1366x768             58                     58            sim
1024x768             58                     58            não — quebra para a 2ª linha
390x844              48                     48            não — empilham, na largura do conteúdo
768x1024             58                     58            não — empilham
```

Em 1024–1279 a coluna de leitura tem 480px e o par (295 + 16 + 269 = 580) não cabe: ele
quebra, que é a adaptação correta ali. O recuo vertical do painel passou a `lg:py-12` /
`xl:py-14` e a linha de ação a `lg:mt-10` / `xl:mt-12` para devolver 24px dos 74 que a
segunda linha acrescentou nessa faixa, sem mexer em 1440/1920.

Fundo transparente, contorno `#25D366` a 70%, ícone de WhatsApp na cela separada por um
fio — a mesma gramática do principal, um degrau abaixo em massa, então a hierarquia não
muda. O link sai por `whatsappUrl(topic)` (`lib/whatsapp.ts`), com o tópico acompanhando o
estado ativo; nenhuma URL `wa.me` escrita à mão e o número continua vindo de
`src/data/site.ts`. Evento: `whatsapp_iniciado` (já existente — nenhum nome novo).

## 3. Navegação do cabeçalho — de sublinhado para escala

O sinal de hover/foco era um sublinhado amarelo de 2px crescendo de borda a borda. Em
cinco itens, ele pesava mais que o próprio rótulo e competia com o amarelo do CTA na mesma
faixa. Agora é escala do rótulo, e o `::after` foi **removido por completo**.

Verificado com `:hover` forçado por CDP (`CSS.forcePseudoState`), lendo `getComputedStyle`:

```text
estado              transform              cor do rótulo        ponto amarelo   ::after
repouso             none                   rgba(255,255,255,.85)  opacity 0     content: none
hover               matrix(1.04,0,0,1.04)  rgb(255,255,255)       opacity 1     content: none
hover + reduced     none                   rgb(255,255,255)       opacity 1     content: none
```

`transform` não reflui, então a trilha da navegação fica parada. Sob
`prefers-reduced-motion` a escala é **desligada explicitamente** (não apenas com duração
zerada — uma escala instantânea ainda é um salto de tamanho sob o cursor), e o sinal
sobrevive na cor e no ponto. O ponto amarelo passa a ser também a marca da página ativa,
a 55% de opacidade.

**Escopo real desta mudança:** `.nav-link` vive em `globals.css` e o cabeçalho é
compartilhado — a navegação de **todas** as rotas passa a usar escala em vez de
sublinhado, não só a home.

## 4. Faixa inferior — dado técnico, e uma ação que se anuncia

Cada métrica era `18 anos de atuação` numa linha, valor e rótulo no mesmo corpo baixo,
separados por um tique de 12px: lia como legenda de rodapé, e o valor não se destacava da
unidade. Agora cada métrica é uma coluna — valor em condensada 22/24/28px sobre o rótulo
em caixa-alta miúda com tracking de 0,14em — e o separador é uma régua de altura plena.

O CTA era texto de 14px com uma seta. Agora é alvo com contorno amarelo hairline, rótulo
em condensada caixa-alta e cela de seta separada por um fio — a mesma gramática de
instrumento do CTA da dobra, um degrau abaixo em massa. Altura medida: **44px** (piso de
toque) em 1920/1440/1024/390.

Nenhum número, rótulo ou claim novo entrou: os dois pares são exatamente
`homeHeroMetrics` (18 / anos de atuação · Brasil / abrangência de atendimento), e a
métrica de "projetos entregues" continua filtrada na origem por falta de confirmação
comercial.

## 5. Estado Projetos — continua bloqueado por acervo

Reverificado nesta rodada: `git log --diff-filter=A` sobre `public/images/` confirma que
**nenhum asset novo entrou** desde o levantamento da rodada anterior. O inventário
completo e o motivo de cada rejeição estão em
`../hero-harmonia-final-2026-08-09/README.md`, seção 8 — resumo: `planta-executiva-hero`
é reamostragem de um original de 900px e campo predominantemente branco;
`cozinha-completa` é o assunto de Equipamentos e já aparece 3× na própria home; os demais
são operações construídas, de largura insuficiente para um palco de sangria, ou
miniaturas de 174–198px. Nenhuma fotografia do acervo registra projeto ou implantação em
curso.

`projeto-3d-hero.jpg` permanece, sem troca de `src`, sem mudança de `objectPosition` e
**sem nenhum filtro novo** — a correção tonal medida da rodada anterior
(`brightness(0.7) contrast(1.12) saturate(0.92)`, que trouxe a luminância média de 154,7
para 115,4, dentro da faixa das duas fotografias) é a única e não foi reforçada aqui.
Nenhuma maquiagem foi acrescentada para disfarçar a resolução.

**Conclusão: bloqueio de acervo, não de composição.** Substituir é trocar `src` e
`intrinsic` em `src/data/v2/home.ts` quando existir uma exportação em alta do mesmo
estudo, ou uma fotografia real de prancha, obra ou implantação.

## 6. Contraste — pior pixel sob o texto

Elemento ocultado por `visibility` (não `opacity` — a animação `.enter` tem
`fill-mode: both` e sobrescreveria), quadro capturado, pixel mais claro amostrado dentro
da caixa. **72 amostras** (4 viewports × 3 estados × 6 elementos), todas ≥ 4,5:1, mínimo
**5,02:1**:

```text
elemento     1920            1440            1024            390
h1           5,02–6,09       8,06–9,74       6,78–10,64      16,29
eyebrow      10,71–10,81     9,45–9,92       6,38–7,53       11,84
intent       10,30–13,16     11,41–13,30     8,01–12,27      16,29
ctaWa        6,96–7,49       6,94–7,60       8,18–8,61        9,59
railLabel    16,03–16,31     15,94–16,27     15,65–16,40     16,52
bandCta      12,25           12,25           12,25           12,25
```

O verde `#25D366` mede 9,6:1 sobre grafite e 6,94:1 no pior pixel real sob o CTA de
WhatsApp — passa AA com folga. Ele não entra em fundo claro em nenhum lugar, então a regra
do amarelo não é contrariada: o verde marca um canal, não substitui o amarelo em papel
nenhum.

**Uma reprovação apareceu e era do instrumento, não da página.** O CTA da faixa media
1,0:1 em 390/Equipamentos. Causa: o harness chamava `window.scrollTo(0,0)` sem
`behavior:'instant'`, e `html` tem `scroll-smooth` global — a rolagem seguia animando
enquanto o retângulo do alvo seguinte era lido, então a amostra caía sobre a seção clara
abaixo da dobra. É a mesma armadilha já registrada no script de captura do próprio
repositório. Corrigido o harness, a amostra fecha em 12,25:1.

## 7. Validações em produção

```text
overflow horizontal ..... 0 em 1920, 1440, 1366, 1024, 768, 390, 320
console errors .......... 0
respostas HTTP ≥ 400 .... 0
imagens quebradas ....... 0 (72 imagens na página)
alvo de toque ........... controles de pilar 64px em 390/320; CTA da faixa 44px
```

**Teclado:** `ArrowRight`/`ArrowLeft` movem seleção **e** foco e dão a volta; `Home`/`End`
vão às pontas; o `h1` acompanha em todos os passos. Os dois CTAs novos são elementos
`<a>` reais, focáveis, com `href` verificado (`wa.me/…` com a mensagem do estado ativo e
`#equipamentos`).

**`prefers-reduced-motion`:** escala da navegação em `none`; `animation-name` do `h1` em
`none` com `opacity: 1`; transições das cenas em 1e-05s; régua do estado ativo com
`transform` identidade e `opacity: 1` — nada invisível, nada preso fechado.
