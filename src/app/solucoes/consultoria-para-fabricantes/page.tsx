import type { Metadata } from 'next'
import { PageHero } from '@/components/blocks/page-hero'
import { DeliverablesBlock } from '@/components/blocks/deliverables-block'
import { FaqBlock } from '@/components/blocks/faq-block'
import { ProblemsSection } from '@/components/sections/problems-section'
import { ProcessSection } from '@/components/sections/process-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { manufacturersPage } from '@/data/pages'
import { manufacturersFaq } from '@/data/faq'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

const path = '/solucoes/consultoria-para-fabricantes'

export const metadata: Metadata = pageMetadata({
  title: 'Consultoria para fabricantes de cozinhas',
  description:
    'Diagnóstico de chão de fábrica e de estrutura comercial para fabricantes de cozinhas profissionais e mobiliário em inox: processo, produtividade, gestão e vendas.',
  path,
})

export default function ManufacturersPage() {
  const { hero, challenges, deliverables } = manufacturersPage

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Soluções', path: '/solucoes' },
              { name: 'Consultoria para fabricantes', path },
            ]),
            faqSchema([...manufacturersFaq]),
          ]),
        }}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        highlights={[...hero.highlights]}
        image={hero.image}
        primary={{ label: 'Falar com um consultor', href: '/contato?intencao=fabricantes' }}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Consultoria para fabricantes', href: path },
        ]}
      />

      <ProblemsSection
        id="desafios"
        eyebrow="Desafios recorrentes"
        title="O que costuma travar uma fábrica de cozinhas"
        lead="Problemas de chão de fábrica e de estrutura comercial normalmente aparecem juntos — e se alimentam."
        items={challenges}
        tone="surface"
      />

      <ProcessSection
        tone="canvas"
        eyebrow="Método"
        title="Diagnóstico antes de qualquer mudança de processo"
        lead="A sequência é a mesma aplicada em operações de food service, ajustada à realidade de produção seriada."
      />

      <DeliverablesBlock
        title="Entregáveis"
        lead="Documentação objetiva do que foi encontrado e da ordem recomendada para resolver."
        items={[...deliverables]}
        note="Informações de processo, custo e carteira são tratadas como confidenciais e não são publicadas nem usadas como material comercial sem autorização por escrito."
        tone="canvas-deep"
      />

      <FaqBlock items={[...manufacturersFaq]} tone="surface" />

      <FinalCtaSection
        eyebrow="Próximo passo"
        title="Vamos conversar sobre a sua fábrica?"
        description="Uma conversa inicial para entender o momento da operação, o volume produzido e onde está o gargalo."
        primaryLabel="Falar com um consultor"
        primaryHref="/contato?intencao=fabricantes"
        topic="fabricantes"
      />
    </>
  )
}
