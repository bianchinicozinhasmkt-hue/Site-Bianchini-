# 06 — Matriz de Deltas: Norma × Produto

```text
STATUS: ACTIVE — rastreamento de conformidade
DATA: 2026-08-12 (levantamento) · 2026-08-12 (R0-A implementada)
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
| **D-1** | Porta ativa: grafite **neutro** mais claro; amarelo só em régua e seta — doc 01 §9.4 | `.doorActive::before` derrama `rgba(245,198,75,0.14)` sobre base quente `rgb(70,65,51)` | superfície tingida → cáqui/oliva | `P1 · ESTÉTICA` | **R0-B** | nenhuma | zero tingimento; delta de luminância ~48pt no eixo neutro; ativo legível em escala de cinza <1s |
| **D-2** | Seletor `1,2fr / 1fr / 1fr` (faixa 1,15–1,3) — doc 01 §9.2 | `grid-template-columns: repeat(3, minmax(0,1fr))` | Equipamentos **não** tem área maior; comentário do código afirma o contrário | `P1 · COMPOSIÇÃO` | **R0-B** | nenhuma | `1.2fr 1fr 1fr` a partir de `lg`; três portas iguais abaixo de `sm`; nenhum rótulo quebra |
| ~~**D-3**~~ | = G-2, aplicado à dobra | **FECHADO em R0-A** (2026-08-12) junto com G-2 | ver a nota de R0-A | `P1 · CONVERSÃO` | **R0-A** | G-2 | ✅ ver G-2 |
| **D-4** | Sem bisel; a aresta é a régua — doc 01 §7.2, §14.2 | `.door::before` com `inset 0 2px 0 rgba(255,255,255,0.16)` + `inset 0 -2px 0 rgba(0,0,0,0.5)` | construção de bevel | `P2 · ESTÉTICA` | **R0-B** | nenhuma | sem realce superior; régua de 2/3px permanece o único desenho de aresta |
| **D-5** | Comentário descreve o código que acompanha | `hero-stage.tsx:47` mostra faixa `18 anos · Brasil` removida em 2026-08-09; `:63` afirma 1,2fr inexistente | documentação interna induz a erro | `P3 · CONTEÚDO` | **R0-B** | D-2 | comentários batem com o código |
| **H-1** | Header CTA "Solicitar orçamento" → `/contato?intencao=equipamentos` — doc 01 §17.4 | `label = 'Solicitar diagnóstico'`, `href="/contato"` | ação persistente aponta para o 3º pilar, contra DEC-001/DEC-003 | `P1 · CONVERSÃO` | **R0-C** | nenhuma | rótulo e destino conformes; **altura, proporções internas e tipografia do cabeçalho inalteradas** (a guia horizontal é G-1b, em R0-A) |
| **H-2** | Raio do sistema = 2px — doc 01 §7.1 | `rounded-[3px]` no `HeaderCta` | 1px fora do sistema | `P3 · ESTÉTICA` | **R0-C** | nenhuma | raio 2px |
| **H-3** | Preenchimento de hover por `scaleY`, origem na base — doc 01 §8 | `before:origin-left before:scale-x-0` | eixo divergente do resto do sistema | `P3 · MOTION` | **R0-C** | nenhuma | `scaleY` com origem na base |
| **H-4** | Sem sombra projetada — doc 01 §14.2 | `hover:shadow-[0_8px_16px_-10px_...]` | sombra dramática em hover | `P2 · ESTÉTICA` | **R0-C** | nenhuma | zero `box-shadow` de projeção |

---

## 3. Seções

| id | seção | regra normativa | estado atual | delta | sev. | rodada | critério de saída |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **S-01** | equipamentos | ≤1.200 caracteres, ≤12 blocos — doc 01 §4.5 | 2.443 caracteres, 26 blocos | o dobro do teto | `P1 · CONTEÚDO` | **R1** | ≤1.200 / ≤12 |
| **S-02** | equipamentos | zero card; categoria é foto+nome — doc 01 §7.3 | 5 cards | leitura de catálogo | `P2 · COMPOSIÇÃO` | **R1** | zero cards |
| **S-03** | equipamentos | altura ≤1.100px | 1.565px | +42% | `P2 · COMPOSIÇÃO` | **R1** | ≤1.100px |
| **S-04** | equipamentos | silhueta **B** (não palco, para não repetir a hero) — doc 03 §1.1 | palco (A) logo após a hero (A) | dupla consecutiva | `P2 · COMPOSIÇÃO` | **R1** | texto na guia, 65/35 |
| **S-05** | projetos | silhueta **D** friso — doc 03 §1.1 | **B**, repetindo vizinhas | corrente de editoriais | `P1 · COMPOSIÇÃO` | **R2** | silhueta D; ≥1 imagem rompendo o container |
| **S-06** | projetos | ≤4 cards, ≤6 hairlines, ≤3 amarelos | 6 cards, 9 hairlines, 8 amarelos | leitura de grade | `P2 · ESTÉTICA` | **R2** | dentro dos tetos |
| **S-07** | projetos | altura ≤1.100px; ≥70% de imagem | 1.593px; 55% | seção mais alta da página | `P2 · COMPOSIÇÃO` | **R2** | ≤1.100px, ≥70% |
| **S-08** | pilares | ≤1.200 caracteres | 1.505 | +25% | `P3 · CONTEÚDO` | **R0-D** | ≤1.200 |
| **S-09** | sintomas | ≤3 amarelos | 8 | orçamento de cor | `P2 · ESTÉTICA` | **R3** | ≤3 |
| **S-10** | sintomas | sem moldura fechada — doc 01 §7.3 | `border border-white/15` na fileira de capítulos | moldura de painel | `P3 · ESTÉTICA` | **R3** | sem borda fechada |
| **S-11** | diagnóstico | ≤6 hairlines | **12** — o maior da página | leitura de PDF | `P1 · ESTÉTICA` | **R4** | ≤6 |
| **S-12** | diagnóstico | ≤12 blocos; zero card | 20 blocos, 3 cards | densidade | `P2 · CONTEÚDO` | **R4** | ≤12, zero cards |
| **S-13** | diagnóstico | nenhuma lista com maioria inerte — doc 01 §4.2 | 6 frentes, 2 ativas e 4 esmaecidas | tabela de relatório | `P2 · UX` | **R4** | item só tem forma de item se ativo, ou todos no mesmo estado |
| **S-14** | diagnóstico | silhueta **E** sequência | **B**, repetindo `#sintomas` | dupla consecutiva | `P2 · COMPOSIÇÃO` | **R4** | silhueta E |
| **S-15** | transição | zero card | 1 card residual | contradiz a redução a fecho editorial | `P3 · COMPOSIÇÃO` | **R0-D** | zero cards |
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
| **S-31** | fechamento | ≤3 amarelos | 5 | — | `P3 · ESTÉTICA` | **R0-D** | ≤3 |

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

Atualizado em 2026-08-12, ao fim de **R0-A**.

| severidade | total | fechados | **abertos** |
| --- | ---: | ---: | ---: |
| **P0** | 0 | 0 | **0** |
| **P1** | 10 | **4** | **6** |
| **P2** | 19 | 0 | **19** |
| **P3** | 11 | 0 | **11** |
| **TOTAL** | 40 | **4** | **36** |

Fechados em R0-A: **G-1**, **G-1b**, **G-2** e **D-3** (que é G-2 aplicado à dobra).

**Zero P0.** Nenhum delta bloqueia publicação — o produto no ar é funcional, acessível e
sem dado inventado. Os itens restantes são distância entre o que está no ar e o que a norma
pede.

### P1 por rodada

| rodada | P1 |
| --- | ---: |
| **R0-A** | ~~2 — G-2/D-3, e os globais G-1/G-1b~~ **fechados** |
| **R0** (B+C+D) | 3 — D-1, D-2, H-1 |
| R1 | 1 — S-01 |
| R2 | 1 — S-05 |
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
