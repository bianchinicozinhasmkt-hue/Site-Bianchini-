# 03 — Decisões de design

> **Rodada 2 — 2026-08-04.** Este documento registra as decisões e **o motivo de
> cada uma**. O que já era normativo antes desta rodada (grid, escalas, paleta,
> `--u`, tetos de composição) continua valendo e está resumido aqui; o que
> **mudou nesta rodada** está marcado com ▲.
>
> Fonte normativa de convenções continua sendo `CLAUDE.md`. Onde este documento
> e ele divergirem, ver §7 — há um conflito assumido e explicitado.

## 1. Grid, containers e larguras

- `Container` único, com recuos laterais responsivos; nenhuma seção inventa
  margem própria.
- Grade de 12 colunas nos cabeçalhos de seção: enunciado em `lg:col-span-7`,
  texto de apoio em `lg:col-span-4 lg:col-start-9`. O vão de uma coluna entre os
  dois é o que impede o apoio de ler como legenda do título.
- **Comprimento de linha** limitado por `ch`, não por `rem`: `max-w-[26ch]` para
  título, `[38ch]`–`[42ch]` para corpo em coluna estreita, `[54ch]`–`[62ch]` em
  coluna larga. Medida em caracteres acompanha a escala tipográfica quando ela
  muda; medida em `rem`, não.

▲ **Diagnóstico: grade de 55/45 para 60/40.** O briefing pede 58–62% para a
evidência visual e 38–42% para o conteúdo ativo. A coluna da direita perdeu
altura ao sair a grade de seis frentes, então podia ceder largura sem apertar.
`sizes` da fotografia acompanhou (`50vw` → `52vw`) — declarar largura menor que
a real faz o navegador baixar uma fonte pequena demais.

▲ **"Quem conduz": 5 + 6 colunas com espelhamento**, não 6 + 6. A coluna vazia
que sobra é o que dá ar à faixa sem abrir um vão morto no meio, e o
espelhamento (figura à esquerda em Leonardo, à direita em Guilherme) é o que
impede a segunda faixa de ser a repetição literal da primeira.

## 2. Tipografia

Duas famílias, papéis fixos — **Manrope** (`font-sans`) para leitura e
interface; **Oswald** (`font-condensed`) só para rótulo comercial ou técnico
curto: botão, etiqueta de seção, numeral, índice, cota. Nunca condensada em
texto corrido nem em título. Sem serifada no projeto.

Escala (`src/styles/typography.ts`, registrada no grupo `font-size` do
`tailwind-merge` em `src/lib/utils.ts` — sem isso o merge a interpreta como cor
e o tamanho é descartado):

| Papel | Escala | Uso |
|---|---|---|
| Hero | `hero-*`, em `--u` | só a primeira dobra |
| Título de seção | `title-1` (30–44px) | `h2` de seção |
| Título de cartão / nome | `title-2` (24–30px) | `h3` |
| Subtítulo interno | `title-3` | `h3`/`h4` dentro de bloco |
| Corpo | `body` / `body-sm` | parágrafos |
| Rótulo | `eyebrow` / `caption` | condensada, caixa alta |

▲ **Hierarquia dos pilares corrigida.** O problema não era o título ser pequeno
— era o cartão ser pesado: superfície própria, borda inteira e um numeral
esmaecido de 6,5rem competindo com o próprio `h3`. Removido o numeral e trocada
a borda individual por uma moldura compartilhada, o `title-1` da seção volta a
dominar sem precisar crescer. **Aumentar o título seria tratar o sintoma.**

▲ **Título do diagnóstico de `[20ch]` para `[26ch]`** — em 20ch quebrava em três
linhas e o enunciado sozinho passava de 190px. E o texto de apoio desceu de
`lead` para `body`: um apoio em corpo grande e cinza claro pesa como subtítulo
sem ter a função de subtítulo.

▲ **A linha de crédito do livro foi reduzida ao selo.** A versão anterior
repetia `book.title` inteiro em condensada caixa-alta a 55% de opacidade, ao
lado de uma capa onde o mesmo título já se lê — três linhas de texto pouco
legível dizendo o que a imagem dizia. Regra geral: **texto não repete o que a
imagem ao lado já comunica**, especialmente em caixa alta e baixa opacidade.

## 3. Cor, contraste e superfícies

Paleta: grafite `#101010` (`ink`/`graphite`), amarelo da marca `#F5C64B`,
off-white `canvas`, `canvas-deep`, `surface`, `muted` para texto auxiliar,
`line` para fios, `steel` decorativo.

