import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { SolutionCard } from '@/components/ui/card'
import { ArrowLink } from '@/components/ui/actions/button'
import { ProcessSection } from '@/components/sections/process-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { solutions } from '@/data/solutions'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

const path = '/solucoes'

export const metadata: Metadata = pageMetadata({
  title: 'Soluções',
  description:
    'Cozinhas industriais completas, arquitetura e fluxo, diagnóstico e consultoria operacional, crescimento comercial e consultoria para fabricantes de cozinhas.',
  path,
})

export default function SolutionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Soluções', path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Soluções"
        title="Quatro caminhos, um mesmo ponto de partida"
        lead="Qualquer que seja a porta de entrada, o trabalho começa entendendo a operação. É o diagnóstico que define o escopo — não o contrário."
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: path },
        ]}
        primary={{ label: 'Solicitar diagnóstico', href: '/contato' }}
      />

      <Section tone="canvas" space="sm" aria-labelledby="caminhos-titulo">
        <SectionHeader
          headingId="caminhos-titulo"
          eyebrow="Escolha pela necessidade"
          title="Por onde a sua operação precisa começar"
          lead="Cada caminho parte de um problema real e termina em uma entrega definida."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8 xl:grid-cols-4">
          {solutions.map((solution, index) => (
            <Reveal key={solution.id} delay={index * 70} className="h-full">
              <SolutionCard
                href={solution.href}
                image={solution.image}
                alt={solution.alt}
                eyebrow={solution.problem}
                title={solution.title}
                description={solution.benefit}
                bullets={solution.bullets}
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 rounded-sm border border-line bg-surface p-7 lg:flex-row lg:items-center lg:justify-between lg:p-9">
          <div className="max-w-xl">
            <h3 className="font-sans font-bold text-title-2 text-ink">Consultoria para fabricantes</h3>
            <p className="mt-3 text-body-sm text-muted">
              Solução B2B específica para fabricantes de cozinhas profissionais e mobiliário em inox:
              processo produtivo, produtividade, gestão e estrutura comercial.
            </p>
          </div>
          <ArrowLink href="/solucoes/consultoria-para-fabricantes" className="shrink-0">
            Conhecer
          </ArrowLink>
        </div>
      </Section>

      <ProcessSection tone="canvas-deep" />

      <FinalCtaSection />
    </>
  )
}
