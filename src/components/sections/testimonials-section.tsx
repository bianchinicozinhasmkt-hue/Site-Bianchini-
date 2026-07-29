import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { testimonials } from '@/data/testimonials'

export function TestimonialsSection() {
  if (testimonials.length === 0) return null

  return (
    <Section id="depoimentos" tone="white">
      <SectionHeader
        eyebrow="Quem trabalhou com a Bianchini"
        title="Depoimentos."
        className="max-w-3xl"
      />

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <Reveal as="li" key={testimonial.id} delay={index * 80}>
            <figure className="flex h-full flex-col rounded-card border border-hairline bg-paper p-8">
              <span aria-hidden="true" className="font-serif text-5xl leading-[0.5] text-bronze/50">
                &ldquo;
              </span>
              <blockquote className="mt-6 flex-1">
                <p className="text-body text-ink/90">{testimonial.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-hairline pt-6">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-[0.8125rem] font-semibold tracking-wide text-white"
                >
                  {testimonial.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-semibold text-navy">
                    {testimonial.author}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-muted">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
