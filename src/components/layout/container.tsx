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
 * A casca horizontal do site — `docs/v2/direcao-visual/01-CONSTITUICAO-VISUAL.md`
 * §3.1, delta **G-1**.
 *
 * O componente não desenha nada: ele aplica `.container-shell` (globals.css),
 * que é a **única** implementação de `width: min(teto, 100% − 2 × gutter)` do
 * projeto. Trocar de teto é trocar `--container-max`, e nada mais.
 *
 * **Não existe recuo interno.** O `px-5 md:px-8 lg:px-10` que vivia aqui era um
 * gutter aplicado como `padding` dentro de uma casca com `max-width` — e um
 * gutter-padding nunca deixa de morder: em vez de sumir quando o teto assume,
 * ele passa a ser descontado da largura de conteúdo, prendendo o conteúdo em
 * 1320px em qualquer janela ≥1400. Como margem (via `min()` na largura) ele é
 * piso enquanto há aperto e desaparece quando deixa de haver — que é a
 * definição de gutter. Ver o bloco de layout em `globals.css`.
 *
 * Consequência: **a aresta interna da casca é a guia de conteúdo**, sem soma
 * nenhuma. Quem precisar rompê-la por dentro usa `calc(-1 * var(--guia))` —
 * nunca um número escrito à mão.
 */
export function Container({ children, className, as: Tag = 'div', size = 'default' }: ContainerProps) {
  /*
    Cada tamanho é só um teto diferente para a mesma casca. `narrow` mantém os
    48rem (`max-w-3xl`) que o componente já entregava.
  */
  const widths = {
    default: '',
    narrow: '[--container-max:48rem]',
    wide: '[--container-max:var(--container-wide)]',
  } as const

  return (
    <Tag className={cn('container-shell', widths[size], className)}>{children}</Tag>
  )
}
