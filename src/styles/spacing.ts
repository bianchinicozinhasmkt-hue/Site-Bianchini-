/**
 * Ritmo vertical de seção.
 *
 * A altura do cabeçalho não vive aqui — é responsiva por `clamp()` no
 * custom property `--header-height` (`globals.css`), incompatível com um
 * valor Tailwind estático único.
 */
export const spacing = {
  section: '5rem',
  sectionLg: '7.5rem',
} as const
