# CLAUDE.md

Orientações para o Claude Code (claude.ai/code) trabalhar neste repositório.

## V2 — leia primeiro

Para qualquer trabalho relacionado à **V2**, leia antes: `MASTER_BIANCHINI.md` (contexto
estratégico, arquitetura-alvo, decisões congeladas) e `WORKFLOW_IA_V2.md` (processo,
papéis e portas de qualidade). Pontos que já mudam o modo de trabalhar:

- **Equipamentos é o pilar central da V2.** Projetos e Consultoria são pilares de
  sustentação e portas de entrada próprias — não têm o mesmo peso de Equipamentos.
- **A V1 permanece congelada** (só correções críticas) enquanto a V2 é desenvolvida em
  paralelo. Não migrar a V1 para a arquitetura da V2 por conta própria.
- **Nenhuma feature da V2 é implementada sem spec aprovada** (Gate 1 do
  `WORKFLOW_IA_V2.md`). Trabalhar por fatias pequenas, uma feature por vez.
- Validar (`npm run build/lint/type-check` e evidência do escopo) antes de declarar
  qualquer tarefa da V2 concluída.

O restante deste arquivo (`CLAUDE.md`) descreve o estado **atual** do código — a V1.

## Governança documental — leia antes de citar qualquer documento de direção

O repositório passou por saneamento documental em 2026-08-07 (etapa V2-00C). Regras
permanentes daqui para frente:

- **Antes de implementar qualquer feature, confirme quais documentos estão `ACTIVE` e qual
  spec vigente governa o escopo.** Não assuma que o `.md` mais fácil de achar por busca de
  texto é a fonte certa.
- Ordem de leitura e precedência completa entre documentos: `docs/v2/README.md`. Resumo:
  `docs/v2/DECISIONS.md` > `docs/v2/V2_PRODUCT.md` > `MASTER_BIANCHINI.md` > spec vigente
  em `docs/v2/specs/` > `docs/v2/DESIGN_SYSTEM.md` > referência > histórico.
- **Nunca usar `docs/archive/` como fonte de direção atual.** Todo conteúdo lá é
  `HISTORICAL` ou `SUPERSEDED` — preservado para rastreabilidade, não para orientar
  trabalho novo.
- **Nunca usar um documento com cabeçalho `STATUS: SUPERSEDED` como requisito.** Ele existe
  só como contexto de como se chegou à decisão atual.
- **Auditoria histórica é diagnóstico, não decisão.** `docs/product-audit/` e o conteúdo em
  `docs/archive/audits/` descrevem o que foi observado num momento; quando divergem da
  direção vigente, a direção vigente vence — isso já está anotado onde relevante.
- **Não inferir que "mais antigo = vigente"** nem que **"mais detalhado = superior".**
  Vigência vem da posição na cadeia de precedência acima, nunca da data do nome do arquivo
  ou do volume de texto.
- **Se houver conflito documental real e a ordem de precedência não resolver**, pare e
  reporte — não escolha um lado por conta própria.

## O que é este projeto

Site institucional da **Bianchini** em Next.js 15 (App Router) + React 19 + TypeScript +
Tailwind CSS 3.4.

Posicionamento: **diagnóstico, projeto, implantação e consultoria de operações de food
service** — não um catálogo de equipamentos. A mensagem central é
_"Diagnosticamos, estruturamos e transformamos operações de food service."_ — copy do
mockup aprovado, transcrita em `src/data/site.ts`. Não substituir.

Leia `README.md` para stack, comandos e estrutura. As fontes normativas de design, conteúdo
e implementação são, nesta ordem de autoridade:

1. **`MOCKUP_HERO_APROVADO.png`** (raiz) — layout aprovado do hero. É **especificação
   visual obrigatória**, não referência de inspiração. Composição, proporções, geometria,
   tipografia, cores e copy do primeiro viewport saem dele.
2. **A identidade publicada em `bianchinicozinhas.com.br`** — grafite `#101010`, amarelo
   da marca e condensada Oswald nos títulos. É de onde vem a paleta do sistema.
3. dados, serviços e projetos reais da Bianchini;
4. `GUIA_COMPLETO_DO_SITE_BIANCHINI.md`;
5. `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`.

