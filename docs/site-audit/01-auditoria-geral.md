# 01 — Auditoria geral

> **Rodada 2 — 2026-08-04.** A rodada 1 (mesmo dia) auditou o repositório e
> concluiu que "o código já implementa quase a totalidade do estado-alvo",
> corrigindo apenas P2/P3 de higiene. Esta rodada **reauditou seção a seção
> contra o briefing** e encontrou o oposto em quatro pontos: itens explicitamente
> obrigatórios no briefing **não estavam implementados no código**. O registro da
> rodada 1 está preservado no fim deste documento (§14) para não apagar o
> histórico; as capturas dela ficaram em `screenshots/_round1/`.
>
> Metodologia desta rodada: leitura direta do código de todas as seções da home,
> captura CDP/Edge headless em 1440×900 e 390×844 (`screenshots/before/`),
> varredura automatizada de overflow em 10 larguras (320→1586px), e verificação
> funcional por CDP de teclado, `prefers-reduced-motion`, âncoras, `aria-*` e
> dados de contato.

## Resumo executivo

**Quatro achados P1 e um P2 que a rodada anterior deu como resolvidos não
estavam no código.** Todos verificados por leitura de arquivo, não presumidos:

| Item do briefing | Estado real encontrado |
|---|---|
| Imagem `operação-comercial` no slide 3 da hero | **Não aplicada** — slide 3 usava `show-cooking.jpg` |
| Instagram fora do header desktop | **Presente** em `header.tsx:119-127` |
| Leonardo não duplicado nos cartões de pilar | **Duplicado** — `responsible` repetido em 2 de 3 cartões |
| Livro consolidado no contexto de Leonardo | **Separado** — cartão próprio no fim de `credibility-section.tsx` |
| "Não manter nenhum número antigo" de WhatsApp | **Antigo presente** no formulário de contato (2 ocorrências) |

Além desses, a auditoria visual encontrou os problemas de composição que o
briefing descreve (hero alta demais e fundo chapado, diagnóstico com forma de
relatório, "Quem conduz" com recortes flutuando em vazio) — todos confirmados
por medição nas capturas, não por impressão.

**Sem achado P0.** `type-check`, `lint` e `build` passavam limpos antes das
alterações e continuam passando depois.

---

## 1. Hero

### Achado — P1 — imagem obrigatória do slide 3 não aplicada

- **Local:** `src/data/hero-slides.ts`, terceiro slide.
- **Descrição:** o briefing determina substituir a imagem do slide de Operação
  Comercial pelo asset entregue pelo gestor. O slide usava
  `/images/hero/show-cooking.jpg` — um balcão de distribuição, ou seja,
  evidência de **cozinha**, o mesmo assunto dos slides 01 e 02. O terceiro
  pilar, que é justamente o que não é cozinha, era ilustrado como se fosse.
- **Evidência:** leitura de `hero-slides.ts`; o asset entregue existia em
  `public/images/hero/` sob o nome `operação-comerrcial.png` e não era
  referenciado por nenhum arquivo (`grep` em `src/`, zero ocorrências).
