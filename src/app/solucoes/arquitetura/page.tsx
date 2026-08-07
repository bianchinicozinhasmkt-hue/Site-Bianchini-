import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { DeliverablesBlock } from '@/components/blocks/deliverables-block'
import { FaqBlock } from '@/components/blocks/faq-block'
import { ProblemsSection } from '@/components/sections/problems-section'
import { CaseStudySection } from '@/components/sections/case-study-section'
import { ProcessSection } from '@/components/sections/process-section'
import { DifferentialsSection } from '@/components/sections/differentials-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { architecturePage } from '@/data/pages'
import { architectureFaq } from '@/data/faq'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

const path = '/solucoes/arquitetura'

export const metadata: Metadata = pageMetadata({
  title: 'Arquitetura, fluxo e equipamentos',
  description:
    'Projeto de arquitetura para cozinha, retaguarda, salão e fachada, desenhado a partir do fluxo de produção — com plantas complementares, estudo 3D e memorial descritivo.',
  path,
})

export default function ArchitecturePage() {
  const { hero, problems, deliverables } = architecturePage

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Soluções', path: '/solucoes' },
              { name: 'Arquitetura, fluxo e equipamentos', path },
            ]),
            faqSchema([...architectureFaq]),
          ]),
        }}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        highlights={[...hero.highlights]}
        image={hero.image}
        primary={{ label: 'Solicitar análise do projeto', href: '/contato?intencao=arquitetura' }}
        secondary={{ label: 'Ver projetos', href: '/projetos' }}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Arquitetura', href: path },
        ]}
      />

      <ProblemsSection
        id="problemas"
        eyebrow="O que costuma dar errado"
        title="Quando o espaço é desenhado sem a operação, a conta chega na obra"
        lead="Os seis cenários abaixo aparecem com frequência em projetos que trataram a cozinha como sobra de área."
        items={problems}
        tone="surface"
      />

      <CaseStudySection />

      <ProcessSection
        tone="canvas"
        eyebrow="Método de projeto"
        title="Do levantamento ao acompanhamento de obra"
        lead="Cada etapa entrega um documento que instrui a seguinte — nada fica para ser decidido no canteiro."
      />

      <DeliverablesBlock
        title="Entregáveis do projeto"
        lead="Documentação suficiente para orçar, licenciar e executar sem depender de interpretação."
        items={[...deliverables]}
        note="O conjunto final de pranchas e o nível de detalhamento variam conforme o escopo contratado e a complexidade da operação."
        tone="canvas-deep"
      />

      <DifferentialsSection />

      <FaqBlock items={[...architectureFaq]} tone="surface" />

      <FinalCtaSection
        eyebrow="Próximo passo"
        title="Tem um espaço, uma planta ou uma obra em andamento?"
        description="Envie o que já existe. A análise inicial aponta o que o desenho atual resolve e o que ainda vai custar caro na operação."
        primaryLabel="Solicitar análise do projeto"
        primaryHref="/contato?intencao=arquitetura"
        topic="arquitetura"
      />
    </>
  )
}
