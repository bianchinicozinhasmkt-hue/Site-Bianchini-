import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'
import { Eyebrow, Heading, Lead } from '@/components/ui/heading'

type Tone = 'white' | 'paper' | 'sand' | 'navy'

const tones: Record<Tone, string> = {
  white: 'bg-white',
  paper: 'bg-paper',
  sand: 'bg-sand',
  navy: 'bg-navy text-white on-dark',
}

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  tone?: Tone
  /** Remove o container interno (para seções com mosaico full-bleed). */
  bleed?: boolean
  /** Espaçamento vertical. */
  space?: 'default' | 'lg' | 'sm'
}

export function Section({
  id,
  children,
  className,
  tone = 'white',
  bleed = false,
  space = 'default',
}: SectionProps) {
  const padding =
    space === 'lg'
      ? 'py-20 md:py-28 lg:py-32'
      : space === 'sm'
        ? 'py-12 md:py-16'
        : 'py-16 md:py-22 lg:py-section-lg'

  return (
    <section id={id} className={cn(tones[tone], padding, className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  /** Alinhamento — centro apenas em destaques. */
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
  headingId?: string
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
  className,
  headingId,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={tone === 'dark' ? 'light' : 'bronze'}>{eyebrow}</Eyebrow> : null}
      <Heading as={2} id={headingId} className={cn(tone === 'dark' && 'text-white')}>
        {title}
      </Heading>
      {lead ? <Lead className={cn(tone === 'dark' && 'text-white/75')}>{lead}</Lead> : null}
    </div>
  )
}
