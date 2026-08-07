'use client'

import Image from 'next/image'
import { Fragment, useId, useRef, useState } from 'react'
import { Container } from '@/components/layout/container'
import { ArrowLink } from '@/components/ui/actions/button'
import { symptomChapters } from '@/data/symptom-chapters'
import { cn } from '@/lib/utils'

/**
 * Interface de diagnóstico da home.
 *
 * No desktop, os capítulos são abas que controlam uma única fotografia e uma
 * única ficha de leitura. Foto e conteúdo pertencem à mesma grade e têm altura
 * idêntica; nenhum capítulo continua no fluxo abaixo da imagem.
 *
 * Abaixo de `lg`, a mesma informação vira accordion: somente o capítulo ativo
 * permanece no fluxo e a sua fotografia usa proporção 5:4. A copy e os fatos
 * vêm integralmente de `symptomChapters`.
 *
 * Composição revisada em 2026-08-03: a foto foi para 8 de 12 colunas (era 7) e
 * o rótulo flutuante do segundo sintoma saiu de cima dela — a imagem tinha
 * dois selos competindo com o próprio painel, que já lista os dois sintomas.
 * A ficha perdeu uma etiqueta redundante ("Ficha de diagnóstico" + contador
 * viraram uma linha só) e o par de sintomas trocou a grade dividida por
 * `border`/`divide-x` por uma lista corrida — menos linha, mesma informação.
 */
