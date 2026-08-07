import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { FeatureGrid } from '@/components/blocks/feature-grid'
import { DeliverablesBlock } from '@/components/blocks/deliverables-block'
import { FaqBlock } from '@/components/blocks/faq-block'
import { ProblemsSection } from '@/components/sections/problems-section'
import { ComparisonSection } from '@/components/sections/comparison-section'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { ProcessSection } from '@/components/sections/process-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { kitchensPage } from '@/data/pages'
import { kitchensFaq } from '@/data/faq'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

const path = '/solucoes/cozinhas-industriais'

export const metadata: Metadata = pageMetadata({
  title: 'Cozinhas industriais completas',
  description:
    'Projeto executivo, especificação dimensionada, fabricação em inox, instalação e comissionamento de cozinhas industriais completas — sob uma única responsabilidade.',
  path,
})

export default function KitchensPage() {
  const { hero, advantages, deliverables } = kitchensPage

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Soluções', path: '/solucoes' },
              { name: 'Cozinhas industriais completas', path },
            ]),
            faqSchema([...kitchensFaq]),
          ]),
        }}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        highlights={[...hero.highlights]}
        image={hero.image}
        primary={{ label: 'Solicitar orçamento', href: '/contato?intencao=equipamentos' }}
        secondary={{ label: 'Ver projetos', href: '/projetos' }}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Cozinhas industriais', href: path },
        ]}
      />

      <ProblemsSection tone="surface" />

      <FeatureGrid
        id="vantagens"
        eyebrow="Solução integrada"
        title="O que muda quando tudo passa pelo mesmo projeto"
        lead="Centralizar diagnóstico, projeto, fornecimento e implantação encurta a decisão e elimina o vão entre quem desenha e quem executa."
        items={advantages}
        columns={2}
        tone="canvas"
      />

      <EquipmentStripSection />

      <ProcessSection
        tone="canvas-deep"
        eyebrow="Como implantamos"
        title="Do dimensionamento ao comissionamento"
        lead="A mesma sequência em toda operação, com a profundidade ajustada ao porte do projeto."
      />

      <DeliverablesBlock
        title="O que você recebe"
        lead="Escopo completo de uma implantação. O detalhamento final é definido no contrato, conforme o porte da operação."
        items={[...deliverables]}
        note="Serviços de fabricação, instalação e comissionamento dependem do escopo contratado e das condições da obra."
        tone="surface"
      />

      <ComparisonSection />

      <ProjectsSection />

      <FaqBlock items={[...kitchensFaq]} tone="canvas-deep" />

      <FinalCtaSection
        eyebrow="Próximo passo"
        title="Vamos dimensionar a sua cozinha antes de orçar qualquer equipamento?"
        description="O orçamento sai do projeto — e o projeto sai da operação. Conte o que precisa ser montado ou reformado."
        primaryLabel="Solicitar orçamento"
        primaryHref="/contato?intencao=equipamentos"
        topic="cozinhas"
      />
    </>
  )
}
