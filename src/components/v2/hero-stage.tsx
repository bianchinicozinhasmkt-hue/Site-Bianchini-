'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon, WhatsappIcon } from '@/components/ui/icons'
import { heroStates, homeHero, type HeroState } from '@/data/v2/home'
import { trackEvent } from '@/lib/analytics'
import { whatsappUrl, type WhatsappTopic } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import styles from './hero-stage.module.css'

/**
 * ============================================================
 * PRIMEIRA DOBRA — UM PALCO, TRÊS ESTADOS COMERCIAIS
 * ============================================================
 *
 * **É a única área redesenhada do site.** Tudo abaixo dela é V1, restaurado a
 * partir de `v1-final`; lá só a ordem das seções mudou. Este componente, o seu
 * `hero-stage.module.css` e o alinhamento do cabeçalho ao `Container` são o
 * escopo inteiro da V2 na home.
 *
 * O diagnóstico do que estava errado — com as medições — está no cabeçalho do
 * módulo CSS. Este comentário descreve o que a composição **é**.
 *
 * ============================================================
 * A ARQUITETURA DA DOBRA
 * ============================================================
 *
 *   ┌ cabeçalho (fixo, fora daqui) ─────────────────────────┐
 *   ├ PALCO ────────────────────────────────────────────────┤
 *   │   cena (fotografia de sangria ou prancha de projeto)  │
 *   │   scrim local — fecha só a coluna esquerda e a base   │
 *   │   coluna de conteúdo, centrada verticalmente          │
 *   │     etiqueta → h1 → intenção → CTA + WhatsApp         │
 *   ├ DECISÃO ──────────────────────────────────────────────┤
 *   │   instrução ("Escolha o que sua operação…")           │
 *   │   ┌ EQUIPAMENTOS ─┐ ┌ PROJETOS ┐ ┌ CONSULTORIA ┐      │
 *   └───────────────────────────────────────────────────────┘
 *
 * **Não há mais faixa de métricas.** `18 anos · Brasil` e a ação secundária
 * saíram da dobra em 2026-08-09, por decisão do gestor — o registro de por quê
 * e do que aconteceu com cada dado está no comentário da base, mais abaixo.
 * As portas também não têm numeral: o que cada uma mostra é nome, situação e
 * seta.
 *
 * Os dois blocos compartilham o **mesmo `Container`** do cabeçalho e de toda
 * seção do site: um eixo vertical único da marca até a última porta.
 *
 * ============================================================
 * COMO EQUIPAMENTOS LIDERA
 * ============================================================
 *
 * Por posição na narrativa e por peso na malha, nunca por tratamento de imagem
 * (doc 01 §9.2 — seis mecanismos, nenhum deles estético):
 *
 *   1. é o **estado inicial** — o que a página mostra a quem chega, e o único
 *      que o servidor entrega;
 *   2. o `h1` da página é a copy dele;
 *   3. é a primeira porta e a primeira parada do teclado;
 *   4. a área dele no seletor é **1,15fr** contra 1fr das outras duas, de
 *      `lg` para cima (a faixa autorizada é 1,15–1,3; a conta que escolheu o
 *      piso da faixa está em `.doors`, no módulo CSS). Abaixo de 1024 as três
 *      são iguais e sobram os outros cinco mecanismos;
 *   5. a ação da faixa de fechamento também é de equipamentos;
 *   6. permanece selecionado até o visitante escolher outra coisa — nenhuma
 *      rotação, nenhum autoplay, nenhuma troca sozinha.
 *
 * Nenhuma cena é maior, mais clara, mais saturada ou menos coberta que as
 * outras — as três ocupam exatamente o mesmo palco.
 *
 * ============================================================
 * O `h1` E A TROCA DE ESTADO
 * ============================================================
 *
 * Há **um** `h1` na página, sempre visível, e ele carrega o título do estado
 * ativo. No estado inicial esse título é o de Equipamentos — e é o que o
 * servidor renderiza, portanto o que buscador, Open Graph e prévia de link leem.
 * Trocar de estado é ação do visitante, e o título passa a descrever o que está
 * na tela.
 *
 * A alternativa — um `h1` escondido com um texto e um `h2` visível com outro —
 * deixaria leitor de tela e leitor visual ouvindo coisas diferentes.
 *
 * Sem JavaScript a dobra continua íntegra: mostra Equipamentos, com etiqueta,
 * título, intenção e CTA, e os três caminhos continuam **nomeados** no seletor.
 */

/* ============================================================
   OS PISOS DE ALTURA SAÍRAM (2026-08-09)
   ============================================================

   O `h1` tinha `min-h-[3.3em] lg:min-h-[3.15em]` e a intenção
   `min-h-[4.5em] lg:min-h-[4.8em]`. Os dois existiam para uma razão real: sem
   eles, a versão de 2026-08-08 movia o `h1` em até 86px por troca de estado.
   Com a caixa travada no pior caso, a moldura ficava parada nos três estados.

   O custo dessa estabilidade era uma **linha fantasma**, e ela ficava no pior
   lugar possível — dentro do bloco de texto. Medido no build de produção, em
   1920 × 1080, do fim real do texto do `h1` até o topo do parágrafo:

     equipamentos ... 11,9px   (3 linhas de título — o piso é o próprio texto)
     projetos ....... 11,9px   (3 linhas)
     consultoria .... 72,8px   ← 60,9px a mais, exatamente uma linha de título

   E a intenção tinha o mesmo defeito, um degrau abaixo: 33,6px de reserva não
   usada em Projetos e em Consultoria (as duas rendem 2 linhas contra as 3 do
   piso), agora entre o parágrafo e os CTAs.

   Em 1440 × 900 o mesmo: 12,4px nos dois primeiros contra **63,8px** em
   Consultoria.

   Em 1024 × 768 e em 390 × 844 os pisos **não mordem** — ali as três copies
   rendem o mesmo número de linhas (4 no título, 3 na intenção em 1024; 4 e 4
   em 390), e medido antes e depois a composição é byte a byte a mesma. O
   defeito era só de desktop, e a correção também.

   ============================================================
   POR QUE A SOBRA VAI PARA A CENTRAGEM, E NÃO PARA UM PISO NA COLUNA
   ============================================================

   Sem pisos, a coluna passa a ter altura natural e ela varia entre os estados
   (medido em 1920): equipamentos 433,5px, projetos 404,7px, consultoria
   343,8px — 89,7px entre o mais alto e o mais baixo. Essa diferença tem de ir
   para algum lugar, e há duas escolhas:

     · **piso na coluna, conteúdo no topo** — a etiqueta e o `h1` ficam parados
       e a sobra inteira cai depois dos CTAs. Deslocamento do par de botões:
       **89,7px**;
     · **centragem no palco** (`items-center`, o que já existe) — a sobra é
       repartida em duas metades, acima e abaixo. Deslocamento de qualquer
       elemento: **44,8px**.

   A centragem é o ótimo: nenhum elemento anda mais que metade do que andaria
   na outra. E é ela que o briefing nomeia como absorvedor aceitável
   ("distribuição vertical do palco"), ao lado do vão entre bloco e seletor —
   que é justamente a metade de baixo dessa conta.

   O `h1` de Consultoria passa a assentar 44,8px mais baixo que o de
   Equipamentos em 1920 (40,1px em 1440). É consequência direta de o título ser
   uma linha mais curto, e não uma caixa vazia: o bloco inteiro se recompõe,
   com o mesmo ritmo interno nos três estados.

   **Nenhuma contagem de linha a remedir daqui para frente.** Era essa tabela —
   "refaça a medição sempre que qualquer título ou intenção mudar de
   comprimento" — que os pisos obrigavam a manter. Mudar a copy agora só muda
   onde o bloco se centra.
   ============================================================ */

/**
 * ============================================================
 * A COREOGRAFIA DA TROCA — SAÍDA, PASSAGEM, ENTRADA
 * ============================================================
 *
 * Duas correções, nesta ordem, e vale registrar as duas porque a segunda existe
 * por causa da primeira.
 *
 * **1. O crossfade simétrico produzia dupla exposição.** As duas cenas
 * partilhavam `transition: opacity 380ms`, então a meio caminho as duas estavam
 * em ~0,5 — uma planta técnica atravessando um rosto por ~6 quadros.
 *
 * **2. Separar os tempos produziu apagão.** A correção seguinte tirou a
 * simultaneidade (saída em 170ms, entrada com 150ms de atraso) e derrubou a
 * sobreposição para 0,002 — mas entre ~150 e ~200ms **as duas cenas estavam
 * perto de zero ao mesmo tempo**, e a dobra piscava para quase preto no meio de
 * cada troca. Zero de sobreposição e zero de imagem são a mesma medição.
 *
 * A troca agora é **espacial, não cromática**: a cena nova é revelada por uma
 * máscara que corre da esquerda para a direita, e a antiga continua inteira por
 * baixo até ser coberta (ver o bloco da ponte em `hero-stage.module.css`). Cada
 * pixel mostra exatamente uma cena o tempo todo — nem duas somadas, nem nenhuma.
 *
 *   t=0        o controle responde (é o único elemento imediato)
 *   0–210ms    a copy sai, 6px para cima
 *   0–520ms    a revelação atravessa o palco (20% em 150ms, 50% em 260, 85% em 400)
 *   0–720ms    a cena nova assenta de 1,016 para 1
 *   250–490ms  a copy nova entra, 8px de baixo para cima
 *   +220ms     no estado de Consultoria, a camada vetorial entra por último
 *
 * `COPY_OUT_MS` é o único número que precisa viver no JavaScript: é o atraso
 * entre a escolha e a **substituição do texto no DOM**, e é o que dá à copy uma
 * saída de verdade em vez do corte seco que a remontagem por `key` produz. Ele
 * subiu de 150 para 210ms nesta rodada para que a troca de cena sob a coluna de
 * texto caia no **vão entre as duas copies** — medido no quadro, com 150ms a
 * copy antiga ainda estava na tela quando a cena nova chegava embaixo dela.
 * Todo o resto da coreografia é CSS.
 */
const COPY_OUT_MS = 210

/**
 * ============================================================
 * O QUARTO ESTADO DO BOTÃO — PRESSÃO
 * ============================================================
 *
 * `CLAUDE.md` fixa quatro estados para botão: padrão, hover, `focus-visible` e
 * **active**. Os dois CTAs da dobra tinham três — a pressão não devolvia nada.
 * Este é o quarto, e é o mesmo nos dois, para que o par continue lendo como um
 * par também sob o dedo.
 *
 * 1,5% de recuo em 120ms (faixa de resposta, curva `precise`). É `transform`,
 * então não reflui a linha nem move o botão vizinho — e `motion-reduce` o
 * cancela, como manda a regra de movimento do projeto.
 */
