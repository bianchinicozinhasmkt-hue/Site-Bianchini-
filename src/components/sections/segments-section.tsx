import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { segments } from '@/data/segments'
import { cn } from '@/lib/utils'

/** Segmentos atendidos, com a descrição de operação de cada um. */
export function SegmentsSection({ tone = 'canvas-deep' }: { tone?: 'canvas' | 'surface' | 'canvas-deep' } = {}) {
  return (
    <Section id="segmentos" tone={tone} space="lg" aria-labelledby="segmentos-titulo">
      <SectionHeader
        headingId="segmentos-titulo"
        eyebrow="Segmentos atendidos"
        title="Operações diferentes exigem projetos diferentes"
        lead="O volume, o cardápio e a norma aplicável mudam de um segmento para outro — e o projeto muda junto."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        {segments.map((segment, index) => (
          <Reveal
            key={segment.id}
            delay={index * 55}
            className={cn('h-full', segment.wide && 'lg:col-span-1')}
          >
            <article className="flex h-full flex-col gap-3 rounded-sm border border-line bg-surface p-6 lg:p-7">
              <h3 className="font-sans font-bold text-title-3 text-ink">{segment.title}</h3>
              <p className="text-body-sm text-muted">{segment.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
