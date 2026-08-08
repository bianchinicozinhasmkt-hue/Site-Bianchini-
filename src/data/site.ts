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
  /*
    A frase terminava em "18 anos e mais de 3.000 projetos entregues".

    Isto não é texto interno: `site.description` alimenta a `<meta name=
    "description">`, o Open Graph, o Twitter card e o JSON-LD — ou seja, o
    número aparecia no snippet de busca e na prévia de compartilhamento de toda
    rota que não define descrição própria, inclusive a Home. Como a quantidade
    de projetos continua **não confirmada** pelo comercial (divergência entre
    "1.000" e "3.000" registrada logo abaixo, em `heroMetrics`, e listada em
    `MASTER_BIANCHINI.md` §20), publicá-la assim contraria DEC-006.

    "18 anos" permanece: é dado confirmado. Nenhum número substituto entrou no
    lugar do que saiu.
  */
  description:
    'Diagnosticamos, estruturamos e transformamos operações de food service. Cozinhas industriais completas, arquitetura e fluxo, especificação de equipamentos, implantação e consultoria operacional. 18 anos de atuação.',
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
  /**
   * ============================================================
   * TELEFONE — FONTE ÚNICA, PENDENTE DE CONFIRMAÇÃO COMERCIAL
   * ============================================================
   *
   * **Divergência aberta, não resolvida por decisão técnica.** Há dois números
   * documentados e nenhum confirmado pelo comercial (`CLAUDE.md`, "Regras de
   * conteúdo"; `docs/v1-release/04-pendencias-externas.md`):
   *
   *   +55 21 99518-1918 .... o que está em uso aqui, e portanto no ar
   *   +55 21 96469-0650 .... registrado em versão anterior do `CLAUDE.md`
   *
   * "Em uso" **não** é o mesmo que "confirmado". Nenhum agente deve escolher
   * entre os dois: a decisão é comercial e precisa vir por escrito.
   *
   * QUANDO O NÚMERO CORRETO CHEGAR, ALTERE **SÓ ESTES DOIS CAMPOS**
   * --------------------------------------------------------------
   * `phoneDisplay` (formatado, o que o visitante lê) e `phoneE164` (só
   * dígitos, com país e DDD, sem `+` — é o formato que o `wa.me` exige).
   * Mantenha os dois apontando para o mesmo número.
   *
   * Uma edição aqui basta para o site inteiro. Todo consumidor deriva daqui,
   * e não existe número escrito à mão em nenhum outro arquivo:
   *
   *   `lib/whatsapp.ts` ....... monta todo link `wa.me` (`whatsappUrl`,
   *                             `whatsappUrlWithText`) — usado por contato,
   *                             rodapé, menu mobile, botão flutuante, CTA
   *                             final da V1 e da V2, formulário e as duas
   *                             páginas de linhas de produtos
   *   `lib/schema.ts` ......... `telephone` do JSON-LD da organização
   *   `layout/footer.tsx` ..... texto exibido
   *   `layout/mobile-menu.tsx`  texto exibido + `tel:`
   *   `app/contato/page.tsx` .. texto exibido + `tel:`
   */
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
 * ============================================================
 * MÉTRICAS PÚBLICAS — SÓ O QUE ESTÁ CONFIRMADO
 * ============================================================
 *
 * Confirmados: **18 anos de atuação** e **abrangência Brasil** (`CLAUDE.md`,
 * "Dados confirmados como reais"). As demais entradas são contagens
 * verificáveis nos próprios dados do repositório — "8 linhas" sai de
 * `equipment-lines.ts`, não de estimativa.
 *
 * A CONTAGEM DE PROJETOS SAIU DAS DUAS LISTAS
 * -------------------------------------------
 * "3.000+ projetos entregues" **não é um número confirmado**: há divergência
 * registrada entre "1.000" e "3.000" em material fora do código, e o comercial
 * nunca validou o valor final (`docs/v1-release/04-pendencias-externas.md`
 * item 5). Enquanto isso não voltar por escrito, ele não pode ser afirmado em
 * rota pública — número de entrega é exatamente o tipo de dado que DEC-006
 * proíbe apresentar como fato sem fonte verificável.
 *
 * A remoção é da **afirmação**, não do registro: o valor histórico continua
 * documentado aqui e nos documentos de pendência, para que a reintrodução seja
 * uma decisão consciente e não uma redescoberta.
 *
 * PARA RELIGAR, quando o comercial confirmar o número: acrescente **uma**
 * entrada em cada array abaixo, com o valor confirmado. Nenhum componente
 * precisa mudar — todos iteram sobre estas listas, e `homeHeroMetrics`
 * (`src/data/v2/home.ts`) filtra por rótulo, então revise aquele filtro junto.
 */
export const heroMetrics: Metric[] = [
  { value: '18', label: 'anos de atuação' },
  { value: 'Brasil', label: 'abrangência de atendimento' },
]

export const scopeMetrics: Metric[] = [
  { value: '18 anos', label: 'Atuação dentro de operações de alimentação' },
  /*
    Substituição qualitativa, não um número novo: a grade de `/sobre` é
    `sm:grid-cols-3` e ficaria com um vão se a lista caísse para duas
    entradas. O texto repete a cobertura já confirmada em `contact.coverage`
    — nenhuma afirmação nova entra aqui.
  */
  { value: 'Brasil', label: 'Abrangência de atendimento' },
  { value: '8 linhas', label: 'Equipamentos especificados dentro do projeto' },
]
