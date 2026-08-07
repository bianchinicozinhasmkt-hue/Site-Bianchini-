import Image from 'next/image'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { caseStages } from '@/data/process'

/**
 * Do desenho técnico à operação entregue, com material real de projeto:
 * planta executiva em CAD, estudo 3D e a cozinha construída.
 *
 * Não há nome de cliente, métrica de resultado ou prazo — esses dados
 * dependem de autorização e ainda não foram confirmados.
 */
export function CaseStudySection() {
  return (
    <Section id="etapas" tone="canvas-deep" space="lg" aria-labelledby="etapas-titulo">
      <SectionHeader
        headingId="etapas-titulo"
        eyebrow="Do desenho à operação"
        title="O mesmo projeto, em três momentos"
        lead="A planta define a operação, o estudo tridimensional valida a decisão com o cliente e a entrega confirma o que foi desenhado."
      />

      <ol className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-3 lg:gap-10">
        {caseStages.map((stage, index) => (
          <Reveal key={stage.stage} as="li" variant="side" delay={index * 80}>
            <article className="flex h-full flex-col">
              {stage.image ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-canvas">
                  <Image
                    src={stage.image}
                    alt={stage.alt ?? ''}
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <span className="mt-5 font-condensed text-eyebrow font-semibold uppercase text-ink">
                {stage.stage}
              </span>
              <h3 className="mt-2 font-sans font-bold text-title-3 text-ink">{stage.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{stage.description}</p>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
