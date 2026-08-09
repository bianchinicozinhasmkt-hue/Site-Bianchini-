---
STATUS: EVIDÊNCIA
tipo: rodada cirúrgica (faixa inferior fora da dobra + refinamentos)
partida: dd16bbd
branch: v2
data: 2026-08-09
---

# Hero V2 — a dobra sem a faixa inferior

Build de produção em todas as capturas.

## 1. A faixa de métricas saiu da dobra

`18 anos de atuação`, `BRASIL / abrangência de atendimento` e
`Ver as seis categorias de equipamento` foram removidos da Hero. O que restou —
cabeçalho, bloco principal, par de CTAs e o seletor dos três pilares — passa a
ocupar a dobra inteira.

| viewport | altura da Hero | fecha em 100svh? |
| --- | --- | --- |
| 1920 × 1080 | **1080** | sim |
| 1440 × 900 | **900** | sim |
| 1024 × 768 | 830 | não — ver ressalva |
| 390 × 844 | 914,8 | não — mobile é fluxo |
| 320 × 568 | 852,4 | não — mobile é fluxo |

**Ressalva em 1024 × 768.** A dobra excede o viewport em 62px. Não é regressão
desta rodada — antes dela eram 915px, e a remoção da faixa devolveu 85. É o
viewport onde o conteúdo aprovado (título de 3 linhas, intenção de 3 linhas e o
par de CTAs, que **quebra em duas linhas** nessa largura) não cabe em 768px de
altura. Abaixo de `lg` a dobra é fluxo por projeto (`min-h`, não `h`), então
390 e 320 crescem pelo mesmo motivo e isso é o comportamento documentado.

### Consequências de conteúdo, registradas

