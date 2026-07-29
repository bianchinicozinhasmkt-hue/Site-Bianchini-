'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'
import { CloseIcon, MenuIcon } from '@/components/ui/icon'
import { LinkButton } from '@/components/ui/button'
import { whatsappUrl } from '@/lib/whatsapp'

interface MobileMenuProps {
  items: NavItem[]
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  // Fecha com Escape e bloqueia o scroll do corpo enquanto o painel está aberto.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    // Move o foco para o primeiro link do painel.
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  /**
   * O header usa `backdrop-blur`, o que o torna o bloco de contenção de
   * qualquer descendente `fixed`. Por isso o overlay e o painel vão para o
   * body via portal — assim se posicionam pela viewport.
   */
  const overlay = (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          'fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-navy/55 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-height)] z-40 max-h-[calc(100vh-var(--header-height))] overflow-y-auto border-b border-hairline bg-white shadow-card-hover lg:hidden"
      >
        <nav aria-label="Menu principal (mobile)" className="flex flex-col px-6 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-hairline py-4 text-[0.9375rem] font-medium text-navy transition-colors last:border-0 hover:text-carmim"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-6">
          <LinkButton href={whatsappUrl('diagnostico')} className="w-full" withArrow>
            Solicitar diagnóstico
          </LinkButton>
        </div>
      </div>
    </>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        className="inline-flex h-11 w-11 items-center justify-center rounded border border-hairline text-navy transition-colors hover:border-navy lg:hidden"
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </>
  )
}
