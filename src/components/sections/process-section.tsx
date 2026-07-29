import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { CheckIcon } from '@/components/ui/icon'
import { processSteps } from '@/data/process'

export function ProcessSection() {
  return (
    <Section id="processo" tone="sand">
      <SectionHeader
        eyebrow="Processo de trabalho"
        title="Quatro etapas, um responsável."
        lead="Cada etapa tem entregáveis definidos. Você sabe o que recebe, quando recebe e quem responde por aquilo."
        className="max-w-3xl"
      />

      <ol className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.number}
            delay={index * 80}
            className="flex h-full flex-col rounded-card border border-hairline bg-white p-7"
          >
            <span aria-hidden="true" className="font-serif text-3xl leading-none text-bronze">
              {step.number}
            </span>
            <h3 className="mt-5 font-serif text-display-4 text-navy">{step.title}</h3>
            <p className="mt-3 text-body-sm text-ink/80">{step.description}</p>

            <ul className="mt-6 space-y-2 border-t border-hairline pt-5">
              {step.deliverables.map((deliverable) => (
                <li key={deliverable} className="flex items-start gap-2.5 text-[0.8125rem] text-ink/75">
                  <CheckIcon size={14} className="mt-1 text-carmim" />
                  {deliverable}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