const pressState = cn(
  'transition-transform duration-[120ms] ease-precise',
  'active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100',
)

export function HeroStage() {
  /* ============================================================
     UM ESTADO SÓ — A PRÉVIA POR HOVER SAIU (2026-08-11)
     ============================================================

     Havia dois estados: `pinned` (a escolha) e `preview` (o que o ponteiro
     antecipava, fixado depois de 150ms de intenção). O que estava na tela era
     `preview ?? pinned`.

     **Os dois comportamentos foram comparados nesta rodada**, e o de hover
     perde por três razões — a última é a que decide:

       · **custo de atenção.** Atravessar a fileira para alcançar a terceira
         porta trocava a cena inteira no caminho. O atraso de intenção reduzia a
         frequência, não o efeito: o visitante que hesita 200ms sobre Projetos
         vê a Hero inteira mudar sem ter escolhido nada;
       · **o controle passava a reagir à passagem**, e um controle que muda de
         assunto ao ser sobrevoado lê como gráfico animado, não como botão;
       · **e agora a troca tem direção de arte.** Com a coreografia de saída →
         passagem → entrada (ver `COPY_OUT_MS`, acima) mais o `ambient motion`
         da cena e a camada vetorial de Consultoria, uma troca custa ~450ms de
         composição deliberada. Disparar isso por passagem de mouse gasta a
         coreografia em algo que o visitante não pediu — e, pior, faz o retorno
         do ponteiro **desfazer** a cena no meio da entrada.

     A regra desta rodada é a que o briefing nomeia: **hover anima o próprio
     controle; clique, toque e teclado trocam a cena.** O hover ficou mais
     expressivo justamente porque não tem mais de antecipar conteúdo — ele é
     confirmação de alvo, e é só isso.

     Some com a prévia o `useRef` do temporizador, a checagem de ponteiro fino,
     o `onMouseLeave` da fileira e o `onFocusCapture` que existia só para
     resolver a incoerência entre `aria-selected` (que seguia a prévia) e
     `tabindex` (que seguia a escolha). Nenhum deles tem função quando só existe
     um estado — e o par ARIA passa a ser coerente por construção.
  */
  const [pinned, setPinned] = useState(0)
  const active = pinned
  /** A cena segue a escolha **imediatamente**: é ela que abre a coreografia. */
  const scene = heroStates[active]

  /* ============================================================
     A COPY ANDA MEIO PASSO ATRÁS DA CENA
     ============================================================

     `copyIndex` é o estado que a **coluna de texto** mostra, e ele chega
     `COPY_OUT_MS` depois de `active`. Esse atraso é o que dá à copy uma saída
     de verdade: durante ele o bloco inteiro sai (opacidade e 6px para cima, ver
     `.copyBlock` no módulo) e só então o texto é substituído no DOM.

     Sem ele, a remontagem por `key` produzia um **corte seco** — o texto antigo
     desaparecia no mesmo quadro em que o novo começava a aparecer. Era a parte
     de "motion rígido" que não estava na fotografia.

     `prefers-reduced-motion` curto-circuita o atraso: ali a troca é imediata,
     sem saída, sem entrada e sem passagem.
  */
  const [copyIndex, setCopyIndex] = useState(0)
  const [copyOut, setCopyOut] = useState(false)
  const copy = heroStates[copyIndex]

  useEffect(() => {
    if (copyIndex === active) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCopyIndex(active)
      setCopyOut(false)
      return
    }

    setCopyOut(true)
    const timer = window.setTimeout(() => {
      setCopyIndex(active)
      setCopyOut(false)
    }, COPY_OUT_MS)
    /*
      A limpeza cobre o clique rápido: trocar de porta antes dos 150ms cancela
      o temporizador pendente e reinicia a saída a partir do estado novo. A copy
      nunca fica presa num índice intermediário.
    */
    return () => window.clearTimeout(timer)
  }, [active, copyIndex])

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => setPinned(index)

  /**
   * Navegação por seta, como manda o padrão de `tablist`: a seta move a seleção
   * **e** o foco, `Home`/`End` vão às pontas e a lista dá a volta. `Enter` e
   * `Espaço` são o comportamento nativo do `<button>` e caem em `onClick`.
   */
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
      return
    event.preventDefault()

    setPinned((current) => {
      const last = heroStates.length - 1
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? last
            : event.key === 'ArrowRight' || event.key === 'ArrowDown'
              ? (current + 1) % heroStates.length
              : (current - 1 + heroStates.length) % heroStates.length
      tabsRef.current[next]?.focus()
      return next
    })
  }, [])

  return (
    <section
      aria-labelledby="hero-titulo"
      /*
        `min-h`, e **não** `h` fixo. Com `height: 100svh` o conteúdo que não cabe
        era empurrado para fora da janela pelo alinhamento — em 320 × 568 o `h1`
        chegou a y = −75,6px, com a etiqueta e duas linhas do título acima da
        borda superior. Com `min-height` a dobra ocupa uma tela quando cabe e
        cresce quando não cabe; nada sai da tela em nenhuma largura.

        `svh` e não `vh`: no telefone `vh` ignora a barra de endereço retrátil.

        `pt-[var(--header-height)]` porque o cabeçalho é uma faixa opaca e fixa.
      */
      className={cn(
        'relative isolate flex flex-col bg-graphite pt-[var(--header-height)]',
        'min-h-[100svh]',
      )}
      /*
        O atalho flutuante de WhatsApp só existe a partir de 1680px e some
        enquanto qualquer zona marcada estiver visível — é o mecanismo da V1
        (`whatsapp-float.tsx`). Sem esta marcação ele nasceria sobre a ação
        secundária da faixa de métricas, que fica no canto inferior direito.
      */
      data-whatsapp-safe-zone
    >
      {/* ================= O PALCO ================= */}
      <div data-hero-stage className={cn(styles.stage, 'flex min-h-0 flex-1 flex-col')}>
        {/* ---------- As três cenas, empilhadas no mesmo lugar ---------- */}
        {heroStates.map((item, index) => (
          <div
            key={item.id}
            aria-hidden={index !== active}
            className={cn(
              styles.frame,
              index === active && styles.frameActive,
              /*
                ============================================================
                CONSULTORIA TEM UMA APRESENTAÇÃO PRÓPRIA (2026-08-10)
                ============================================================

                O arquivo é o mesmo e não foi tocado. O que muda é **como ele
                é apresentado**: em `lg` para cima a cena de Consultoria deixa
                de se comportar como `cover` de sangria e passa a ser uma
                figura ancorada à direita e à base, em escala reduzida, sobre
                o próprio fundo de estúdio estendido. A medição, o motivo e os
                números estão no módulo CSS (`.frameConsultoria`).

                Abaixo de `lg` nada muda: ali a cena é uma tira no alto do
                palco e o retrato já não domina composição nenhuma.
              */
              item.id === 'consultoria' && styles.frameConsultoria,
              /*
                Só para o `ambient motion`: cada cena deriva numa direção
                própria (ver o bloco de ambient no módulo). Projetos avança para
                a prancha quase sem percurso lateral; Equipamentos entra no
                corredor; Consultoria fica quase parada.
              */
              item.id === 'projetos' && styles.frameProjetos,
            )}
          >
            {/*
              ---------- Uma cena de sangria, sempre — os três estados iguais ----------

              Até 2026-08-08 Projetos era um caso à parte: uma prancha contida
              (`.plateField`), presa a 48% do palco para não ampliar um arquivo
              de baixo detalhe. Medido pela auditoria em 1440 × 900, isso abria
              ~200px de grafite vazio acima da prancha e ~180px abaixo dela —
              um retângulo documental dentro da Hero, não uma cena. A rodada P1
              tira essa exceção: os três estados usam o mesmo `<Image fill>` em
              `object-cover`, sangrando o palco inteiro. Projetos fica mais
              suave que os outros dois (o arquivo já é uma reamostragem — ver
              `src/data/v2/home.ts`, bloco "PROJETOS"), e essa perda de nitidez
              é o que a correção aceita em troca de voltar a ser um palco.
            */}
            {/*
              A caixa da cena. Nos dois primeiros estados ela é `inset: 0` e
              não faz nada — existe para que Consultoria possa ter geometria
              própria **sem** disputar com os estilos em linha que o
              `next/image` grava no `<img>` quando `fill` está ligado
              (`position`, `inset`, `width` e `height` são inline e venceriam
              qualquer classe). Com o invólucro, quem carrega a geometria é um
              elemento nosso, e o `<img>` continua sendo `cover` de `inset: 0`
              dentro dele — mesmo contrato nos três estados.
            */}
            <div className={styles.sceneBox}>
              <Image
                src={item.media.src}
                alt={item.media.alt}
                fill
                /*
                  Só a cena inicial é `priority`: ela é o LCP da página. As
                  outras duas ficam `lazy` — estão na janela, então o navegador
                  as busca assim que sobra banda, depois da que foi
                  pré-carregada. Marcá-las `eager` as poria disputando a
                  primeira pintura com o LCP.
                */
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                /* O palco é de largura inteira: `100vw` descreve a caixa real. */
                sizes="100vw"
                quality={86}
                style={{ objectPosition: item.media.objectPosition }}
                /*
                  Sem correção tonal por estado desde 2026-08-09. As três cenas
                  novas chegam com 12 pontos de amplitude de luminância entre si
                  (eram 87 no conjunto anterior), então `.gradeProjetos` e
                  `.gradeConsultoria` deixaram de fechar um desvio e passariam a
                  criar um — a tabela medida está no cabeçalho do módulo CSS.
                */
                className="object-cover"
              />
            </div>

            {/*
              ============================================================
              A CAMADA VETORIAL DE CONSULTORIA SAIU (2026-08-11)
              ============================================================

              Havia aqui um `ConsultingOverlay`: um grafo SVG — entradas,
              convergência, zona de análise com colchetes, priorização e um nó
              de decisão amarelo — desenhado sobre o canto superior direito da
              cena, com pulso e halo em laço. Ele existia para responder à
              queixa de "cena vazia" depois que o retrato foi reduzido.

              Ele saiu inteiro, e a razão é de direção de arte, não de
              implementação: **aquilo era um fluxograma**. O briefing desta
              rodada proíbe explicitamente "visual de dashboard, gráfico,
              fluxograma ou circuito eletrônico", e a camada era as quatro
              coisas ao mesmo tempo. Somava-se a isso o defeito de composição —
              ela flutuava no alto, sem relação com a figura nem com a coluna de
              texto, e não tocava nenhum dos dois: um desenho colado por cima da
              fotografia, que é o que o gestor viu.

              **O vazio não se resolve com desenho, resolve-se com luz.** A cena
              de Consultoria é um retrato de estúdio, e o que falta nela é
              profundidade fotográfica, não informação gráfica. Quem responde
              por isso agora é `.frameConsultoria` no módulo CSS: a figura ganha
              escala (o campo vazio encolhe pela própria composição) e o fundo
              sintetizado ganha um plano de piso e uma queda de luz lateral, de
              modo que o que sobra do palco lê como **espaço**, e não como
              retângulo escuro à espera de um enfeite.

              Com a camada, saíram do módulo as ~190 linhas de `.consulting*` —
              o grafo, o pulso em laço de 10s e o halo em laço de 7s. Os dois
              laços eram, além disso, a única animação permanente da dobra, e
              "nada em laço" é regra do projeto (`CLAUDE.md`).
            */}
          </div>
        ))}

        {/*
          Scrim local: fecha a coluna esquerda, onde o texto assenta, e a base,
          onde o seletor assenta. O terço direito da fotografia fica sem
          cobertura nenhuma — é o que devolve inox, textura e profundidade.
        */}
        <span aria-hidden="true" className={styles.scrim} />

        {/* ---------- Conteúdo comercial, dentro da cena ---------- */}
        <div
          id="hero-painel"
          role="tabpanel"
          /*
            O painel é rotulado pela aba **selecionada**, não pela copy visível:
            durante os 150ms de saída da copy o que a tela mostra já é a cena
            nova, e o leitor de tela não pode ficar meio passo atrás do estado
            real do `tablist`.
          */
          aria-labelledby={`hero-aba-${scene.id}`}
          /*
            `items-center`, e não `items-end`. Ancorado pela base, cada linha a
            menos no título empurrava o bloco inteiro para baixo — era metade da
            causa do salto entre estados (a outra metade eram as caixas sem
            piso, removidas em 2026-08-09 — ver o bloco no topo do arquivo).

            `py-*` garante respiro contra o cabeçalho e contra o seletor mesmo
            no viewport mais apertado (1366 × 768). Direção visual
            (2026-08-08): 32/40px lia curto contra a régua do seletor logo
            abaixo — "elementos socados no meio" incluía essa transição. Sobe
            para 40/56px (medido para não empurrar a dobra para fora de
            1366 × 768 — ver a medição de linhas do `h1`/parágrafo acima).

            `pt-[var(--media-h)]` abaixo de `lg`: a cena ocupa a faixa do topo
            (ver `--media-h` no módulo) e o conteúdo assenta **abaixo** dela, em
            fluxo, sobre grafite liso. Sem esse recuo o bloco centralizava sobre
            a faixa e, no estado de Projetos — que é claro —, o `h1` branco caía
            em cima do desenho.
          */
          /*
            ============================================================
            HARMONIZAÇÃO (2026-08-09) — O VÃO DE 1920 É ASSIMÉTRICO DE PROPÓSITO
            ============================================================

            `items-center` com `py` igual distribui a sobra em partes iguais, e
            em telas altas essa sobra é grande: medido no build de produção, em
            1920 × 1080 sobravam **164,8px acima da etiqueta e 164,8px abaixo do
            CTA**. O vão de baixo é o que separa o bloco do seu próprio seletor —
            é ele que fazia a régua ler como "barra solta embaixo" em vez de
            parte da composição.

            `2xl:pb-8` contra `2xl:pt-24` desloca o conjunto para baixo dentro do
            mesmo palco: o vão de baixo encolhe e o de cima cresce. A troca é
            deliberada, e não simétrica por acidente — o vão de cima passa a
            mostrar o alto da cena (coifa, luminárias, o trecho onde o `.scrim`
            abre desde 2026-08-08), que é fotografia; o de baixo era grafite
            liso sem função.

            **`items-center` continua**, e o `py` é constante nos três estados:
            a correção do salto entre estados (pisos em `em` + centragem) não é
            afetada — o bloco desce igual nos três.

            Só a partir de `2xl`. Medido, 1366 × 768 e 1024 × 768 já fecham com
            **sobra zero** (o `py-14` é o espaçamento inteiro ali), então
            qualquer deslocamento nessas faixas empurraria a faixa de métricas
            para fora da primeira tela.
          */
          /*
            `lg:py-12 xl:py-14` (2026-08-09): em 1024–1279 a coluna de leitura
            tem 480px e o par de CTAs (295 + 269) **não cabe numa linha** — ele
            quebra, que é a adaptação correta ali, e a dobra cresceu 74px. Doze
            unidades de recuo em vez de catorze devolvem 16px desses 74 sem
            mexer em 1440/1920, onde o par fica lado a lado e o recuo de 14
            continua sendo o valor medido.
          */
          /*
            ============================================================
            REEQUILÍBRIO APÓS A SAÍDA DA FAIXA (2026-08-09)
            ============================================================

            `2xl:pt-24 2xl:pb-8` → `2xl:pt-32 2xl:pb-6`.

            Com `items-center`, a sobra do palco é repartida em partes iguais e
            o recuo é o que desequilibra de propósito: o vão de cima passa a
            valer `pt + sobra/2` e o de baixo `pb + sobra/2`, então a diferença
            entre os dois é exatamente `pt − pb`.

            A faixa de métricas devolveu ~96px de sobra ao palco, e com o recuo
            anterior metade deles foi para o vão **de baixo** — o trecho entre o
            par de CTAs e o seletor, que é scrim liso e não tem função. Medido
            em 1920 × 1080 logo depois da remoção: 234px acima da etiqueta e
            167px abaixo do CTA.

            Abrir a diferença de 64 para 104px move o conjunto para baixo dentro
            do mesmo palco: o vão de baixo encolhe e o de cima cresce — e o de
            cima mostra o alto da cena (coifa, luminárias, o trecho onde o
            `.scrim` abre), que é fotografia, não vazio. A outra metade dos 96px
            foi para a altura do próprio seletor (ver `2xl:min-h-32`).

            Só a partir de `2xl`. Medido, 1440 e 1024 não têm essa folga: em
            1440 os dois vãos já fecham em 143 e 133px com o `xl:py-14`
            simétrico, e em 1024 a dobra continua excedendo o viewport.
          */
          /*
            ============================================================
            ALTURA RESPONSIVA (2026-08-09) — OS DOIS VÃOS DO TELEFONE
            ============================================================

            `pb-10` → `pb-8` e o recuo da cena `+2rem` → `+1,5rem`, os dois
            **só abaixo de `lg`** (o `lg:py-12` já cobre 1024 para cima, e
            1440/1920 não são tocados nesta rodada).

            Medido em 390 × 844 antes da correção: o vão entre a base da
            fotografia e a etiqueta somava 42,2px (32 de recuo mais 10,2 de
            entrelinha morta da etiqueta — ver o `flex` no `<p>`, abaixo) e o
            vão entre o último CTA e o seletor, 40px. São 82px de grafite liso
            nas duas emendas de uma dobra que excedia a janela em 70,8.

            8px em cada um devolve 16px sem que nenhuma das duas emendas perca
            a função: 24px continuam separando a cena do texto e 32px, a ação
            do seletor — ambos acima do vão de 16px que o próprio par de CTAs
            usa entre si nessa largura.
          */
          /*
            ============================================================
            RECOMPOSIÇÃO P1 (2026-08-10) — O VÃO DE BAIXO ENCOLHE PELOS
            DOIS LADOS
            ============================================================

            Com `items-center`, o vão abaixo do par de CTAs vale
            `pb + sobra/2`, e a sobra é `altura do painel − altura do bloco −
            pt − pb`. Ou seja: **`pb` entra duas vezes na conta de baixo e `pt`
            só uma**. Reduzir `pb` e compensar em `pt` move o conjunto para
            baixo sem mexer na altura de nada.

            Medido no build de produção, vão entre a base do par de CTAs e a
            aresta superior da chapa, na cena de Equipamentos:

              viewport   antes desta rodada   primeira montagem   agora
              1920           114,2px              145,5px         117,5px
              1440           107,2px              135,7px         112,0px

            A coluna do meio é a plataforma nova antes deste ajuste: a chapa
            passou a ser mais compacta que a faixa que ela substituiu (168px
            contra 190 em 1920) e a diferença caiu inteira no vão. Os dois
            ajustes que fecham a conta são este `pb`/`pt` e a altura própria da
            baia (ver `min-h` no botão, abaixo).

            **E o que sobra de vão agora é cena, não grafite.** A máscara do
            `.scrim` abre a partir de 68% da altura do palco, que é onde este
            vão começa — o trecho entre a ação e a decisão passou a mostrar o
            piso, o rodapé da linha de cocção e a fuga do corredor. Zerar o vão
            seria socar o conteúdo contra o controle, que é o que o briefing
            proíbe; o que ele pedia era que o espaço deixasse de ser morto.

            Abaixo de `lg` a conta é outra (o palco é fluxo vertical, não
            centragem): ali os cortes são diretos e estão medidos no bloco de
            altura do telefone, mais abaixo.
          */
          /*
            ============================================================
            OS RECUOS DE DESKTOP SÃO `--u`, NÃO `rem` (2026-08-11)
            ============================================================

            Eram `lg:py-12 xl:py-14 xl:pb-8 xl:pt-16 2xl:pb-0 2xl:pt-36`, e os
            números continuam os mesmos em tela alta — 48/48, 64/32 e 144/0.
            O que muda é que agora comprimem com a janela: `2xl:pt-36` sozinho
            são 144px que nunca encolhiam, e era o maior item da altura natural
            de 864px que punha a fileira de portas fora da tela em janelas
            baixas. Ver o bloco `--u` no módulo para a medição completa.

            Abaixo de `lg` nada disto se aplica: ali o palco é fluxo vertical,
            `--u` vale 1px e `pb-4` / `pt-[calc(var(--media-h)+1rem)]` ficam
            exatamente como estavam.
          */
          className={cn(
            'relative z-10 flex min-h-0 flex-1 items-center pb-4 pt-[calc(var(--media-h)+1rem)]',
            'lg:pb-[calc(48*var(--u))] lg:pt-[calc(48*var(--u))]',
            'xl:pb-[calc(32*var(--u))] xl:pt-[calc(64*var(--u))]',
            '2xl:pb-0 2xl:pt-[calc(144*var(--u))]',
          )}
        >
          {/*
            Sem `w-full`: desde G-1 a casca resolve a **própria** largura
            (`width: min(teto, 100% − 2 × gutter)`). Um `w-full` aqui venceria
            por ordem de camada — utilities vêm depois de components — e
            devolveria a coluna à largura inteira do palco, levando o `h1` para
            a aresta da janela.
          */}
          <Container>
            {/*
              ============================================================
              TROCA DE ESTADO (2026-08-09) — O `key` DO BLOCO SAIU
              ============================================================

              Até aqui este `div` tinha `key={state.id}`: trocar de estado
              **remontava a coluna inteira** — etiqueta, título, intenção e a
              linha de ação com os dois CTAs — e a animação escalonada do
              módulo (`.enter`) rodava de novo do zero a cada clique.

              Medido no build de produção, antes da correção: marcando os nós
              antes do clique e procurando a marca depois, `[data-hero-cta]` e
              `[data-hero-cta-wa]` **não sobreviviam** à troca (o seletor e a
              faixa de métricas sobreviviam, porque estão fora deste bloco). E
              a linha de ação renderizava `contentIn 340ms com delay 180ms`:
              como `.enter` usa `both`, ela ficava em `opacity: 0` durante os
              180ms de atraso e só então subia 10px até aparecer — meio
              segundo em que o par de botões **sumia e voltava**. Era isso, e
              não a foto (que já faz crossfade entre camadas montadas), que
              produzia a sensação de a Hero inteira recarregar.

              Sem `key`, nada aqui desmonta. `.enter` continua no lugar e
              continua rodando **uma vez, no carregamento da página** — a
              entrada escalonada da dobra é preservada exatamente como estava.
              O que muda de estado para estado é só o texto, por dentro
              (ver `.swap`, abaixo), e o CTA primário, que troca rótulo e
              destino sem sair do DOM.

              **Largura de leitura controlada**, em quatro degraus:

                até `lg` ....... 560px
                1024–1279 ...... 480px
                1280–1535 ...... 640px
                ≥1536 .......... 704px

              ============================================================
              DIREÇÃO VISUAL (2026-08-08) — LARGURA SOBE, MENOS EM 1024–1279
              ============================================================

              O degrau de 480px em 1024–1279 nasceu para não invadir a
              "prancha de projeto", um painel contido que Projetos usava até a
              rodada P1 — essa razão original saiu de cena (os três estados
              sangram o palco inteiro desde P1). A primeira tentativa desta
              rodada leu esse degrau como puramente herdado e o alinhou aos
              outros três em 560px, pela leitura de "coluna com presença".

              **Medição pegou o que a leitura não previu.** Alargar a coluna em
              1024 não esbarra em nenhum painel, mas põe a linha de texto mais
              longa mais perto da borda direita do `.scrim` — cujo degradê
              horizontal já é mais raso nesse viewport (a mesma razão que fez
              1024 ser "o pior caso" na tabela de contraste de P2, no módulo
              CSS). Resultado, medido com a metodologia de P2 (pior pixel real
              sob o corpo de texto): o parágrafo de Consultoria caiu para
              4,48:1 em 1024×768 — reprova o piso de 4,5:1. Os outros três
              degraus (560/640/704) passam com folga porque a coluna aí é mais
              estreita relativa à largura da tela (560 e 640 ainda deixam mais
              distância até a borda do `.scrim`) ou porque a tela é larga o
              bastante para o degradê já ter caído a zero bem antes da margem
              direita da coluna.

              A correção é local: **1024–1279 volta a 480px** — a largura que
              já era seguro por medição desde antes desta rodada — e os outros
              três degraus (560/640/704) ficam como pedido. "Coluna com
              presença" vale onde a medição confirma que cabe sem reabrir
              contraste; não vale como valor uniforme nos quatro degraus.

              **Quarto degrau (novo nesta rodada).** Em 1586 e 1920px o corpo
              do `h1` já bateu no teto do `clamp` (54px) mas a coluna de 640px
              não: Equipamentos, o título mais longo, passou de 3 para 4
              linhas — o mesmo salto de altura entre estados que a rodada P1
              eliminou no desktop, reaberto aqui só nas duas larguras mais
              extremas. `2xl:max-w-[44rem]` (704px, a partir de 1536px) dá
              largura suficiente para a linha de quebra mais longa
              ("profissional, especificados") caber, e Equipamentos volta a 3
              linhas — e o parágrafo, medido de novo com a coluna maior,
              continua acima de 4,5:1 (14,7–16,3:1 nos dez viewports).
            */}
            {/*
              ============================================================
              HARMONIZAÇÃO (2026-08-09) — O QUARTO DEGRAU VAI A 48rem
              ============================================================

              44rem (704px) numa tela de 1920 é 37% da largura: com o `h1` já
              no teto do `clamp`, o bloco textual ocupava pouco e o palco lia
              vazio — o "pouca densidade compositiva" desta rodada.

              ============================================================
              O TETO DESTE DEGRAU É O CONTRASTE, NÃO A LEITURA
              ============================================================

              A primeira tentativa foi 52rem (832px) com o `h1` a 3,875rem.
              Medido no build de produção, isso **reprovou**: o pior pixel sob
              o `h1` de Equipamentos em 1920 × 1080 foi rgb(130,123,115) e a
              razão caiu para **3,58:1**, contra 6,96:1 antes da mudança.

              O erro de raciocínio vale registrar, porque é fácil repetir: não
              basta a coluna terminar **dentro** da área coberta pelo `.scrim`.
              O degradê horizontal cai de 0,82 (46%) para 0,42 (62%) e a 0
              (78%); a 832px a última linha do título chegava a x=1132, ou 59%
              da largura do palco, onde a cobertura já está em ~0,47 — e 0,47
              não segura o reflexo de inox da linha de cocção que passa
              exatamente ali. O que importa é a **opacidade naquele x**, não
              estar antes do ponto zero.

              48rem (768px) põe o fim da coluna em x=1068 (55,6%), onde a
              cobertura ainda está em ~0,58, e o par corpo × coluna volta a
              passar com folga — remedido abaixo. O ganho de presença sobre a
              baseline continua real (coluna +64px, corpo +4px) sem escurecer
              mais um pixel de fotografia e sem tocar o `.scrim`, que é
              vocabulário já aprovado por medição.

              O degrau de 1024–1279 **não** muda: é lá que a medição reprovou
              a 560px numa rodada anterior, e 480px segue sendo o valor seguro.
            */}
            {/*
              `data-saindo` é a **saída** do bloco inteiro — etiqueta, título,
              intenção e a linha de ação, juntos. Ele fica ligado durante os
              `COPY_OUT_MS` que separam a escolha da substituição do texto no
              DOM, e é o que faz a mensagem sair antes de a nova chegar em vez
              de ser cortada no mesmo quadro. A entrada é dos filhos (`.swap`),
              não daqui: assim o bloco volta inteiro e cada linha ainda sobe os
              seus 8px.
            */}
            <div
              data-saindo={copyOut ? 'true' : undefined}
              className={cn(
                styles.copyBlock,
                'max-w-[35rem] lg:max-w-[30rem] xl:max-w-[40rem] 2xl:max-w-[48rem]',
              )}
            >
              <p
                className={cn(
                  styles.enter,
                  /*
                    ============================================================
                    ALTURA RESPONSIVA (2026-08-09) — `flex` ABAIXO DE `lg`
                    ============================================================

                    Como `inline-flex`, este `<p>` é uma caixa **de nível
                    inline**: ela participa de uma linha do bloco pai e essa
                    linha tem a entrelinha herdada do `<div>`, não a da
                    etiqueta. O resultado é um vão que nenhuma classe declara e
                    que nenhuma medida do projeto prevê — medido no build de
                    produção, **10,2px em 390 × 844 e 9,6px em 1024 × 768** de
                    espaço morto entre o topo da coluna e o topo real da
                    etiqueta.

                    `flex` torna a caixa de nível bloco e a linha desaparece com
                    a entrelinha dela. A etiqueta não muda de tamanho, de
                    posição horizontal nem de aparência: o `<p>` passa a ocupar
                    a largura da coluna, mas o conteúdo continua sendo traço +
                    texto alinhados à esquerda, exatamente como antes.

                    `lg:inline-flex` devolve o comportamento atual de 1024 para
                    cima — 1440 e 1920 ficam byte a byte como estavam, que é o
                    requisito desta rodada.
                  */
                  /*
                    ============================================================
                    INVENTÁRIO DE AMARELO (2026-08-10) — A ETIQUETA CEDE O TOM
                    ============================================================

                    A primeira dobra tinha **seis** regiões amarelas
                    simultâneas: a marca, o CTA do cabeçalho, o traço e o texto
                    da etiqueta, o CTA da dobra, o acento do estado ativo e a
                    seta da porta ativa. Amarelo que aparece seis vezes não é
                    acento, é cor de fundo distribuída.

                    A hierarquia que o projeto fixa é marca > ação > estado, e o
                    que perde força primeiro é o decorativo. A etiqueta não é
                    nenhum dos três — é um rótulo — então é ela que cede: o
                    **texto** passa a `canvas/80` e o **traço** continua amarelo,
                    como hairline. A leitura não muda (o traço é o que marca a
                    etiqueta como etiqueta) e o CTA amarelo, quarenta linhas
                    abaixo, deixa de disputar com um rótulo de 13px.

                    Isto não toca a identidade nem a logo, e é reversível numa
                    linha se a direção preferir a etiqueta amarela de volta.
                  */
                  'flex items-center gap-3 font-condensed font-semibold uppercase tracking-[0.16em] text-canvas/80 lg:inline-flex',
                  /* `leading` explícita e depois do `text-[…]` — ver o `h1`. */
                  'text-[0.75rem] leading-[1.3] sm:text-[0.8125rem]',
                  /*
                    ---------- Piso da etiqueta — dispensado na rodada P1 ----------

                    A reserva de duas linhas existia por causa da etiqueta
                    antiga de Equipamentos ("EQUIPAMENTOS PARA COZINHAS
                    PROFISSIONAIS", 41 caracteres), que quebrava em coluna
                    estreita. Essa etiqueta foi trocada por "EQUIPAMENTOS" (12
                    caracteres) nesta rodada — ver `src/data/v2/home.ts` — para
                    não repetir a abertura do `h1`. A mais longa que sobra,
                    "Projetos para food service" (27 caracteres), é bem mais
                    curta que a que causava a quebra medida, e não quebra em
                    nenhuma largura suportada. Sem quebra, não há salto a
                    prevenir, e o piso vira só vazio abaixo da etiqueta — por
                    isso saiu.
                  */
                )}
              >
                <span aria-hidden="true" className="h-[2px] w-7 shrink-0 bg-yellow" />
                {/*
                  ---------- O que troca é o texto, não o elemento ----------

                  A `key` fica no **texto**, que é a menor unidade que
                  realmente muda de estado para estado. O `<p>` (e o traço
                  amarelo ao lado dele) permanecem montados, então a troca não
                  recria a etiqueta: recria a palavra dentro dela, com o
                  crossfade curto de `.swap`. Mesmo padrão no `h1` e na
                  intenção, abaixo.
                */}
                <span key={copy.id} className={cn(styles.swap, 'block')}>
                  {copy.eyebrow}
                </span>
              </p>

              <h1
                id="hero-titulo"
                style={{ '--delay': '60ms' } as CSSProperties}
                className={cn(
                  styles.enter,
                  /*
                    **Peso 700, não 800.** O extrabold em 50px numa coluna de
                    600px é o "excesso de peso visual no título" do briefing: a
                    mancha do `h1` chegava a dominar a cena inteira. A hierarquia
                    continua clara — é o único texto grande da dobra.
                  */
                  /*
                    ---------- Ritmo, e não espaçamento uniforme ----------

                    Os três vãos da coluna eram 20 / 20 / 28px em 1440 —
                    praticamente iguais, e por isso etiqueta, título, intenção e
                    ação liam como um bloco vertical só. A regra agora é de
                    proximidade: o que pertence junto encosta, e o vão só abre
                    onde a **função** muda.

                      etiqueta → título .... 12px  (rótulo do próprio título)
                      título → intenção .... 20px  (mesma voz, outra frase)
                      intenção → ação ...... 40px  (de ler para agir)
                  */
                  /*
                    `lg:mt-[calc(12*var(--u))]` — os mesmos 12px em tela alta,
                    comprimindo com a dobra abaixo do limiar. Ver o bloco `--u`
                    no módulo.
                  */
                  'mt-3 font-sans font-bold tracking-[-0.025em] text-canvas lg:mt-[calc(12*var(--u))]',
                  /*
                    ============================================================
                    `leading-*` DEPOIS de `text-[…]`, NUNCA ANTES
                    ============================================================

                    `tailwind-merge` declara `leading` como grupo em conflito com
                    `font-size` — em Tailwind um utilitário `text-sm` também
                    define entrelinha, então o merge descarta qualquer `leading`
                    **anterior**. Com `leading-[1.06]` escrito antes do
                    `text-[clamp(…)]`, a classe simplesmente não chegava ao DOM:
                    medido, o `h1` renderizava com entrelinha 1,65 herdada
                    (80,8px em 1440), e as três linhas ocupavam 242px em vez de
                    153. Era metade da razão de o título "dominar a tela".

                    É a mesma família de armadilha que `CLAUDE.md` já registra
                    para `cn()` e as escalas tipográficas customizadas.

                    ============================================================
                    O CORPO É QUE CEDE, NÃO A COPY (2026-08-08)
                    ============================================================

                    O `h1` aprovado tem 74 caracteres — "Equipamentos para
                    cozinha profissional, especificados para a sua operação." —
                    e é copy travada (ver `src/data/v2/home.ts`). O corpo é
                    variável de layout, a copy aprovada não.

                    ============================================================
                    DIREÇÃO VISUAL (2026-08-08) — MAIS AUTORIDADE, MENOS
                    HIERARQUIA ACHATADA
                    ============================================================

                    A rodada anterior fechou o `h1` em 2,875rem (46px) no
                    desktop para caber em três linhas contra o antigo teto da
                    coluna (600px). O gestor apontou o resultado como pequeno
                    demais para uma dobra deste tamanho — o título não lia como
                    a peça de maior autoridade da composição. Dois ajustes
                    somados resolvem sem tocar a copy: a coluna de leitura
                    ganhou largura (ver o comentário do `key={state.id}` acima:
                    560/560/640px, contra 560/480/600 antes) e o corpo subiu
                    junto — o mesmo texto, na mesma coluna mais larga, cabe nas
                    mesmas três linhas com fonte maior.

                    Tetos remedidos no navegador, Manrope bold real, contra a
                    linha mais longa da quebra natural:

                      ≥1280 .. coluna 640px → 3,375rem (54px) rende 3 linhas
                      1024–1279 coluna 560px → 2,375rem rende 3 linhas
                      <640 ... coluna cheia → 2,375rem rende 4 linhas em 390

                    Os pisos que acompanhavam esta medição saíram em
                    2026-08-09 — ver o bloco no topo do arquivo.
                  */
                  /*
                    ============================================================
                    HARMONIZAÇÃO (2026-08-09) — O TETO SOBE DE 3,375 PARA 3,625rem
                    ============================================================

                    3,375rem (54px) é o teto do `clamp`, e em 1920 ele **já
                    estava saturado**: 3,4vw daria 65px, então de 1536px para
                    cima o título parava de crescer enquanto o palco continuava.
                    O resultado medido era 170,1px de mancha de título num palco
                    de 899px de altura — o "vazio excessivo" desta rodada visto
                    pelo outro lado.

                    3,625rem (58px) com a coluna de 48rem (ver acima) mantém
                    Equipamentos em **3 linhas**: a linha de quebra mais longa
                    pede ~756px contra os 768 disponíveis. É o par
                    corpo × coluna que cresce junto — subir só o corpo tiparia
                    para 4 linhas, subir só a coluna não daria presença.

                    O par 3,875rem × 52rem foi testado primeiro e **reprovou no
                    contraste** (3,58:1 sob o `h1` de Equipamentos em 1920);
                    ver o comentário da coluna, acima, para a medição e o
                    motivo. O teto desta faixa é o contraste, não a leitura.

                    A copy não é tocada: o teto é variável de layout, o texto
                    aprovado não (`src/data/v2/home.ts`).
                  */
                  /*
                    ============================================================
                    O CORPO DO `h1` ENTRA NA COMPRESSÃO (2026-08-11)
                    ============================================================

                    Era `lg:text-[clamp(2.375rem,3.4vw,3.375rem)]` e
                    `2xl:text-[3.625rem]`, e **os valores em tela alta são
                    exatamente os mesmos**: `max(38u, min(3.4vw, 54u))` com
                    `--u` saturado em 1px é, termo a termo, o `clamp` anterior.

                    O bloco do título é o maior item da coluna (182,7px em
                    1536 × 864, três linhas a 58px), então comprimir vãos sem
                    comprimir o corpo não fecharia a conta de altura em janela
                    baixa — seria vão espremido ao redor de um título intacto,
                    que é o oposto de composição proporcional. A entrelinha é
                    unitária (1,05), então ela acompanha o corpo sozinha.

                    O teto continua sendo o **contraste**, não a leitura: o par
                    corpo × coluna de 3,625rem × 48rem está medido no comentário
                    acima e não sobe. Comprimir só desce, e descer afasta a
                    última linha da borda direita do `.scrim` — o lado seguro.

                    `leading-*` continua **depois** do `text-[…]` — a armadilha
                    de `tailwind-merge` documentada logo acima vale igual aqui.
                  */
                  'text-[clamp(1.75rem,7.8vw,2.375rem)] leading-[1.1]',
                  /*
                    ---------- O teto em `--u` é por degrau, e tem conta ----------

                    `3.4vw` é o termo de **largura** e continua mandando em tela
                    alta: em 1024 ele rende 34,8px, em 1440 rende 48,96 e em
                    1535 rende 52,2 — sempre abaixo do teto em `--u`, que por
                    isso não aparece. É a única forma de o corpo continuar
                    idêntico ao `clamp` anterior acima do limiar.

                    O teto de cada degrau é o **menor valor que ainda fica acima
                    do maior `3.4vw` daquela faixa**, para que a altura comece a
                    morder assim que a janela aperta, e não só em compressão
                    extrema:

                      lg  1024–1279 ... 3,4vw chega a 43,5px → teto 44u
                      xl  1280–1535 ... 3,4vw chega a 52,2px → teto 53u

                    Com o teto anterior (54u nos dois) a altura só mordia abaixo
                    de u≈0,80, e a dobra continuava ~32px além da janela no meio
                    das duas faixas. Em `2xl` não há termo de largura: o corpo é
                    fixo em 58px desde 1536, então ele é múltiplo puro de `--u`.
                  */
                  'lg:text-[max(calc(38*var(--u)),min(3.4vw,calc(44*var(--u))))] lg:leading-[1.05]',
                  'xl:text-[max(calc(38*var(--u)),min(3.4vw,calc(53*var(--u))))]',
                  '2xl:text-[calc(58*var(--u))]',
                )}
              >
                <span key={copy.id} className={cn(styles.swap, 'block')}>
                  {copy.headline}
                </span>
              </h1>

              <p
                style={{ '--delay': '120ms' } as CSSProperties}
                className={cn(
                  styles.enter,
                  /*
                    `max-w` em `ch`, não em `rem`: o limite que importa aqui é o
                    comprimento de linha (52 caracteres), e ele acompanha o
                    corpo. Resolve para ~470px no telefone e ~540px no desktop —
                    dentro da faixa de 480–560 pedida.

                    `leading-[1.5]` **depois** do `text-[…]` — ver o bloco do
                    `h1` acima; aqui valia o mesmo descarte silencioso.
                  */
                  'mt-4 max-w-[52ch] font-sans font-medium text-canvas/85 lg:mt-[calc(20*var(--u))]',
                  /*
                    Direção visual (2026-08-08): o bump é só no desktop
                    (17px → 18px). Testado em 16px no mobile também — em
                    320px o texto de Equipamentos foi de 4 para 5 linhas
                    (medido: 124px contra o piso de 74,4), empurrando o CTA
                    mais perto do fim da tela no telefone mais estreito
                    suportado. Abaixo de `lg` o corpo fica como estava (15px);
                    a "leitura mais editorial" pedida vale onde há coluna
                    para sustentá-la sem custar linha.
                  */
                  /*
                    18px em tela alta, comprimindo com a dobra — com **piso de
                    15px**, que é o corpo que este mesmo parágrafo já usa abaixo
                    de `lg`. O piso é o que impede a compressão de levar o corpo
                    de leitura abaixo do que a V1 aceita em qualquer superfície;
                    quando ele morde, quem continua cedendo são os vãos.

                    `leading-[1.6]` é unitário e acompanha o corpo. Ordem
                    `text-` → `leading-` preservada de propósito.
                  */
                  'text-[0.9375rem] leading-[1.5] lg:text-[max(0.9375rem,calc(18*var(--u)))] lg:leading-[1.6]',
                )}
              >
                <span key={copy.id} className={cn(styles.swap, 'block')}>
                  {copy.intent}
                </span>
              </p>

              <div
                style={{ '--delay': '180ms' } as CSSProperties}
                /*
                  Direção visual (2026-08-08): 32/40px deixava o CTA colado ao
                  parágrafo — "elementos socados no meio" incluía essa
                  transição. 40/48px separa a ação de ler.
                */
                /*
                  ============================================================
                  HARMONIA (2026-08-09) — A AÇÃO VIROU UM PAR
                  ============================================================

                  O CTA principal era o único elemento da linha de ação, e uma
                  massa amarela de ~295 × 58px sozinha numa coluna de 768 deixava
                  o resto da linha vazio — parte da "sensação de vazio mal
                  resolvido" desta rodada vinha daí, não só do respiro vertical.

                  Agora são dois: o preenchido (prioritário, inalterado) e o de
                  WhatsApp, contornado. `flex-wrap` com `gap-3` porque abaixo de
                  `sm` os dois empilham — e empilham **na largura do conteúdo**
                  (`items-start`), não esticados, para não virar dois blocos
                  cheios num telefone.
                */
                /*
                  ============================================================
                  TROCA DE ESTADO (2026-08-09) — ESTA LINHA NÃO REAGE MAIS
                  ============================================================

                  `.enter` continua aqui, mas agora ele roda **uma vez só**, no
                  carregamento: sem o `key` no bloco de conteúdo (ver acima),
                  nada nesta linha desmonta quando o pilar muda. Antes, os
                  180ms de atraso de `.enter` deixavam o par de botões em
                  `opacity: 0` a cada clique.
                */
                /*
                  ============================================================
                  ALTURA RESPONSIVA (2026-08-09) — 1024 VOLTA A UMA LINHA SÓ
                  ============================================================

                  **Era daqui que vinham os 62px de excesso de 1024 × 768, e
                  não de uma soma difusa de vãos.** Medido no build de
                  produção, com a coluna de leitura em 480px (`lg:max-w-[30rem]`):

                    CTA amarelo ......... 326,0px
                    vão ................. 16,0px
                    CTA de WhatsApp ..... 266,8px
                    ─────────────────────────────
                    linha pedida ........ 608,8px  contra 480 disponíveis

                  O par quebrava, a linha de ação passava de 58 para **132px**
                  e a dobra crescia 74px — mais que os 62 de excesso medidos.
                  Resolver a quebra resolve o viewport inteiro; nada mais
                  precisa ceder ali.

                  Duas correções somadas, ambas escopadas a 1024–1279 (`lg`,
                  com `xl` restaurando o valor de hoje — 1440 e 1920 não são
                  tocados):

                    1. **os dois botões encolhem um degrau** (rótulo 17 → 16px,
                       recuos e cela do ícone menores — ver `HeroCta` e
                       `HeroWhatsappCta`), levando o par de 608,8 para ~538px
                       sem que nenhum rótulo quebre e sem descer de 58px de
                       altura, bem acima do piso de 44 de toque;
                    2. **`lg:w-max`** — a linha de ação passa a medir o próprio
                       conteúdo em vez de herdar os 480px da coluna de leitura.

                  O ponto 2 é o que evita a alternativa ruim: alargar a coluna
                  de leitura nessa faixa **já foi medido e reprovou** — a 560px
                  o parágrafo de Consultoria caiu para 4,48:1 em 1024 × 768
                  (ver o comentário da coluna, acima). A largura de leitura
                  fica onde a medição a travou, em 480px; quem ganha largura é
                  só o par de botões, que é massa opaca e não depende do
                  `.scrim` para contrastar. O par termina em x=578 de 1024 —
                  dentro do palco, sem overflow, e a 221px da borda direita.

                  `xl:w-auto` devolve o comportamento herdado em 1280+, onde a
                  coluna de 640px já comporta os 608,8px do par em tamanho
                  cheio.

                  `mt-10` → `mt-8` **só abaixo de `lg`**: 40px entre ler e agir
                  é a medida do desktop, e no telefone ela concorre com os
                  outros dois vãos da mesma dobra. `lg:mt-10` e `xl:mt-12`
                  ficam como estavam.
                */
                className={cn(
                  styles.enter,
                  /*
                    `mt-8` → `mt-6` abaixo de `lg` (2026-08-10): parte dos 45px
                    que a chapa nova pede de volta no telefone — ver o bloco de
                    altura no módulo. 24px continuam separando ler de agir, e
                    continuam acima do vão de 12px que o próprio par usa entre
                    os dois botões nessa largura. `lg:mt-10` e `xl:mt-12` ficam.
                  */
                  'mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4',
                  /*
                    40/48px em tela alta — o vão "de ler para agir", o maior da
                    coluna. Comprime com a dobra; ver o bloco `--u` no módulo.
                  */
                  'lg:mt-[calc(40*var(--u))] lg:w-max lg:gap-3 xl:mt-[calc(48*var(--u))] xl:w-auto xl:gap-4',
                )}
              >
                <HeroCta activeId={copy.id} />
                <HeroWhatsappCta topic={copy.id} />
              </div>
            </div>
          </Container>
        </div>

        {/* ================= A BASE DA CENA ================= */}
        {/*
          ============================================================
          A FAIXA DE MÉTRICAS SAIU DA DOBRA (2026-08-09)
          ============================================================

          A rodada anterior tinha trazido `18 anos / Brasil / Ver as seis
          categorias` para dentro do palco, na mesma superfície do seletor, para
          que ela deixasse de ler como uma barra anexada. Funcionou como
          integração e não resolveu o problema de fundo: a dobra continuava
          fechando com uma faixa factual que não é nem cena, nem argumento, nem
          navegação principal. **Decisão do gestor: ela sai da Hero.**

          O que sobra aqui é só o seletor dos três pilares, e a `.base` volta a
          ser o que o antigo `.rail` era — a superfície que assenta os três
          controles sobre a fotografia. O degradê volta às paradas originais
          (ver o módulo).

          Consequências de conteúdo, registradas de propósito:

            · **a idade continua na página** — `differentials.ts` ("17 anos
              dentro de operações de alimentação") e `credibility-section.tsx`
              ("ao longo de 17 anos"). Eram "18" até 2026-08-11, quando o
              comercial confirmou 17;
            · **`Brasil / abrangência de atendimento` deixa de aparecer na
              home.** Era exibido só aqui. Nada foi inventado nem alterado em
              `site.ts`: o dado continua lá, sem consumidor na V2;
            · **`Ver as seis categorias de equipamento`** apontava para
              `#equipamentos`, que é a seção imediatamente abaixo da dobra —
              como navegação, era redundante com a própria rolagem.

          `homeHeroMetrics` e `heroSecondary` continuam exportados em
          `src/data/v2/home.ts` e agora sem consumidor. Ficam como estão: são
          dados, não interface morta, e apagá-los seria mexer num arquivo que
          esta rodada não deve tocar.
        */}
        {/*
          ============================================================
          A BASE DA DOBRA — A ÁRVORE E A FUNÇÃO DE CADA NÍVEL
          ============================================================

          `.deck` → `Container` → `.decision` → instrução + três portas.

            `.deck` ..... transição tonal de largura inteira. **Nunca chega a
                          opaco**, e é isso que faz a base nascer do palco em
                          vez de ser colada nele — a cena continua atravessando
                          o vão entre as portas;
            `Container` . a casca comum do site, que põe a instrução e o texto
                          da primeira porta na guia do `h1`;
            `.decision` . só agrupa; **qualquer superfície aqui reconstituiria
                          a chapa** que a rodada de 2026-08-11 desmontou;
            portas ...... três objetos separados por vão real.

          O histórico das cinco topologias que este lugar já teve está no módulo
          CSS, junto das medições que reprovaram cada uma. O que ele não deve
          voltar a ser: uma chapa subdividida por fios, com a instrução como
          linha de cabeça — a forma de um painel administrativo.
        */}
        <div className={cn(styles.deck, 'shrink-0')}>
          {/*
            Legenda do render — só Projetos tem (`DEC-008`: material de projeto
            nunca aparece sem se declarar como tal).

            **Saiu de dentro dos `.frame` (2026-08-09).** Lá ela era
            `bottom: 7.5rem`, um número medido contra a altura do seletor
            daquele momento. Ancorada em `bottom: 100%` da própria base, ela
            assenta sempre imediatamente acima da superfície, qualquer que seja
            a altura dela — foi o que permitiu a base crescer com as métricas e
            encolher de novo agora que elas saíram, sem número nenhum a
            remedir nas duas vezes.

            Sai abaixo de `lg`: no palco em faixa do toque não sobra altura para
            uma linha extra sem invadir o texto que assenta logo abaixo da cena.
          */}
          {scene.media.caption ? (
            <p
              key={scene.id}
              className={cn(
                styles.mediaCaption,
                styles.swap,
                'hidden font-condensed text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-canvas/70 lg:block',
              )}
            >
              {scene.media.caption}
            </p>
          ) : null}

          <Container>
            {/*
              ============================================================
              A CHAPA FECHADA SAIU — TRÊS PORTAS, COM VÃO (2026-08-11)
              ============================================================

              O desenho anterior era **uma chapa** dividida em três baias
              encostadas, com fio divisório entre elas, e a instrução numa linha
              de cabeça dentro do mesmo objeto. Estava correto de gramática e
              reprovado de leitura: uma superfície contínua subdividida por
              fios, com um rótulo em cima e três células iguais embaixo, é a
              forma de um painel administrativo — e era assim que estava sendo
              lida.

              O que muda não é o acabamento das baias; é a **topologia**:

                · a chapa comum acaba. Cada porta passa a ser um objeto próprio,
                  com aresta própria, separada das vizinhas por vão real (ver
                  `.doors` no módulo). É por esse vão que o palco reaparece
                  **entre** os controles — a fotografia deixa de ser interrompida
                  por uma barra e passa a atravessar o sistema;
                · a instrução sai de dentro do objeto e sobe para uma linha
                  própria, com respiro medido até as portas. Ela deixa de ser
                  cabeçalho de tabela e passa a ser o que o briefing pede: a
                  micro-headline que **manda escolher**;
                · a altura cai de 96/112/128px para 80/88/96 — o controle fica
                  mais baixo e mais horizontal, e a altura devolvida vai para o
                  palco.

              O `role="tablist"`, a navegação por seta, o `tabindex` rotativo e
              o par `aria-selected`/`aria-controls` continuam idênticos: mudou o
              corpo do controle, não o contrato de acessibilidade.
            */}
            <div className={styles.decision}>
              {/*
                ---------- A instrução, agora numa linha só dela ----------

                Três coisas a tiram de "legenda" sem que ela chegue perto de
                disputar com o `h1` (15px contra 58, condensada caixa-alta contra
                sans de leitura):

                  · **corpo e peso** — subiu dois degraus desde os 13px
                    `semibold` de quando ela era cabeça de chapa; o valor
                    vigente e a razão dele estão no `<p>`, logo abaixo;
                  · **tracking menor** — 0,2em caía como código técnico e
                    obrigava o olho a soletrar, e o valor vigente é bem menor
                    que isso (ver o `<p>`): a frase volta a ser frase;
                  · **um traço amarelo à esquerda**, na guia. Ele não é
                    ornamento: é o mesmo traço da etiqueta do `h1`, no mesmo
                    eixo, e é o que liga a instrução ao bloco de conteúdo em vez
                    de deixá-la pousada sobre os controles.

                A régua que fechava a linha de cabeça até a aresta da chapa saiu
                junto com a chapa — sem objeto para fechar, ela voltaria a ser
                moldura.
              */}
              <div className={styles.decisionHead}>
                <span aria-hidden="true" className={styles.decisionTick} />
                <p
                  id="hero-seletor-instrucao"
                  /*
                    ============================================================
                    DE RÓTULO A COMANDO (2026-08-11) — E A CONDENSADA SAI
                    ============================================================

                    Copy travada. O que muda é o que a fazia continuar lendo como
                    legenda mesmo depois de ganhar linha própria:

                      · **a família.** Oswald condensada em caixa alta é o rótulo
                        comercial curto do projeto — botão, etiqueta, numeral,
                        cota. Numa frase de 42 caracteres ela obriga o olho a
                        soletrar letra a letra, e foi exatamente o sintoma
                        relatado. Manrope é a família de **leitura** do projeto
                        (`CLAUDE.md`: sans para H1…H4, parágrafos, navegação), e
                        é o que devolve a frase como frase. Isto **aproxima** a
                        tipografia da regra do projeto, não a afasta;
                      · **a caixa.** Sai o `uppercase`, entra a caixa que a copy
                        tem na origem (`railHint`, em `src/data/v2/home.ts`). O
                        texto não foi tocado — o que saiu foi a transformação
                        CSS que o estava deformando;
                      · **o `tracking`.** De 0,12em para 0,005em. Espaçamento de
                        rótulo em frase corrida é o que produz leitura de código
                        de peça;
                      · **o corpo.** 15px → 17px no desktop, dentro da faixa de
                        16–18 pedida, e 16px no telefone.

                    Continua sem disputar com o `h1`: 17px contra 58, peso 600
                    contra 700, e a 300px de distância vertical.
                  */
                  className={cn(
                    'font-sans font-bold text-canvas',
                    /*
                      14 / 16 / 19px. O degrau do telefone é medido, não
                      estético: a frase mede ~330px a 16px, e em 390 sobram 310
                      entre o traço e a margem — ela quebrava em duas linhas e a
                      dobra crescia 26,6px. A 14px ela mede ~289 e fecha numa
                      linha só.

                      ---------- 17 → 19px e `semibold` → `bold` (2026-08-11) ----------

                      O briefing pede que a instrução seja "nitidamente
                      percebida como instrução de escolha", e a 17px `semibold`
                      ela ainda era o menor texto de uma dobra que tem um `h1` de
                      58px logo acima. 19px `bold` a põe **acima do corpo de
                      leitura da página** (16px) em vez de abaixo dele: quem
                      varre a dobra encontra três massas nesta ordem — título,
                      ação, instrução —, e não título, ação, legenda.

                      O teto continua sendo o `h1`: 19 contra 58, peso 700 contra
                      700 mas em corpo três vezes menor, e a 300px de distância
                      vertical. Não há disputa possível.
                    */
                    'text-[0.875rem] leading-snug tracking-[0.005em]',
                    'sm:text-[1rem] lg:text-[1.1875rem]',
                  )}
                >
                  {homeHero.railHint}
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Frentes da Bianchini"
                aria-describedby="hero-seletor-instrucao"
                aria-orientation="horizontal"
                onKeyDown={onKeyDown}
                className={styles.doors}
              >
                {heroStates.map((item, index) => {
                  const selected = index === active
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        tabsRef.current[index] = node
                      }}
                      type="button"
                      role="tab"
                      id={`hero-aba-${item.id}`}
                      aria-selected={selected}
                      aria-controls="hero-painel"
                      /* Tabindex rotativo: o seletor inteiro é uma parada de `Tab`. */
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(index)}
                      className={cn(
                        'group/porta',
                        styles.door,
                        selected && styles.doorActive,
                        /*
                          `min-h` é piso, e a altura real vem do conteúdo mais o
                          recuo do módulo. 60px no telefone (contra o mínimo de
                          44 de alvo de toque) e 88/96/104 no desktop — a
                          geometria normativa de doc 01 §9.3.

                          A altura veio do **vão morto** entre o par de CTAs e o
                          seletor (medido em 112px em 1440, hoje ~88), não do
                          palco. O teto é a leitura: portas mais altas voltam a
                          ler como barra de navegação interna, que é o defeito
                          que custou as topologias anteriores.
                        */
                        'min-h-[3.75rem] lg:min-h-[5.5rem] xl:min-h-24 2xl:min-h-[6.5rem]',
                        /*
                          O anel de foco é desenhado por `.door::after` no
                          módulo: `ring` do Tailwind é `box-shadow`, e sombra
                          fica abaixo dos pseudo-elementos do próprio botão — a
                          superfície da porta o cobriria. Medido na rodada
                          anterior, o anel amarelo saía rgb(96,86,52) por isso.
                        */
                        'focus-visible:outline-none',
                      )}
                    >
                      <span className={styles.doorInner}>
                        <span className={styles.doorLine}>
                          <span
                            className={cn(
                              /* `leading` depois do `text-[…]` — ver o `h1`. */
                              'font-condensed uppercase transition-colors duration-200',
                              /*
                                Subiu um degrau em `lg` para cima (17 → 19px,
                                19 → 21 em 2xl). O nome da frente é o que a
                                porta **é**; a 17px ele ficava do tamanho da
                                situação logo abaixo (14px) e as duas linhas
                                liam como um parágrafo de duas linhas em vez de
                                título + complemento.
                              */
                              'text-[0.8125rem] leading-tight tracking-[0.04em]',
                              'sm:text-[1rem] lg:text-[1.1875rem] 2xl:text-[1.3125rem]',
                              /*
                                A escala de opacidade do projeto é de 5 em 5
                                (`tailwind.config.ts`): `text-canvas/78` não é
                                gerada, o elemento fica sem `color` e herda a
                                tinta escura do documento. Mesma família da
                                armadilha de `cn()` registrada em `CLAUDE.md` —
                                some sem erro de build e sem aviso.
                              */
                              selected
                                ? 'font-bold text-canvas'
                                : 'font-semibold text-canvas/85 group-hover/porta:text-canvas group-focus-visible/porta:text-canvas',
                            )}
                          >
                            {item.name}
                          </span>

                          {/*
                            A seta é o sinal de clicabilidade que **não depende
                            de cor nem de cursor** — que é o teste que o briefing
                            impõe, e o único que sobrevive no toque.

                            Some abaixo de 420px de janela, e o corte é medido:
                            em 320px cada porta tem ~99px úteis e "EQUIPAMENTOS"
                            a 12px pede ~81. A partir de 420px a porta passa de
                            132px e o par nome + seta cabe.
                          */}
                          <ArrowRightIcon
                            size={18}
                            aria-hidden="true"
                            className={cn(
                              styles.doorArrow,
                              'hidden shrink-0 transition-colors duration-200 min-[420px]:block',
                              selected ? 'text-yellow' : 'text-canvas/60',
                            )}
                          />
                        </span>

                        {/*
                          Complemento — a situação do cliente, em uma linha. Sai
                          abaixo de `sm`: em 390px cada porta tem ~120px e a
                          frase mais longa quebraria em quatro linhas. Quem cobre
                          essa ausência no telefone é a instrução, que nesta
                          composição é visível em todas as larguras.
                        */}
                        <span
                          className={cn(
                            'hidden text-[0.8125rem] leading-snug transition-colors duration-200 sm:block lg:text-[0.9375rem]',
                            selected ? 'text-canvas/90' : 'text-canvas/70',
                          )}
                        >
                          {item.cue}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Container>

        </div>
      </div>
    </section>
  )
}

