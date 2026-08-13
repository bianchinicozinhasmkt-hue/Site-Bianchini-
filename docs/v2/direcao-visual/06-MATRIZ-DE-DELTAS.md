# 06 — Matriz de Deltas: Norma × Produto

```text
STATUS: ACTIVE — rastreamento de conformidade
DATA: 2026-08-12 (levantamento) · 2026-08-12 (R0-A · R0-B · R0-C · R0-C.1 · R0-D)
DEPENDE DE: 01-CONSTITUICAO-VISUAL.md · 03-BLUEPRINT-HOME.md · 04-CRITERIOS-DE-APROVACAO.md
NATUREZA: rastreamento vivo. O levantamento original não alterou produto;
          a partir de R0-A esta matriz registra também o que já foi fechado.
```

## 0. Para que serve

**Nenhuma regra normativa pode existir sem rodada responsável.** Esta matriz é a prova
disso: cada linha liga uma norma dos documentos 01/03 ao estado real do produto, à
severidade, à rodada que a implementa e ao critério que fecha.

**Uma seção só congela com zero delta aberto** (documento 04 §4.1).

### Origem dos dados

| fonte | o que veio dela |
| --- | --- |
| leitura do código em `HEAD` da branch `v2`, 2026-08-12 | todos os deltas de sistema (G, D, H, M, X) |
| `docs/v2/capturas/auditoria-visual-global-2026-08-10/inventario-global.json` | contagens por seção (caracteres, blocos, cards, hairlines, amarelos, altura, % de imagem) |

Números de seção são de 1440 × 900, salvo onde indicado.

> **Os números de seção têm data, e a data importa.** Eles vêm de um inventário de
> 2026-08-10 no HEAD `1f96a1f`; qualquer commit posterior que toque a seção os torna
> velhos. Foi o que aconteceu com S-08 — ver a nota de R0-D em §3. **Remeça a seção antes
> de cobrar o teto dela**, e prove o contador contra `#transicao` (326/3) e `#fechamento`
> (182/2), que são os dois valores de referência desta tabela.

### Legenda de severidade

`P0` bloqueia publicação · `P1` bloqueia congelamento · `P2` rodada planejada ·
`P3` polish. Categorias: `ESTÉTICA` `COMPOSIÇÃO` `UX` `CONVERSÃO` `MOTION` `ASSET`
`CONTEÚDO` `RESPONSIVIDADE`.

---

## 1. Sistemas globais

| id | regra normativa | estado atual | delta | sev. | rodada | dependência | critério de saída |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ~~**G-1**~~ | Guia única: `--gutter: clamp(20px, 5vw, 72px)` como **margem**, `guia = max(gutter, (100vw−1400)/2)` — doc 01 §3.1 | ~~guia medida 20/20/32/40/40/60/140/300~~ → **20/20/38,4/51,2/68,3/72/100/260**, exata nas 8 larguras | **FECHADO em R0-A** (2026-08-12) | `P1 · COMPOSIÇÃO` | **R0-A** | nenhuma | ✅ guia bate com doc 01 §3.1.2 nas 8 larguras (0px de desvio, não ±1); **uma** definição no código; zero overflow |
| ~~**G-1b**~~ | Marca do cabeçalho e `h1` da hero no mesmo eixo — doc 01 §3.2 | ~~`lg:pl-[3.1cqw]`, marca em 59,5 contra `h1` em 300 (1920)~~ → cabeçalho usa `.container-shell`, a mesma casca de toda seção | **FECHADO em R0-A** (2026-08-12) | `P1 · COMPOSIÇÃO` | **R0-A** | G-1 | ✅ `x` da marca = `x` do `h1` nas 8 larguras (desvio 0 em todas); altura, proporções internas e tipografia da navegação inalteradas |
| ~~**G-2**~~ | CTA de WhatsApp é massa **ou** contorno, nunca irmão preenchido do primário — doc 01 §6.4, §8 | ~~`bg-[#2A6F44]` cheio~~ → contorno com superfície grafite translúcida e **glifo verde**, na dobra e no fechamento | **FECHADO em R0-A** (2026-08-12), com uma ressalva de razão abaixo de 1366 — ver nota | `P1 · CONVERSÃO` | **R0-A** | nenhuma | ✅ par massa+contorno na dobra e no fechamento; razão 1,300 em ≥1366; 4 estados preservados |
| **G-3** | Três curvas de motion, sem laço — doc 01 §13 | conforme, exceto o marquee (ver M-1) | — | — | — | — | — |
| **G-4** | Escala tipográfica registrada em `tailwind-merge` — doc 01 §5 | conforme | — | — | — | — | — |
| **G-5** | Orçamento de cor: ≤3 amarelos por viewport — doc 01 §6.2 | violado em 6 seções | ver seções | `P1`/`P2` | **R3** | nenhuma | contagem ≤3 por seção |
| ~~**G-6**~~ | Base comum de botão: raio 2px · preenchimento por `scaleY` da base · sem sombra de projeção — doc 01 §7.1, §8, §14.1/§14.2 | ~~`base` com `rounded-[3px]`; `primary`/`light` por `scale-x` da esquerda com `shadow-cta`~~ → **uma gramática só**: raio 2px na base, `scaleY` da base em 220ms `precise` em todos os papéis, zero sombra, pressão `scale(0.985)` | **FECHADO em R0-C.1** (2026-08-12) | `P2 · ESTÉTICA/MOTION` | **R0-C.1** | nenhuma | ✅ **0 fora da norma** em 41 botões renderizados × 6 rotas × 2 viewports; foco dispara o mesmo preenchimento do hover em 100% dos alvos; caixa não muda ao interagir (Δ 0,0 em todos) |

### R0-A — o que foi implementado, e o que ficou aberto

