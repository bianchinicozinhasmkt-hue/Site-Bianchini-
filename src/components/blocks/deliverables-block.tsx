import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { CheckIcon } from '@/components/ui/icons'

interface DeliverablesBlockProps {
  eyebrow?: string
  title: string
  lead?: string
  items: string[]
  note?: string
  tone?: 'canvas' | 'surface' | 'canvas-deep' | 'graphite'
}

/**
 * Lista de entregáveis. Descreve o que o cliente recebe — o detalhamento
 * final depende do escopo contratado, o que é dito explicitamente na nota.
 */
export function DeliverablesBlock({
  eyebrow = 'Entregáveis',
  title,
  lead,
  items,
  note,
  tone = 'surface',
}: DeliverablesBlockProps) {
  const light = tone === 'graphite'

  return (
    <Section id="entregaveis" tone={tone} space="lg" aria-labelledby="entregaveis-titulo">
      <SectionHeader
        headingId="entregaveis-titulo"
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        tone={light ? 'light' : 'default'}
      />

      <ul className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item} as="li" variant="side" delay={index * 40}>
            <div
              className={`flex items-start gap-3 border-t py-4 ${light ? 'border-white/15' : 'border-line'}`}
            >
              <CheckIcon size={19} className="mt-0.5 shrink-0 text-ink" />
              <span className={`text-body-sm ${light ? 'text-canvas/80' : 'text-ink'}`}>{item}</span>
            </div>
          </Reveal>
        ))}
      </ul>

      {note ? (
        <p className={`mt-8 max-w-2xl text-caption ${light ? 'text-canvas/60' : 'text-muted'}`}>{note}</p>
      ) : null}
    </Section>
  )
}
