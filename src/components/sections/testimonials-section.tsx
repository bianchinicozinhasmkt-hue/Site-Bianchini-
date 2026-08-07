import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { testimonials } from '@/data/testimonials'

/**
 * Prova social. Só entram depoimentos com autor, cargo e organização
 * identificáveis — os dois registrados são reais e foram recuperados do site
 * oficial (ver a nota de origem em `src/data/testimonials.ts`).
 *
 * Se a lista ficar vazia, a seção não é renderizada: nenhum placeholder é
 * exibido como se fosse depoimento verdadeiro. Com dois depoimentos válidos,
 * são exibidos dois — a grade não é completada com conteúdo inventado.
 *
 * **Não há carrossel.** Os dois depoimentos ficam visíveis ao mesmo tempo: são
 * evidência, e evidência não deve depender de o visitante esperar a rotação.
 *
 * A composição abandona a caixa: cada depoimento é tipografia grande sobre a
 * superfície, separada por régua vertical no desktop e horizontal no mobile.
 * A aspa é decorativa e fica na margem, fora do fluxo de leitura. O retrato é
 * pequeno de propósito — ele identifica o depoente, não o promove; e os
 * arquivos disponíveis são de baixa resolução, então ampliá-los seria pior.
 */
export function TestimonialsSection() {
  if (testimonials.length === 0) return null

  return (
    <Section id="depoimentos" tone="canvas" space="default" bleed aria-labelledby="depoimentos-titulo">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-6">
            <Eyebrow as="p">Depoimentos do setor</Eyebrow>
            <Heading as={2} id="depoimentos-titulo" size="title-1" className="mt-5 max-w-[18ch]">
              Reconhecimento construído dentro do setor.
            </Heading>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-body-sm text-muted">
              Depoimentos identificados por nome, cargo e organização. Não publicamos depoimento sem
              autoria.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-y-10 border-t border-line pt-10 lg:mt-16 lg:grid-cols-2 lg:gap-x-14 lg:pt-12">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 80}>
              <figure
                className={
                  index > 0
                    ? 'border-t border-line pt-10 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0'
                    : undefined
                }
              >
                {testimonial.context ? (
                  <p className="mb-5 font-condensed text-eyebrow font-semibold uppercase text-ink">
                    {testimonial.context}
                  </p>
                ) : null}

                <blockquote className="font-sans text-title-3 font-medium leading-[1.5] text-ink">
                  <p>{testimonial.quote}</p>
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-4">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.photoAlt ?? ''}
                      width={72}
                      height={72}
                      quality={80}
                      sizes="72px"
                      className="h-[72px] w-[72px] shrink-0 rounded-[2px] object-cover ring-1 ring-line"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[2px] bg-canvas-deep font-sans text-body font-bold text-ink ring-1 ring-line"
                    >
                      {testimonial.initials}
                    </span>
                  )}

                  <span className="flex flex-col">
                    <span className="text-body-sm font-semibold text-ink">{testimonial.author}</span>
                    <span className="text-caption text-muted">{testimonial.role}</span>
                    <span className="text-caption text-muted">{testimonial.organization}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
