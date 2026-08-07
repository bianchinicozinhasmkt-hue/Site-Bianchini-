import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** `narrow` para blocos de leitura; `wide` para mosaicos e faixas. */
  size?: 'default' | 'narrow' | 'wide'
}

/**
 * Grid container — GUIA_COMPLETO_DO_SITE_BIANCHINI.md §7.3.
 * Máximo de 1280px, margem mobile de 20px e gutter desktop de 32–40px.
 */
export function Container({ children, className, as: Tag = 'div', size = 'default' }: ContainerProps) {
  const widths = {
    default: 'max-w-container',
    narrow: 'max-w-3xl',
    wide: 'max-w-wide',
  } as const

  return (
    <Tag className={cn('mx-auto w-full px-5 md:px-8 lg:px-10', widths[size], className)}>
      {children}
    </Tag>
  )
}
