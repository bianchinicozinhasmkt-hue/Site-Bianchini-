import type { Config } from 'tailwindcss'
import { theme } from './src/styles/theme'

type ThemeExtension = NonNullable<Config['theme']> extends { extend?: infer Extension }
  ? Extension
  : never

/**
 * Design system Bianchini — Tailwind CSS v3.
 * A direção normativa ativa está em DIRECAO_MESTRA_SITE_BIANCHINI.md.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: theme as unknown as ThemeExtension,
  },
  plugins: [],
}

export default config
