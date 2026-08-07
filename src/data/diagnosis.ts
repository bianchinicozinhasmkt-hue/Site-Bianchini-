import type { DiagnosisArea, MethodStep } from '@/types'

/**
 * O diagnóstico é o ponto de partida do relacionamento — não um serviço à
 * parte. As frentes abaixo descrevem o que é analisado; não prometem
 * percentuais de economia nem resultado financeiro garantido.
 */
export const diagnosisAreas: DiagnosisArea[] = [
  {
    title: 'Estrutura e espaço',
    description:
      'Área disponível, circulação, instalações de elétrica, hidráulica, gás e exaustão, e o que a obra realmente permite.',
  },
  {
    title: 'Fluxo de produção',
    description:
      'Caminho do insumo entre recebimento, armazenagem, pré-preparo, cocção, montagem, distribuição e lavagem.',
  },
  {
    title: 'Equipamentos',
    description:
      'Capacidade instalada contra volume real de produção: o que está sobrando, o que falta e o que trabalha fora do ponto.',
  },
  {
    title: 'Processos e equipe',
    description:
      'Rotina de turno, retrabalho, dependência de improviso, treinamento e padronização do que é produzido.',
  },
  {
    title: 'Custo e desperdício',
    description:
      'Perda de insumo, energia paga sem retorno, manutenção corretiva recorrente e compras que não se pagam na operação.',
  },
  {
    title: 'Comercial e demanda',
    description:
      'Cardápio, mix, horários de pico e capacidade de atendimento — o que a operação consegue entregar e vender.',
  },
]

/**
 * ============================================================
 * ZONAS DE LEITURA DA PLANTA
 * ============================================================
 *
 * Os três pontos de leitura ancorados sobre a planta executiva do acervo
 * (`projects/planta-executiva-recorte.jpg`). Cada um aponta uma zona que
 * **existe e é visível no próprio desenho**:
 *
 *   · o salão, com as mesas desenhadas e a legenda real do documento
 *     ("SALÃO DE ATENDIMENTO A = 122,50 m²");
 *   · a linha de produção, o bloco denso de equipamentos ao centro;
 *   · a retaguarda, com as estantes e a armazenagem à direita.
 *
 * `x`/`y` são percentuais da caixa do documento — foram lidos sobre o recorte,
 * não estimados. Ao trocar o recorte, releia.
 *
 * **Nenhuma cota, medida, equipamento ou cliente é inventado aqui.** O que
 * cada zona traz é: o nome dela, quais das seis frentes se leem ali (as
 * mesmas de `diagnosisAreas`, por título) e uma fotografia real do acervo com
 * legenda neutra. Se a informação não estiver no desenho ou no acervo, não
 * entra.
 */
export interface PlanZone {
  id: string
  /** Rótulo da zona, como aparece na chamada sobre o desenho. */
  label: string
  /** Posição do ponto sobre o documento, em % da caixa. */
  x: number
  y: number
  /** Lado para o qual o rótulo abre, para não sair da caixa. */
  align: 'left' | 'right'
  /** O que se lê nessa zona — frase de leitura, não promessa. */
  reading: string
  /** Problema ou consequência principal quando essa zona não é lida a tempo. */
  consequence: string
  /** Frentes de `diagnosisAreas` que se leem aqui, por título. */
  areas: string[]
  media: { src: string; alt: string; caption: string }
}

