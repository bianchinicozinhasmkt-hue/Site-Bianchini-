'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/button'
import { heroMetrics, scopeSteps } from '@/data/site'
import { whatsappUrl } from '@/lib/whatsapp'

const slides = [
  {
    src: '/images/hero/linha-de-coccao.jpg',
    alt: 'Linha de cocção com chapa, char-broiler e balcão refrigerado sob coifa em aço inox',
  },
  {
    src: '/images/hero/bar-em-inox.jpg',
    alt: 'Balcão de bar em aço inox com cuba, apoio refrigerado e prateleiras de garrafas',
  },
  {
    src: '/images/hero/show-cooking.jpg',
    alt: 'Balcão de distribuição com show cooking, lâmpadas de calor e nichos para louça',
  },
  {
    src: '/images/hero/fornos-combinados.jpg',
    alt: 'Fornos combinados empilhados em cozinha profissional revestida em inox',
  },
  {
    src: '/images/hero/linha-de-distribuicao.jpg',
    alt: 'Buffet de distribuição iluminado em salão de refeições',
  },
]

const ROTATION_MS = 6000

export function HeroSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Respeita a preferência por menos movimento: sem rotação automática.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, ROTATION_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-white pt-[var(--header-height)]">
      <div className="grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex items-center py-14 md:py-20 lg:py-24">
          <Container className="lg:pr-10">
            <Eyebrow>Projeto · Implantação · Consultoria</Eyebrow>

            <h1 className="mt-6 text-display-1 font-serif text-navy">
              Sua operação não precisa
              <br />
              de equipamentos.
              <br />
              <em className="italic text-carmim">Precisa de projeto.</em>
            </h1>

            <p className="mt-7 max-w-xl text-body text-ink/90">
              A Bianchini projeta, especifica e implanta cozinhas profissionais inteiras — do
              diagnóstico da operação ao dia em que a equipe começa a produzir. Engenharia de fluxo,
              conformidade e responsabilidade única do início ao fim.
            </p>

            <ul className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2">
              {scopeSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="text-[0.8125rem] font-medium text-navy">{step}</span>
                  {index < scopeSteps.length - 1 ? (
                    <span aria-hidden="true" className="text-bronze">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href={whatsappUrl('diagnostico')} size="lg" withArrow>
                Solicitar diagnóstico
              </LinkButton>
              <LinkButton href="/#processo" variant="outline" size="lg">
                Ver como trabalhamos
              </LinkButton>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-1 gap-6 border-t border-hairline pt-8 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.value}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block font-serif text-[1.75rem] leading-none text-carmim">
                      {metric.value}
                    </span>
                    <span className="mt-2 block text-[0.8125rem] leading-snug text-muted">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>

        <div
          className="relative h-[62vw] min-h-[320px] w-full overflow-hidden bg-sand sm:h-[54vw] lg:h-auto lg:min-h-[680px]"
          role="group"
          aria-roledescription="carrossel"
          aria-label="Operações projetadas e implantadas pela Bianchini"
        >
          {slides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 1023px) 100vw, 48vw"
              className={cn(
                'object-cover transition-opacity duration-1000 ease-brand',
                index === active ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy/45 to-transparent" />

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.src}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Exibir imagem ${index + 1} de ${slides.length}`}
                aria-current={index === active}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 ease-brand',
                  index === active ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
