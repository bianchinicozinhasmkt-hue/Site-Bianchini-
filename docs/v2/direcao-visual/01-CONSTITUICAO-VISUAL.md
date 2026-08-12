# 01 — Constituição Visual da Bianchini

```text
STATUS: ACTIVE — sistema visual normativo da Home V2
DATA: 2026-08-12
ESCOPO: Home. As rotas internas herdam o sistema, mas não são governadas por este documento.
NATUREZA: definição de sistema. Nenhum arquivo de produto foi alterado para produzi-lo.
```

## 0. O que este documento é, e o que ele substitui

Este é o **sistema visual definitivo da Home**. Ele existe porque o projeto vinha
remodelando os mesmos elementos a cada rodada — a primeira dobra sozinha foi refeita
oito vezes entre 2026-08-08 e 2026-08-11, e o seletor de pilares assumiu **cinco
topologias diferentes** (rótulos soltos → células de grade → rótulos com vão largo →
chapa subdividida → três portas separadas). Cada rodada foi tecnicamente correta e
resolveu o defeito que tinha diante de si. O que faltava não era execução: era um
documento que dissesse, antes da rodada, qual é a forma certa — para que a rodada
seguinte não pudesse reabrir a anterior por preferência.

A partir daqui, **o que este documento fixa não é reinterpretável por rodada de
implementação**. Uma rodada pode apontar que uma regra daqui está errada; não pode
decidir sozinha o contrário dela.

### Posição na cadeia de precedência

Este documento entra **abaixo** de `docs/v2/DECISIONS.md`, `docs/v2/V2_PRODUCT.md` e
`MASTER_BIANCHINI.md`, e **no lugar de** `docs/v2/DESIGN_SYSTEM.md` naquilo que o
DESIGN_SYSTEM marcava como `A DEFINIR NO GATE 2`:

```text
DECISIONS.md > V2_PRODUCT.md > MASTER_BIANCHINI.md > spec vigente
  > [01-CONSTITUICAO-VISUAL.md + 03-BLUEPRINT-HOME.md]  ← este nível
  > DESIGN_SYSTEM.md > referência > histórico
```

### Um conflito documental que precisa ser registrado, não resolvido por mim

`docs/v2/wireframes/V2-02-home-direcao-visual.md` (2026-08-07) descreve uma Home de
**9 seções** e está marcado `STATUS: PROPOSTA PARA REVISÃO — não aprovado, não
implementar`. A Home que está no ar tem **13 seções** e não segue aquela arquitetura:
ela é a hero V2 mais doze seções da V1 reordenadas.

Isso **não é** conflito de precedência — um documento não aprovado não governa nada, e
a regra do repositório é clara. Mas é uma divergência que ninguém registrou: o Gate 2
foi proposto para uma página que não foi a página construída. Este documento adota o
**produto atual** como baseline, conforme instrução explícita do gestor, e recomenda
que o wireframe de 2026-08-07 seja marcado `SUPERSEDED` por esta pasta. Essa
remarcação é ato de governança e **não foi executada aqui** — está listada como
decisão W-5 no relatório final.

---

## 1. Baseline validado

Tudo neste documento foi medido no código em `HEAD` da branch `v2`, não deduzido de
documentação.

| dimensão | valor real hoje |
| --- | --- |
| Seções da Home | 13 (hero V2 + 12 seções V1) |
| Altura total | 14.490px em 1440 · 22.085px em 390 (**26,2 telas**) |
| Container | `max-w-container` 1400px · `wide` 1520px · `prose` 68ch |
| Gutters (recuo do `Container`) | 20px (`px-5`) · 32px (`md:px-8`) · 40px (`lg:px-10`) |
| Guia de conteúdo efetiva (medida) | 20 · 20 · 32 · 40 · 40 · 60 · 140 · 300 em 320→1920 — **não** é o recuo acima de 1400 |
| Guia do cabeçalho (medida) | 3,1% da janela a partir de `lg` — **eixo próprio**, 240px à esquerda do `h1` em 1920 |
| Ritmo de seção | `xs` 32/40 · `sm` 48/64 · `default` 64/80/80 · `lg` 80/96/120 |
| Famílias | Manrope (`font-sans`) + Oswald (`font-condensed`) |
| Seções escuras | 6 de 13, em dois pares adjacentes |
| Imagens que rompem o container | **2**, em 14.490px de página |
| Área do container ocupada por imagem | 0% em `#pilares` · 3% em `#leonardo` · 5% em `#credibilidade` |

As três últimas linhas são o diagnóstico central deste documento e voltam em toda
regra que se segue.

---

## 2. Os dez princípios

Máximo de dez, em ordem de precedência. Quando dois colidirem, o de número menor vence.

1. **A fotografia é o argumento, não a ilustração do argumento.** A Bianchini tem
   acervo real de operações entregues — é o ativo mais forte do projeto e o mais
   subutilizado. Uma seção sem imagem precisa justificar a ausência; uma seção com
   imagem contida dentro de um container de 1400px está desperdiçando o ativo.

2. **Uma seção, um protagonista.** Se o olho tem duas coisas para pegar primeiro, a
   seção não foi composta — foi preenchida.

3. **Grafite é o material, amarelo é o gesto.** O amarelo nunca é superfície de área.
   Ele marca marca, ação e estado — nessa ordem, e no máximo três regiões relevantes
   por viewport.

4. **Densidade de decisão, não densidade de informação.** Cada rolagem tem de avançar
   a decisão de compra. `#equipamentos` tem 2.443 caracteres e 26 blocos de texto: isso
   é um documento, não uma dobra comercial.

5. **Condensada é rótulo; sans é voz.** Oswald só em botão, etiqueta, numeral, índice e
   cota. Nunca em frase. A instrução do seletor já foi corrigida por essa regra uma vez
   e não deve regredir.

6. **Assimetria é o padrão; simetria é a exceção que se justifica.** Duas colunas iguais
   com texto à esquerda e imagem à direita é a silhueta que produz aparência de
   template — e é a silhueta de cinco das treze seções atuais.

7. **Nada de moldura.** Card com borda, célula de grade, painel com fio divisório e
   caixa preenchida são a gramática de painel administrativo. O que desenha um objeto é
   régua, aresta e tipografia — não contorno fechado.

8. **Motion tem função ou não existe.** Entrada, troca de estado e resposta a toque.
   Nenhum laço, nenhum parallax, nenhum ambiente. Toda animação tem de sobreviver a
   `prefers-reduced-motion` sem esconder conteúdo.

9. **A prova é numérica e material; o que falta é atribuição.** A Bianchini tem números
   confirmados — **17 anos de atuação**, **3.000+ projetos entregues**, abrangência
   Brasil — e eles podem e devem aparecer em escala. O que ela **não** pode fazer é
   nomear cliente, local, prazo, métrica de case, certificação ou percentual de economia.
   A consequência de design é precisa: **a prova numérica cabe em um lugar só**
   (`#credibilidade`), e todo o resto da página prova pela matéria — inox, obra, planta,
   pessoa.

10. **Toda regra deste documento vale até a medição contradizê-la.** Contraste,
    overflow e altura de dobra são medidos, não estimados. Onde a medição reprova, a
    medição vence — inclusive contra este documento.

---

## 3. Constituição — LAYOUT

### 3.1 Gutter, container e guia — três medidas, três nomes

Revisado em **2026-08-12** (micro-gate R−1.1). A versão anterior desta seção trazia uma
tabela e uma fórmula que **não produziam os mesmos números**, e chamava de "gutter" três
grandezas diferentes. Os três erros estão listados em §3.1.5.

Antes de qualquer valor, as três grandezas. Elas **não precisam ser iguais** — precisam
ser nomeadas:

| # | nome | o que é |
| --- | --- | --- |
| **A** | **gutter de viewport** | distância mínima entre a aresta da janela e qualquer conteúdo contido. É um **piso de segurança**, não um alvo de composição |
| **B** | **recuo interno do `Container`** | o que o componente acrescenta **por dentro** da própria caixa. **É zero.** Ver §3.1.3 |
| **C** | **guia de conteúdo** | o `x` real da primeira letra do `h1`, da etiqueta, do parágrafo e do CTA. É o único dos três que a composição enxerga |

#### 3.1.1 A regra

```css
--gutter: clamp(20px, 5vw, 72px);                 /* A */
width: min(1400px, 100% - 2 * var(--gutter));     /* casca */
margin-inline: auto;                              /* B = 0 */
```

O gutter é **margem**, não recuo interno. Dessa construção decorre a guia, que é sempre
**uma das duas** grandezas — nunca a soma delas:

```text
C = max( A , (100vw − 1400px) / 2 )
```

- abaixo de **1544px** manda o gutter: `C = A`;
- de **1544px** para cima manda o teto da casca: `C = (100vw − 1400px) / 2`, e o gutter
  **deixa de morder**.

1544 não é um breakpoint declarado e não deve virar um: é onde as duas expressões se
cruzam (1400 + 2 × 72). Quem implementar não escreve 1544 em lugar nenhum — escreve o
`max()`.

**Por que `5vw`.** É a única constante que passa pelos três pontos que a direção já
tinha fixado à mão: piso de 20px até 400px de janela, teto de 72px exatamente em 1440, e
progressão contínua entre os dois sem degrau. O piso protege o telefone (em 320 e 390 o
valor **não muda em nada** em relação ao produto de hoje) e o teto impede que a margem
comece a competir com o conteúdo antes de o container assumir.

#### 3.1.2 Tabela — derivada da fórmula, não escrita à mão

