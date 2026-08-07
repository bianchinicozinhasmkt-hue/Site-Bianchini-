'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon } from '@/components/ui/icons'
import { LinkButton } from '@/components/ui/actions/button'
import { whatsappUrl } from '@/lib/whatsapp'
import { contact } from '@/data/site'

interface MobileMenuProps {
  items: NavItem[]
}

/** Seletor de elementos focáveis dentro do painel, para a retenção de foco abaixo. */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Painel de navegação mobile. Fecha por clique no fundo, Escape e navegação;
 * o foco entra no painel ao abrir, fica retido nele (`Tab`/`Shift+Tab` não
 * escapam para o conteúdo por trás do overlay) e volta ao gatilho ao fechar
 * com Escape.
 */
export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
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

  useEffect(() => {
    document.documentElement.classList.toggle('mobile-menu-open', open)
    return () => document.documentElement.classList.remove('mobile-menu-open')
  }, [open])

  const close = () => setOpen(false)

  /**
   * O header usa `backdrop-blur`, o que o torna o bloco de contenção de
   * qualquer descendente `fixed`. Por isso o overlay e o painel vão para o
   * body via portal — assim se posicionam pela viewport.
   */
  const overlay = (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          'fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-ink/40 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-height)] z-40 max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-b border-line bg-canvas lg:hidden"
      >
        <nav aria-label="Menu principal (mobile)" className="flex flex-col px-5 pt-2">
          {items.map((item) => (
            <div key={item.href} className="border-b border-line last:border-0">
              <Link href={item.href} onClick={close} className="block py-4 text-body font-semibold text-ink">
                {item.label}
              </Link>

              {item.children?.length ? (
                <ul className="-mt-1 flex flex-col pb-4 pl-1">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={close}
                        className="block border-l border-line py-2.5 pl-4 text-body-sm text-muted transition-colors hover:border-yellow hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-3 px-5 py-6">
          {/*
            V2: a ação primária do menu é orçamento de equipamentos, não
            diagnóstico — mesma hierarquia do cabeçalho e da home
            (`docs/v2/DECISIONS.md`, DEC-001). O WhatsApp acompanha com o tópico
            correspondente, para o atendimento saber de onde veio o contato.
          */}
          <LinkButton
            href="/contato?intencao=equipamentos"
            onClick={close}
            className="w-full rounded-[3px]"
            withArrow
          >
            Solicitar orçamento
          </LinkButton>
          <LinkButton
            href={whatsappUrl('equipamentos')}
            variant="whatsapp"
            className="w-full rounded-[3px]"
          >
            Conversar pelo WhatsApp
          </LinkButton>

          {/*
            Telefone e Instagram são **itens de contato**, não notas de rodapé
            do painel: desde que o Instagram saiu do cabeçalho (2026-08-04),
            este é o único acesso à rede dentro da moldura de navegação, então
            precisa de rótulo, alvo de toque de 44px e uma linha separando-o
            dos CTAs — não um glifo de 16px encostado na borda.
          */}
          <div className="mt-3 flex flex-col border-t border-line pt-2">
            <a
              href={`tel:+${contact.phoneE164}`}
              className="-mx-2 inline-flex min-h-[2.75rem] items-center gap-3 rounded-[3px] px-2 text-body-sm text-muted transition-colors hover:bg-canvas-deep hover:text-ink"
            >
              <PhoneIcon size={18} className="shrink-0 text-ink" />
              {contact.phoneDisplay}
            </a>

            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 inline-flex min-h-[2.75rem] items-center gap-3 rounded-[3px] px-2 text-body-sm text-muted transition-colors hover:bg-canvas-deep hover:text-ink"
            >
              <InstagramIcon size={18} className="shrink-0" />
              Instagram
              <span className="sr-only"> da Bianchini Cozinhas (abre em nova aba)</span>
            </a>
          </div>
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-white/35 text-white transition-colors hover:border-white hover:bg-white/10 lg:hidden"
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </>
  )
}
