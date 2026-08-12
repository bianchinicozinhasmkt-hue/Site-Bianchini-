import { animations } from './animations'
import { colors } from './colors'
import { radius } from './radius'
import { shadows } from './shadows'
import { spacing } from './spacing'
import { typography } from './typography'

/** Fonte única dos valores semânticos usados por Tailwind. */
export const theme = {
  colors,
  ...typography,
  /*
    ---------- R0-A (2026-08-12) — os tetos da casca saíram daqui ----------

    `container` (1400px) e `wide` (1520px) eram consumidos como `max-w-*` pelo
    `Container` e por quatro wrappers manuais. Desde o delta **G-1** a casca é
    `width: min(--container-max, 100% − 2 × --gutter)` — um `max-width` não
    serve mais, porque era exatamente ele, somado a um `padding` interno, que
    prendia o conteúdo em 1320px em qualquer janela ≥1400. Os dois tetos viraram
    custom properties em `globals.css`, que é onde o sistema horizontal mora
    inteiro. **Não reintroduzir `max-w-container` / `max-w-wide`.**

    `prose` fica: é medida de leitura de parágrafo, não casca de página.
  */
  maxWidth: { prose: '68ch' },
  spacing: { section: spacing.section, 'section-lg': spacing.sectionLg },
  borderRadius: radius,
  boxShadow: {
    card: shadows.card,
    'card-hover': shadows.cardHover,
    nav: shadows.nav,
    panel: shadows.panel,
    cta: shadows.cta,
    'cta-hover': shadows.ctaHover,
  },
  transitionTimingFunction: animations.easing,
  keyframes: animations.keyframes,
  animation: animations.animation,
} as const