Esta tabela é **saída** da regra acima. Se um dia ela divergir da fórmula, a fórmula
vence e a tabela está desatualizada — foi exatamente a divergência inversa que produziu
o erro corrigido neste micro-gate.

| viewport | A · gutter | largura do container | `x` do container | B · recuo interno | **C · guia** | largura de conteúdo | guia hoje |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 320 | 20 | 280 | 20 | 0 | **20** | 280 | 20 |
| 390 | 20 | 350 | 20 | 0 | **20** | 350 | 20 |
| 768 | 38,4 | 691,2 | 38,4 | 0 | **38,4** | 691,2 | 32 |
| 1024 | 51,2 | 921,6 | 51,2 | 0 | **51,2** | 921,6 | 40 |
| 1366 | 68,3 | 1229,4 | 68,3 | 0 | **68,3** | 1229,4 | 40 |
| 1440 | 72 | 1296 | 72 | 0 | **72** | 1296 | 60 |
| 1600 | 72 *(não morde)* | 1400 | 100 | 0 | **100** | 1400 | 140 |
| 1920 | 72 *(não morde)* | 1400 | 260 | 0 | **260** | 1400 | 300 |

A coluna "guia hoje" é **medição**, não estimativa: capturada no produto em `HEAD` da
branch `v2` em 2026-08-12, nas oito larguras, com `devicePixelRatio` 1.

Duas leituras que a tabela obriga:

- **Abaixo de 1400 a margem cresce**; é aí que o sistema atual estava travado (40px de
  1024 a 1400, ou seja, 94% da janela ocupada em 1366 — conteúdo encostando na borda).
- **Acima de 1544 a margem diminui 40px** e a largura de conteúdo **ganha 80px** (1320 →
  1400), porque o recuo interno deixa de ser descontado por dentro da casca. Em 1920 a
  guia vai de 300 para 260.

#### 3.1.3 Por que o recuo interno é zero

Porque um gutter aplicado como `padding` dentro de uma casca com `max-width` **sempre
morde**: ele não some quando o teto assume, ele passa a ser descontado da largura de
conteúdo. Com casca de 1400 e recuo de 40, o conteúdo fica preso em **1320px em qualquer
janela ≥ 1400** — foi isso que a medição encontrou, inclusive em 2560, onde 1320px são
51,6% da tela.

Um gutter aplicado como `margin` (via `min()` na largura) se comporta como a definição
manda: é piso enquanto há aperto e desaparece quando deixa de haver. Por isso `B = 0`, e
por isso a fórmula antiga — que a matriz de deltas descrevia como substituição do
`px-5 md:px-8 lg:px-10`, isto é, como **padding** — teria produzido em 1920 uma guia de
380px e uma coluna de 1160px: **mais** aparência de bloco preso no centro, não menos.

Quem precisar romper a guia por dentro do container usa `calc(-1 * var(--guia))`, nunca
um número escrito à mão.

#### 3.1.4 Uma definição, um token, três consumidores

A guia é **uma expressão só**, publicada como token, e lida por quem precisa dela. Hoje
ela está escrita à mão em quatro lugares que não concordam entre si:

| onde | expressão hoje | concorda? |
| --- | --- | --- |
| `Container` (`container.tsx`) | `px-5 md:px-8 lg:px-10` + `max-w-container` | é a referência |
| `.scrim::before` (`hero-stage.module.css:1101`) | `max(2.5rem, calc((100% − 1400px)/2 + 2.5rem))` | sim |
| `.mediaCaption` (`hero-stage.module.css:893`) | idem | sim |
| `equipment-strip-section.tsx:213` | `calc((100vw − min(100vw,1400px))/2 + 2.5rem)` | **quase** — usa `100vw`, que inclui a barra de rolagem, e por isso fica ~7px à direita das outras três |
| cabeçalho (`header.tsx:63`) | `px-5 md:px-8 lg:pl-[3.1cqw] lg:pr-[4.2cqw]` | **não** — ver §3.2 |

Depois de R0-A existe **um** `--guia` e as cinco linhas acima passam a lê-lo. Nenhuma
delas recalcula a expressão.

#### 3.1.5 O que a versão anterior desta seção errava

1. **Tabela ≠ fórmula.** `clamp(20px, 20px + (100vw − 320px) × 0.0625, 120px)` é a reta
   que liga 20px em 320 a 120px em 1920 — ela reproduz a tabela **só nos dois extremos**.
   Em 768 dava 48 contra 40 tabelados; em 1024, 64 contra 48; em 1366, 85,4 contra 64; em
   1440, 90 contra 72; em 1600, 100 contra 96. E em 390 dava 24,4, violando o próprio
   piso que a tabela declarava.
2. **Diagnóstico invertido.** A seção afirmava que "em 1920 a margem lateral continua
   sendo os mesmos 40px de 1024". **Falso, e medido:** em 1920 a margem efetiva é 300px.
   Os 40px são o valor do *token de recuo*, não a margem. A aparência de "documento
   centralizado com sobra dos dois lados" em telas largas vem do **teto de 1400px** e da
   ausência de sangria — não do gutter. G-1 não resolve isso e não deve fingir que
   resolve: quem resolve são §3.2 e §3.3 (hoje só **duas** imagens em 14.490px de página
   rompem o container).
3. **Mecanismo trocado.** A prosa dizia que acima de 1640px "a fórmula deixa de morder" —
   verdade para um gutter-margem, falso para o gutter-padding que a matriz de deltas
   mandava implementar. As duas metades da seção descreviam sistemas diferentes.

> **Delta global aberto.** Nada disto está implementado. Por ser sistema **global**, entra
> **antes** de qualquer congelamento de seção — mudar a guia depois reabriria toda seção
> já congelada. Atribuído a **R0-A — sistemas globais** (documento 05), rastreado como
> **G-1** em `06-MATRIZ-DE-DELTAS.md`.

### 3.2 Container — quando usar e quando não usar

| largura | uso |
| --- | --- |
| `prose` 68ch | bloco de leitura corrida sem elemento ao lado. Hoje **não é usado na Home** e deveria ser, em `#credibilidade` |
| `default` 1400px | padrão de toda seção com texto e controle. **É a guia.** |
| `wide` 1520px | mosaico de projetos, faixa de logos, fileiras de fotografia |
| **sem container** | fotografia de sangria, faixa tonal, palco da hero |

**`wide` é um degrau de mídia, nunca uma segunda guia de texto.** As duas cascas
coincidem enquanto o gutter manda (abaixo de 1544 as duas resolvem para a mesma largura)
e se separam acima disso — em 1920, `wide` começa em 200 e `default` em 260. Essa
diferença de 60px é aceitável para uma fileira de fotografia e **inaceitável para um
parágrafo**: texto assenta sempre na guia `default`. Hoje a Home usa `wide` uma vez, no
mosaico de `#projetos`, e o uso está correto.

**Regra que hoje é violada:** *nenhuma fotografia que seja protagonista de uma seção
pode ser limitada pelo container de 1400px.* Hoje só duas imagens da página inteira
rompem o container. Isso é o inverso do que o princípio 1 exige — e é **aqui**, não no
gutter, que se resolve a sensação de bloco preso no centro em telas largas (§3.1.5).

**Sangria não empresta guia.** Um elemento de mídia em `100vw` não autoriza o texto que
o acompanha a começar na aresta da janela. Palco e guia são sistemas separados: a cena
ocupa a largura inteira, a legenda/coluna assenta em `C`. A hero é o caso de referência.

**Relação com a hero.** A hero **não usa o container para a cena** (o palco é de
largura inteira) mas **usa o container para o conteúdo** — coluna de texto, instrução e
portas assentam na mesma guia do cabeçalho. Esse contrato está certo e é a única coisa
que costura a dobra ao resto do site. Não mudar. Confirmado por medição: em todas as oito
larguras o `x` do `h1` é idêntico ao `x` de conteúdo do `Container` (20 / 20 / 32 / 40 /
40 / 60 / 140 / 300).

**Relação com o cabeçalho — norma, e delta aberto.** A norma é que o eixo vertical da
marca até a primeira letra do `h1` seja **um eixo só**, e que qualquer elemento que o
ignore — inclusive uma fotografia sangrada — o faça por decisão, não por descuido.

**O produto não cumpre essa norma, e a versão anterior desta seção afirmava que
cumpria.** O cabeçalho **não usa o `Container`**: usa `px-5 md:px-8 lg:pl-[3.1cqw]
lg:pr-[4.2cqw]`, isto é, uma margem proporcional à largura da própria faixa a partir de
`lg`. Medido:

| viewport | marca (cabeçalho) | `h1` (hero) | desvio |
| ---: | ---: | ---: | ---: |
| 768 | 32 | 32 | 0 |
| 1024 | 31,7 | 40 | −8,3 |
| 1366 | 42,3 | 40 | +2,3 |
| 1440 | 44,6 | 60 | **−15,4** |
| 1600 | 49,6 | 140 | **−90,4** |
| 1920 | 59,5 | 300 | **−240,5** |

Os dois eixos coincidem apenas por volta de 1366, por coincidência aritmética. Em 1920 a
marca está 240px à esquerda do título que ela deveria ancorar. Corrigir isso é parte de
**G-1**, não de R0-C: o que R0-C congelou foi o **rótulo, o destino e o acabamento do CTA
do cabeçalho** — altura da faixa, proporções internas e tipografia da navegação
permanecem intocadas. A guia horizontal é sistema global e pertence a este documento.

### 3.3 Sangria — as quatro situações

