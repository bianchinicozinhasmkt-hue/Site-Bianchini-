import type { Metric } from '@/types'

/**
 * Dados institucionais. Todo conteúdo aqui vem do site anterior da Bianchini
 * ou de GUIA_COMPLETO_DO_SITE_BIANCHINI.md — nada é inventado.
 */
export const site = {
  name: 'Bianchini Cozinhas',
  brand: 'Bianchini Kitchen Pro',
  holding: 'Bianchini Holding',
  tagline: 'Diagnóstico, projeto e implantação de operações de food service',
  title:
    'Bianchini — Diagnóstico, Projeto e Implantação de Cozinhas Industriais',
  shortTitle: 'Bianchini',
  description:
    'Diagnosticamos, estruturamos e transformamos operações de food service. Cozinhas industriais completas, arquitetura e fluxo, especificação de equipamentos, implantação e consultoria operacional. 18 anos e mais de 3.000 projetos entregues.',
  keywords: [
    'cozinha industrial',
    'projeto de cozinha industrial',
    'implantação de cozinha profissional',
    'consultoria para restaurantes',
    'diagnóstico operacional food service',
    'arquitetura de cozinha e salão',
    'equipamentos para cozinha profissional',
    'consultoria para fabricantes de cozinha',
  ],
  locale: 'pt-BR',
  /**
   * Domínio ainda não confirmado para publicação. Definir NEXT_PUBLIC_SITE_URL
   * no ambiente de deploy — metadataBase, sitemap e robots leem essa variável.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const

/*
  Sem a variável, `site.url` cai em `http://localhost:3000` e o build **passa
  em silêncio** — mas `sitemap.xml`, `robots.txt`, as canônicas e as imagens de
  Open Graph saem todas apontando para localhost. É o tipo de falha que só
  aparece depois de indexada.

  O aviso é deliberadamente **não fatal**: derrubar o build puniria um host que
  monte as variáveis só em runtime. Ele grava uma linha no log de deploy, que é
  onde alguém vai procurar. A verificação fica atrás de `typeof window` para
  não rodar no navegador, e de `NODE_ENV` para não poluir o `npm run dev`.
*/
if (
  typeof window === 'undefined' &&
  process.env.NODE_ENV === 'production' &&
  !process.env.NEXT_PUBLIC_SITE_URL
) {
  console.warn(
    '\n[bianchini] NEXT_PUBLIC_SITE_URL não definida — sitemap, robots, canonical e Open Graph ' +
      'vão apontar para http://localhost:3000. Defina o domínio real antes de publicar.\n',
  )
}

/**
 * Copy aprovada do hero, transcrita do mockup
 * `MOCKUP_HERO_APROVADO.png`. Não substituir.
 */
export const positioning = {
  eyebrow: 'Cozinhas industriais e food service',
  promise: 'Diagnosticamos, estruturamos e transformamos operações de food service.',
  support:
    'Da cozinha industrial e dos equipamentos aos processos, comercial e marketing: escolhas melhores para reduzir desperdícios, investir com inteligência e melhorar resultados.',
  essence: 'Entender primeiro. Escolher melhor. Investir com inteligência. Operar com mais resultado.',
} as const

/**
 * Quebras de linha do título, medidas no mockup: cinco linhas, com a linha
 * mais longa ("Diagnosticamos,") ocupando 507 px dos 1586 px de largura.
 * São quebras de composição — no mobile o título volta a fluir.
 */
export const heroTitleLines = [
  'Diagnosticamos,',
  'estruturamos e',
  'transformamos',
  'operações de',
  'food service',
] as const

/** Legenda no rodapé da fotografia do hero, conforme o mockup. */
export const heroPhotoCaption =
  'Operação entregue: projeto, especificação, fabricação e instalação'

export const contact = {
  /** Número atualizado em 2026-08-03. Não alterar sem confirmação comercial. */
  phoneDisplay: '+55 21 99518-1918',
  phoneE164: '5521995181918',
  email: 'comercial@bianchinicozinhas.com.br',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'Brasil',
  locationLabel: 'Rio de Janeiro · RJ · Brasil',
  coverage: 'Atendimento em todo o Brasil',
  /** Instagram institucional — cabeçalho, menu mobile e rodapé. */
  instagram: 'https://www.instagram.com/bianchinicozinhas/',
  /** Expectativa de retorno comunicada ao visitante. Ajustar se o SLA mudar. */
  responseTime: 'Retorno em até 1 dia útil',
  hours: 'Segunda a sexta, 8h às 18h',
} as const

/**
 * Números confirmados como reais no projeto (CLAUDE.md e site anterior):
 * 18 anos de experiência e mais de 3.000 projetos entregues. As demais
 * entradas são contagens verificáveis nos próprios dados do repositório.
 *
 * FONTE ÚNICA da métrica de projetos/cozinhas entregues: "3.000+", usada aqui
 * e em `scopeMetrics` abaixo — nenhum outro valor deve ser introduzido em
 * nenhuma outra seção sem passar por este arquivo. PENDENTE: confirmação
 * comercial definitiva do número exato (houve divergência apontada entre
 * "1.000" e "3.000" em material fora do código; o projeto usa "3.000+" em
 * todo lugar hoje, mas o valor final ainda não foi validado pelo comercial).
 */
export const heroMetrics: Metric[] = [
  { value: '18', label: 'anos de atuação' },
  { value: '3.000+', label: 'projetos entregues' },
  { value: 'Brasil', label: 'abrangência de atendimento' },
]

export const scopeMetrics: Metric[] = [
  { value: '18 anos', label: 'Atuação dentro de operações de alimentação' },
  { value: '3.000+', label: 'Projetos entregues em todo o Brasil' },
  { value: '8 linhas', label: 'Equipamentos especificados dentro do projeto' },
]
