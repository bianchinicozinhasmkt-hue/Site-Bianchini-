'use client'

import { useRevealOnScroll } from '@/hooks/use-reveal-on-scroll'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Direção da entrada. As quatro variantes estão descritas em globals.css, na
 * seção "REVELAÇÃO NA ROLAGEM" — elas compartilham curva e faixa de duração, e
 * o que muda é o que o movimento explica:
 *
 *   up      sobe 16px .............. bloco de texto (padrão)
 *   side    entra 14px da esquerda . coluna lateral, índice, item de fluxo
 *   settle  assenta de 0.985 ....... documento, figura, retrato
 *   line    cresce da esquerda ..... régua, divisor, barra de progresso
 *
 * A existência das variantes é o ponto: um `fade-up` idêntico do topo ao
 * rodapé é o que faz a página parecer template. Escolha pelo que o elemento é,
 * não por variar — e mantenha a mesma variante dentro de uma mesma lista.
 */
type RevealVariant = 'up' | 'side' | 'settle' | 'line'

interface RevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** Atraso em ms para encadear elementos de uma mesma linha. */
  delay?: number
  variant?: RevealVariant
}

/**
 * Anima a entrada do elemento ao aparecer na viewport.
 *
 * O CSS de ocultação só vale quando o JS carregou (ver globals.css), então
 * nada fica invisível se o script falhar. Com `prefers-reduced-motion` o
 * elemento já nasce no estado final.
 */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
}: RevealProps) {
  const { ref, visible } = useRevealOnScroll()

  return (
    <Tag
      ref={ref}
      data-reveal={variant === 'up' ? undefined : variant}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