| situação | quando | exemplo alvo |
| --- | --- | --- |
| **Contida** | a imagem é evidência secundária, lida ao lado de texto | planta em `#transicao` |
| **Sangria de borda** | a imagem é o protagonista e o texto vive sobre ou ao lado dela | vitrine de `#equipamentos` |
| **Sangria total** | a imagem é o capítulo inteiro; texto entra como legenda ou sobreposição mínima | friso entre capítulos |
| **Invasão de margem** | a imagem rompe **um** lado do container e o texto mantém a guia | `#projetos`, `#sintomas` |

**Regra de frequência:** no máximo **três** sangrias totais na página, e nunca duas
consecutivas. Sangria que se repete deixa de ser gesto e vira gabarito.

### 3.4 Assimetria

Não são números dogmáticos; são **três famílias de tensão**, escolhidas pela função:

- **65/35** — massa dominante com contraponto. A escolha padrão quando há fotografia
  protagonista e texto de apoio. É a proporção que mais falta na Home atual.
- **58/42** — diálogo entre dois elementos de peso comparável, sem empate. Para
  texto × evidência quando a evidência é documento, não fotografia.
- **50/50 — proibido por padrão.** Só é permitido quando os dois lados são
  deliberadamente equivalentes e a equivalência é o argumento (uma comparação, um
  antes/depois). Fora disso, 50/50 é a assinatura de template.
- **Massas assimétricas sem coluna** — o elemento não se alinha a nenhuma fração da
  grade e é posicionado pela composição (uma fotografia que começa em 38% e sangra à
  direita). Reservado a **duas** seções por página, no máximo.

**O erro a evitar:** alternar 60/40 e 40/60 seção após seção. Espelhar a mesma
proporção lê como a mesma seção duas vezes — o olho registra a proporção, não o lado.

### 3.5 Ritmo vertical

Seis níveis, com função fixa. Os valores substituem a escada atual de quatro
(`xs/sm/default/lg`), que não tem nível de capítulo e por isso não consegue marcar
onde a narrativa muda de assunto.

| nível | desktop | mobile | função |
| --- | ---: | ---: | --- |
| **XS** | 16px | 12px | dentro de um item — rótulo → valor |
| **S** | 32px | 24px | entre elementos do mesmo bloco — título → texto |
| **M** | 56px | 40px | entre blocos da mesma seção — cabeçalho → conteúdo |
| **L** | 96px | 64px | respiro interno de seção grande |
| **XL** | 128px | 80px | entre seções do mesmo capítulo |
| **CAPÍTULO** | 180px | 112px | entre capítulos narrativos, ou transição tonal |

**Regra de proximidade, que vale acima da tabela:** o vão abre onde a **função** muda,
não em intervalos regulares. A hero já pratica isso e é por isso que a coluna dela lê
como uma composição e não como uma pilha — 12px da etiqueta ao título (mesmo assunto),
20px do título à intenção (mesma voz), 40px da intenção à ação (de ler para agir).
**Vãos iguais entre elementos de funções diferentes é o defeito**, não a solução.

### 3.6 Silhuetas de seção

Seis famílias. Toda seção da Home pertence a exatamente uma.

| # | família | descrição |
| --- | --- | --- |
| **A** | **Palco** | fotografia de sangria ocupando o campo; conteúdo vive sobre ela |
| **B** | **Editorial assimétrico** | texto em coluna de guia + evidência em massa maior, sem simetria |
| **C** | **Prova tipográfica** | o texto é a imagem; sem fotografia, com escala como recurso |
| **D** | **Friso fotográfico** | faixa horizontal de imagens sem texto dominante; respiração entre capítulos |
| **E** | **Sequência** | etapas, níveis ou capítulos com ordem legível |
| **F** | **Fechamento** | convergência para uma ação |

**A regra de sequência, que hoje é violada:**

> **Nenhuma dupla consecutiva pode repetir a mesma silhueta.** E nenhuma silhueta pode
> aparecer mais de **três vezes** na página inteira.

Hoje a família B aparece **sete vezes** em treze seções. É a causa mecânica da
aparência de template — não a falta de conteúdo, não a qualidade do texto.

---

## 4. Constituição — COMPOSIÇÃO

### 4.1 O protagonista

Toda seção tem **um**. Ele é definido no blueprint (documento 03), não escolhido na
implementação.

**Como verificar que existe protagonista** — o teste é objetivo e deve ser feito em
captura, não de memória:

1. **Teste da miniatura.** Reduza a captura da seção para 200px de largura. Se você não
   consegue dizer o que é a seção, não há protagonista.
2. **Teste da massa.** O protagonista ocupa **pelo menos 2×** a área visual do segundo
   colocado. Se dois elementos têm massa comparável, escolha um e reduza o outro.
3. **Teste do silêncio.** Se você apagar o protagonista, a seção perde o sentido. Se
   perder só "um pedaço", ele não era o protagonista.

### 4.2 Os três papéis

| papel | quantidade | tratamento |
| --- | --- | --- |
| **Protagonista** | 1 | escala máxima da seção, contraste máximo, posição de entrada da leitura |
| **Secundário** | 1–2 | sustenta o protagonista: legenda, ação, número, contraponto |
| **Terciário** | 0–3 | metadado, etiqueta, cota, régua. **Nunca** ganha caixa própria |

Um item terciário com moldura é o mecanismo exato que transforma uma composição em
formulário. Vale para a etiqueta de categoria, para a cota da planta e para a legenda
de fotografia.

### 4.3 Espaço negativo

O espaço vazio é **material de composição**, não sobra. Mas há uma distinção que a
Home atual perde:

- **Vazio ativo** — enquadra o protagonista, dá escala, cria tensão. Legítimo.
- **Vazio morto** — sobra de centragem, grafite liso entre dois elementos que não se
  relacionam. Ilegítimo.

A hero já resolveu isso uma vez: o vão abaixo dos CTAs foi deslocado para que ele
mostrasse **cena** (piso, fuga do corredor) em vez de grafite. O princípio é geral —
*se um vão não mostra nada, ele não é respiro, é erro de montagem.*

### 4.4 Leitura diagonal e alinhamento

- **A guia do container é sagrada.** Todo texto começa nela, em todas as seções.
  Exceção única: texto sobre fotografia de sangria, que pode assentar em guia própria
  desde que a guia seja constante na seção inteira.
- **Nenhum texto centralizado**, exceto o par etiqueta+título de uma seção de
  fechamento. Texto centralizado em bloco comercial é a assinatura de apresentação de
  slides.
- **A leitura desce em diagonal**, não em coluna: o olho entra pelo protagonista, cai
  para o texto, sai pela ação. Se os três estão empilhados na mesma vertical, a seção
  lê como lista.

### 4.5 Densidade

Tetos por seção, medidos como o inventário mede:

| métrica | teto | hoje, no pior caso |
| --- | ---: | --- |
| caracteres visíveis | **1.200** | 2.443 (`#equipamentos`) |
| blocos de texto | **12** | 26 (`#equipamentos`) |
| cards | **4** | 6 (`#projetos`) |
| hairlines | **6** | 12 (`#diagnostico`) |
| regiões amarelas | **3** | 14 (`#quem-conduz`) |
| altura em 1440 | **1.100px** | 1.593px (`#projetos`) |

Estourar um teto não é proibido — é **um item de blueprint que precisa de
justificativa escrita**. Estourar três ao mesmo tempo é o diagnóstico de que a seção
está fazendo o trabalho de duas.

---

## 5. Constituição — TIPOGRAFIA

Duas famílias. **Não trocar.** Manrope é a família contra a qual toda a geometria da
primeira dobra foi medida (razão cap/em 0,740); Oswald é o traço mais reconhecível da
marca no site oficial publicado. Trocar qualquer uma reabre medições que já custaram
várias rodadas.

### 5.1 Hierarquia completa

| papel | família | peso | desktop | mobile | line-height | tracking | caixa | cor |
| --- | --- | ---: | --- | --- | ---: | ---: | --- | --- |
| **Display** (hero h1) | sans | 700 | 58px (teto) | 28–38px | 1,05 | −0,025em | frase | `canvas` sobre escuro |
| **H1 de rota** | sans | 700 | 44px | 30px | 1,10 | −0,018em | frase | `ink` / `canvas` |
| **H2 de seção** | sans | 700 | 30–44px | 26–30px | 1,10 | −0,018em | frase | `ink` / `canvas` |
| **H3 de bloco** | sans | 700 | 21–30px | 20–24px | 1,18 | −0,014em | frase | `ink` / `canvas` |
| **H4 / item** | sans | 600 | 17–21px | 17px | 1,30 | −0,010em | frase | `ink` / `canvas` |
| **Destaque editorial** | sans | 500 | 21–24px | 18px | 1,45 | 0 | frase | `ink` / `canvas/90` |
| **Métrica (numeral)** | **condensada** | 700 | 32–44px | 28px | 1,00 | −0,010em | — | `ink` / `yellow` sobre escuro |
| **Body large / lead** | sans | 400 | 17–18px | 16px | 1,65 | 0 | frase | `muted` / `canvas/85` |
| **Body** | sans | 400 | 16px | 15px | 1,65 | 0 | frase | `muted` / `canvas/80` |
| **Body small** | sans | 400 | 15px | 14px | 1,60 | 0 | frase | `muted` / `canvas/75` |
| **Label** | **condensada** | 600 | 13px | 12px | 1,20 | 0,11em | ALTA | `ink` / `canvas` |
| **Eyebrow** | **condensada** | 600 | 13px | 12px | 1,20 | 0,11em | ALTA | `ink` / `canvas/80` |
| **CTA** | **condensada** | 600 | 16–17px | 15px | 1,00 | 0,05em | ALTA | `ink` sobre amarelo |
| **Legenda de imagem** | sans | 400 | 13px | 12px | 1,50 | 0,005em | frase | `muted` / `canvas/70` |
| **Metadata / cota** | **condensada** | 600 | 10–11px | 10px | 1,20 | 0,14em | ALTA | `canvas/70` / `steel` |

