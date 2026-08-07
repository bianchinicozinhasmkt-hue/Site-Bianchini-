import { Section, SectionHeader } from '@/components/layout/section'
import { Accordion } from '@/components/ui/accordion'
import { ArrowLink } from '@/components/ui/actions/button'
import type { FaqItem } from '@/types'

interface FaqBlockProps {
  items: FaqItem[]
  title?: string
  eyebrow?: string
  lead?: string
  tone?: 'canvas' | 'surface' | 'canvas-deep'
}

/** FAQ da página. Só entra quando as perguntas são realmente úteis (§15). */
export function FaqBlock({
  items,
  title = 'Perguntas frequentes',
  eyebrow = 'Dúvidas comuns',
  lead,
  tone = 'canvas',
}: FaqBlockProps) {
  if (items.length === 0) return null

  return (
    <Section id="faq" tone={tone} space="lg" aria-labelledby="faq-titulo">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <SectionHeader
          headingId="faq-titulo"
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="lg:flex-col lg:items-start"
        />

        <div className="flex flex-col gap-8">
          <Accordion items={items} />
          <ArrowLink href="/contato">Não encontrou sua dúvida? Fale com um especialista</ArrowLink>
        </div>
      </div>
    </Section>
  )
}
