import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Level = 1 | 2 | 3 | 4
type Scale = 'display' | 'title-1' | 'title-2' | 'title-3'

const scaleByLevel: Record<Level, Scale> = {
  1: 'display',
  2: 'title-1',
  3: 'title-2',
  4: 'title-3',
}

const scales: Record<Scale, string> = {
  display: 'text-display font-extrabold',
  'title-1': 'text-title-1 font-bold',
  'title-2': 'text-title-2 font-bold',
  'title-3': 'text-title-3 font-bold',
}

interface HeadingProps {
  /** Nível semântico. Cada página tem um único h1. */
  as?: Level
  /** Escala visual, quando precisa diferir do nível semântico. */
  size?: Scale
  children: ReactNode
  className?: string
  id?: string
}

/**
 * Título do sistema: a grotesca de leitura em peso forte, entrelinha compacta.
 * Não usa a condensada da marca — ela fica nos rótulos comerciais curtos, onde
 * não custa legibilidade (ver `src/styles/typography.ts`).
 */
export function Heading({ as = 2, size, children, className, id }: HeadingProps) {
  const Tag = `h${as}` as 'h1' | 'h2' | 'h3' | 'h4'
  return (
    <Tag id={id} className={cn('font-sans text-ink', scales[size ?? scaleByLevel[as]], className)}>
      {children}
    </Tag>
  )
}

interface EyebrowProps {
  children: ReactNode
  className?: string
  /** `default` em fundo claro; `light` em fundo escuro. */
  tone?: 'default' | 'light'
  as?: 'span' | 'p'
}

/**
 * Etiqueta de seção: traço curto + rótulo condensado em caixa alta — a mesma
 * composição da etiqueta da primeira dobra do mockup.
 *
 * **Por que o rótulo não é amarelo em fundo claro.** No mockup ele é; sobre
 * `canvas`, porém, o amarelo da marca fica em 1,4:1 e o tom mais fechado em
 * 1,9:1, contra os 4,5:1 exigidos em AA. Não há matiz que resolva — escurecer
 * até passar produz um bronze que deixa de ler como o amarelo da marca. Então
 * em fundo claro o **texto é grafite** e o amarelo fica no traço, que é
 * decorativo; em fundo escuro, onde o amarelo alcança 11,8:1, o rótulo inteiro
 * é amarelo, exatamente como no mockup.
 */
export function Eyebrow({ children, className, tone = 'default', as: Tag = 'span' }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-3.5 font-condensed text-eyebrow font-semibold uppercase',
        tone === 'light' ? 'text-yellow' : 'text-ink',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-[2px] w-7 shrink-0',
          tone === 'light' ? 'bg-yellow' : 'bg-yellow-deep',
        )}
      />
      {children}
    </Tag>
  )
}

interface LeadProps {
  children: ReactNode
  className?: string
  tone?: 'default' | 'light'
}

/** Parágrafo de apoio, um degrau acima do corpo. */
export function Lead({ children, className, tone = 'default' }: LeadProps) {
  return (
    <p
      className={cn(
        'max-w-prose text-lead',
        tone === 'light' ? 'text-canvas/80' : 'text-muted',
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * Ênfase inline dentro de um título em fundo claro.
 *
 * O amarelo não pode ser a cor do texto (ver `Eyebrow`), então entra **atrás**
 * dele: marcação de caneta na base da linha, com o texto seguindo grafite. É o
 * único lugar em que o amarelo toca tipografia em superfície clara.
 */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="mark-yellow not-italic text-ink">{children}</em>
}
