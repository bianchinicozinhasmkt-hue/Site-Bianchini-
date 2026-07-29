import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from './icon'

type Variant = 'primary' | 'navy' | 'outline' | 'outline-light'
type Size = 'md' | 'lg'

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded text-micro font-semibold uppercase tracking-[0.06em] transition-all duration-200 ease-brand disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-carmim text-white hover:-translate-y-0.5 hover:bg-carmim-light hover:shadow-cta',
  navy: 'bg-navy text-white hover:-translate-y-0.5 hover:bg-navy-light hover:shadow-card-hover',
  outline: 'border border-navy text-navy hover:bg-navy hover:text-white',
  'outline-light': 'border border-white/40 text-white hover:border-white hover:bg-white hover:text-navy',
}

const sizes: Record<Size, string> = {
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
}

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Adiciona a seta animada à direita do rótulo. */
  withArrow?: boolean
  children: ReactNode
  className?: string
}

type LinkButtonProps = CommonProps & {
  href: string
  /** Links externos recebem target/rel automaticamente. */
  external?: boolean
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>

/** Link com aparência de botão. Usa next/link para rotas internas. */
export function LinkButton({
  href,
  external,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className,
  children,
  ...props
}: LinkButtonProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  const classes = buttonClasses(variant, size, className)
  const content = (
    <>
      {children}
      {withArrow ? <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-1" /> : null}
    </>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  )
}

interface ArrowLinkProps {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}

/** Link de navegação textual com seta (padrão "link arrow" da marca). */
export function ArrowLink({ href, children, className, external }: ArrowLinkProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  const classes = cn(
    'group inline-flex items-center gap-2 text-micro font-semibold uppercase tracking-[0.08em] text-navy transition-colors hover:text-carmim',
    className,
  )
  const content = (
    <>
      {children}
      <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-1.5" />
    </>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
