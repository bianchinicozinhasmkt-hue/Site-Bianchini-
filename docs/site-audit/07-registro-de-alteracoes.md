# 07 — Registro de alterações

> **Rodada 2 — 2026-08-04.** Sete lotes. O registro da rodada 1 (higiene de
> código e SEO) está preservado no fim, em §R1 — nada dela foi revertido.
>
> Cada lote foi validado com `npm run type-check` e `eslint` antes do seguinte.
> `npm run build` e a varredura de responsividade rodaram na validação
> integrada, ao fim de todos.

---

## Lote A — itens obrigatórios do briefing que não estavam no código

### A.1 — Imagem de Operação Comercial no slide 3 da hero

- **Problema:** o slide 3 usava `/images/hero/show-cooking.jpg` (balcão de
  distribuição). O asset entregue pelo gestor existia em `public/images/hero/`
  e não era referenciado por nenhum arquivo.
- **Decisão sobre o nome:** o arquivo chegou como `operação-comerrcial.png` —
  com acento e um "r" duplicado. Foi **renomeado** para
  `operacao-comercial.png`. Dois motivos: o padrão de `public/` documentado em
  `CLAUDE.md` é minúsculo, sem acento e com hífen; e um caminho acentuado
  depende de normalização Unicode consistente entre Windows (onde foi salvo) e
  o servidor de produção (Linux, case- e byte-sensitive). Renomeado em dois
  passos (`→ tmp-oc.png → operacao-comercial.png`), conforme a armadilha de
  case-insensitivity registrada em `CLAUDE.md`.
- **Arquivos:** `public/images/hero/operacao-comercial.png` (renomeado),
  `src/data/hero-slides.ts`, `src/components/sections/hero-section.tsx`.
