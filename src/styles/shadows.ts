/**
 * Sombras curtas e raras, sempre em grafite neutro.
 *
 * A sombra do CTA era tingida de bordô; com o amarelo o mesmo recurso produz
 * um halo mostarda sujo sob o botão. Passa a ser grafite de baixa opacidade —
 * o que se lê é elevação, não cor.
 */
export const shadows = {
  card: '0 1px 2px rgba(16, 16, 16, 0.05)',
  cardHover: '0 18px 40px -24px rgba(16, 16, 16, 0.35)',
  nav: '0 1px 0 rgba(220, 217, 212, 1)',
  panel: '0 24px 60px -30px rgba(10, 11, 12, 0.45)',
  /** Elevação de repouso do CTA primário. Curta, de propósito. */
  cta: '0 8px 18px -10px rgba(16, 16, 16, 0.45)',
  /** Elevação de hover do CTA primário — 2px acima, nada mais. */
  ctaHover: '0 12px 22px -10px rgba(16, 16, 16, 0.55)',
} as const
