import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { methodSteps } from '@/data/diagnosis'
import { positioning } from '@/data/site'

const journeyStages = [
  {
    number: '01',
    title: 'Entender',
    summary: 'Visita técnica e leitura da operação como ela funciona hoje.',
    proof: 'Especialistas em operação, não em catálogo.',
    image: '/images/projects/cozinha-completa.jpg',
    alt: 'Cozinha profissional completa em operação, com linha de cocção, coifa e bancadas em aço inox',
  },
  {
    number: '02',
    title: 'Decidir',
    summary: 'Prioridade, projeto e o investimento direcionado ao que muda a operação.',
    proof: methodSteps[2].description,
    image: '/images/projects/projeto-3d-recorte.jpg',
    alt: 'Estudo tridimensional de cozinha profissional, com bancadas, refrigeração e circulação posicionadas',
    isDocument: true,
  },
  {
    number: '03',
    title: 'Entregar',
    summary: 'Fabricação, obra, instalação e acompanhamento depois da entrega.',
    proof: 'Projeto, especificação e implantação sob uma única responsabilidade.',
    image: '/images/projects/forno-combinado.jpg',
    alt: 'Forno combinado instalado e comissionado em cozinha profissional',
  },
] as const

/**
 * Método e diferenciais em um único painel operacional: a evidência visual e
 * as três decisões pertencem à mesma composição, sem imagens orbitando textos.
 */
export function JourneySection() {
  return (
    <Section
      id="metodo"
      tone="canvas"
      space="sm"
      bleed
      aria-labelledby="jornada-titulo"
      className="isolate overflow-hidden"
    >
      <Container>
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>Método e diferenciais</Eyebrow>
            <Heading as={2} id="jornada-titulo" size="title-1" className="mt-5 max-w-[19ch]">
              {positioning.essence}
            </Heading>
          </div>
          <p className="max-w-[60ch] text-lead text-muted lg:col-span-4 lg:col-start-9">
            O mesmo time responde pelo entendimento do problema, pelo desenho da solução, pelo
            fornecimento e pela entrega em operação.
          </p>
        </header>

        <div className="mt-10 hidden min-h-[35rem] overflow-hidden border border-line bg-surface shadow-[0_24px_60px_-42px_rgba(16,16,16,0.55)] lg:grid lg:grid-cols-12">
          <div className="relative col-span-7 min-h-[35rem] overflow-hidden bg-graphite">
            <Image
              src={journeyStages[0].image}
              alt={journeyStages[0].alt}
              fill
              sizes="58vw"
              quality={84}
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/75 via-transparent to-graphite/15" />
            <span className="absolute left-5 top-5 border-l-2 border-yellow bg-graphite/90 px-4 py-2 text-sm font-semibold text-canvas">
              01 · A operação como ela é
            </span>

            <figure className="absolute bottom-6 left-6 w-[43%] border border-white/20 bg-canvas p-2 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={journeyStages[1].image}
                  alt={journeyStages[1].alt}
                  fill
                  sizes="25vw"
                  quality={82}
                  className="object-cover saturate-[0.55] contrast-[1.08]"
                />
              </div>
              <figcaption className="pt-2 text-sm font-semibold text-ink">02 · O que ela vai ser</figcaption>
            </figure>

            <figure className="absolute bottom-6 right-6 w-[31%] overflow-hidden border border-white/20 bg-graphite">
              <div className="relative aspect-[4/3]">
                <Image
                  src={journeyStages[2].image}
                  alt={journeyStages[2].alt}
                  fill
                  sizes="18vw"
                  quality={82}
                  className="object-cover"
                />
              </div>
              <figcaption className="px-3 py-2 text-sm font-semibold text-canvas">03 · No lugar</figcaption>
            </figure>
          </div>

          <ol className="col-span-5 grid grid-rows-3 divide-y divide-line">
            {journeyStages.map((stage) => (
              <li key={stage.title} className="grid grid-cols-[3.5rem_1fr] gap-4 p-6 xl:p-7">
                <span className="font-condensed text-sm font-bold tabular-nums text-ink/60">
                  {stage.number}
                </span>
                <div>
                  <h3 className="font-sans text-2xl font-bold text-ink">{stage.title}</h3>
                  <p className="mt-2 max-w-[56ch] text-base leading-relaxed text-muted">
                    {stage.summary}
                  </p>
                  <p className="mt-3 border-l-2 border-yellow-deep pl-3 text-base leading-relaxed text-ink">
                    {stage.proof}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ol className="mt-10 grid gap-6 lg:hidden">
          {journeyStages.map((stage) => (
            <li key={stage.title} className="overflow-hidden border border-line bg-surface">
              <div className="relative aspect-[16/10] overflow-hidden bg-canvas-deep">
                <Image
                  src={stage.image}
                  alt={stage.alt}
                  fill
                  sizes="92vw"
                  quality={80}
                  className={`object-cover ${'isDocument' in stage ? 'saturate-[0.55] contrast-[1.08]' : ''}`}
                />
                <span className="absolute left-3 top-3 bg-graphite px-3 py-2 font-condensed text-sm font-bold text-yellow">
                  {stage.number}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-sans text-2xl font-bold text-ink">{stage.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{stage.summary}</p>
                <p className="mt-4 border-l-2 border-yellow-deep pl-3 text-sm leading-relaxed text-ink">
                  {stage.proof}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <div className="on-dark mt-12 bg-graphite py-9 text-canvas lg:mt-14 lg:py-10">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[36ch] font-sans text-title-3 font-bold text-canvas">
              Uma única responsabilidade do diagnóstico ao acompanhamento.
            </p>
            <LinkButton href="/contato" variant="primary" size="lg" withArrow className="shrink-0">
              Solicitar diagnóstico
            </LinkButton>
          </div>
        </Container>
      </div>
    </Section>
  )
}