Onde o mockup e os guias divergirem — os guias sugerem título serifado e paleta
off-white/grafite/champagne; o mockup usa **sans-serif com grafite e amarelo** —
**prevalece o mockup**.

**O mockup mudou.** A versão anterior (azul-marinho `#000E1E` + bordô `#7E0F29`) está em
`docs/archive/legacy-visual/mockup-hero-navy-bordo-superado.png` e **não vale mais**. Todo
o sistema foi remigrado para grafite + amarelo em 2026-08-01; o bordô e o azul-marinho
saíram do projeto e não devem voltar. A **geometria** da primeira dobra não mudou nessa
migração — só cor, família dos rótulos comerciais e motion.

`DIRECAO_MESTRA_SITE_BIANCHINI.md` é uma versão anterior dos guias e foi superada — desde
2026-08-07 o arquivo está em `docs/archive/superseded/`, com cabeçalho `STATUS: SUPERSEDED`.
Materiais em `docs/archive/legacy-visual/` são apenas históricos. Ver `docs/archive/README.md`
para o índice completo do que foi arquivado.

## Comandos

```bash
npm run dev          # http://localhost:3000
npm run build        # obrigatório antes de considerar qualquer tarefa concluída
npm run lint
npm run type-check
```

## Regras de conteúdo (importante)

O conteúdo do site é comercial e sensível. **Não invente** clientes, números, cases,
depoimentos, certificações, resultados, prazos ou dados técnicos.

Dados confirmados como reais:

- 18 anos de atuação
- mais de 3.000 projetos entregues (métrica com pendência de confirmação numérica exata —
  ver `docs/v1-release/04-pendencias-externas.md` item 5 e `src/data/site.ts` linhas 108–113)
- E-mail `comercial@bianchinicozinhas.com.br`
- Rio de Janeiro · RJ · Brasil
- 15 logotipos em `public/images/clients/` (10 aprovados para exibição)
- 2 depoimentos identificáveis em `src/data/testimonials.ts`
- fotos de operações entregues em `public/images/projects/` e `public/images/hero/`

**WhatsApp — divergência não resolvida, não tratar nenhum dos dois como confirmado até
confirmação comercial:**

| Onde | Valor |
| --- | --- |
| `src/data/site.ts` (`contact.phoneDisplay`, em uso no site) | `+55 21 99518-1918` |
| Versão anterior deste arquivo (até 2026-08-07) | `+55 21 96469-0650` |

Até 2026-08-07 este arquivo listava `96469-0650` na lista de dados confirmados — isso
**apresentava como fato** um número que a própria auditoria (`docs/v1-release/04-pendencias-externas.md`,
`docs/v1-release/06-publicacao.md`) já registrava como divergente e não confirmado
comercialmente. A correção aqui é remover essa afirmação, não substituí-la pelo número do
código: o código é a única fonte técnica em uso hoje, mas "em uso" não é o mesmo que
"confirmado pelo comercial como definitivo" (`MASTER_BIANCHINI.md` §21). Não alterar
`src/data/site.ts` nem este número por inferência — exige confirmação comercial explícita.

Deliberadamente **ausentes**, por não terem base verificável:

- percentuais de economia ou redução de custo
- "100% de aprovação na vistoria"
- cases com métricas (leitos, refeições/dia, ROI)
- nomes de cliente, local ou prazo associados às fotos de projeto
- qualquer depoimento sem autor, cargo e empresa

Se um conteúdo real não existir, use estrutura neutra e claramente editável — nunca preencha
com dado fictício apresentado como verdadeiro.

## Convenções de código

- **Conteúdo em `src/data/`**, apresentação em `src/components/`. Nada de texto fixo dentro
  de componente de seção.
- **Server Component por padrão.** `'use client'` só quando há estado ou API de browser
  (hoje: `header`, `mobile-menu`, `whatsapp-float`, `reveal`, `accordion`, `contact-form`).
- **Duas famílias, com papéis fixos.** `font-sans` (**Manrope**) para leitura e interface —
  H1…H4, parágrafos, navegação, campos. `font-condensed` (**Oswald**, a condensada do site
  oficial) só para **rótulo comercial ou técnico curto**: botão, etiqueta de seção, numeral
  de métrica, índice, cota. **Nunca condensada em texto corrido nem em título.** Não há
  serifada no projeto. Títulos usam peso 700/800.