export const planZones: PlanZone[] = [
  {
    id: 'salao',
    label: 'Salão de atendimento',
    x: 15,
    y: 58,
    align: 'right',
    reading:
      'Quantos lugares o salão comporta e em que ritmo eles giram é o que define o volume que a cozinha precisa entregar no pico.',
    consequence:
      'Descompasso entre a capacidade do salão e a da cozinha aparece como fila e prato atrasado no horário de pico.',
    areas: ['Comercial e demanda', 'Fluxo de produção'],
    media: {
      src: '/images/hero/linha-de-distribuicao.jpg',
      alt: 'Linha de distribuição em aço inox, com cubas aquecidas e proteção salivar',
      caption: 'Linha de distribuição — registro do acervo Bianchini.',
    },
  },
  {
    id: 'producao',
    label: 'Linha de produção',
    x: 49,
    y: 44,
    align: 'right',
    reading: 'O caminho do insumo entre recebimento, pré-preparo, cocção e montagem.',
    consequence: 'Cruzamento de fluxo aqui é retrabalho em todo turno.',
    areas: ['Equipamentos', 'Processos e equipe'],
    media: {
      src: '/images/projects/linha-de-fogoes.jpg',
      alt: 'Linha de cocção com fogões industriais e fornos sob bancada em cozinha profissional',
      caption: 'Linha de cocção instalada — registro do acervo Bianchini.',
    },
  },
  {
    id: 'retaguarda',
    label: 'Retaguarda e apoio',
    x: 83,
    y: 66,
    align: 'left',
    reading: 'Armazenagem, refrigeração e apoio.',
    consequence: 'Capacidade de estoque fora de proporção com o giro é insumo perdido e capital parado.',
    areas: ['Estrutura e espaço', 'Custo e desperdício'],
    media: {
      src: '/images/projects/refrigeradores-verticais.jpg',
      alt: 'Refrigeradores verticais em aço inox alinhados em área de apoio de cozinha profissional',
      caption: 'Refrigeração de apoio — registro do acervo Bianchini.',
    },
  },
]

/**
 * O que o diagnóstico permite decidir. São consequências de método, não
 * promessas de resultado: nenhum percentual de economia é declarado, porque
 * não há base verificável para isso.
 */
export const diagnosisOutcomes: string[] = [
  'Identificar a causa, não o sintoma',
  'Estabelecer prioridades',
  'Direcionar o investimento',
  'Evitar a compra errada',
  'Reduzir desperdício',
  'Melhorar o resultado da operação',
]

/** Método integrado — o mesmo em toda a jornada, da home às páginas de solução. */
export const methodSteps: MethodStep[] = [
  {
    number: '01',
    title: 'Diagnóstico',
    description:
      'Visita técnica e leitura da operação: espaço, fluxo, equipamentos, processos, custo e demanda.',
  },
  {
    number: '02',
    title: 'Identificação dos problemas',
    description:
      'Gargalos, desperdícios, riscos de conformidade e investimentos que não se sustentam na prática.',
  },
  {
    number: '03',
    title: 'Priorização das soluções',
    description:
      'O que resolver primeiro, o que pode esperar e o que não precisa ser comprado. Investimento direcionado ao que muda a operação.',
  },
  {
    number: '04',
    title: 'Projeto e especificação',
    description:
      'Layout técnico, plantas complementares, memorial descritivo e especificação dimensionada pelo volume real.',
  },
  {
    number: '05',
    title: 'Fornecimento e instalação',
    description:
      'Fabricação sob medida em inox, logística, montagem, instalação e comissionamento com testes de operação.',
  },
  {
    number: '06',
    title: 'Acompanhamento dos resultados',
    description:
      'Treinamento da equipe, validação de conformidade e leitura da operação depois da entrega.',
  },
]

/** O que acontece depois do primeiro contato — reduz a incerteza do visitante. */
export const nextSteps: MethodStep[] = [
  {
    number: '01',
    title: 'Conversa inicial',
    description: 'Entendemos o momento do negócio, o tipo de operação e o que está incomodando.',
  },
  {
    number: '02',
    title: 'Visita técnica',
    description: 'Leitura do espaço e da rotina real, com registro de fluxo, equipamentos e restrições.',
  },
  {
    number: '03',
    title: 'Devolutiva com prioridades',
    description: 'Apresentação dos problemas encontrados e da ordem recomendada para resolvê-los.',
  },
]
