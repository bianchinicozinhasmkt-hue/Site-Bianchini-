# Hero refinada e fluxo comercial da Home — 2026-08-05

Rodada de duas frentes sobre o candidato V1 já validado. Sem redesign, sem reescrita de
conteúdo confirmado, sem refatoração ampla. Publicação e configurações externas ficaram
deliberadamente fora (ver [`04-pendencias-externas.md`](./04-pendencias-externas.md)).

---

## Frente 1 — Seletor de pilares da Hero

### Problemas confirmados por medição

Medido no build de produção, antes de qualquer alteração:

| Sintoma do briefing | Medida |
| --- | --- |
| Numeração repetida | `01/02/03` renderizado **4×** por estado (1 na identificação + 3 nos botões), mais o texto "Pilar 01 de 03" — a mesma informação em **5 lugares** |
| Aparência de tabela | moldura externa + `divide-x`/`divide-y` internos + preenchimento por item + fileira separada para as setas |
| Estado ativo pesado | bloco grafite cheio, com 4 sinais somados |
| Altura excessiva | **162px** em 1586 · **135px** em 1366 · **373px** em 390 |
| Pilar ativo tarde demais | módulo em y=718 numa dobra de 80–992 — o quarto inferior, depois dos CTAs e das métricas |
| Setas apagadas | ícone de 17px dentro de célula com divisória dos dois lados |

### O que foi feito

**O módulo foi partido em dois.** `renderPillarMark` (identificação) subiu para entre a
etiqueta institucional e o título; `renderPillarNav` (navegação) continua fechando a
coluna, mas leve.

**Numeração: uma vez só.** Saiu dos três botões e do texto "Pilar 01 de 03"; ficou no
marcador, onde ordena a leitura sem repetir o que os rótulos dizem.

**Seletor sem caixas.** Saíram moldura, divisórias e preenchimento. Sobrou **uma régua
compartilhada** sob o conjunto inteiro — setas e rótulos assentam na mesma base. Ativo por
três sinais somados, um deles não-cromático: peso (600→700), contraste (`muted`→`ink`) e
régua de 2px sobre a linha-base. Em fundo claro a régua é **grafite**, não amarelo.

**`context` saiu da coluna clara no desktop.** Título, lead, `context` e o bloco editorial
sobre a fotografia diziam a mesma coisa quatro vezes na mesma dobra. O campo **continua em
`hero-slides.ts`** — copy real não se apaga — e segue em uso no mobile, onde não há segunda
coluna. O texto editorial sobre a foto foi preservado integralmente.

**Setas legíveis.** 44×44 exatos, quadradas, mesma geometria nos dois sentidos, ícone de
17→19px, hover/`focus-visible`/`active`. No desktop ficam nas duas pontas da régua; no
mobile, em fileira própria à direita.

### Antes / depois — medido

| | antes | depois |
| --- | --- | --- |
| Numerais visíveis por estado | 4 (+1 em texto) | **1** |
| Altura da navegação — 1586 | 162px | **46px** |
| Altura da navegação — 1366 | 135px | **45px** |
| Altura da navegação — 1024 | — | **45px** |
| Altura do módulo — 390 | 373px | **282px** |
| Y do marcador — 1366 | 605 (abaixo das métricas) | **166** (antes do título, y=194) |
| Alvo das setas | 44×44 | 44×44 (mantido) |
| Layout shift ao trocar pilar | — | **CLS 0 · título 0px · nav 0px** |

`grid-cols-3` foi mantido justamente para isso: a célula é um terço fixo, então engrossar o
rótulo ativo não desloca os vizinhos.

### Duas montagens, por medida

"EQUIPAMENTOS" é uma palavra só e pede **77px** em Oswald — é o gargalo de todas as contas.

