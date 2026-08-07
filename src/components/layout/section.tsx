import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography/heading'

type Tone = 'canvas' | 'surface' | 'canvas-deep' | 'graphite' | 'graphite-soft'

const tones: Record<Tone, string> = {
  canvas: 'bg-canvas',
  surface: 'bg-surface',
  'canvas-deep': 'bg-canvas-deep',
  graphite: 'bg-graphite text-canvas on-dark',
  'graphite-soft': 'bg-graphite-soft text-canvas on-dark',
}

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  tone?: Tone
  /** Remove o container interno (para faixas full-bleed). */
  bleed?: boolean
  /** Ritmo vertical: 96–128px no desktop, 64–80px no mobile. */
  space?: 'default' | 'lg' | 'sm' | 'xs'
  'aria-labelledby'?: string
}

export function Section({
  id,
  children,
  className,
  tone = 'canvas',
  bleed = false,
  space = 'default',
  ...props
}: SectionProps) {
  const padding = {
    xs: 'py-8 md:py-10',
    sm: 'py-12 md:py-16',
    default: 'py-16 md:py-20 lg:py-section',
    lg: 'py-20 md:py-24 lg:py-section-lg',
  }[space]

  return (
    <section id={id} className={cn(tones[tone], padding, className)} {...props}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  /** Ação alinhada à direita do título no desktop. */
  action?: ReactNode
  align?: 'left' | 'center'
  tone?: 'default' | 'light'
  className?: string
  headingId?: string
  headingLevel?: 2 | 3
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  align = 'left',
  tone = 'default',
  className,
  headingId,
  headingLevel = 2,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between',
        align === 'center' && 'items-center lg:flex-col lg:items-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex max-w-2xl flex-col gap-5',
          align === 'center' && 'items-center text-center',
        )}
      >
        {eyebrow ? <Eyebrow tone={tone === 'light' ? 'light' : 'default'}>{eyebrow}</Eyebrow> : null}

        <Heading
          as={headingLevel}
          size={headingLevel === 2 ? 'title-1' : 'title-2'}
          id={headingId}
          className={cn(tone === 'light' && 'text-canvas')}
        >
          {title}
        </Heading>

        {lead ? <Lead tone={tone === 'light' ? 'light' : 'default'}>{lead}</Lead> : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
