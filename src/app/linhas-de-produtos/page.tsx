import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { Accent, Eyebrow, Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/button'
import { equipmentLines } from '@/data/equipment-lines'
import { pageMetadata } from '@/lib/metadata'
import { whatsappUrl, whatsappUrlWithText } from '@/lib/whatsapp'

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
      <section className="bg-navy pb-16 pt-[calc(var(--header-height)+3.5rem)] text-white on-dark md:pb-20 md:pt-[calc(var(--header-height)+5rem)]">
        <Container>
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] text-white/50">
              <li>
                <Link href="/" className="text-white/60 transition-colors hover:text-white">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white/85">
                Linhas de equipamento
              </li>
            </ol>
          </nav>

          <Eyebrow tone="light">Dentro do escopo do projeto</Eyebrow>
          <Heading as={1} className="mt-5 max-w-4xl text-white">
            Oito linhas de equipamento, <Accent>uma especificação técnica.</Accent>
          </Heading>
          <p className="mt-7 max-w-2xl text-body text-white/70">
            Os equipamentos não são o ponto de partida — são a consequência do diagnóstico e do projeto
            executivo. Cada linha abaixo é dimensionada pelo volume real da operação, fabricada ou
            fornecida e instalada pela Bianchini.
          </p>

          <ul className="mt-10 flex flex-wrap gap-2">
            {equipmentLines.map((line) => (
              <li key={line.id}>
                <a
                  href={`#${line.id}`}
                  className="inline-flex rounded border border-white/20 px-4 py-2 text-[0.8125rem] font-medium text-white/80 transition-colors hover:border-white hover:text-white"
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
          tone={index % 2 === 0 ? 'white' : 'paper'}
          className="scroll-mt-[var(--header-height)] border-b border-hairline"
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
              <Heading as={2} size={3} className="mt-6">
                {line.name}
              </Heading>
              <p className="mt-5 border-l-2 border-bronze pl-5 font-serif text-lg italic leading-relaxed text-navy">
                {line.statement}
              </p>
              <div className="mt-6 space-y-4 text-body-sm text-ink/80">
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
                  <LinkButton href={line.href} variant="outline">
                    Ver destaque técnico
                  </LinkButton>
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="text-eyebrow font-semibold uppercase text-muted">Itens da linha</h3>
              <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
                {line.items.map((item) => (
                  <li key={item.name} className="py-5">
                    <h4 className="text-[1rem] font-semibold text-navy">{item.name}</h4>
                    <p className="mt-2 max-w-prose text-body-sm text-ink/75">{item.description}</p>
                  </li>
                ))}
              </ul>

              {line.gallery && line.gallery.length > 0 ? (
                <Reveal className="mt-10">
                  <h3 className="text-eyebrow font-semibold uppercase text-muted">Fotos da linha</h3>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                    {line.gallery.map((photo) => (
                      <li key={photo.src}>
                        <figure>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-hairline bg-sand">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="(max-width: 639px) 100vw, 30vw"
                              className="object-cover"
                            />
                          </div>
                          <figcaption className="mt-2.5 text-[0.8125rem] text-muted">
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

      <Section tone="navy" space="lg">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow tone="light">Próximo passo</Eyebrow>
          <Heading as={2} size={3} className="mt-5 text-white">
            A especificação certa começa no diagnóstico.
          </Heading>
          <p className="mt-6 text-body text-white/70">
            Antes de indicar qualquer equipamento, entendemos o volume, o cardápio e o espaço. A análise
            inicial é gratuita.
          </p>
          <LinkButton href={whatsappUrl('equipamentos')} size="lg" className="mt-9" withArrow>
            Solicitar diagnóstico
          </LinkButton>
        </div>
      </Section>
    </>
  )
}