- **Desktop, setas na mesma fileira.** Em 1024px (pior caso) a faixa tem ~346px; menos duas
  setas de 44px sobram **86px por célula**. Antes não cabia (65px) porque divisórias e
  `px-2.5` comiam a diferença — por isso as setas precisavam de uma fileira própria entre
  1024 e 1279px. Sem elas, cabe, e a fileira extra deixou de existir.
- **Mobile, setas em fileira própria.** Inline, em 320px sobrariam **64px por célula** —
  13px abaixo do necessário, e `break-words` voltaria a partir o glifo. Com a fileira de
  rótulos ocupando a largura inteira, cada célula fica com **93px**.

---

## Frente 2 — Fluxo comercial da Home

### Ordem anterior — e o problema

`#projetos` abria em **y=6766 de 15.914px — 42% da página**. A prova principal chegava
depois de sintomas, transição, diagnóstico, cinco níveis de atuação, três pilares e o
dossiê dos dois responsáveis.

| # | seção | y | | # | seção | y |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | hero | 0 | | 8 | **projetos** | **6766** |
| 2 | sintomas | 768 | | 9 | leonardo | 8330 |
| 3 | transição | 1656 | | 10 | método | 9666 |
| 4 | diagnóstico | 2428 | | 11 | equipamentos | 10947 |
| 5 | atuação | 3515 | | 12 | indústria do inox | 12466 |
| 6 | pilares | 4458 | | 13 | credibilidade | 13381 |
| 7 | quem conduz | 5305 | | 14 | CTA final | 14448 |

### Nova ordem — medida

| # | seção | y | função comercial |
| --- | --- | --- | --- |
| 1 | hero | 0 | o que entrega + os três pilares |
| 2 | sintomas | 768 | o problema que o visitante reconhece |
| 3 | transição | 1656 | o sistema: da leitura à entrega instalada |
| 4 | pilares | 2428 | as três frentes desse sistema, nomeadas |
| 5 | **projetos** | **3275** | **a prova — operações construídas** |
| 6 | diagnóstico | 4839 | como as decisões são tomadas |
| 7 | quem conduz | 5926 | quem responde pela operação |
| 8 | método | 7388 | como o trabalho acontece |
| 9 | leonardo | 8669 | a autoridade que sustenta o método |
| 10 | atuação | 10005 | os cinco níveis; ponte para equipamentos |
| 11 | equipamentos | 10947 | consequência do projeto, não catálogo |
| 12 | indústria do inox | 12466 | a frente para fabricantes |
| 13 | credibilidade | 13381 | reconhecimento, depois de mostrar o trabalho |
| 14 | CTA final | 14448 | solicitar diagnóstico |

**Projetos: de 42% para 20,6% da página** (y 6766 → 3275).

### Justificativa das três decisões não óbvias

**Projetos em 5, e não logo após o hero.** Aberto sem contexto, o acervo lê como galeria.
Nas posições 2–4 o visitante já reconheceu o problema, entendeu que existe um sistema que
vai da leitura à instalação e viu as três frentes nomeadas — então as fotos passam a ser
evidência de método, não portfólio.

**`atuação` desceu de 5 para 10.** Detalha cinco níveis de serviço: é aprofundamento, não
prova, e vinha antes dos projetos. Em 10 vira a ponte para equipamentos, que é o nível
seguinte de detalhe.

**`quem conduz` e `leonardo` não ficam coladas.** São duas seções sobre as mesmas pessoas;
adjacentes, a segunda lê como repetição. O método entre elas dá função a cada uma.

### A restrição que limitou a ordem

As seções escuras somam quase metade da página. Três seguidas produzem a mancha escura sem
transição que a composição não pode ter. A ordem final mantém **exatamente dois pares
escuros adjacentes** — `sintomas`+`transição` e `equipamentos`+`inox` —, o mesmo número da
ordem anterior. Foi essa conta, e não preferência narrativa, que manteve `atuação`
(surface) entre `leonardo` e `equipamentos`: as alternativas que agrupavam autoridade e
equipamentos produziam **quatro** seções escuras seguidas.

