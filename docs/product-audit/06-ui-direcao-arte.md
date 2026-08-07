# 06 — UI e direção de arte

Avaliação feita sobre as capturas em `screenshots/`, com valores lidos do CSS
computado do build.

## 1. O sistema visual atual

| dimensão | estado |
| --- | --- |
| paleta | grafite `#101010` · canvas `#EFEDEB` · surface `#FFF` · canvas-deep `#E6E3DE` · amarelo `#F5C64B` · muted `#5B6065` · line `#DCD9D4` · steel `#8C9095` (decorativo) |
| tipografia | duas famílias com papéis fixos: **Manrope** (leitura, títulos, interface) e **Oswald** (rótulo comercial/técnico curto). Nenhuma serifada |
| escala | `display`, `title-1..3`, `lead`, `body`, `body-sm`, `caption`, `eyebrow`, `numeral` — registradas no `tailwind-merge` |
| espaçamento | `Section` com 4 níveis (`xs`/`sm`/`default`/`lg`); container 1400px + gutter 20/32/40 |
| grid | 12 colunas em `lg`, com padrões recorrentes 7/4, 5/6, 5/7 |
| superfícies | 5 tons de fundo, alternados por seção |
| bordas | hairline `1px` `--line` no claro, `white/12–20` no escuro |
| sombras | quase ausentes: `shadow-cta` nos botões e uma sombra de painel em `#metodo`. Correto para o registro industrial |
| fotografia | acervo real, sem banco de imagem. Enquadramentos consistentes |
| recortes | diagonal do hero em dois momentos (primeira dobra e CTA final), como o teto exige |
| contraste | ver `09-acessibilidade.md` §2 |

## 2. O site transmite o que precisa transmitir?

| atributo | nota | evidência |
| --- | --- | --- |
| precisão industrial | **4/5** | cotas no blueprint removido, `.drafting-paper` sob a planta, `TickRule`, numeração de nível, léxico técnico correto (RDC 216, comissionamento, memorial descritivo) |
| inteligência operacional | **4/5** | o argumento "especificado pelo volume real, não pela ficha técnica" é estrutural, não decorativo |
| presença premium | **4/5** | grafite + amarelo + fotografia grande + tipografia condensada nos rótulos. A primeira dobra sustenta comparação com qualquer site do setor no Brasil |
| experiência em food service | **5/5** | os seis sintomas de `#sintomas` só podem ter sido escritos por quem esteve dentro de uma cozinha em pico |
| confiança | **3/5** | logos e depoimentos reais, mas sem dado legal, sem caso e com a prova principal a 84% da página |
| capacidade de coordenação | **2/5** | é a promessa central e a menos demonstrada — ver `01-estrategia-produto.md` §3 |

## 3. Sinais de template — varredura

| sinal | presente? | evidência |
| --- | --- | --- |
| template de IA | **não** | nenhuma composição se repete entre seções; o mapa de composição de `page.tsx` é real e foi verificado nas capturas |
| PDF convertido em site | **quase, num ponto** | as três "entregas" do painel de `#atuacao` são três caixas cinza empilhadas com texto (`screenshots/desktop/10-atuacao-1440.png`) — é a única passagem que lê como documento colado |
| excesso de cards | **não** | `#pilares` usa moldura única com `gap-px`, não cartões soltos |
| excesso de caixas | **contido** | a remoção das caixas do seletor do hero (2026-08-05) foi a correção certa |
| sequência "texto + linha" | **não** | `TickRule` e `TechLabel` são usados com parcimônia |
| foto de um lado, texto do outro, repetido | **parcial** | `#quem-conduz` usa espelhamento nas duas pessoas; `#metodo` e `#equipamentos` variam a composição. Aceitável |
| grade decorativa | **não** | `.grid-lines` foi removida; sobrou `.drafting-paper` sob a planta real |
| startup genérica | **não** | nenhum gradiente colorido, nenhuma ilustração, nenhum ícone de linha decorativo |
| catálogo antigo | **não** | nenhum preço, nenhum SKU, nenhuma tabela de produto |
| agência criativa | **não** | nenhuma tipografia expressiva, nenhum "case study" de marketing |

