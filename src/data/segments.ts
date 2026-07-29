import type { Segment } from '@/types'

/** Segmentos atendidos, conforme o mosaico de segmentos do site anterior. */
export const segments: Segment[] = [
  {
    id: 'restaurantes',
    title: 'Restaurantes & bares',
    description:
      'Do fast-food ao fine dining. Cozinhas que mantêm o ritmo no pico, reduzem tempo de espera e permitem show cooking sem gargalo.',
    wide: true,
  },
  {
    id: 'hoteis',
    title: 'Hotéis & resorts',
    description:
      'Banquetes simultâneos, room service 24 horas e café da manhã de alto volume na mesma estrutura.',
  },
  {
    id: 'padarias',
    title: 'Padarias & confeitarias',
    description:
      'Produção artesanal ou em escala. Fornos de precisão, fermentação controlada e logística de distribuição integrada.',
  },
  {
    id: 'hospitais',
    title: 'Hospitais & alimentação institucional',
    description:
      'Milhares de refeições diárias sob RDC 216, com rastreabilidade de insumo e segurança alimentar dentro da norma.',
    wide: true,
  },
  {
    id: 'franquias',
    title: 'Franquias & redes',
    description:
      'Padronização em escala: mesmo layout, mesma especificação e mesmo padrão de operação em cada unidade.',
  },
  {
    id: 'offshore',
    title: 'Ambientes extremos',
    description:
      'Plataformas offshore e operações confinadas. Espaço limitado, inox resistente ao ambiente marinho e equipamento que não pode parar.',
  },
]