**A regra do amarelo é a decisão central do sistema.** Amarelo sobre `graphite`
dá 11,8:1; sobre `canvas`, **1,4:1**. Nenhum matiz resolve — escurecer até 4,5:1
produz um bronze que deixa de ler como o amarelo da marca. Portanto:

| Fundo | Amarelo pode ser | Amarelo não pode ser |
|---|---|---|
| Escuro | acento pleno: texto de etiqueta, marcador, índice ativo | — |
| Claro | preenchimento (CTA primário, marca-texto), hairline decorativa | **texto**, **indicador de estado** |

▲ **Dois indicadores de estado migraram para grafite** nesta rodada, por
estarem do lado errado dessa regra:

- nó ativo do espinhaço de "Atuação integrada": era losango amarelo com halo
  amarelo sobre `surface`; virou grafite cheio com halo grafite;
- régua sob o rótulo do nó ativo: era amarela; virou grafite.

O amarelo ficou na **trilha de progresso** — hairline decorativa, que é onde ele
é legítimo, e é ela que comunica a progressão dos cinco níveis.

▲ Nas zonas do diagnóstico o índice ativo **continua amarelo** e isso está
correto: o botão ativo tem preenchimento grafite, então o amarelo está sobre
fundo escuro.

**Divergência de cor mantida:** a etiqueta da hero é grafite, não amarela como
no mockup (1,8:1 lá, reprova em AA). O amarelo fica no traço. Continua sendo a
única divergência deliberada de cor, anotada em `Eyebrow` e no componente.

## 4. Profundidade, sombras e bordas

O sistema não usa sombra pesada. Profundidade vem de **luz, apoio e sobreposição
de planos**.

▲ **Moldura compartilhada nos pilares.** Três cartões com borda própria produzem
três objetos soltos e uma junção com vão irregular. `gap-px` sobre `bg-line`
dentro de uma borda única produz três faces de uma estrutura, com a junção na
espessura exata de um fio. Menos ruído, mais leitura de sistema.

▲ **Pedestal em "Quem conduz".** Um PNG recortado, sem nada por baixo, não tem
onde pousar — lê como figura colada. A solução tem três partes:

1. superfície com gradiente vertical **em camada própria, com máscara
   horizontal**. Aplicada direto no contêiner, ela desenhava um retângulo cinza
   de arestas retas sobre o grafite — o mesmo defeito de "placa com borda
   visível" já corrigido antes em `leonardo-section.tsx`. Mascarada, morre antes
   das laterais e o que se vê é variação de luz;
2. halo radial amarelo a 13%, que separa a figura do fundo;
3. **régua amarela de 3px na base**, o único elemento com aresta plena — e é ela
   que dá o chão. `object-bottom` na figura para ela apoiar sobre a régua.

**Altura fixa do pedestal** (22 → 26 → 30rem), não altura ditada pela imagem: as
duas faixas ficam com o mesmo peso mesmo com PNGs de proporções diferentes
(900×1528 e 1024×1536).

## 5. Cartões, listas e a forma de "tabela"

▲ **A decisão de composição mais consequente desta rodada.** Uma matriz de itens
em que a maioria está inerte é, visualmente, uma tabela de relatório — não
importa o quanto se refine a tipografia dela.

No diagnóstico, as seis frentes eram sempre listadas, com duas marcadas e
**quatro esmaecidas**. Era daí que vinha a sensação de "PDF colado na página",
não da densidade do texto. A correção: só as frentes da zona ativa têm forma de
item; as outras quatro viram uma linha corrida de apoio. A informação de que o
diagnóstico lê seis frentes continua na página — a matriz, não.

Regra derivada, para as próximas seções: **um item de lista só ganha forma de
item se estiver ativo ou se todos estiverem no mesmo estado.** Estado misto com
maioria inerte vira texto corrido.

## 6. Botões e controles

Quatro estados sempre: padrão, hover, `focus-visible`, `active`. Preenchimento
do hover por `transform: scaleX/scaleY` sobre um `::before`, nunca `width`.
`focus-visible` dispara o mesmo preenchimento do hover. Anel de foco grafite em
fundo claro, amarelo em fundo escuro.

▲ **Três regras novas para controles de navegação interna** (abas, zonas,
níveis), extraídas dos dois defeitos encontrados:

