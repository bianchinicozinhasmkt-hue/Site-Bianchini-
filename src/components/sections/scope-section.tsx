'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useRef, useState } from 'react'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { ArrowRightIcon } from '@/components/ui/icons'
import { scopeLevels } from '@/data/scope-levels'
import { solutions } from '@/data/solutions'
import { cn } from '@/lib/utils'

/**
 * Os cinco níveis de atuação — arquitetura de camadas conectadas, não um
 * painel de dashboard.
 *
 * ============================================================
 * POR QUE A COMPOSIÇÃO MUDOU DE NOVO
 * ============================================================
 *
 * A versão anterior era um índice vertical dentro de uma caixa cinza clara, ao
 * lado de uma fotografia solta — a leitura era literalmente "menu lateral +
 * conteúdo", o padrão de um painel de administração. Um sistema de cinco
 * níveis coordenados precisa parecer um sistema, não uma tela de configurações.
 *
 * Agora o índice **é um espinhaço horizontal**: cinco nós numerados numa linha
 * só, ligados por um traço que se preenche de amarelo até o nó ativo — a mesma
 * ideia de uma linha de metrô ou de um diagrama de processo. Abaixo dele, um
 * único painel largo com duas zonas: a mídia (60%, com etiquetas funcionais
 * sobrepostas — "recebe de" e "entrega para" — ancoradas na própria
 * fotografia) e os entregáveis (40%, em chips compactos, não em lista com
 * travessão).
 *
 * A régua de verbos que existia embaixo do painel (Diagnosticar → Crescer)
 * saiu: era um segundo indicador de progresso repetindo o que o espinhaço já
 * mostra. Menos altura, sem repetir a mesma informação duas vezes.
 *
 * ============================================================
 * O QUE CADA NÍVEL MOSTRA
 * ============================================================
 *
 * Título, tese, entregáveis, evidência fotográfica e a posição no percurso —
 * de onde vem e para onde vai, como etiquetas sobre a própria imagem. Nenhum
 * dado novo: "recebe de" e "entrega para" são os nomes dos níveis vizinhos na
 * mesma lista.
 *
 * ============================================================
 * ACESSIBILIDADE
 * ============================================================
 *
 * Padrão `tablist` horizontal: setas percorrem, Home e End vão às pontas, só o
 * nó ativo fica no fluxo do Tab e o `tabpanel` é rotulado por ele. **O hover
 * não troca mais o painel** (2026-08-04) — ver o comentário dos controles.
 *
 * No mobile, accordion com trilha vertical contínua atravessando os cinco
 * itens — não cinco caixas com borda cada uma.
 */
