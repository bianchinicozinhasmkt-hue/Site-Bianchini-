import type { CaseStage, ProcessStep } from '@/types'

/** Metodologia de trabalho, conforme a seção "Metodologia" do site anterior. */
export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Diagnóstico operacional',
    description:
      'Levantamento do fluxo atual, do volume real de produção, dos gargalos e das restrições do espaço. Entender a operação antes de desenhar a solução.',
    deliverables: ['Visita técnica', 'Mapa de fluxo', 'Levantamento de volume', 'Restrições de obra'],
  },
  {
    number: '02',
    title: 'Projeto executivo',
    description:
      'Layout técnico detalhado com plantas complementares de elétrica, hidráulica, gás e esgoto, memorial descritivo, cronograma e orçamento aberto.',
    deliverables: ['Planta de layout', 'Plantas complementares', 'Memorial descritivo', 'Cronograma e orçamento'],
  },
  {
    number: '03',
    title: 'Especificação e fabricação',
    description:
      'Equipamentos especificados pelo volume da operação e mobiliário fabricado sob medida em inox. Acompanhamento de produção etapa por etapa.',
    deliverables: ['Especificação técnica', 'Fabricação em inox', 'Logística de entrega', 'Acompanhamento de obra'],
  },
  {
    number: '04',
    title: 'Implantação e operação assistida',
    description:
      'Instalação, comissionamento, testes de operação, treinamento da equipe e validação de conformidade até a cozinha entrar em produção.',
    deliverables: ['Instalação', 'Comissionamento', 'Treinamento da equipe', 'Validação de conformidade'],
  },
]

/**
 * Etapas ilustradas com material real de projeto da Bianchini:
 * planta executiva em CAD, estudo 3D e a operação construída.
 */
export const caseStages: CaseStage[] = [
  {
    stage: 'Etapa 01',
    title: 'Planta executiva',
    description:
      'Layout técnico com posicionamento de equipamentos, bancadas e circulação, integrado ao salão e às plantas complementares.',
    image: '/images/projects/planta-executiva.jpg',
    alt: 'Planta executiva em CAD de uma cozinha profissional com salão de atendimento',
  },
  {
    stage: 'Etapa 02',
    title: 'Estudo tridimensional',
    description:
      'Modelo 3D do ambiente para validar alturas, acessos e ergonomia com o cliente antes de qualquer peça ser fabricada.',
    image: '/images/projects/projeto-3d.jpg',
    alt: 'Modelo tridimensional de cozinha profissional com bancadas e equipamentos em inox',
  },
  {
    stage: 'Etapa 03',
    title: 'Operação entregue',
    description:
      'Cozinha construída conforme o projeto: cocção, apoio refrigerado, mobiliário e exaustão instalados, testados e prontos para produzir.',
    image: '/images/projects/cozinha-completa.jpg',
    alt: 'Cozinha profissional entregue, com linha de cocção, prateleiras em inox e exaustão instalada',
  },
]
