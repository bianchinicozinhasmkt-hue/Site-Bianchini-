---
STATUS: EVIDÊNCIA
tipo: refinamento visual (base integrada, pilares, WhatsApp)
partida: c5c23c0
branch: v2
data: 2026-08-09
---

# Hero V2 — a base integrada à cena

Três problemas, nenhum redesenho. Build de produção em todas as capturas.

## 1. A região inferior deixou de ser uma barra

**Antes** (`antes-depois/antes-1920-regiao-inferior.png`): a faixa de métricas era
**irmã do palco**, não filha — ficava fora de `[data-hero-stage]`, com `bg-graphite-deep`
sólido e `border-t` próprio. A fotografia parava numa aresta reta e começava outra
superfície. Lia em três tempos: cena → seletor → *outra barra*.

**Depois** (`antes-depois/depois-1920-regiao-inferior.png`): seletor e métricas vivem
dentro de `.base`, filha do palco. A fotografia passa por trás das duas, o degradê cai uma
vez só do topo do seletor até o fim da dobra, e o `border-t` e o `bg-graphite-deep` saíram.
Não há emenda a marcar porque não há duas superfícies.

**A dobra não cresceu** — era o requisito explícito da rodada:

| viewport | altura da Hero | região inferior (topo do seletor → base) |
| --- | --- | --- |
| 1920 × 1080 | 1080 → **1080** | 223,4 → **222,1** |
| 1440 × 900 | 900 → **900** | 207,4 → **206,1** |
| 1024 × 768 | 915 → **913,7** | 228 → **226,7** |
| 390 × 844 | 1058,3 → **1057,3** | 207,5 → **206,5** |
| 320 × 568 | 1009,3 → **1008,3** | 220,9 → **219,9** |

Em 1920 e 1440 a dobra continua fechando exatamente em `100svh`. Nos outros três a Hero já
excedia o viewport antes desta rodada e ficou **1,3px mais curta**.

### O degradê não foi reinventado — foi remapeado

As paradas do `.rail` (0,30 / 0,76 / 0,98) tinham sido medidas contra o pior pixel das três
cenas. Reaproveitá-las numa caixa quase duas vezes mais alta poria o seletor na metade
clara do degradê. Elas foram convertidas de percentual da régua para percentual da base,
preservando a mesma densidade **na mesma altura física**: 0,76 passa de 38% para 23%, e
0,97 entra a 58% — exatamente onde o seletor termina.

Remedido depois da mudança, pior pixel sob o complemento **inativo**, nas três cenas:

| viewport | equipamentos | projetos | consultoria |
| --- | --- | --- | --- |
| 1920 | 7,12:1 | 7,15:1 | 7,24:1 |
| 1440 | 7,15:1 | 7,22:1 | 7,24:1 |
| 1024 | 7,05:1 | 7,24:1 | 7,24:1 |

Todos acima do piso de 4,5:1, e com folga maior que antes.

## 2. Métricas — de dois dados soltos para um par

`detalhes/detalhe-1920-metricas.png`.

O que mudou, e por quê:

- **o fio vertical entre as duas saiu.** Separador de altura cheia entre dois itens é o que
  dá leitura de tabela — a mesma razão que tirou as divisórias do seletor em 2026-08-05;
- **um único tique amarelo** abre o par, repetindo o traço de 2px × 28px que precede a
  etiqueta no alto da dobra. É a rima que amarra a base ao topo, e é **um** sinal, não um
  por métrica;
- **proximidade:** o vão valor→rótulo fecha de 4px para 2px e o vão entre as métricas abre
  (32/48px). O tique tem vão próprio de 16px, menor que o das métricas, para ler como
  abertura do par e não como um terceiro item;
- **proporção:** o valor sobe de 1,75rem para **2rem** no desktop. Continua bem abaixo do
  `h1` (58px), então a hierarquia não se inverte.

Contraste medido: valor **16,66:1**, rótulo **5,3:1** (a 55% de opacidade — ver abaixo).

**Uma tentativa foi revertida por medição.** O rótulo tinha baixado para 50% de opacidade
para afastá-lo do valor; medido, o pior pixel punha a linha em **4,73:1** — passa em AA, mas
com margem de 0,23. A distância entre dado e unidade já vem do corpo (32px contra 11px) e do
peso; não vale gastar a margem de contraste nela. Voltou para 55%.

Nenhum número, rótulo ou claim novo entrou. Os dois pares são exatamente `homeHeroMetrics`.