export function ScopeSection() {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const current = scopeLevels[active] ?? scopeLevels[0]
  const prevLevel = scopeLevels[active - 1]
  const nextLevel = scopeLevels[active + 1]

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = scopeLevels.length - 1
    const next = {
      ArrowRight: Math.min(active + 1, last),
      ArrowDown: Math.min(active + 1, last),
      ArrowLeft: Math.max(active - 1, 0),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  return (
    <Section id="atuacao" tone="surface" space="sm" bleed aria-labelledby="atuacao-titulo">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>Atuação integrada</Eyebrow>
            <Heading as={2} id="atuacao-titulo" size="title-1" className="mt-5 max-w-[20ch]">
              Cinco níveis de atuação sob uma única coordenação
            </Heading>
          </div>

          <p className="text-lead text-muted lg:col-span-4 lg:col-start-9">
            Não é loja de equipamento nem escritório de projeto: a Bianchini entende o negócio
            inteiro e coordena a transformação da operação — entrando no nível que o diagnóstico
            indicar.
          </p>
        </div>

        {/* ==========================================================
            ESPINHAÇO — cinco nós numa linha, com trilha de progresso.
            Só desktop/tablet largo; abaixo de `lg` o accordion é a navegação.
            ========================================================== */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          aria-label="Níveis de atuação"
          className="relative mt-14 hidden lg:mt-[4.5rem] lg:grid lg:grid-cols-5"
        >
          {/*
            ============================================================
            CONTROLES — revisão de 2026-08-04 (só os controles; conteúdo,
            imagens, lógica dos níveis e estrutura do painel não mudaram)
            ============================================================

            Quatro correções:

             1. **Alvo de clique real.** Os nós eram texto solto sobre a linha,
                sem preenchimento próprio: a área sensível existia, mas nada
                a anunciava. Agora cada nó tem caixa com `px-3 py-3` e recuo
                negativo compensando o primeiro, então o alinhamento com a
                coluna não muda — o que muda é haver superfície para o cursor
                encontrar.
             2. **Hover não troca mais o painel.** `onMouseEnter` disparava
                `setActive`: atravessar a fileira com o mouse trocava o
                conteúdo cinco vezes, e um controle que reage à passagem não
                lê como clicável — lê como gráfico. Hover agora é só
                superfície + cor de rótulo; a troca exige clique (ou foco de
                teclado, que segue o padrão de aba com ativação automática).
             3. **Estado ativo não é amarelo.** Em fundo claro o amarelo é
                preenchimento ou hairline, nunca indicador de estado (regra
                do projeto — 1,4:1 sobre `canvas`). O nó ativo passou a ser
                grafite cheio, ampliado, com halo grafite; o amarelo ficou
                onde é legítimo: a **trilha de progresso**, que é hairline
                decorativa e é o que comunica a progressão dos cinco níveis.
             4. **Estado além da cor**: escala do losango + halo + peso do
                rótulo + régua sob o rótulo — quatro sinais somados.

            A trilha ganhou um piso de largura: no nível 01 ela media 0px e a
            progressão simplesmente não existia visualmente no estado inicial.
          */}
          <span aria-hidden="true" className="absolute inset-x-0 top-[15.5px] h-[2px] bg-line" />
          <span
            aria-hidden="true"
            className="absolute left-0 top-[15.5px] h-[2px] bg-yellow transition-[width] duration-[420ms] ease-premium"
            style={{ width: `max(1.25rem, ${(active / (scopeLevels.length - 1)) * 100}%)` }}
          />

          {scopeLevels.map((level, index) => {
            const selected = index === active
            return (
              <button
                key={level.id}
                ref={(node) => {
                  tabsRef.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${level.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onKeyDown={onTabKeyDown}
                className={cn(
                  'group relative -ml-3 flex flex-col items-start gap-3 rounded-sm px-3 py-3 pr-6 text-left',
                  'transition-colors duration-200 ease-precise hover:bg-canvas-deep',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative z-10 h-[9px] w-[9px] shrink-0 rotate-45 border-2 transition-[background-color,border-color,transform,box-shadow] duration-[220ms] ease-precise',
                    selected
                      ? 'scale-[1.45] border-ink bg-ink shadow-[0_0_0_5px_rgba(16,16,16,0.14)]'
                      : index < active
                        ? 'border-ink bg-ink'
                        : 'border-line bg-surface group-hover:border-ink/50',
                  )}
                />
                <span>
                  <span
                    className={cn(
                      'block font-condensed text-sm font-bold tabular-nums transition-colors duration-200',
                      selected ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {level.number}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block font-sans text-base leading-snug transition-colors duration-200',
                      selected
                        ? 'font-bold text-ink'
                        : 'font-semibold text-ink/45 group-hover:text-ink/75',
                    )}
                  >
                    {level.short}
                  </span>
                  {/*
                    Régua sob o rótulo — o quarto sinal do estado ativo.
                    Grafite, não amarelo: em fundo claro o indicador de estado
                    é grafite (ver o bloco de comentário dos controles).
                  */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-2 block h-[2px] bg-ink transition-all duration-[260ms] ease-precise',
                      selected ? 'w-6 opacity-100' : 'w-0 opacity-0',
                    )}
                  />
                </span>
              </button>
            )
          })}
        </div>

        {/* ==========================================================
            PAINEL — mídia (60%) com etiquetas sobrepostas + entregáveis (40%)
            ========================================================== */}
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${current.id}`}
          className="mt-9 hidden lg:mt-11 lg:grid lg:grid-cols-[65fr_35fr] lg:items-stretch lg:gap-10"
        >
          {/* ---------- Mídia ---------- */}
          <div className="relative min-h-[24rem] overflow-hidden bg-canvas-deep">
            {scopeLevels.map((level, index) => (
              <Image
                key={level.id}
                src={level.media.src}
                alt={index === active ? level.media.alt : ''}
                aria-hidden={index !== active}
                fill
                sizes="62vw"
                quality={84}
                data-active={index === active}
                className="panel-wipe object-cover"
              />
            ))}

            {/* Etiquetas de posição, ancoradas nos cantos superiores da própria foto. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
              {prevLevel ? (
                <span className="bg-graphite/90 px-2.5 py-1 font-condensed text-sm font-semibold uppercase tracking-[0.06em] text-canvas backdrop-blur-[1px]">
                  Recebe de {prevLevel.number} {prevLevel.short}
                </span>
              ) : (
                <span />
              )}
              {nextLevel ? (
                <span className="bg-graphite/90 px-2.5 py-1 font-condensed text-sm font-semibold uppercase tracking-[0.06em] text-canvas backdrop-blur-[1px]">
                  Entrega para {nextLevel.number} {nextLevel.short}
                </span>
              ) : null}
            </div>

            {/* ----------
                LEGENDA — SUPERFÍCIE, NÃO GRADIENTE (V1.1, 2026-08-05)

                A legenda era texto branco solto sobre um gradiente
                `from-graphite/90 to-transparent` que cobria os 40% inferiores
                da caixa. O gradiente resolve o **encontro** da fotografia com a
                base, não o contraste do texto: onde a foto é clara — o inox
                iluminado do nível 01 é o pior caso — o par medido dava
                **1,28:1**, contra os 4,5:1 exigidos. A frase que explica o que
                a fotografia prova era a menos legível da seção.

                Agora são duas camadas com papéis separados, o mesmo par já
                usado na primeira dobra: o gradiente continua assentando a
                fotografia, e o texto ganha uma **superfície própria**, opaca o
                bastante para que o contraste não dependa de qual foto está
                ativa. Em `rgba()` arbitrário, não em `from-graphite/NN` — a
                escala de opacidade do Tailwind não tem todos os passos e uma
                classe inexistente some sem erro de build (já aconteceu no hero).
                ---------- */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-graphite/80 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(16,16,16,0.90)_0%,rgba(16,16,16,0.96)_60%,rgba(16,16,16,0.97)_100%)] px-4 py-3">
              <p className="max-w-[58ch] text-sm text-canvas">{current.media.caption}</p>
            </div>
          </div>

          {/* ---------- Entregáveis ---------- */}
          <div key={current.id} className="scope-panel flex flex-col">
            <p className="font-condensed text-sm font-semibold uppercase tracking-[0.11em] text-muted">
              Nível {current.number} de {String(scopeLevels.length).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-sans font-bold text-title-3 text-ink">{current.title}</h3>
            <p className="mt-3 max-w-[58ch] text-base text-muted">{current.description}</p>

            {/* Entregáveis em chips compactos — não lista com travessão. */}
            <ul className="mt-6 flex flex-col gap-2.5">
              {current.deliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="border border-line bg-canvas-deep/60 px-3.5 py-3 text-sm leading-snug text-ink transition-colors duration-200 hover:border-ink/25"
                >
                  {deliverable}
                </li>
              ))}
            </ul>

            <Link
              href={current.cta.href}
              className="group mt-auto inline-flex items-center gap-2 border-t border-line pt-5 font-sans text-base font-semibold text-ink transition-colors duration-200 hover:text-muted"
            >
              {current.cta.label}
              <ArrowRightIcon
                size={17}
                className="transition-transform duration-200 ease-precise group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* ==========================================================
            MOBILE — accordion com trilha vertical contínua
            ========================================================== */}
        <div className="relative mt-10 lg:hidden">
          <span aria-hidden="true" className="absolute bottom-3 left-[0.6rem] top-3 w-[2px] bg-line" />
          {scopeLevels.map((level, index) => {
            const open = index === active
            const next = scopeLevels[index + 1]
            return (
              <div key={level.id} className="relative pl-7">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${baseId}-acc-${level.id}`}
                    onClick={() => setActive(open ? -1 : index)}
                    className="flex w-full items-center gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    {/* Mesmo vocabulário do espinhaço do desktop: grafite marca o estado, não amarelo. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-0 top-[1.6rem] z-10 h-[9px] w-[9px] shrink-0 -translate-x-[calc(50%-1px)] rotate-45 border-2 transition-[background-color,border-color,transform] duration-[220ms] ease-precise',
                        open
                          ? 'scale-[1.45] border-ink bg-ink shadow-[0_0_0_4px_rgba(16,16,16,0.14)]'
                          : index < active
                            ? 'border-ink bg-ink'
                            : 'border-line bg-surface',
                      )}
                    />
                    <span
                      className={cn(
                        'shrink-0 font-condensed text-caption font-bold tabular-nums',
                        open ? 'text-ink' : 'text-muted',
                      )}
                    >
                      {level.number}
                    </span>
                    <span className="flex-1 font-sans text-body font-bold text-ink">
                      {level.short}
                    </span>
                  </button>
                </h3>

                <div id={`${baseId}-acc-${level.id}`} hidden={!open} className="pb-8">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas-deep">
                    <Image
                      src={level.media.src}
                      alt={level.media.alt}
                      fill
                      sizes="92vw"
                      quality={80}
                      className="object-cover"
                    />
                  </div>

                  <p className="mt-4 text-body-sm text-muted">{level.description}</p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {level.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="border border-line bg-canvas-deep/60 px-2.5 py-1.5 text-caption leading-snug text-ink"
                      >
                        {deliverable}
                      </li>
                    ))}
                  </ul>

                  {next ? (
                    <p className="mt-4 text-caption text-muted">
                      Entrega para <span className="font-semibold text-ink">{next.short}</span>
                    </p>
                  ) : null}

                  {/*
                    CTA que encerra o nível — controle independente, não link
                    dentro de frase: caixa própria de 44px, com `w-fit` para a
                    área acompanhar o rótulo em vez de varrer a coluna.
                  */}
                  <Link
                    href={level.cta.href}
                    className="group mt-3 inline-flex min-h-[2.75rem] w-fit items-center gap-2 py-2 font-sans text-body-sm font-semibold text-ink"
                  >
                    {level.cta.label}
                    <ArrowRightIcon
                      size={17}
                      className="transition-transform duration-200 ease-precise group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-6 text-base text-muted lg:mt-10">
          <span className="font-condensed text-eyebrow font-semibold uppercase text-ink/60">
            Também por aqui
          </span>
          <Link
            href="/solucoes"
            className="font-semibold text-ink underline decoration-yellow underline-offset-4 transition-colors hover:text-muted"
          >
            Todas as frentes
          </Link>
          <Link
            href="/solucoes/consultoria-para-fabricantes"
            className="font-semibold text-ink underline decoration-yellow underline-offset-4 transition-colors hover:text-muted"
          >
            É fabricante de cozinhas?
          </Link>
          <span className="text-muted">
            {solutions.length} caminhos de entrada, um mesmo diagnóstico.
          </span>
        </p>
      </Container>
    </Section>
  )
}
