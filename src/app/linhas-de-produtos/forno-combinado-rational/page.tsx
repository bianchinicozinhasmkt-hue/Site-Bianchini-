import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
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
      <section className="bg-canvas pt-[var(--header-height)]">
        <Container className="py-10 md:py-14 lg:py-20">
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-3 text-caption text-muted">
              <li>
                <Link href="/" className="crumb-link transition-colors hover:text-ink">
                  Início
                </Link>
              </li>
              <li aria-hidden="true" className="text-steel">/</li>
              <li>
                <Link
                  href="/linhas-de-produtos"
                  className="crumb-link transition-colors hover:text-ink"
                >
                  Linhas de equipamento
                </Link>
              </li>
              <li aria-hidden="true" className="text-steel">/</li>
              <li aria-current="page" className="text-ink">
                {rational.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Eyebrow>{rational.eyebrow}</Eyebrow>
              <Heading as={1} size="title-1" className="mt-5">
                {rational.name}
              </Heading>
              <p className="mt-4 text-body-sm font-medium text-ink">{rational.supplied}</p>
              <p className="mt-7 max-w-xl text-lead text-ink">
                {rational.headline}
              </p>
              <p className="mt-6 max-w-xl text-body-sm text-muted">{rational.intro}</p>
              <LinkButton href={quoteUrl} size="lg" className="mt-9" withArrow>
                Solicitar orçamento
              </LinkButton>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-canvas-deep">
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
      <Section tone="canvas" space="sm">
        <h2 className="font-condensed text-eyebrow font-semibold uppercase text-ink">Especificações</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {rational.quickSpecs.map((spec) => (
            <div key={spec.label} className="border-t border-line pt-4">
              <dt className="text-caption text-muted">{spec.label}</dt>
              <dd className="mt-2 text-body font-semibold text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Tecnologia embarcada */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Tecnologia embarcada"
          title="Quatro sistemas que padronizam o resultado"
          className="max-w-3xl"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {rational.technologies.map((tech, index) => (
            <Reveal as="li" key={tech.name} delay={index * 70}>
              <article className="h-full rounded-sm border border-line bg-canvas p-7">
                <h3 className="font-sans font-bold text-title-3 text-ink">{tech.name}</h3>
                <p className="mt-1.5 font-condensed text-eyebrow font-semibold uppercase text-ink">
                  {tech.subtitle}
                </p>
                <p className="mt-4 text-body-sm text-muted">{tech.description}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Linha completa */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow="Linha completa"
          title="Modelos por volume de produção"
          lead="Todos os modelos fornecidos, instalados e comissionados pela Bianchini. Tensão trifásica 220 V / 380 V / 440 V."
          className="max-w-3xl"
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-body-sm">
            <caption className="sr-only">Modelos do Rational iCombi Pro por capacidade</caption>
            <thead>
              <tr className="border-b border-ink">
                {['Modelo', 'Capacidade GN', 'Refeições / dia', 'Potência', 'Dimensões (L×P×A mm)'].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="py-4 pr-6 font-condensed text-eyebrow font-semibold uppercase text-muted"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rational.models.map((model) => (
                <tr key={model.model}>
                  <th scope="row" className="py-4 pr-6 text-left font-semibold text-ink">
                    iCombi Pro {model.model}
                  </th>
                  <td className="py-4 pr-6 text-muted">{model.capacity}</td>
                  <td className="py-4 pr-6 text-muted">{model.meals}</td>
                  <td className="py-4 pr-6 text-muted">{model.power}</td>
                  <td className="py-4 text-muted">{model.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-caption text-muted">
          Pressão de água de 1,0 a 6,0 bar · Instalação por técnico especializado Bianchini
        </p>
      </Section>

      {/* Substitui */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Em menos de 1 m²"
          title="Um equipamento, seis funções"
          lead="Menos equipamentos na praça significa menos manutenção, menos consumo e mais área útil de trabalho."
          className="max-w-3xl"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rational.replaces.map((item, index) => (
            <Reveal
              as="li"
              key={item.name}
              delay={index * 50}
              className="rounded-sm border border-line bg-canvas p-6"
            >
              <h3 className="font-sans text-body font-semibold text-ink">{item.name}</h3>
              <p className="mt-2 text-body-sm text-muted">{item.detail}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Diferenciais Bianchini */}
      <Section tone="graphite" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Diferenciais"
            tone="light"
            title="Por que comprar dentro de um projeto"
            lead="O equipamento só entrega o que promete quando a instalação, a exaustão e a operação foram dimensionadas para ele."
          />
          <ol className="divide-y divide-white/12 border-t border-white/12">
            {rational.advantages.map((advantage, index) => (
              <Reveal as="li" key={advantage.number} delay={index * 70} className="py-7">
                <div className="flex gap-6">
                  <span aria-hidden="true" className="font-sans font-bold text-title-3 leading-none text-canvas/55">
                    {advantage.number}
                  </span>
                  <div>
                    <h3 className="font-sans text-body font-semibold text-canvas">{advantage.title}</h3>
                    <p className="mt-2.5 max-w-prose text-body-sm text-canvas/70">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-16 flex flex-col items-start gap-5 border-t border-white/12 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-body text-canvas/75">
            Solicite um orçamento com o dimensionamento incluído — elétrica, hidráulica e exaustão
            dimensionadas antes da instalação.
          </p>
          <LinkButton href={quoteUrl} variant="primary" className="shrink-0" withArrow>
            Solicitar orçamento
          </LinkButton>
        </div>
      </Section>
    </>
  )
}
