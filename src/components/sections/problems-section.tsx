import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { ArrowLink } from '@/components/ui/button'
import { problems } from '@/data/problems'

export function ProblemsSection() {
  return (
    <Section id="problemas" tone="navy">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            eyebrow="O ponto de partida"
            tone="dark"
            title={
              <>
                O problema quase nunca
                <br />
                é o equipamento.
              </>
            }
            lead="É o fluxo, o dimensionamento e a falta de um responsável único pelo conjunto. São essas seis situações que aparecem na maioria das operações que nos procuram."
          />
          <ArrowLink href="/#processo" className="mt-8 text-bronze-light hover:text-white">
            Como resolvemos
          </ArrowLink>
        </div>

        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {problems.map((problem, index) => (
            <Reveal as="li" key={problem.title} delay={index * 60} className="border-t border-white/15 pt-5">
              <h3 className="text-[1.0625rem] font-semibold text-white">{problem.title}</h3>
              <p className="mt-2.5 text-body-sm text-white/65">{problem.description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
