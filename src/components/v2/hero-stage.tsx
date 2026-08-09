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
import { ArrowRightIcon } from '@/components/ui/icons'
import { heroSecondary, heroStates, homeHero, homeHeroMetrics } from '@/data/v2/home'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'
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
 *   │     etiqueta → h1 → intenção → CTA                    │
 *   ├ SELETOR ──────────────────────────────────────────────┤
 *   │   01 Equipamentos │ 02 Projetos │ 03 Consultoria      │
 *   ├ MÉTRICAS ─────────────────────────────────────────────┤
 *   │   18 anos · Brasil                    ação secundária │
 *   └───────────────────────────────────────────────────────┘
 *
 * Os três blocos compartilham o **mesmo `Container`** do cabeçalho e de toda
 * seção do site: um eixo vertical único da marca até a régua.
 *
 * ============================================================
 * COMO EQUIPAMENTOS LIDERA
 * ============================================================
 *
 * Por posição na narrativa e por peso na malha, nunca por tratamento de imagem:
 *
 *   1. é o **estado inicial** — o que a página mostra a quem chega, e o único
 *      que o servidor entrega;
 *   2. o `h1` da página é a copy dele;
 *   3. é a primeira área do seletor e a primeira parada do teclado;
 *   4. a área dele no seletor é **1,2fr** contra 1fr das outras duas;
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
   PISOS DE ALTURA — A CONTA QUE ELIMINA O SALTO ENTRE ESTADOS
   ============================================================

   Os três títulos e as três intenções têm comprimentos diferentes, e a versão
   anterior deixava a caixa seguir o texto: cada troca movia o `h1` em até 86px
   (medido em 1586 × 992). Aqui as duas caixas têm **piso em `em`**, então elas
   escalam junto com a tipografia e a moldura fica parada nos três estados.

   Em `em` e não em `px` porque o corpo é `clamp()`: um piso fixo em pixel
   sobraria em 1024 e faltaria em 1586.

   Contagem de linhas **medida no navegador**, estado por estado e viewport por
   viewport — não deduzida do número de caracteres:

   REMEDIDO EM 2026-08-08, COM O `h1` APROVADO DE 74 CARACTERES
   ------------------------------------------------------------
   A tabela anterior media o título curto que a rodada passada tinha posto no
   lugar da copy aprovada. Com o texto aprovado de volta e o corpo reduzido
   (ver o bloco do `h1`), o pior caso subiu uma linha em quase toda faixa:

     título    <640px ...... 4 linhas (Equipamentos; 320, 360 e 390 medidos)
               640–1023 .... 3 linhas (Equipamentos; as outras duas rendem 2)
               ≥1024 ....... 3 linhas (a coluna cai para 480px em 1024–1279 para
                             não invadir o plano de projeto, e volta a 600 em
                             1280; nas duas faixas o pior caso é 3)
     intenção  <768px ...... 4 linhas (Equipamentos, o mais longo dos três)
               ≥768px ...... 3 linhas (também Equipamentos; medido em 768, 1024,
                             1366, 1440 e 1586 — as outras duas rendem 2)

   O piso é contagem × entrelinha. Título: 1,10 abaixo de `lg` e 1,06 acima.
   Intenção: 1,5.

   **Refaça esta medição sempre que qualquer um dos três títulos ou das três
   intenções mudar de comprimento.** Um piso curto demais devolve o salto; um
   piso longo demais abre vão morto entre título, texto e ação — foi o que a
   primeira rodada produziu em 768 × 1024, com uma linha reservada a mais em
   cada uma das duas caixas.

   ============================================================
   REVISTO NA RODADA P1 (2026-08-08) — O PISO MÓVEL VIROU VAZIO ARTIFICIAL
   ============================================================

   Abaixo de 640px, o piso reservava o pior caso absoluto (Equipamentos: 4
   linhas de título, 4 de intenção — 4,4em / 6em). Como Projetos e Consultoria
   rendem só 2 linhas nas duas caixas em qualquer largura móvel, a auditoria
   de 2026-08-08 mediu esse piso como **vazio abaixo do texto**, não como
   estabilidade: ~63px sobrando sob o título de Projetos, e um vão maior ainda
   sob a intenção — em 390 × 844 a soma empurrava o CTA quase ao fim da tela.

   O piso móvel agora usa o **mesmo valor do tablet** (3,3em / 4,5em — 3 linhas
   nas duas caixas), e não o pior caso absoluto:

     · Projetos e Consultoria (2 linhas) perdem a maior parte do vazio — sobra
       no máximo 1 linha, não 2;
     · Equipamentos (4 linhas) passa a **exceder** o piso — a caixa cresce pelo
       próprio conteúdo, sem vazio, e a troca *para* Equipamentos ganha um
       deslocamento de ~1 linha que não existia antes.

   Essa troca é deliberada: no mobile o briefing pede "estabilidade
   suficiente", não ausência de salto — ao contrário do desktop, onde o salto
   de 86px medido na primeira rodada era o defeito a eliminar por completo. Um
   salto de uma linha ao entrar em Equipamentos é aceitável; um vazio de duas
   linhas nos outros dois estados, o tempo todo, não é.

   ============================================================
   REMEDIDO NA DIREÇÃO VISUAL (2026-08-08) — CORPO MAIOR, MESMA CONTAGEM
   ============================================================

   O bump de tipografia desta rodada (ver o `h1` e o parágrafo, abaixo) sobe o
   corpo mas não muda quantas linhas cada estado ocupa nos viewports medidos —
   a coluna também ficou mais larga (o degrau de 480px saiu, e um quarto
   degrau entrou em 1536px+ — ver o comentário do `key={state.id}`), então o
   mesmo texto continua quebrando nas mesmas 3–4 linhas de antes, medido nos
   dez viewports obrigatórios. O que muda é só o multiplicador:

     título    abaixo de `lg` .... 1,1  (igual)
               a partir de `lg` .. 1,05 (era 1,06)
     intenção  abaixo de `lg` .... 1,5  (igual — o corpo também não mudou,
                                     ver o comentário do parágrafo: o bump
                                     de tipografia é só a partir de `lg`)
               a partir de `lg` .. 1,6  (era 1,5)

   Refaça esta medição se qualquer título/intenção mudar de comprimento ou se
   a coluna mudar de largura de novo.
   ============================================================ */