- **Regra do amarelo.** Em fundo escuro o amarelo é o acento pleno (texto de etiqueta,
  marcador, índice ativo). Em fundo claro ele **só entra como preenchimento** — CTA
  primário, marca-texto (`.mark-yellow`) — ou como hairline decorativa; marcadores com
  significado e indicadores de estado ativo em fundo claro são **grafite**. O motivo está
  em `src/styles/colors.ts`: amarelo sobre `canvas` dá 1,4:1.
- **Links de WhatsApp** só via `lib/whatsapp.ts` (`whatsappUrl(topic)` /
  `whatsappUrlWithText(text)`). Nunca colar URL `wa.me` em componente.
- **Eventos de analytics** só via `lib/analytics.ts` (`trackEvent`). Nunca enviar dado
  pessoal — a função filtra chaves conhecidas, mas a responsabilidade é de quem chama.
- **Navegação principal tem cinco itens**, nesta ordem: **Soluções, Projetos, Empresa,
  Método, Equipamentos** (`mainNav` em `src/data/navigation.ts`). **`mobileNav` é
  `mainNav`** — o menu do telefone reflete a navegação do desktop e não é um índice
  paralelo. Leonardo não entra em nenhum dos dois: a página é alcançada pela seção de
  autoridade, pelo bloco do livro e pelo rodapé.
  A ordem mudou em 2026-08-05 (Projetos passou à frente de Empresa) porque a home foi
  reordenada e `#projetos` subiu de y=6766 para y=3275 — a ordem do menu **deriva** da
  rolagem, não o contrário.
- **A ordem da navegação não é livre — ela é a ordem da rolagem.** Os cinco itens são
  âncoras da mesma página, então ler o menu da esquerda para a direita tem de ser descer a
  home do começo ao fim. Regra: meça o `Y` real de cada âncora **no estado atual** (não
  deduza de `page.tsx` nem de comentário), ordene do menor para o maior, e refaça a medição
  sempre que a ordem física da home mudar. Desktop e menu mobile compartilham o mesmo
  array. **Nenhuma preferência nominal justifica um retorno de rolagem** — inclusive a
  convenção de deixar o item institucional por último, que foi o que colocou "Empresa" no
  fim e fazia o último clique subir 5.696px. O CTA fica fora da sequência.
- **Ícones** em `src/components/ui/icons.tsx` (SVG inline). Não adicionar biblioteca.
- **O Instagram não fica no cabeçalho.** A posição institucional das redes é o rodapé;
  o menu mobile mantém o item, com rótulo e alvo de toque de 44px. No cabeçalho o
  glifo (gradiente saturado) disputava o olho com o amarelo do CTA. O Instagram
  pessoal de Leonardo aparece **só** no bloco dele, em "Quem conduz".
- **O livro tem um lugar só na home**: dentro do dossiê de Leonardo, em "Quem conduz"
  (`leadership-section.tsx`), junto com a âncora `id="livro"` — destino de `#livro`
  (`leonardo-section.tsx`) e `/#livro` (`data/industry.ts`). `book.purchaseUrl` é
  `null` e **nenhum CTA de compra é renderizado**.
- **Animações** em CSS/Tailwind. Não adicionar Framer Motion.
- Sem `<a href="#">` vazio: toda âncora precisa existir como `id` na página.
- Imagens sempre por `next/image`, com `sizes`; `fill` exige pai `relative` com altura ou
  `aspect-*`. Logos usam `object-contain`; fotos, `object-cover`.

## Estrutura de componentes

- `components/layout/` — moldura global (header, mobile-menu, footer, whatsapp-float) e
  primitives estruturais (`Container`, `Section`, `SectionHeader`).
- `components/ui/` — primitives: `actions/button` (`Button`, `LinkButton`, `ArrowLink`, o
  CTA do cabeçalho `HeaderCta` e os dois CTAs da primeira dobra, `HeroPrimaryCta` /
  `HeroSecondaryCta`),
  `typography/heading` (`Heading`, `Eyebrow`, `Lead`, `Accent`), `card`, `accordion`,
  `field`, `icons`.