/**
 * O CTA da dobra.
 *
 * Massa preenchida em amarelo, com a **cela da seta** separada do rótulo por um
 * fio de tinta — a gramática de instrumento (mostrador e comando) do resto do
 * vocabulário do site, e não a cápsula com ícone que qualquer biblioteca
 * entrega.
 *
 * O preenchimento do hover é `transform: scaleY` sobre um `::before`, nunca
 * `width` nem troca de `background-color`: é a mecânica de botão fixada em
 * `CLAUDE.md`, e `focus-visible` dispara exatamente o mesmo preenchimento.
 *
 * `Link` + `trackEvent` direto, e não `TrackedLink`: aquele envoltório existe
 * para manter um componente de servidor sem virar cliente, e esta dobra já é
 * cliente por causa do estado. Uma camada a menos, e o evento continua saindo
 * por `lib/analytics`, como manda a convenção.
 *
 * `min-h-12` no telefone é o piso de 48px pedido para o toque.
 *
 * Direção visual (2026-08-08): rótulo e caixa cresceram um degrau
 * (14/15/16px → 15/16/17px; caixa 48/54px → 48/58px) para equilibrar o peso
 * contra o `h1` maior desta rodada — sem chegar a competir com ele.
 */
function HeroCta({ activeId }: { activeId: HeroState['id'] }) {
  const state = heroStates.find((item) => item.id === activeId) ?? heroStates[0]

  return (
    <Link
      href={state.cta.href}
      data-hero-cta
      onClick={() => trackEvent(state.event, { origem: 'hero' })}
      className={cn(
        /*
          `lg:min-h-[…]` — 58px em tela alta, comprimindo com a dobra, com piso
          de 44px (o mínimo de alvo do projeto). Os dois CTAs carregam a mesma
          expressão porque eles são um par e precisam continuar com a mesma
          altura em qualquer janela. Ver o bloco `--u` no módulo.
        */
        'group/cta relative inline-flex min-h-12 items-stretch overflow-hidden rounded-[2px] bg-yellow sm:min-h-[3.625rem] lg:min-h-[max(2.75rem,calc(58*var(--u)))]',
        /*
          `lg:text-[1rem] xl:text-[1.0625rem]` (2026-08-09): um degrau a menos
          **só em 1024–1279**, a faixa onde o par de CTAs não cabia numa linha.
          É a menor parte da correção (ver o comentário da linha de ação): o
          grosso dos ~70px veio dos recuos e da cela do ícone. A altura da
          caixa não muda — continua 58px, contra o piso de 44 de toque.
        */
        'font-condensed text-[0.9375rem] font-semibold uppercase tracking-[0.05em] text-ink sm:text-[1rem] lg:text-[1rem] xl:text-[1.0625rem]',
        'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-yellow-bright',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'hover:before:scale-y-100 focus-visible:before:scale-y-100',
        pressState,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-graphite',
      )}
    >
      {/*
        ============================================================
        OS TRÊS RÓTULOS OCUPAM A MESMA CELA — E É ISSO QUE PRENDE O
        WHATSAPP NO LUGAR
        ============================================================

        Os três rótulos têm comprimentos bem diferentes ("Solicitar
        orçamento", "Falar com um projetista", "Agendar diagnóstico"). Com um
        rótulo só, trocar de pilar mudava a **largura do botão amarelo**, e o
        botão de WhatsApp — que vem logo depois na mesma linha — deslizava
        junto. O briefing pede o contrário: o WhatsApp permanece imóvel.

        Aqui os três ficam empilhados na mesma célula de grade
        (`styles.ctaLabels`), então a cela mede sempre o **mais longo** dos
        três e a caixa do botão não muda de tamanho em troca nenhuma. O ativo
        está em `opacity: 1` e os outros dois em `0`, com transição de 180ms —
        o crossfade curto que o briefing pede, sem desmontar nada e sem tocar
        na altura.

        Os inativos levam `aria-hidden`, então o nome acessível do link é só o
        rótulo ativo — não os três concatenados.
      */}
      {/* `lg:px-6 xl:px-8` — ver o comentário da linha de ação. */}
      <span className={cn(styles.ctaLabels, 'relative z-10 px-5 sm:px-6 lg:px-6 xl:px-8')}>
        {heroStates.map((item) => (
          <span
            key={item.id}
            aria-hidden={item.id !== state.id ? true : undefined}
            data-ativo={item.id === state.id ? 'true' : undefined}
          >
            {item.cta.label}
          </span>
        ))}
      </span>
      <span
        aria-hidden="true"
        className="relative z-10 flex w-12 shrink-0 items-center justify-center border-l border-ink/20 sm:w-[3.5rem] lg:w-12 xl:w-[3.5rem]"
      >
        <ArrowRightIcon
          size={18}
          className="transition-transform duration-200 ease-precise group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1"
        />
      </span>
    </Link>
  )
}