### 5.2 Quando usar Oswald

**Sim:** rótulo de botão · etiqueta de seção · numeral de métrica · índice de item ·
cota de desenho técnico · nome de porta no seletor · legenda técnica de material.

**Não:** título de qualquer nível · parágrafo · lead · frase de instrução · pergunta ·
descrição de item · citação · qualquer texto com mais de 4 palavras que forme uma
oração.

**O teste:** se o texto é uma **frase**, é Manrope. Se é um **rótulo**, é Oswald. A
instrução do seletor da hero foi corrigida por esse teste em 2026-08-11 — era Oswald
caixa-alta com 0,12em de tracking numa frase de 42 caracteres, e obrigava o olho a
soletrar. Não regredir.

### 5.3 Caixa alta

**Sim:** os mesmos casos de Oswald acima, e só eles. Caixa alta é propriedade do
rótulo, não recurso de ênfase.

**Não:** título, frase, nome próprio isolado, palavra dentro de parágrafo. Caixa alta
em título é a assinatura visual de indústria dos anos 1990 e é justamente o que a marca
não quer parecer.

### 5.4 Opacidade

**Máximo de três níveis por superfície**, e a opacidade **nunca** é o único
diferenciador de hierarquia — sempre acompanha peso, corpo ou família.

| superfície | níveis permitidos |
| --- | --- |
| escura | `canvas` (100%) · `canvas/85` · `canvas/70` |
| clara | `ink` (100%) · `muted` · — |

Sobre superfície clara há **dois** níveis, não três: `steel` é decorativo e não pode
carregar texto. Uma quarta opacidade sobre escuro (`canvas/55`, `canvas/60`) existe
hoje em três seções e é o mecanismo que faz item inativo parecer desativado — ver a
regra de lista inerte no princípio 7.

**Armadilha registrada:** a escala de opacidade do projeto é de 5 em 5. `text-canvas/78`
não é gerada e o elemento herda tinta escura, sumindo sem erro de build.

---

## 6. Constituição — COR

### 6.1 A paleta, com função declarada

| token | hex | função | proibição |
| --- | --- | --- | --- |
| `graphite` | `#101010` | superfície escura principal, cabeçalho, rodapé | — |
| `graphite-deep` | `#0A0B0C` | fechamento, fundo de controle rebaixado | não usar como fundo de seção |
| `graphite-soft` | `#1A1A1A` | superfície escura secundária, painel dentro de escuro | — |
| `graphite-line` | `#2C2C2C` | divisor sobre escuro | nunca como fundo |
| `canvas` | `#EFEDEB` | superfície clara principal; texto sobre escuro | — |
| `canvas-deep` | `#E6E3DE` | superfície clara secundária, contraste de capítulo | — |
| `surface` | `#FFFFFF` | **só** cartão de conteúdo sobre `canvas` e faixa de logos | nunca como fundo de seção |
| `ink` | `#101010` | texto principal sobre claro | — |
| `muted` | `#5B6065` | texto auxiliar sobre claro (5,6:1) | — |
| `line` | `#DCD9D4` | divisor sobre claro | — |
| `steel` | `#8C9095` | borda, ícone, traço decorativo (2,9:1) | **nunca texto** |
| `yellow` | `#F5C64B` | acento de marca, ação e estado | ver 6.2 |
| `yellow-bright` | `#FFE379` | hover do CTA amarelo, acento sobre escuro | não usar como fundo de área |
| `yellow-deep` | `#D9A61B` | hairline sobre claro, estado pressionado | não usar como texto |
| `#2A6F44` | — | glifo de WhatsApp sobre fundo **claro**, onde `#25D366` não contrasta | **nunca como massa de botão** (ver §6.4) |
| `#25D366` | — | glifo de WhatsApp sobre fundo escuro; disco do botão flutuante | não usar como massa grande |

### 6.2 Orçamento de cor — a regra central do sistema

O amarelo tem **três funções, em ordem de precedência**:

```text
MARCA  >  AÇÃO  >  ESTADO
```

**Teto: três regiões amarelas relevantes por viewport.** "Relevante" = com mais de
~400px² de área ou portadora de significado. Hairline decorativa não conta.

Quando o teto estoura, **quem cede é a função de menor precedência**. Foi exatamente
assim que a etiqueta da hero perdeu o amarelo no texto e manteve só o traço: a dobra
tinha seis regiões amarelas (marca, CTA do cabeçalho, traço da etiqueta, texto da
etiqueta, CTA da dobra, seta da porta ativa), e a etiqueta não é marca, nem ação, nem
estado — é rótulo. Cedeu.

**Hoje `#quem-conduz` tem 14 regiões amarelas.** É a violação mais grave do sistema na
página inteira e não é um problema de acabamento: com 14 acentos, nenhum acento existe.

### 6.3 Amarelo: preenchimento, linha ou texto

| fundo | preenchimento | hairline | texto | indicador de estado |
| --- | --- | --- | --- | --- |
| **escuro** | sim (com moderação) | sim | **sim** (11,8:1) | **sim** |
| **claro** | **sim** — é o único jeito legítimo | sim | **NUNCA** (1,4:1) | **NUNCA** — usar `ink` |

Nenhum matiz resolve o amarelo como texto sobre claro: escurecer até 4,5:1 produz um
bronze que deixa de ler como o amarelo da marca. Essa é a armadilha central do sistema
e já causou regressão duas vezes.

**Anel de foco segue a mesma lógica:** grafite em fundo claro, amarelo em fundo escuro.

### 6.4 Verde

O verde é **canal**, não cor de sistema. Ele aparece **uma vez por viewport, no
máximo**, e apenas em CTA de WhatsApp.

**O verde nunca é massa preenchida ao lado do CTA primário.** Duas massas cheias lado a
lado, com a mesma altura e a mesma construção, leem como **dois botões-irmãos** — e
nenhuma diferença de luminância corrige uma equivalência de forma. A subordinação tem de
ser de **construção**, não de tom:

| onde | tratamento |
| --- | --- |
| **CTA de WhatsApp** (dobra, fechamento) | superfície **grafite** ou contorno, rótulo claro, **glifo verde** |
| **botão flutuante** | disco `#25D366`, escala pequena, sem competição |

O verde fica no **glifo**, que é o que torna o canal reconhecível. A caixa é neutra.

`#2A6F44` — o verde dessaturado que existiu como massa cheia na dobra — deixa de ser
token de superfície. Ele pode permanecer como cor de glifo sobre fundo claro, onde
`#25D366` não alcança contraste.

### 6.5 Branco puro

`#FFFFFF` **não é superfície de seção.** Ele existe para cartão sobre `canvas` e para a
faixa de logos, onde o branco é exigência dos próprios arquivos de marca. Uma seção
inteira em branco puro quebra a temperatura quente do off-white que é a identidade
publicada da marca.

---

## 7. Constituição — FORMAS

### 7.1 A resposta, em uma linha

**A Bianchini é retângulo reto, aresta viva e régua.** Sem raio, sem chanfro, sem
sombra projetada, sem contorno fechado.

O raio de 2px que existe nos botões é o **único** raio do sistema e existe para evitar
o aliasing de canto absoluto em massa preenchida — não é decisão estética e não deve
crescer.

### 7.2 Geometria por elemento

| elemento | geometria |
| --- | --- |
| **Botão** | retângulo, raio 2px, cela de ícone separada por fio de tinta |
| **Superfície** | retângulo pleno, aresta viva, sem borda; separação por mudança tonal |
| **Controle** | retângulo aberto embaixo e nas laterais, com **régua de 2–3px no topo** |
| **Imagem** | retângulo, **sem raio, nunca**. Proporção declarada por `aspect-*` |
| **Divisor** | hairline de 1px (`line` / `graphite-line`) ou régua de 2px (amarela, decorativa) |
| **Etiqueta** | traço de 2px × 28px + texto. Sem caixa, sem fundo, sem borda |

### 7.3 Card — quando é legítimo

Um card é legítimo em **exatamente uma** condição:

> O item é uma **unidade autônoma de conteúdo navegável** — tem destino próprio, e o
> visitante escolhe entre ele e os irmãos.

Legítimo: cartão de projeto no mosaico, categoria de equipamento com página própria.

**Ilegítimo:** item de lista · etapa de método · frente de diagnóstico · benefício ·
número · depoimento · pessoa · qualquer conteúdo que o visitante lê em sequência em vez
de escolher.

**E mesmo quando legítimo, o card não tem borda.** O que o separa do vizinho é o vão e a
fotografia. Borda em card é o que produz a leitura de grade de produto — e "catálogo" é
a primeira coisa da lista de que a marca não pode parecer.

### 7.4 O que faz algo parecer cada coisa errada

Registrado para que o diagnóstico não precise ser reinventado:

