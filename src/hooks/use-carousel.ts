'use client'

import { useCallback, useEffect, useState } from 'react'

interface UseCarouselOptions {
  interval: number
  itemCount: number
  /** Autoplay para enquanto `true` — hover, foco ou interação recente. */
  paused?: boolean
}

/**
 * Estado de um carrossel com rotação automática, pausa externa e respeito a
 * `prefers-reduced-motion`. `activeIndex` reinicia a contagem do intervalo
 * sempre que muda (autoplay ou manual) — é isso que evita o "salto duplo":
 * sem isso, um clique manual no meio do intervalo deixava o próximo avanço
 * automático disparar cedo demais, pouco depois da troca manual.
 *
 * ============================================================
 * ONDE A ROTAÇÃO AUTOMÁTICA EXISTE (2026-08-05, V1.1)
 * ============================================================
 *
 * Ela deixou de ser incondicional. Passa a valer só onde há **ponteiro fino e
 * hover** e o visitante **não** pediu movimento reduzido:
 *
 *   desktop com mouse .... rotação disponível, com pausa explícita e persistente
 *   toque (telefone,
 *   tablet, notebook
 *   em modo tablet) ...... **desligada por padrão** — a troca acontece só por
 *                          toque nos pilares, setas, swipe ou teclado
 *   reduced motion ....... desligada, em qualquer aparelho
 *
 * O motivo do corte no toque é medido, não estético: nessas larguras o seletor
 * fica fora da primeira dobra, então o conteúdo trocava sozinho sem que
 * houvesse na tela qualquer indicação de causa. E não há `hover` para pausar.
 */
export function useCarousel({ interval, itemCount, paused = false }: UseCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  /**
   * Aparelho de toque — sem ponteiro fino e sem hover.
   *
   * Decidido por **capacidade do aparelho**, não por largura de viewport: uma
   * janela de desktop estreita continua tendo mouse, e um tablet largo continua
   * não tendo. É a diferença entre desligar a rotação onde ela atrapalha e
   * desligá-la onde ela apenas parece pequena.
   *
   * Nasce `false` no servidor e no primeiro quadro do cliente, e só então o
   * efeito corrige — nenhuma marcação depende disso, então não há divergência
   * de hidratação; o que muda é apenas se o temporizador chega a ser criado.
   */
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)')
    setReducedMotion(motion.matches)
    setCoarsePointer(touch.matches)

    const onMotion = () => setReducedMotion(motion.matches)
    const onTouch = () => setCoarsePointer(touch.matches)
    motion.addEventListener('change', onMotion)
    touch.addEventListener('change', onTouch)
    return () => {
      motion.removeEventListener('change', onMotion)
      touch.removeEventListener('change', onTouch)
    }
  }, [])

  /**
   * A rotação automática só é oferecida onde ela pode ser controlada com o
   * ponteiro e onde o visitante não pediu menos movimento. Nos demais casos ela
   * não é "pausada" — ela **não existe**, e por isso nenhum controle de pausa
   * deve ser mostrado (ver `hero-section.tsx`).
   */
  const autoplayAvailable = !reducedMotion && !coarsePointer

  useEffect(() => {
    if (paused || !autoplayAvailable) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount)
    }, interval)

    return () => window.clearInterval(timer)
  }, [interval, itemCount, paused, autoplayAvailable, activeIndex])

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % itemCount) + itemCount) % itemCount),
    [itemCount],
  )
  const next = useCallback(() => setActiveIndex((current) => (current + 1) % itemCount), [itemCount])
  const prev = useCallback(
    () => setActiveIndex((current) => (current - 1 + itemCount) % itemCount),
    [itemCount],
  )

  return { activeIndex, goTo, next, prev, reducedMotion, autoplayAvailable }
}
