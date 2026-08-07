import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Container } from '@/components/layout/container'
import { Eyebrow } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { ChevronRightIcon } from '@/components/ui/icons'

interface Breadcrumb {
  label: string
  href: string
}

interface PageHeroProps {
  eyebrow: string
  title: string
  lead: string
  breadcrumbs?: Breadcrumb[]
  image?: { src: string; alt: string; caption?: string }
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  /** Lista curta de entregáveis ou escopo, exibida abaixo dos CTAs. */
  highlights?: string[]
  children?: ReactNode
}

/**
 * Hero das páginas internas. Mesma identidade da home — off-white, título
 * serifado, fotografia real à direita — variando apenas conteúdo e imagem.
 * Nenhuma página ganha identidade própria.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  image,
  primary,
  secondary,
  highlights,
  children,
}: PageHeroProps) {
  return (
    <section className="bg-canvas pt-[var(--header-height)]">
      {/*
        Respiro vertical fechado em ~40% no desktop (era `lg:py-20`).

        A abertura das páginas internas ficava com título e CTA flutuando
        sozinhos no off-white e o conteúdo real começava só depois da primeira
        dobra. Com o padding menor, a primeira seção de cada página já aparece
        parcialmente na primeira viewport — que é o que a torna uma página, e
        não um cartaz seguido de página.
      */}
      <Container className="py-8 md:py-10 lg:pb-12 lg:pt-11">
        {breadcrumbs?.length ? (
          <nav aria-label="Trilha de navegação" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-caption text-muted">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronRightIcon size={14} aria-hidden="true" className="text-steel" />
                  ) : null}
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-ink">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="crumb-link transition-colors hover:text-ink">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div
          className={
            image
              ? 'grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16'
              : 'max-w-3xl'
          }
        >
          <div className="flex flex-col items-start">
            <Eyebrow>{eyebrow}</Eyebrow>

            <h1 className="mt-5 font-sans font-bold text-display text-ink">{title}</h1>

            <p className="mt-6 max-w-xl text-lead text-muted">{lead}</p>

            {primary || secondary ? (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primary ? (
                  <LinkButton href={primary.href} size="lg" withArrow>
                    {primary.label}
                  </LinkButton>
                ) : null}
                {secondary ? (
                  <LinkButton href={secondary.href} variant="secondary" size="lg">
                    {secondary.label}
                  </LinkButton>
                ) : null}
              </div>
            ) : null}

            {highlights?.length ? (
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-7">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-body-sm text-muted">
                    <span aria-hidden="true" className="h-px w-4 bg-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {children}
          </div>

          {image ? (
            <figure className="w-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-canvas-deep lg:aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              {image.caption ? (
                <figcaption className="mt-3 text-caption text-muted">{image.caption}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
