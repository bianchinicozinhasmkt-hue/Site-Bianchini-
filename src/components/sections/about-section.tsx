import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { Accent, Eyebrow, Heading } from '@/components/ui/heading'
import { ArrowLink } from '@/components/ui/button'
import { scopeMetrics } from '@/data/site'

export function AboutSection() {
  return (
    <Section id="sobre" tone="white">
      <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-sand">
          <Image
            src="/images/projects/cozinha-completa.jpg"
            alt="Cozinha profissional entregue pela Bianchini, com linha de cocção, prateleiras em inox e coifas"
            fill
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="object-cover"
          />
        </div>

        <div>
          <Eyebrow>Parceria estratégica</Eyebrow>
          <Heading as={2} size={3} className="mt-5">
            Engenharia de operação, <Accent>não fornecimento de equipamento.</Accent>
          </Heading>

          <div className="mt-6 space-y-5 text-body text-ink/90">
            <p>
              Há 18 anos a Bianchini trabalha dentro de operações de alimentação — hospitais, hotéis,
              restaurantes, redes e plataformas — entregando projetos completos que organizam o fluxo,
              dimensionam a produção e garantem conformidade desde o primeiro dia.
            </p>
            <p>
              Fazemos o projeto executivo com plantas complementares de elétrica, hidráulica, gás e
              esgoto. Especificamos e fabricamos sob medida em inox. Coordenamos a implantação até a
              operação rodar. Uma cozinha Bianchini não é obra entregue: é operação em funcionamento.
            </p>
          </div>

          <ArrowLink href="/#diferenciais" className="mt-7">
            Por que escolhem a Bianchini
          </ArrowLink>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-hairline pt-8">
            {scopeMetrics.map((metric) => (
              <div key={metric.value}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block font-serif text-2xl leading-none text-navy">{metric.value}</span>
                  <span className="mt-2 block text-[0.8125rem] leading-snug text-muted">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </Section>
  )
}