1. **O controle precisa ter caixa.** Texto solto sobre uma linha tem área
   sensível, mas nada a anuncia. Os nós de "Atuação integrada" ganharam
   `px-3 py-3` com `-ml-3` compensando, então o alinhamento com a coluna não
   muda — o que muda é haver superfície para o cursor encontrar.
2. **Hover não troca conteúdo.** `onMouseEnter` disparando `setActive` fazia
   atravessar a fileira trocar o painel cinco vezes. Um controle que reage à
   passagem lê como gráfico, não como botão. Hover é superfície e cor de rótulo;
   a troca exige clique. `onFocus` continua (padrão de aba com ativação
   automática, que é comportamento de teclado esperado).
3. **Estado ativo com pelo menos três sinais, um deles não-cromático.**
   Zonas do diagnóstico: preenchimento + índice + régua na base. Níveis de
   atuação: escala do losango + halo + peso do rótulo + régua.

▲ **Alvo de toque de 44px** nos itens de contato do menu mobile (telefone e
Instagram), que eram links de texto de ~20px de altura.

## 7. ▲ Conflito assumido: "linhas técnicas" no fundo da hero

O briefing pede, para a área clara da primeira dobra, "gradiente tonal quase
imperceptível; textura geométrica extremamente discreta; **linhas técnicas de
baixa opacidade**; ruído mínimo; superfície clara em dois níveis".

`CLAUDE.md` registra um teto de composição em sentido oposto: "Grade cartesiana:
um uso… Não usar como fundo de seção, faixa ou painel de texto, e não substituir
por outro pattern."

**Interpretação adotada, para referendo do gestor:** os dois são conciliáveis
porque tratam de coisas diferentes. Uma grade cartesiana é um padrão de **duas
direções repetido em campo**. O que foi aplicado são **quatro fios verticais**,
a 3,5% de opacidade, mascarados na vertical para morrerem antes do topo e antes
da diagonal, e presentes só a partir de `lg` — isso é margem de prancheta, não
campo de grade. O `.drafting-paper` sob a planta executiva continua sendo o
único uso de grade do projeto.

Se o gestor discordar, a camada é um único `div` `aria-hidden` e sai sem efeito
colateral; o clarão radial e o gradiente de dois níveis resolvem sozinhos a
maior parte do problema de "fundo branco grande".

## 8. Motion

Três curvas, e só três (`--ease-precise`, `--ease-smooth`, `--ease-premium`).
Faixas: 120–180ms resposta · 180–280ms hover · 280–450ms troca de conteúdo ·
450–750ms revelação editorial · até 1.100ms a sequência de entrada do hero, uma
vez só. Nada em laço, nada pulsando, sem parallax, sem biblioteca.

▲ **Substituição coordenada em vez de remontagem.** O defeito da troca de slide
não era duração — era que o texto era remontado por `key`: React desmontava o
antigo e montava o novo já animando a entrada, ou seja **corte seco na saída** e
fundido só na entrada. Três tempos agora:

| Camada | Duração | Curva | Papel |
|---|---|---|---|
| fotografia | 700ms, com 1,5% de deriva horizontal | `smooth` + `premium` | conduz a troca |
| texto: saída | 190ms, desce 4px | `precise` | libera o lugar |
| texto: entrada | 460ms, sobe 6px | `smooth` | ocupa o lugar |

Saída + entrada = 650ms, dentro da faixa de 500–750ms pedida, sob a dissolução
de 700ms da imagem, que atravessa as duas. A deriva de 1,5% existe porque um
crossfade de duas imagens paradas no mesmo enquadramento lê como piscada; 1,5%
é o mínimo que o olho registra como substituição e está longe de um zoom de
banner.

**A moldura não se move**: etiqueta, CTA primário, régua, métricas e navegação
ficam parados. A dobra não remonta.

▲ **`prefers-reduced-motion` é requisito.** A defasagem do texto é desligada no
componente e o CSS ganhou `opacity: 1` explícito em
`.hero-slide-content`/`.hero-slide-out` — sem isso, `animation: none` deixaria o
título **invisível**, que é exatamente o que movimento reduzido não pode
produzir. Verificado com emulação real, não por leitura.

## 9. Imagens

- Sempre por `next/image`, com `sizes`; `fill` exige pai `relative` com altura
  ou `aspect-*`. Logos `object-contain`; fotos `object-cover`.
- Toda `quality={n}` precisa constar de `images.qualities` em `next.config.ts` —
  fora da lista o otimizador responde 400 e a imagem some sem erro de build.