| aparência | o que a produz |
| --- | --- |
| **SaaS** | cartões iguais com ícone no topo · raio de 8–12px · sombra difusa · gradiente sutil em superfície · pílula de tag |
| **Dashboard** | fio divisório entre células de igual peso · rótulo de cabeça sobre fileira de dados · numeral com variação percentual · grafo, medidor ou barra de progresso |
| **PDF** | lista de itens com maioria inerte · densidade de texto sem imagem · numeração de tópico · tabela com moldura completa |
| **Indústria antiga** | caixa alta em título · chanfro a 45° · textura metálica · gradiente cromado · glifo de engrenagem |
| **Template** | mesma silhueta repetida · `fade-up` idêntico do topo ao rodapé · 50/50 alternado · CTA no fim de toda seção |

---

## 8. Constituição — BOTÕES

Seis papéis. **Nenhuma seção inventa botão próprio.**

Base comum a todos: retângulo, raio 2px, rótulo em **condensada caixa-alta** com
tracking 0,05em, quatro estados obrigatórios, preenchimento de hover por
`transform: scaleY` sobre um `::before` (nunca `width`, nunca troca de
`background-color`), e `focus-visible` disparando **o mesmo** preenchimento do hover.

| # | papel | superfície | tinta | altura desktop | altura mobile | ícone |
| --- | --- | --- | --- | ---: | ---: | --- |
| 1 | **PRIMARY** | `yellow` cheio | `ink` | 58px | 48px | seta em cela separada por fio `ink/20` |
| 2 | **SECONDARY** | transparente + borda 1px `ink` (ou `canvas` sobre escuro) | `ink` / `canvas` | 58px | 48px | seta inline |
| 3 | **WHATSAPP** | **grafite ou contorno — nunca massa verde cheia** | `canvas` / `ink` | 58px | 48px | **glifo verde** em cela separada por fio |
| 4 | **TEXT LINK** | nenhuma | `ink` / `canvas` + sublinhado `yellow` no hover | — | — | seta que avança 4px no hover |
| 5 | **NAV CTA** | `yellow` cheio | `ink` | 46% da altura do cabeçalho | 44px (menu) | sem ícone |
| 6 | **HERO DOOR** | ver §9 | — | 88–104px | 60px | seta na aresta direita |

**Estados, iguais para 1, 2, 3 e 5:**

| estado | comportamento |
| --- | --- |
| padrão | superfície base |
| **hover** | `::before` sobe por `scaleY` de 0 a 1, origem na base, 220ms `precise`. Primary → `yellow-bright`; Secondary e WhatsApp → tinta do próprio contorno a 6–14% |
| **focus-visible** | **o mesmo preenchimento do hover** + anel de 2px (grafite sobre claro, `canvas` sobre escuro) com offset de 2px |
| **active** | `scale(0.985)` em 120ms `precise`. Cancelado por `motion-reduce` |
| disabled | **não existe no sistema.** Nenhum CTA da Home tem estado desabilitado |

**Regra de par — subordinação, não simetria.** Quando PRIMARY e WHATSAPP aparecem lado a
lado, eles compartilham **altura, raio e escala de rótulo** — é isso que os faz pertencer
ao mesmo sistema. Eles **não** compartilham construção de superfície:

```text
PRIMARY    massa amarela cheia      ← a única massa preenchida do par
WHATSAPP   grafite/contorno + glifo verde
```

A hierarquia é lida antes da cor: **uma massa e um contorno**. A razão de largura fica em
**≥1,30** a favor do primário, e o WhatsApp nunca ganha largura por recuo generoso.

Isto corrige uma equivalência que existiu no produto: dois botões cheios, mesma altura,
mesma cela de ícone, diferindo só em matiz. A luminância sustentava a hierarquia
sozinha — e forma vence tom.

**Regra de largura estável.** Um botão cujo rótulo muda com o estado (o CTA da hero)
mede sempre o **rótulo mais longo** — os rótulos ficam empilhados na mesma célula de
grade, com o ativo em `opacity: 1`. Sem isso, o botão vizinho desliza a cada troca.

---

## 9. Constituição — HERO DOORS

O sistema mais reaberto do projeto. Aqui ele fecha.

### 9.1 Topologia — fixada

**Três objetos separados por vão real.** Não uma chapa subdividida, não células de
grade, não rótulos soltos sobre a fotografia.

```text
┌─ instrução (linha própria, traço amarelo na guia) ────────────────┐
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ ▔▔▔▔▔▔▔▔▔▔▔▔ │  │              │  │              │  ← régua    │
│  │ EQUIPAMENTOS↗│  │ PROJETOS   ↗ │  │ CONSULTORIA↗ │            │
│  │ situação     │  │ situação     │  │ situação     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│       ativa            inativa           inativa                   │
└────────────────────────────────────────────────────────────────────┘
```

O vão entre portas é **maior que o recuo interno** de cada porta. Essa é a relação que
faz três objetos lerem como três escolhas em vez de uma faixa subdividida — 24px de vão
contra 20px de recuo em 1440. Inverter essa relação reabre a leitura de painel.

### 9.2 Proporção entre as três

**Referência: 1,2fr / 1fr / 1fr.** Equipamentos lidera por posição e área, nunca por cor
ou por tratamento de imagem.

**Este número é meio, não fim.** O que a norma exige é **hierarquia comercial
perceptível** entre a primeira porta e as outras duas. A implementação pode ajustar
dentro de uma faixa curta — **1,15fr a 1,3fr** — se a medição real exigir (quebra de
rótulo, largura útil do `cue`, comportamento em 1024). Fora dessa faixa deixa de ser
ajuste e vira decisão de hierarquia, que precisa de aprovação.

**O que a proporção não pode fazer:** rebaixar Projetos e Consultoria a opções
*semanticamente* menores. As três são portas legítimas (DEC-002), com CTA e jornada
próprios. Equipamentos é a **primeira**, não a única — e a diferença de área é um sinal
de prioridade, não de categoria.

Equipamentos lidera por **seis** mecanismos, e nenhum deles é estético:
1. é o estado inicial e o único que o servidor entrega;
2. o `h1` da página é a copy dele;
3. é a primeira porta e a primeira parada de teclado;
4. tem 1,2fr contra 1fr;
5. o CTA do fechamento da página também é dele;
6. permanece selecionado até o visitante escolher — sem rotação, sem autoplay.

**Nenhuma cena é maior, mais clara, mais saturada ou menos coberta que as outras.**

### 9.3 Geometria

| | 320–389 | 390–767 | 768–1023 | 1024–1439 | 1440–1919 | ≥1920 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| altura da porta | 60px | 60px | 72px | 88px | 96px | 104px |
| vão | 8px | 8px | 16px | 24px | 24px | 28px |
| corpo do nome | 13px | 16px | 16px | 19px | 19px | 21px |
| situação (`cue`) | oculta | 13px | 13px | 15px | 15px | 15px |
| seta | oculta | visível | visível | visível | visível | visível |
| corpo da instrução | 14px | 16px | 16px | 19px | 19px | 19px |

### 9.4 Estado ativo — reconhecido em menos de 1 segundo

**Cinco sinais, e pelo menos um não-cromático.** O teste de aceitação é literal:
converta a captura para escala de cinza; se o estado ativo ainda for identificável em
menos de 1 segundo, passa.

| # | sinal | inativo → ativo | cromático? |
| --- | --- | --- | --- |
| 1 | **régua superior** | 2px `canvas` a 20% → **3px amarelo cheio** | sim |
| 2 | **superfície** | grafite **neutro** profundo → grafite **neutro** perceptivelmente mais claro | sim |
| 3 | **elevação** | 0 → **sobe 6px** e fica | **não** |
| 4 | **peso do nome** | `semibold` em `canvas/85` → **`bold` em `canvas` cheio** | **não** |
| 5 | **seta** | `canvas/60` → amarela, 2px à frente | sim |

O delta de luminância entre inativo e ativo fica em **~48 pontos**, e ele é obtido no
**eixo neutro**: a porta fechada é mais escura, a aberta é mais clara, e nenhuma das duas
muda de matiz.

#### A superfície da porta ativa não é tingida de amarelo

Esta é a correção de 2026-08-12, e ela reverte um mecanismo anterior.

**Proibido:** derramar o acento sobre a superfície da porta ativa — em qualquer
opacidade — e deslocar a base para grafite "quente". A soma de amarelo translúcido com
grafite quente produz **cáqui, oliva, dourado ou aparência suja**, que é o oposto do
material que a marca representa. Não existe percentual seguro: o defeito é a mistura, não
a dose.

**Regra:** o amarelo entra como **gesto de estado** — régua, seta, detalhe controlado —
sempre **sobre** a superfície, nunca **dentro** dela.

```text
INATIVO   grafite neutro profundo      (sem matiz, sem tingimento)
ATIVO     grafite neutro mais claro    (sem matiz, sem tingimento)
AMARELO   régua de 3px + seta          (gesto, não preenchimento)
```

**Amarelo cheio como preenchimento da porta ativa foi testado e reprovado**, e continua
proibido — três massas amarelas na mesma vertical (marca, CTA da dobra, porta) desmontam
a hierarquia marca > ação > estado. O tingimento parcial é a mesma falha em dose menor.

#### Nenhum bisel

Proibido qualquer realce superior claro que simule volume — `inset` branco no topo com
`inset` escuro na base é a construção de **bevel**, e bisel é vocabulário de painel
industrial antigo (documento §7.4). A porta é um retângulo plano com **uma régua no
topo**. O que dá aresta ao objeto é a régua, não uma borda iluminada.

#### O ativo continua tendo de passar

Depois da correção, os cinco sinais ainda precisam sobreviver a: **escala de cinza**
(sinais 3 e 4 respondem), **percepção em menos de 1 segundo**, contraste do nome sobre a
nova superfície, foco por teclado e alvo de toque.

### 9.5 Inativo parece disponível, não desativado