- `components/sections/` — seções da home, reutilizadas pelas páginas internas por props.
- `components/blocks/` — blocos genéricos de página (`PageHero`, `FeatureGrid`,
  `DeliverablesBlock`, `FaqBlock`).
- `components/forms/` — formulários.

**Antes de criar um componente novo, verifique se um bloco existente resolve por props.**
As páginas comerciais compartilham deliberadamente a mesma estrutura visual.

## Vocabulário visual — tetos que não devem ser rompidos

A terceira passagem visual (`docs/RELATORIO_TERCEIRA_PASSAGEM_HOME.md`) tirou da home a
aparência de template. O que a produzia era repetição de recurso decorativo, não falta de
conteúdo. Os tetos abaixo são a razão de a página funcionar hoje:

- **Grade cartesiana: um uso.** `.grid-lines` / `.grid-lines-light` não existem mais. Sobrou
  `.drafting-paper`, a moldura da planta executiva no diagnóstico — grade só onde há desenho
  técnico apoiado nela. Não usar como fundo de seção, faixa ou painel de texto, e não
  substituir por outro pattern.
- **Diagonal do hero: dois momentos** — primeira dobra e CTA final, montados com
  `.diag-panel` / `.diag-keyline`. O primitive `DiagonalPhoto` foi removido de propósito.
- **Blueprint: um** (o do hero).
- **Numeral gigante: nenhum na home hoje.** Índices são pequenos e ficam na margem.
- **Nem toda lista precisa de divisor**, e `TechLabel`/`TickRule` não precisam preceder toda
  figura ou separar todo bloco.
- **Nenhuma decoração pode existir só para "parecer engenharia".** O caráter técnico vem dos
  entregáveis reais — planta, estudo 3D, checklist do diagnóstico, entregáveis por nível.
- **Composição:** nenhuma dupla de seções consecutivas compartilha mais de dois padrões entre
  introdução em duas colunas, lista de itens, divisores, numeração, fundo liso e CTA no fim.
  O mapa está no comentário de `src/app/page.tsx` — atualize-o ao mexer na sequência.
- **Teto de fundos escuros: dois pares adjacentes na home, e só.** As seções escuras somam
  quase metade da página; três seguidas viram uma mancha sem transição. Hoje os pares são
  `sintomas`+`transição` e `equipamentos`+`inox`. Essa conta **restringe a ordem das
  seções** — foi ela, e não preferência narrativa, que manteve `atuação` (surface) entre
  `leonardo` e `equipamentos` na reordenação de 2026-08-05. Ao mexer na sequência, remeça:
  `docs/v1-release/capturas/fluxo/mapa-de-posicoes.md` traz y, altura e fundo de cada seção.
- **A ordem da home é narrativa comercial, não histórico de edição.** A sequência atual e a
  justificativa de cada decisão estão no comentário de `src/app/page.tsx` e em
  `docs/v1-release/03-hero-e-fluxo.md`. **Projetos é a prova principal e abre em ~20% da
  página** — não empurre para baixo.
- **O seletor de pilares do hero não tem caixas.** Moldura, divisórias e preenchimento por
  item foram removidos em 2026-08-05: era isso que dava aparência de tabela. O que existe é
  uma **régua compartilhada** sob setas e rótulos, com o ativo marcado por peso + contraste
  + régua de 2px (grafite em fundo claro, amarelo em escuro). A numeração do pilar aparece
  **uma vez só**, no marcador entre a etiqueta e o título — não a repita nos botões.

## Motion — o vocabulário e os seus limites

Três curvas, e só três (`src/styles/animations.ts`, expostas como `--ease-*` e
`ease-precise` / `ease-smooth` / `ease-premium`):

| curva     | cubic-bezier          | para quê                                   |
| --------- | --------------------- | ------------------------------------------ |
| `precise` | `0.4, 0, 0.2, 1`      | resposta, hover, foco, pressão             |
| `smooth`  | `0.22, 1, 0.36, 1`    | entrada de conteúdo, troca de estado       |
| `premium` | `0.16, 1, 0.3, 1`     | revelação editorial e composição do hero   |

Faixas de duração: 120–180ms resposta · 180–280ms hover · 280–450ms troca de conteúdo ·
450–750ms revelação editorial · até 1.100ms a sequência de entrada do hero, uma vez só.

