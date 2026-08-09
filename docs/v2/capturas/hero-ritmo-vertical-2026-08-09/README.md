---
STATUS: EVIDÊNCIA
tipo: correção de ritmo vertical (remoção dos pisos de altura)
partida: 9e5187d
branch: v2
data: 2026-08-09
---

# Hero V2 — a linha fantasma saiu do bloco de texto

Build de produção. Uma única mudança de comportamento: os dois pisos de altura
do bloco textual foram removidos.

## 1. A causa

O `h1` tinha `min-h-[3.3em] lg:min-h-[3.15em]` e a intenção
`min-h-[4.5em] lg:min-h-[4.8em]`. Existiam por um motivo real — sem eles, a
versão de 2026-08-08 movia o `h1` em até 86px por troca. Travando a caixa no
pior caso, a moldura ficava parada.

O custo era uma **linha fantasma dentro do bloco de texto**, e as três copies não
rendem o mesmo número de linhas:

| viewport | estado | linhas do `h1` | linhas da intenção |
| --- | --- | --- | --- |
| 1920 / 1440 | equipamentos | 3 | 3 |
| 1920 / 1440 | projetos | 3 | **2** |
| 1920 / 1440 | consultoria | **2** | 2 |
| 1024 | os três | 4 | 3 |
| 390 | os três | 4 | 4 |

Em 1024 e 390 as três copies rendem igual, então **os pisos nunca mordiam ali** —
o defeito era exclusivamente de desktop.

## 2. Medições — antes

Gap real do fim do texto do `h1` até o topo do parágrafo, e reserva não usada:

| viewport | estado | `h1` caixa | `h1` texto | **gap real `h1`→parágrafo** | reserva na intenção |
| --- | --- | --- | --- | --- | --- |
| 1920 | equipamentos | 182,7 | 3 linhas | **11,9px** | 4,8 |
| 1920 | projetos | 182,7 | 3 linhas | **11,9px** | **33,6** |
| 1920 | consultoria | 182,7 | 2 linhas | **72,8px** ← | **33,6** |
| 1440 | equipamentos | 154,2 | 3 linhas | **12,4px** | 4,8 |
| 1440 | projetos | 154,2 | 3 linhas | **12,4px** | **33,6** |
| 1440 | consultoria | 154,2 | 2 linhas | **63,8px** ← | **33,6** |
| 1024 | os três | 159,6 | 4 linhas | 14,9px | 4,8 |
| 390 | os três | 133,8 | 4 linhas | 12,5px | 1,5 |

Em Consultoria a 1920, 60,9px a mais que nos outros dois — exatamente uma linha
de título. E a intenção carregava um segundo fantasma de 33,6px em Projetos e
Consultoria, este entre o parágrafo e os CTAs.

## 3. Solução aplicada

**Os dois pisos foram removidos, e nada mais.** O `#hero-painel` continua com
`items-center` — e é essa centragem que absorve a diferença de altura.

Sem pisos, a coluna passa a ter altura natural, que varia entre estados. Medido
em 1920: equipamentos 433,5px, projetos 404,7px, consultoria 343,8px — 89,7px
entre o mais alto e o mais baixo. Essa diferença tem de ir para algum lugar, e
havia duas escolhas:

| estratégia | deslocamento da etiqueta/`h1` | deslocamento do par de CTAs |
| --- | --- | --- |
| piso na coluna, conteúdo no topo | 0px | **89,7px** |
| **centragem no palco** (mantida) | 44,8px | **44,8px** |

A centragem é o ótimo: nenhum elemento anda mais que metade do que andaria na
outra. O briefing nomeia os dois absorvedores aceitáveis — "espaço flexível
entre bloco principal e seletor" e "distribuição vertical do palco" —, e a
centragem é exatamente o segundo: metade da sobra vai para cima da etiqueta,
metade para o vão entre os CTAs e o seletor.

Ancorar o topo foi descartado justamente porque dobraria o deslocamento do par
de botões, e o briefing pede que o WhatsApp não se mova de forma brusca.

**Nenhuma contagem de linha a remedir daqui para frente.** Era a tabela dos
pisos que obrigava a remedir a cada mudança de copy; mudar o texto agora só muda
onde o bloco se centra.

## 4. Medições — depois

