'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { mainNav } from '@/data/navigation'
import { Container } from './container'
import { MobileMenu } from './mobile-menu'
import { Logo } from '@/components/ui/logo'
import { LinkButton } from '@/components/ui/button'
import { whatsappUrl } from '@/lib/whatsapp'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b bg-white/95 backdrop-blur transition-shadow duration-300',
        scrolled ? 'border-hairline shadow-nav' : 'border-transparent',
      )}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <Logo priority className="h-10 sm:h-11 lg:h-14" />

        <nav aria-label="Menu principal" className="hidden items-center gap-7 lg:flex xl:gap-9">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LinkButton
            href={whatsappUrl('diagnostico')}
            variant="navy"
            className="hidden sm:inline-flex"
            withArrow
          >
            Diagnóstico
          </LinkButton>
          <MobileMenu items={mainNav} />
        </div>
      </Container>
    </header>
  )
}
