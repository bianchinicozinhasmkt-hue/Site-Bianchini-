import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { LinkButton } from '@/components/ui/button'
import { differentials } from '@/data/differentials'
import { whatsappUrl } from '@/lib/whatsapp'

export function DifferentialsSection() {
  return (
    <Section id="diferenciais" tone="white">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            eyebrow="Diferenciais"
            title={
              <>
                Seis motivos pelos quais
                <br />
                a operação inteira muda.
              </>
            }
            lead="Dezoito anos dentro das maiores operações de alimentação do Brasil definiram um jeito de trabalhar difícil de reproduzir com fornecedores separados."
          />
          <LinkButton href={whatsappUrl('projeto')} className="mt-8" withArrow>
            Conversar sobre um projeto
          </LinkButton>
        </div>

        <ol className="divide-y divide-hairline border-t border-hairline">
          {differentials.map((item, index) => (
            <Reveal as="li" key={item.number} delay={index * 50} className="py-7 first:pt-7">
              <div className="flex gap-6">
                <span
                  aria-hidden="true"
                  className="font-serif text-xl leading-none text-bronze"
                >
                  {item.number}
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-semibold leading-snug text-navy">{item.title}</h3>
                  <p className="mt-2.5 max-w-prose text-body-sm text-ink/80">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