| viewport | estado | **gap real `h1`→parágrafo** | reserva na intenção | etiqueta (topo) | CTA (topo) | seletor (topo) | Hero |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1920 | equipamentos | **11,9px** | 4,8 | 331,7 | 697,7 | 928 | 1080 |
| 1920 | projetos | **11,9px** | 4,8 | 346,1 | 683,3 | 928 | 1080 |
| 1920 | consultoria | **11,9px** | 4,8 | 376,6 | 652,8 | 928 | 1080 |
| 1440 | equipamentos | **12,4px** | 4,8 | 216,8 | 554,3 | 777,6 | 900 |
| 1440 | projetos | **12,4px** | 4,8 | 231,2 | 539,8 | 777,6 | 900 |
| 1440 | consultoria | **12,4px** | 4,8 | 256,9 | 514,2 | 777,6 | 900 |
| 1024 | os três | 14,9px | 4,8 | 134 | 468,8 | 687 | 830 |
| 390 | os três | 12,5px | 1,5 | 394,8 | 702,8 | 850,8 | 914,8 |

O gap `h1`→parágrafo é **idêntico nos três estados** em cada viewport, e a
reserva morta na intenção caiu de 33,6 para 4,8px (o que sobra é a folga natural
da entrelinha, não uma linha reservada).

**O que não mudou:** a altura da Hero (1080 e 900, exatas), a posição do seletor
(928 e 777,6), e 1024 e 390 byte a byte — lá os pisos não mordiam.

## 5. Troca entre estados

Sequência Equipamentos → Projetos → Consultoria → Equipamentos, gravada em
`video/` nos três viewports.

- os persistentes **sobrevivem às três trocas** nos três viewports: CTA
  primário, CTA de WhatsApp, painel, `h1`, linha de ação e seletor;
- opacidade mínima **1** em todos eles, amostrada a cada 25ms;
- **o WhatsApp não muda de x nem de largura** em nenhuma troca (1920:
  x=642 / 266,8 nas três; 1440: x=402 / 266,8; 390: x=20 / 228,1). Ele acompanha
  o bloco na vertical, junto com todo o resto da coluna;
- zero requisição de imagem após o clique em 1920 e 1440 (em 390, uma — e não é
  cena da Hero: é de uma seção V1 que entra na janela quando o clique rola a
  página);
- nenhum `key` novo em wrapper.

Os quadros `t000ms` são o instante do clique — o mais desfavorável — e neles a
estrutura está inteira.

## 6. Mobile e 1024

Intocados, e isso é verificável: os pisos não mordiam ali porque as três copies
rendem o mesmo número de linhas. Medido antes e depois, `1024` e `390` dão
exatamente os mesmos números em todos os campos — mesma altura de Hero, mesmo
gap, mesma posição de etiqueta, CTA e seletor. Overflow 0 nos dois.

## 7. Testes

`npm run lint` limpo · `npm run type-check` limpo · `npm run build` passa.

| viewport | overflow | console | HTTP ≥ 400 | imagens quebradas |
| --- | --- | --- | --- | --- |
| 1920 / 1440 / 1024 / 390 | 0 | 0 | 0 | 0 / 72 |

Contraste remedido nos dois elementos que mudaram de posição — o bloco de
Consultoria desceu 44,8px em 1920:

| | pior caso nas três cenas |
| --- | --- |
| `h1` (canvas cheio) | 5,61–13,33:1 |
| parágrafo (`canvas/85`) | 6,92–10,25:1 |

Teclado: `→` percorre e dá a volta, `End`/`Home` nas pontas, foco e seleção
juntos. `prefers-reduced-motion`: a subida da porta ativa e o avanço da seta
caem para `none`; régua, peso e cor permanecem.

## 8. Pendência mantida

**Projetos continua bloqueado por ausência de asset compatível no acervo.** Não
tocado nesta rodada.

## Índice

```
antes-depois/
  antes-1920-consultoria-bloco.png    ← o vazio entre o h1 e o parágrafo
  depois-1920-consultoria-bloco.png   ← o mesmo recorte, corrigido
  depois-1920-consultoria-dobra.png

estados/
  hero-1920-equipamentos.png · hero-1920-projetos.png · hero-1920-consultoria.png
  hero-1440-equipamentos.png · hero-1440-consultoria.png
  hero-1024-consultoria.png
  hero-390-equipamentos.png  · hero-390-consultoria.png

sequencia/   (1920 — instante do clique e assentado)
  1920-00-partida-equipamentos.png
  1920-0{1,2,3}-<estado>-t{000,400}ms.png

video/
  troca-1920x1080.webm · troca-1440x900.webm · troca-390x844.webm
```

Em 1440 e 390 a sequência é só o vídeo: os quadros seriam redundantes com os de
1920 (1440) ou com um viewport provadamente inalterado (390).
