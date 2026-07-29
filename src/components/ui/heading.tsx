import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Level = 1 | 2 | 3 | 4

const sizes: Record<Level, string> = {
  1: 'text-display-1',
  2: 'text-display-2',
  3: 'text-display-3',
  4: 'text-display-4',
}

interface HeadingProps {
  /** Nível semântico do heading. A home usa um único h1. */
  as?: Level
  /** Escala visual, quando precisa diferir do nível semântico. */
  size?: Level
  children: ReactNode
  className?: string
  id?: string
}

export function Heading({ as = 2, size, children, className, id }: HeadingProps) {
  const Tag = `h${as}` as 'h1' | 'h2' | 'h3' | 'h4'
  return (
    <Tag id={id} className={cn('font-serif text-navy', sizes[size ?? as], className)}>
      {children}
    </Tag>
  )
}

interface EyebrowProps {
  children: ReactNode
  className?: string
  tone?: 'bronze' | 'light'
}

/** Label superior de seção (all caps, bronze). */
export function Eyebrow({ children, className, tone = 'bronze' }: EyebrowProps) {
  return (
    <span
      className={cn(
        'block text-eyebrow font-semibold uppercase',
        tone === 'bronze' ? 'text-bronze' : 'text-bronze-light',
        className,
      )}
    >
      {children}
    </span>
  )
}

interface LeadProps {
  children: ReactNode
  className?: string
}

/** Parágrafo de abertura, um degrau acima do corpo. */
export function Lead({ children, className }: LeadProps) {
  return <p className={cn('max-w-prose text-lg leading-[1.7] text-ink/90', className)}>{children}</p>
}

/** Ênfase editorial em serifa itálica carmim (padrão da marca). */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="font-serif italic text-carmim">{children}</em>
}
