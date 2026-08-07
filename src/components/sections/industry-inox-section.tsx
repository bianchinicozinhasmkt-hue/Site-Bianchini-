import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { industry } from '@/data/industry'

/**
 * Indústria do inox — seção própria e separada dos três pilares (público é o
 * fabricante, não o operador de cozinha). A fotografia é decorativa
 * (`aria-hidden`, sem legenda): produto genérico do acervo, sem cliente, obra
 * ou fábrica identificada — ver `src/data/industry.ts`.
 */
export function IndustryInoxSection() {
  return (
    <Section
      id="industria-do-inox"
      tone="graphite"
      space="default"
      bleed
      aria-labelledby="industria-do-inox-titulo"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-7">
            <Eyebrow tone="light">{industry.eyebrow}</Eyebrow>
            <Heading
              as={2}
              id="industria-do-inox-titulo"
              size="title-1"
              className="mt-5 max-w-[20ch] text-canvas"
            >
              {industry.title}
            </Heading>
            <p className="mt-5 max-w-[58ch] text-lead text-canvas/75">{industry.text}</p>
          </div>

          {/*
            `estante-inox.jpg` é foto de produto em fundo branco de estúdio —
            direto sobre o grafite ela virava um retângulo branco evidente.
            O tratamento abaixo é uma superfície integrada: um painel com a
            própria paleta da seção (`graphite-soft` + borda sutil) em vez de
            recortar ou mascarar o arquivo, com a foto centralizada e uma
            moldura de respiro — lê como card de produto, não como acidente
            de renderização. Continua decorativo, sem legenda.
          */}
          <div aria-hidden="true" className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-graphite-soft p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-10">
              <Image
                src={industry.image.src}
                alt=""
                fill
                sizes="(max-width: 1023px) 76vw, 30vw"
                quality={80}
                className="object-contain object-center p-4"
              />
              {/* Vinheta: funde o branco de estúdio da foto à moldura grafite. */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(16,16,16,0.75)_100%)]" />
            </div>
          </div>
        </div>

        <ol className="mt-10 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-10 lg:pt-14">
          {industry.deliverables.map((item) => (
            <li key={item.number}>
              <p className="font-condensed text-caption font-bold tabular-nums text-yellow">
                {item.number}
              </p>
              <h3 className="mt-3 font-sans font-bold text-body text-canvas">{item.title}</h3>
              <p className="mt-2 text-body-sm text-canvas/70">{item.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/15 pt-8 lg:mt-12">
          <LinkButton href={industry.ctas.primary.href} variant="light" size="md" withArrow>
            {industry.ctas.primary.label}
          </LinkButton>
          <LinkButton href={industry.ctas.secondary.href} variant="light-outline" size="md" withArrow>
            {industry.ctas.secondary.label}
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}
