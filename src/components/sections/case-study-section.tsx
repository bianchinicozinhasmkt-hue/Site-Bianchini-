import Image from 'next/image'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { LinkButton } from '@/components/ui/button'
import { caseStages } from '@/data/process'
import { whatsappUrl } from '@/lib/whatsapp'

/**
 * Anatomia de um projeto, ilustrada com material técnico real da Bianchini
 * (planta executiva, estudo 3D e a operação construída).
 *
 * Não há métricas de resultado aqui: nenhum case com números auditáveis foi
 * fornecido. Quando houver, este é o lugar de incluí-lo.
 */
export function CaseStudySection() {
  return (
    <Section id="anatomia" tone="paper">
      <SectionHeader
        eyebrow="Anatomia de um projeto"
        title={
          <>
            Da planta ao dia
            <br />
            em que a cozinha produz.
          </>
        }
        lead="O mesmo projeto percorre três estágios antes de virar operação. Nada é fabricado antes de estar desenhado, validado e aprovado pelo cliente."
        className="max-w-3xl"
      />

      <ol className="mt-14 grid gap-8 md:grid-cols-3">
        {caseStages.map((stage, index) => (
          <Reveal as="li" key={stage.stage} delay={index * 90} className="flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-hairline bg-white">
              {stage.image ? (
                <Image
                  src={stage.image}
                  alt={stage.alt ?? ''}
                  fill
                  sizes="(max-width: 767px) 100vw, 32vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <span className="mt-6 text-eyebrow font-semibold uppercase text-bronze">{stage.stage}</span>
            <h3 className="mt-3 font-serif text-display-4 text-navy">{stage.title}</h3>
            <p className="mt-3 text-body-sm text-ink/80">{stage.description}</p>
          </Reveal>
        ))}
      </ol>

      <div className="mt-14 flex flex-col items-start gap-5 rounded-card border border-hairline bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-body text-ink/85">
          Quer entender em qual estágio a sua operação está? O diagnóstico inicial é gratuito e começa
          com uma conversa.
        </p>
        <LinkButton href={whatsappUrl('analise')} withArrow className="shrink-0">
          Solicitar análise inicial
        </LinkButton>
      </div>
    </Section>
  )
}
