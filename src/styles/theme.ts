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
    Revisado em 2026-08-03: `container` era 1280px e, com o `px-10` (40px de
    cada lado) do `Container`, sobrava conteúdo de só 1200px em qualquer tela
    a partir de 1280px — em 1586px de viewport isso é 75,7% da largura, com
    vazios laterais grandes. Os novos valores mantêm exatamente o mesmo
    mecanismo (`w-full max-w-* mx-auto` + padding do `Container`), só com teto
    mais alto: em 1366/1440px o conteúdo passa a ocupar ~90–94% da viewport
    (o teto só "trava" de fato acima de ~1400/1520px), e o texto corrido
    continua limitado pelos `max-w-[Nch]` de cada parágrafo — não por este
    valor. Ajustar aqui, não em `Container` ou em wrappers individuais.
  */
  maxWidth: { container: '1400px', wide: '1520px', prose: '68ch' },
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
