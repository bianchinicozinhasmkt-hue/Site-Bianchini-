import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { ArrowLink } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { segments } from '@/data/segments'
import { whatsappUrl } from '@/lib/whatsapp'

export function SegmentsSection() {
  return (
    <Section id="segmentos" tone="paper">
      <SectionHeader
        eyebrow="Segmentos atendidos"
        title="Cada tipo de operação tem um gargalo diferente."
        lead="O projeto muda conforme o volume, o cardápio, o turno e a norma que se aplica. Estes são os segmentos em que a Bianchini acumulou repertório."
        className="max-w-3xl"
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment, index) => (
          <Reveal
            as="li"
            key={segment.id}
            delay={index * 60}
            className={cn(segment.wide && 'lg:col-span-2')}
          >
            <article className="flex h-full flex-col justify-between rounded-card border border-hairline bg-white p-7 transition-shadow duration-300 ease-brand hover:shadow-card-hover">
              <div>
                <h3 className="font-serif text-display-4 text-navy">{segment.title}</h3>
                <p className="mt-3 max-w-prose text-body-sm text-ink/80">{segment.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10">
        <ArrowLink href={whatsappUrl('segmentos')}>Falar sobre o meu segmento</ArrowLink>
      </div>
    </Section>
  )
}
