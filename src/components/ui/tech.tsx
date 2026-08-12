import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Elementos técnicos propagados do hero para o resto do site.
 *
 * Os dois que sobraram existem no mockup aprovado: o traço curto antes do
 * rótulo e a régua sob o bloco de métricas. Nada aqui é ornamento novo.
 *
 * `DiagonalPhoto` saiu na terceira passagem visual. A aresta diagonal ficou
 * restrita a dois momentos — a primeira dobra e o CTA final, que a monta com
 * as classes `.diag-panel` / `.diag-keyline` diretamente. Acima disso ela
 * deixava de ser assinatura e virava padrão de fundo.
 *
 * Use estes elementos com parcimônia: a régua não precisa separar toda lista e
 * o rótulo técnico não precisa preceder toda figura.
 */

/**
 * Rótulo técnico: traço + texto curto em condensada, caixa alta. É a legenda
 * da fotografia do hero, reutilizada para marcar figuras, faixas e índices.
 *
 * O traço é amarelo nos dois tons de fundo; o texto, não. Sobre superfície
 * clara o amarelo não alcança AA como texto — ver a regra em
 * `src/styles/colors.ts`.
 */
export function TechLabel({
  children,
  tone = 'default',
  rule = true,
  className,
}: {
  children: ReactNode
  /** `light` em fundo escuro — o texto clareia e o traço fica amarelo pleno. */
  tone?: 'default' | 'light'
  /**
   * O traço amarelo. `true` em todo uso existente — a régua faz parte do rótulo
   * desde o mockup e **este parâmetro não é um estilo alternativo**.
   *
   * Ele existe para uma situação só: quando o orçamento de cor da seção estoura
   * (doc 01 §6.2, teto de três regiões amarelas) e este traço é o acento de
   * menor precedência presente — nem marca, nem ação, nem estado. Foi o caso do
   * `#fechamento` em R0-D, onde o rótulo veste a linha de atendimento, que é o
   * último item da hierarquia de leitura da seção. Desligar a régua por
   * preferência, com o orçamento cumprido, é regressão.
   */
  rule?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-condensed text-caption font-medium uppercase tracking-[0.08em]',
        rule && 'gap-3',
        tone === 'light' ? 'text-canvas/80' : 'text-muted',
        className,
      )}
    >
      {rule ? (
        <span
          aria-hidden="true"
          className={cn('h-[2px] w-6 shrink-0', tone === 'light' ? 'bg-yellow' : 'bg-yellow-deep')}
        />
      ) : null}
      {children}
    </span>
  )
}

/**
 * Régua com marcação. Separa blocos dentro de uma seção sem criar caixa e
 * repete a divisória do bloco de métricas do hero.
 */
export function TickRule({
  tone = 'default',
  className,
}: {
  tone?: 'default' | 'light'
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('tick-rule w-full', tone === 'light' ? 'text-white/20' : 'text-line', className)}
    />
  )
}

/**
 * Numeral de índice — os "01…06" das etapas. Em condensada, como todo numeral
 * do sistema. Grande o bastante para funcionar como elemento de composição,
 * não como marcador de lista.
 */
export function IndexNumeral({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: 'default' | 'light' | 'ghost'
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block font-condensed font-bold tabular-nums leading-none tracking-[-0.005em]',
        /*
          `opacity-*` em vez de `text-ink/12`: combinado com um `text-[Nrem]`
          arbitrário vindo de `className` (como em `pillars-section.tsx`), o
          tailwind-merge descartava o modificador de opacidade — `ink` não é
          uma cor padrão do Tailwind, e a fatia de cor com opacidade acabava
          nesse conflito. `opacity` é um classGroup próprio, sem ambiguidade.
        */
        tone === 'ghost' ? 'text-ink opacity-[0.08]' : tone === 'light' ? 'text-yellow' : 'text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
