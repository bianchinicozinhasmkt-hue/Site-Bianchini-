import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * O design system define escalas próprias de tipografia (`text-display-1`,
 * `text-body`, `text-eyebrow`…). Sem declará-las, o tailwind-merge as trata
 * como cor de texto e as descarta ao encontrar um `text-white` — o que apagava
 * o tamanho dos títulos nas seções escuras.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['eyebrow', 'micro', 'body', 'body-sm', 'display-1', 'display-2', 'display-3', 'display-4'],
        },
      ],
    },
  },
})

/** Junta classes condicionais resolvendo conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
