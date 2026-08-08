import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { FeatureGrid } from '@/components/blocks/feature-grid'
import { ProcessSection } from '@/components/sections/process-section'
import { SegmentsSection } from '@/components/sections/segments-section'
import { DifferentialsSection } from '@/components/sections/differentials-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { TrustSection } from '@/components/sections/trust-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { Section } from '@/components/layout/section'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { aboutPage } from '@/data/pages'
import { positioning, scopeMetrics } from '@/data/site'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

const path = '/sobre'

export const metadata: Metadata = pageMetadata({
  title: 'Sobre a Bianchini',
  /*
    A contagem de projetos saiu da descrição: "mais de 3.000 projetos
    entregues" não tem confirmação comercial (ver `src/data/site.ts`,
    "MÉTRICAS PÚBLICAS"). Metadata é conteúdo público — aparece em resultado de
    busca e em prévia de link — e vale a mesma regra da página.
  */
  description:
    '18 anos dentro de operações de alimentação, com atendimento em todo o Brasil. Arquitetura, engenharia, equipamentos, processo e estratégia comercial tratados como um sistema só.',
  path,
})

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Sobre', path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="A Bianchini"
        title="Uma empresa que entende a operação, não apenas o equipamento"
        lead={positioning.essence}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Sobre', href: path },
        ]}
        image={{
          src: '/images/projects/cozinha-completa.jpg',
          alt: 'Cozinha profissional em operação com fritadeiras, bancadas em inox, prateleiras suspensas e coifas',
          caption: 'Cozinha profissional com cocção, apoio, mobiliário e exaustão integrados',
        }}
        primary={{ label: 'Solicitar diagnóstico', href: '/contato' }}
        secondary={{ label: 'Ver projetos', href: '/projetos' }}
      />

      <Section tone="surface" space="lg" aria-labelledby="historia-titulo">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <Eyebrow>História</Eyebrow>
            <Heading as={2} id="historia-titulo" size="title-1" className="mt-5">
              18 anos dentro de operações de alimentação
            </Heading>
          </div>

          <div className="flex flex-col gap-5 text-body text-muted">
            <p>
              A Bianchini nasceu dentro do mercado de cozinhas profissionais e cresceu acompanhando o
              que acontece depois da entrega: o turno que não fecha, o equipamento que não dá conta,
              o fluxo que obriga a equipe a improvisar todo dia.
            </p>
            <p>
              Essa convivência com a operação real definiu o modo de trabalhar. Em vez de começar
              pelo catálogo, o trabalho começa pelo diagnóstico — entender o volume, o espaço, o
              processo e o custo antes de recomendar qualquer solução.
            </p>
            {/*
              A frase abria com "São mais de 3.000 projetos entregues". O
              número saiu por não ter confirmação comercial; o que ele
              qualificava — a variedade de operações atendidas e a abrangência
              — é fato confirmado e permanece. Nenhuma outra contagem entrou no
              lugar.
            */}
            <p>
              São operações entregues em restaurantes, hotéis, hospitais, redes e operações
              institucionais em todo o Brasil, com sede no Rio de Janeiro. A empresa reúne
              competências que costumam aparecer separadas — arquitetura, engenharia, equipamentos,
              processo e estratégia comercial — e as trata como um sistema único.
            </p>

            <dl className="mt-6 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
              {scopeMetrics.map((metric) => (
                <div key={metric.value} className="flex flex-col gap-2">
                  <dt className="order-2 text-caption text-muted">{metric.label}</dt>
                  <dd className="order-1 font-sans font-bold text-title-2 text-ink">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <FeatureGrid
        id="competencias"
        eyebrow="Competências"
        title="O que a empresa entrega"
        lead="Seis frentes que se combinam conforme o que o diagnóstico apontar."
        items={aboutPage.competencies}
        tone="canvas"
      />

      <ProcessSection tone="canvas-deep" />

      <DifferentialsSection />

      <SegmentsSection tone="canvas" />

      <TrustSection />

      <TestimonialsSection />

      <FinalCtaSection />
    </>
  )
}
