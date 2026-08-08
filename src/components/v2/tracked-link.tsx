'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

/**
 * Link que registra a intenção antes de navegar.
 *
 * Existe para manter o hero como Server Component: só este envoltório vira
 * client, e o conteúdo continua sendo renderizado no servidor e passado como
 * `children`. Assim a primeira dobra é pintada sem depender de hidratação —
 * o que importa para tráfego pago, em que a maior parte do custo já foi paga
 * antes de a página aparecer.
 *
 * O payload carrega só o caminho escolhido. Nenhum dado pessoal — a própria
 * `trackEvent` filtra chaves conhecidas, mas a responsabilidade é de quem chama.
 */
export function TrackedLink({
  href,
  event,
  className,
  children,
  ariaLabel,
}: {
  href: string
  event: AnalyticsEvent
  className?: string
  children: ReactNode
  ariaLabel?: string
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackEvent(event, { origem: 'hero' })}
    >
      {children}
    </Link>
  )
}
