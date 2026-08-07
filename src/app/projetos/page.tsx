import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { ProjectCard } from '@/components/ui/card'
import { CaseStudySection } from '@/components/sections/case-study-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { projects } from '@/data/projects'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

const path = '/projetos'

export const metadata: Metadata = pageMetadata({
  title: 'Projetos entregues',
  description:
    'Registros reais de cozinhas industriais, praças de produção, mobiliário em inox e documentação técnica de projetos entregues pela Bianchini.',
  path,
})

/** Proporções alternadas para dar ritmo editorial ao mosaico. */
const ratios = ['3/2', '4/5', '4/5', '3/2', '4/3', '4/3', '3/2', '4/5', '3/2', '3/2', '4/5', '1/1'] as const

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Projetos', path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Projetos entregues"
        title="A prova está na operação construída"
        lead="Registros reais do acervo da Bianchini: cozinhas em produção, praças de trabalho, mobiliário fabricado sob medida e a documentação técnica que originou cada entrega."
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Projetos', href: path },
        ]}
        primary={{ label: 'Solicitar diagnóstico', href: '/contato' }}
        secondary={{ label: 'Ver soluções', href: '/solucoes' }}
      />

      <Section tone="canvas" space="sm" aria-labelledby="acervo-titulo">
        <SectionHeader
          headingId="acervo-titulo"
          eyebrow="Acervo"
          title="Escopo, acabamento e integração"
          lead="As legendas descrevem o que está em cada imagem. Nome de cliente, local e resultado numérico só entram no site após autorização de uso — por isso não aparecem aqui."
        />

        {/* Colunas editoriais: preservam as proporções variadas sem abrir vãos. */}
        <ul className="mt-14 columns-1 gap-8 sm:columns-2 lg:mt-16 lg:columns-3">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}
              as="li"
              delay={(index % 3) * 60}
              className="mb-8 break-inside-avoid lg:mb-12"
            >
              <ProjectCard
                image={project.image}
                alt={project.alt}
                title={project.title}
                caption={project.caption}
                segment={project.segment}
                ratio={ratios[index] ?? '4/3'}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              />

              {project.scope?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.scope.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3 py-1 text-caption text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </Section>

      <CaseStudySection />

      <TestimonialsSection />

      <FinalCtaSection
        eyebrow="Próximo passo"
        title="Quer um projeto com esse nível de acabamento na sua operação?"
        description="Conte o que precisa ser montado, reformado ou corrigido. O diagnóstico define o escopo antes de qualquer proposta."
        topic="projetos"
      />
    </>
  )
}
