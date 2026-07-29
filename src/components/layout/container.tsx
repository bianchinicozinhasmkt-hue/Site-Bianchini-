import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** Container estreito para blocos de leitura. */
  size?: 'default' | 'narrow'
}

/** Grid container do projeto: 1340px, 24px de padding no mobile e 56px no desktop. */
export function Container({ children, className, as: Tag = 'div', size = 'default' }: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-6 lg:px-14',
        size === 'default' ? 'max-w-container' : 'max-w-4xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
