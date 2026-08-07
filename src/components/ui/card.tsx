import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from './icons'

/**
 * Cards de conteúdo. Regra de navegação do guia (§6): o card leva à página de
 * detalhe — nenhum card abre WhatsApp por inteiro.
 */

interface MediaCardProps {
  href: string
  image: string
  alt: string
  /** Proporção da mídia. Cards de solução usam 4:3; projetos variam. */
  ratio?: '4/3' | '3/2' | '1/1' | '4/5'
  eyebrow?: string
  title: string
  description?: string
  bullets?: string[]
  cta?: string
  sizes?: string
  priority?: boolean
  className?: string
}

const ratios: Record<NonNullable<MediaCardProps['ratio']>, string> = {
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
  '4/5': 'aspect-[4/5]',
}

/** Card de solução: fotografia, problema atendido, benefício e link. */
export function SolutionCard({
  href,
  image,
  alt,
  ratio = '4/3',
  eyebrow,
  title,
  description,
  bullets,
  cta = 'Conhecer',
  sizes = '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw',
  priority = false,
  className,
}: MediaCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface transition-[border-color,box-shadow] duration-300 ease-smooth hover:border-ink/25 hover:shadow-card-hover',
        className,
      )}
    >
      <div className={cn('relative w-full overflow-hidden bg-canvas-deep', ratios[ratio])}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 lg:p-7">
        {eyebrow ? (
          <p className="text-caption font-medium text-muted">{eyebrow}</p>
        ) : null}

        <h3 className="font-sans font-bold text-title-3 text-ink">{title}</h3>

        {description ? <p className="text-body-sm text-muted">{description}</p> : null}

        {bullets?.length ? (
          <ul className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-caption text-muted">
                <span aria-hidden="true" className="mt-[0.55rem] h-px w-3 shrink-0 bg-yellow" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-body-sm font-semibold text-ink">
          {cta}
          <ArrowRightIcon
            size={17}
            className="transition-transform duration-200 ease-precise group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}

interface ProjectCardProps {
  href?: string
  image: string
  alt: string
  title: string
  caption: string
  segment?: string
  ratio?: NonNullable<MediaCardProps['ratio']>
  sizes?: string
  priority?: boolean
  className?: string
}

/**
 * Card de projeto. Sem `href` renderiza como figura — usado enquanto as
 * páginas individuais de case não existem, para não criar link morto.
 */
export function ProjectCard({
  href,
  image,
  alt,
  title,
  caption,
  segment,
  ratio = '4/3',
  sizes = '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw',
  priority = false,
  className,
}: ProjectCardProps) {
  const body = (
    <>
      <div className={cn('relative w-full overflow-hidden rounded-sm bg-canvas-deep', ratios[ratio])}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </div>
      <figcaption className="flex flex-col gap-2 pt-4">
        {segment ? (
          <span className="font-condensed text-eyebrow font-semibold uppercase text-ink">{segment}</span>
        ) : null}
        <h3 className="font-sans font-bold text-title-3 text-ink">{title}</h3>
        <p className="text-body-sm text-muted">{caption}</p>
      </figcaption>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn('group block', className)}>
        <figure>{body}</figure>
      </Link>
    )
  }

  return <figure className={cn('group', className)}>{body}</figure>
}

interface PlainCardProps {
  children: ReactNode
  className?: string
  tone?: 'surface' | 'canvas' | 'graphite'
}

/** Superfície neutra para blocos de texto, listas e métricas. */
export function Card({ children, className, tone = 'surface' }: PlainCardProps) {
  const tones = {
    surface: 'border-line bg-surface',
    canvas: 'border-line bg-canvas',
    graphite: 'border-white/12 bg-graphite-soft text-canvas on-dark',
  } as const

  return (
    <div className={cn('rounded-sm border p-6 lg:p-8', tones[tone], className)}>{children}</div>
  )
}