const HEADLINE_MIN = 'min-h-[3.3em] lg:min-h-[3.15em]'
const INTENT_MIN = 'min-h-[4.5em] lg:min-h-[4.8em]'

/** Atraso do hover, dentro da faixa de 120–180ms pedida. */
const HOVER_INTENT_MS = 150

export function HeroStage() {
  /* ============================================================
     DOIS ESTADOS, E NÃO UM — A ESCOLHA FIXADA E A PRÉVIA
     ============================================================

     `pinned` é a escolha do visitante: começa em Equipamentos e só muda por
     clique, `Enter`/`Espaço`, seta, `Home` ou `End`. `preview` é o que o
     ponteiro está antecipando no desktop. O que está na tela é
     `preview ?? pinned`, então **retirar o mouse devolve a escolha fixada** —
     que é o comportamento pedido, e o que a versão anterior não fazia: lá o
     `onMouseEnter` gravava direto no único estado e a escolha se perdia ao
     atravessar a fileira.
  */
  const [pinned, setPinned] = useState(0)
  const [preview, setPreview] = useState<number | null>(null)
  const active = preview ?? pinned
  const state = heroStates[active]

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const hoverTimer = useRef<number | undefined>(undefined)

  /*
    Antecipação por ponteiro **só onde existe ponteiro fino**. No toque o
    `hover` fica preso depois do gesto e a cena passaria a mudar sem que
    ninguém tivesse escolhido nada.
  */
  const canPreview = useRef(false)
  useEffect(() => {
    canPreview.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    }
  }, [])

  const clearHoverTimer = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = undefined
  }

  /** Atraso de intenção: atravessar a fileira não deve trocar a cena três vezes. */
  const onItemEnter = (index: number) => {
    if (!canPreview.current) return
    clearHoverTimer()
    hoverTimer.current = window.setTimeout(() => setPreview(index), HOVER_INTENT_MS)
  }

  /** Sai do seletor inteiro, não de uma área: volta à escolha fixada. */
  const onRailLeave = () => {
    clearHoverTimer()
    setPreview(null)
  }

  /**
   * O foco cancela a prévia do ponteiro.
   *
   * Sem isto, um visitante que passa o mouse por "Consultoria" e depois aperta
   * `Tab` chega a um seletor incoerente: `aria-selected` está em Consultoria
   * (que é o que a prévia mostra) e `tabindex="0"` está na escolha fixada. São
   * dois estados diferentes anunciados ao mesmo tempo, e o teclado passa a agir
   * a partir de um item que a tela não indica.
   *
   * A regra é simples: **ponteiro antecipa, teclado decide.** Assim que o foco
   * entra, a prévia cai e o que está na tela volta a ser a escolha fixada.
   */
  const onRailFocus = () => {
    clearHoverTimer()
    setPreview(null)
  }

  const select = (index: number) => {
    clearHoverTimer()
    setPreview(null)
    setPinned(index)
  }

  /**
   * Navegação por seta, como manda o padrão de `tablist`: a seta move a seleção
   * **e** o foco, `Home`/`End` vão às pontas e a lista dá a volta. `Enter` e
   * `Espaço` são o comportamento nativo do `<button>` e caem em `onClick`.
   */
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
      return
    event.preventDefault()

    setPreview(null)
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
            className={cn(styles.frame, index === active && styles.frameActive)}
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
              className={cn(
                'object-cover',
                item.id === 'projetos' && styles.gradeProjetos,
                item.id === 'consultoria' && styles.gradeConsultoria,
              )}
            />

            {/*
              Legenda do render — só Projetos tem (`DEC-008`: material de
              projeto nunca aparece sem se declarar como tal). Sai abaixo de
              `lg`: no palco em faixa do toque não sobra altura para uma linha
              extra sem invadir o texto que assenta logo abaixo da cena.
            */}
            {item.media.caption ? (
              <p
                className={cn(
                  styles.mediaCaption,
                  'hidden font-condensed text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-canvas/70 lg:block',
                )}
              >
                {item.media.caption}
              </p>
            ) : null}
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
          aria-labelledby={`hero-aba-${state.id}`}
          /*
            `items-center`, e não `items-end`. Ancorado pela base, cada linha a
            menos no título empurrava o bloco inteiro para baixo — era metade da
            causa do salto entre estados (a outra metade eram as caixas sem
            piso, resolvidas por `HEADLINE_MIN` / `INTENT_MIN`).

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
          className="relative z-10 flex min-h-0 flex-1 items-center pb-10 pt-[calc(var(--media-h)+2rem)] lg:py-14 lg:pt-14"
        >
          <Container className="w-full">
            {/*
              `key` no bloco: trocar de estado remonta o conteúdo, e a animação
              escalonada do módulo CSS roda uma vez por troca — sem estado
              intermediário e sem temporizador em JavaScript.

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
            <div key={state.id} className="max-w-[35rem] lg:max-w-[30rem] xl:max-w-[40rem] 2xl:max-w-[44rem]">
              <p
                className={cn(
                  styles.enter,
                  'inline-flex items-center gap-3 font-condensed font-semibold uppercase tracking-[0.16em] text-yellow',
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
                {state.eyebrow}
              </p>

              <h1
                id="hero-titulo"
                style={{ '--delay': '60ms' } as CSSProperties}
                className={cn(
                  styles.enter,
                  HEADLINE_MIN,
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
                  'mt-3 font-sans font-bold tracking-[-0.025em] text-canvas',
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

                    `HEADLINE_MIN` foi remedido para os novos tamanhos — ver o
                    bloco no topo do arquivo.
                  */
                  'text-[clamp(1.75rem,7.8vw,2.375rem)] leading-[1.1]',
                  'lg:text-[clamp(2.375rem,3.4vw,3.375rem)] lg:leading-[1.05]',
                )}
              >
                {state.headline}
              </h1>

              <p
                style={{ '--delay': '120ms' } as CSSProperties}
                className={cn(
                  styles.enter,
                  INTENT_MIN,
                  /*
                    `max-w` em `ch`, não em `rem`: o limite que importa aqui é o
                    comprimento de linha (52 caracteres), e ele acompanha o
                    corpo. Resolve para ~470px no telefone e ~540px no desktop —
                    dentro da faixa de 480–560 pedida.

                    `leading-[1.5]` **depois** do `text-[…]` — ver o bloco do
                    `h1` acima; aqui valia o mesmo descarte silencioso.
                  */
                  'mt-4 max-w-[52ch] font-sans font-medium text-canvas/85 lg:mt-5',
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
                  'text-[0.9375rem] leading-[1.5] lg:text-[1.125rem] lg:leading-[1.6]',
                )}
              >
                {state.intent}
              </p>

              <div
                style={{ '--delay': '180ms' } as CSSProperties}
                /*
                  Direção visual (2026-08-08): 32/40px deixava o CTA colado ao
                  parágrafo — "elementos socados no meio" incluía essa
                  transição. 40/48px separa a ação de ler.
                */
                className={cn(styles.enter, 'mt-10 lg:mt-12')}
              >
                <HeroCta href={state.cta.href} event={state.event} label={state.cta.label} />
              </div>
            </div>
          </Container>
        </div>

        {/* ================= O SELETOR ================= */}
        <div className={cn(styles.rail, 'shrink-0')}>
          <Container>
            {/*
              ---------- Instrução do seletor ----------

              Colada à régua, não numa linha própria acima dela: é o rótulo do
              controle. Sobre a borda superior, à esquerda, num corpo que não
              disputa com os três nomes.

              Abaixo de `sm` ela vira `sr-only` em vez de `hidden`: em 390px a
              linha inteira está no limite da coluna e os três rótulos precisam
              do espaço, mas `display:none` tiraria o elemento da árvore de
              acessibilidade e o `aria-describedby` do seletor ficaria apontando
              para o nada.

              Direção visual (2026-08-08): `sm:pt-3` → `sm:pt-5`. O seletor
              lia colado à faixa de conteúdo acima dele — mais respiro aqui
              separa as duas zonas sem precisar de um divisor.
            */}
            <p
              className="sr-only sm:not-sr-only sm:block sm:pt-5 sm:font-condensed sm:text-[0.6875rem] sm:font-medium sm:uppercase sm:tracking-[0.14em] sm:text-canvas/50"
              id="hero-seletor-instrucao"
            >
              {homeHero.railHint}
            </p>

            <div
              role="tablist"
              aria-label="Frentes da Bianchini"
              aria-describedby="hero-seletor-instrucao"
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              onMouseLeave={onRailLeave}
              onFocusCapture={onRailFocus}
              /*
                ============================================================
                DIREÇÃO VISUAL (2026-08-08) — DE GRADE PARA GRUPO
                ============================================================

                Até aqui os três controles eram `grid-template-columns:
                repeat(3, minmax(0, 1fr))` — três células esticadas de guia a
                guia do `Container`, sem vão visível entre elas. O gestor
                apontou o resultado pelo nome certo: leitura de planilha, três
                colunas de tabela, não três portas de navegação. A malha que
                alinhava o número de Equipamentos e a seta de Consultoria às
                mesmas guias do `h1` (documentada no módulo CSS, "A CORREÇÃO DE
                MALHA DE 2026-08-08") é abandonada nesta rodada — era ela,
                esticando as células ponta a ponta, que produzia a leitura de
                tabela.

                `styles.railGroup` substitui `styles.railGrid`: `flex` com
                `justify-content: center` e um `gap` generoso — os três
                controles agora têm largura própria (a do conteúdo mais um
                respiro fixo, não a de uma célula de grade) e ficam centrados
                como grupo dentro do `Container`, com vão visível nas duas
                pontas. Cada `.railTop` (a régua de estado) passa a cobrir só a
                largura do seu próprio controle — não mais um segmento de uma
                linha contínua de guia a guia.
              */
              className={cn(styles.railGroup, 'sm:pt-3')}
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
                    tabIndex={index === pinned ? 0 : -1}
                    onClick={() => select(index)}
                    onMouseEnter={() => onItemEnter(index)}
                    className={cn(
                      'group/aba',
                      styles.railItem,
                      /*
                        Não pinta mais fundo nenhum: o único efeito de
                        `railItemActive` hoje é acender a régua de 2px da área
                        selecionada (ver o módulo).
                      */
                      selected && styles.railItemActive,
                      /*
                        ============================================================
                        DIREÇÃO VISUAL (2026-08-08) — ALTURA E RECUO, AUTÔNOMOS
                        ============================================================

                        Até aqui a altura mirava um teto de grade (96–112px, o
                        "não estourar a célula") e o recuo horizontal só existia
                        **entre** as áreas (as pontas encostavam nas guias do
                        `h1`/CTA — ver "A CORREÇÃO DE MALHA DE 2026-08-08" no
                        módulo). As duas contas mudam porque a área deixou de
                        ser uma célula de grade: agora é um controle
                        autocontido, com o próprio recuo nas quatro bordas
                        (`.railItem` no módulo) e sem teto de altura importado
                        de uma grade que não existe mais. `min-h` aqui é só o
                        piso de toque: 44px de sobra é o mínimo pedido, 64/96
                        já cobria isso e continua cobrindo com folga maior
                        ainda, porque o número saiu (uma linha a menos) e o
                        recuo interno cresceu.
                      */
                      'min-h-16 py-4 lg:min-h-24 lg:py-6',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow',
                    )}
                  >
                    {/* Linha superior própria da opção — nunca contínua entre elas. */}
                    <span aria-hidden="true" className={styles.railTop} />

                    <span className="flex w-full min-w-0 items-center gap-3 lg:gap-4">
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            /* `leading` depois do `text-[…]` — ver o `h1`. */
                            'block font-condensed uppercase tracking-[0.05em] transition-colors duration-200',
                            'text-[0.8125rem] leading-tight sm:text-[0.9375rem] lg:text-[1.1875rem]',
                            /*
                              Inativo em `canvas/75`, não num fantasma: o
                              briefing pede que ele continue legível e não
                              pareça desabilitado. 75% de `#EFEDEB` sobre a
                              faixa dá 9,5:1 — passa AA com folga larga.

                              **`/75` e não `/72`**: 72 não existe na escala de
                              opacidade do Tailwind 3 e a classe simplesmente
                              não seria gerada — a armadilha já registrada em
                              `CLAUDE.md` (o scrim que sumiu por usar `/88`).
                            */
                            /*
                              O preenchimento do ativo saiu (ver o módulo), e
                              com ele o único retorno visual do hover. Ele volta
                              aqui, na tinta do rótulo: passar o ponteiro
                              acende o nome, e a régua amarela confirma. É
                              resposta sem deslocar nada.
                            */
                            selected
                              ? 'font-bold text-canvas'
                              : 'font-semibold text-canvas/75 group-hover/aba:text-canvas group-focus-visible/aba:text-canvas',
                          )}
                        >
                          {item.name}
                        </span>

                        {/*
                          Complemento — a situação do cliente, em uma linha. Sai
                          abaixo de `sm`: em 390px as três áreas têm ~110px e a
                          frase quebraria em quatro linhas, empurrando o seletor
                          para dentro do palco.
                        */}
                        <span
                          className={cn(
                            'mt-1.5 hidden text-[0.8125rem] leading-snug transition-colors duration-200 sm:block lg:text-[0.9375rem]',
                            /*
                              `/65` e `/80`, não `/55` e `/75`: com a faixa do
                              seletor deixando a fotografia aparecer, o pior
                              pixel sob esta linha subiu e o complemento inativo
                              caiu para 3,92:1 em Equipamentos. Ver a medição no
                              módulo, em `.rail`.
                            */
                            selected ? 'text-canvas/80' : 'text-canvas/65',
                          )}
                        >
                          {item.cue}
                        </span>
                      </span>

                      {/*
                        Seta — o sinal permanente de que a área é um controle, e
                        não um parágrafo. Ela existe nos três estados; o que muda
                        é a cor e o avanço de 4px no hover e no foco.
                      */}
                      <ArrowRightIcon
                        size={16}
                        aria-hidden="true"
                        className={cn(
                          styles.railArrow,
                          'hidden shrink-0 transition-colors duration-200 sm:block',
                          selected ? 'text-yellow' : 'text-canvas/45',
                        )}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </Container>
        </div>
      </div>

      {/* ================= FAIXA DE MÉTRICAS ================= */}
      {/*
        **Fora do seletor, e com faixa própria.** Antes ela dividia a base escura
        com os três caminhos, media ~52px e ficava encostada neles: o olho lia um
        bloco só, e os números disputavam a atenção do controle.

        Agora é uma faixa independente, imediatamente abaixo do palco, em
        `graphite-deep` — um degrau mais escuro que o palco e mais escuro que a
        seção seguinte (`graphite-soft`). Essa diferença de valor é o que faz a
        passagem para a home ser uma **transição** e não um corte: palco escuro →
        faixa de fechamento mais escura → primeira seção mais clara.

        Altura 80px no desktop (dentro da faixa de 80–104) e a mesma caixa
        compacta no telefone, onde os números e a ação empilham. Só o que está
        confirmado (`site.ts`: 18 anos, abrangência Brasil) mais uma ação.
        Tipografia e um separador; nenhum ícone, cartão ou selo.
      */}
      <div
        data-hero-metrics
        className="shrink-0 border-t border-white/[0.14] bg-graphite-deep"
      >
        <Container>
          <div className="flex min-h-20 flex-col justify-center gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4">
            {/*
              `flex-nowrap` só a partir de `md`. Em `sm` (640px) travar a quebra
              empurrava a lista para fora do container e abria **85px de rolagem
              horizontal** — medido. A partir de 768 os dois pares cabem numa
              linha com folga.
            */}
            <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 sm:gap-x-6 md:flex-nowrap">
              {homeHeroMetrics.map((metric, index) => (
                <div key={metric.label} className="flex items-baseline gap-2 md:whitespace-nowrap">
                  {index > 0 ? (
                    <span aria-hidden="true" className="mr-3 hidden h-3 w-px bg-white/20 sm:block" />
                  ) : null}
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="font-condensed text-[1rem] font-bold uppercase tracking-[0.03em] text-canvas sm:text-[1.0625rem] lg:text-[1.25rem]">
                    {metric.value}
                  </dd>
                  {/*
                    12px no telefone, 13px acima. Medido: a 13px os dois pares
                    somam 357px contra os 350 de coluna em 390px, a lista
                    quebrava em duas linhas e a faixa ia a 137px de altura.
                  */}
                  <span aria-hidden="true" className="text-[0.75rem] text-canvas/60 sm:text-[0.8125rem]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </dl>

            {/*
              Ação secundária, em texto — deliberadamente sem massa: o CTA
              preenchido da dobra é o do estado ativo, e um segundo botão aqui
              disputaria com ele. Também é a ponte para a seção seguinte, que é
              justamente `#equipamentos`.
            */}
            <Link
              href={heroSecondary.href}
              onClick={() => trackEvent('hero_orcamento_click', { origem: 'hero' })}
              className="group inline-flex min-h-[2.75rem] w-fit items-center gap-2 text-[0.875rem] font-semibold text-canvas/85 transition-colors hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:min-h-0 md:whitespace-nowrap"
            >
              {heroSecondary.label}
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="shrink-0 text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Container>
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
function HeroCta({ href, event, label }: { href: string; event: AnalyticsEvent; label: string }) {
  return (
    <Link
      href={href}
      data-hero-cta
      onClick={() => trackEvent(event, { origem: 'hero' })}
      className={cn(
        'group/cta relative inline-flex min-h-12 items-stretch overflow-hidden rounded-[2px] bg-yellow sm:min-h-[3.625rem]',
        'font-condensed text-[0.9375rem] font-semibold uppercase tracking-[0.05em] text-ink sm:text-[1rem] lg:text-[1.0625rem]',
        'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-yellow-bright',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'hover:before:scale-y-100 focus-visible:before:scale-y-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-graphite',
      )}
    >
      <span className="relative z-10 flex items-center px-5 sm:px-6 lg:px-8">{label}</span>
      <span
        aria-hidden="true"
        className="relative z-10 flex w-12 shrink-0 items-center justify-center border-l border-ink/20 sm:w-[3.5rem]"
      >
        <ArrowRightIcon
          size={18}
          className="transition-transform duration-200 ease-precise group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1"
        />
      </span>
    </Link>
  )
}
