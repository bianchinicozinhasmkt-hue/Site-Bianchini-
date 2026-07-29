import type { Config } from 'tailwindcss'

/**
 * Design system Bianchini — Tailwind CSS v3.
 * Tokens espelham BRAND_DIRECTION.md (paleta, tipografia, grid, raios).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2840',
          light: '#243050',
          dark: '#121C2E',
        },
        carmim: {
          DEFAULT: '#8C1A2E',
          light: '#A82035',
        },
        bronze: {
          DEFAULT: '#9A7B4F',
          light: '#B8965F',
        },
        paper: '#FAF9F6',
        sand: '#F2F0EB',
        hairline: '#E4E1DA',
        ink: '#3D3B37',
        muted: '#A8A49C',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em' }],
        micro: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        body: ['1.0625rem', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        'display-1': ['clamp(2.625rem, 5.5vw, 5.125rem)', { lineHeight: '1', letterSpacing: '-0.015em' }],
        'display-2': ['clamp(2.125rem, 4.5vw, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.012em' }],
        'display-3': ['clamp(1.75rem, 3.5vw, 2.875rem)', { lineHeight: '1.06', letterSpacing: '-0.01em' }],
        'display-4': ['clamp(1.375rem, 2.4vw, 1.875rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        container: '1340px',
        prose: '68ch',
      },
      spacing: {
        section: '5.5rem',
        'section-lg': '7.5rem',
      },
      borderRadius: {
        DEFAULT: '2px',
        card: '3px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(26, 40, 64, 0.05)',
        'card-hover': '0 14px 40px rgba(26, 40, 64, 0.11)',
        cta: '0 10px 30px rgba(140, 26, 46, 0.32)',
        nav: '0 1px 0 rgba(228, 225, 218, 1), 0 6px 24px rgba(26, 40, 64, 0.06)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        marquee: 'marquee 42s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