O teste é o de `cursor: default` — sem cursor e sem hover, dá para saber que aquilo se
clica? Quatro respostas, nenhuma delas cor:

- régua de 2px no topo (aresta de objeto → é coisa, não texto);
- superfície própria separada por vão (três planos, não uma faixa);
- seta na aresta direita de cada porta;
- a instrução acima, que manda escolher.

Nome inativo em `canvas/85` — legível, nunca fantasma.

### 9.6 Interação

**Hover anima o próprio controle; clique, toque e teclado trocam a cena.** A prévia por
ponteiro foi removida em 2026-08-11 e **não deve voltar**: atravessar a fileira trocava
a cena inteira no caminho, e um controle que muda de assunto ao ser sobrevoado lê como
gráfico animado.

Hover/foco: superfície clareia, régua acende de 20% para 42%, porta sobe 3px — tudo em
≤200ms, por `transform` (a fileira não reflui).

Contrato de acessibilidade, **congelado**: `role="tablist"` / `tab` / `tabpanel`,
`aria-selected`, `aria-controls`, `aria-describedby` na instrução, `tabindex` rotativo,
navegação por seta com `Home`/`End` e volta ao início. O anel de foco é desenhado em
camada própria acima da superfície (`::after`) — `ring` do Tailwind é `box-shadow` e
ficaria por baixo do `::before` da porta.

### 9.7 Mobile

As portas **não desaparecem** — são a arquitetura comercial da página. O que cede:
a situação (`cue`) some abaixo de 640px e a seta abaixo de 420px. A instrução
permanece em todas as larguras e é ela que cobre a ausência do `cue`.

---

## 10. Constituição — FOTOGRAFIA

### 10.1 Direção fotográfica

| dimensão | direção |
| --- | --- |
| **Luz** | direcional, de fonte identificável. Nunca luz de flash frontal, nunca HDR chapado |
| **Contraste** | alto nas sombras, controlado nas altas. O inox não pode estourar |
| **Temperatura** | neutra a levemente quente (4800–5600K). O inox frio-azulado lê como render |
| **Profundidade** | plano de fundo presente e legível. Fotografia de equipamento isolado sobre fundo liso é catálogo |
| **Textura** | escovado do inox, gordura de uso, marca de trabalho. **Operação real, não showroom** |
| **Inox** | superfície reflexiva com direção — o reflexo mostra o espaço. Nunca espelhado sem contexto |
| **Pessoas** | trabalhando, de perfil ou de três quartos, sem olhar para a câmera. Sem sorriso posado |
| **Operação** | equipe em movimento, fluxo legível, profundidade de corredor |
| **Projeto** | documento real fotografado em contexto (mesa, escalímetro, prancha), não arquivo digital em tela cheia |
| **Produto** | dentro da operação. Um equipamento recortado sobre fundo branco é a única imagem proibida por definição |
| **Consultoria** | ver §11 |

### 10.2 Classificação de acervo

| grau | critério | uso permitido |
| --- | --- | --- |
| **A — HERO** | ≥1600px no lado maior, nativa (sem reamostragem), sujeito à direita e campo escuro à esquerda, foco no plano principal, sem inscrição legível | palco da hero, sangria total |
| **B — SECTION** | ≥1200px, nítida, perspectiva corrigida, contexto legível | protagonista de seção, invasão de margem |
| **C — SUPPORT** | ≥800px, nítida no assunto | evidência contida, miniatura, friso |
| **D — REJECT** | qualquer um dos itens abaixo | **nenhum** |

**Critérios de rejeição (D), qualquer um basta:**
- reamostragem visível (arquivo maior que o detalhe real — o caso do antigo
  `projeto-3d-hero.jpg`: 2033×1027 de arquivo para 782×395 de detalhe);
- texto ou inscrição legível não intencional (inclusive espelhada);
- perspectiva convergente não corrigida em linha de bancada;
- estouro de alta luz no inox sem informação recuperável;
- pessoa identificável sem autorização;
- render apresentado sem declaração de tipo.

### 10.3 A regra que não pode ser contornada

> **Asset ruim não se salva com CSS.**

Um arquivo de baixo detalhe não vira nítido com `contrast()`; um enquadramento errado
não vira certo com `object-position`; um render não vira fotografia com tratamento
tonal. Quando um asset é grau D, a saída é **recompor a seção para não precisar dele**
ou **registrar a necessidade de novo acervo** — nunca ampliá-lo e aceitar a perda.

Essa regra já foi aplicada corretamente uma vez: a cena de Projetos passou de prancha
contida (que existia só para não ampliar um arquivo ruim) para palco de sangria, depois
que o arquivo foi substituído por um nativo.

### 10.4 Declaração de tipo — obrigatória

Render, estudo 3D, planta e documento **sempre** carregam legenda declarando o que são
(DEC-008). Fotografia de operação real não precisa de legenda de tipo, mas **nunca**
recebe legenda que atribua cliente, local ou prazo (DEC-006).

---

## 11. Constituição — CONSULTORIA

Consultoria é o pilar sem objeto fotográfico óbvio, e é por isso que ele atraiu, e deve
continuar repelindo, todo tipo de solução gráfica.

### 11.1 Proibido, e o motivo

Dashboard · gráfico · fluxograma · circuito · HUD · ícone corporativo · vetor genérico ·
elemento tecnológico flutuante · grafo de nós · medidor.

Uma camada vetorial exatamente assim foi construída e removida em 2026-08-11: um grafo
SVG com entradas, convergência, zona de análise, priorização e nó de decisão amarelo,
com pulso e halo em laço. Ela foi removida por **três** razões que continuam válidas:
era literalmente um fluxograma; flutuava sem relação com a figura nem com a coluna de
texto; e os dois laços eram a única animação permanente da dobra, contra a regra de
"nada em laço".

**O vazio não se resolve com desenho. Resolve-se com luz.**

### 11.2 O que Consultoria precisa comunicar

Observação · leitura · diagnóstico · raciocínio · decisão · operação.

Todos esses são **atos humanos dentro de um espaço real**. A representação certa é
sempre uma pessoa em relação a uma operação — nunca um símbolo do pensamento.

### 11.3 A fotografia ideal

> Uma pessoa **dentro da cozinha em operação**, em atitude de leitura: prancheta ou
> tablet baixo, olhar dirigido a um ponto do fluxo (não à câmera), equipe trabalhando ao
> fundo com profundidade legível, luz direcional da própria operação.

Alternativa igualmente válida: **duas** pessoas em conversa técnica sobre uma bancada
com planta impressa, dentro da operação — não em sala de reunião.

### 11.4 A solução temporária, enquanto essa fotografia não existe

O acervo hoje tem um **retrato de estúdio** de Leonardo Bianchini. Ele é o recurso
correto disponível, e a solução vigente está certa em princípio: a figura ganha escala
(78–86% da altura do palco) e o fundo sintetizado ganha plano de piso e queda de luz
lateral, de modo que o campo restante leia como **espaço**, não como retângulo à espera
de enfeite.

**Regra enquanto durar:** o retrato de estúdio pode sustentar a **hero**, porque ali ele
é a pessoa que responde pelo diagnóstico e o contexto vem do texto. Ele **não pode**
sustentar a seção de Consultoria no corpo da página — ali é preciso operação. Enquanto
não houver a fotografia da §11.3, a seção de Consultoria usa **documento de diagnóstico
real** (checklist, planta anotada, ficha de visita) como evidência, e não pessoa.

Isso está registrado como pendência de acervo no documento 05.

---

## 12. Constituição — PROJETOS

### 12.1 Projeto não é planta

A planta é **um** entregável. O que a seção precisa comunicar é a cadeia inteira:

```text
PLANEJAMENTO  →  EXECUÇÃO  →  TRANSFORMAÇÃO  →  ENTREGA
   planta          obra          antes/depois     cozinha operando
```

**O protagonista é sempre a cozinha entregue** — é ela a prova. A planta e o render
entram como **evidência de método**, em escala menor, e sempre declarados.

### 12.2 Hierarquia de material

| material | papel | escala | legenda |
| --- | --- | --- | --- |
| **Cozinha entregue** (foto real) | protagonista | máxima, sangria | descreve o que está na imagem |
| **Obra em andamento** (foto real) | prova de execução | média | descreve a etapa |
| **Planta executiva** (documento) | prova de método | contida, ≤35% | "Documento de projeto" |
| **Estudo 3D** (render) | prova de método | contida, ≤35% | "Estudo 3D — não é obra executada" |

### 12.3 Restrição de conteúdo que molda a composição

Nenhuma legenda pode atribuir **cliente, local ou prazo**. Isso remove o recurso que
todo escritório de arquitetura usa — a ficha de projeto — e força a composição a
carregar o argumento sozinha.

**A saída é a escala e a matéria, não o texto.** Uma fotografia de cozinha entregue em
sangria total, com legenda de uma linha descrevendo o que está na imagem, prova mais que
seis cartões com moldura e ficha vazia.

---

## 13. Constituição — MOTION

Três curvas, e só três. Não adicionar biblioteca de animação.

| curva | cubic-bezier | função |
| --- | --- | --- |
| `precise` | `0.4, 0, 0.2, 1` | resposta, hover, foco, pressão |
| `smooth` | `0.22, 1, 0.36, 1` | entrada de conteúdo, troca de estado |
| `premium` | `0.16, 1, 0.3, 1` | revelação editorial, composição do hero |

### 13.1 Faixas por categoria