## 3. CTA de categorias — o terceiro nível da hierarquia

A rodada anterior deu contorno a este alvo porque ele não se anunciava como clicável.
Resolveu, e criou o problema seguinte: com hairline amarela e cela de seta separada por fio,
ele reproduzia peça por peça a gramática dos dois CTAs da dobra. Três alvos da mesma família
na mesma tela.

Agora cada nível tem forma própria:

1. **amarelo preenchido** — ação comercial;
2. **verde preenchido** — canal de contato rápido;
3. **contorno neutro** — exploração.

O contorno passa de `yellow/45` para `white/18`, **a cela da seta e o fio saem** (era essa
peça, mais que a cor, que o fazia ler como irmão dos botões), o amarelo fica só na seta, e o
hover acende `white/[0.07]` em vez de amarelo a 12%. Largura 352,4 → **335,4px**; altura
44px preservada, que é o alvo de toque. Rótulo a **13,3:1**, seta a **12:1**.

## 4. Pilares — personalidade sem virar card

`detalhes/detalhe-1920-pilares.png`, `-hover.png`, `-focus.png`.

Geometria intocada, como pedido: trilhas iguais (352/352/352 em 1920), grupo centrado, vãos
uniformes (80 / 48 / 32 / 15,6 / 12,8), sem numeração, sem divisória vertical.

O que ganhou assinatura:

- **a régua inativa deixa de ser uniforme** — vira um traço que nasce a 20% de branco à
  esquerda e morre a 6% à direita. Deixa de ler como borda de célula;
- **a ativa fica cheia e chapada**, amarela de ponta a ponta. "Traço que morre" contra
  "traço que atravessa" é legível antes de o olho ler cor ou peso;
- **a porta ativa sobe 3px** em direção à própria régua — o sinal espacial que faltava.
  É `transform`, então não reflui a fileira nem move as outras duas;
- **a seta da ativa fica 2px à frente o tempo todo** e vai a 6px no hover: ela aponta, não
  só muda de cor. A inativa sobe de `/45` para `/55` — a 45% lia como desabilitada;
- **o complemento ativo** sobe de `/80` para `/95`. A distância de 65% para 95% é visível de
  relance; a de 65% para 80% não era.

Hover de porta inativa: régua acende em amarelo **sem engrossar**, conteúdo sobe 1px, seta
avança 4px, rótulo clareia — 200ms. Em ponteiro fino isso dura os 150ms de
`HOVER_INTENT_MS`, depois a porta vira a ativa de fato; o tratamento também cobre o teclado,
onde `:focus-visible` pode cair numa porta ainda não escolhida.

Estados computados, medidos em repouso:

| | régua | conteúdo | seta |
| --- | --- | --- | --- |
| ativo | `scaleY(1)` = 2px, amarelo sólido | `translateY(-3px)` | `translateX(2px)` |
| inativo | `scaleY(0.5)` = 1px, degradê branco | — | — |
| reduced-motion (ativo) | `scaleY(1)`, amarelo | **nenhum** | **nenhum** |

## 5. Centralização interna — de matemática para percepção

A caixa já estava centrada; o conteúdo não parecia. A seta dividia a linha com o rótulo,
então o que ficava no eixo era o conjunto "rótulo + vão + seta".

A seta saiu do fluxo (`absolute`, `left: 100%` da linha do rótulo). Continua encostada no
nome — não voltou a ser glifo de canto —, mas não entra na conta da largura.

Desvio do centro do rótulo em relação ao centro da trilha:

| viewport | antes | depois |
| --- | --- | --- |
| 1920 | −13 · −13 · −13 | **0 · 0 · 0** |
| 1440 | −13 · −13 · −13 | **0 · 0 · 0** |
| 1024 | −13 · −13 · −13 | **0 · 0 · 0** |

O complemento também fecha em 0 nos três, ou seja: rótulo e complemento passam a
compartilhar o mesmo eixo, que é o eixo da trilha. Abaixo de `sm` a seta e o complemento não
existem, e o rótulo já estava em 0.

## 6. WhatsApp — mesmo verde, um degrau mais fundo

`#25D366` → **`#1DA851`**. Não é matiz novo nem cor de outra marca: em HSL o antigo é
`142,4° / 70,2% / 48,6%` e o novo é `142,4° / 70,6% / 38,6%` — **matiz e saturação
idênticos**, dez pontos de luminosidade a menos.

