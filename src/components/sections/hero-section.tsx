'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, KeyboardEvent, TouchEvent } from 'react'
import { HeroPrimaryCta, HeroSecondaryCta } from '@/components/ui/actions/button'
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@/components/ui/icons'
import { heroMetrics, positioning } from '@/data/site'
import { heroSlides } from '@/data/hero-slides'
import { useCarousel } from '@/hooks/use-carousel'
import { cn } from '@/lib/utils'

/**
 * Primeira dobra — carrossel de 3 slides, um por pilar.
 * ============================================================
 * COMO A COMPOSIÇÃO APROVADA VIRA TRÊS SLIDES
 * ============================================================
 *
 * A geometria de `MOCKUP_HERO_APROVADO.png` é preservada inteira: coluna de
 * conteúdo à esquerda, painel fotográfico diagonal dominante à direita,
 * keyline amarela paralela ao corte, CTA primário + secundário lado a lado,
 * métricas sob a régua amarela. O que o carrossel acrescenta é uma divisão
 * clara de papéis entre os dois lados:
 *
 *   ESQUERDA (constante em estrutura, variável em copy)
 *     etiqueta da marca → título do pilar → texto curto → CTAs → métricas →
 *     **módulo de pilares** (identificação do ativo + seletor com as setas).
 *     A etiqueta é a do mockup ("Cozinhas industriais e food service") e não
 *     muda por slide: é o enquadramento da empresa, não do pilar. Quem nomeia
 *     o pilar é o título.
 *
 *   DIREITA (fotografia + bloco editorial do slide)
 *     a fotografia do pilar, no recorte diagonal do mockup, com um bloco
 *     editorial ancorado à base: rótulo condensado sobre régua amarela e o
 *     texto que explica o pilar — o raciocínio operacional e comercial por
 *     trás dele. Sem painel opaco, sem cartão.
 *
 * **A distribuição inverteu em 2026-08-05.** Antes o módulo de pilares ficava
 * sobre a fotografia e a coluna clara terminava nas métricas — o que deixava
 * o texto todo à esquerda, o controle todo à direita e um vão de off-white no
 * pé da coluna (o mesmo vão que já tinha obrigado a centrar o bloco
 * verticalmente). Agora cada lado carrega texto e o controle desceu para a
 * malha da coluna clara. Ver o comentário de `renderPillarModule`.
 *
 * O seletor é o que faz a dobra comunicar "há três frentes" antes de qualquer
 * clique — por isso ele nomeia os três, e não sinaliza posição com pontos.
 *
 * ============================================================
 * MOVIMENTO
 * ============================================================
 *
 *   `.hero-curtain` ......... uma vez, no carregamento — a cortina correndo
 *                             pela diagonal do mockup.
 *   `.hero-seq` / `--seq` ... uma vez, no carregamento — a entrada escalonada.
 *   `.hero-slide-media` ...... a cada troca — a fotografia dissolve em 700ms,
 *                             com 1,5% de deriva horizontal.
 *   `.hero-slide-out` /
 *   `.hero-slide-content` ... a cada troca — o texto **sai** (190ms) e só
 *                             então **entra** (460ms), sob a dissolução da
 *                             imagem. Ver CONTENT_SWAP mais abaixo.
 *
 * A troca de slide **substitui conteúdo**: a dobra não remonta, a moldura
 * (etiqueta, CTA primário, régua, métricas, navegação) fica parada e só a
 * fotografia, o título, o texto, a identificação do pilar e o CTA secundário
 * trocam.
 *
 * ============================================================
 * CARROSSEL
 * ============================================================
 *
 * Mesmo padrão de aba usado em diagnóstico/sintomas/atuação (`role="tablist"`
 * na navegação, `role="tabpanel"` no conteúdo, `Home`/`End`/setas movendo o
 * foco) — não um componente novo de carrossel genérico. Autoplay a cada 6s,
 * pausado por hover, foco ou interação recente. Com `prefers-reduced-motion`
 * o autoplay já não roda e a navegação manual continua igual.
 */

const PHOTO_CLIP = 'polygon(24.005% 0%, 100% 0%, 100% 100%, 0% 100%)'

const HERO_MUTED = 'text-[#3F3D3B]'

/** `canvas` → `canvas.deep`, dois passos de valor — assentamento sem virar fundo colorido. */
const HERO_SURFACE = 'bg-[linear-gradient(168deg,#F2F0EE_0%,#EFEDEB_52%,#E7E4DF_100%)]'

/*
  `PHOTO_TEXT_SHADOW` saiu em 2026-08-04. Era a tentativa de resolver por
  sombra de texto um problema que é de superfície: sombra melhora a borda do
  glifo, mas não muda a relação de luminância que o WCAG mede — sobre o inox
  claro de "Equipamentos" o rótulo ativo media 1,14:1 mesmo com ela. Quem
  garante o contraste agora é a base grafite do módulo.
*/

const PHOTO_GRADE_ID = 'hero-photo-grade'
const PHOTO_GRADE = { filter: `url(#${PHOTO_GRADE_ID})` }

const METRIC_LABEL_WIDTH = [116 / 15, 137 / 15, 111 / 15]

const AUTOPLAY_INTERVAL = 6000
const SWIPE_THRESHOLD = 40

/**
 * Saída do conteúdo antes da entrada do próximo — ver `CONTENT_SWAP` abaixo.
 * Precisa bater com a duração de `.hero-slide-out` em globals.css.
 */
const CONTENT_OUT_MS = 190

