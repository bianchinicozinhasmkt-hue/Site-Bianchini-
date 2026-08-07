import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { FeatureGrid } from '@/components/blocks/feature-grid'
import { DeliverablesBlock } from '@/components/blocks/deliverables-block'
import { FaqBlock } from '@/components/blocks/faq-block'
import { ProblemsSection } from '@/components/sections/problems-section'
import { DiagnosisSection } from '@/components/sections/diagnosis-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { consultingPage } from '@/data/pages'
import { consultingFaq } from '@/data/faq'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

const path = '/solucoes/consultoria-para-restaurantes'

export const metadata: Metadata = pageMetadata({
  title: 'Consultoria para restaurantes',
  description:
    'Diagnóstico operacional para restaurantes e operações de food service: gargalos, desperdícios, dimensionamento, produtividade e prioridades de investimento.',
  path,
})

export default function ConsultingPage() {
  const { hero, symptoms, fronts, deliverables } = consultingPage

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Soluções', path: '/solucoes' },
              { name: 'Consultoria para restaurantes', path },
            ]),
            faqSchema([...consultingFaq]),
          ]),
        }}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        highlights={[...hero.highlights]}
        image={hero.image}
        primary={{ label: 'Receber diagnóstico operacional', href: '/contato?intencao=consultoria' }}
        secondary={{ label: 'Ver método', href: '#diagnostico' }}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Consultoria para restaurantes', href: path },
        ]}
      />

      <ProblemsSection
        id="sintomas"
        eyebrow="Sintomas"
        title="O que a operação mostra antes de o resultado cair"
        lead="Se dois ou três destes cenários acontecem na sua operação, existe causa comum — e ela raramente é a que aparece primeiro."
        items={symptoms}
        tone="surface"
      />

      <DiagnosisSection />

      <FeatureGrid
        id="crescimento"
        eyebrow="Frentes de atuação"
        title="Onde o trabalho pode entrar"
        lead="O escopo é definido pelo diagnóstico. Marketing e estrutura comercial entram quando o gargalo é de demanda, não de operação — como extensão do mesmo plano, nunca como serviço de agência."
        items={fronts}
        tone="canvas"
      />

      <DeliverablesBlock
        title="O que fica registrado"
        lead="Documentos que a operação continua usando depois do trabalho, não uma apresentação de slides."
        items={[...deliverables]}
        note="Não trabalhamos com promessa de percentual de economia. O resultado depende da execução das mudanças acordadas."
        tone="canvas-deep"
      />

      <TestimonialsSection />

      <FaqBlock items={[...consultingFaq]} tone="canvas" />

      <FinalCtaSection
        eyebrow="Próximo passo"
        title="Vamos olhar a sua operação antes de recomendar qualquer investimento?"
        description="A conversa começa pelo que está incomodando. Se a solução não exigir compra, é isso que vamos dizer."
        primaryLabel="Receber diagnóstico operacional"
        primaryHref="/contato?intencao=consultoria"
        topic="consultoria"
      />
    </>
  )
}
