---
STATUS: EVIDÊNCIA
tipo: interação/motion + CTA de WhatsApp
partida: 40ff37a
branch: v2
data: 2026-08-09
---

# Hero V2 — troca de estado sem remontagem + WhatsApp preenchido

Duas mudanças, nenhum redesenho. Capturas feitas **só** contra build de produção
(`npm run build` + `npm start -p 3200`).

## 1. A causa da sensação de recarregamento

O bloco de conteúdo da dobra tinha **`key={state.id}`**. Trocar de pilar mudava a `key` e
o React **desmontava a coluna inteira** — etiqueta, título, intenção e a linha de ação com
os dois CTAs — remontando tudo do zero. Como `.enter` (`contentIn 340ms … both`) está
aplicado a esses elementos com atrasos escalonados de 0/60/120/**180ms**, cada clique
reiniciava a coreografia de entrada da página: durante os 180ms de atraso o `both` segurava
a linha de ação em `opacity: 0`, e só então ela subia 10px até aparecer. Meio segundo em que
o par de botões — inclusive o de WhatsApp, que **não muda** de estado para estado — sumia e
voltava.

Medido no build de produção antes da correção, marcando os nós antes do clique e
procurando a marca depois:

| elemento | sobreviveu à troca? |
| --- | --- |
| `[data-hero-cta]` (CTA primário) | **não** |
| `[data-hero-cta-wa]` (WhatsApp) | **não** |
| `[role="tablist"]` (seletor) | sim |
| `[data-hero-metrics]` (faixa) | sim |

e a linha de ação renderizando `animation: contentIn 0.34s; animation-delay: 0.18s`.

A fotografia **não** era a causa: as três cenas já ficavam montadas e trocavam por
crossfade de `opacity`. A medição confirma zero requisição de imagem depois do clique, antes
e depois desta rodada.

## 2. O que mudou

- **`key` do bloco de conteúdo: removida.** Nada na coluna desmonta mais. `.enter` continua
  no lugar e continua rodando — **uma vez, no carregamento da página**. A entrada escalonada
  da dobra fica exatamente como estava; o que sumiu foi ela se repetir a cada clique.
- **`.swap`**, novo: 180ms, **só `opacity`**, sem escalonamento, aplicado a um `<span>`
  dentro da etiqueta, do `h1` e da intenção — o texto é a menor unidade que realmente muda.
  As caixas com piso medido (`HEADLINE_MIN` / `INTENT_MIN`) nunca saem do DOM.
- **`.ctaLabels`**, novo: os três rótulos do CTA primário ocupam a mesma célula de grade.
  A cela mede sempre o mais longo, então a **largura do botão amarelo não muda** entre
  estados — e é isso que mantém o WhatsApp imóvel ao lado dele. Só o ativo é opaco; os
  outros dois levam `aria-hidden`, então o nome acessível do link continua sendo um rótulo
  só. Ninguém desmonta: é crossfade puro por `transition`.
- **WhatsApp preenchido:** fundo `#25D366` (o verde que já estava no projeto), texto e
  glifo em `ink`, hover por `::before` branco a 18% subindo em `scaleY`.
- **`active`**, novo nos dois CTAs: recuo de 1,5% em 120ms, cancelado por `motion-reduce`.
  `CLAUDE.md` exige quatro estados de botão e os dois tinham três.

## 3. Estabilidade medida — 3 trocas × 3 viewports

Sequência real: Equipamentos → Projetos → Consultoria → Equipamentos.

**Todos os compartilhados sobrevivem às três trocas nos três viewports:** painel, `h1`,
linha de ação, CTA primário, CTA de WhatsApp, seletor e faixa de métricas.

Opacidade **mínima** observada nos compartilhados, amostrada a cada 25ms durante toda a
sequência:

| viewport | linha de ação | WhatsApp | seletor | métricas |
| --- | --- | --- | --- | --- |
| 1920 | 1 | 1 | 1 | 1 |
| 1440 | 1 | 1 | 1 | 1 |
| 390 | 1 | 1 | 1 | 1 |

Nenhum deles chega perto de zerar em quadro nenhum.

Caixa do botão de WhatsApp, idêntica nas três trocas:

| viewport | x | y | largura | altura |
| --- | --- | --- | --- | --- |
| 1920 | 642 | 642 | 266,8 | 58 |
| 1440 | 402 | 511,8 | 266,8 | 58 |

Largura do CTA primário: **326px constante** nos três estados (antes variava com o rótulo).

Em **390** o `x`, a largura e a altura também ficam constantes; o `y` muda entre passos
porque o clique no seletor rola a página (a régua fica abaixo da primeira tela nesse
viewport), não por deslocamento de layout.

Tempo entre o clique e a copy atualizada: **38–84ms** (nove trocas medidas).

## 4. Imagens

As três cenas ficam montadas e trocam por `opacity` — a estratégia já existia e foi
preservada. As três são pedidas **no carregamento** da página:

```
/images/hero/hero-industrial-kitchen.png   (Equipamentos, priority — é o LCP)
/images/projects/projeto-3d-hero.jpg       (Projetos)
/images/hero/operacao-comercial.png        (Consultoria)
```

Só a primeira é `priority`; as outras duas ficam `loading="lazy"` e, por estarem dentro da
janela, o navegador as busca sem disputar prioridade com o LCP. **Zero requisição de imagem
depois do clique** em 1920 e 1440. Em 390 aparece uma única requisição tardia — e ela **não
é uma cena da Hero**: é `/images/projects/cozinha-completa.jpg`, de uma seção V1 mais
abaixo, que entra na janela porque o clique no seletor rola a página. Opacidade das três
camadas por estado, medida: `1/0/0` → `0/1/0` → `0/0/1`.

## 5. Reduced-motion

Com `prefers-reduced-motion: reduce`, amostrado a cada 30ms depois do clique:

- `.swap` → `animation: none`; opacidade mínima do `h1` durante a troca: **1**;
- cela dos rótulos do CTA → `transition: none`; opacidade mínima do rótulo ativo: **1**;
- o `h1` já aparece trocado na primeira amostra;
- o recuo de `active` é cancelado (`motion-reduce:active:scale-100`).

Troca instantânea, sem flash e sem conteúdo invisível.

## 6. Acessibilidade e teclado

Nome acessível real (árvore de acessibilidade do Chromium), por estado:

| estado | CTA primário | destino | WhatsApp |
| --- | --- | --- | --- |
| equipamentos | "Solicitar orçamento" | `/contato?intencao=equipamentos` | "Falar no WhatsApp" |
| projetos | "Falar com um projetista" | `/contato?intencao=arquitetura` | "Falar no WhatsApp" |
| consultoria | "Agendar diagnóstico" | `/contato?intencao=consultoria` | "Falar no WhatsApp" |

Um rótulo por estado — os dois inativos, com `aria-hidden`, ficam fora do cálculo do nome.

Teclado no seletor, a partir de Equipamentos: `→` percorre projetos → consultoria →
equipamentos (dá a volta), `End` vai a consultoria, `Home` volta a equipamentos; foco e
seleção andam juntos. `Tab` a partir do CTA primário chega ao CTA de WhatsApp.

## 7. URL do WhatsApp

Inalterada. Continua saindo de `whatsappUrl(topic)` (`lib/whatsapp.ts`) com
`contact.phoneE164` de `src/data/site.ts` — `wa.me/5521995181918`. O tópico segue o estado
ativo, então a mensagem pré-preenchida muda com o pilar. Nenhum número novo.

## 8. Testes

`npm run lint` limpo · `npm run type-check` limpo · `npm run build` passa.

Em produção, depois das três trocas e com a home varrida de ponta a ponta:

| viewport | overflow | console | HTTP ≥ 400 | imagens quebradas |
| --- | --- | --- | --- | --- |
| 1920 | 0 | 0 | 0 | 0 / 72 |
| 1440 | 0 | 0 | 0 | 0 / 72 |
| 1024 | 0 | 0 | 0 | 0 / 72 |
| 390 | 0 | 0 | 0 | 0 / 72 |

## 9. Índice das capturas

```
estados/
  hero-1920-equipamentos.png · hero-1920-projetos.png · hero-1920-consultoria.png
  hero-1440-equipamentos.png
  hero-390-equipamentos.png  · hero-390-projetos.png

ctas/                       (2×, com os quatro estados do botão de WhatsApp)
  ctas-1920-normal.png · ctas-1920-wa-hover.png · ctas-1920-wa-focus.png · ctas-1920-wa-active.png
  ctas-1440-normal.png · ctas-1440-wa-hover.png · ctas-1440-wa-focus.png · ctas-1440-wa-active.png
  ctas-390-normal.png  · ctas-390-wa-hover.png  · ctas-390-wa-focus.png  · ctas-390-wa-active.png
  ctas-1440-reduced-motion.png

video/                      (a sequência completa Equipamentos → Projetos →
                             Consultoria → Equipamentos, gravada)
  troca-tres-estados-1920x1080.webm
  troca-tres-estados-1440x900.webm
  troca-tres-estados-390x844.webm
  troca-reduced-motion-1440x900.webm

sequencia/                  (quadros-chave: o instante do clique e 400ms depois)
  1920-00-partida-equipamentos.png
  1920-01-projetos-t{000,400}ms.png
  1920-02-consultoria-t{000,400}ms.png
  1920-03-equipamentos-t{000,400}ms.png
  390-00-partida-equipamentos.png · 390-0{1,2,3}-…-t{000,400}ms.png
  1440-reduced-motion-t{000,400}ms.png

medicoes.json
```

Os quadros são de viewport inteiro de propósito: é neles que se vê que cabeçalho, seletor,
faixa de métricas e os dois botões continuam na tela durante a troca. O quadro `t000ms` é o
**instante do clique** — o mais desfavorável, com o crossfade da cena e o do texto em pleno
voo; mesmo nele os dois botões, o seletor e a faixa estão inteiros e no lugar.

Em 1440 a sequência é só o vídeo: os quadros seriam idênticos aos de 1920 em conteúdo, e a
gravação já cobre o movimento. Os quadros de reduced-motion em 1440 ficam porque são
evidência própria.

## Nota de ambiente

Um `npm run dev` estava rodando em paralelo e gravando no mesmo `.next` do build de
produção — foi ele que, na rodada anterior, fez `next start` responder 400 no CSS. Ele foi
encerrado para esta validação. Se for reaberto, rode `npm run build` de novo antes de
qualquer captura de produção.