- **A sequência do hero é única e não repete.** Os atrasos vivem em `--seq`, lidos por
  `.hero-seq` / `.hero-line`; a tabela completa está no comentário de globals.css. A
  fotografia é revelada por uma **cortina que carrega o mesmo polígono do painel**, então a
  aresta que corre é a diagonal do mockup. Essa cortina precisa de `overflow-hidden` no
  painel: `clip-path` é só pintura e não impede que ela conte como área rolável.
- **`Reveal` tem quatro variantes** (`up`, `side`, `settle`, `line`) e existir mais de uma é
  o ponto. Um `fade-up` idêntico do topo ao rodapé é o que faz a página parecer template.
  Escolha pelo que o elemento é — texto sobe, coluna entra de lado, documento assenta, régua
  cresce — e mantenha a mesma variante dentro de uma mesma lista.
- **Botão tem quatro estados**, sempre: padrão, hover, `focus-visible` e `active`. O
  preenchimento do hover é `transform: scaleX/scaleY` sobre um `::before`, nunca `width`.
  O `focus-visible` dispara o mesmo preenchimento do hover.
- **Nada em laço, nada pulsando, nada palavra a palavra, sem parallax e sem cursor
  customizado.** Não adicionar biblioteca de animação.
- **`prefers-reduced-motion` é requisito, não cortesia:** nenhum conteúdo pode ficar
  invisível, nenhuma máscara pode permanecer fechada e a cortina do hero tem de **sumir**
  (`display: none`) em vez de apenas parar — parada, ela cobriria a fotografia.

## Armadilhas conhecidas

**A primeira dobra tem uma unidade só: `--u`.** Toda medida do hero é um pixel do mockup
(1586 × 992) expresso em `--u`, definido em `.hero-fold` (globals.css) como o menor entre
`100cqw / 1586`, `(100svh − header) / 900` e `1.15px`. O divisor **900** é a altura da
composição inteira (eyebrow → blueprint, 892 unidades) mais folga: é ele que garante que a
dobra inteira caiba na janela. Percentual vertical não serve (`%` resolve pela **largura**
do pai) e `vw` também não, porque inclui a barra de rolagem e desalinha a diagonal, que é
percentual. Ao mexer no hero, mexa em `--u` — não troque a unidade.

**O cabeçalho não usa `--u`.** A altura é token responsivo por `clamp()` em globals.css —
64px no mobile, 76–88px em tablet/desktop estreito, 90–96px em desktop amplo — e as
proporções internas (logo a 52%, CTA a 46%) derivam dela. O mockup marca 116px, mas a
faixa ficava alta e dispersa; a redução é deliberada. Tipografia da navegação é fixa
(15px): amarrá-la à altura encolhia o rótulo junto com a faixa.

**Geometria do hero é medida, não estimada.** Valores amostrados no mockup, já validados
por sobreposição: borda da fotografia é uma **reta única** de x 880 (topo) a x 657 (base) —
não há vértice intermediário; keyline amarela paralela, 8,5px à esquerda dela; coluna de
texto em x 67 com 519px de largura; enquadramento da foto = `cover` a 115% ancorado na
base, a 83,3% da largura. Ao mexer, recapture em 1586 × 992, com `devicePixelRatio` 1 e
fontes carregadas, e compare numericamente antes de aceitar.

**Blueprint em fluxo, não ancorado ao canto.** `BlueprintCookingLine` é uma elevação
frontal ortográfica (viewBox `28 0 432 132`, cotas inclusas) e entra **depois** do bloco de
métricas, com a mesma margem esquerda da coluna de texto. Ancorado ao canto inferior ele
voltava a ficar por baixo das métricas e cortado pela base. A entrada de desenho usa
`pathLength="1"` em cada traço, com `stroke-dashoffset` animado uma única vez (1000ms);
com `prefers-reduced-motion` o desenho aparece pronto.

**`--diag` é herdado, não redeclarado.** `.diag-panel` e `.diag-keyline` leem o
deslocamento do wrapper (`DiagonalPhoto`) e trazem só um **fallback** no `var()`. Declarar
`--diag` dentro de `.diag-panel` sobrescreve o valor no painel e não na keyline: as duas
arestas deixam de ser paralelas e sobra uma cunha amarela.

