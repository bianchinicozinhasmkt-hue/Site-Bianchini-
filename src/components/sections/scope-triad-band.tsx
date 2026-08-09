import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { scopeTriad } from '@/data/navigation'
import { methodSteps } from '@/data/diagnosis'

function findMethodStep(title: string) {
  const step = methodSteps.find((item) => item.title === title)
  if (!step) throw new Error(`scope-triad-band: methodSteps sem a etapa "${title}"`)
  return step
}

const TRANSITION_STEPS = [
  {
    number: '01',
    title: scopeTriad[0],
    description: findMethodStep('Diagnóstico').description,
    image: '/images/projects/cozinha-completa.jpg',
    alt: 'Cozinha profissional completa em operação, com linha de cocção, coifa e bancadas em aço inox',
    label: 'Leitura da operação',
  },
  {
    number: '02',
    title: scopeTriad[1],
    description: findMethodStep('Projeto e especificação').description,
    image: '/images/projects/projeto-3d-recorte.jpg',
    alt: 'Estudo tridimensional de cozinha profissional, com bancadas e equipamentos posicionados',
    label: 'Estudo de projeto',
    isDocument: true,
  },
  {
    number: '03',
    title: scopeTriad[2],
    description: findMethodStep('Fornecimento e instalação').description,
    image: '/images/hero/bar-em-inox.jpg',
    alt: 'Estrutura de bar em aço inox instalada, com cuba, apoio refrigerado e prateleiras',
    label: 'Entrega instalada',
  },
] as const

/**
 * Resposta direta aos problemas apresentados na seção anterior.
 * A fotografia participa da superfície inteira e cada etapa reúne evidência,
 * número e explicação no mesmo componente.
 */
export function ScopeTriadBand() {
  return (
    <section
      id="transicao"
      aria-labelledby="transicao-titulo"
      className="on-dark relative isolate overflow-hidden bg-graphite py-14 text-canvas lg:min-h-[700px] lg:py-16"
    >
      <Image
        src="/images/hero/bar-em-inox.jpg"
        alt=""
        fill
        sizes="100vw"
        /*
          Qualidade menor que a das fotografias que o site mostra de frente
          (74–84). Esta não é mostrada: é fundo decorativo, entra a `opacity-45`
          e ainda fica sob o gradiente da linha seguinte, que cobre de 74% a 98%.
          O que sobra é atmosfera, não detalhe — e a 1920px de largura a
          diferença entre q=78 e q=60 não aparece, mas pesa ~80 KB em toda
          abertura da home. Verificado por diferença de pixel antes de trocar.
          O valor consta de `images.qualities` em `next.config.ts`.
        */
        quality={60}
        aria-hidden="true"
        className="-z-20 object-cover object-[60%_42%] opacity-45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,11,12,0.98)_0%,rgba(10,11,12,0.93)_48%,rgba(10,11,12,0.74)_100%)]"
      />

      <Container>
        <header className="grid gap-6 border-b border-white/20 pb-8 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-10">
          <div className="lg:col-span-7">
            <Eyebrow tone="light">Do diagnóstico à instalação</Eyebrow>
            <Heading
              as={2}
              id="transicao-titulo"
              size="title-1"
              className="mt-4 max-w-[20ch] text-canvas"
            >
              Da leitura da operação à entrega em funcionamento.
            </Heading>
          </div>

          <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9">
            {/*
              ============================================================
              TEXTO TROCADO EM 2026-08-09 — era duplicata literal
              ============================================================

              Esta faixa e a seção Método (`journey-section.tsx`) publicavam a
              **mesma frase, palavra por palavra**: "O mesmo time responde pelo
              entendimento do problema, pelo desenho da solução, pelo
              fornecimento e pela entrega em operação." Duas seções da mesma
              página dizendo a mesma coisa é a repetição que faz a home parecer
              template — e a frase pertence ao Método, que é onde a
              responsabilidade única é o argumento.

              O que entra aqui responde a outra pergunta, a desta faixa: o
              visitante precisa das três etapas para contratar? Não.
              "Sem repasse de culpa entre projetista, fornecedor e instalador"
              é transcrição de `src/data/solutions.ts`.
            */}
            <p className="max-w-[58ch] text-base leading-relaxed text-canvas/80">
              Cada etapa pode ser contratada por si. Quando vêm juntas, não há repasse de culpa
              entre projetista, fornecedor e instalador — é a mesma empresa do desenho ao
              comissionamento.
            </p>
            <LinkButton href="#metodo" variant="light" size="md" withArrow>
              Conhecer o método
            </LinkButton>
          </div>
        </header>

        <ol className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
          {TRANSITION_STEPS.map((step) => (
            <li
              key={step.title}
              className="group grid min-h-[27rem] grid-rows-[12rem_1fr] overflow-hidden border border-white/20 bg-graphite/90 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.85)] md:min-h-[25rem] md:grid-rows-[10.5rem_1fr] lg:min-h-[26rem] lg:grid-rows-[12rem_1fr]"
            >
              <figure className="relative overflow-hidden bg-graphite-soft">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 767px) 92vw, 31vw"
                  quality={82}
                  className={`object-cover transition-transform duration-[260ms] ease-precise group-hover:scale-[1.02] motion-reduce:transition-none ${'isDocument' in step ? 'saturate-[0.55] contrast-[1.08]' : ''}`}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
                <figcaption className="absolute bottom-3 left-3 border-l-2 border-yellow bg-graphite/90 px-3 py-2 text-sm font-semibold text-canvas">
                  {step.label}
                </figcaption>
              </figure>

              <div className="flex flex-col p-5 lg:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="font-condensed text-sm font-bold tabular-nums text-yellow">
                    {step.number}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-white/20" />
                </div>
                <h3 className="mt-4 font-sans text-2xl font-bold text-canvas">{step.title}</h3>
                <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-canvas/75">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
