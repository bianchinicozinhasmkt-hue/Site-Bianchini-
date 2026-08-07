/**
 * Motion — vocabulário único de curvas e tempos.
 *
 * Três curvas, e só três. Uma interação que precise de uma quarta provavelmente
 * está tentando chamar atenção em vez de responder ao usuário.
 *
 *   `precise`  cubic-bezier(0.4, 0, 0.2, 1)     resposta e microinteração
 *   `smooth`   cubic-bezier(0.22, 1, 0.36, 1)   entrada de conteúdo, troca de estado
 *   `premium`  cubic-bezier(0.16, 1, 0.3, 1)    revelação editorial e composição do hero
 *
 * FAIXAS DE DURAÇÃO
 *
 *   120–180ms  resposta imediata (pressão, foco)
 *   180–280ms  hover e microinteração
 *   280–450ms  troca de conteúdo (abas, capítulos)
 *   450–750ms  revelação editorial (máscara de foto, linha do método)
 *   até 1100ms composição de entrada do hero, uma única vez
 *
 * Nenhuma animação é requisito para ler ou operar a página, e nenhuma roda em
 * laço. Com `prefers-reduced-motion` tudo resolve para o estado final.
 */
export const animations = {
  easing: {
    /** Interações curtas: hover, foco, pressão. */
    precise: 'cubic-bezier(0.4, 0, 0.2, 1)',
    /** Entrada de conteúdo e troca de estado. */
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    /** Revelação editorial — desaceleração longa, sem elasticidade. */
    premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  keyframes: {
    'fade-up': {
      from: { opacity: '0', transform: 'translateY(18px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
    },
    marquee: {
      from: { transform: 'translateX(0)' },
      to: { transform: 'translateX(-50%)' },
    },
  },
  animation: {
    'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
    marquee: 'marquee 48s linear infinite',
  },
} as const