| categoria | objetivo | duração | curva | distância | opacity | scale | delay / stagger |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
| **MICRO** (hover, foco, pressão) | confirmar alvo | 120–220ms | `precise` | ≤4px | — | ≤1,5% | 0 |
| **UI** (troca de rótulo, abrir/fechar) | trocar conteúdo local | 180–280ms | `smooth` | ≤8px | 0→1 | — | 0 |
| **REVEAL** (entrada de seção) | apresentar bloco | 350–600ms | `premium` | 16–24px | 0→1 | — | 60–90ms entre irmãos, **máx. 4 passos** |
| **SCENE** (troca de estado da hero) | trocar a cena inteira | 500–900ms | `smooth` | — | — | 1,016→1 | coreografia própria (§13.2) |
| **PAGE ENTRY** (hero, uma vez) | compor a dobra | até 1.100ms | `premium` | 10–16px | 0→1 | — | 0/60/120/180ms |

### 13.2 A coreografia de troca da hero — congelada

```text
t=0        o controle responde (único elemento imediato)
0–210ms    a copy sai, 6px para cima
0–520ms    a revelação atravessa o palco (20% em 150ms · 50% em 260 · 85% em 400)
0–720ms    a cena nova assenta de 1,016 para 1
250–490ms  a copy nova entra, 8px de baixo para cima
```

**A troca é espacial, não cromática.** A cena nova é revelada por uma máscara que corre
da esquerda para a direita; a antiga continua inteira por baixo até ser coberta. Cada
pixel mostra exatamente uma cena o tempo todo.

Esse desenho substitui duas tentativas que falharam e **não deve ser reaberto**:
crossfade simétrico (produzia dupla exposição — planta atravessando um rosto por ~6
quadros) e tempos separados (produzia apagão — entre 150 e 200ms as duas cenas estavam
perto de zero e a dobra piscava para quase preto).

### 13.3 As quatro variantes de revelação

Existir mais de uma é o ponto — um `fade-up` idêntico do topo ao rodapé é o que faz a
página parecer template.

| variante | movimento | para quê |
| --- | --- | --- |
| `up` | sobe 16–24px | texto |
| `side` | entra lateralmente | coluna, painel |
| `settle` | assenta com leve escala | documento, fotografia |
| `line` | cresce a partir de uma ponta | régua, divisor |

**Escolha pelo que o elemento é**, e mantenha a mesma variante dentro de uma mesma
lista.

### 13.4 Quando motion não deve existir

- em qualquer coisa que **repita**: nada em laço, nada pulsando, nada respirando;
- **marquee — faixa que desliza sozinha, em laço, sem ação do usuário.** Proibido, e a
  proibição vale mesmo com pausa no hover e mesmo com `motion-reduce` desligando: a pausa
  condicional não transforma um laço permanente em motion com função. Ver §13.4.1;
- palavra a palavra;
- parallax de qualquer tipo;
- cursor customizado;
- em elemento que já está visível quando a página carrega (a hero é a exceção, e a
  sequência dela roda **uma vez**);
- em troca disparada por passagem de ponteiro.

### 13.4.1 Faixa horizontal de logotipos — a norma

Este é o único lugar da página que pedia movimento contínuo, e ele deixa de ter.

**Proibido:** marquee infinito automático; lista duplicada para dar a ilusão de laço;
`animation-play-state` como mecanismo de controle.

**Permitido, nesta ordem de preferência:**

1. **composição horizontal estática** — os logotipos autorizados cabem na largura, sem
   movimento nenhum. É a solução preferida;
2. **overflow controlado com rolagem do usuário** — no telefone, a faixa rola por dedo;
3. **entrada única por motion** — a faixa entra uma vez, com `up` ou `line`, e para;
4. **deslocamento acionado por interação** — seta ou arraste, sempre iniciado pelo
   visitante.

**Nenhum movimento permanente sem ação.**

**Consequência técnica que precisa acompanhar a mudança:** o `loading="eager"` dos
logotipos existia porque a faixa deslizava por `transform` e o lazy loading nativo não
carrega o que está fora da viewport **horizontal**. Sem marquee, a justificativa muda —
mas não desaparece: em qualquer composição com overflow horizontal o problema persiste.
A regra passa a ser **`eager` apenas nos logotipos que nascem dentro da viewport**, e
`lazy` nos demais quando a faixa for estática e não houver deslocamento por `transform`.

### 13.5 Transform vs. opacity vs. máscara

- **`transform`** para tudo que se move. Nunca `width`, `height`, `top` ou `left`.
- **`opacity`** só para entrada e para troca de rótulo. Nunca como único sinal de
  estado.
- **Máscara** é legítima quando revela conteúdo por uma aresta que pertence à
  composição (a cortina do hero carrega o polígono do painel). Ilegítima quando é só um
  jeito de fazer fade.
- **`blur` é proibido** como recurso de revelação ou de profundidade. Permitido apenas
  como propriedade da **fotografia original** (profundidade de campo real).

### 13.6 Armadilhas de motion registradas

- **`transform` e `clip-path` contam como área rolável.** Elemento deslocado precisa de
  pai que recorte, ou vaza rolagem horizontal (já causou 12px de vazamento em 768px).
- **`clip-path` no alvo zera o `IntersectionObserver`.** Um elemento com
  `clip-path: inset(0 0 100% 0)` tem `intersectionRatio` 0 mesmo inteiro na janela —
  observar a si mesmo nunca dispara. Observar o **pai**.
- **`.reveal` só esconde quando `:root[data-js='on']`** existe. Não remover o script
  inline nem a condição do CSS, ou o conteúdo some se o JS falhar.

### 13.7 Reduced motion

**Requisito, não cortesia.**

- nenhum conteúdo pode ficar em `opacity: 0`;
- nenhuma máscara pode permanecer fechada;
- a cortina do hero tem de **sumir** (`display: none`), não apenas parar — parada, ela
  cobriria a fotografia;
- a deriva de entrada da cena é anulada por `transform: none`;
- a troca de estado é **imediata**, sem saída, sem passagem e sem entrada;
- `active:scale` é cancelado.

---

## 14. Constituição — EFEITOS

### 14.1 Whitelist

| efeito | uso legítimo |
| --- | --- |
| **Scrim direcional** | garantir contraste de texto sobre fotografia. Ancorado na **guia real** do container, não em percentual fixo |
| **Gradiente funcional** | transição tonal entre palco e controle; base de superfície de porta |
| **Máscara** | revelação por aresta que pertence à composição |
| **Clip** | recorte geométrico que carrega a diagonal do sistema |
| **Sombra de contato** | apenas sob objeto que toca uma superfície, ≤8px de raio, ≤20% de opacidade |
| **Overlay tonal** | uniformizar luminância entre imagens de origens diferentes, ≤12% |
| **Tint de material** | aquecer/esfriar uma superfície em ≤4 pontos de matiz |

### 14.2 Blacklist, com motivo

| efeito | por que é proibido |
| --- | --- |
| **Glow / neon** | não existe fonte de luz que o justifique; é a assinatura de tecnologia de consumo |
| **Glassmorphism** | superfície translúcida desfocada é linguagem de sistema operacional, não de indústria |
| **Bevel / chanfro** | data o produto nos anos 1990 e produz leitura de painel de máquina |
| **Sombra dramática** | contradiz aresta viva; produz cartão flutuante, que é a gramática de SaaS |
| **Blur decorativo** | profundidade falsa. A profundidade tem de vir da fotografia |
| **Grain artificial** | textura fabricada onde há textura real disponível (o inox) |
| **Textura fake** | idem — metal escovado desenhado em CSS sobre fotografia de metal escovado real |
| **Dourado / metalizado** | o amarelo da marca **não é ouro**. Gradiente metálico o transforma em outro signo |
| **Gradiente cromático** | dois matizes num gradiente introduzem cor que não está na paleta |

### 14.3 O scrim — a única regra técnica que precisa ser repetida

O scrim protege texto sobre fotografia, e a cobertura tem de ser calculada **na
posição x onde o texto realmente está**, não pela existência do gradiente.

Um erro medido e registrado: uma coluna de 832px terminava a 59% da largura do palco,
onde a cobertura já estava em ~0,47 — e 0,47 não segura o reflexo de inox. O contraste
caiu para **3,58:1**. O que importa é **a opacidade naquele x**, não estar antes do
ponto zero do gradiente.

A rampa da esquerda é ancorada na **guia do container** (`--guia`), não em percentual:
300px de rampa em 1920, 60px em 1440, 40px em 1024. Percentual fixo reprovou em 1024
(2,46:1 na etiqueta).

---

## 15. Constituição — PROFUNDIDADE E POSIÇÃO

### 15.1 Cinco planos

| plano | conteúdo | regra |
| --- | --- | --- |
| **0 — fundo** | superfície tonal da seção | nunca recebe conteúdo direto |
| **1 — fotografia** | a cena | sangra ou é contida; nunca com raio |
| **2 — tratamento** | scrim, overlay, máscara | invisível como objeto; existe só para o plano 3 funcionar |
| **3 — conteúdo** | texto, etiqueta, legenda | assenta na guia; nunca sem plano 2 quando sobre plano 1 |
| **4 — interação** | botão, porta, controle | tem superfície própria e aresta própria; é o único plano que responde |

**Nenhum elemento pode pular de plano.** Um botão flutuando direto sobre fotografia sem
superfície própria (plano 4 sobre plano 1, sem plano 2) é o defeito que produz a leitura
de "adesivo colado na imagem".

### 15.2 Texto sobre fotografia