- **`18 anos` continua na página** — `differentials.ts` ("18 anos dentro de
  operações de alimentação") e `credibility-section.tsx` ("ao longo de 18
  anos");
- **`Brasil / abrangência de atendimento` deixa de aparecer na home.** Era
  exibido só aqui. Nada foi inventado nem alterado: o dado continua em
  `site.ts`, agora sem consumidor na V2;
- **`Ver as seis categorias de equipamento`** apontava para `#equipamentos`, a
  seção imediatamente abaixo da dobra — como navegação, era redundante com a
  própria rolagem.

`homeHeroMetrics` e `heroSecondary` continuam exportados em `src/data/v2/home.ts`
e agora sem consumidor. Ficaram como estão: são dados, não interface morta, e
apagá-los seria mexer num arquivo fora do escopo desta rodada.

## 2. Reequilíbrio da dobra

A faixa devolveu ~96px de folga ao palco. Com `items-center`, a sobra se reparte
em partes iguais, e sem ajuste metade dela ia para o vão entre o par de CTAs e o
seletor — scrim liso, sem função. Medido em 1920 × 1080 logo depois da remoção:
234px acima da etiqueta e **205px** abaixo do CTA.

Os 96px foram divididos entre duas coisas:

- **altura do seletor** (`2xl:min-h-28 py-8` → `min-h-32 py-9`): a régua passa de
  126,4 para **152px**, e o controle ganha a presença que o briefing pede em vez
  de virar vão;
- **deslocamento do bloco** (`2xl:pt-24 pb-8` → `pt-32 pb-6`): com
  `items-center`, a diferença entre os dois vãos é exatamente `pt − pb`, então
  abri de 64 para 104px. O vão de baixo cai para **172,3px** e o de cima cresce —
  e o de cima mostra o alto da cena (coifa, luminárias), que é fotografia, não
  vazio.

Só a partir de `2xl`: medido, 1440 e 1024 não têm essa folga.

## 3. WhatsApp — subordinado ao amarelo

Terceiro passo do verde em 2026-08-09: `#25D366` → `#1DA851` → **`#2A6F44`**.

O segundo passo escureceu o verde mantendo matiz e saturação, mas manteve a
**construção**: tinta escura sobre massa clara, igual ao amarelo. Os dois
continuavam na mesma família e a hierarquia dependia só de qual era mais
luminoso.

`#2A6F44` muda a construção:

| | luminância | tinta | contraste da tinta |
| --- | --- | --- | --- |
| amarelo `#F5C64B` | 0,603 | `ink` | 11,84:1 |
| verde `#2A6F44` | **0,123** | `canvas` | **5,20:1** |

Matiz **142°** preservado (o verde do WhatsApp); saturação de 70% para 45% —
é a dessaturação que tira o "neon" sem tirar o verde. O par passa a ser
**massa clara com tinta escura** ao lado de **massa escura com tinta clara**: a
subordinação vira estrutural, não só cromática. Contra o grafite da dobra o
verde mede 3,13:1, então continua lendo como massa preenchida e recortada, não
como contorno.

URL, número, evento e comportamento inalterados: `whatsappUrl(topic)` →
`wa.me/5521995181918`.

## 4. Rótulo do seletor — do primeiro pilar para o grupo

`ESCOLHA O QUE SUA OPERAÇÃO PRECISA RESOLVER` era alinhado à guia esquerda do
`Container`, enquanto o grupo dos três pilares é um cluster **centrado** com
folga nas pontas: em 1920 a instrução começava em x=300 e a primeira trilha só
em x=352. Lia como legenda de "Equipamentos".

Duas mudanças, ambas de composição:

- **`text-center`** — o grupo já é centrado no mesmo eixo do `Container` (centro
  em x=960 nos dois), então centrar põe a instrução sobre o eixo do conjunto;
- **`sm:pt-3` → `sm:pt-6` no grupo** — só centrar trocou "legenda do primeiro
  pilar" por "legenda do pilar do meio", porque a 12px ela encostava na trilha
  central. 24px a fazem flutuar acima dos três traços sem pertencer a nenhum.

### Um custo que só a medição pegou

À esquerda, a instrução assentava onde o degradê horizontal do `.scrim` está em
0,95 — praticamente preto. No centro ele já caiu para ~0,5. Medido no pior pixel
sob a **caixa real das letras** (um `Range` sobre o nó de texto — a caixa do
`<p>` engana, porque ocupa a largura inteira do `Container` e inclui a fotografia
clara da direita, onde texto nenhum assenta):

| opacidade | pior contraste |
| --- | --- |
| 50% (valor da posição antiga) | **3,92:1 — reprova** |
| 60% | 4,92:1 |
| **65% (escolhido)** | **~5,5:1** |
| 70% | 6,09:1 |

A hierarquia contra os três nomes é carregada pelo corpo (11px `medium` contra
19px `bold`), não pela opacidade.

## 5. Presença do estado ativo

Geometria preservada: trilhas iguais, grupo centrado, vãos uniformes, lógica
ativo/inativo inalterada.

- subida da porta ativa **3px → 4px** (a trilha em 1920 passou de 128 para 152px;
  3px lia curto);
- rótulo inativo **`/75` → `/70`**, complemento inativo **`/65` → `/60`**, e o
  complemento ativo passa a `canvas` cheio. A presença do ativo é relativa:
  afastar o inativo um degrau aumenta a distância percebida sem tocar no ativo;
- o seletor inteiro ganhou 26px de altura em 1920.

Contraste remedido no pior pixel, três cenas × três viewports de desktop:

| | pior caso |
| --- | --- |
| rótulo inativo `/70` | **7,90–8,17:1** |
| complemento inativo `/60` | **6,23–6,32:1** |

## 6. A troca entre pilares não regrediu

Sequência Equipamentos → Projetos → Consultoria → Equipamentos, três viewports:
`[data-hero-cta]`, `[data-hero-cta-wa]`, o painel, o `h1`, a linha de ação e o
seletor **sobrevivem às três trocas**, com opacidade mínima 1 amostrada a cada
25ms. Copy atualiza em 46–109ms. Zero requisição de imagem após o clique em 1920
e 1440 (em 390, uma — e não é cena da Hero: é de uma seção V1 que entra na janela
quando o clique rola a página). Nenhum `key` novo em wrapper.

`[data-hero-metrics]` deixou de existir — é a faixa removida, não uma
remontagem.

## 7. Testes

`npm run lint` limpo · `npm run type-check` limpo · `npm run build` passa.

| viewport | overflow | console | HTTP ≥ 400 | imagens quebradas |
| --- | --- | --- | --- | --- |
| 1920 | 0 | 0 | 0 | 0 / 72 |
| 1440 | 0 | 0 | 0 | 0 / 72 |
| 1024 | 0 | 0 | 0 | 0 / 72 |
| 390 | 0 | 0 | 0 | 0 / 72 |
| 320 | 0 | — | — | — |

Teclado no seletor: `→` percorre e dá a volta, `End`/`Home` nas pontas, foco e
seleção juntos. Nome acessível do CTA primário continua um rótulo por estado.
`prefers-reduced-motion`: a subida da porta ativa e o avanço da seta caem para
`none`; régua, peso e cor permanecem.

## 8. Pendência mantida

**Projetos continua bloqueado por ausência de asset compatível no acervo.** Não
tocado nesta rodada.

## Índice

```
estados/
  hero-1920-equipamentos.png · hero-1920-projetos.png · hero-1920-consultoria.png
  hero-1440-equipamentos.png
  hero-1024-equipamentos.png
  hero-390-equipamentos.png · hero-390-projetos.png · hero-390-consultoria.png
  hero-320-equipamentos.png

detalhes/
  detalhe-1920-ctas.png · detalhe-1920-seletor.png · detalhe-1920-seletor-hover.png
  detalhe-1440-ctas.png · detalhe-1440-seletor.png · detalhe-1440-reduced-motion.png
  detalhe-390-ctas.png  · detalhe-390-seletor.png
```
