import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { equipmentLines } from '@/data/equipment-lines'
import { pageMetadata } from '@/lib/metadata'
import { whatsappUrlWithText } from '@/lib/whatsapp'
import { FinalCtaSection } from '@/components/sections/final-cta-section'

export const metadata: Metadata = pageMetadata({
  title: 'Linhas de equipamento',
  description:
    'Oito linhas de equipamento especificadas dentro do projeto Bianchini: mobiliário inox, cocção, refrigeração, bar, distribuição, transporte interno, tecnologia e exaustão.',
  path: '/linhas-de-produtos',
})

export default function EquipmentLinesPage() {
  return (
    <>
      {/* Cabeçalho da página */}
      <section className="bg-canvas pt-[var(--header-height)]">
        <Container className="py-10 md:py-14 lg:py-20">
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-caption text-muted">
              <li>
                <Link href="/" className="crumb-link transition-colors hover:text-ink">
                  Início
                </Link>
              </li>
              <li aria-hidden="true" className="text-steel">
                /
              </li>
              <li aria-current="page" className="text-ink">
                Linhas de equipamento
              </li>
            </ol>
          </nav>

          <Eyebrow>Dentro do escopo do projeto</Eyebrow>
          <Heading as={1} size="display" className="mt-5 max-w-4xl">
            Oito linhas de equipamento, uma especificação técnica
          </Heading>
          <p className="mt-7 max-w-2xl text-lead text-muted">
            Os equipamentos não são o ponto de partida — são a consequência do diagnóstico e do
            projeto executivo. Cada linha abaixo é dimensionada pelo volume real da operação,
            fabricada ou fornecida e instalada pela Bianchini.
          </p>

          <ul className="mt-10 flex flex-wrap gap-2">
            {equipmentLines.map((line) => (
              <li key={line.id}>
                <a
                  href={`#${line.id}`}
                  className="inline-flex min-h-[2.75rem] items-center rounded-sm border border-line px-4 py-2 text-body-sm font-medium text-muted transition-colors hover:border-ink hover:text-ink"
                >
                  {line.shortName}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {equipmentLines.map((line, index) => (
        <Section
          key={line.id}
          id={line.id}
          tone={index % 2 === 0 ? 'canvas' : 'surface'}
          className="scroll-mt-[calc(var(--header-height)+1rem)] border-b border-line"
        >
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Image
                src={line.icon}
                alt=""
                width={200}
                height={133}
                sizes="120px"
                className="h-14 w-auto object-contain"
              />
              <Heading as={2} size="title-2" className="mt-6">
                {line.name}
              </Heading>
              <p className="mt-5 border-l-2 border-yellow pl-5 text-lead text-ink">
                {line.statement}
              </p>
              <div className="mt-6 space-y-4 text-body-sm text-muted">
                {line.intro.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton
                  href={whatsappUrlWithText(
                    `Olá! Tenho interesse na linha de ${line.name} para a minha operação.`,
                  )}
                  withArrow
                >
                  Falar sobre esta linha
                </LinkButton>
                {line.href ? (
                  <LinkButton href={line.href} variant="secondary">
                    Ver destaque técnico
                  </LinkButton>
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="font-condensed text-eyebrow font-semibold uppercase text-ink">
                Itens da linha
              </h3>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {line.items.map((item) => (
                  <li key={item.name} className="py-5">
                    <h4 className="font-sans text-body font-semibold text-ink">{item.name}</h4>
                    <p className="mt-2 max-w-prose text-body-sm text-muted">{item.description}</p>
                  </li>
                ))}
              </ul>

              {line.gallery && line.gallery.length > 0 ? (
                <Reveal className="mt-10">
                  <h3 className="font-condensed text-eyebrow font-semibold uppercase text-ink">
                    Fotos da linha
                  </h3>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                    {line.gallery.map((photo) => (
                      <li key={photo.src}>
                        <figure>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-surface">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="(max-width: 639px) 100vw, 30vw"
                              className="object-cover"
                            />
                          </div>
                          <figcaption className="mt-2.5 text-caption text-muted">
                            {photo.caption}
                          </figcaption>
                        </figure>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </div>
        </Section>
      ))}

      <FinalCtaSection
        eyebrow="Próximo passo"
        title="A especificação certa começa no diagnóstico"
        description="Antes de indicar qualquer equipamento, entendemos o volume de produção, o cardápio e o espaço disponível."
        topic="equipamentos"
      />
    </>
  )
}
