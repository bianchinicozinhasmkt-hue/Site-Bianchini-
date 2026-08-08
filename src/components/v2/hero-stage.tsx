'use client'

import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
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
 * partir de `v1-final`; lá só a ordem das seções mudou. Este componente e o seu
 * `hero-stage.module.css` são o escopo inteiro da V2 na home.
 *
 * ============================================================
 * POR QUE ESTA ESTRUTURA, E NÃO A ANTERIOR
 * ============================================================
 *
 * A montagem anterior punha **três fotografias verticais de altura inteira**
 * lado a lado, cortadas em diagonal. O defeito não era de overlay nem de
 * proporção: três cenas disputando o mesmo campo de visão ao mesmo tempo fazem
 * cada uma perder escala, e nenhuma consegue ser *a* cena. O resultado lia como
 * painel de aplicativo, não como a primeira página de uma empresa que projeta e
 * fornece cozinha industrial.
 *
 * Aqui há **um palco e três estados**:
 *
 *   · uma cena por vez, ocupando a área visual útil inteira, no tamanho em que
 *     uma fotografia de operação real significa alguma coisa;
 *   · o conteúdo comercial assenta **dentro** da fotografia, na coluna
 *     esquerda, e não numa faixa empilhada abaixo dela;
 *   · os três caminhos vivem numa régua editorial na base do palco — presentes
 *     o tempo todo, sem cada um cobrar um terço da tela;
 *   · uma faixa simples fecha a dobra com os fatos confirmados e uma ação.
 *
 * ============================================================
 * COMO EQUIPAMENTOS LIDERA
 * ============================================================
 *
 * Por posição na narrativa, não por tratamento de imagem:
 *
 *   1. é o **estado inicial** — o que a página mostra a quem chega, e o único
 *      que o servidor entrega;
 *   2. o `h1` da página é a copy dele;
 *   3. é o primeiro da régua e o primeiro a receber o foco;
 *   4. a ação da faixa de fechamento também é de equipamentos.
 *
 * O CTA preenchido é o mesmo nos três estados de propósito: quando um estado
 * está ativo, ele é a cena inteira, e um botão de contorno ali seria uma ação
 * secundária sem nada de primário na tela.
 *
 * Nenhuma fotografia é maior, mais clara, mais saturada ou menos coberta que as
 * outras — as três ocupam exatamente o mesmo palco.
 *
 * ============================================================
 * O `h1` E A TROCA DE ESTADO
 * ============================================================
 *
 * Há **um** `h1` na página, sempre visível, e ele carrega o título do estado
 * ativo. No estado inicial esse título é a copy aprovada, transcrita sem
 * alteração — e é o que o servidor renderiza, portanto o que buscador, Open
 * Graph e prévia de link leem. Trocar de estado é ação do visitante, e o título
 * passa a descrever o que está na tela.
 *
 * A alternativa — um `h1` escondido com um texto e um `h2` visível com outro —
 * deixaria leitor de tela e leitor visual ouvindo coisas diferentes.
 *
 * ============================================================
 * SEMÂNTICA DA RÉGUA
 * ============================================================
 *
 * É um `tablist` de verdade (`tab` / `tabpanel`, `aria-selected`, tabindex
 * rotativo, setas / Home / End), porque é exatamente isto que ela é: três
 * controles que trocam um painel. O que **não** é abas é a aparência — sem
 * caixa, sem pílula, sem moldura por item. O que existe é uma régua
 * compartilhada com um indicador que corre, que é o mesmo recurso do seletor de
 * pilares da V1.
 *
 * Sem JavaScript a dobra continua íntegra: mostra Equipamentos, com título,
 * intenção e CTA, e os três caminhos continuam **nomeados** na régua.
 */