/**
 * ============================================================
 * CTA DE WHATSAPP — A ALTERNATIVA RÁPIDA, AO LADO DA PRINCIPAL
 * ============================================================
 *
 * **Mesmo sistema dimensional do `HeroCta`**, e não um botão de outra família:
 * a mesma altura (`min-h-12` / `sm:min-h-[3.625rem]`), o mesmo raio de 2px, a
 * mesma escala de rótulo (15/16/17px em condensada caixa-alta) e a mesma cela de
 * ícone separada por um fio de tinta. Colocados lado a lado, os dois leem como
 * um par — massa preenchida e contorno — em vez de dois componentes diferentes.
 *
 * ============================================================
 * CONTORNO, NÃO MASSA (R0-A · 2026-08-12 · delta G-2)
 * ============================================================
 *
 * **O histórico importa aqui, porque este botão já foi as duas coisas.** Em
 * 2026-08-09 ele era contorno verde, virou massa `#25D366`, depois `#1DA851` e
 * fechou em `#2A6F44` — um verde dessaturado e fundo, com tinta clara. Cada
 * passo resolveu um sintoma real: o contorno da época lia como link enquadrado,
 * e o verde de tela competia pelo primeiro olhar.
 *
 * O que nenhum daqueles passos resolveu é o defeito que a constituição nomeia
 * (doc 01 §6.4, §8): **duas massas preenchidas lado a lado, com a mesma altura
 * e a mesma construção, leem como dois botões-irmãos.** A hierarquia ficava
 * inteiramente por conta da luminância (0,603 do amarelo contra 0,123 do
 * verde), e forma vence tom. Escurecer mais o verde não resolveria — só
 * reduziria a massa a uma mancha escura, ainda irmã.
 *
 * A subordinação agora é de **construção**:
 *
 *     PRIMARY    massa amarela cheia      ← a única massa preenchida do par
 *     WHATSAPP   contorno + glifo verde
 *
 * O que **não** mudou, de propósito: altura (a mesma expressão comprimível),
 * raio de 2px, escala de rótulo, cela de ícone separada por fio, alvo de toque,
 * rótulo, destino, evento e posição. Os dois continuam sendo um par — é isso
 * que os faz pertencer ao mesmo sistema. Eles só deixaram de ser simétricos.
 *
 * A caixa é grafite translúcido com contorno claro, não transparente pura: o
 * botão vive sobre fotografia, e o plano 4 do sistema de profundidade exige
 * superfície própria (doc 01 §15.1) — sem ela, o contorno lê como adesivo
 * colado na imagem. É a mesma leitura das portas logo abaixo, que também
 * cruzam a cena com superfície translúcida e aresta própria.
 *
 * **O verde não sumiu: mudou de lugar.** Ele saiu da caixa e ficou no glifo,
 * que é o que torna o canal reconhecível. Ver a cela do ícone, abaixo.
 *
 * `whatsapp-float.tsx` continua com `#25D366` em disco: lá o verde é uma
 * superfície de 28px sem nada com que competir. Não é divergência — é a mesma
 * cor em dois pesos, e a norma prevê os dois.
 *
 * **O hover é o do contorno que se preenche:** `::before` em `canvas` subindo
 * por `scaleY` a partir da base, 220ms, com o rótulo invertendo para `ink` — a
 * mecânica de `secondary`/`light-outline`, e a mesma direção do primário.
 * `focus-visible` dispara o mesmo preenchimento, e `active` usa a mesma pressão
 * do primário (`pressState`).
 *
 * O link sai por `whatsappUrl(topic)` (`lib/whatsapp.ts`), como manda a
 * convenção — nenhuma URL `wa.me` escrita à mão, e o número continua vindo de
 * `src/data/site.ts`. O tópico acompanha o estado ativo, então a mensagem
 * pré-preenchida chega ao comercial já dizendo de qual frente o contato veio.
 */