- ▲ **Enquadramento por instância quando o recorte muda.** O painel do desktop é
  cortado na diagonal: a faixa realmente visível é a direita. Uma foto com
  assunto à esquerda do centro precisa de `object-position` própria ali e outra
  na caixa cheia do mobile — daí `media.position` e `media.positionDesktop` em
  `HeroSlide`.
- ▲ **Transform exige `overflow-hidden` no pai.** A deriva de 1,5% dos slides
  inativos vazou 12px de rolagem horizontal em 768px porque a caixa da foto do
  mobile não recortava. Mesmo princípio já anotado em `CLAUDE.md` para a
  cortina: transform e `clip-path` pintam, mas continuam contando como área
  rolável.
- ▲ **Elemento de apoio precisa ser legível ou não precisa existir.** O selo da
  planta media 96×64px: o desenho virava mancha cinza e os losangos de zona não
  eram distinguíveis — era decoração fingindo de mapa. Foi para 128×80 com mais
  contraste.
- **Nenhuma imagem é apresentada como obra, cliente, fábrica ou case** sem base.
  Legendas usam "registro do acervo Bianchini".

## 10. Regras de CTA e de não-repetição

- **Um CTA primário, um rótulo, um destino**: "Solicitar diagnóstico" → `/contato`.
  Aparece na hero, na conclusão do diagnóstico, no CTA final e no menu mobile.
- **Secundários nunca competem**: rótulo diferente, ícone contextual, sem seta
  (a seta é o sinal do primário).
- **Aprofundamento é âncora, não rota.** Páginas internas continuam existindo por
  SEO e compatibilidade, mas os caminhos de leitura da home são `#âncoras`.
- ▲ **Um argumento, um lugar.** Três repetições foram consolidadas nesta rodada:
  o livro (cartão isolado + bullet de autoria → um bloco no dossiê de Leonardo),
  as descrições de `nextSteps` (repetiam `methodSteps` 01–03 → rótulos em linha
  ao lado do CTA), e o nome de Leonardo (dois cartões de pilar → uma faixa de
  responsabilidade).
- ▲ **Ao mover um bloco, a âncora vai junto.** `id="livro"` é destino de
  `#livro` e `/#livro`; mover o bloco sem ela quebraria dois links silenciosamente.

## 11. Padrões de seção — tetos que continuam valendo

- **Grade cartesiana: um uso** — `.drafting-paper` sob a planta. Ver o conflito
  em §7.
- **Diagonal do hero: dois momentos** — primeira dobra e CTA final.
- **Blueprint: um** (o do hero).
- ▲ **Numeral gigante: nenhum na home.** O dos pilares (5,5–6,5rem, cortado pela
  borda do cartão) era a última violação e saiu nesta rodada. Índices são
  pequenos e ficam na margem.
- **Nenhuma decoração existe só para "parecer engenharia".** O caráter técnico
  vem dos entregáveis reais — planta, estudo 3D, checklist do diagnóstico.
- **Nenhuma dupla de seções consecutivas compartilha mais de dois padrões.** O
  mapa está no comentário de `src/app/page.tsx` — atualizado nesta rodada.

## 12. Responsividade

Mobile-first, com breakpoints do Tailwind e `min-[390px]`/`min-[1400px]` onde a
medida real exigiu. Nenhum conteúdo importante é escondido para reduzir altura.

▲ Decisões desta rodada:

- o tratamento de fundo da hero só existe a partir de `lg` — abaixo disso a área
  clara não é grande o bastante para parecer vazia;
- os scrims do mobile são um degrau mais fortes que os do desktop, porque a
  caixa da foto é mais baixa e o mesmo bloco de navegação ocupa fração maior
  dela;
- as faixas de "Quem conduz" empilham (figura → dossiê) sem espelhamento no
  mobile: espelhar em coluna única só embaralharia a ordem de leitura.

## 13. Referências externas consultadas

Consultadas como referência de técnica e padrão, **nunca como fonte de fatos
sobre a Bianchini** e sem copiar layout de terceiros:

- padrão ARIA Authoring Practices para `tablist`/`tabpanel` com ativação
  automática e roving `tabindex` — base do comportamento de teclado das abas da
  hero, das zonas e dos níveis;
- WCAG 2.2 — critério de alvo de toque (2.5.8) para os 44px do menu mobile, e
  1.4.1 (uso da cor) para a regra de "estado com pelo menos três sinais";
- prática corrente de UX B2B de ciclo longo para a decisão de manter um único
  CTA primário repetido em vez de vários CTAs concorrentes.