### Redundâncias — o que foi condensado e o que foi preservado

| Repetição | Decisão |
| --- | --- |
| `context` (coluna) × `detail.text` (foto) × lead do slide | **condensada**: `context` sai do desktop; campo e texto preservados no dado e no mobile |
| numeração do pilar em 5 lugares | **condensada** para 1 |
| `quem conduz` × `leonardo` (mesmas pessoas) | **preservadas**, com função distinta, separadas pelo método |
| `pilares` (3) × `atuação` (5 níveis) | **preservadas**: são recortes diferentes — frentes comerciais × níveis de serviço |
| `processSteps` × `methodSteps` | **preservado sem alteração** — decisão pendente, ver backlog V2 |

Nenhum dado, número ou copy confirmada foi apagado.

### Header — remedido, não deduzido

A reordenação quebrou a ordem do menu: "Empresa" (5.926px) vinha antes de "Projetos"
(3.275px), e o clique passaria a **subir 2.651px**.

| antes (quebrado) | | depois (corrigido) | |
| --- | --- | --- | --- |
| Soluções | 2.428 ↓ | Soluções | 2.428 ↓ |
| Empresa | 5.926 ↓ | **Projetos** | **3.275 ↓** |
| Projetos | 3.275 **↑** | **Empresa** | **5.926 ↓** |
| Método | 7.388 ↓ | Método | 7.388 ↓ |
| Equipamentos | 10.947 ↓ | Equipamentos | 10.947 ↓ |

Só a posição mudou; rótulos e destinos não. `mobileNav` é o mesmo array, então o menu do
telefone acompanha automaticamente.

---

## Validação — contra build novo

`BUILD_ID` `uCpKuTBaBOuhAPdoOLL1B`, servidor confirmado em `Ready in 3s` e HTTP 200.

| | resultado |
| --- | --- |
| `type-check` / `lint` / `build` | **limpos** |
| HTTP | **200** em 9 rotas |
| Overflow horizontal | **0** em 11 viewports (1920→320) |
| Âncoras do header em Y crescente | **true** em todos os viewports |
| Âncoras sem destino | nenhuma |
| `h1` por página / saltos de nível | 1 / 0 |
| `alt` ausente / imagens quebradas | 0 / 0 |
| Numeração da Hero | **1** ocorrência, em todos os viewports |
| `role="tab"` sem `aria-controls` válido | 0 |
| **CLS na troca de pilar** | **0** — título 0px, navegação 0px |
| `prefers-reduced-motion` | 0 animações rodando · 0 em laço · cortina `display:none` · foto do hero visível · pilares visíveis |
| Erros de console | **0** |

Alvos abaixo de 44px que permanecem: o CTA do cabeçalho (40px, só ≥1024px, contexto de
mouse, proporção documentada) e três links dentro de frase, isentos por regra.

### Limitações da validação

- **Medição rápida gera falso positivo.** Duas vezes nesta rodada um alerta desapareceu ao
  refazer a medida com espera adequada: `.reveal` "preso" (rolagem a 55ms/passo) e uma
  "imagem quebrada" em 4 viewports mobile — com 2,5s de espera, **0 imagens quebradas e 0
  respostas HTTP ≥400**. Nenhum dos dois é defeito do site.
- Swipe não foi exercitado por evento de toque real, apenas preservado no código.
- Contraste não foi remedido nesta rodada; a paleta do seletor não introduziu cor nova
  além do grafite já em uso.

## Capturas

- Hero, 3 pilares × 4 viewports (1586, 1366, 1024, 390): `docs/v1-release/capturas/hero/`
- Faixa de pilares no mobile: `capturas/hero/hero-390x844-faixa-pilares.png`
- Fluxo da Home, 10 pontos × 2 viewports: `docs/v1-release/capturas/fluxo/`
- Mapa de posições: `capturas/fluxo/mapa-de-posicoes.md`
