import type { Metric } from '@/types'

/**
 * Dados institucionais. Todo conteúdo aqui vem do site anterior da Bianchini
 * ou de BRAND_DIRECTION.md — nada é inventado.
 */
export const site = {
  name: 'Bianchini Cozinhas',
  brand: 'Bianchini Kitchen Pro',
  holding: 'Bianchini Holding',
  tagline: 'Projeto, implantação e consultoria de cozinhas profissionais',
  title: 'Bianchini Cozinhas — Projeto, Implantação e Consultoria de Cozinhas Profissionais',
  shortTitle: 'Bianchini Cozinhas',
  description:
    'Diagnóstico operacional, projeto executivo, especificação de equipamentos, implantação e acompanhamento de cozinhas profissionais. 18 anos e mais de 3.000 projetos entregues em hospitais, hotéis, restaurantes e operações institucionais.',
  keywords: [
    'projeto de cozinha profissional',
    'projeto de cozinha industrial',
    'implantação de cozinha industrial',
    'consultoria em food service',
    'engenharia de fluxo operacional',
    'equipamentos para cozinha profissional',
    'RDC 216',
    'cozinha hospitalar',
  ],
  locale: 'pt-BR',
  /**
   * Domínio ainda não confirmado para publicação. Definir NEXT_PUBLIC_SITE_URL
   * no ambiente de deploy — metadataBase, sitemap e robots leem essa variável.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const

export const contact = {
  /** Número real do site anterior. Não alterar sem confirmação comercial. */
  phoneDisplay: '+55 21 96469-0650',
  phoneE164: '5521964690650',
  email: 'comercial@bianchinicozinhas.com.br',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'Brasil',
  locationLabel: 'Rio de Janeiro · RJ · Brasil',
  coverage: 'Atendimento em todo o Brasil',
} as const

/**
 * Números confirmados como reais no projeto (CLAUDE.md e site anterior):
 * 18 anos de experiência e mais de 3.000 projetos entregues.
 */
export const heroMetrics: Metric[] = [
  { value: '18 anos', label: 'de atuação em cozinhas profissionais' },
  { value: '3.000+', label: 'projetos entregues' },
  { value: '6 segmentos', label: 'do fine dining ao offshore' },
]

export const scopeMetrics: Metric[] = [
  { value: '18 anos', label: 'Atuação dentro de operações de alimentação' },
  { value: '3.000+', label: 'Projetos entregues em todo o Brasil' },
  { value: '8 linhas', label: 'Equipamentos especificados dentro do projeto' },
]

export const scopeSteps = [
  'Diagnóstico',
  'Projeto executivo',
  'Especificação',
  'Fabricação',
  'Implantação',
  'Operação assistida',
] as const
