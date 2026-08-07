import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { LeonardoPortrait } from '@/components/ui/leonardo-portrait'
import { ChevronRightIcon, ArrowUpRightIcon } from '@/components/ui/icons'
import { leonardo } from '@/data/leonardo'

/**
 * Hero da página de Leonardo.
 *
 * Diferente do `PageHero` das outras páginas internas, que é off-white: o
 * retrato disponível é um recorte com fundo removido e camisa branca — sobre
 * `canvas` a figura se dissolveria. Em grafite ela ganha silhueta, e a
 * página inteira herda a mesma leitura: Leonardo é o bloco escuro do site.
 *
 * A composição é a mesma da seção da home, em escala maior: retrato apoiado na
 * base por `object-contain object-bottom`, linha amarela descendo pela lateral e
 * placa técnica ao pé. O cabeçalho é fixo, daí o `pt-[var(--header-height)]`.
 */
export function LeonardoHero() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-graphite pt-[var(--header-height)] text-canvas">
      <Container className="relative py-10 md:py-14 lg:py-16">
        <nav aria-label="Trilha de navegação" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-caption text-canvas/60">
            <li>
              <Link href="/" className="crumb-link transition-colors hover:text-canvas">
                Início
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRightIcon size={14} aria-hidden="true" className="text-steel" />
              <span aria-current="page" className="text-canvas">
                Leonardo Bianchini
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12 lg:items-end lg:gap-x-14">
          {/* ---------- Enunciado ---------- */}
          <div className="flex flex-col items-start lg:col-span-6 lg:pb-6">
            <Eyebrow tone="light" as="p">
              {leonardo.page.eyebrow}
            </Eyebrow>

            <h1 className="mt-5 max-w-[16ch] font-sans font-bold text-display text-canvas">
              {leonardo.page.title}
            </h1>

            <p className="mt-6 max-w-[54ch] text-lead text-canvas/80">{leonardo.page.lead}</p>

            <LinkButton href="/contato" variant="primary" size="lg" withArrow className="mt-9">
              Solicitar diagnóstico
            </LinkButton>

            {/* Placa técnica: o que é verificável, em uma linha cada. */}
            <dl className="mt-10 grid w-full gap-x-10 gap-y-5 border-t border-white/15 pt-7 sm:grid-cols-2">
              <div>
                <dt className="text-caption uppercase tracking-[0.14em] text-canvas/50">
                  No setor desde
                </dt>
                <dd className="mt-1.5 font-sans text-title-3 font-bold text-canvas">
                  {leonardo.since}
                </dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-[0.14em] text-canvas/50">
                  Especialização
                </dt>
                <dd className="mt-1.5 text-body-sm text-canvas/80">{leonardo.scope}</dd>
              </div>
            </dl>

            <a
              href={leonardo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex min-h-[2.75rem] w-fit items-center gap-2 py-2 text-body-sm font-semibold text-canvas transition-colors hover:text-white"
            >
              Perfil no LinkedIn
              <ArrowUpRightIcon
                size={16}
                className="text-yellow transition-transform duration-200 ease-precise group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* ---------- Retrato ---------- */}
          <figure className="lg:col-span-5 lg:col-start-8">
            {/* `pl-[3px]` abre a calha da linha amarela desenhada pelo retrato. */}
            <div className="flex h-[24rem] justify-center pl-[3px] sm:h-[31rem] lg:h-[38rem] lg:justify-end">
              <LeonardoPortrait
                priority
                sizes="(max-width: 639px) 56vw, (max-width: 1023px) 42vw, 26vw"
              />
            </div>

            <figcaption className="mt-5 border-t border-white/15 pt-4">
              <p className="font-sans text-body font-semibold text-canvas">{leonardo.name}</p>
              <p className="mt-1 text-caption text-canvas/70">{leonardo.role}</p>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  )
}