**Conclusão:** o vocabulário visual está limpo. O trabalho da terceira passagem
(`docs/RELATORIO_TERCEIRA_PASSAGEM_HOME.md`) resolveu de fato a aparência de
template, e os tetos de `CLAUDE.md` continuam sendo cumpridos no build.

## 4. Problemas visuais e o impacto de cada um

### 4.1 Legenda branca ilegível sobre fotografia clara — `#atuacao`

`scope-section.tsx:265`, `<p class="absolute inset-x-4 bottom-4 … text-white">`.
Medido: **1,28:1**. Confirmado a olho em `screenshots/desktop/10-atuacao-1440.png`
— a frase "Capacidade instalada contra volume real…" desaparece sobre o inox
iluminado.

- compreensão: **alta perda** — é a legenda que explica o que a fotografia prova
- confiança: perda — texto ilegível lê como descuido
- percepção de valor: perda
- **Correção:** o scrim (`from-graphite/90`, `h-2/5`) não alcança a densidade
  necessária nesse enquadramento. Ou o scrim vira sólido atrás do texto (como já
  se faz no hero), ou a legenda sai de cima da foto.

### 4.2 Índices e rótulos inativos abaixo de 4,5:1

Cinco ocorrências, todas com o mesmo padrão `text-ink/45` ou `canvas/35`:

| onde | medido | papel |
| --- | --- | --- |
| `#pilares` "01/02/03" | 3,05:1 | índice com significado |
| `#diagnostico` "01" | 2,91:1 | índice de etapa |
| `#sintomas` "02" | 2,86:1 | índice de capítulo |
| `#atuacao` "Projeto e engenharia" | 3,05:1 | **rótulo de controle de navegação** |
| rodapé, copyright | 4,05:1 | texto legal |

O quarto é o mais grave: é o nome de um nível **clicável**. Um controle cujo
rótulo não passa em AA é um controle que parte dos visitantes não consegue ler
antes de decidir clicar.

- compreensão: perda média
- modernidade: **nenhuma perda** — subir de `/45` para `/60` não muda a estética,
  só o valor de luminância
- diferenciação: nenhuma

### 4.3 Duas etiquetas empilhadas no topo da coluna do hero

"COZINHAS INDUSTRIAIS E FOOD SERVICE" seguida de "03 — OPERAÇÃO COMERCIAL", as
duas em Oswald caixa alta com hairline amarela. A intenção (geral → específico)
está documentada e é defensável, mas visualmente são **dois rótulos do mesmo
registro tipográfico a 14px de distância** — o segundo lê como continuação do
primeiro, não como marcador de estado.

- impacto: **baixo**. É refinamento, não defeito. Registrado como preferência
  estética discutível, não como problema.

### 4.4 O bloco editorial da direita do hero repete a coluna esquerda

Ver `03-arquitetura-informacao.md` §5. Impacto em **percepção de valor**: a
metade nobre da primeira dobra é gasta em paráfrase.

### 4.5 Três caixas cinza em `#atuacao`

Os entregáveis de cada nível são três retângulos `bg-canvas-deep` idênticos,
empilhados. É a única passagem do site que lê como slide de apresentação.
Impacto: **baixo-médio** em modernidade. Alternativa registrada: lista com
hairline, sem preenchimento — o mesmo movimento já feito no seletor do hero.

## 5. Fotografia — avaliação

**Força.** Todo o acervo é real. Não há banco de imagem, não há render passando
por foto na home, os enquadramentos são consistentes (inox, luz quente, planos
médios) e a calibragem de cor do hero (`feComponentTransfer` casado com o mockup)
é um cuidado que quase nenhum site do setor tem.

**Três limitações:**

1. **Nenhuma fotografia tem pessoa trabalhando.** Todas as cozinhas estão vazias.
   Para uma empresa cujo argumento é "projetar para a operação real", a ausência
   da operação em curso é uma contradição visual. Os únicos humanos do site são
   os dois retratos de liderança.
2. **Render e documento não são rotulados** (`projeto-3d.jpg`,
   `planta-executiva.jpg`). Em `/projetos` eles aparecem junto de fotografia de
   entrega.
