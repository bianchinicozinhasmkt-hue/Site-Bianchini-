import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'

interface Feature {
  title: string
  description: string
}

interface FeatureGridProps {
  id?: string
  eyebrow?: string
  title: string
  lead?: string
  items: readonly Feature[]
  tone?: 'canvas' | 'surface' | 'canvas-deep' | 'graphite'
  columns?: 2 | 3
}

/**
 * Grade de blocos curtos com título e descrição. Serve a vantagens, frentes
 * de atuação e competências, evitando um componente novo por página.
 */
export function FeatureGrid({
  id,
  eyebrow,
  title,
  lead,
  items,
  tone = 'canvas',
  columns = 3,
}: FeatureGridProps) {
  const light = tone === 'graphite'
  const headingId = id ? `${id}-titulo` : undefined

  return (
    <Section id={id} tone={tone} space="lg" aria-labelledby={headingId}>
      <SectionHeader
        headingId={headingId}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        tone={light ? 'light' : 'default'}
      />

      <div
        className={`mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:mt-16 ${
          columns === 3 ? 'lg:grid-cols-3' : ''
        }`}
      >
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 55}>
            <article
              className={`flex h-full flex-col gap-3 border-t pt-6 ${light ? 'border-white/15' : 'border-line'}`}
            >
              <h3 className={`font-sans font-bold text-title-3 ${light ? 'text-canvas' : 'text-ink'}`}>
                {item.title}
              </h3>
              <p className={`text-body-sm ${light ? 'text-canvas/70' : 'text-muted'}`}>
                {item.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
