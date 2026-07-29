import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { Eyebrow, Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/button'
import { rational } from '@/data/rational'
import { pageMetadata } from '@/lib/metadata'
import { whatsappUrlWithText } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Forno combinado Rational iCombi Pro',
  description:
    'Forno combinado Rational iCombi Pro fornecido, instalado e comissionado pela Bianchini, com dimensionamento elétrico, hidráulico e de exaustão incluído no projeto.',
  path: '/linhas-de-produtos/forno-combinado-rational',
})

const quoteUrl = whatsappUrlWithText(
  'Olá! Gostaria de um orçamento do forno combinado Rational iCombi Pro com a Bianchini.',
)

export default function RationalPage() {
  return (
    <>
      <section className="bg-navy pb-16 pt-[calc(var(--header-height)+3.5rem)] text-white on-dark md:pb-20 md:pt-[calc(var(--header-height)+5rem)]">
        <Container>
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-3 text-[0.75rem] text-white/50">
              <li>
                <Link href="/" className="text-white/60 transition-colors hover:text-white">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/linhas-de-produtos"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Linhas de equipamento
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white/85">
                {rational.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Eyebrow tone="light">{rational.eyebrow}</Eyebrow>
              <Heading as={1} size={2} className="mt-5 text-white">
                {rational.name}
              </Heading>
              <p className="mt-4 text-[0.9375rem] font-medium text-bronze-light">{rational.supplied}</p>
              <p className="mt-7 max-w-xl font-serif text-xl italic leading-snug text-white/90">
                {rational.headline}
              </p>
              <p className="mt-6 max-w-xl text-body-sm text-white/70">{rational.intro}</p>
              <LinkButton href={quoteUrl} size="lg" className="mt-9" withArrow>
                Solicitar orçamento
              </LinkButton>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-navy-light">
              <Image
                src={rational.image.src}
                alt={rational.image.alt}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Especificações rápidas */}
      <Section tone="white" space="sm">
        <h2 className="text-eyebrow font-semibold uppercase text-muted">Especificações</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {rational.quickSpecs.map((spec) => (
            <div key={spec.label} className="border-t border-hairline pt-4">
              <dt className="text-[0.75rem] uppercase tracking-wider text-muted">{spec.label}</dt>
              <dd className="mt-2 text-[0.9375rem] font-medium text-navy">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Tecnologia embarcada */}
      <Section tone="paper">
        <SectionHeader
          eyebrow="Tecnologia embarcada"
          title="Quatro sistemas que padronizam o resultado."
          className="max-w-3xl"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {rational.technologies.map((tech, index) => (
            <Reveal as="li" key={tech.name} delay={index * 70}>
              <article className="h-full rounded-card border border-hairline bg-white p-7">
                <h3 className="font-serif text-display-4 text-navy">{tech.name}</h3>
                <p className="mt-1.5 text-[0.75rem] uppercase tracking-wider text-bronze">
                  {tech.subtitle}
                </p>
                <p className="mt-4 text-body-sm text-ink/80">{tech.description}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Linha completa */}
      <Section tone="white">
        <SectionHeader
          eyebrow="Linha completa"
          title="Modelos por volume de produção."
          lead="Todos os modelos fornecidos, instalados e comissionados pela Bianchini. Tensão trifásica 220 V / 380 V / 440 V."
          className="max-w-3xl"
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-body-sm">
            <caption className="sr-only">Modelos do Rational iCombi Pro por capacidade</caption>
            <thead>
              <tr className="border-b border-navy">
                {['Modelo', 'Capacidade GN', 'Refeições / dia', 'Potência', 'Dimensões (L×P×A mm)'].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="py-4 pr-6 text-eyebrow font-semibold uppercase text-muted"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rational.models.map((model) => (
                <tr key={model.model}>
                  <th scope="row" className="py-4 pr-6 text-left font-semibold text-navy">
                    iCombi Pro {model.model}
                  </th>
                  <td className="py-4 pr-6 text-ink/80">{model.capacity}</td>
                  <td className="py-4 pr-6 text-ink/80">{model.meals}</td>
                  <td className="py-4 pr-6 text-ink/80">{model.power}</td>
                  <td className="py-4 text-ink/80">{model.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-[0.8125rem] text-muted">
          Pressão de água de 1,0 a 6,0 bar · Instalação por técnico especializado Bianchini
        </p>
      </Section>

      {/* Substitui */}
      <Section tone="sand">
        <SectionHeader
          eyebrow="Em menos de 1 m²"
          title="Um equipamento, seis funções."
          lead="Menos equipamentos na praça significa menos manutenção, menos consumo e mais área útil de trabalho."
          className="max-w-3xl"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rational.replaces.map((item, index) => (
            <Reveal
              as="li"
              key={item.name}
              delay={index * 50}
              className="rounded-card border border-hairline bg-white p-6"
            >
              <h3 className="text-[1rem] font-semibold text-navy">{item.name}</h3>
              <p className="mt-2 text-body-sm text-ink/75">{item.detail}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Diferenciais Bianchini */}
      <Section tone="navy" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Diferenciais"
            tone="dark"
            title="Por que comprar dentro de um projeto."
            lead="O equipamento só entrega o que promete quando a instalação, a exaustão e a operação foram dimensionadas para ele."
          />
          <ol className="divide-y divide-white/12 border-t border-white/12">
            {rational.advantages.map((advantage, index) => (
              <Reveal as="li" key={advantage.number} delay={index * 70} className="py-7">
                <div className="flex gap-6">
                  <span aria-hidden="true" className="font-serif text-xl leading-none text-bronze-light">
                    {advantage.number}
                  </span>
                  <div>
                    <h3 className="text-[1.0625rem] font-semibold text-white">{advantage.title}</h3>
                    <p className="mt-2.5 max-w-prose text-body-sm text-white/65">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-16 flex flex-col items-start gap-5 border-t border-white/12 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-body text-white/75">
            Solicite um orçamento com o dimensionamento incluído — elétrica, hidráulica e exaustão
            dimensionadas antes da instalação.
          </p>
          <LinkButton href={quoteUrl} className="shrink-0" withArrow>
            Solicitar orçamento
          </LinkButton>
        </div>
      </Section>
    </>
  )
}