3. **Reuso pesado.** `linha-de-coccao.jpg` aparece no hero (slide 02), em
   `#equipamentos` e em `/projetos`. `show-cooking.jpg` aparece em `#atuacao`
   nível 05, em `/projetos` e em `consultingPage`. Visualmente não incomoda;
   tecnicamente custa banda (ver `10` §3).

## 6. Ritmo e densidade

- **Alternância de fundo:** confirmada correta — dois pares escuros adjacentes,
  exatamente o teto.
- **Densidade:** alta e uniforme. Quatorze seções, nenhuma respirando muito mais
  que as outras. Falta um **momento de silêncio** — uma faixa curta, quase vazia,
  antes da conversão. Hoje `#credibilidade` (1.067px, cheia) encosta direto no CTA
  final.
- **Comprimento:** 15.947px no desktop é longo mas defensável para página única.
  **26.304px no mobile não é** — ver `08-motion-responsividade.md` §4.

## 7. Benchmark interno de modernidade

Critérios próprios da Bianchini — não uma checklist de tendências. A nota é
**instrumento de priorização**, não verdade objetiva: serve para ordenar o
esforço, não para declarar qualidade.

| critério | nota | evidência |
| --- | --- | --- |
| **clareza** | **4/5** | em segundos o visitante sabe setor e serviço; perde ponto pelas seis taxonomias sobrepostas (`03` §6) |
| **precisão** | **5/5** | geometria medida em `--u`, cotas, léxico técnico correto, zero número inventado. É o traço mais forte do produto |
| **estrutura** | **4/5** | 14 seções com função distinta e composição não repetida; perde ponto pela home mobile de 26.304px |
| **profundidade** | **3/5** | as páginas de solução têm 12 entregáveis e FAQ real; a home fica na superfície de tudo |
| **fotografia** | **4/5** | acervo real, enquadramento consistente, calibragem de cor casada com o mockup; perde ponto por não haver operação em curso nem rótulo de render |
| **interação** | **4/5** | quatro padrões de aba com teclado completo, troca de conteúdo coordenada, foco visível; perde ponto pelo autoplay sem pausa |
| **ritmo** | **4/5** | alternância de fundo controlada, nenhuma dupla de seções com o mesmo esqueleto; falta um momento de silêncio antes da conversão |
| **confiança** | **3/5** | logos e depoimentos reais, mas sem dado legal, sem caso e com a prova social a 84% da página |
| **capacidade técnica** | **5/5** | 0 erro, 0 overflow em 11 viewports, CLS 0 na home, `prefers-reduced-motion` completo, 103 kB de JS compartilhado |
| **presença humana** | **2/5** | dois retratos de liderança e nenhuma pessoa em nenhuma das 75 imagens da home. Numa empresa que vende leitura de operação, a operação não aparece |
| **coerência comercial** | **3/5** | posicionamento sólido e três recusas cumpridas; mas 8 CTAs idênticos, um pilar sem destino e prova que não prova coordenação |

**Média 3,7/5.** A distribuição importa mais que a média: **precisão e
capacidade técnica em 5, presença humana em 2, confiança/profundidade/coerência
comercial em 3.**

Leitura: o produto é **tecnicamente excelente e comercialmente incompleto**. Todo
esforço de V1.1/V2 deve ir para os critérios de nota 2 e 3 — que são, sem
exceção, questões de **conteúdo, prova e ligação**, não de interface. Investir
mais em precisão ou em capacidade técnica seria melhorar o que já está no teto.

## 8. Preferência estética × problema real

Para não confundir as duas coisas:

**Problemas reais (mensuráveis, com consequência):**
legenda a 1,28:1 · cinco pares abaixo de AA · repetição de copy no hero ·
seletor fora da dobra no mobile · autoplay sem pausa.

**Preferência estética (registrar, não priorizar):**
duas etiquetas empilhadas no hero · as três caixas cinza de `#atuacao` ·
ausência de pessoas nas fotos · falta de um respiro antes do CTA final.

Nenhum item da segunda lista entra como P1 ou P2 no backlog.