export function SymptomsSection() {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = symptomChapters[active] ?? symptomChapters[0]

  const selectTab = (index: number, moveFocus = false) => {
    setActive(index)
    if (moveFocus) tabRefs.current[index]?.focus()
  }

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = symptomChapters.length - 1
    let next: number | undefined

    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    if (next === undefined) return

    event.preventDefault()
    selectTab(next, true)
  }

  return (
    <section
      id="sintomas"
      aria-labelledby="sintomas-titulo"
      className="on-dark overflow-hidden bg-graphite py-14 text-canvas md:py-16 lg:py-14"
    >
      <Container>
        <header className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2
            id="sintomas-titulo"
            className="max-w-[18ch] font-sans text-title-1 font-extrabold text-canvas lg:col-span-7 lg:text-[clamp(2.5rem,3.7vw,3.8rem)] lg:leading-[0.98]"
          >
            O problema raramente começa no equipamento.
          </h2>

          <p className="max-w-[46ch] text-lead text-canvas/75 lg:col-span-5 lg:pl-5">
            Se algum destes cenários é familiar, a causa quase sempre está antes dele — no
            espaço, na obra ou na operação.
          </p>
        </header>

        {/* Desktop: navegação e painel único. */}
        <div className="mt-8 hidden lg:block">
          <div
            role="tablist"
            aria-label="Capítulos do diagnóstico"
            aria-orientation="horizontal"
            className="grid grid-cols-3 border border-white/15 bg-graphite-deep"
          >
            {symptomChapters.map((chapter, index) => {
              const selected = active === index
              return (
                <button
                  key={chapter.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  id={`${baseId}-tab-${chapter.id}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    'group relative h-[4.75rem] px-5 py-4 text-left outline-none transition-colors duration-[260ms] ease-precise focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow',
                    index > 0 && 'border-l border-white/15',
                    selected ? 'bg-graphite-soft text-canvas' : 'text-canvas/55 hover:text-canvas',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-condensed text-sm font-bold tabular-nums transition-colors duration-[260ms]',
                        selected ? 'text-yellow' : 'text-canvas/35',
                      )}
                    >
                      {chapter.number}
                    </span>
                    <span className="font-sans text-base font-semibold">{chapter.title}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-5 bottom-0 h-[3px] origin-left transition-transform duration-[260ms] ease-precise',
                      selected ? 'scale-x-100 bg-yellow' : 'scale-x-0 bg-yellow',
                    )}
                  />
                </button>
              )
            })}
          </div>

          {/*
            ============================================================
            ALTURA DO CONJUNTO — `min-h`, não `h` (correção de 2026-08-04)
            ============================================================

            Era `h-[31rem]` / `xl:h-[33rem]`: **altura fixa**. Combinada com o
            `min-h-0` da ficha ao lado, o conteúdo que não coubesse não
            expandia a caixa — transbordava para fora dela. Como a superfície
            grafite da ficha é o próprio elemento de altura fixa, o link de
            encerramento ("Como o diagnóstico encontra a causa") era desenhado
            **abaixo** da superfície, solto sobre o fundo da seção.

            Medido antes da correção (folga entre a base do link e a base da
            superfície; negativo = link fora):

              1586×992   Operação e resultado ........  −2px  (fora)
              1440×900   Operação e resultado ........   0px  (encostado)
              1366×768   Operação e resultado ........  +1px  (encostado)
              1024×768   os três capítulos ...........  −119px a −165px (fora)

            Ou seja: em 1024–1279 a caixa era pequena demais para **qualquer**
            capítulo, e acima disso o terceiro capítulo — o mais longo —
            estourava. Não era problema de tipografia, era de altura.

            `min-h` preserva a composição aprovada como **piso** e deixa a
            linha crescer quando o conteúdo exige. Quem garante que ela não
            salte a cada troca é a camada de medida da ficha (ver o `tabpanel`
            mais abaixo): os três capítulos ocupam sempre a mesma célula, então
            a altura é a do maior deles, em qualquer largura, e não muda ao
            trocar de aba.
          */}
          <div className="grid min-h-[31rem] grid-cols-12 xl:min-h-[33rem]">
            {/*
              8 de 12 colunas (era 7): a fotografia é a evidência, não um
              painel par do texto — e só um selo sobre ela agora, o
              número/marcador do capítulo. O segundo selo (prévia do primeiro
              sintoma) saiu: o painel ao lado já lista os dois sintomas por
              extenso, então o selo só duplicava informação sobre a foto.
            */}
            <figure className="relative col-span-8 isolate overflow-hidden bg-graphite-soft">
              {symptomChapters.map((chapter, index) => (
                <Image
                  key={chapter.id}
                  src={chapter.media.src}
                  alt={index === active ? chapter.media.alt : ''}
                  aria-hidden={index !== active}
                  fill
                  sizes="(max-width: 1279px) 64vw, 820px"
                  quality={84}
                  data-active={index === active}
                  className="panel-photo object-cover"
                  style={{ objectPosition: chapter.media.objectPosition ?? 'center' }}
                  priority={index === 0}
                />
              ))}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/20"
              />

              <div className="absolute left-6 top-6 flex items-center gap-3 border-l-2 border-yellow bg-graphite/90 px-4 py-3">
                <span className="font-condensed text-base font-bold tabular-nums text-yellow">
                  {current.number}
                </span>
                <span className="font-condensed text-sm font-semibold uppercase tracking-[0.09em] text-canvas">
                  {current.marker}
                </span>
              </div>

              <figcaption className="absolute inset-x-0 bottom-0 bg-graphite/90 px-6 py-3 text-sm text-canvas/75">
                {current.media.caption}
              </figcaption>
            </figure>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${current.id}`}
              tabIndex={0}
              className="col-span-4 grid bg-graphite-soft/70 p-7 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow xl:p-8"
            >
              {/*
                ============================================================
                CAMADA DE MEDIDA — os três capítulos na mesma célula
                ============================================================

                Todos os capítulos são renderizados sobrepostos (`col-start-1
                row-start-1`), e só o ativo fica visível. Duas consequências,
                que são exatamente os dois critérios desta correção:

                  · a célula tem sempre a altura do **capítulo mais longo**,
                    calculada pelo próprio navegador em cada largura — sem
                    número mágico por breakpoint, e continua correta se a copy
                    dos capítulos mudar;
                  · a altura **não muda ao trocar de aba**, porque os três
                    ocupam a célula o tempo todo, ativo ou não.

                Os inativos usam `invisible` (`visibility: hidden`), não
                `opacity-0`: assim ocupam espaço — que é o ponto — mas saem da
                ordem de Tab, da busca da página e da árvore de acessibilidade.
                O `aria-hidden` reforça isso para o leitor de tela.

                A chave do ativo muda ao ativar (`--ativo`), forçando a
                remontagem: é ela que faz `.scope-panel` reexecutar a animação
                de entrada a cada troca, como acontecia quando havia um painel
                só remontado por `key`.
              */}
              {symptomChapters.map((chapter, index) => {
                const isActive = index === active
                return (
                  <div
                    key={isActive ? `${chapter.id}--ativo` : chapter.id}
                    aria-hidden={!isActive}
                    className={cn(
                      'col-start-1 row-start-1 flex flex-col',
                      isActive ? 'scope-panel' : 'invisible',
                    )}
                  >
                    <p className="font-condensed text-sm font-semibold uppercase tracking-[0.11em] text-canvas/65">
                      Diagnóstico · {chapter.number} / 03
                    </p>

                    <h3 className="mt-2.5 font-sans text-title-2 font-bold text-canvas">
                      {chapter.title}
                    </h3>

                    <div className="mt-4 border-l-2 border-yellow pl-4">
                      <p className="font-condensed text-caption font-semibold uppercase tracking-[0.09em] text-yellow">
                        Consequência principal
                      </p>
                      <p className="mt-1.5 font-sans text-title-3 font-semibold leading-snug text-canvas">
                        {chapter.impact}
                      </p>
                    </div>

                    <ul className="mt-5 flex flex-col gap-4">
                      {chapter.symptoms.map((symptom) => (
                        <li key={symptom.title} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.45em] h-[2px] w-3 shrink-0 bg-canvas/40" />
                          <div>
                            <p className="font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-canvas/50">
                              {symptom.marker}
                            </p>
                            <h4 className="mt-1 text-base font-bold leading-snug text-canvas">
                              {symptom.title}
                            </h4>
                            <p className="mt-1.5 text-sm leading-relaxed text-canvas/75">
                              <EmphasizedText text={symptom.description} emphasis={symptom.emphasis} />
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/*
                      `mt-auto` mantém o link ancorado na base nos capítulos
                      mais curtos — é o que evita vão desproporcional no meio
                      da ficha quando a célula é ditada pelo capítulo maior.
                      O respiro abaixo dele é o `padding` da própria
                      superfície (28px em `lg`, 32px em `xl`).
                    */}
                    <ArrowLink href="#diagnostico" tone="light" className="mt-auto pt-5">
                      Como o diagnóstico encontra a causa
                    </ArrowLink>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/*
          Mobile e tablet: um accordion, não o painel desktop empilhado.

          ============================================================
          OS TRÊS PAINÉIS FICAM NO DOM — SEMPRE (correção de 2026-08-05)
          ============================================================

          Antes o painel era renderizado condicionalmente (`{expanded ? … :
          null}`), mas o gatilho anunciava `aria-controls` **o tempo todo**.
          Resultado medido em 390×844: dos três `aria-controls` do accordion,
          dois apontavam para um `id` que não existia no documento — relação
          ARIA quebrada, e a promessa de `aria-expanded="false"` ("há um painel
          ali, fechado") sem nada por trás.

          Agora os três existem sempre e o que alterna é o atributo `hidden`:

            · `hidden` é a forma semanticamente correta de "existe, está
              fechado" — some da renderização, da árvore de acessibilidade, da
              busca da página e **da ordem de Tab**, então o link de
              encerramento de um capítulo fechado não é mais alcançável;
            · o `id` de cada painel é estável e não depende do estado;
            · `aria-labelledby` fecha o par: gatilho nomeia painel, painel
              aponta de volta para o gatilho.

          Os `id` levam `accordion` no meio (`…-accordion-painel-…`) e os do
          desktop não, de modo que as duas versões coexistam no DOM — que é o
          que acontece, já que `lg:hidden` / `hidden lg:block` escondem por
          CSS, não removem — sem colidir.

          A chave muda ao abrir (`--aberto`), forçando a remontagem: é ela que
          faz `.scope-panel` reexecutar a entrada a cada troca, como acontecia
          quando o painel era montado do zero. Mesmo recurso já usado na ficha
          do desktop, logo acima.
        */}
        <div className="mt-9 border-t border-white/15 lg:hidden">
          {symptomChapters.map((chapter, index) => {
            const expanded = active === index
            const buttonId = `${baseId}-accordion-${chapter.id}`
            const panelId = `${baseId}-accordion-painel-${chapter.id}`

            return (
              <div key={chapter.id} className="border-b border-white/15">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setActive(index)}
                    className="flex min-h-16 w-full items-center gap-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow"
                  >
                    <span
                      className={cn(
                        'font-condensed text-caption font-bold tabular-nums',
                        expanded ? 'text-yellow' : 'text-canvas/40',
                      )}
                    >
                      {chapter.number}
                    </span>
                    <span className="flex-1 font-sans text-body font-bold text-canvas">
                      {chapter.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative h-6 w-6 shrink-0 transition-transform duration-[260ms] ease-precise motion-reduce:transition-none',
                        expanded && 'rotate-45',
                      )}
                    >
                      <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-current" />
                      <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-current" />
                    </span>
                  </button>
                </h3>

                <div
                  key={expanded ? `${chapter.id}--aberto` : chapter.id}
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!expanded}
                  className="scope-panel pb-7"
                >
                  <figure className="relative aspect-[5/4] overflow-hidden bg-graphite-soft sm:aspect-[4/3]">
                    <Image
                      src={chapter.media.src}
                      alt={chapter.media.alt}
                      fill
                      sizes="(max-width: 767px) calc(100vw - 40px), calc(100vw - 64px)"
                      quality={80}
                      className="object-cover"
                      style={{ objectPosition: chapter.media.objectPosition ?? 'center' }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-graphite to-transparent"
                    />
                    <span className="absolute left-3 top-3 border-l-2 border-yellow bg-graphite/90 px-3 py-2 font-condensed text-caption font-semibold uppercase tracking-[0.08em] text-canvas">
                      {chapter.marker}
                    </span>
                    <figcaption className="absolute inset-x-3 bottom-3 text-caption text-canvas/75">
                      {chapter.media.caption}
                    </figcaption>
                  </figure>

                  <div className="bg-graphite-soft/70 px-4 py-5 sm:px-5">
                    <p className="border-l-2 border-yellow pl-4 font-sans text-title-3 font-semibold leading-snug text-canvas">
                      {chapter.impact}
                    </p>

                    <ul className="mt-5 flex flex-col gap-4">
                      {chapter.symptoms.map((symptom) => (
                        <li key={symptom.title} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.4em] h-[2px] w-3 shrink-0 bg-canvas/40" />
                          <div>
                            <p className="font-condensed text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-canvas/45">
                              {symptom.marker}
                            </p>
                            <h4 className="mt-1 text-body-sm font-bold text-canvas">{symptom.title}</h4>
                            <p className="mt-1.5 text-body-sm text-canvas/65">
                              <EmphasizedText text={symptom.description} emphasis={symptom.emphasis} />
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <ArrowLink href="#diagnostico" tone="light" className="mt-5">
                      Como o diagnóstico encontra a causa
                    </ArrowLink>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function EmphasizedText({ text, emphasis }: { text: string; emphasis?: string }) {
  if (!emphasis) return <>{text}</>

  const at = text.indexOf(emphasis)
  if (at < 0) return <>{text}</>

  return (
    <Fragment>
      {text.slice(0, at)}
      <strong className="font-semibold text-canvas">{emphasis}</strong>
      {text.slice(at + emphasis.length)}
    </Fragment>
  )
}