- **Impacto:** o pilar de maior risco de incompreensão ("por que uma empresa de
  cozinha fala de CRM?") perdia a única chance de se explicar por imagem.
- **Severidade:** P1 — item obrigatório do briefing, não cumprido.
- **Causa provável:** o asset foi entregue depois da última passagem de hero e
  ninguém ligou o arquivo ao dado.
- **Correção:** ver `07-registro-de-alteracoes.md` §1.1.
- **Critério de aceite:** slide 3 renderiza o novo arquivo, enquadrado sem
  distorção em 390/768/1024/1440/1586, com `alt` descritivo e sem atribuir
  cliente, obra ou case.

### Achado — P1 — bloco da coluna esquerda alto demais

- **Local:** `hero-section.tsx`, coluna de conteúdo.
- **Descrição:** a coluna era `flex-col` sem alinhamento vertical, então o
  conjunto (etiqueta → título → texto → CTAs → métricas) encostava no topo.
- **Evidência:** `screenshots/before/hero-1440-slide1-before.png` — as métricas
  terminam em y≈600 e restam **~290px de off-white vazio** até a base da dobra.
- **Impacto:** a primeira dobra, que é a peça de conversão da página, terminava
  com quase um terço da sua metade esquerda sem função.
- **Severidade:** P1.
- **Correção:** `lg:justify-center` na coluna — o conjunto inteiro é
  reposicionado, não cada elemento isoladamente. Diagonal, alinhamento
  horizontal (`pl-16`) e altura estável preservados.

### Achado — P1 — superfície esquerda chapada

- **Local:** `hero-section.tsx` / `HERO_SURFACE`.
- **Descrição:** ~47% da dobra era um off-white com um gradiente tonal de dois
  passos, praticamente imperceptível na captura. Lia como "fundo branco grande".
- **Evidência:** mesma captura acima.
- **Correção:** três camadas subordinadas — clarão radial no alto à esquerda,
  quatro fios verticais de prancheta a 3,5% de opacidade (mascarados na
  vertical, e **não** uma grade cartesiana — ver a nota de conflito em
  `03-decisoes-de-design.md` §7), e o gradiente de dois níveis que já existia.

### Achado — P1 — troca de slide "dura"

- **Local:** `hero-section.tsx` + `globals.css`.
- **Descrição:** o bloco de texto era remontado por `key={current.id}`. React
  desmontava o conteúdo antigo e montava o novo já animando a entrada: **corte
  seco na saída**, fundido só na entrada. A duração (550ms) não era o problema.
  A fotografia trocava por `opacity` pura, sem deslocamento — duas imagens
  paradas no mesmo enquadramento fazem uma piscada, não uma substituição.
- **Evidência:** leitura do JSX (`key` no wrapper do painel) e do CSS.
- **Correção:** índice de exibição defasado (`displayIndex`), saída de 190ms +
  entrada de 460ms = 650ms, sob uma dissolução de imagem de 700ms com 1,5% de
  deriva horizontal. Ver `03-decisoes-de-design.md` §8.

### Achado — P2 — `aria-labelledby` do painel apontando para id inexistente

- **Local:** `hero-section.tsx`, `role="tabpanel"`.
- **Descrição:** o painel declarava `aria-labelledby={baseId-tab-${id}}`, mas as
  abas são renderizadas com `id={baseId-tab-${variant}-${id}}` (duas instâncias,
  mobile e desktop). Nenhum elemento com o id referenciado existia no DOM.
- **Impacto:** leitor de tela não anunciava o nome do painel do carrossel.
- **Evidência:** verificação por CDP — a checagem de todos os `[role=tabpanel]`
  da home mostrava este com `labelExists: false`; os outros três, `true`.
- **Correção:** aponta para a instância `desktop`, que existe sempre no DOM.
- **Critério de aceite:** os quatro painéis da home com `aria-labelledby`
  resolvem para um elemento existente. **Verificado após a correção: 4/4.**

### Achado — P2 — legibilidade do contexto sobre a fotografia

- **Local:** scrims do painel (desktop e mobile).
- **Descrição:** calibrados contra as fotos antigas, os gradientes (75/30 no
  desktop, 85/40 no mobile) não seguravam a nova imagem do slide 3, cujo balcão
  de madeira iluminado cai exatamente na faixa da navegação.
- **Evidência:** captura do slide 3 no mobile — "Explore os pilares" e os
  pilares inativos sobre madeira clara.
- **Correção:** 88/42 (desktop) e 94/62 (mobile), rótulos de `/55` e `/60` para
  `/75`. Continua gradiente, não painel: a fotografia segue visível inteira.

---

## 2. "O ponto de partida" (diagnóstico)

### Achado — P1 — a seção tinha forma de relatório técnico

- **Local:** `diagnosis-section.tsx`.
- **Descrição:** quatro defeitos somados, todos de composição:
  1. **grade de seis frentes** sempre listadas, com as duas da zona ativa
     marcadas e **quatro esmaecidas** ocupando espaço sem serem lidas — uma
     matriz de itens majoritariamente inertes é literalmente a forma de uma
     tabela de relatório;
  2. **dois encerramentos** — "O que essa leitura permite decidir" fechando a
     coluna e, logo abaixo, "O que acontece depois do primeiro contato" abrindo
     outro bloco alto com título, três etapas descritas e CTA;
  3. **título em três linhas** contra um texto de apoio esmaecido: ~190px só de
     enunciado;
  4. **controles com forma de cabeçalho de tabela** — três células rentes
     unidas por uma borda superior contínua, sem moldura própria.
- **Evidência:** `screenshots/before/diagnostico-1440-before.png`.
- **Correção:** ver `07-registro-de-alteracoes.md` §1.5.

### Achado — P1 (conteúdo) — `nextSteps` repete o método

- **Local:** `src/data/diagnosis.ts` (`nextSteps`) contra `methodSteps`.
- **Descrição:** "Conversa inicial · Visita técnica · Devolutiva com
  prioridades" conta o mesmo primeiro movimento do funil que `methodSteps` 01–03
  ("Diagnóstico · Identificação dos problemas · Priorização das soluções"), que
  é o que a seção Método (`journey-section.tsx`, âncora `#metodo`) exibe.
- **Impacto:** o mesmo processo descrito duas vezes na mesma página, a ~4.000px
  de distância.
- **Decisão:** consolidar sem apagar. A sequência responde "o que acontece se eu
  clicar", e esse é um argumento de conversão que pertence ao lado do CTA, não
  ao método. Saíram as **descrições** — é nelas que a repetição literal estava e
  é o que dava altura de seção ao bloco. Ficaram os três rótulos, em linha.
  Os textos completos seguem íntegros em `data/diagnosis.ts`.

---

## 3. "Como a Bianchini está organizada" (pilares)

### Achado — P1 — Leonardo duplicado e fileira desalinhada

- **Local:** `pillars-section.tsx` + `data/pillars.ts`.
- **Descrição:** cada cartão trazia o próprio responsável. Como Leonardo responde
  por dois dos três pilares, "Leonardo Bianchini" aparecia **duas vezes lado a
  lado, em selos idênticos** — lê como erro de montagem, não como informação.
  Pior: o rodapé de cada cartão dependia da altura do texto acima, e o terceiro
  pilar (copy mais curta) subia o selo ~26px em relação aos outros dois.
- **Evidência:** `screenshots/before/pilares-1440-before.png` — os dois selos
  "LB" e o desalinhamento do terceiro são visíveis na captura.
- **Impacto:** o briefing marca a duplicação como critério de aceite explícito.
- **Correção:** oferta e responsabilidade separadas em duas camadas. Ver
  `03-decisoes-de-design.md` §5.

### Achado — P2 — numeral gigante violando o teto de composição

- **Local:** `pillars-section.tsx`, `IndexNumeral` a `6.5rem`.
- **Descrição:** `CLAUDE.md` registra o teto "numeral gigante: nenhum na home;
  índices são pequenos e ficam na margem". O cartão trazia um numeral esmaecido
  de 5,5–6,5rem, cortado pela borda do próprio cartão.
- **Correção:** índice pequeno na margem superior, ao lado do traço amarelo.

---

## 4. "Quem conduz"

### Achado — P1 — recortes flutuando em vazio

- **Local:** `leadership-section.tsx`.
- **Descrição:** os dois PNGs recortados ficavam lado a lado em caixas de
  `max-w-[16rem]`, com o texto **abaixo** da figura. Três defeitos somados:
  (a) um recorte com fundo removido, sem nada por baixo, não tem onde pousar —
  lê como figura colada; (b) a largura era ditada pelo texto e a altura pela
  figura, então sobrava vão em todas as direções; (c) o nome, que é a informação
  da seção, vinha depois de ~450px de imagem.
- **Evidência:** `screenshots/before/quem-conduz-1440-before.png` — a seção abre
  com ~70px de título e depois ~450px de grafite quase vazio; os nomes ficam
  fora da dobra.
- **Impacto:** a principal prova de autoridade da home era a seção com menos
  densidade dela.
- **Correção:** faixas editoriais espelhadas com pedestal. Ver
  `03-decisoes-de-design.md` §6.

### Achado — P1 (conteúdo) — livro duplicado e fora de contexto

- **Local:** `credibility-section.tsx` (cartão do livro) + `data/team.ts`
  (bullet "Autor de…" no dossiê de Leonardo).
- **Descrição:** o livro era um cartão próprio no fim da credibilidade, a
  ~6.000px da única apresentação de Leonardo na home — lia como anúncio de
  produto encaixado entre depoimentos e o CTA final. E a credencial de autoria
  aparecia **duas vezes**: no cartão e como bullet de Leonardo.
- **Correção:** consolidado no dossiê de Leonardo, com a capa real em tamanho
  legível; o bullet de autoria saiu (o bloco já diz o mesmo). A âncora
  `id="livro"` **acompanhou o bloco** — é destino de `#livro`
  (`leonardo-section.tsx`) e `/#livro` (`data/industry.ts`); movê-la sem os
  links quebraria os dois. **Verificado após a correção: âncora existe.**

---

## 5. "Atuação integrada"

### Achado — P2 — controles sem identidade de controle

- **Local:** `scope-section.tsx`, espinhaço de cinco nós.
- **Descrição:** quatro problemas: (a) os nós eram texto solto sobre a linha,
  sem preenchimento — a área sensível existia mas nada a anunciava; (b)
  `onMouseEnter` disparava `setActive`, então atravessar a fileira com o mouse
  trocava o conteúdo cinco vezes, e um controle que reage à passagem lê como
  gráfico, não como botão; (c) o estado ativo usava **amarelo em fundo claro**,
  contra a regra do projeto (1,4:1 sobre `canvas`; indicador de estado em
  superfície clara é grafite); (d) a trilha de progresso media 0px no nível 01,
  então a progressão não existia no estado inicial.
- **Correção:** caixa com `px-3 py-3` e recuo compensado, hover só visual, nó
  ativo em grafite com halo grafite, régua do rótulo em grafite, amarelo mantido
  só na trilha (hairline decorativa, que é onde ele é legítimo), piso de
  `1.25rem` na trilha. Estrutura, conteúdo, imagens e lógica dos níveis
  **não foram tocados**, conforme o briefing.

---

## 6. Header e contato

### Achado — P1 — Instagram no header desktop

- **Local:** `header.tsx:119-127`.
- **Descrição:** o briefing determina removê-lo. Além disso, o glifo do
  Instagram é um gradiente saturado e ficava encostado no amarelo do CTA — dois
  destaques de cor concorrentes na mesma faixa, onde só o CTA deveria puxar o
  olho.
- **Evidência:** visível em toda captura de 1440 da rodada.
- **Correção:** removido do cabeçalho. A posição institucional passa a ser o
  rodapé; o menu mobile mantém o item, agora com rótulo, ícone de 18px e alvo de
  toque de 44px (antes era um link de texto de ~20px de altura).
  **Verificado após a correção: `header a[href*=instagram]` não existe.**

### Achado — P2 — número de WhatsApp antigo no formulário

- **Local:** `contact-form.tsx`, mensagem de erro e `placeholder`.
- **Descrição:** o número oficial já estava correto em `site.ts`
  (`+55 21 99518-1918` / `5521995181918`), mas o formulário usava o **número
  antigo da empresa** como exemplo de formato, em dois lugares — um número
  desatualizado impresso na tela e discável.
- **Correção:** exemplo trocado por máscara neutra `(21) 90000-0000`, que não é
  o número de ninguém. **Verificado após a correção: `96469` não aparece em
  nenhum ponto do HTML renderizado da home; `99518-1918` e `5521995181918`
  aparecem.**

---

## 7. Responsividade

Varredura automatizada nas 10 larguras exigidas, com rolagem completa antes de
medir. Dados brutos em `screenshots/after/responsive-audit.json`.

| Largura | Overflow horizontal de documento |
|---|---|
| 320, 360, 390, 430 | 0px |
| 768, 1024, 1280, 1366, 1440, 1586 | 0px |

### Achado — P1 — regressão de overflow introduzida e corrigida na mesma rodada

Vale registrar porque documenta uma armadilha real: ao adicionar a deriva
horizontal de 1,5% na troca de slide, a **primeira medição acusou 12px de
rolagem horizontal em 768px**. Causa: os slides inativos ficam em
`translateX(1.5%)` e a caixa da foto do **mobile** não tinha `overflow-hidden`
(o painel diagonal do desktop tinha). 1,5% de 768px = 11,5px ≈ os 12px medidos.
Corrigido com `overflow-hidden` na caixa. É o mesmo princípio já anotado em
`CLAUDE.md` para a cortina do hero: transform e `clip-path` pintam, mas
continuam contando como área rolável.

Os 15 elementos reportados como "mais largos que a viewport" em toda largura são
os falsos positivos já conhecidos e documentados na rodada 1 (faixa de logos em
`.animate-marquee`, contida por `.marquee-mask.overflow-hidden`, e a cortina do
hero). Confirmado: nenhum produz overflow de documento.

## 8. Acessibilidade — verificação funcional por CDP

| Verificação | Resultado |
|---|---|
| `prefers-reduced-motion`: cortina do hero | `display: none` ✔ |
| `prefers-reduced-motion`: título após troca de slide | `opacity: 1`, texto presente ✔ |
| Teclado no carrossel: `→`, `→`, `Home`, `End` | seleção 0→1→0→2, foco permanece em `[role=tab]` ✔ |
| Título da hero após navegação por teclado | trocou para o slide 03 ✔ |
| `aria-labelledby` dos 4 `[role=tabpanel]` da home | 4/4 resolvem para elemento existente ✔ (era 3/4) |
| Âncoras `#pilares #projetos #equipamentos #metodo #quem-conduz #livro #diagnostico #atuacao #industria-do-inox #credibilidade` | 10/10 existem ✔ |
| Erros de console (1440 e 390, página inteira) | nenhum ✔ |

Estados ativos passaram a ter sinal **além da cor** em todos os controles
tocados: zonas do diagnóstico (preenchimento + índice + régua na base), níveis
de atuação (escala do losango + halo + peso do rótulo + régua).

## 9. Performance

- Build de produção: 19 rotas estáticas, sem erro. Home 12,2kB / 139kB First
  Load JS (era 11,8kB / 139kB — +0,4kB pelo estado de defasagem do carrossel).
- Nenhuma biblioteca adicionada. Motion continua em CSS/Tailwind.
- Altura total da home: **desktop 16.007 → 16.057px** (praticamente estável) e
  **mobile 26.272 → 25.647px (−625px)**. O que saiu do diagnóstico e da
  credibilidade foi reinvestido em "Quem conduz", que o briefing exigia
  adensar — ver a limitação registrada em §11.
- `sizes` do painel do diagnóstico ajustado de `50vw` para `52vw`,
  acompanhando a mudança da grade de 55/45 para 60/40.

## 10. Conteúdo — nada inventado

Nenhum dado novo sobre a Bianchini foi criado nesta rodada. Todo texto exibido
vem de `src/data/`. As duas frases redigidas são estruturais e derivam de dados
já aprovados:

- enunciado de "Quem conduz" ("Projetos e equipamentos de um lado, operação
  comercial do outro — as três frentes respondem a duas pessoas, não a um
  organograma") — derivado de `pillars.responsible` e `team.role`;
- rótulos de seção ("Quem responde por cada frente", "Frentes lidas nesta zona",
  "Depois do primeiro contato").

A ponte estratégica obrigatória — "Cozinha eficiente sem operação de vendas
continua sem faturamento" — segue literal em `pillars.ts` e `hero-slides.ts`.

## 11. Limitações desta rodada

- **Não há medição per-seção do estado anterior.** A instrumentação da rodada 1
  registrou só a altura total da página e recortes de viewport, não a altura de
  cada `section`. As alturas per-seção passaram a ser coletadas nesta rodada
  (§9), então a comparação numérica por seção só existirá a partir da próxima.
  A redução do diagnóstico está documentada **estruturalmente** (o que saiu), não
  por número.
- **Contraste não foi medido com ferramenta automatizada** nesta rodada; foi
  verificado por regra (a regra do amarelo do projeto) e por inspeção das
  capturas. Uma passagem com axe/Lighthouse continua pendente.
- **`prefers-reduced-motion` foi verificado em 1440×900**, não nas 10 larguras.

## 12. Pendências que continuam com o gestor

Herdadas da rodada 1, **não resolvidas** e não resolvíveis por código:

| Item | Situação |
|---|---|
| Depoimentos publicados sem confirmação registrada de autorização (`testimonials.ts`) | **P1 — aberto.** Ver §14 |
| Política de privacidade sem razão social/CNPJ e sem revisão jurídica | **P2 — aberto** |
| `NEXT_PUBLIC_SITE_URL` de produção não confirmada | **Aberto** — sitemap/robots/`metadataBase` caem em localhost sem ela |
| `book.purchaseUrl`, ano, editora e ISBN | **Aberto** — segue `null`; nenhum CTA de compra é renderizado |

## 13. Tabela-resumo dos achados desta rodada

| # | Sev. | Achado | Área | Ação |
|---|---|---|---|---|
| 1 | P1 | Imagem `operação-comercial` não aplicada ao slide 3 | Hero / conteúdo | Corrigido |
| 2 | P1 | Instagram no header desktop | Header / UI | Corrigido |
| 3 | P1 | Leonardo duplicado nos cartões de pilar | Pilares / AI | Corrigido |
| 4 | P1 | Livro duplicado e fora do contexto de Leonardo | Credibilidade / fluxo | Corrigido |
| 5 | P1 | Coluna da hero alta demais (~290px de vazio) | Hero / composição | Corrigido |
| 6 | P1 | Superfície esquerda da hero chapada | Hero / direção de arte | Corrigido |
| 7 | P1 | Troca de slide dura (corte seco na saída) | Hero / motion | Corrigido |
| 8 | P1 | Diagnóstico com forma de relatório técnico | Diagnóstico / composição | Corrigido |
| 9 | P1 | `nextSteps` repete o método | Conteúdo / fluxo | Consolidado |
| 10 | P1 | "Quem conduz" com recortes flutuando em vazio | Liderança / composição | Corrigido |
| 11 | P1 | Overflow de 12px em 768px (regressão da própria rodada) | Responsividade | Corrigido |
| 12 | P2 | `aria-labelledby` do painel da hero apontando para id inexistente | Acessibilidade | Corrigido |
| 13 | P2 | Número de WhatsApp antigo no formulário | Conteúdo | Corrigido |
| 14 | P2 | Legibilidade do contexto sobre a fotografia | Hero / contraste | Corrigido |
| 15 | P2 | Controles de atuação sem identidade de controle | UI / acessibilidade | Corrigido |
| 16 | P2 | Numeral gigante nos pilares (fere teto de composição) | Direção de arte | Corrigido |
| 17 | P3 | Instagram do menu mobile com alvo de toque insuficiente | Acessibilidade | Corrigido |

Nenhum P0.

---

## 14. Registro preservado da rodada 1 (2026-08-04, mesma data)

A primeira rodada concluiu não haver achado estrutural e corrigiu cinco itens de
higiene, todos os quais **continuam válidos e não foram revertidos**:

| # | Sev. | Achado | Ação |
|---|---|---|---|
| r1-1 | P1 | Depoimentos sem confirmação registrada de autorização | Decisão do gestor — **segue aberta** |
| r1-2 | P2 | Política de privacidade incompleta | Decisão do gestor — **segue aberta** |
| r1-3 | P2 | `sitemap.ts` com `/leonardo-bianchini` duplicado | Corrigido na rodada 1 |
| r1-4 | P2 | Menu mobile sem focus trap de teclado | Corrigido na rodada 1 |
| r1-5 | P2 | `.zip` não referenciados dentro de `public/` | Movidos para `docs/archive/raw-assets/` |
| r1-6 | P3 | `solutionsNav` — export morto | Removido na rodada 1 |
| r1-7 | P3 | `spacing.ts` — constantes órfãs | Removidas na rodada 1 |

**Por que a rodada 1 não viu os cinco itens do resumo executivo:** ela verificou
o repositório contra o próprio código e a documentação interna — que descreviam
o estado-alvo como já alcançado — em vez de verificar cada exigência do briefing
contra o arquivo correspondente. O detalhe do livro, por exemplo, está descrito
como consolidado no comentário de `credibility-section.tsx`, mas o que estava
consolidado ali era a fusão de quatro seções, não a mudança pedida no briefing.
A lição de método para as próximas rodadas está em
`00-contexto-e-objetivos.md` §11.

Nota de ferramental herdada e ainda válida: captura por `clip` do CDP sai em
branco quando a página já rolou antes da captura (Edge headless 150.x/151.x).
`scripts/site-audit-capture.mjs` usa `scrollIntoView` + viewport inteira.
