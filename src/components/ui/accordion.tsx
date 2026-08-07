'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/types'
import { PlusIcon } from './icons'

interface AccordionProps {
  items: FaqItem[]
  className?: string
  tone?: 'default' | 'light'
}

/**
 * Accordion acessível com `button` + `aria-expanded`/`aria-controls`.
 * O conteúdo é montado no DOM e apenas ocultado por `hidden`, para que a
 * busca do navegador e os leitores de tela encontrem o texto.
 */
export function Accordion({ items, className, tone = 'default' }: AccordionProps) {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const open = openIndex === index
        const buttonId = `${baseId}-trigger-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <div
            key={item.question}
            className={cn('border-t last:border-b', tone === 'light' ? 'border-white/15' : 'border-line')}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className={cn(
                  'flex w-full items-start justify-between gap-6 py-5 text-left font-sans text-body font-semibold transition-colors duration-200 lg:py-6',
                  tone === 'light' ? 'text-canvas hover:text-canvas/70' : 'text-ink hover:text-ink',
                )}
              >
                {item.question}
                <PlusIcon
                  size={20}
                  className={cn(
                    'mt-1 shrink-0 transition-transform duration-300 ease-smooth',
                    open && 'rotate-45',
                    tone === 'light' ? 'text-yellow' : 'text-ink',
                  )}
                />
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
              <p
                className={cn(
                  'max-w-prose pb-6 pr-10 text-body-sm',
                  tone === 'light' ? 'text-canvas/75' : 'text-muted',
                )}
              >
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
