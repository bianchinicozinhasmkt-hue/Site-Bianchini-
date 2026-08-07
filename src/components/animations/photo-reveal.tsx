'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PhotoRevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /**
   * `up` (padrão) revela de baixo para cima — fotografia.
   * `right` revela da esquerda para a direita — a linha do método.
   */
  mask?: 'up' | 'right'
}

/**
 * Revela uma fotografia pela própria caixa: a máscara sobe da base em 560ms
 * (ver `.photo-mask` em globals.css), uma única vez. Na variante `right` o
 * mesmo recurso desenha a linha do método, em 650ms.
 *
 * É o recurso de entrada reservado a **imagem grande** e à linha de processo —
 * texto continua usando `Reveal`, com deslocamento de 16px. A máscara não
 * substitui composição: só existe onde a fotografia já é o elemento dominante.
 *
 * **Por que o observador olha o elemento-pai e não o próprio elemento.**
 * O Chromium leva o `clip-path` do alvo em conta ao calcular a interseção: um
 * elemento recortado em `inset(0 0 100% 0)` tem `intersectionRatio` 0 mesmo
 * inteiro dentro da janela. Observar a si mesmo, portanto, nunca dispara — a
 * fotografia ficaria permanentemente invisível. O pai (a `figure` ou o item da
 * lista) não é recortado e entra na janela junto.
 *
 * Como o `.reveal`, o CSS de ocultação depende da flag `data-js` gravada no
 * `layout.tsx`: se o script falhar, a fotografia aparece inteira.
 */
export function PhotoReveal({ children, className, style, mask = 'up' }: PhotoRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const target = node.parentElement ?? node

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        mask === 'right' ? 'line-mask' : 'photo-mask',
        visible && 'is-visible',
        className,
      )}
    >
      {children}
    </div>
  )
}
