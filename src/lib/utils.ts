import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * O design system define escalas próprias de tipografia (`text-display`,
 * `text-title-1`, `text-body`, `text-eyebrow`…). Sem declará-las, o
 * tailwind-merge as trata como cor de texto e as descarta ao encontrar um
 * `text-white` — o que apagava o tamanho dos títulos nas seções escuras.
 *
 * Ao criar uma escala nova em `src/styles/typography.ts`, registre-a aqui.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'title-1',
            'title-2',
            'title-3',
            'lead',
            'body',
            'body-sm',
            'caption',
            'eyebrow',
            'numeral',
          ],
        },
      ],
    },
  },
})

/** Junta classes condicionais resolvendo conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