**`sizes` da foto do hero é maior que o painel.** A imagem é renderizada a ~2076px dentro
de um painel de 929px (o `cover` é ampliado). `sizes` declarando a largura do painel faz o
navegador baixar uma fonte pequena demais e a foto sai borrada — daí `130vw`.

**Largura de rótulo em `em`, não em `--u`.** Os rótulos das métricas têm caixa medida no
mockup, mas expressa em `em`: os corpos de texto têm piso de legibilidade e, se a caixa
encolhesse em `--u` sem o texto encolher junto, os rótulos quebrariam linha fora do mockup.

**`cn()` e escalas de tipografia customizadas.** `text-display`, `text-title-1..3`,
`text-lead`, `text-body`, `text-body-sm`, `text-caption`, `text-eyebrow` e `text-numeral`
estão registrados no grupo `font-size` do `tailwind-merge` em `src/lib/utils.ts`. Ao criar
uma escala nova em `src/styles/typography.ts`, registre-a lá também. Sem isso, o merge a
interpreta como cor e o tamanho é descartado quando um `text-canvas` aparece depois — o
sintoma é título de seção escura renderizando minúsculo.

**Contraste do amarelo — a armadilha central do sistema.** `yellow` (`#F5C64B`) sobre
`graphite` dá 11,8:1 e sobre ele o `ink` dá 11,8:1; mas sobre `canvas` fica em **1,4:1**, e
o tom mais fechado (`yellow-deep`) em 1,9:1. Nenhum matiz resolve — escurecer até 4,5:1
produz um bronze que deixa de ler como o amarelo da marca. Por isso, em superfície clara,
amarelo é **preenchimento ou hairline, nunca texto e nunca indicador de estado**. O anel de
foco segue a mesma lógica: grafite em fundo claro, amarelo em fundo escuro.

**Divergência assumida em relação ao mockup.** No mockup a etiqueta do hero
("COZINHAS INDUSTRIAIS E FOOD SERVICE") é amarela sobre o off-white — 1,8:1, reprova em AA.
Na implantação o texto é grafite e o amarelo fica no traço. É a única divergência
deliberada de **cor**, e está anotada em `Eyebrow` e em `hero-section.tsx`.

Há uma segunda divergência, de **posição**, desde 2026-08-04: o bloco da coluna
esquerda (etiqueta → **marcador do pilar** → título → texto → CTAs → métricas →
navegação dos pilares) é centrado verticalmente
(`lg:justify-center`) em vez de ancorado no topo como no mockup. No topo sobravam
~290px de off-white vazio abaixo das métricas em 1440×900. É pedido explícito do
gestor. A geometria da diagonal, o recuo `pl-16` e a altura estável **não**
mudaram — só a posição vertical do conjunto.

**Estado ativo em fundo claro é grafite, inclusive em preenchimento de controle.**
A regra do amarelo já dizia isso, mas dois controles a violavam até 2026-08-04
(o nó ativo do espinhaço de "Atuação integrada" e a régua sob o rótulo dele, ambos
amarelos sobre `surface`). Hoje: nó ativo grafite com halo grafite, e o amarelo
fica só na **trilha de progresso**, que é hairline decorativa. Nas zonas do
diagnóstico o índice ativo continua amarelo, e isso está certo — o botão ativo tem
preenchimento grafite, então o amarelo está sobre fundo escuro.

**Todo controle de navegação interna precisa de três coisas.** Caixa própria (texto
solto sobre uma linha tem área sensível, mas nada a anuncia); hover que **não troca
o conteúdo** (`onMouseEnter` disparando `setActive` faz atravessar a fileira trocar
o painel cinco vezes, e um controle que reage à passagem lê como gráfico); e estado
ativo com pelo menos três sinais, um deles não-cromático.

**Uma lista com maioria de itens inertes vira tabela de relatório.** O diagnóstico
listava as seis frentes com duas marcadas e quatro esmaecidas — era daí que vinha a
aparência de "PDF colado na página", não da densidade do texto. Regra: um item só
ganha forma de item se estiver ativo ou se todos estiverem no mesmo estado; estado
misto com maioria inerte vira texto corrido.