**Permitido quando:** existe scrim medido garantindo ≥4,5:1 no pior pixel real sob a
caixa de texto, com a cena rasterizada e a coluna escondida — a metodologia já usada na
hero.

**Exige campo próprio quando:** a fotografia tem alta frequência (equipe, prateleira,
grade de coifa) na região do texto, ou quando o texto tem mais de ~90 caracteres.

### 15.3 CTA e controles sobre imagem

- **CTA pode sobrepor** fotografia — ele é massa opaca e não depende do scrim.
- **Controle pode cruzar imagem** desde que tenha superfície própria translúcida e
  régua. É exatamente o contrato das portas da hero.
- **Legenda não sobrepõe** o assunto da fotografia; ela assenta na base, sobre a parte
  já coberta pelo scrim.

### 15.4 Pessoas

- pessoa **nunca** é recortada e colada sobre fundo de cor;
- quando o fundo original é de estúdio, ele é **estendido com plano de piso e queda de
  luz lateral** — o que se busca é que o campo restante leia como espaço;
- a figura ancora na **base** e numa das laterais, nunca centralizada e flutuante;
- escala mínima da figura: **75% da altura do campo**. Abaixo disso ela vira ilustração
  e o campo vazio pede enfeite — que é como nasceu o fluxograma removido.

---

## 16. Constituição — RESPONSIVIDADE

Mobile não é desktop comprimido. A Home tem **26,2 telas em 390px** — se cada seção for
o desktop empilhado, ninguém chega ao fim.

| faixa | larguras | comportamento |
| --- | --- | --- |
| **DESKTOP LARGE** | ≥1544 | o gutter já parou em 72px e quem manda é o teto de 1400 da casca: a guia passa a ser metade da sobra (100px em 1600, 260px em 1920 — §3.1.2). **A fotografia é que ganha a sobra**, por sangria; a margem não é o recurso de composição desta faixa |
| **DESKTOP** | 1024–1543 | composição em duas massas; assimetria plena; a guia cresce com a janela (51,2 → 72px) |
| **TABLET** | 768–1023 | duas massas viram uma; fotografia mantém sangria; controles em fileira |
| **MOBILE** | 390–767 | composição própria; fotografia em faixa; controles empilhados ou em fileira curta |
| **SMALL MOBILE** | 320–389 | reduções autorizadas do quadro abaixo |

### 16.1 O que pode ceder, por sistema

| sistema | pode sumir | pode simplificar | **nunca some** |
| --- | --- | --- | --- |
| **Hero** | legenda de material; situação da porta (<640); seta da porta (<420) | cena vira faixa no topo; conteúdo em fluxo abaixo | h1 · CTA primário · **as três portas nomeadas** · instrução |
| **Equipamentos** | miniatura de categoria secundária | vitrine vira lista vertical | nome das categorias · CTA de orçamento |
| **Projetos** | legenda longa | mosaico vira coluna única | ao menos 3 fotografias · CTA |
| **Pilares** | descrição longa | três colunas viram três blocos | os três nomes · os três CTAs |
| **Sintomas / Diagnóstico** | fotografia de apoio | painel com estado vira acordeão | o enunciado do problema · a âncora para o diagnóstico |
| **Método** | fotografia de etapa | linha horizontal vira vertical | as etapas na ordem |
| **Autoridade** | Instagram; retrato secundário | dossiê vira bloco único | nome · função · retrato principal |
| **Credibilidade** | — | faixa de logos rola por dedo (**nunca sozinha**) | os dois números confirmados · logos |
| **Fechamento** | fotografia | painel diagonal vira massa | título · CTA primário · WhatsApp |

### 16.2 Regras duras

- **Zero overflow horizontal** em 320 / 390 / 768 / 1024 / 1440 / 1920, em qualquer
  altura de rolagem. Qualquer elemento deslocado por `transform` precisa de pai que
  recorte.
- **Alvo de toque mínimo 44px**; CTA de dobra, 48px.
- **Corpo de leitura mínimo 15px.** Quando a compressão morde, quem cede é o vão, não o
  corpo.
- **A hero cabe na janela** em 1024, 1440 e 1920 (`heroBottom === altura da janela`). Em
  320×568 ela cresce por `min-height` — nada sai da tela, e isso é o comportamento
  correto, não um defeito.
- **Duas instâncias de uma mesma fotografia** (desktop com recorte, mobile em fluxo)
  exigem `sizes` restritivo por breakpoint, ou o navegador baixa as duas.

---

## 17. Constituição — CONVERSÃO

### 17.1 O princípio

**CTA não é decoração de fim de seção.** Um CTA existe quando o visitante acabou de
receber a prova que justifica a ação. CTA em toda seção treina o visitante a ignorar
CTAs.

### 17.2 Os quatro níveis

| nível | forma | quando |
| --- | --- | --- |
| **PRIMARY** | botão amarelo preenchido | o visitante tem intenção formada e acabou de ver a prova |
| **SECONDARY** | botão contornado ou WhatsApp | alternativa de canal ou de pilar, no mesmo momento de decisão |
| **TEXTUAL** | `ArrowLink` | continuação de leitura, não conversão. Aponta para dentro da página ou para rota interna |
| **AUSENTE** | — | a seção constrói contexto ou prova, e interrompê-la com uma ação custa mais do que rende |

### 17.3 Mapa de ação da Home

| # | capítulo | intenção do visitante | prova recebida | CTA | prioridade |
| --- | --- | --- | --- | --- | --- |
| — | **HEADER** | orientação | nenhuma | PRIMARY persistente — **"Solicitar orçamento"**, ver §17.4 | alta |
| 1 | **HERO** | "onde eu me encaixo?" | a cena da operação | PRIMARY por pilar + SECONDARY WhatsApp (subordinado, §8) | **máxima** |
| 2 | **EQUIPAMENTOS** | "vocês têm o que preciso?" | as frentes, em fotografia | PRIMARY orçamento | **máxima** |
| 3 | **PROJETOS** | "vocês já fizeram isso?" | operações entregues | TEXTUAL ("Ver todos os projetos") | média |
| 4 | **TRÊS FRENTES** | "e se eu não vim por equipamento?" | as três portas nomeadas | SECONDARY × 3, um por pilar | alta |
| 5 | **SINTOMAS** | reconhecimento do problema | nenhuma ainda | **AUSENTE** — só âncora textual para o diagnóstico | — |
| 6 | **DIAGNÓSTICO** | "como vocês descobrem?" | o método de leitura | PRIMARY diagnóstico | alta |
| 7 | **TRANSIÇÃO** | ponte narrativa | — | **AUSENTE** | — |
| 8 | **INDÚSTRIA DO INOX** | "eles fabricam mesmo?" | capacidade fabril — **prova, não quarta porta** | SECONDARY contextual, escopado a fabricantes | baixa |
| 9 | **MÉTODO** | "como funciona o trabalho?" | as etapas | TEXTUAL | baixa |
| 10 | **AUTORIDADE** | "quem é essa gente?" | tese e trajetória | TEXTUAL ("Conhecer a trajetória") | baixa |
| 11 | **QUEM CONDUZ** | "quem responde por mim?" | as pessoas | **AUSENTE** | — |
| 12 | **CREDIBILIDADE** | validação final | números, marcas, depoimentos | **AUSENTE** — a prova entrega ao fechamento | — |
| 13 | **FECHAMENTO** | decisão | tudo acima | PRIMARY + WhatsApp + 2 secundários nomeados | **máxima** |
| — | **FOOTER** | referência | — | contato como informação, não como CTA | baixa |

**Contagem resultante:** 4 PRIMARY, 5 SECONDARY, 3 TEXTUAL, 4 AUSENTE. Hoje a página
tem CTA em praticamente toda seção, e é por isso que nenhum deles se destaca.

### 17.4 O CTA do cabeçalho

**Rótulo: "Solicitar orçamento". Destino: o fluxo de orçamento de Equipamentos que já
existe** (`/contato?intencao=equipamentos`).

Três razões, e nenhuma é estética:

- **coerência com a prioridade comercial.** DEC-001 fixa Equipamentos como frente
  principal. A ação persistente da página inteira não pode apontar para o terceiro pilar;
- **coerência com a regra das pontas** (§17.5). A dobra abre com orçamento e o fechamento
  repete a ação — o cabeçalho, que está visível o tempo todo, tem de ser a mesma ação, e
  não uma quarta;
- **não forçar Consultoria.** "Solicitar diagnóstico" no cabeçalho pede ao visitante de
  alta intenção que aceite um diagnóstico antes de cotar. É a integração imposta que
  DEC-003 proíbe, na posição mais persistente do site.

**O layout do cabeçalho não muda.** Altura, proporções internas (logo a 52%, CTA a 46%),
tipografia fixa de 15px na navegação e a ausência do Instagram continuam como estão. O
que muda é rótulo e destino.

### 17.5 A regra das pontas

A primeira ação da página e a última têm de ser **a mesma ação**. A dobra abre com
orçamento de equipamentos e o fechamento repete essa ação — isso já está correto e
deriva de DEC-001. Terminar a página exigindo diagnóstico, quando a prioridade é
Equipamentos, é a integração imposta que DEC-003 proíbe.

---

## 18. O que este documento deliberadamente não decide

- **copy** — é conteúdo aprovado e não é variável de layout;
- **dados comerciais** — número de projetos, anos, telefone: vêm de `src/data/site.ts` e
  de confirmação humana;
- **arquitetura de rotas internas** — este documento governa a Home;
- **ordem das seções** — é narrativa comercial, governada por `src/app/page.tsx` e pelo
  documento 03, e restringida pelo teto de fundos escuros.
