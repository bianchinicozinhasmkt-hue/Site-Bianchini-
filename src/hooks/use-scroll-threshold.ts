'use client'

import { useEffect, useState } from 'react'

/** Informa se a página ultrapassou uma distância vertical determinada. */
export function useScrollThreshold(threshold: number) {
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const onScroll = () => setPassed(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return passed
}
