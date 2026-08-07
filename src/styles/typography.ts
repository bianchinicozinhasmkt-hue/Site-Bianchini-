/**
 * Sistema tipográfico — duas famílias, com papéis separados.
 *
 * **`sans` — Manrope.** Leitura e interface: H1…H4, parágrafos, navegação,
 * campos de formulário, legendas. É a grotesca contemporânea do mockup e é
 * contra ela que toda a geometria da primeira dobra foi medida (razão cap/em
 * 0,740). Não trocar sem remedir o hero.
 *
 * **`condensed` — Oswald.** A família de títulos do site oficial publicado
 * (kit Elementor: Oswald 600/800, caixa alta) e o traço mais reconhecível da
 * marca. Aqui ela fica restrita aos **elementos comerciais e técnicos curtos**:
 * rótulos de botão, etiquetas de seção, numerais de métrica, índices e cotas.
 * **Nunca em texto corrido** — condensada em parágrafo custa legibilidade.
 *
 * O site oficial usa Raleway no corpo. Não foi adotada: o corpo do mockup é uma
 * grotesca geométrica, não uma humanista de eixo alto, e trocar a família de
 * leitura invalidaria as medidas do hero. Ambas são SIL Open Font License e
 * chegam por `next/font/google`, com auto-hospedagem e sem requisição externa.
 *
 * Medição no mockup (1586 px de largura): a altura de maiúscula do título é de
 * 52 px, o que corresponde a ~72 px de corpo, com entrelinha de 72 px (1.0).
 * A escala `display` reproduz isso e desce por `clamp()`.
 *
 * Ao criar uma escala nova, registre-a também no grupo `font-size` do
 * tailwind-merge em `src/lib/utils.ts`.
 */
export const typography = {
  fontFamily: {
    sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] as string[],
    condensed: [
      'var(--font-condensed)',
      'Oswald',
      'Roboto Condensed',
      'Arial Narrow',
      'sans-serif',
    ] as string[],
  },
  fontSize: {
    /**
     * Título do hero. Calibrado contra o mockup: a altura de maiúscula medida
     * é de 52 px e a razão cap/em do Manrope é 0,740 — logo, 70 px de corpo
     * (4,41vw em 1586 px). A entrelinha de 72 px do mockup equivale a 1,03.
     * O tracking de −0,045em aproxima a largura da linha mais longa
     * ("começa antes do": 517 px no mockup, 531 px aqui).
     */
    display: ['clamp(2.375rem, 4.41vw, 4.375rem)', { lineHeight: '1.03', letterSpacing: '-0.045em' }],
    'title-1': ['clamp(1.875rem, 2.6vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.018em' }],
    'title-2': ['clamp(1.5rem, 1.7vw, 1.875rem)', { lineHeight: '1.18', letterSpacing: '-0.014em' }],
    'title-3': ['clamp(1.125rem, 1.1vw, 1.3125rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
    lead: ['clamp(1rem, 1.05vw, 1.125rem)', { lineHeight: '1.65', letterSpacing: '0' }],
    body: ['1rem', { lineHeight: '1.65', letterSpacing: '0' }],
    'body-sm': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '0' }],
    caption: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
    /**
     * Etiqueta técnica em caixa alta — eyebrow, régua de etapas, cota.
     * Desenhada para Oswald: a condensada já é estreita, então o tracking cai
     * de 0,14em para 0,11em; com o valor antigo a palavra se desmanchava.
     */
    eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.11em' }],
    /** Numerais de destaque — sempre em `font-condensed`. */
    numeral: ['clamp(2rem, 2.4vw, 2.75rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
  },
} as const
