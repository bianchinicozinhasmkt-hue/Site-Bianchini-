import { Fragment } from 'react'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { problems as defaultProblems } from '@/data/problems'
import { cn } from '@/lib/utils'
import type { Problem } from '@/types'

interface ProblemsSectionProps {
  id?: string
  eyebrow?: string
  title?: string
  lead?: string
  items?: Problem[]
  tone?: 'canvas' | 'surface' | 'canvas-deep' | 'graphite'
}

/**
 * Sintomas em **página de solução** — enumeração, não narrativa.
 *
 * A home não usa mais esta seção: lá os sintomas viraram três capítulos com
 * fotografia (`symptoms-section.tsx`), porque a home precisa argumentar antes
 * de listar. Aqui o visitante já escolheu a frente e quer reconhecer o próprio
 * caso rápido — a lista é a forma certa.
 *
 * O que saiu na terceira passagem visual: a grade cartesiana de fundo, a coluna
 * fixa (que repetia o recurso da home) e o numeral gigante em contraste baixo
 * atrás de cada linha. Sobrou o que carrega informação — marcador da trilha,
 * título, descrição e o trecho decisivo em destaque.
 */
export function ProblemsSection({
  id = 'sintomas',
  eyebrow = 'Sintomas frequentes',
  title = 'Se algum destes cenários é familiar, o problema raramente é só o equipamento',
  lead = 'Quase sempre a causa está no fluxo, no dimensionamento ou na falta de um responsável único pela entrega.',
  items = defaultProblems,
  tone = 'surface',
}: ProblemsSectionProps = {}) {
  const headingId = `${id}-titulo`
  const dark = tone === 'graphite'

  return (
    <Section id={id} tone={tone} space="lg" bleed aria-labelledby={headingId}>
      <Container>
        {/* ---------- Enunciado, em duas colunas ---------- */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow tone={dark ? 'light' : 'default'}>{eyebrow}</Eyebrow>

            <Heading
              as={2}
              id={headingId}
              size="title-1"
              className={cn('mt-5 max-w-[20ch]', dark && 'text-canvas')}
            >
              {title}
            </Heading>
          </div>

          <p
            className={cn(
              'text-lead lg:col-span-4 lg:col-start-9',
              dark ? 'text-canvas/75' : 'text-muted',
            )}
          >
            {lead}
          </p>
        </div>

        {/* ----------
            Índice em duas colunas. A régua superior de cada item emenda com a
            do vizinho e forma uma linha contínua por fileira — sem caixa, sem
            sombra, sem ícone e sem numeração.
            ---------- */}
        <ul className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-16">
          {items.map((problem, index) => (
            <Reveal key={problem.title} as="li" delay={index * 45}>
              <div
                className={cn(
                  'flex h-full flex-col border-t py-6 lg:py-7',
                  dark ? 'border-white/15' : 'border-line',
                )}
              >
                {problem.marker ? (
                  <p className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-[2px] w-5 shrink-0',
                        dark ? 'bg-yellow' : 'bg-ink',
                      )}
                    />
                    <span
                      className={cn(
                        'font-condensed text-eyebrow font-semibold uppercase',
                        dark ? 'text-canvas/65' : 'text-muted',
                      )}
                    >
                      {problem.marker}
                    </span>
                  </p>
                ) : null}

                <h3
                  className={cn(
                    'mt-3 font-sans font-bold text-title-3',
                    dark ? 'text-canvas' : 'text-ink',
                  )}
                >
                  {problem.title}
                </h3>

                <p
                  className={cn('mt-2.5 max-w-[46ch] text-body-sm', dark ? 'text-canvas/70' : 'text-muted')}
                >
                  <EmphasizedText
                    text={problem.description}
                    emphasis={problem.emphasis}
                    dark={dark}
                  />
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/**
 * Destaca o trecho decisivo da descrição. O texto continua sendo um só — o
 * destaque é tipográfico e não introduz palavra nova; quando `emphasis` não é
 * substring exata, a frase sai inteira, sem marcação.
 */
function EmphasizedText({
  text,
  emphasis,
  dark,
}: {
  text: string
  emphasis?: string
  dark: boolean
}) {
  if (!emphasis) return <>{text}</>

  const at = text.indexOf(emphasis)
  if (at < 0) return <>{text}</>

  return (
    <Fragment>
      {text.slice(0, at)}
      <strong className={cn('font-semibold', dark ? 'text-canvas' : 'text-ink')}>{emphasis}</strong>
      {text.slice(at + emphasis.length)}
    </Fragment>
  )
}