| | luminância relativa | contraste com `ink` |
| --- | --- | --- |
| amarelo `#F5C64B` | 0,603 | 11,84:1 |
| verde antigo `#25D366` | 0,479 | 9,59:1 |
| verde novo `#1DA851` | **0,289** | **6,14:1** |

O amarelo tinha 0,603 contra 0,479 — duas massas quase igualmente luminosas não formam
hierarquia. Agora o verde está a menos da metade da luminância do amarelo, e o amarelo é
inequivocamente a primeira massa da linha. Texto e glifo continuam em `ink` (6,14:1 passa AA
com folga; `canvas` sobre o mesmo fundo daria 2,7:1 e reprovaria).

`whatsapp-float.tsx` continua com `#25D366` — lá o verde é um disco de 28px sobre fundo
claro, não uma massa de 267px na dobra. Não é divergência: é a mesma cor em dois pesos.

URL, número e evento inalterados: `whatsappUrl(topic)` → `wa.me/5521995181918`.

## 7. A correção de `c5c23c0` não regrediu

Sequência real Equipamentos → Projetos → Consultoria → Equipamentos, três viewports:

- **todos os compartilhados sobrevivem às três trocas**: painel, `h1`, linha de ação, os
  dois CTAs, seletor e faixa de métricas;
- **opacidade mínima 1** em linha de ação, WhatsApp, seletor e métricas, amostrada a cada
  25ms durante toda a sequência;
- caixa do WhatsApp idêntica nas três trocas (1920: x=642, y=642,6, 266,8 × 58);
- copy atualiza em 42–104ms;
- zero requisição de imagem após o clique em 1920 e 1440. Em 390 há uma única, e **não é
  cena da Hero** (`cozinha-completa.jpg`, de uma seção V1 abaixo, que entra na janela quando
  o clique rola a página).

Nenhum `key` foi reintroduzido em wrapper.

## 8. Mobile

`estados/hero-390-*.png`, `estados/hero-320-equipamentos.png`,
`detalhes/detalhe-390-pilares-metricas.png`.

O desktop não foi copiado literalmente: abaixo de `sm` o tique amarelo e a hairline entre
seletor e métricas somem (o vão já separa, e em 390 a linha inteira está no limite da
coluna), o complemento e a seta dos pilares continuam ocultos, e o CTA de categorias
reorganiza para baixo das métricas. Overflow **0** em 390 e em 320; a região inferior encolheu
1px nos dois.

## 9. Testes

`npm run lint` limpo · `npm run type-check` limpo · `npm run build` passa.

| viewport | overflow | console | HTTP ≥ 400 | imagens quebradas |
| --- | --- | --- | --- | --- |
| 1920 | 0 | 0 | 0 | 0 / 72 |
| 1440 | 0 | 0 | 0 | 0 / 72 |
| 1024 | 0 | 0 | 0 | 0 / 72 |
| 390 | 0 | 0 | 0 | 0 / 72 |
| 320 | 0 | — | — | — |

Teclado no seletor: `→` percorre e dá a volta, `End`/`Home` nas pontas, foco e seleção
juntos. Nome acessível do CTA primário continua sendo um rótulo por estado.
`prefers-reduced-motion` remove os três transforms novos (subida do conteúdo, avanço
permanente da seta e resposta de hover) e mantém régua, peso e cor.

## 10. Pendência mantida

**Projetos continua bloqueado por ausência de asset compatível no acervo.** O arquivo não foi
tocado nesta rodada e nenhum filtro novo foi aplicado para compensar.

## Índice

```
antes-depois/
  antes-1920-dobra.png · antes-1920-regiao-inferior.png
  depois-1920-dobra.png · depois-1920-regiao-inferior.png
  antes-medidas.json

estados/
  hero-1920-equipamentos.png · hero-1920-projetos.png · hero-1920-consultoria.png
  hero-1440-equipamentos.png · hero-1440-consultoria.png
  hero-1024-equipamentos.png
  hero-390-equipamentos.png · hero-390-projetos.png · hero-390-consultoria.png
  hero-320-equipamentos.png

detalhes/
  detalhe-1920-regiao-integrada.png · detalhe-1920-metricas.png · detalhe-1920-ctas.png
  detalhe-1920-pilares.png · detalhe-1920-pilares-hover.png · detalhe-1920-pilares-focus.png
  detalhe-1440-regiao-inferior.png · detalhe-1440-ctas.png · detalhe-1440-reduced-motion.png
  detalhe-1024-base.png
  detalhe-390-pilares-metricas.png

medicoes.json      (geometria + contraste do pior pixel, cinco viewports × três cenas)
```