export function HeroSection() {
  const baseId = useId()
  /**
   * Duas listas de refs, não uma: a navegação dos pilares renderiza duas
   * vezes no DOM — uma ancorada à foto do mobile, outra à foto do desktop
   * (`renderPillarNav`, mais abaixo) — só uma delas visível por vez via CSS.
   * Mover foco no teclado precisa acertar a instância visível; chamar
   * `.focus()` nas duas é seguro, porque `display:none` não aceita foco
   * (chamada vira no-op).
   */
  const tabsRefMobile = useRef<(HTMLButtonElement | null)[]>([])
  const tabsRefDesktop = useRef<(HTMLButtonElement | null)[]>([])
  const interactionTimeoutRef = useRef<number | undefined>(undefined)
  const swapTimeoutRef = useRef<number | undefined>(undefined)
  const touchStartXRef = useRef<number | null>(null)
  const isFirstRenderRef = useRef(true)

  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  /** Vira `true` na primeira troca de slide — a sequência de entrada elaborada não repete depois disso. */
  const [settled, setSettled] = useState(false)

  /* ============================================================
     PAUSA EXPLÍCITA — WCAG 2.2.2 (2026-08-05, V1.1)
     ============================================================

     A rotação avança sozinha a cada 6s e troca o `h1`, o texto de apoio e o CTA
     secundário. Medido no build de produção: t=0 "Projetar para a operação
     real." → t=6s "Equipar com retorno calculado." → t=12s "Estruturar a
     operação que vende." → volta ao primeiro. Conteúdo automático, com mais de
     5s de duração, apresentado em paralelo com outro conteúdo: o critério
     **2.2.2 (Pause, Stop, Hide), nível A**, exige um mecanismo de pausa.

     As pausas que já existiam — `hover`, foco dentro da dobra e 6s após
     interação — **não** satisfazem o critério: nenhuma é anunciada, nenhuma é
     descoberta por quem está apenas lendo, e no toque não há `hover`. Este
     estado é o mecanismo explícito, e ele é **persistente**: uma vez pausado,
     fica pausado até o visitante retomar.

     Onde a rotação nem chega a existir — toque e `prefers-reduced-motion`, ver
     `useCarousel` — o controle **não é renderizado**. Um botão "pausar" sobre
     algo parado afirma que existe movimento e é pior que a ausência dele.
  */
  const [userPaused, setUserPaused] = useState(false)

  const { activeIndex, goTo, next, prev, reducedMotion, autoplayAvailable } = useCarousel({
    interval: AUTOPLAY_INTERVAL,
    itemCount: heroSlides.length,
    paused: userPaused || hovering || focused || interacting,
  })

  /* ============================================================
     FOTOGRAFIA DOS SLIDES 2 E 3 FORA DO CAMINHO CRÍTICO (V1.1)
     ============================================================

     Os três slides eram montados com `loading="eager"` desde a primeira
     pintura — necessário, porque o lazy nativo não busca imagem de carrossel
     com `opacity: 0` (ver o comentário do `<Image>` mais abaixo; isso **não**
     mudou). O efeito colateral era o custo: medido com cache frio, a primeira
     dobra baixava **629 KB em 9 requisições** em 1440 × 900 para exibir uma
     fotografia, e a primeira troca só acontece aos 6s.

     Agora os slides inativos só entram no DOM depois que a página termina de
     carregar — ou imediatamente, se o visitante interagir antes disso. O que
     mudou é **quando** carregam, não **se** carregam: uma vez montados, seguem
     com `eager` pelo mesmo motivo de sempre.

     `index === activeIndex` no guarda de renderização é a rede de segurança: se
     qualquer caminho trocar o slide ativo antes de `secondaryReady`, a
     fotografia correspondente monta no mesmo quadro em vez de deixar o painel
     vazio.
  */
  const [secondaryReady, setSecondaryReady] = useState(false)

  useEffect(() => {
    if (secondaryReady) return
    if (document.readyState === 'complete') {
      setSecondaryReady(true)
      return
    }
    const onLoad = () => setSecondaryReady(true)
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [secondaryReady])

  /* ============================================================
     CONTENT_SWAP — por que o texto tem um índice próprio
     ============================================================

     A versão anterior remontava o bloco de texto por `key={current.id}`: no
     instante do clique o React desmontava o conteúdo antigo e montava o novo
     já animando a entrada. Ou seja, **corte seco na saída** e fundido só na
     entrada — é exatamente isso que se lia como "troca dura", não a duração.

     Agora a troca é uma substituição coordenada em dois tempos:

       t=0 ......... a fotografia começa a dissolver (mais longa, é ela que
                     conduz a troca) e o texto atual sai — `.hero-slide-out`,
                     190ms, desce 4px enquanto perde opacidade
       t=190ms ..... `displayIndex` alcança `activeIndex`: o texto novo entra
                     por `.hero-slide-content`

     Saída e entrada se sobrepõem à dissolução da imagem, que continua
     correndo por baixo das duas — a moldura (etiqueta, CTA primário, régua,
     métricas, navegação) nunca se move.

     Com `prefers-reduced-motion` não há defasagem: `displayIndex` acompanha
     `activeIndex` no mesmo quadro e o CSS já neutraliza as animações. */
  const [displayIndex, setDisplayIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)

  const current = heroSlides[displayIndex] ?? heroSlides[0]

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }
    setSettled(true)

    if (reducedMotion) {
      setDisplayIndex(activeIndex)
      return
    }

    setLeaving(true)
    if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current)
    swapTimeoutRef.current = window.setTimeout(() => {
      setDisplayIndex(activeIndex)
      setLeaving(false)
    }, CONTENT_OUT_MS)
  }, [activeIndex, reducedMotion])

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) window.clearTimeout(interactionTimeoutRef.current)
      if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current)
    }
  }, [])

  /** Classe do bloco que troca por slide: saindo, entrando, ou nada (carga inicial). */
  const swapClass = (settled && (leaving ? 'hero-slide-out' : 'hero-slide-content')) || undefined

  const markInteraction = () => {
    setInteracting(true)
    /* Qualquer interação já garante que as fotografias restantes existam. */
    setSecondaryReady(true)
    if (interactionTimeoutRef.current) window.clearTimeout(interactionTimeoutRef.current)
    interactionTimeoutRef.current = window.setTimeout(() => setInteracting(false), AUTOPLAY_INTERVAL)
  }

  const selectSlide = (index: number, moveFocus = false) => {
    goTo(index)
    markInteraction()
    if (moveFocus) {
      tabsRefMobile.current[index]?.focus()
      tabsRefDesktop.current[index]?.focus()
    }
  }

  /** A navegação é horizontal nas duas faixas — as setas do teclado avançam/recuam. */
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = heroSlides.length - 1
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index === last ? 0 : index + 1
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index === 0 ? last : index - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = last
    if (nextIndex === undefined) return
    event.preventDefault()
    selectSlide(nextIndex, true)
  }

  const onTouchStart = (event: TouchEvent) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartXRef.current === null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current
    const delta = endX - touchStartXRef.current
    touchStartXRef.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    markInteraction()
    if (delta < 0) next()
    else prev()
  }

  const onFocusCapture = () => setFocused(true)
  const onBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
  }

  /**
   * Uma seta — **nas extremidades da moldura do seletor**, uma de cada lado.
   *
   * As duas ficavam coladas no fim da fileira, depois dos três pilares: lia
   * como um bloco de abas com dois botões sobrando no canto. Separadas nas
   * pontas, a fileira passa a ler o eixo que ela de fato é —
   * **anterior · estado atual · próximo** — e o conjunto fica simétrico.
   *
   * `min-h-[2.75rem]` explícito, não só `items-stretch`: no mobile as setas
   * ficam numa fileira cuja altura é ditada pelo contador de texto (~20px), e
   * esticar para 20px reprovava o alvo mínimo — medido em 44×20. No desktop a
   * fileira já passa de 44px, então o piso não muda nada lá.
   */
  const renderArrow = (direction: 'prev' | 'next', onLight: boolean) => {
    const isPrev = direction === 'prev'
    const Icon = isPrev ? ChevronLeftIcon : ChevronRightIcon
    return (
      <button
        type="button"
        aria-label={isPrev ? 'Pilar anterior' : 'Próximo pilar'}
        onClick={() => {
          if (isPrev) prev()
          else next()
          markInteraction()
        }}
        className={cn(
          /*
            44 × 44 exatos e **mesma geometria nas duas direções** — quadrado,
            não cápsula: um par de cápsulas lê como controle de player e passa a
            disputar com os CTAs logo acima.

            `-mb-px pb-px`: a seta divide a linha-base com os rótulos, então
            precisa terminar **na** régua, não flutuando acima dela.
          */
          'flex h-11 w-11 shrink-0 items-center justify-center -mb-px pb-px',
          'transition-colors duration-200 ease-precise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          /*
            Anel de foco e realce seguem a superfície, não o componente: em
            fundo claro o amarelo cai para 1,4:1 e deixa de ser sinal
            (`src/styles/colors.ts`); quem marca foco ali é o grafite.

            Hover mais forte que antes (0.07 contra 0.06) e `active` a 0.14: com
            a moldura e as divisórias removidas, o realce passou a ser o **único**
            sinal de que a área é clicável.
          */
          onLight
            ? 'text-ink/70 hover:bg-ink/[0.07] hover:text-ink focus-visible:ring-ink active:bg-ink/[0.14]'
            : 'text-canvas/85 hover:bg-white/15 hover:text-canvas focus-visible:ring-yellow active:bg-white/25',
        )}
      >
        {/* 19px, não 17: sem a moldura ao redor, a 17 o glifo sumia ao lado dos rótulos. */}
        <Icon size={19} />
      </button>
    )
  }

  /**
   * Módulo de pilares — identificação do pilar ativo (número, nome, resumo) +
   * controle segmentado com as setas nas pontas.
   *
   * ============================================================
   * ELE MUDOU DE LADO EM 2026-08-05
   * ============================================================
   *
   * Até aqui o módulo ficava **sobre a fotografia**, ancorado à base do painel
   * diagonal. Duas consequências mediam contra ele:
   *
   *   · a coluna clara terminava nas métricas e sobrava vão — foi o que já
   *     tinha obrigado a centrar o bloco verticalmente (`lg:justify-center`,
   *     ver a divergência de posição anotada em `CLAUDE.md`); o vão não some
   *     centrando, só muda de lugar;
   *   · o único conteúdo textual do lado direito era o próprio módulo, e ele
   *     precisava de uma base grafite de 90–97% de opacidade para alcançar AA
   *     sobre a fotografia — ou seja, a foto era coberta justamente onde o
   *     texto entrava.
   *
   * Agora: identificação e seletor vivem na **coluna clara**, abaixo das
   * métricas, na mesma malha do resto da coluna; a fotografia recebe um bloco
   * editorial (`renderSlideDetail`) que explica o pilar. Os dois lados passam
   * a carregar texto, e o peso deixa de ficar todo à esquerda.
   *
   * ============================================================
   * DUAS SUPERFÍCIES, DUAS TONALIDADES
   * ============================================================
   *
   * `desktop` renderiza na coluna clara e `mobile` na faixa grafite abaixo da
   * fotografia — então a variante decide **tom**, não só posição. Em fundo
   * claro o estado ativo é preenchimento **grafite** e o anel de foco é
   * grafite; o amarelo entra só dentro do segmento ativo (que já é escuro) e
   * como hairline decorativa. É a regra do amarelo de `src/styles/colors.ts`,
   * a mesma que vale para o espinhaço de "Atuação integrada".
   *
   * As duas instâncias coexistem no DOM (uma escondida por `display:none` em
   * cada largura), por isso o `variant` também prefixa os `id` dos botões.
   */
  /**
   * ---------- Marcador do pilar ativo ----------
   *
   * O MÓDULO FOI PARTIDO EM DOIS (2026-08-05, segunda passagem)
   *
   * Até aqui identificação e seletor eram um bloco só, fechando a coluna clara
   * abaixo das métricas. Medido: **162px em 1586, 135px em 1366 e 373px em
   * 390px**, no quarto inferior da dobra (y=718 de 80–992). A identificação do
   * pilar chegava depois dos CTAs e das métricas — tarde demais — e o conjunto
   * pesava na base da coluna.
   *
   * Agora são duas peças, em dois lugares:
   *
   *   `renderPillarMark` .. logo **abaixo da etiqueta institucional e antes do
   *                         título**: diz qual pilar está ativo quando a
   *                         leitura começa, não no fim dela.
   *   `renderPillarNav` ... continua fechando a coluna, mas como navegação
   *                         leve — sem moldura, sem divisória, sem
   *                         preenchimento por item.
   *
   * **A numeração aparece uma vez só.** Era renderizada quatro vezes por
   * estado (uma na identificação, três nos botões) mais o texto "Pilar 01 de
   * 03" — a mesma informação em cinco lugares. Ficou aqui, no marcador.
   *
   * **`context` saiu da coluna clara.** No desktop a fotografia já carrega
   * `detail.text`, a versão longa do mesmo argumento, e título e lead também
   * mudam por pilar: eram quatro textos dizendo o mesmo na mesma dobra. O
   * campo continua em `hero-slides.ts` — copy real não se apaga — e segue em
   * uso no mobile, onde não há segunda coluna.
   */
  /**
   * ---------- Pausar / retomar a rotação ----------
   *
   * Mora na linha do marcador, e não na régua do seletor, por três razões
   * medidas:
   *
   *   · **a régua não tem largura sobrando.** Em 1024px, o pior caso, cada
   *     célula do seletor tem 86px e "EQUIPAMENTOS" pede 77 — tirar mais 44px
   *     para um terceiro botão deixaria 71px e o rótulo voltaria a quebrar no
   *     meio do glifo;
   *   · **as setas são um eixo simétrico** (anterior · estado · próximo). Um
   *     controle de reprodução no meio dele deixa de ler como navegação;
   *   · **o marcador é onde o estado da rotação é dito.** "01/03 — PROJETOS"
   *     é a informação que o botão controla, e a partir desta rodada ela está
   *     na primeira dobra em toda largura.
   *
   * A caixa visível tem a altura da linha; o alvo de 44 × 44 vem de `padding`
   * com margem negativa que o cancela (`-my-3 py-3`), então **a linha não
   * cresce** — mesma técnica já usada nas setas (`-mb-px pb-px`) e nos itens de
   * contato do menu mobile (`-mx-2 px-2`).
   *
   * O rótulo é `aria-label`, não texto visível: em 320px a linha inteira já
   * está no limite da coluna.
   */
  const renderPauseToggle = () => {
    /* Sem rotação não há o que pausar — ver o bloco `userPaused` mais acima. */
    if (!autoplayAvailable) return null

    return (
      <button
        type="button"
        onClick={() => setUserPaused((value) => !value)}
        aria-pressed={userPaused}
        aria-label={userPaused ? 'Reproduzir rotação dos pilares' : 'Pausar rotação dos pilares'}
        className={cn(
          /*
            Caixa de 44 × 44 sempre — o glifo troca dentro dela, a caixa não.
            É o que garante que alternar pausa/reprodução não mova nada em
            volta (o rótulo do pilar fica imediatamente à esquerda).
          */
          '-my-3 flex h-11 w-11 shrink-0 items-center justify-center py-3',
          'transition-colors duration-200 ease-precise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          /* Fundo claro: grafite. A regra do amarelo vale aqui como em todo controle. */
          'text-ink/55 hover:bg-ink/[0.07] hover:text-ink focus-visible:ring-ink active:bg-ink/[0.14]',
        )}
      >
        {/*
          O estado não é dito só por cor: são dois glifos diferentes (duas
          barras × triângulo) somados ao `aria-pressed` e ao `aria-label`.
        */}
        {userPaused ? <PlayIcon size={13} /> : <PauseIcon size={13} />}
      </button>
    )
  }

  /**
   * ---------- Marcador do pilar ativo ----------
   *
   * **Ele subiu para a coluna clara em toda largura (2026-08-05, V1.1).** Até
   * aqui existia em duas instâncias: no desktop entre a etiqueta e o título, no
   * mobile dentro da faixa grafite abaixo da fotografia. Medido, a instância
   * mobile ficava **fora da primeira dobra em toda largura de toque** — 108px
   * abaixo em 390 × 844, 271px em 360 × 800, 142px em 768 × 1024 —, e o seletor
   * ainda mais longe (327 a 490px). Ou seja: no telefone o `h1` trocava sozinho
   * a cada 6s e nada na tela dizia que havia três frentes, nem qual estava
   * ativa. Agora é uma instância só, acima do título, dentro da dobra em todas
   * as larguras.
   *
   * **"01/03", não "01".** Com o seletor fora da dobra no toque, o índice
   * sozinho identifica a posição mas não anuncia a série. O total entra aqui — e
   * **só aqui**: a numeração continua aparecendo uma vez por estado, que é a
   * regra que tirou "Pilar 01 de 03" de mais quatro lugares.
   *
   * O botão de pausa fica **fora** do elemento que troca por slide: dentro
   * dele, o React o remontaria a cada troca e o foco do teclado se perderia no
   * meio da interação.
   */
  const renderPillarMark = () => (
    <div data-pillar-mark className="hero-pillar-mark">
      {/*
        ---------- Abaixo de `lg`: o marcador **é** a navegação ----------

        Setas nas pontas, identificação no meio. É o único controle de pilar
        dentro da primeira dobra no toque, e existe porque a régua de três
        rótulos não cabe aqui sem virar a "fileira pesada de caixas" que o
        projeto removeu de propósito. Os três nomes continuam acessíveis na
        régua abaixo da fotografia — que deixou de ter setas próprias, para que
        não haja dois seletores completos na mesma tela.
      */}
      <span className="lg:hidden">{renderArrow('prev', true)}</span>

      <p
        key={settled ? `mark-${current.id}` : 'mark-initial'}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-[inherit] lg:flex-none',
          /* Em toque o texto fica entre as duas setas; em desktop, à esquerda. */
          'justify-center lg:justify-start',
          swapClass,
        )}
      >
        {/*
          Índice em fundo claro é **grafite**, não amarelo: sobre `canvas` o
          amarelo dá 1,4:1 e o índice carrega significado (`src/styles/colors.ts`).

          "01/03" é o indicador de três estados pedido para o toque — mais
          preciso que um ponto por pilar e sem repetir informação: a numeração
          continua aparecendo **uma vez só** por estado.
        */}
        <span className={cn('hero-tab-number font-condensed tabular-nums', HERO_MUTED)}>
          {current.number}
          <span className="opacity-55">/{String(heroSlides.length).padStart(2, '0')}</span>
        </span>
        {/*
          Hairline decorativa — amarelo é permitido neste papel sobre claro.
          Some abaixo de 360px: ali a linha mede no limite da coluna e estes
          20px são a diferença entre caber e quebrar.
        */}
        <span aria-hidden="true" className="hidden h-px w-5 shrink-0 bg-yellow min-[360px]:block" />
        {/*
          `whitespace-normal` só abaixo de `lg`: em 320px "OPERAÇÃO COMERCIAL"
          não cabe entre as duas setas e precisa quebrar **entre as palavras**.
          Partir no meio do glifo é o que não pode acontecer — daí não haver
          `break-words` aqui.
        */}
        <span className="hero-pillar-name whitespace-normal text-center font-condensed uppercase text-ink lg:whitespace-nowrap lg:text-left">
          {current.pillar}
        </span>
      </p>

      <span className="lg:hidden">{renderArrow('next', true)}</span>

      {renderPauseToggle()}
    </div>
  )

  /**
   * ---------- Navegação dos pilares ----------
   *
   * **Uma linha-base compartilhada, não cinco caixas.** Saíram a moldura
   * externa, as divisórias internas (`divide-x`/`divide-y`), o preenchimento do
   * segmento ativo e a fileira separada das setas — era esse conjunto que
   * produzia a aparência de tabela. Ficou uma régua única sob tudo: setas e
   * rótulos dividem a mesma base, e o ativo é marcado **sobre** ela.
   *
   * Estado ativo por três sinais somados, um deles não-cromático:
   *   · peso da fonte (600 → 700);
   *   · contraste do rótulo (`muted` → `ink`);
   *   · régua de 2px assentada na linha-base, sob o item ativo.
   *
   * Em fundo claro a régua é **grafite** — indicador de estado sobre superfície
   * clara não pode ser amarelo.
   *
   * **`grid-cols-3` permanece**, e é ele que impede layout shift: a caixa de
   * cada item é um terço fixo da faixa, então engrossar o rótulo ativo não
   * desloca os vizinhos. A régua acompanha a célula, não o texto.
   *
   * `variant` decide tom, não só posição. As duas instâncias coexistem no DOM
   * (uma em `display:none` por largura), por isso ela prefixa os `id`.
   */
  const renderPillarNav = (variant: 'mobile' | 'desktop') => {
    const tabsRef = variant === 'mobile' ? tabsRefMobile : tabsRefDesktop
    const isMobile = variant === 'mobile'
    /** `desktop` = coluna clara; `mobile` = faixa grafite. */
    const onLight = !isMobile

    return (
      <div data-pillar-module>
        {/*
          ---------- Texto explicativo do pilar — só no mobile ----------

          **No desktop este bloco não existe mais.** Ele carregava o `context`
          logo acima do seletor; hoje quem identifica o pilar é o marcador, no
          alto da coluna, e quem explica é o bloco editorial sobre a fotografia.

          No mobile não há segunda coluna, então o `detail.text` continua aqui —
          é o único lugar em que o argumento do pilar aparece nessa largura.

          **Altura mínima fixa, medida no estado mais alto.** Sem ela a caixa
          cresce conforme o texto do slide e a navegação logo abaixo muda de
          posição a cada troca — o layout shift que o componente existe para
          não ter. Os pisos são medidos, não estimados.
        */}
        {isMobile ? (
        <div
          key={settled ? `context-${current.id}` : 'context-initial'}
          className={cn(
            swapClass,
            /*
              Pisos medidos no slide mais alto de cada faixa, com folga:

                320px .... 181,8px natural → piso 188
                360–767 .. 160,0px natural → piso 164
                ≥768 ..... 116,5px natural → piso 128

              Três degraus, não dois: com um piso único de 184px para tudo
              abaixo de 390px sobravam 24px de vão morto em 360px, porque só
              320px precisa da caixa alta.
            */
            'mb-6 min-h-[11.75rem] min-[360px]:min-h-[10.25rem] md:min-h-[8rem]',
          )}
        >
          <div className="flex items-start gap-2.5">
            {/* Hairline decorativa — o amarelo continua permitido nesse papel sobre claro. */}
            <span aria-hidden="true" className="mt-[0.6em] h-px w-6 shrink-0 bg-yellow" />
            <p className="hero-context max-w-[30rem] text-canvas/85">
              {current.detail.text}
            </p>
          </div>
        </div>

        ) : null}

        {/*
          ---------- Navegação: anterior · pilares · próximo ----------

          **Uma régua sob o conjunto, e nada mais.** Moldura, divisórias e
          preenchimento por item saíram — eram eles, somados, que davam a
          leitura de tabela. Setas e rótulos assentam na mesma linha-base, que é
          o único traço do componente.

          ============================================================
          DUAS MONTAGENS, E QUEM DECIDE É A LARGURA — MEDIDA, NÃO ESTIMADA
          ============================================================

          "EQUIPAMENTOS" é uma palavra só e pede **77px** em Oswald no corpo do
          rótulo; ela é o gargalo de todas as contas abaixo.

          **Desktop — setas na mesma fileira.** A faixa cabe em `min(31rem,83%)`
          da coluna; em 1024px, o pior caso, são ~346px. Tirando duas setas de
          44px sobram 258px, ou **86px por célula** — folga de 9px sobre os 77.
          Antes não cabia (65px) porque as divisórias e o `px-2.5` de cada
          segmento comiam a diferença; sem eles, cabe, e as setas deixam de
          precisar de uma fileira própria entre 1024 e 1279px.

          **Mobile — setas em fileira própria, alinhadas à direita.** Aqui a
          conta não fecha: em 320px a faixa tem 280px e, com as duas setas
          inline, sobrariam **64px por célula** — 13px abaixo do necessário, e
          `break-words` voltaria a partir o glifo ("EQUIPAME / NTOS"), que é
          exatamente o texto espremido que não pode existir. Com a fileira de
          rótulos ocupando a largura inteira, cada célula fica com **93px**, e o
          rótulo cabe em uma linha até 320px.

          As duas montagens não coexistem no DOM: cada instância (`mobile` /
          `desktop`) renderiza só a sua, então não há seta duplicada para
          teclado ou leitor de tela.
        */}
        <div
          className={cn(
            /*
              `items-end`: rótulos e setas encostam na régua pela base, que é o
              que faz os dois lerem como uma linha só. A régua é a **única**
              borda do componente.
            */
            'flex items-end border-b',
            onLight ? 'border-ink/20' : 'border-white/25',
          )}
        >
          {/* Desktop: seta anterior abrindo o eixo, na própria fileira. */}
          {isMobile ? null : renderArrow('prev', onLight)}

          <ul
            role="tablist"
            aria-label="Pilares da Bianchini"
            aria-orientation="horizontal"
            /*
              `grid-cols-3` nas duas variantes — é ele que impede layout shift.
              Os segmentos já foram dimensionados pelo conteúdo (`flex-auto`) e
              o estado ativo, que engrossa o rótulo, mudava a largura da célula
              **ao trocar de pilar**, deslocando os vizinhos a cada clique. Com
              três colunas iguais o peso da fonte deixa de afetar a caixa.
            */
            className="grid flex-1 grid-cols-3"
          >
            {heroSlides.map((slide, index) => {
              const selected = index === activeIndex
              return (
                <li key={slide.id} role="none" className="flex min-w-0">
                  <button
                    ref={(node) => {
                      tabsRef.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${variant}-${slide.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectSlide(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={cn(
                      /*
                        `items-end` + `pb-2.5`: o rótulo assenta na régua, como
                        as setas. `min-h-11` garante os 44px de alvo sem
                        precisar de preenchimento visível.
                      */
                      'relative flex min-h-11 w-full items-end justify-center pb-2.5 text-center',
                      'transition-colors duration-200 ease-precise',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                      onLight ? 'focus-visible:ring-ink' : 'focus-visible:ring-yellow',
                      /*
                        **Sem preenchimento, em nenhum estado.** O ativo era um
                        bloco grafite cheio — o "estado ativo visualmente
                        pesado" do briefing, que também fazia o seletor disputar
                        com o CTA primário. Agora o ativo é peso + contraste +
                        régua; o inativo só ganha realce no hover, e mesmo assim
                        discreto.
                      */
                      onLight
                        ? selected
                          ? 'text-ink'
                          : `${HERO_MUTED} hover:text-ink`
                        : selected
                          ? 'text-canvas'
                          : 'text-canvas/65 hover:text-canvas',
                    )}
                  >
                    {/*
                      Régua do estado ativo, assentada **sobre** a linha-base
                      compartilhada (`-bottom-px` cobre o 1px da borda do pai).
                      Em fundo claro ela é grafite: indicador de estado sobre
                      superfície clara não pode ser amarelo. Em fundo escuro o
                      amarelo volta a ser acento pleno.
                    */}
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-0 -bottom-px h-[2px]',
                          onLight ? 'bg-graphite' : 'bg-yellow',
                        )}
                      />
                    ) : null}
                    {/*
                      `break-words`: "Operação Comercial" é o rótulo mais longo
                      e, em coluna estreita, precisa quebrar entre palavras em
                      vez de estourar. Truncar não é opção — o nome do pilar é
                      conteúdo comercial.

                      **Condensada, não Manrope**: é a família dos rótulos
                      comerciais curtos do projeto (`CLAUDE.md`), e em Manrope
                      "EQUIPAMENTOS" pede ~98px numa palavra só, acima dos 86px
                      disponíveis por célula em 1024px.

                      A caixa reserva **duas linhas** (`leading-tight` = 1.25em,
                      logo 2.5em) para que um rótulo que quebra e outro que não
                      quebra ocupem a mesma altura — sem isso a régua do ativo
                      e a base dos três deixam de se alinhar.
                    */}
                    <span
                      className={cn(
                        'hero-tab-label font-condensed uppercase leading-tight break-words',
                        'min-h-[2.5em]',
                        /*
                          Peso 700 no ativo contra 600 no inativo. É o sinal
                          não-cromático do estado — e, com `grid-cols-3`, não
                          move nada.
                        */
                        selected ? 'font-bold' : 'font-semibold',
                      )}
                    >
                      {slide.pillar}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Desktop: seta próxima fechando o eixo, do outro lado. */}
          {isMobile ? null : renderArrow('next', onLight)}
        </div>

        {/*
          **As setas do mobile saíram daqui em 2026-08-05 (V1.1).** Elas viviam
          numa fileira própria abaixo da régua, alinhadas à direita — e a régua
          inteira fica fora da primeira dobra no toque (327 a 490px abaixo,
          medido). Agora o par anterior/próximo vive no marcador, junto ao
          título, dentro da dobra; esta régua continua sendo o lugar onde os
          **três nomes** ficam legíveis, com a largura que "EQUIPAMENTOS" e
          "OPERAÇÃO COMERCIAL" precisam para não quebrar no meio do glifo.

          Duplicar as setas nos dois lugares daria dois controles idênticos para
          a mesma ação na mesma tela — que é a duplicação que esta rodada
          precisa evitar, não produzir.
        */}
      </div>
    )
  }

  /**
   * ---------- Bloco editorial sobre a fotografia (desktop) ----------
   *
   * O que ocupa hoje a base do painel diagonal. Ele não é um cartão: é a
   * mesma faixa de assentamento que já existia ali quando o módulo de pilares
   * morava sobre a foto — superfície de borda a borda, ancorada na base,
   * dissolvendo para cima. O que mudou foi o conteúdo.
   *
   * A gramática é **a mesma da etiqueta da coluna esquerda**: régua amarela de
   * 2px, rótulo condensado em caixa alta, texto abaixo. É esse eco que faz o
   * lado direito ler como parte da arquitetura da dobra, e não como uma caixa
   * pousada sobre a imagem.
   *
   * Aqui o amarelo é acento pleno — a superfície é grafite a 90–97%, onde ele
   * mede 11,8:1. A regra que o proíbe como texto vale para fundo claro.
   *
   * A altura mínima é medida no slide mais longo: sem ela a faixa cresceria e
   * encolheria a cada troca, movendo a aresta superior da superfície sobre a
   * fotografia.
   */
  const renderSlideDetail = () => (
    <div
      key={settled ? `detail-${current.id}` : 'detail-initial'}
      className={cn(swapClass, 'min-h-[calc(126*var(--u))]')}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-[2px] w-11 shrink-0 bg-yellow" />
        <span className="hero-eyebrow font-condensed uppercase text-yellow">
          {current.detail.label}
        </span>
      </div>

      <p className={cn('hero-context mt-4 max-w-[34rem] text-canvas/85')}>{current.detail.text}</p>
    </div>
  )

  return (
    <section
      className={cn('hero-root', HERO_SURFACE, 'pt-[var(--header-height)]')}
      /*
        No mobile a dobra passa de 1000px de altura — mais que o limiar de
        600px em que `WhatsappFloat` já libera o botão por scroll. Sem esta
        marcação, o botão flutuante nasce sobre o bloco de navegação assim
        que o usuário rola 600px, ainda dentro da hero. Ver
        `whatsapp-float.tsx`: qualquer elemento com este atributo visível
        mantém o botão escondido, independente do scroll.
      */
      data-whatsapp-safe-zone
    >
      <div
        className="hero-fold relative isolate flex flex-col lg:h-[calc(100svh-var(--header-height))] lg:min-h-[40rem]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
      >
        <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
          <filter id={PHOTO_GRADE_ID} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude="0.9285" exponent="1.250" offset="0.0047" />
              <feFuncG type="gamma" amplitude="0.9210" exponent="1.240" offset="0.0027" />
              <feFuncB type="gamma" amplitude="0.9188" exponent="1.260" offset="0.0017" />
            </feComponentTransfer>
          </filter>
        </svg>

        {/* ---------- Painel fotográfico com recorte diagonal (desktop) ---------- */}
        <div
          className="absolute inset-y-0 right-0 hidden w-[58.575%] overflow-hidden lg:block"
          style={{ clipPath: PHOTO_CLIP }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              data-active={index === activeIndex}
              aria-hidden={index !== activeIndex}
              className={cn('hero-slide-media absolute inset-0', reducedMotion && 'transition-none')}
            >
              {/* Slides 2 e 3 só montam depois de `load` ou na primeira interação — ver `secondaryReady`. */}
              {index === 0 || secondaryReady || index === activeIndex ? (
              <Image
                src={slide.media.src}
                alt={slide.media.alt}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : undefined}
                /*
                  **`eager` nos slides inativos.** O lazy loading nativo não
                  busca de forma confiável imagem de carrossel que está no DOM
                  mas visualmente oculta (`opacity: 0`): medido em 768×1024,
                  os dois slides inativos ficavam com `currentSrc` vazio e
                  **nenhuma requisição de rede era emitida** — nem depois de
                  rolar a caixa para o centro da janela, nem depois de clicar
                  no pilar correspondente. O usuário trocava de slide e via um
                  painel sem fotografia.

                  Não é problema de formato: no mesmo viewport o **JPEG**
                  (`linha-de-coccao.jpg`) falhava junto com os dois PNGs, e em
                  390×844 os três carregavam com o mesmo `opacity: 0`. O
                  endpoint responde 200 em todas as 54 combinações de
                  imagem × largura × Accept.

                  É o mesmo defeito já registrado em `CLAUDE.md` para a faixa
                  de logos ("lazy loading nativo não carrega o que está fora
                  da viewport horizontal"), e a solução é a mesma: forçar a
                  carga. `priority` já implica `eager` no primeiro slide, e
                  passar os dois juntos emite aviso do `next/image` — daí o
                  `undefined` no índice 0.
                */
                loading={index === 0 ? undefined : 'eager'}
                quality={82}
                /*
                  **`1vw`, não `1px` (corrigido em 2026-08-05, V1.1).** A
                  intenção sempre foi esta: acima de 1023px esta é a instância
                  visível e pede 60vw; abaixo, quem aparece é a caixa em fluxo
                  logo adiante, e aqui o navegador deve baixar a menor candidata
                  possível. Com `1px` isso **não acontecia**: o `next/image`
                  monta o `srcset` a partir das larguras em `vw` declaradas —
                  `1px` não é uma delas —, então a menor razão continuava sendo
                  a de 60vw e a menor candidata gerada era **w=384**. Medido em
                  390 × 844, esta instância (invisível ali) baixava os três
                  slides em 384px: 59 KB para elementos em `display:none`.

                  Com `1vw` a menor razão passa a 0,01 e o `srcset` volta a
                  incluir as larguras pequenas; em 390px o navegador resolve
                  1vw = 3,9px e escolhe a candidata de 16px. A instância visível
                  não muda: em 1440px, 60vw = 864px continua resolvendo para
                  w=1080, exatamente como antes.
                */
                sizes="(max-width: 1023px) 1vw, 60vw"
                style={{
                  ...(slide.media.grade ? PHOTO_GRADE : null),
                  objectPosition: slide.media.positionDesktop ?? slide.media.position,
                }}
                className="object-cover"
              />
              ) : null}
            </div>
          ))}

          {/* Sombra na aresta do corte — separa os planos e dá fio de luz à keyline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-graphite/45 via-graphite/10 to-transparent"
          />

          {/*
            ---------- Base de contraste do módulo de pilares ----------

            **Não usar `from-graphite/NN` aqui.** A versão anterior declarava
            `from-graphite/88 via-graphite/42` e essas duas classes **nunca
            existiram**: 88 e 42 não estão na escala de opacidade padrão do
            Tailwind 3 (…35, 40, 45…, …85, 90, 95), então nada era gerado e o
            scrim inteiro sumia sem erro de build. Medido com o módulo
            escondido e o fundo amostrado pixel a pixel: o pilar ativo ficava
            em **1,14:1** sobre "Equipamentos" e **1,15:1** sobre "Operação
            Comercial" — ilegível. Daí o gradiente ser declarado em `rgba()`
            arbitrário, que não depende de escala nenhuma.

            O gradiente sobe suave (sem costura horizontal) e chega a 96% na
            base: é ele que garante AA independentemente da fotografia ativa,
            que é o requisito. A fotografia continua visível — o módulo ocupa
            a faixa inferior, não o painel.
          */}
          {/*
            Este gradiente cobria a faixa inferior inteira do painel (`h-[58%]`)
            e era ao mesmo tempo o assentamento da fotografia **e** a superfície
            do módulo. Como ele é ancorado no painel e o módulo cresce para
            cima conforme o texto, o topo do conteúdo saía da faixa densa em
            "Operação Comercial". Agora ele faz **só** o assentamento da
            fotografia; a superfície do módulo é uma caixa própria, medida pelo
            conteúdo (ver o ponto de chamada, mais abaixo).
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(16,16,16,0)_0%,rgba(16,16,16,0.28)_30%,rgba(16,16,16,0.62)_66%,rgba(16,16,16,0.86)_100%)]"
          />

          {/* Cortina de revelação — uma vez só, no carregamento. */}
          <div aria-hidden="true" className="hero-curtain absolute inset-0 bg-canvas" style={{ clipPath: PHOTO_CLIP }} />

          {/*
            Bloco editorial do slide (desktop) — junto à base da fotografia,
            dentro do recorte diagonal. `pl-[10%]` mantém o texto à direita da
            aresta diagonal (que na altura dele está em ~6% da largura do
            painel).
          */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            {/*
              Superfície do módulo: uma caixa **medida pelo conteúdo**, não uma
              fração do painel. É ela que garante que todo texto fique dentro
              da área de contraste nos três slides — antes o conteúdo crescia
              para cima e escapava da faixa densa do gradiente do painel.

              **Respiro assimétrico, medido (2026-08-04).** Antes o recuo era
              `pt-9` / `pb-8` — praticamente simétrico —, e o resultado medido
              era a moldura dos controles a **33px da base da dobra** em todos
              os desktops: o conjunto lia como encostado no rodapé da
              fotografia, com a moldura sobrando na aresta inferior.

              Agora o recuo inferior é mais que o dobro do superior (56 contra
              26 unidades), o que empurra o conjunto para cima e abre a base.
              Os dois em `--u`, a unidade da própria dobra: em `rem` o respiro
              não encolheria junto com a composição e comeria altura útil em
              1366×768, que é o viewport mais apertado.

              A superfície continua **ancorada na base** — ela é o assentamento
              da fotografia, não um cartão flutuante. O que subiu foi o
              conteúdo dentro dela.
            */}
            <div className="relative bg-[linear-gradient(180deg,rgba(16,16,16,0.90)_0%,rgba(16,16,16,0.96)_45%,rgba(16,16,16,0.97)_100%)] pb-[calc(56*var(--u))] pl-[10%] pr-[6%] pt-[calc(26*var(--u))]">
              {/* Encontro com a fotografia — dissolve a aresta superior da caixa. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-full h-[calc(150*var(--u))] bg-[linear-gradient(180deg,rgba(16,16,16,0)_0%,rgba(16,16,16,0.42)_52%,rgba(16,16,16,0.90)_100%)]"
              />
              <div className={cn('w-full max-w-[38rem]', !settled && 'hero-seq [--seq:800ms]')}>
                {renderSlideDetail()}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Keyline amarela, paralela à diagonal ---------- */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          <line x1="54.95" y1="0" x2="40.889" y2="100" stroke="#F5C64B" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        {/*
          ---------- Coluna de conteúdo ----------

          A largura é **percentual**, não `rem`: a diagonal é percentual, então
          uma coluna medida em `rem` a atravessa em telas estreitas. Em
          1024–1120px, com `max-w-[38rem]`, os CTAs entravam ~50–95px por baixo
          da fotografia. 47% acompanha o corte (a diagonal fica em ~45,8% da
          largura na altura dos CTAs, medido, não estimado) e o teto em `rem`
          segura o comprimento de linha em telas muito largas.

          O recuo é `pl-16` em toda a faixa: 64px é o x=67 do mockup a --u=1.
        */}
        {/*
          ---------- Tratamento da superfície clara ----------

          A área à esquerda da diagonal era um off-white liso ocupando ~47% da
          primeira dobra — na captura de 1440×900 sobravam ~290px de vazio
          abaixo das métricas, e o conjunto lia como "fundo branco grande",
          não como superfície. São três camadas, todas subordinadas ao texto:

            1. luz .......... um clarão radial quase imperceptível no alto, à
                              esquerda, que dá origem à luz da composição em
                              vez de o fundo ser plano ponta a ponta;
            2. hairlines .... **quatro fios verticais**, não uma grade. O teto
                              de composição do projeto (`CLAUDE.md`) proíbe
                              grade cartesiana como fundo de seção, e ele
                              continua valendo: isto é margem de prancheta —
                              um punhado de fios de cota, com opacidade de 3,5%,
                              morrendo antes do topo e antes da diagonal —, não
                              um padrão de duas direções repetido em campo;
            3. assentamento . o gradiente tonal de dois níveis que já existia
                              em `HERO_SURFACE`, na própria `section`.

          Tudo em `-z-10` dentro de `.hero-fold` (que é `isolate`): fica atrás
          do texto e da fotografia, e some abaixo de `lg`, onde a coluna clara
          não é mais uma área grande o bastante para parecer vazia.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_8%_0%,rgba(255,255,255,0.85),transparent_58%)]" />
          <div className="absolute inset-y-0 left-0 w-[47%] bg-[repeating-linear-gradient(90deg,rgba(16,16,16,0.035)_0_1px,transparent_1px_calc(100%/4))] [mask-image:linear-gradient(180deg,transparent_0%,black_28%,black_72%,transparent_100%)]" />
        </div>

        {/*
          ============================================================
          OS RESPIROS DA COLUNA SÃO `--u`, NÃO `rem` (2026-08-05)
          ============================================================

          Os intervalos verticais desta coluna eram `rem` — `py-12`, `mt-5`,
          `mt-7`, `mt-9`, `mt-6`. Enquanto a coluna terminava nas métricas isso
          não aparecia: sobrava altura. Com o módulo de pilares no pé dela a
          conta virou apertada, e medir mostrou o que o `rem` faz aqui:

            1366×768   coluna 817px numa dobra de 688 — 129px para fora da
                       própria `section`, por cima da seção seguinte
            1024×768   coluna 758px numa dobra de 692 — 67px para fora

          Em 1024 aumentar o divisor de `--u` **não resolveria**: ali a unidade
          é limitada pela largura (1024/1586), não pela altura, então a
          composição já está no menor tamanho que a largura permite e quem não
          encolhia eram os ~314px de respiro fixo. Em `--u` eles comprimem
          junto com a tipografia, que é a regra da dobra desde o começo
          (`CLAUDE.md`: "toda medida do hero é um pixel do mockup expresso em
          `--u`") — estes intervalos eram a exceção que sobrou.

          Abaixo de `lg` nada disso vale: lá não há `--u` e os respiros em
          `rem` continuam como estavam.
        */}
        <div className="relative flex flex-1 flex-col px-5 pt-6 min-[390px]:pt-7 md:px-8 md:pt-9 lg:static lg:w-[47%] lg:max-w-[47rem] lg:justify-center lg:px-0 lg:py-[calc(34*var(--u))] lg:pl-16">
          {/* Etiqueta da marca — constante, é o enquadramento da empresa e não do pilar. */}
          <div className={cn(!settled && 'hero-seq [--seq:120ms]', 'flex items-center gap-3')}>
            <span aria-hidden="true" className="h-[2px] w-8 shrink-0 bg-yellow lg:w-11" />
            <span className="hero-eyebrow font-condensed uppercase text-ink">{positioning.eyebrow}</span>
          </div>

          {/*
            ---------- Marcador do pilar ativo ----------

            Entre a etiqueta institucional e o título, **em toda largura** desde
            2026-08-05 (V1.1). Antes era `hidden lg:block` e o mobile tinha uma
            segunda instância dentro da faixa grafite, abaixo da fotografia — o
            que a medição mostrou estar fora da primeira dobra em toda largura de
            toque. Ver o comentário de `renderPillarMark`.

            A etiqueta acima é constante (enquadra a empresa); este marcador é o
            que muda por slide. Ler os dois em sequência dá "Cozinhas
            industriais e food service → 01/03 Projetos → *título*" — do geral ao
            específico, com o título ainda dominante logo abaixo.
          */}
          <div className={cn(!settled && 'hero-seq [--seq:160ms]')}>{renderPillarMark()}</div>

          {/*
            Bloco remontado por slide (`key`) — replica o padrão de troca de
            painel já usado em diagnóstico/sintomas/atuação. A altura mínima é
            medida em `--u` (não em `rem`) porque o conteúdo dentro dela também
            é: com piso fixo, o slide de três linhas de título empurrava CTAs e
            métricas para baixo em telas largas.
          */}
          <div
            key={settled ? current.id : 'initial'}
            id={`${baseId}-panel`}
            role="tabpanel"
            /*
              A navegação renderiza duas vezes (mobile/desktop) com ids
              distintos, então `-tab-${id}` sozinho não existia no DOM e este
              `aria-labelledby` apontava para lugar nenhum. Aponta para a
              instância desktop, que existe sempre no DOM (a versão oculta é
              `display:none`, mas o rótulo é o mesmo texto nas duas).
            */
            aria-labelledby={`${baseId}-tab-desktop-${current.id}`}
            aria-live={hovering || focused ? 'polite' : 'off'}
            className="mt-3 min-h-[12rem] md:min-h-[9rem] lg:mt-[calc(20*var(--u))] lg:min-h-[calc(240*var(--u))]"
          >
            <h1 className={cn('hero-title text-ink', !settled && 'hero-seq [--seq:200ms]', swapClass)}>
              {current.title}
            </h1>

            <p
              className={cn(
                'hero-lead mt-3 max-w-[34rem] lg:mt-[calc(16*var(--u))] lg:max-w-[min(31rem,92%)]',
                HERO_MUTED,
                !settled && 'hero-seq [--seq:400ms]',
                swapClass,
              )}
            >
              {current.text}
            </p>
          </div>

          {/*
            `items-start` no mobile: sem ele os dois CTAs esticam para a
            largura da coluna. O primário fica fora do bloco remontado acima —
            não tem por que refazer a entrada a cada troca de slide, o rótulo e
            o destino nunca mudam.
          */}
          <div className="mt-5 flex flex-col items-start gap-2.5 min-[390px]:mt-6 sm:flex-row sm:flex-wrap sm:items-center lg:mt-[calc(28*var(--u))] lg:flex-col lg:items-start lg:gap-3 min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:gap-6">
            <HeroPrimaryCta href="/contato" className={!settled ? 'hero-seq [--seq:540ms]' : undefined} />
            <HeroSecondaryCta
              key={settled ? current.id : 'secondary-initial'}
              href={current.cta.href}
              label={current.cta.label}
              icon={current.cta.icon}
              className={cn(!settled && 'hero-seq [--seq:600ms]', swapClass)}
            />
          </div>

          {/*
            ---------- Régua + métricas (constantes, não fazem parte do slide) ----------

            O teto é `min(31rem, 83%)`, não `31rem`: as métricas são o bloco
            mais **baixo** da coluna e a diagonal corre para a esquerda quanto
            mais se desce — na altura delas ela está em ~42,6% da largura,
            contra ~45,8% na altura dos CTAs. Com teto fixo, a régua amarela e
            a terceira métrica entravam por baixo da fotografia em 1024px. Os
            83% referem-se à caixa da coluna, que já é percentual.
          */}
          <div className="mt-6 max-w-[34rem] min-[390px]:mt-7 lg:mt-[calc(36*var(--u))] lg:max-w-[min(31rem,83%)]">
            <div aria-hidden="true" className={cn('h-px w-full bg-yellow/80', !settled && 'hero-seq [--seq:580ms]')} />

            <dl className="mt-4 flex justify-between gap-3 lg:mt-[calc(24*var(--u))]">
              {heroMetrics.map((metric, index) => (
                <div
                  key={metric.value}
                  style={
                    {
                      '--label-w': METRIC_LABEL_WIDTH[index],
                      '--seq': `${620 + index * 60}ms`,
                    } as CSSProperties
                  }
                  className={cn(
                    !settled && 'hero-seq',
                    index > 0 && "relative pl-4 before:absolute before:left-0 before:top-0 before:h-[3.25rem] before:w-px before:bg-yellow before:content-[''] lg:before:h-[3.5rem]",
                  )}
                >
                  <dt className="hero-numeral font-condensed tabular-nums text-ink">{metric.value}</dt>
                  <dd className={`hero-metric-label mt-2 max-w-[8.5rem] lg:max-w-[calc(var(--label-w)*1em)] ${HERO_MUTED}`}>
                    {metric.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/*
            ---------- Módulo de pilares (desktop) ----------

            Fecha a coluna clara. **Mesma malha do bloco de métricas**, e não
            uma caixa com largura própria: `min(31rem, 83%)` é literalmente o
            teto das métricas, então a moldura do seletor começa e termina nas
            mesmas verticais da régua amarela logo acima. É o que faz o módulo
            ler como continuação da coluna, não como um controle encaixado
            depois dela.

            Os 83% não são estéticos: a diagonal corre para a esquerda quanto
            mais se desce, e este é agora o bloco **mais baixo** da coluna — com
            teto fixo em `rem` a moldura entraria por baixo da fotografia em
            1024–1120px, exatamente como acontecia com as métricas antes do
            teto percentual.

            `mt-7`, contra `mt-9` das métricas: métricas e módulo formam o pé da
            coluna e o intervalo entre eles é menor que o que os separa dos
            CTAs. `lg:` em toda a regra porque abaixo de 1024px este bloco não
            existe — lá o módulo vive na faixa grafite, sob a fotografia.
          */}
          <div
            className={cn(
              'hidden lg:mt-[calc(30*var(--u))] lg:block lg:max-w-[min(31rem,83%)]',
              !settled && 'hero-seq [--seq:800ms]',
            )}
          >
            {renderPillarNav('desktop')}
          </div>

          {/* ---------- Fotografia + navegação dos pilares no mobile ---------- */}
          <div
            className="relative -mx-5 mt-7 md:-mx-8 lg:hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/*
              `overflow-hidden` é obrigatório desde que a troca de slide ganhou
              deriva horizontal (2026-08-04): os slides inativos ficam em
              `translateX(1.5%)` e, sem recorte, 1,5% da largura da caixa
              vazava para fora do documento — 12px de rolagem horizontal real
              medidos em 768px. O painel do desktop já recortava; esta caixa,
              não. Mesmo princípio anotado em `CLAUDE.md` para a cortina do
              hero: transform e clip-path pintam, mas continuam contando como
              área rolável.
            */}
            <div className="relative aspect-[4/5] w-full overflow-hidden min-[390px]:aspect-[16/13]">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  data-active={index === activeIndex}
                  aria-hidden={index !== activeIndex}
                  className={cn('hero-slide-media absolute inset-0', reducedMotion && 'transition-none')}
                >
                  {/* Mesmo diferimento da instância do desktop — ver `secondaryReady`. */}
                  {index === 0 || secondaryReady || index === activeIndex ? (
                  <Image
                    src={slide.media.src}
                    alt={slide.media.alt}
                    fill
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    /* Mesma razão da instância do desktop — ver o comentário lá. */
                    loading={index === 0 ? undefined : 'eager'}
                    quality={78}
                    /*
                      **Inverso do `sizes` do desktop, e não `100vw`.** Este bloco
                      é `lg:hidden`, mas `hidden` não impede download: com
                      `100vw` o navegador resolvia a largura pela janela real e,
                      a 1440px, baixava a candidata `w=1920` — 175 KB medidos,
                      por slide, para um elemento que ninguém vê. É a armadilha
                      das "duas instâncias da foto do hero" anotada no
                      `CLAUDE.md`: só a instância do desktop a respeitava.

                      **`1vw`, não `1px` (2026-08-05, V1.1).** A condição acima
                      de 1023px precisava fazer o navegador escolher a menor
                      candidata do `srcset` — e não fazia: o `next/image` deriva
                      as larguras candidatas das razões em `vw` declaradas aqui,
                      e `1px` não é uma delas. Com `100vw` sozinho a menor razão
                      era 1,0 e a menor candidata gerada, **w=640**; medido em
                      1440 × 900, esta instância invisível baixava os três
                      slides em 640px — 109 KB de fotografia que ninguém vê.
                      `1vw` põe 0,01 na conta, o `srcset` volta a incluir as
                      larguras pequenas e o navegador escolhe a de 16px. Em
                      390px nada muda: 100vw continua resolvendo para w=640.
                    */
                    sizes="(max-width: 1023px) 100vw, 1vw"
                    style={{
                      ...(slide.media.grade ? PHOTO_GRADE : null),
                      objectPosition: slide.media.position,
                    }}
                    className="object-cover"
                  />
                  ) : null}
                </div>
              ))}

              {/*
                Assentamento da base da fotografia — não é mais a base de
                contraste do módulo (o módulo saiu de cima da foto, ver
                abaixo). Só o suficiente para a foto encontrar a faixa grafite
                sem uma aresta dura entre as duas.
              */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(180deg,rgba(16,16,16,0)_0%,rgba(16,16,16,0.55)_100%)]"
              />
            </div>

            {/*
              ---------- Módulo de pilares no mobile: fora da fotografia ----------

              No mobile o módulo **não fica mais sobre a imagem**. A caixa da
              foto é baixa (aspect 4/5 a 16/13), então o módulo ocupava uma
              fração grande dela e caía inteiro sobre a área iluminada — foi
              onde o contraste medido despencou. Reduzir tudo
              proporcionalmente não resolveria: o problema é de área
              disponível, não de escala.

              Aqui ele é uma faixa grafite sólida, encostada na base da foto,
              sangrando de borda a borda (o `-mx-5`/`-mx-8` do wrapper). O
              contraste passa a ser o do sistema (canvas sobre grafite,
              11,8:1), independente da fotografia — e o rótulo do pilar ganha
              a largura que precisa para não ficar espremido.

              **O marcador saiu daqui em 2026-08-05 (V1.1).** Ele subiu para a
              coluna clara, acima do título, porque nesta posição ficava fora da
              primeira dobra em toda largura de toque. A faixa continua sendo a
              casa do **seletor** — essa parte não mudou, e a razão dela (área
              disponível, não escala) continua valendo.
            */}
            <div className="bg-graphite px-5 pb-7 pt-6 md:px-8">
              {renderPillarNav('mobile')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