function HeroWhatsappCta({ topic }: { topic: WhatsappTopic }) {
  return (
    <a
      href={whatsappUrl(topic)}
      data-hero-cta-wa
      target="_blank"
      rel="noopener noreferrer"
      /*
        `whatsapp_iniciado` é o evento que já existe em `lib/analytics.ts` para
        este canal — nenhum nome novo foi inventado aqui. `origem` distingue
        este CTA do botão flutuante e do rodapé.
      */
      onClick={() => trackEvent('whatsapp_iniciado', { origem: 'hero' })}
      className={cn(
        /* Mesma altura comprimível do primário — ver o comentário lá. */
        'group/wa relative inline-flex min-h-12 items-stretch overflow-hidden rounded-[2px] sm:min-h-[3.625rem] lg:min-h-[max(2.75rem,calc(58*var(--u)))]',
        /*
          Contorno com superfície própria, e não massa — ver o bloco acima.
          O grafite translúcido é o **plano 2** do sistema de profundidade: o
          botão está sobre fotografia, e um contorno sem superfície leria como
          adesivo colado na imagem. Ele é opaco o bastante para segurar o
          rótulo e transparente o bastante para não ler como massa preenchida.
        */
        'border border-canvas/35 bg-graphite/70 text-canvas',
        'hover:border-canvas hover:text-ink focus-visible:border-canvas focus-visible:text-ink',
        /* `lg:text-[1rem] xl:…` — mesmo degrau do primário; o par continua um par. */
        'font-condensed text-[0.9375rem] font-semibold uppercase tracking-[0.05em] sm:text-[1rem] lg:text-[1rem] xl:text-[1.0625rem]',
        /*
          O preenchimento é o mesmo movimento do primário (sobe por `scaleY`,
          origem na base, 220ms) — o que muda é o destino: `canvas`, e não um
          clareamento do próprio verde. É o contorno que se preenche, a mecânica
          já normatizada de `secondary` / `light-outline`.
        */
        'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-canvas',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'hover:before:scale-y-100 focus-visible:before:scale-y-100',
        'transition-[color,border-color] duration-[220ms] ease-precise',
        pressState,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-graphite',
      )}
    >
      {/*
        `lg:px-5 xl:px-5` e cela `lg:w-12` — ver o comentário da linha de ação.

        ============================================================
        MASSA (2026-08-10) — O RECUO DE `xl` CAI DE 28 PARA 20px
        ============================================================

        O briefing pede que o CTA contextual **domine** o de WhatsApp, e manda
        reavaliar tamanho, massa e largura — não rótulo nem destino, que estão
        travados. Medido em 1920 × 1080, antes: 326,0px de amarelo contra 266,8
        de verde, razão **1,22**. Depois: 250,8 de verde, razão **1,30**.

        Oito pixels de recuo de cada lado é o ajuste mais barato disponível: não
        toca altura (os dois continuam com 58px, e o par continua lendo como um
        par), não toca o rótulo, não toca a cela do glifo e não muda o
        posicionamento de nada — só tira massa de onde ela não estava dizendo
        nada. A hierarquia continua sustentada principalmente pela luminância
        (0,603 do amarelo contra 0,123 do verde) e pela ordem de leitura.
      */}
      {/* ----------
          O RECUO ABSORVE A BORDA — A MASSA NÃO PODE CRESCER

          Os valores são os de 2026-08-10 **menos 1px de cada lado**: 20→19 e
          24→23. Não é ajuste estético. A caixa passou a ter borda de 1px em
          R0-A, e `border-box` a soma à largura: medido em 1920, o botão ia de
          250,8 para 252,8px e a razão contra o primário caía de **1,300 para
          1,290** — abaixo do piso de 1,30 que a norma fixa a favor do primário
          (doc 01 §8, critério de saída de G-2).

          Descontar a borda do recuo devolve exatamente a largura anterior: o
          contorno entrou sem que o WhatsApp ganhasse um pixel de massa. É a
          mesma lógica do corte de 28→20 daquela rodada — o recuo é a variável
          barata, porque não toca altura, rótulo, cela do glifo nem posição.
          ---------- */}
      <span className="relative z-10 flex items-center px-[19px] sm:px-[23px] lg:px-[19px] xl:px-[19px]">
        Falar no WhatsApp
      </span>
      <span
        aria-hidden="true"
        className="relative z-10 flex w-12 shrink-0 items-center justify-center border-l border-canvas/25 transition-colors duration-[220ms] ease-precise group-hover/wa:border-ink/25 group-focus-visible/wa:border-ink/25 sm:w-[3.25rem] lg:w-12 xl:w-[3.25rem]"
      >
        {/*
          ---------- O GLIFO É O QUE CARREGA O VERDE (G-2) ----------

          A caixa deixou de ser verde; o glifo passou a ser. É a inversão que a
          norma pede: o verde identifica o **canal**, não a hierarquia — e uma
          massa verde ao lado da massa amarela lia como dois botões-irmãos.

          Dois tons, um matiz: `--whatsapp` (#25D366) em repouso, sobre o
          grafite translúcido; `--whatsapp-deep` (#2A6F44) quando o
          preenchimento `canvas` sobe e a superfície inverte. Nenhum tom novo
          — os dois já existiam no produto (o segundo era a massa que saiu, o
          primeiro é o disco do botão flutuante).
        */}
        <WhatsappIcon
          size={19}
          className="text-[var(--whatsapp)] transition-colors duration-[220ms] ease-precise group-hover/wa:text-[var(--whatsapp-deep)] group-focus-visible/wa:text-[var(--whatsapp-deep)]"
        />
      </span>
    </a>
  )
}
