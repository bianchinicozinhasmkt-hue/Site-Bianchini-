import type { ScopeLevel } from '@/types'

/**
 * Os cinco níveis de atuação da Bianchini — a leitura de "gestora integrada"
 * que a home precisa deixar explícita antes de detalhar caminhos de solução.
 *
 * Nada aqui é escopo novo: cada nível resume frentes que já constam do
 * diagnóstico (`src/data/diagnosis.ts`), do método (`methodSteps`), dos
 * diferenciais (`src/data/differentials.ts`) e dos caminhos de solução
 * (`src/data/solutions.ts`). A redação evita prometer entrega contratual
 * específica — descreve o que a empresa coordena, não um pacote fechado.
 *
 * `deliverables` existe para que o caráter técnico da página venha do que é
 * entregue, e não de linha, numeral ou grade decorativa: são as mesmas
 * entregas já descritas nas páginas de solução, reduzidas a três itens por
 * nível. `media` é material real do acervo, um por nível, sem repetição
 * dentro do painel. `cta` aponta sempre para uma rota que existe.
 *
 * O nível 05 existe para posicionar comercial e marketing como continuação do
 * plano operacional. Por isso vem por último e depende explicitamente dos
 * anteriores: sem oferta, capacidade e processo entendidos, não é o trabalho
 * de uma agência que resolve.
 */
export const scopeLevels: ScopeLevel[] = [
  {
    id: 'diagnostico',
    number: '01',
    short: 'Diagnóstico e estratégia',
    title: 'Diagnóstico e estratégia',
    description:
      'Leitura da operação e do negócio: espaço, fluxo, capacidade, custo e demanda. Termina em prioridades, não em orçamento.',
    deliverables: [
      'Visita técnica com a equipe em turno',
      'Leitura de espaço, fluxo, equipamentos, processo e demanda',
      'Devolutiva com a ordem recomendada de resolução',
    ],
    media: {
      src: '/images/projects/refrigeradores-verticais.jpg',
      alt: 'Refrigeradores verticais em aço inox e balcões refrigerados ao longo de uma praça de produção',
      caption:
        'Capacidade instalada contra volume real: uma das seis frentes lidas na visita técnica',
    },
    cta: { label: 'Solicitar diagnóstico', href: '/contato' },
  },
  {
    id: 'projeto',
    number: '02',
    short: 'Projeto e engenharia',
    title: 'Projeto, arquitetura e engenharia',
    description:
      'Layout, fluxo, plantas complementares e memorial — o desenho que instrui a obra e antecede qualquer compra.',
    deliverables: [
      'Layout técnico e fluxo de produção',
      'Plantas de elétrica, hidráulica, gás e esgoto',
      'Memorial descritivo e estudo 3D antes de fabricar',
    ],
    media: {
      src: '/images/projects/projeto-3d.jpg',
      alt: 'Modelo tridimensional de cozinha profissional com bancadas e equipamentos em inox',
      caption: 'Estudo 3D usado para validar alturas, acessos e ergonomia antes da fabricação',
    },
    cta: { label: 'Ver arquitetura, fluxo e equipamentos', href: '/solucoes/arquitetura' },
  },
  {
    id: 'implantacao',
    number: '03',
    short: 'Equipamentos e implantação',
    title: 'Equipamentos, fabricação e implantação',
    description:
      'Especificação dimensionada, fabricação sob medida em inox, acompanhamento de obra, instalação e comissionamento.',
    deliverables: [
      'Especificação dimensionada pelo volume real',
      'Fabricação sob medida em aço inox',
      'Instalação, comissionamento e testes de operação',
    ],
    media: {
      src: '/images/projects/mobiliario-inox.jpg',
      alt: 'Bancada em aço inox com gaveteiro, armários, pia dupla e prateleiras de parede',
      caption: 'Mobiliário fabricado sob medida para o espaço existente, sem adaptação na obra',
    },
    cta: { label: 'Ver cozinhas industriais completas', href: '/solucoes/cozinhas-industriais' },
  },
  {
    id: 'operacao',
    number: '04',
    short: 'Processos e operação',
    title: 'Processos, produtividade e operação',
    description:
      'Rotina de turno, padronização, treinamento da equipe e leitura do desperdício depois que a cozinha entra em produção.',
    deliverables: [
      'Rotina de turno e padronização do que é produzido',
      'Treinamento da equipe na operação entregue',
      'Leitura de desperdício e retrabalho depois da entrega',
    ],
    media: {
      src: '/images/projects/fritadeiras-e-chapa.jpg',
      alt: 'Fritadeiras elétricas e chapa em linha, com bancada de apoio em aço inox',
      caption: 'Praça de fritura e chapa com apoio de bancada e escoamento previsto em projeto',
    },
    cta: {
      label: 'Ver consultoria operacional',
      href: '/solucoes/consultoria-para-restaurantes',
    },
  },
  {
    id: 'crescimento',
    number: '05',
    short: 'Comercial e crescimento',
    title: 'Comercial, marketing e prospecção',
    description:
      'Entra quando oferta, capacidade e processo já estão entendidos: crescimento apoiado na operação que existe, não campanha solta.',
    deliverables: [
      'Oferta e posicionamento a partir da capacidade instalada',
      'Estrutura comercial e prospecção',
      'Marketing orientado à operação, não ao calendário',
    ],
    media: {
      src: '/images/hero/show-cooking.jpg',
      alt: 'Balcão de distribuição com show cooking, lâmpadas de calor e nichos para louça',
      caption: 'Praça de finalização integrada ao salão — onde a operação encontra o cliente',
    },
    cta: {
      label: 'Ver crescimento comercial',
      href: '/solucoes/consultoria-para-restaurantes#crescimento',
    },
  },
]

/**
 * A sequência que a arquitetura de conteúdo precisa demonstrar. São os mesmos
 * seis tempos do método (`methodSteps`), reduzidos a verbos.
 *
 * Na home ela não é mais uma faixa decorativa embaixo dos níveis: cada verbo
 * marca o trecho do percurso que o nível selecionado cobre, funcionando como
 * indicador de progresso do painel.
 */
export const scopeSequence = [
  'Diagnosticar',
  'Priorizar',
  'Projetar',
  'Implantar',
  'Operar',
  'Crescer',
] as const

/**
 * Trecho da régua de verbos coberto por cada nível — é a conexão entre os
 * cinco níveis e os seis tempos do método, e não uma sétima lista. Índices em
 * `scopeSequence`, fim inclusivo.
 */
export const scopeSpan: Record<string, [number, number]> = {
  diagnostico: [0, 1],
  projeto: [2, 2],
  implantacao: [3, 3],
  operacao: [4, 4],
  crescimento: [5, 5],
}