export function HeroStage() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const state = heroStates[active]

  /**
   * Navegação por seta na régua, como manda o padrão de `tablist`: a seta move
   * a seleção **e** o foco, `Home`/`End` vão às pontas e a lista dá a volta.
   * Sem isto, o teclado só alcançaria o primeiro caminho.
   */
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    setActive((current) => {
      const last = heroStates.length - 1
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? last
            : event.key === 'ArrowRight'
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
        `pt-[var(--header-height)]` mais `h-[100svh]`: o cabeçalho da V1 é uma
        faixa opaca e fixa, então a dobra começa embaixo dele e o conjunto fecha
        em **uma tela exata**. `svh`, e não `vh`: no telefone `vh` ignora a barra
        de endereço retrátil e a dobra estoura justamente no carregamento.
      */
      className={cn(
        styles.hero,
        'relative isolate flex flex-col bg-graphite pt-[var(--header-height)]',
        'h-[100svh] min-h-[34rem]',
      )}
    >
      {/* ================= O PALCO ================= */}
      <div className={cn(styles.stage, 'flex min-h-0 flex-1 flex-col')}>
        {/* ---------- As três cenas, empilhadas no mesmo lugar ---------- */}
        {heroStates.map((item, index) => (
          <div
            key={item.id}
            aria-hidden={index !== active}
            className={cn(styles.frame, index === active && styles.frameActive, GRADE[item.id])}
          >
            <Image
              src={item.media.src}
              alt={item.media.alt}
              fill
              /*
                Só a cena inicial é `priority`: ela é o LCP da página. As outras
                duas ficam `lazy` — estão na janela, então o navegador as busca
                assim que sobra banda, depois da que foi pré-carregada. Marcá-las
                `eager` as poria disputando a primeira pintura com o LCP.
              */
              priority={index === 0}
              loading={index === 0 ? undefined : 'lazy'}
              /*
                O palco é de largura inteira: `100vw` descreve a caixa real. Com
                uma medida menor o navegador serve uma variante estreita demais e
                a cena sai borrada; com `sizes` ausente ele pede a maior da lista
                (3840px) — foi assim que uma cena chegou a **não carregar** em
                produção na montagem anterior.
              */
              sizes="100vw"
              quality={86}
              style={{ objectPosition: item.media.objectPosition }}
              className={cn('object-cover', item.id === 'projetos' && styles.photoProjetos)}
            />
          </div>
        ))}

        {/*
          Scrim local: fecha a coluna esquerda, onde o texto assenta, e a base,
          onde a régua assenta. A metade direita da fotografia fica sem cobertura
          nenhuma — é o que devolve inox, textura e profundidade.
        */}
        <span aria-hidden="true" className={styles.scrim} />

        {/* ---------- Conteúdo comercial, dentro da cena ---------- */}
        <div
          id="hero-painel"
          role="tabpanel"
          aria-labelledby={`hero-aba-${state.id}`}
          className="relative z-10 flex min-h-0 flex-1 items-end"
        >
          <Container className="w-full">
            {/*
              `key` no bloco: trocar de estado remonta o conteúdo, e a animação
              escalonada do módulo CSS roda uma vez por troca — sem estado
              intermediário e sem temporizador em JavaScript.
            */}
            <div
              key={state.id}
              className="max-w-[34rem] pb-[clamp(1.5rem,4.5vh,3rem)] lg:max-w-[40rem]"
            >
              <p
                className={cn(
                  styles.enter,
                  'inline-flex items-center gap-3 font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-yellow sm:text-[0.75rem]',
                )}
              >
                <span aria-hidden="true" className="h-[2px] w-7 shrink-0 bg-yellow" />
                {homeHero.eyebrow}
              </p>

              <h1
                id="hero-titulo"
                style={{ '--delay': '60ms' } as CSSProperties}
                className={cn(
                  styles.enter,
                  'mt-4 font-sans font-extrabold leading-[1.06] tracking-[-0.03em] text-canvas',
                  'text-[clamp(1.875rem,6.2vw,2.75rem)]',
                  'lg:mt-5 lg:max-w-[19ch] lg:text-[clamp(2.25rem,3.5vw,3.75rem)] lg:leading-[1.04]',
                )}
              >
                {state.headline}
              </h1>

              <p
                style={{ '--delay': '130ms' } as CSSProperties}
                className={cn(
                  styles.enter,
                  'mt-4 max-w-[48ch] font-sans font-medium leading-[1.5] text-canvas/85',
                  'text-[0.9375rem] lg:mt-6 lg:text-[1.0625rem]',
                )}
              >
                {state.intent}
              </p>

              <div
                style={{ '--delay': '200ms' } as CSSProperties}
                className={cn(styles.enter, 'mt-6 lg:mt-8')}
              >
                <HeroCta href={state.cta.href} event={state.event} label={state.cta.label} />
              </div>
            </div>
          </Container>
        </div>

        {/* ================= RÉGUA DOS TRÊS CAMINHOS ================= */}
        <div className={cn(styles.rail, 'relative z-10 shrink-0')}>
          <Container>
            {/*
              O indicador mede **um terço da coluna de texto**, não da janela:
              ele precisa começar e terminar onde os rótulos começam e terminam.
              Fora do `Container` ele nascia colado à borda da tela e a marca
              amarela ficava deslocada em relação a "EQUIPAMENTOS".
            */}
            <div className="relative">
              <span
                aria-hidden="true"
                style={{ '--i': active } as CSSProperties}
                className={cn(styles.indicator, 'bg-yellow')}
              />

              <div
                role="tablist"
                aria-label="Frentes da Bianchini"
                aria-orientation="horizontal"
                onKeyDown={onKeyDown}
                className="grid grid-cols-3"
              >
                {heroStates.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabsRef.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    id={`hero-aba-${item.id}`}
                    aria-selected={index === active}
                    aria-controls="hero-painel"
                    /* Tabindex rotativo: a régua inteira é uma parada de `Tab`. */
                    tabIndex={index === active ? 0 : -1}
                    onClick={() => setActive(index)}
                    /*
                      O ponteiro **antecipa** o estado no desktop, e é o mesmo
                      gesto do clique. Não há autoplay nem troca sozinha: só muda
                      quando o visitante aponta ou seleciona.
                    */
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className={cn(
                      styles.railItem,
                      'min-h-[3.25rem] py-3.5 pr-3 text-left lg:py-5',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow',
                      index === active ? 'text-canvas' : 'text-canvas/60 hover:text-canvas/85',
                    )}
                  >
                    <span>
                      <span
                        className={cn(
                          'block font-condensed uppercase leading-none tracking-[0.06em]',
                          'text-[0.8125rem] sm:text-[0.9375rem] lg:text-[1.0625rem]',
                          index === active ? 'font-bold' : 'font-semibold',
                        )}
                      >
                        {item.name}
                      </span>
                      {/*
                        A situação do cliente, em uma linha. Sai abaixo de `sm`:
                        em 360px as três colunas têm ~105px e a frase quebraria
                        em quatro linhas, empurrando a régua para dentro do palco.
                      */}
                      <span className="mt-1.5 hidden text-[0.8125rem] leading-snug opacity-75 sm:block">
                        {item.cue}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ================= FAIXA DE FECHAMENTO ================= */}
      {/*
        Fecha a primeira dobra e pertence a ela — não é seção da home. Só o que
        está confirmado (`site.ts`: 18 anos, abrangência Brasil) mais uma ação
        comercial. Tipografia e um separador; nenhum ícone, cartão, selo ou caixa
        arredondada.
      */}
      <div className="shrink-0 border-t border-white/[0.14] bg-graphite-deep">
        <Container>
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:py-4">
            <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1 sm:gap-x-7">
              {homeHeroMetrics.map((metric, index) => (
                <div key={metric.label} className="flex items-baseline gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="mr-3 hidden h-3 w-px bg-white/20 sm:block" />
                  ) : null}
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="font-condensed text-[0.9375rem] font-bold uppercase tracking-[0.03em] text-canvas">
                    {metric.value}
                  </dd>
                  <span aria-hidden="true" className="text-[0.75rem] text-canvas/60">
                    {metric.label}
                  </span>
                </div>
              ))}
            </dl>

            <Link
              href={heroSecondary.href}
              onClick={() => trackEvent('hero_orcamento_click', { origem: 'hero' })}
              className="group inline-flex min-h-[2.75rem] w-fit items-center gap-2 text-[0.875rem] font-semibold text-canvas transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:min-h-0"
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