Rodada de 2026-08-12. Evidência completa (medições cruas, harness e capturas antes/depois)
em `docs/v2/capturas/sistemas-globais-r0a-2026-08-12/`.

**G-1.** `--gutter`, `--container-max` e `--container-wide` viram token em `globals.css`; a
casca é `.container-shell` (`width: min(teto, 100% − 2 × gutter)`, `margin-inline: auto`,
**recuo interno zero**). A guia é publicada como `--guia`, resolvida por `cqw` a partir de
`main` — `%` resolveria contra quem lê e `vw` incluiria a barra de rolagem, que era a
origem dos ~7px de desvio da sangria de `#equipamentos`. As **cinco** expressões manuais da
guia (`Container`, `.scrim::before`, `.mediaCaption`, sangria de `#equipamentos`,
cabeçalho) foram substituídas pela definição única; `max-w-container` e `max-w-wide` saíram
de `theme.ts` para não haver caminho de volta.

Classificação das ocorrências varridas, conforme pedido: **A · guia de texto** — `Container`,
cabeçalho, legenda sangrada de `#projetos`, wrapper manual de `/leonardo-bianchini`;
**B · sangria derivada** — `#equipamentos`, faixa mobile da hero V1; **C · geometria local,
não alterada** — `--door-pad` de `.doors` (recuo próprio da porta), `--u` da hero V1,
`cqw` dos vãos internos do cabeçalho, `text-[3.1cqw]` de `book-cover`, altura do `HeaderCta`.

