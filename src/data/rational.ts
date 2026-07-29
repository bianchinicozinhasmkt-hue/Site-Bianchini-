import type { SpecRow } from '@/types'

/**
 * Conteúdo migrado da página legada do forno combinado Rational.
 * Especificações do fabricante, fornecidas e instaladas pela Bianchini.
 */
export const rational = {
  eyebrow: 'Tecnologia & equipamentos',
  name: 'Rational iCombi Pro',
  supplied: 'Fornecido, instalado e comissionado pela Bianchini',
  headline: 'O forno combinado dentro de um projeto que sustenta a operação.',
  intro:
    'Em menos de 1 m², o iCombi Pro concentra funções que normalmente exigem vários equipamentos. A Bianchini fornece, instala e comissiona todas as capacidades — 6, 10, 12, 20 e 40 GN — com o dimensionamento elétrico, hidráulico e de exaustão feito antes da obra.',
  quickSpecs: [
    { label: 'Capacidades disponíveis', value: '6 · 10 · 12 · 20 · 40 GN' },
    { label: 'Refeições por dia', value: '30 a 800+ refeições' },
    { label: 'Temperatura', value: '30 °C a 300 °C' },
    { label: 'Conectividade', value: 'Wi-Fi + app ConnectedCooking' },
    { label: 'Limpeza automática', value: 'iCareSystem (aprox. 12 min)' },
    { label: 'Material', value: 'Inox AISI 304' },
    { label: 'Tensão', value: 'Trifásico 220 V / 380 V / 440 V' },
    { label: 'Pressão de água', value: '1,0 a 6,0 bar' },
  ] satisfies SpecRow[],
  technologies: [
    {
      name: 'iDensityControl',
      subtitle: 'Controle de clima',
      description:
        'Controle automático de temperatura, umidade e circulação de ar em tempo real, mantendo uniformidade em todas as bandejas independentemente da carga.',
    },
    {
      name: 'iCookingSuite',
      subtitle: 'Assistência de cocção',
      description:
        'Reconhece o alimento e ajusta tempo, temperatura e umidade automaticamente, padronizando o resultado entre turnos e operadores.',
    },
    {
      name: 'iProductionManager',
      subtitle: 'Produção múltipla',
      description:
        'Organiza a produção simultânea de pratos diferentes sem transferência de sabor, otimizando o uso da câmara.',
    },
    {
      name: 'iCareSystem',
      subtitle: 'Limpeza automática',
      description:
        'Limpeza automática completa em aproximadamente 12 minutos, com consumo reduzido de produto químico e sem intervenção da equipe.',
    },
  ],
  models: [
    { model: '6 GN', capacity: '6 × 1/1', meals: '30 – 100', power: '10,8 kW', size: '850 × 754 × 842' },
    { model: '10 GN', capacity: '10 × 1/1', meals: '80 – 150', power: '18,9 kW', size: '850 × 754 × 842' },
    { model: '12 GN', capacity: '12 × 1/1', meals: '100 – 200', power: '25 kW', size: '850 × 754 × 1.050' },
    { model: '20 GN', capacity: '20 × 1/1', meals: '150 – 300', power: '37,2 kW', size: '877 × 847 × 1.807' },
    { model: '40 GN', capacity: '40 × 2/1', meals: '300 – 800+', power: '60+ kW', size: 'Sob consulta' },
  ],
  replaces: [
    { name: 'Forno convencional', detail: 'Assar, gratinar, tostar' },
    { name: 'Fritadeira', detail: 'Fritura a ar quente, sem óleo' },
    { name: 'Vapor / cozedor', detail: 'Cozimento a vapor 100%' },
    { name: 'Grelha / char-broiler', detail: 'Marcação com apoio de vapor' },
    { name: 'Salamandra', detail: 'Gratinar e finalizar pratos' },
    { name: 'Regenerador', detail: 'Regeneração de refeições prontas' },
  ],
  advantages: [
    {
      number: '01',
      title: 'Projeto incluso',
      description:
        'Dimensionamento elétrico, hidráulico e de exaustão específico para o forno, com plantas técnicas entregues antes da instalação.',
    },
    {
      number: '02',
      title: 'Instalação especializada',
      description:
        'Comissionamento completo e treinamento da equipe incluídos. O equipamento entra em produção no ritmo da sua operação.',
    },
    {
      number: '03',
      title: 'Suporte pós-venda',
      description:
        'Atendimento técnico continuado e acompanhamento da operação depois da entrega — não apenas o fornecimento do equipamento.',
    },
  ],
  image: {
    src: '/images/projects/forno-combinado.jpg',
    alt: 'Forno combinado profissional em inox com painel digital, instalado em cozinha profissional',
  },
} as const
