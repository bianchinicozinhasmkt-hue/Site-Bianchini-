'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { WhatsappIcon } from '@/components/ui/icon'
import { whatsappUrl } from '@/lib/whatsapp'

/** Atalho flutuante de WhatsApp. Aparece depois da primeira dobra. */
export function WhatsappFloat() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={whatsappUrl('diagnostico')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com um especialista Bianchini pelo WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        'fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-carmim text-white shadow-cta transition-all duration-300 ease-brand hover:scale-105 hover:bg-carmim-light',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <WhatsappIcon size={26} />
    </a>
  )
}