`steel` é decorativo; texto auxiliar claro usa `muted` (5,6:1 sobre `canvas` — o
`#878787` do site oficial reprovaria).

**Duas instâncias da foto do hero.** O desktop usa a versão com `clip-path` e o mobile uma
em fluxo. Ambas têm `priority`, então os `sizes` restringem por breakpoint
(`(max-width: 1023px) 1px, 60vw` e o inverso) — sem isso o navegador baixa as duas em
qualquer largura.

**`transform` também conta como área rolável.** Já valia para `clip-path` (a cortina
do hero); vale igual para `translate`. Quando a troca de slide ganhou 1,5% de deriva
horizontal, os slides inativos vazaram **12px de rolagem horizontal em 768px** porque a
caixa da foto do **mobile** não tinha `overflow-hidden` — o painel diagonal do desktop
tinha. Qualquer elemento deslocado por transform precisa de um pai que recorte.

**Lazy loading em carrossel horizontal.** A faixa de logos (`trust-section.tsx`) desliza por
`transform`, e o lazy loading nativo não carrega o que está fora da viewport horizontal. Os
logos usam `loading="eager"` por isso.

**Mosaico de projetos usa colunas, não grid.** Com proporções variadas, o grid alinha pela
célula mais alta e abre vãos sob os cards baixos. `columns-*` + `break-inside-avoid`
mantém o ritmo editorial sem buracos.

**Logo em fundo escuro.** A logo padrão é navy/carmim e desaparece no grafite. Para fundos
escuros use `<Logo variant="light" />` (arquivo monocromático branco).

**Nomes de arquivo case-sensitive.** Windows é case-insensitive, Linux não. Assets em
`public/` são minúsculos, sem acento e com hífen — manter o padrão. Para renomear no
Windows, use dois passos (`arquivo.png` → `tmp.png` → `arquivo.png`).

**Reveal on scroll.** `.reveal` só é escondido quando `:root[data-js='on']` existe (flag
gravada por um script inline no `layout.tsx` antes da primeira pintura). Isso evita conteúdo
invisível se o JS falhar — não remova o script nem a condição do CSS.

**`clip-path` no alvo zera o `IntersectionObserver`.** O Chromium leva o recorte do próprio
elemento em conta ao calcular a interseção: um elemento com `clip-path: inset(0 0 100% 0)`
tem `intersectionRatio` 0 mesmo inteiro dentro da janela. Observar a si mesmo nunca dispara e
a fotografia fica invisível para sempre. Por isso `PhotoReveal` observa o **elemento-pai** —
não trocar por `ref` no próprio nó.

**Qualidade de imagem precisa estar declarada.** Toda `quality={n}` usada em `<Image>` tem que
constar de `images.qualities` em `next.config.ts`. Fora da lista, o otimizador responde **400**
e a imagem some — sem erro de build, sem aviso em produção. Ao introduzir um valor novo,
acrescente-o lá.

**Altura definida, não `min-height`, para o retrato.** `LeonardoPortrait` resolve a própria
largura por `aspect-ratio` a partir de `height: 100%`. Se o pai tiver só `min-h-*`, a altura
dele continua `auto`, o `h-full` resolve para `auto` e a figura colapsa para 0 × 0.

**A linha do método é uma linha de grade.** As seis etapas alternam acima e abaixo do traço; o
alinhamento vem de `grid-rows-[1fr_auto_1fr]` na lista mais `grid-rows-subgrid` em cada item.
Com empilhamento simples, a descrição mais longa empurra o traço da sua coluna e a linha sai
quebrada.

**Formulário sem backend.** `contact-form.tsx` monta a mensagem e abre WhatsApp ou e-mail.
Não existe endpoint nem banco. Ao integrar um serviço real, manter o fallback e não passar
a enviar dado pessoal em evento de analytics.

## Definição de pronto

`npm run build` passa, `npm run lint` e `npm run type-check` limpos, nenhuma imagem 404,
nenhum erro de console, sem overflow horizontal em 320 / 390 / 768 / 1024 / 1440, menu
mobile abrindo, navegando e fechando (clique, Escape e clique no fundo), foco visível em
toda navegação por teclado e formulário validando com erro associado ao campo.