- **Mudança:** `media.src` do slide 3 trocado; `alt` reescrito para descrever o
  que a foto mostra ("Balcão de atendimento com terminal de ponto de venda,
  pedidos embalados para retirada e a linha de produção em aço inox ao fundo")
  **sem** atribuir cliente, obra ou case. Adicionados os campos opcionais
  `media.position` e `media.positionDesktop` ao tipo `HeroSlide`, e ligados às
  duas instâncias da foto no componente.
- **Por que dois campos de enquadramento:** o painel do desktop é recortado na
  diagonal — a faixa realmente visível é a direita. Em `center`, o PDV e as
  sacolas caíam atrás do corte e sobrava só a parede de inox do fundo.
  `positionDesktop: '62% 45%'` puxa o assunto para dentro do polígono;
  `position: '50% 45%'` serve a caixa cheia do mobile, que não tem corte.
- **Resultado:** verificado nas capturas de 1440 e 390 do slide 3, e na
  varredura de 10 larguras — sem distorção, sem corte do assunto.
- **Rollback:** restaurar `src` e `alt` anteriores e remover os dois campos; o
  arquivo antigo (`show-cooking.jpg`) continua em `public/images/hero/`.

### A.2 — Instagram fora do header desktop

- **Problema:** botão de ícone do Instagram em `header.tsx`, ao lado do CTA.
- **Decisão:** remover do cabeçalho. O glifo é um gradiente saturado e, colado
  ao amarelo do CTA, criava dois destaques de cor concorrentes numa faixa onde
  só o CTA deve puxar o olho. Posição institucional passa a ser o rodapé
  (`footer.tsx`, bloco de contato — **já existia, sem alteração**).
- **Arquivos:** `src/components/layout/header.tsx` (bloco e import removidos,
  import de `contact` também, que só servia a ele),
  `src/components/layout/mobile-menu.tsx`.
- **Mudança no menu mobile:** telefone e Instagram deixaram de ser dois links de
  texto de ~20px de altura encostados na borda e passaram a um grupo com linha
  separadora, ícone de 18px, rótulo e `min-h-[2.75rem]` (44px) de alvo de toque.
  O `aria-label` redundante saiu e virou um `sr-only` que acrescenta o que
  faltava — que o link abre em nova aba.
- **Resultado:** verificado por CDP — `header a[href*="instagram"]` não existe.
  Menu mobile conferido na captura `menu-mobile-390-after.png`.
- **Rollback:** reinserir o bloco `<a>` e os dois imports no header.

### A.3 — Número de WhatsApp antigo no formulário

- **Problema:** o número oficial já estava correto em `site.ts`, mas
  `contact-form.tsx` usava o **número antigo da empresa** como exemplo de
  formato em dois lugares (mensagem de erro e `placeholder`) — um número
  desatualizado, impresso na tela e discável.
- **Decisão:** trocar por uma **máscara**, não por outro número real:
  `(21) 90000-0000`. Um exemplo de formato não precisa ser o telefone de
  ninguém, e usar o número da empresa como modelo do número *do visitante* já
  era confuso de partida.
- **Arquivo:** `src/components/forms/contact-form.tsx`.
- **Resultado:** verificado por CDP — `96469` não aparece em nenhum ponto do
  HTML renderizado; `99518-1918` e `5521995181918` aparecem.
- **Rollback:** trocar as duas strings de volta.

---

## Lote B — pilares: oferta separada de responsabilidade

- **Problema:** `responsible` renderizado dentro de cada cartão fazia "Leonardo
  Bianchini" aparecer duas vezes lado a lado em selos idênticos, e o rodapé de
  cada cartão dependia da altura do texto acima (o terceiro pilar subia ~26px).
- **Decisão:** duas camadas — cartões dizem **o que** a Bianchini entrega, uma
  faixa abaixo diz **quem responde**. Cada nome aparece uma vez, e a
  distribuição real (2 + 1) fica explícita em vez de deduzida por repetição.
- **Arquivo:** `src/components/sections/pillars-section.tsx` (reescrito).
  `src/data/pillars.ts` **não foi tocado** — `responsible` continua sendo a
  fonte da associação.
- **Mudanças:**
  - a faixa lê `leadershipTeam` (a mesma fonte de "Quem conduz", que vem logo
    depois) para nome e função, e deriva os pilares de cada pessoa filtrando
    `pillars.responsible` pelo nome. Nada é redigitado: as duas seções não
    podem divergir;
  - os três cartões passaram a dividir uma moldura só (`gap-px` sobre
    `bg-line`) — três faces de uma estrutura, com a junção na espessura exata
    de um fio;
  - `Reveal as="li"`: o item da grade precisa ser o próprio `li`, senão um
    wrapper intermediário quebra o `gap-px` e a altura da linha;
  - **numeral gigante removido** (era `IndexNumeral` a 5,5–6,5rem, cortado pela
    borda do cartão): fere o teto registrado em `CLAUDE.md`. Substituído por um
    índice pequeno na margem, ao lado do traço amarelo;
  - título da seção: "Três pilares, cada um com um responsável" → "Três pilares,
    dois responsáveis" — a frase antiga afirmava uma relação 1:1 que não é a
    real.
- **Resultado:** capturado em `pilares-1440-after.png` — cartões de altura igual,
  faixa de responsabilidade alinhada, nenhum nome repetido.
- **Rollback:** o arquivo anterior é recuperável do histórico; nenhum dado foi
  removido de `src/data/`.

---

## Lote C — "Quem conduz" e consolidação do livro

### C.1 — Composição da seção

- **Problema:** recortes flutuando, ~450px de grafite vazio, nomes fora da dobra.
- **Decisão:** cada pessoa vira uma **faixa editorial** de figura + dossiê, e as
  duas faixas são **espelhadas** (figura à esquerda em Leonardo, à direita em
  Guilherme). O espelhamento é o que impede a segunda faixa de ser a repetição
  literal da primeira e é onde o vão morto foi absorvido.
- **Arquivo:** `src/components/sections/leadership-section.tsx` (reescrito).
- **Mudanças:**
  - **pedestal**: a figura fica sobre um painel com gradiente vertical, halo
    radial e régua amarela na base, com `object-bottom` — a pessoa apoia sobre a
    régua em vez de pairar;
  - a superfície do pedestal ficou numa **camada própria com máscara
    horizontal**: aplicada direto no contêiner, desenhava um retângulo cinza de
    arestas retas sobre o grafite — o mesmo defeito de "placa com borda visível"
    já corrigido antes em `leonardo-section.tsx`. Mascarada, morre antes das
    laterais. A régua é o único elemento com aresta plena, e é ela que dá o chão;
  - **altura fixa** do pedestal (`22rem` → `26rem` → `30rem`), não altura ditada
    pela imagem: as duas faixas ficam com o mesmo peso mesmo com PNGs de
    proporções diferentes (900×1528 e 1024×1536);
  - enunciado curto na coluna secundária do cabeçalho, para a seção não abrir
    com título solto sobre 400px de grafite;
  - `sr-only` acrescentado ao link do Instagram de Leonardo (abre em nova aba).
- **Nenhuma foto foi gerada ou alterada.**

### C.2 — Livro consolidado

- **Problema:** cartão do livro no fim de `credibility-section.tsx`, a ~6.000px
  da única apresentação de Leonardo — lia como anúncio de produto entre os
  depoimentos e o CTA final. E a autoria aparecia **duas vezes**: no cartão e
  como bullet de Leonardo em `team.ts`.
- **Decisão:** mover para dentro do dossiê de Leonardo e remover o bullet.
- **Arquivos:** `leadership-section.tsx` (bloco adicionado),
  `credibility-section.tsx` (bloco e 4 imports removidos), `src/data/team.ts`
  (bullet de autoria removido — o dado **não saiu do projeto**, continua em
  `book`, `leonardo.ts`).
- **Escolha de texto:** o bloco usa `book.relation` ("A mesma leitura comercial
  que estrutura o livro é a que a Bianchini aplica ao analisar uma operação…")
  em vez da sinopse comercial. É essa ponte que transforma o livro de produto em
  **prova de método publicado**, que era o pedido.
- **Linha de crédito reduzida ao selo:** a primeira versão repetia `book.title`
  inteiro em condensada caixa-alta a 55% de opacidade, ao lado de uma capa onde
  o mesmo título já se lê — três linhas de texto pouco legível dizendo o que a
  imagem dizia. O título segue no `alt` da capa, disponível para leitor de tela
  e indexação.
- **Âncora:** `id="livro"` **acompanhou o bloco**. É destino de `#livro`
  (`leonardo-section.tsx:188`) e `/#livro` (`data/industry.ts:49`) — mover o
  bloco sem a âncora quebraria os dois links. Verificado por CDP: existe.
- **`purchaseUrl` segue `null`** e nenhum CTA de compra é renderizado.
- **O que ficou na credibilidade:** escala, segmentos, logotipos reais e os dois
  depoimentos — são **outras** provas, não repetição do livro, e por isso a
  seção continua existindo em vez de ser absorvida.
- **Rollback:** o bloco removido está descrito aqui e recuperável do histórico;
  os dados nunca saíram de `src/data/`.

---

## Lote D — hero

### D.1 — Alinhamento vertical

- **Problema:** ~290px de off-white vazio abaixo das métricas (medido na captura
  de 1440×900).
- **Mudança:** `lg:justify-center` na coluna de conteúdo — o **conjunto inteiro**
  é reposicionado, não cada elemento isoladamente.
- **Preservados:** diagonal, `pl-16` (o x=67 do mockup), altura estável da dobra,
  respiro superior e inferior. `--u` não foi tocado.
- **Divergência assumida:** a posição vertical do bloco deixa de ser a do
  mockup. É pedido explícito do gestor e está anotado no componente.

### D.2 — Tratamento da superfície esquerda

- **Mudança:** camada `aria-hidden` em `-z-10` dentro de `.hero-fold`, só a
  partir de `lg`, com (1) clarão radial no alto à esquerda, (2) quatro fios
  verticais de prancheta a 3,5% de opacidade, mascarados na vertical. O
  gradiente de dois níveis de `HERO_SURFACE` continua.
- **Conflito com `CLAUDE.md` e como foi resolvido:** o projeto proíbe grade
  cartesiana como fundo de seção. O briefing pede "linhas técnicas de baixa
  opacidade". A leitura adotada: **quatro fios verticais não são uma grade** —
  grade é padrão de duas direções repetido em campo; isto é margem de
  prancheta. Registrado em `03-decisoes-de-design.md` §7 para revisão do gestor.

### D.3 — Legibilidade sobre a fotografia

- **Mudança:** scrim do desktop de `h-46% 75/30` para `h-52% 88/42`; do mobile de
  `h-70% 85/40` para `h-72% 94/62`; rótulo "Explore os pilares" de `/55` para
  `/75`; pilares inativos de `/60` para `/75`.
- **Motivo:** os valores anteriores foram calibrados contra as fotos antigas. O
  balcão de madeira iluminado da nova imagem cai exatamente na faixa da
  navegação, e no mobile o bloco ocupa fração maior da caixa da foto.
- **Continua gradiente, não painel** — sem glassmorphism, sem blur, sem
  retângulo.

### D.4 — Transição entre slides

- **Problema:** o texto era remontado por `key`, então saía por **corte seco** e
  só a entrada era animada. A duração não era a causa da "dureza".
- **Mudança:** índice de exibição defasado (`displayIndex` + `leaving`) no
  componente, e `.hero-slide-out` no CSS. Três tempos coordenados:
  imagem dissolve em 700ms com 1,5% de deriva horizontal (conduz a troca), texto
  sai em 190ms, texto entra em 460ms. Saída + entrada = 650ms, dentro da faixa
  de 500–750ms pedida.
- **Moldura fixa:** etiqueta, CTA primário, régua, métricas e navegação não se
  movem. Autoplay, pausa, teclado, swipe e foco preservados.
- **`prefers-reduced-motion`:** a defasagem é desligada no componente
  (`displayIndex` acompanha `activeIndex` no mesmo quadro) e o CSS ganhou
  `opacity: 1` explícito em `.hero-slide-content`/`.hero-slide-out` — sem ele,
  `animation: none` deixaria o título **invisível**, que é exatamente o que
  `prefers-reduced-motion` não pode produzir. Verificado por CDP.

### D.5 — `aria-labelledby` do painel

- **Problema:** apontava para `-tab-${id}`, mas as abas usam
  `-tab-${variant}-${id}`. Nenhum elemento com o id referenciado existia.
- **Mudança:** aponta para a instância `desktop`, sempre presente no DOM.
- **Resultado:** 4/4 painéis da home resolvem (era 3/4).

### D.6 — `overflow-hidden` na caixa da foto do mobile

- **Problema:** regressão introduzida por D.4 — os slides inativos em
  `translateX(1.5%)` vazavam 12px de rolagem horizontal em 768px (1,5% de
  768px = 11,5px). O painel do desktop já recortava; esta caixa, não.
- **Mudança:** `overflow-hidden` na caixa da foto do mobile.
- **Resultado:** 0px de overflow nas 10 larguras.

---

## Lote E — "O ponto de partida"

- **Arquivo:** `src/components/sections/diagnosis-section.tsx` (reescrito).
  `src/data/diagnosis.ts` **não foi tocado** — nenhum texto foi apagado do
  projeto.
- **Mudanças:**
  1. **Grade de seis frentes desfeita.** Só as frentes da zona ativa têm forma
     de item; as outras quatro viram uma linha corrida de apoio ("Também no
     diagnóstico: …"). A informação de que o diagnóstico lê seis frentes
     continua na página, sem a matriz de itens inertes que desenhava a tabela.
  2. **Dois encerramentos viraram um.** "O que essa leitura permite decidir"
     saiu da coluna da direita e "O que acontece depois do primeiro contato"
     perdeu o bloco próprio; os dois formam uma faixa de conclusão de duas
     colunas, com o CTA no fim da leitura.
  3. **`nextSteps` consolidado** — ver a decisão de conteúdo em
     `01-auditoria-geral.md` §2. Saíram as descrições (é onde estava a
     repetição literal do método e a altura); ficaram os três rótulos em linha.
  4. **Controles refeitos** — de três células rentes unidas por uma borda
     superior contínua (forma de cabeçalho de tabela) para botões com caixa
     própria, borda inteira, `focus-visible` com anel e offset, e estado ativo
     por **três sinais somados**: preenchimento grafite, índice amarelo
     (legítimo — o fundo do botão ativo é escuro) e régua na base.
  5. **Título em duas linhas** (`max-w-[26ch]`, era `[20ch]`), apoio de `lead`
     para `body`.
  6. **Grade de 55/45 para 60/40**, dentro da faixa de 58–62/38–42 pedida.
     `sizes` da foto ajustado de `50vw` para `52vw`.
  7. **Selo da planta de 96×64 para 128×80**, com mais contraste: no tamanho
     anterior o desenho virava mancha cinza e os losangos não eram
     distinguíveis — era decoração, não mapa.
  8. `min-h` do painel de leitura de `23rem` para `19rem`, acompanhando o
     conteúdo mais curto.

---

## Lote F — controles de "Atuação integrada"

- **Escopo:** só os controles. Conteúdo, imagens, lógica dos níveis e estrutura
  do painel **não foram tocados**, conforme o briefing.
- **Arquivo:** `src/components/sections/scope-section.tsx`.
- **Mudanças:**
  1. **Alvo de clique real** — `px-3 py-3` com `-ml-3` compensando, então o
     alinhamento com a coluna não muda; o que muda é haver superfície para o
     cursor encontrar. O espinhaço foi reposicionado de `top-[0.5rem]` para
     `top-[15.5px]` para continuar passando pelo centro dos losangos.
  2. **Hover não troca mais o painel** — `onMouseEnter` disparava `setActive`:
     atravessar a fileira trocava o conteúdo cinco vezes, e um controle que
     reage à passagem lê como gráfico, não como botão. Hover virou só superfície
     e cor de rótulo. `onFocus` continua (padrão de aba com ativação automática).
  3. **Estado ativo deixou de ser amarelo.** Em fundo claro o amarelo é
     preenchimento ou hairline, nunca indicador de estado (1,4:1 sobre
     `canvas`). Nó ativo passou a grafite cheio, ampliado, com halo grafite;
     régua sob o rótulo também para grafite. O amarelo ficou só na **trilha de
     progresso** — hairline decorativa, e é ela que comunica a progressão.
  4. **Piso na trilha** (`max(1.25rem, …)`): media 0px no nível 01, então a
     progressão não existia no estado inicial.
  5. `focus-visible` com anel e offset nos controles do desktop e do accordion
     mobile; o accordion recebeu o mesmo vocabulário grafite.

---

## Lote G — validação integrada

Sem alteração de código além da correção D.6, descoberta aqui. Executados:

- `npm run type-check` — limpo
- `npm run lint` — limpo
- `npm run build` — 19 rotas, sem erro
- varredura de responsividade em 320/360/390/430/768/1024/1280/1366/1440/1586 —
  **0px de overflow em todas**
- verificação funcional por CDP: teclado, `prefers-reduced-motion`, âncoras,
  `aria-labelledby`, dados de contato, erros de console — resultados em
  `06-validacao-final.md`
- capturas `after` (18 arquivos) em `screenshots/after/`

---

## Arquivos tocados nesta rodada

**Alterados (10):**
`src/app/globals.css` · `src/components/layout/header.tsx` ·
`src/components/layout/mobile-menu.tsx` · `src/components/forms/contact-form.tsx` ·
`src/components/sections/hero-section.tsx` ·
`src/components/sections/pillars-section.tsx` ·
`src/components/sections/leadership-section.tsx` ·
`src/components/sections/credibility-section.tsx` ·
`src/components/sections/diagnosis-section.tsx` ·
`src/components/sections/scope-section.tsx`

**Dados alterados (2):** `src/data/hero-slides.ts` (slide 3 + 2 campos novos no
tipo) · `src/data/team.ts` (bullet de autoria removido)

**Assets (1):** `public/images/hero/operação-comerrcial.png` →
`public/images/hero/operacao-comercial.png` (renomeado, não apagado)

**Criados:** nenhum arquivo de código.

**Removidos:** nenhum arquivo. Ver `02-inventario-de-arquivos.md` para os
candidatos avaliados e por que nenhum foi removido nesta rodada.

---

## §R1 — Registro preservado da rodada 1

Nada abaixo foi revertido.

| # | Mudança | Arquivo |
|---|---|---|
| r1-1 | URL `/leonardo-bianchini` duplicada removida do sitemap | `src/app/sitemap.ts` |
| r1-2 | `headerHeight`/`headerHeightMobile` órfãs removidas | `src/styles/spacing.ts` |
| r1-3 | Export morto `solutionsNav` removido | `src/data/navigation.ts` |
| r1-4 | Focus trap de teclado no menu mobile | `src/components/layout/mobile-menu.tsx` |
| r1-5 | `lines.zip` e `projetos.zip` movidos para fora de `public/` | `docs/archive/raw-assets/` |

Ferramental criado na rodada 1 e reutilizado nesta:
`scripts/site-audit-capture.mjs` e `scripts/site-audit-responsive.mjs`. Nenhum
dos dois altera o site.