**G-2.** O par da dobra deixa de ser duas massas. O verde saiu da caixa e foi para o glifo;
`--whatsapp` (#25D366) e `--whatsapp-deep` (#2A6F44) viram token, fora da paleta Tailwind
porque verde é canal, não cor de sistema. A variante `whatsapp-light` entrou para superfície
escura, e o fechamento passou de `light-outline` (sem glifo) para ela.

**Ressalva de G-2, registrada e não escondida.** A razão de largura ≥1,30 é cumprida em
1366/1440/1600/1920 (1,300 exato). De 320 a 1024 ela fica em 1,18–1,22 — valor **idêntico
ao de antes de R0-A**, não uma regressão. Chegar a 1,30 em 1024 exigiria comprimir o recuo
do rótulo de 19 para ~12px; em 320/390 os CTAs empilham e a razão deixa de ser sinal de
hierarquia. Em todas as larguras a subordinação passa a ser de **construção** (uma massa,
um contorno), que é o mecanismo que o delta pedia. Reavaliar em **R0-B**, que é dona da
linha de ação da dobra.

**O scrim não mudou.** A guia se moveu em todas as larguras ≥768, então o contraste foi
remedido nos três estados × cinco viewports: pior valor **6,21:1**, contra piso de 4,5.
Nenhuma rampa precisou ceder.

---

## 2. Hero e cabeçalho

| id | regra normativa | estado atual | delta | sev. | rodada | dependência | critério de saída |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ~~**D-1**~~ | Porta ativa: grafite **neutro** mais claro; amarelo só em régua e seta — doc 01 §9.4 | ~~derrame de `rgba(245,198,75,0.14)` sobre base quente `rgb(70,65,51)`~~ → superfícies no **eixo neutro**, `rgba(28,28,28,.90)` → `rgba(78,78,78,.95)` | **FECHADO em R0-B** (2026-08-12) | `P1 · ESTÉTICA` | **R0-B** | nenhuma | ✅ croma composto **0–1** nos dois estados em 6 larguras (era 29–35 no ativo); delta declarado de 48,9pt no eixo neutro; grayscale Δ 40,6–43,5 — **não caiu** ao tirar o amarelo |
| ~~**D-2**~~ | Seletor `1,2fr / 1fr / 1fr` (faixa 1,15–1,3) — doc 01 §9.2 | ~~`repeat(3, minmax(0,1fr))`~~ → **`1.15fr 1fr 1fr`** a partir de `lg` | **FECHADO em R0-B** (2026-08-12) | `P1 · COMPOSIÇÃO` | **R0-B** | nenhuma | ✅ +15,0% de área nas 5 larguras de desktop; iguais abaixo de `lg`; `scrollWidth === clientWidth` em todo nome, nos 8 viewports; `heroBottom` e alturas **idênticos** ao baseline (isolado) |
| ~~**D-3**~~ | = G-2, aplicado à dobra | **FECHADO em R0-A** (2026-08-12) junto com G-2 | ver a nota de R0-A | `P1 · CONVERSÃO` | **R0-A** | G-2 | ✅ ver G-2; **reverificado em R0-B** sem alteração — ver a nota abaixo |
| ~~**D-4**~~ | Sem bisel; a aresta é a régua — doc 01 §7.2, §14.2 | ~~`inset 0 2px 0 rgba(255,255,255,0.16)` + `inset 0 -2px 0 rgba(0,0,0,0.5)`~~ → `box-shadow: none`; a régua é `border-top` | **FECHADO em R0-B** (2026-08-12) | `P2 · ESTÉTICA` | **R0-B** | nenhuma | ✅ `boxShadow` computado = `none` na superfície, nos 8 viewports; nada entrou no lugar da sombra de base; demais bordas `0px`, raio `0px` |
| ~~**D-5**~~ | Comentário descreve o código que acompanha | ~~`hero-stage.tsx:47` mostrava a faixa `18 anos · Brasil` removida em 2026-08-09; `:63` afirmava 1,2fr inexistente~~ | **FECHADO em R0-B** (2026-08-12) | `P3 · CONTEÚDO` | **R0-B** | D-2 | ✅ os dois corrigidos, mais nove outros achados na varredura — ver a nota abaixo |
| ~~**H-1**~~ | Header CTA "Solicitar orçamento" → `/contato?intencao=equipamentos` — doc 01 §17.4 | ~~`label = 'Solicitar diagnóstico'`, `href="/contato"`~~ → **"Solicitar orçamento"** → `/contato?intencao=equipamentos`, no cabeçalho **e** no menu do telefone | **FECHADO em R0-C** (2026-08-12) | `P1 · CONVERSÃO` | **R0-C** | nenhuma | ✅ rótulo e destino conformes nos 8 viewports; altura, guia, tipografia e navegação inalteradas; o formulário chega com `equipamentos` pré-selecionado (medido ponta a ponta) |
| ~~**H-2**~~ | Raio do sistema = 2px — doc 01 §7.1 | ~~`rounded-[3px]`~~ → `rounded-[2px]` no `HeaderCta` | **FECHADO em R0-C** (2026-08-12) | `P3 · ESTÉTICA` | **R0-C** | nenhuma | ✅ `borderRadius` computado = `2px` nos 8 viewports |
| ~~**H-3**~~ | Preenchimento de hover por `scaleY`, origem na base — doc 01 §8 | ~~`before:origin-left before:scale-x-0`, 280ms `smooth`~~ → `origin-bottom`, `scale-y-0`, **220ms `precise`** | **FECHADO em R0-C** (2026-08-12) | `P3 · MOTION` | **R0-C** | nenhuma | ✅ `transformOrigin` na base; `matrix(1,0,0,0,…)` em repouso e `matrix(1,0,0,1,…)` em hover **e** em `focus-visible` — o mesmo preenchimento, como §8 exige |
| ~~**H-4**~~ | Sem sombra projetada — doc 01 §14.2 | ~~`hover:shadow-[0_8px_16px_-10px_rgba(0,0,0,0.8)]`~~ → `box-shadow: none` | **FECHADO em R0-C** (2026-08-12) | `P2 · ESTÉTICA` | **R0-C** | nenhuma | ✅ zero sombra de projeção em default/hover/active; o anel de foco (2px amarelo + offset grafite) permanece íntegro |

### R0-B — o que foi implementado

Rodada de 2026-08-12. Evidência completa — baseline `2b622a7` **construído e medido em
paralelo**, harness, medições cruas e capturas antes/depois — em
`docs/v2/capturas/hero-r0b-2026-08-12/`.

**A hero não foi redesenhada.** Nenhum item da lista de congelados conceituais (doc 03
§2.1) foi tocado: scrim, `--u`, coreografia, ARIA, copy, `h1`, largura de leitura,
posição vertical, cenas, assets, alturas de porta, vãos e preload seguem como estavam.

**D-1 e D-4 são subtração, e as duas se pagam.** O tingimento saiu com a base quente
junto; o bisel saiu inteiro e **nada entrou no lugar** da sombra de base. A régua deixou
de ser `box-shadow: inset` e passou a `border-top` — a diferença não é de acabamento: uma
sombra interna clara no topo com uma escura embaixo *é* a construção de bevel, e uma
aresta desenhada não é.

O achado que vale registrar: **o Δ em escala de cinza não caiu ao tirar o amarelo**
(40,6–43,5 depois, contra 37,9–43,5 antes; em 390 e 768 subiu). Ou seja, o derrame não
estava sustentando hierarquia nenhuma — era poluição cromática pura, e o sinal de estado
sempre viveu na luminância, na elevação e no peso.

**D-2 escolheu o piso da faixa autorizada.** `1.15fr`, não `1.2fr`: a norma pede a menor
diferença que torne a prioridade inequívoca, e 1,15 entrega +15,0% de área (61,3px em
1440) sem que Projetos e Consultoria leiam como restos. Medido, a proporção **não custou
um pixel de altura** — `heroBottom` e as alturas das portas são idênticos ao baseline nas
cinco larguras de desktop, isolando a variável no mesmo carregamento.

Abaixo de `lg` as três portas continuam iguais, conforme doc 03 §2.12: em 320px cada
porta tem ~99px e o nome pede ~81, e ali a área cedida custaria legibilidade de nome.

**D-5 encontrou mais do que os dois itens catalogados.** Além do diagrama com a faixa de
métricas e da afirmação de 1,2fr, a varredura achou nove comentários descrevendo
mecanismos que já não existem: a árvore `.plate` da chapa fechada, dois blocos de valores
de altura e de vão superados, referências a `HEADLINE_MIN`/`INTENT_MIN` (removidos em
2026-08-09), a afirmação de que o bloco de conteúdo remonta a cada troca (o `key` saiu na
mesma data), a camada vetorial de Consultoria como fonte de vida da cena (removida em
2026-08-11) e duas opacidades de seta desatualizadas. Todos corrigidos ou removidos; a
regra aplicada foi comprimir, não ampliar.

**D-3 foi reverificado, não alterado.** A razão de largura do par PRIMARY × WhatsApp
continua **1,300** em 1366/1440/1600/1920 e 1,18–1,22 de 320 a 1024 — valor idêntico ao
medido em R0-A, com a ressalva daquela rodada intacta. A subordinação por construção (uma
massa, um contorno) é o mecanismo, e ele está de pé. Nada em G-2 foi tocado.

**Uma correção de coerência, dentro das regras reescritas.** No bloco de toque
(`max-width: 1023px`) a porta escolhida caía para `translateY(-3px)` sob hover preso,
contra os `-6px` que a norma fixa como sinal de elevação (doc 01 §9.4, sinal 3) — um
degrau que a rodada de 2026-08-11 não acompanhou. Como aquelas regras existem para
**cancelar** o hover e estavam sendo reescritas de qualquer forma, elas passam a restaurar
exatamente a superfície de repouso, elevação incluída.

### R0-C — o cabeçalho, e o que ele expôs

Rodada de 2026-08-12. Evidência em `docs/v2/capturas/header-r0c-2026-08-12/`.

**H-1 vale pelos outros três somados.** A ação visível o tempo todo deixou de pedir
diagnóstico e passa a pedir orçamento de Equipamentos — o pilar que DEC-001 fixa como
principal. O destino não é novo (`?intencao=equipamentos` já era lido por
`contact-form.tsx`), e a prova é ponta a ponta: clicando pelo menu do telefone, o
formulário abre com a necessidade **já selecionada**.

**O menu do telefone entrou no escopo de H-1, e tinha de entrar.** Ele carrega o mesmo
CTA persistente. Deixá-lo dizendo "Solicitar diagnóstico" enquanto o desktop diz
"Solicitar orçamento" criaria duas copies para a mesma ação e manteria o defeito vivo
justamente no tráfego móvel. Só o par rótulo + destino mudou ali: estrutura, abertura,
Escape, backdrop e retenção de foco não foram tocados, e foram testados um a um.

**H-3 mudou mais que o eixo.** Além de `scaleX`→`scaleY` com origem na base, a duração
foi de 280ms `smooth` para **220ms `precise`**, que é o que doc 01 §8 fixa para todos os
papéis — é o mesmo gesto dos dois CTAs da dobra. Medido, `focus-visible` dispara
exatamente o mesmo preenchimento do hover.

**A elevação de 1px saiu junto com a sombra de H-4, e o `active` foi refeito.** Os dois
eram um gesto só (o objeto levanta, a sombra prova que levantou), e as três cláusulas
antigas de `active` existiam para desfazer elevação e sombra que deixaram de existir —
uma delas trocando `background-color`, que §8 proíbe. No lugar entra a pressão normativa
do sistema: `scale(0.985)` em 120ms `precise`, cancelada por `motion-reduce`.

**O que R0-C deliberadamente não fez.** Doc 01 §17.4 é explícito em que o layout do
cabeçalho não muda, e o briefing da rodada listou "demais CTAs da página" como
intocáveis. Nada de altura, guia, logo, navegação, breakpoints ou estrutura do menu foi
alterado — medido, a marca continua no mesmo `x` do `h1` nos oito viewports, que é o
resultado de G-1b.

### G-6 — a verificação de §19 achou o problema um nível acima

O briefing de R0-C mandou, antes de escrever CSS próprio do cabeçalho, checar se o
`Button` compartilhado já satisfazia H-2/H-3/H-4. **Ele não satisfazia — porque ele
próprio diverge**, nos mesmos três pontos:

| | norma | `ui/actions/button.tsx` |
| --- | --- | --- |
| raio | 2px, o **único** do sistema (§7.1) | `rounded-[3px]` na `base` |
| preenchimento | `scaleY`, origem na base (§8) | `primary` e `light` usam `scale-x` da esquerda |
| sombra | contato ≤8px de raio e ≤20% (§14.1) | `shadow-cta` = `0 8px 18px -10px` a **45%** |

Então o `HeaderCta` **continua sendo componente próprio**, e isso é o resultado correto
da verificação, não uma exceção de conveniência: adotar a variante global teria importado
os três defeitos.

**Por que G-6 não foi corrigido em R0-C.** O briefing lista "demais CTAs da página" como
intocáveis, e a mudança atinge 25 instâncias `primary` mais 4 `light` em 15 rotas — a
validação visual que §19 exige para mexer no compartilhado é, em extensão, uma rodada
inteira. Fazê-la aqui seria o oposto de "cirúrgica, sem redesign".

**Onde isso aparece hoje:** o CTA do painel do telefone (`LinkButton` `primary`) mantém
raio de 3px e a sombra de contato fora da whitelist. Ele recebeu H-1 (rótulo e destino) e
**não** recebeu H-2/H-4, que são escopados ao `HeaderCta` pela própria matriz.

**Consequência para o congelamento, declarada e não escondida.** Doc 04 §4.1.2 diz que
nenhuma seção congela antes de os sistemas globais que a atravessam estarem conformes. O
cabeçalho fecha os quatro deltas que lhe pertencem, mas G-6 atravessa a superfície dele
pelo CTA do painel. O selo abaixo é dado com essa dependência **explícita**: se a direção
entender que §4.1.2 pesa mais que o recorte do briefing, o selo cai com uma linha e G-6
passa a bloquear — a decisão é da direção, não desta rodada.

---

### Selo do cabeçalho

```text
STATUS: CONGELADO DEFINITIVAMENTE
DATA: 2026-08-12 (R0-C) · dependência removida em R0-C.1, no mesmo dia
RODADA: R0-C + R0-C.1
COMMIT: R0-C — `feat(v2): consolida conversão e estados do header`, filho direto
        de `46e7ef2`
        R0-C.1 — `refactor(v2): consolida sistema global de botoes`, filho direto
        de `b7b456a`
EVIDÊNCIA: docs/v2/capturas/header-r0c-2026-08-12/
           docs/v2/capturas/botoes-r0c1-2026-08-12/
DEPENDÊNCIA ABERTA: nenhuma
```

**A dependência de G-6 foi removida, não dispensada.** Quando o selo foi dado em R0-C, o
`Button` compartilhado ainda divergia da norma e atravessava a superfície do cabeçalho
pelo CTA do painel do telefone — doc 04 §4.1.2 podia ser lido como bloqueio. R0-C.1
fechou G-6, e a revalidação dos dezesseis critérios de R0-C foi refeita sobre o sistema
novo. O CTA do painel passou de raio 3px com sombra de contato para raio 2px sem sombra,
com o mesmo preenchimento do resto.

**O NAV CTA perdeu a seta** (doc 01 §17.4, decisão registrada em R0-C.1). A contradição
documental que R0-C reportou sem resolver — §8 listava o papel 5 como "sem ícone"
enquanto §17.4 dizia que o layout não muda — passou a ter **uma** regra. Medido: o CTA foi
de 209 × 40 para 181 × 40 em ≥1366, sem recomposição de recuo, sem mudança de altura de
faixa e sem alterar a guia (marca = `h1` nos oito viewports).

O formato de referência ao commit é o mesmo adotado no selo da hero, e pela mesma razão:
o selo vive no commit que ele sela, e um commit não pode conter o próprio hash. A
referência é inequívoca — há um único filho de `46e7ef2` em `v2` — e o hash consta do
relatório da rodada.

---

## 3. Seções

| id | seção | regra normativa | estado atual | delta | sev. | rodada | critério de saída |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ~~**S-01**~~ | equipamentos | ≤1.200 caracteres, ≤12 blocos — doc 01 §4.5 | ~~2.443 caracteres, 26 blocos~~ → **medido 1.078 / 14 em `20f7e8c`; o número da linha era do inventário de `1f96a1f`, anterior à recomposição do mesmo dia** → **343 / 8** | **FECHADO em R1** (2026-08-12) | `P1 · CONTEÚDO` | **R1** | ✅ 343 caracteres em 8 blocos — 71% abaixo do teto de caracteres, 33% abaixo do de blocos; corte por função, com destino conferido para cada trecho removido |
| ~~**S-02**~~ | equipamentos | zero card; categoria é foto+nome — doc 01 §7.3 | ~~5 cards~~ → `bg-graphite` (#101010) na caixa de cada fotografia, dentro de seção `graphite-soft` (#1A1A1A) — mesma construção de S-15 | **FECHADO em R1** (2026-08-12) | `P2 · COMPOSIÇÃO` | **R1** | ✅ zero cards nas 8 larguras; superfície removida, nada no lugar; composição renderizada idêntica (a imagem é `fill` + `cover` e o fundo nunca aparecia) |
| ~~**S-03**~~ | equipamentos | altura ≤1.100px | ~~1.565px~~ → **medido 1.379px em `20f7e8c`** → **1.033px** | **FECHADO em R1** (2026-08-12) | `P2 · COMPOSIÇÃO` | **R1** | ✅ 1.033px em 1440, −25%; redução por menos blocos, zero cards e faixa integrada — sem crop forçado, texto miúdo ou gap insuficiente |
| ~~**S-04**~~ | equipamentos | silhueta **B** (não palco, para não repetir a hero) — doc 03 §1.1 | ~~palco (A) logo após a hero (A)~~ | **FECHADO em R1** (2026-08-12) | `P2 · COMPOSIÇÃO` | **R1** | ✅ texto na guia, ao lado da fotografia; massa 69,7/30,3 em 1440 (teto: nunca 50/50); uma só aresta sangrada, compartilhada por palco e faixa |
| **S-04b** | equipamentos | a fotografia protagonista domina a massa fotográfica — doc 03 ficha 2, HIERARQUIA | protagonista **20,6%** da área contra **24,0%** das quatro secundárias somadas | **FECHADO em R1** (2026-08-12) | `P2 · COMPOSIÇÃO` | **R1** | ✅ 35,6% contra 25,1%; área fotográfica total 44,6% → 60,7% |
| ~~**S-05**~~ | projetos | silhueta **D** friso — doc 03 §1.1 | ~~**B**, repetindo vizinhas~~ → **já era D em `f418ab0`**: protagonista sangrando as duas bordas, frisa de três provas na mesma altura, legendas dentro da fotografia, zero moldura, CTA textual | **FECHADO em R2** (2026-08-12) | `P1 · COMPOSIÇÃO` | **R2** | ✅ silhueta D nas 8 larguras; 1 imagem rompendo o container (full-bleed) em todas; frisa passou a acompanhar a faixa fotográfica (gutter 24px) e o degrau de 72px sumiu |
| ~~**S-06**~~ | projetos | ≤4 cards, ≤6 hairlines, ≤3 amarelos | ~~6 cards, 9 hairlines, 8 amarelos~~ → **medido em `f418ab0`: 0 cards autônomos, 3 hairlines, 6 amarelos** → **6 → 3 amarelos** | **FECHADO em R2** (2026-08-12) | `P2 · ESTÉTICA` | **R2** | ✅ 0 cards autônomos (as 4 caixas são leito de fotografia); 3 hairlines, nenhuma estrutural; 3 amarelos em desktop e 2 em mobile |
| ~~**S-07**~~ | projetos | altura ≤1.100px; ≥70% de imagem | ~~1.593px; 55%~~ → **medido em `f418ab0`: 1.422px; 64,4%** → **1.422px; 68,8% da caixa e 73,3% da área útil** | **FECHADO em R2** (2026-08-12), com **ajuste normativo do teto de altura** — ver nota | `P2 · COMPOSIÇÃO` | **R2** | ✅ ≥70% da área útil em 1024–1920; teto de altura revisto para ≤1.450px por incompatibilidade aritmética com o de área (doc 03, ficha 3) |
| ~~**S-08**~~ | pilares | ≤1.200 caracteres | ~~1.505~~ → **medido 844 em `48e1b65`; o número da linha era de antes de `bdca4a5`** → **704** depois do corte editorial | **FECHADO em R0-D** (2026-08-12) | `P3 · CONTEÚDO` | **R0-D** | ✅ 704 caracteres, 41% abaixo do teto; corte só em redundância, com ANTES→DEPOIS registrado; três frentes e assimetria a favor de Equipamentos preservadas |
| **S-09** | sintomas | ≤3 amarelos | 8 | orçamento de cor | `P2 · ESTÉTICA` | **R3** | ≤3 |
| **S-10** | sintomas | sem moldura fechada — doc 01 §7.3 | `border border-white/15` na fileira de capítulos | moldura de painel | `P3 · ESTÉTICA` | **R3** | sem borda fechada |
| **S-11** | diagnóstico | ≤6 hairlines | **12** — o maior da página | leitura de PDF | `P1 · ESTÉTICA` | **R4** | ≤6 |
| **S-12** | diagnóstico | ≤12 blocos; zero card | 20 blocos, 3 cards | densidade | `P2 · CONTEÚDO` | **R4** | ≤12, zero cards |
| **S-13** | diagnóstico | nenhuma lista com maioria inerte — doc 01 §4.2 | 6 frentes, 2 ativas e 4 esmaecidas | tabela de relatório | `P2 · UX` | **R4** | item só tem forma de item se ativo, ou todos no mesmo estado |
| **S-14** | diagnóstico | silhueta **E** sequência | **B**, repetindo `#sintomas` | dupla consecutiva | `P2 · COMPOSIÇÃO` | **R4** | silhueta E |
| ~~**S-15**~~ | transição | zero card | ~~1 card residual: `bg-canvas` na caixa da fotografia, dentro de seção `canvas-deep`~~ → superfície removida, nada no lugar | **FECHADO em R0-D** (2026-08-12) | `P3 · COMPOSIÇÃO` | **R0-D** | ✅ zero cards nas 8 larguras; nenhuma substituição ornamental; altura idêntica em todas (a foto é `cover` e o fundo nunca aparecia) |
| **S-16** | indústria | ≥60% de imagem; silhueta **A** | **15%** | argumento é material, e não há material visível | `P1 · ASSET` | **R6** | ≥60%, palco de textura |
| **S-17** | indústria | ≤12 blocos; ≤3 amarelos | 18 blocos, 6 amarelos | densidade e cor | `P2` | **R3**/**R6** | dentro dos tetos |
| **S-18** | indústria | todo numeral com origem rastreável — DEC-006 | 4 numerais visíveis | **verificar origem de cada um** | `P2 · CONTEÚDO` | **R6** | origem confirmada ou numeral removido |
| **S-19** | indústria | prova de capacidade, **não quarta porta** — doc 03 ficha 8 | 2 CTAs com peso de porta | risco de virar 4ª frente | `P2 · CONVERSÃO` | **R6** | CTA secundário e contextual |
| **S-20** | método | CTA textual, não primary — doc 01 §17.3 | faixa escura com CTA `lg` primário | conversão em momento de baixa intenção | `P2 · CONVERSÃO` | **R4** | CTA textual |
| **S-21** | método | zero moldura de card; ≤6 hairlines | 4 cards com `border`+`bg-surface`, 9 hairlines | leitura de grade | `P2 · ESTÉTICA` | **R4** | sem moldura, ≤6 |
| **S-22** | método | stagger ≤4 passos — doc 01 §13.1 | 6 etapas escalonadas | excede o teto | `P3 · MOTION` | **R4** | ≤4 passos |
| **S-23** | método | altura ≤1.100px | 1.290px | — | `P3 · COMPOSIÇÃO` | **R4** | ≤1.100px |
| **S-24** | leonardo | retrato ≥20% da área | **3%** | assimetria sem massa que a sustente | `P2 · ASSET` | **R5** | ≥20% |
| **S-25** | leonardo | ≤3 amarelos | 4 | — | `P3 · ESTÉTICA` | **R3** | ≤3 |
| **S-26** | quem conduz | ≤3 amarelos | **14** | **maior violação do sistema na página** | `P1 · ESTÉTICA` | **R3** | ≤3 |
| **S-27** | quem conduz | silhueta **D** friso; altura ≤1.100px | **B**, 1.432px | dupla com `#leonardo` | `P2 · COMPOSIÇÃO` | **R5** | silhueta D, ≤1.100px |
| **S-28** | quem conduz | sem redundância com `#leonardo` | parcial (etiqueta corrigida em 2026-08-11) | conteúdo ainda se sobrepõe | `P2 · CONTEÚDO` | **R5** | sem sobreposição temática |
| **S-29** | credibilidade | ≤1.200 caracteres | 1.403 | — | `P2 · CONTEÚDO` | **R3** | ≤1.200 |
| **S-30** | credibilidade | par de numerais confirmados em escala — doc 03 ficha 12 | 17 anos e 3.000+ no mesmo corpo dos rótulos | prova numérica sem hierarquia | `P2 · COMPOSIÇÃO` | **R3** | os dois numerais em escala `numeral`, crescendo juntos |
| ~~**S-31**~~ | fechamento | ≤3 amarelos | ~~5: keyline, texto da etiqueta, traço da etiqueta, CTA primário, traço do rótulo de atendimento~~ → **3**: keyline (MARCA), CTA primário (AÇÃO), traço da etiqueta (hairline) | **FECHADO em R0-D** (2026-08-12) | `P3 · ESTÉTICA` | **R0-D** | ✅ 3 em ≥1024 e 2 abaixo, nas 8 larguras **e nas 10 rotas** que montam o componente; duas massas removidas, zero opacidade reduzida; PRIMARY inequívoco |

### R0-D — as três seções de conformidade, e o número que não se sustentou

Rodada de 2026-08-12. Evidência completa — medições cruas antes/depois nas oito larguras,
sonda de altura, varredura das 10 rotas, acessibilidade e capturas — em
`docs/v2/capturas/secoes-r0d-2026-08-12/`.

**Nenhuma das três foi redesenhada.** A rodada é subtração: uma oração repetida, uma
superfície de card e dois acentos amarelos. Zero estrutura nova, zero CTA novo, zero asset
novo, zero mudança de destino.

**S-08 obrigou a corrigir a própria matriz.** O contador desta rodada foi validado contra a
auditoria de 2026-08-10 antes de ser usado — ele devolve **exatamente** os números
publicados por ela em `#transicao` (326/3) e `#fechamento` (182/2). Com o mesmo contador,
`#pilares` mede **844 caracteres**, não 1.505. A explicação está na própria declaração de
origem desta matriz: o inventário é de `1f96a1f`, e `bdca4a5` reescreveu a seção no dia
seguinte. Conferido no código daquele commit, a seção já tinha os mesmos 11 blocos — ou
seja, **o teto de 1.200 já estava cumprido antes de R0-D**, e a linha S-08 cobrava uma
distância que não existia mais.

O corte foi feito assim mesmo, pelo critério editorial e não pela aritmética antiga: −140
caracteres (−16,6%), todos em redundância. O maior deles é uma oração que a home publicava
**duas vezes** — "não há repasse de culpa entre projetista, fornecedor e instalador",
idêntica em `#pilares` e em `#transicao`. Cedeu a de `#pilares`. A resposta de Equipamentos
ficou intacta: é a única sem redundância a cortar, e encurtar a frente prioritária
achataria a assimetria que DEC-001 pede que a seção expresse.

**A altura de `#pilares` não cai acima de 1024, e isso foi investigado, não presumido.**
`min-height` é `auto` nas três colunas; a linha é ditada pela coluna mais alta, que em toda
largura de desktop é Equipamentos — a que não foi cortada. Não havia altura artificial nem
espaçamento decorrente a corrigir (`vazioBase` = 56px antes e depois). Onde o corte muda a
caixa, muda de verdade: **−124px em 320** e −53px em 390, que é onde MB-1 dói.

**S-15 era uma superfície, não uma moldura.** O card residual da transição era o
`bg-canvas` da caixa da fotografia sobre uma seção `canvas-deep` — superfície própria
distinta da seção, que é a construção de card em doc 01 §7.3. Saiu sem substituto: nem
borda, nem régua, nem fundo mais próximo do tom. Como a foto é `cover`, o fundo nunca
aparecia depois do carregamento, e a altura é idêntica nas oito larguras.

**S-31 não escolheu quem cede — §6.2 já tinha escolhido.** A ordem é `MARCA > AÇÃO >
ESTADO`, e a norma traz o caso resolvido na primeira dobra: com seis regiões, **a etiqueta
cedeu o texto e manteve o traço**, por não ser nenhuma das três. O fechamento repete a
decisão, com o mesmo `canvas/80` da hero congelada; o segundo corte é o traço do rótulo de
atendimento, acento decorativo sobre o último item da hierarquia de leitura da seção.
Sobram três com função: keyline (geometria do mockup), CTA primário e o traço da etiqueta —
hairline de 56px², abaixo do piso de relevância que §6.2 define.

**As 10 rotas que montam `FinalCtaSection` foram medidas, não presumidas.** Todas marcam
3 amarelos, 2 ações e a mesma etiqueta em `rgba(239,237,235,0.8)`, com zero erro de console.
Composição, copy, destinos e contagem de ações não mudaram em nenhuma: o que se propaga é a
conformidade de cor, que é ganho normativo e não regressão. A ficha 13 pedia validação nas
nove internas justamente por isso.

**Uma divergência da ficha 13, declarada e não resolvida aqui.** O bloco CTA daquela ficha
prevê `PRIMARY + WhatsApp + 2 SECONDARY nomeados` (projetista, diagnóstico), e o produto
tem **duas** ações, não quatro. As três necessidades são nomeadas na *copy* — decisão
registrada em `src/app/page.tsx` —, não em botões. Isso **não é delta**: não há norma dos
documentos 01/03 violada por ter menos CTA, e criar duas ações novas seria composição nova,
que R0-D está proibida de fazer. Fica para a direção decidir se a ficha se alinha ao
produto ou o contrário.

---

## 4. Motion, mobile e dívida documental

| id | escopo | regra normativa | estado atual | delta | sev. | rodada | critério de saída |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **M-1** | credibilidade | nada em laço; faixa de logos sem movimento automático — doc 01 §13.4.1 | `animate-marquee` sobre lista duplicada, pausa no hover | **única animação em laço permanente da página** | `P2 · MOTION` | **R3** | zero laço; rolagem por ação; logotipos carregam em qualquer posição |
| **MB-1** | página inteira | ≤18 telas em 390px — doc 05 R7 | **26,2 telas** (22.085px) | extensão, não composição | `P1 · RESPONSIVIDADE` | **R7** | ≤18 telas; nada da coluna "nunca some" removido |
| **MB-2** | rodapé | proporcional ao conteúdo | **2,16 telas em 390px** | rodapé ocupa 8% da página | `P2 · RESPONSIVIDADE` | **R7** | ≤1 tela em 390 |
| **X-1** | `src/data/`, `CLAUDE.md`, `docs/v1-release/` | documentação reflete o estado consolidado — doc 05 §3 | quatro lugares ainda descrevem "3.000+" como pendente; `home.ts:51-52` afirma, **errado**, que a métrica não é renderizada em rota pública | contradiz o dado confirmado e induz a erro | `P3 · CONTEÚDO` | rodada que tocar esses arquivos | comentários alinhados ao estado consolidado |

---

## 5. Contagem

Atualizado em 2026-08-12, ao fim de **R2**. O total é **42**: G-6 entrou como delta novo em
R0-C e fechou em R0-C.1; **S-04b** entrou como delta novo em R1 e fechou na mesma rodada.
R2 fechou três linhas (S-05, S-06, S-07) sem abrir nenhuma.

| severidade | total | fechados | **abertos** |
| --- | ---: | ---: | ---: |
| **P0** | 0 | 0 | **0** |
| **P1** | 10 | **9** | **1** |
| **P2** | 21 | **9** | **12** |
| **P3** | 11 | **6** | **5** |
| **TOTAL** | 42 | **24** | **18** |

**Mais da metade da matriz está fechada.** R1 fechou quatro linhas (S-01 a S-04) e
abriu-e-fechou uma quinta: **S-04b**, o protagonismo da fotografia. Ela não existia porque
nenhum documento cobrava a relação de área entre a categoria prioritária e o conjunto das
secundárias — e era ela, não a densidade de texto, que fazia a frente comercial principal
ler como grade. Fica registrada para que a mesma conta seja feita em R6
(`#industria-do-inox`), que também tem uma fotografia protagonista e um conjunto de apoio.

**S-04b foi aplicada em R2, e `#projetos` passou.** Medido em `f418ab0`, a protagonista
tinha **1,9×** a área de todo o apoio somado em 1440 (2,6× em 1920) — o oposto do defeito
que R1 encontrou em `#equipamentos`. Depois de R2 a razão é **1,6×**, porque a frisa ganhou
largura e altura; continua protagonista folgada, e o teste da miniatura confirma no visual.
Em 320/390 a razão é **0,5×**, e ali a protagonista se distingue por ser **a única
fotografia que toca as duas bordas** — em coluna única a soma de três apoios empilhados
sempre excede uma imagem só, e o critério que vale no telefone é o visual, não a soma.

**R2 não recompôs nada.** O inventário mostrou silhueta D já existente e três dos seis
tetos já cumpridos; o briefing §29 manda, nesse caso, fechar delta pontual e congelar. Foi
o que se fez: amarelo 6 → 3, frisa alinhada à faixa fotográfica (+4,4 pontos de área, custo
zero de altura) e corte de folga vertical real. **Pela terceira rodada seguida o baseline
histórico da matriz estava velho** — S-08 em R0-D, os números de `#equipamentos` em R1 e
agora os três de `#projetos`. A regra do topo desta seção (remedir antes de cobrar o teto)
não é precaução: é o caso comum.

Fechados em R0-A: **G-1**, **G-1b**, **G-2** e **D-3** (que é G-2 aplicado à dobra).
Fechados em R0-B: **D-1**, **D-2**, **D-4** e **D-5**.
Fechados em R0-C: **H-1**, **H-2**, **H-3** e **H-4**. Aberto por R0-C: **G-6**.
Fechados em R0-C.1: **G-6**.
Fechados em R0-D: **S-08**, **S-15** e **S-31**.
Fechados em R1: **S-01**, **S-02**, **S-03** e **S-04**. Aberto e fechado por R1: **S-04b**.
Fechados em R2: **S-05**, **S-06** e **S-07**.

**Todos os sistemas globais estão conformes** — G-1, G-1b, G-2 e G-6 fechados; G-3 e G-4
já eram. Sobra **G-5** (orçamento de cor), que é contagem por seção e vive nas fichas.
É o pré-requisito de doc 04 §4.1.2 para congelar seção, e ele está cumprido.

**A hero** tem zero delta aberto e selo `CONGELADA` (ficha em `03-BLUEPRINT-HOME.md` §2).
**O cabeçalho** fechou os quatro dele e está `CONGELADO DEFINITIVAMENTE`, sem dependência.
**`#pilares`, `#transicao` e `#fechamento`** fecharam os três de R0-D e receberam selo
`CONGELADA` nas fichas 4, 7 e 13.

**`#equipamentos`** fechou os quatro dela mais S-04b e recebeu selo `CONGELADA` na ficha 2.

**`#projetos`** fechou os três dela (S-05, S-06, S-07) e recebeu selo `CONGELADA` na
ficha 3.

**A R0, a R1 e a R2 estão encerradas.** Nada sobra na fase de conformidade: sistemas
globais, hero, cabeçalho, sistema de botões e as três seções de R0-D estão conformes e
selados; a frente comercial principal está recomposta e congelada; e a prova fotográfica
principal está conforme e congelada. O que resta na matriz pertence a R3–R7, e a próxima é
**R3 — orçamento de cor + motion global**.

**Zero P0.** Nenhum delta bloqueia publicação — o produto no ar é funcional, acessível e
sem dado inventado. Os itens restantes são distância entre o que está no ar e o que a norma
pede.

### P1 por rodada

| rodada | P1 |
| --- | ---: |
| **R0-A** | ~~2 — G-2/D-3, e os globais G-1/G-1b~~ **fechados** |
| **R0-B** | ~~2 — D-1, D-2~~ **fechados** |
| **R0-C** | ~~1 — H-1~~ **fechado** |
| **R0-D** | 0 — os três deltas dela (S-08, S-15, S-31) são P3, e **fecharam** |
| **R1** | ~~1 — S-01~~ **fechado** |
| **R2** | ~~1 — S-05~~ **fechado** |
| R3 | 1 — S-26 |
| R4 | 1 — S-11 |
| R6 | 1 — S-16 |
| R7 | 1 — MB-1 |

### Cobertura

Toda regra normativa dos documentos 01 e 03 com delta identificado tem rodada
responsável. **Nenhuma linha desta matriz está sem dono.**

---

## 6. Como manter

- um delta fechado é **riscado, não apagado** — o histórico é o que impede reabrir por
  engano;
- um delta novo entra com id, norma violada, medição e rodada. **Sem norma nomeada não é
  delta, é preferência** (documento 04 §3.3);
- ao fechar todos os deltas de uma seção, a ficha correspondente do documento 03 recebe
  o selo `CONGELADA` com data e commit.