/** Correção tonal por estado. Os valores estão no módulo CSS, com a justificativa. */
const GRADE: Record<string, string | undefined> = {
  equipamentos: undefined,
  projetos: styles.gradeProjetos,
  consultoria: styles.gradeConsultoria,
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
 */
function HeroCta({ href, event, label }: { href: string; event: AnalyticsEvent; label: string }) {
  return (
    <Link
      href={href}
      onClick={() => trackEvent(event, { origem: 'hero' })}
      className={cn(
        'group/cta relative inline-flex min-h-[3rem] items-stretch overflow-hidden rounded-[2px] bg-yellow sm:min-h-[3.375rem]',
        'font-condensed text-[0.9375rem] font-semibold uppercase tracking-[0.05em] text-ink sm:text-[1rem]',
        'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-yellow-bright',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'hover:before:scale-y-100 focus-visible:before:scale-y-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-graphite',
      )}
    >
      <span className="relative z-10 flex items-center px-6 sm:px-7">{label}</span>
      <span
        aria-hidden="true"
        className="relative z-10 flex w-[3.25rem] shrink-0 items-center justify-center border-l border-ink/20 sm:w-[3.5rem]"
      >
        <ArrowRightIcon
          size={18}
          className="transition-transform duration-200 ease-precise group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1"
        />
      </span>
    </Link>
  )
}
