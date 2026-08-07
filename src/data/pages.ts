import type { Problem } from '@/types'

/**
 * Conteúdo das páginas comerciais. Texto separado da apresentação, como as
 * demais entradas de `src/data/`.
 *
 * Regra aplicada em todo este arquivo: descrever escopo, método e sintoma —
 * nunca prometer percentual de economia, prazo ou resultado financeiro.
 */

export const kitchensPage = {
  hero: {
    eyebrow: 'Cozinhas industriais completas',
    title: 'Uma cozinha industrial inteira, sob uma única responsabilidade',
    lead: 'Do diagnóstico à cozinha em produção: projeto executivo, especificação dimensionada, fabricação em inox, instalação e comissionamento com o mesmo time respondendo do começo ao fim.',
    highlights: [
      'Dimensionamento por volume real',
      'Fabricação sob medida em inox',
      'Instalação e comissionamento',
      'Treinamento na entrega',
    ],
    image: {
      src: '/images/projects/fritadeiras-e-chapa.jpg',
      alt: 'Fritadeiras elétricas e chapa em linha, com bancada de apoio em aço inox',
      caption: 'Praça de fritura e chapa entregue, com escoamento previsto em projeto',
    },
  },
  advantages: [
    {
      title: 'Um interlocutor, não três',
      description:
        'Projetista, fornecedor e instalador respondendo separadamente é o que transforma um detalhe em atraso. Aqui a responsabilidade é única, do desenho ao comissionamento.',
    },
    {
      title: 'Compra dimensionada, não catálogo',
      description:
        'A especificação sai do volume de produção, do cardápio e dos horários de pico. Equipamento sobrando é capital parado; faltando, é fila na praça quente.',
    },
    {
      title: 'Conformidade dentro do projeto',
      description:
        'RDC 216, normas sanitárias e exigências do Corpo de Bombeiros entram na etapa de desenho — não como correção depois da vistoria.',
    },
    {
      title: 'Sob medida para o espaço existente',
      description:
        'Mobiliário e estruturas em aço inox fabricados nas medidas reais do local, sem adaptação improvisada na obra.',
    },
  ],
  deliverables: [
    'Projeto executivo de layout',
    'Plantas complementares (elétrica, hidráulica, gás e esgoto)',
    'Memorial descritivo',
    'Especificação técnica de equipamentos',
    'Estudo tridimensional do ambiente',
    'Cronograma de implantação',
    'Orçamento aberto por etapa',
    'Fabricação de mobiliário em inox',
    'Instalação e comissionamento',
    'Testes de operação',
    'Treinamento da equipe',
    'Acompanhamento pós-entrega',
  ],
} as const

export const architecturePage = {
  hero: {
    eyebrow: 'Arquitetura, fluxo e equipamentos',
    title: 'O espaço desenhado a partir da operação que vai acontecer nele',
    lead: 'Retaguarda, cozinha, salão e fachada projetados com o fluxo de produção como restrição principal — e com a mesma equipe respondendo pela especificação e pela implantação depois.',
    highlights: ['Layout e fluxo', 'Plantas complementares', 'Estudo 3D', 'Memorial descritivo'],
    image: {
      src: '/images/hero/bar-em-inox.jpg',
      alt: 'Balcão de bar em aço inox com cuba, apoio refrigerado e prateleiras escalonadas para garrafas',
      caption: 'Estrutura de bar em inox: arquitetura e operação resolvidas no mesmo desenho',
    },
  },
  problems: [
    {
      title: 'Layout bonito que não produz',
      description:
        'O ambiente foi desenhado pela estética e a cozinha ficou com o que sobrou. A equipe paga a conta em cada turno.',
      marker: 'Layout',
      emphasis: 'A equipe paga a conta em cada turno',
    },
    {
      title: 'Fluxo cruzado',
      description:
        'Sujo e limpo se encontram, o insumo volta pelo mesmo caminho que saiu e a circulação disputa espaço com a produção.',
      marker: 'Fluxo',
      emphasis: 'a circulação disputa espaço com a produção',
    },
    {
      title: 'Instalações descobertas na obra',
      description:
        'Ponto de gás, dreno e carga elétrica definidos depois do layout — o que gera quebra-quebra e custo não previsto.',
      marker: 'Obra',
      emphasis: 'quebra-quebra e custo não previsto',
    },
    {
      title: 'Exaustão pensada por último',
      description:
        'Coifa dimensionada depois da linha de cocção: calor no ambiente, gordura acumulada e risco de pendência na vistoria.',
      marker: 'Exaustão',
      emphasis: 'risco de pendência na vistoria',
    },
    {
      title: 'Salão e retaguarda desconectados',
      description:
        'A distância entre a praça de finalização e o cliente define o tempo do prato. Quando ninguém desenha isso, o serviço perde ritmo.',
      marker: 'Serviço',
      emphasis: 'o serviço perde ritmo',
    },
    {
      title: 'Projeto que não instrui a obra',
      description:
        'Sem plantas complementares e memorial, cada dúvida vira decisão improvisada de quem está executando.',
      marker: 'Projeto',
      emphasis: 'decisão improvisada de quem está executando',
    },
  ] as Problem[],
  deliverables: [
    'Levantamento do espaço e da operação',
    'Estudo de fluxo de produção',
    'Planta de layout técnico',
    'Plantas complementares (elétrica, hidráulica, gás e esgoto)',
    'Estudo tridimensional',
    'Detalhamento de mobiliário em inox',
    'Memorial descritivo',
    'Especificação de equipamentos',
    'Compatibilização com salão e fachada',
    'Cronograma de execução',
    'Acompanhamento de obra',
    'Suporte à equipe executora',
  ],
} as const

export const consultingPage = {
  hero: {
    eyebrow: 'Diagnóstico e consultoria operacional',
    title: 'A operação já existe. O problema é descobrir onde ela perde dinheiro',
    lead: 'Leitura técnica de fluxo, dimensionamento, processo e custo para separar o que precisa ser resolvido do que apenas parece urgente — antes de qualquer investimento novo.',
    highlights: ['Visita técnica', 'Mapa de gargalos', 'Plano de prioridades', 'Sem compra obrigatória'],
    image: {
      src: '/images/hero/show-cooking.jpg',
      alt: 'Balcão de distribuição com show cooking, lâmpadas de calor e nichos para louça',
      caption: 'Praça de finalização integrada ao salão',
    },
  },
  symptoms: [
    {
      title: 'A cozinha trava no pico',
      description:
        'O tempo de saída dobra no horário de maior movimento e a equipe compensa com improviso — todo dia, no mesmo horário.',
      marker: 'Pico',
      emphasis: 'O tempo de saída dobra',
    },
    {
      title: 'Desperdício sem explicação',
      description:
        'Perda de insumo que aparece no fechamento do mês sem origem identificada: temperatura, armazenagem, porcionamento ou compra.',
      marker: 'Desperdício',
      emphasis: 'sem origem identificada',
    },
    {
      title: 'Equipe grande, produção baixa',
      description:
        'Muita gente caminhando, retrabalhando e esperando. O custo de folha não corresponde ao volume que sai.',
      marker: 'Produtividade',
      emphasis: 'O custo de folha não corresponde ao volume que sai',
    },
    {
      title: 'Resultado inconsistente',
      description:
        'O mesmo prato sai diferente conforme quem está no turno, porque o processo mora na cabeça das pessoas.',
      marker: 'Padrão',
      emphasis: 'o processo mora na cabeça das pessoas',
    },
    {
      title: 'Manutenção corretiva constante',
      description:
        'Equipamento parando com frequência, quase sempre por uso fora de especificação ou dimensionamento errado na compra.',
      marker: 'Manutenção',
      emphasis: 'uso fora de especificação ou dimensionamento errado',
    },
    {
      title: 'Investimento que não se pagou',
      description:
        'Compra feita para resolver um gargalo que continua lá, porque a causa estava no fluxo e não no equipamento.',
      marker: 'Investimento',
      emphasis: 'a causa estava no fluxo e não no equipamento',
    },
  ] as Problem[],
  fronts: [
    {
      title: 'Fluxo e layout',
      description: 'Reorganização do caminho do insumo e das praças de trabalho dentro do espaço que já existe.',
    },
    {
      title: 'Dimensionamento',
      description: 'Revisão da capacidade instalada contra o volume real: o que remanejar, o que falta e o que não precisa ser comprado.',
    },
    {
      title: 'Processo e padronização',
      description: 'Rotina de turno, fichas técnicas, porcionamento e o que precisa deixar de depender de improviso.',
    },
    {
      title: 'Custo e desperdício',
      description: 'Onde o insumo, a energia e a hora de trabalho estão sendo consumidos sem retorno na operação.',
    },
    {
      title: 'Estrutura comercial',
      description: 'Cardápio, mix, precificação e capacidade de atendimento — o que a operação consegue vender e entregar.',
    },
    {
      title: 'Marketing conectado ao diagnóstico',
      description: 'Quando o gargalo é de demanda, e não de operação, o crescimento entra como frente complementar do mesmo plano.',
    },
  ],
  deliverables: [
    'Relatório de diagnóstico operacional',
    'Mapa de fluxo atual e proposto',
    'Lista de gargalos priorizada',
    'Pontos de desperdício identificados',
    'Revisão de dimensionamento',
    'Plano de prioridades por impacto',
    'Recomendação de investimento (e do que não investir)',
    'Sugestões de padronização de processo',
    'Apoio na especificação, quando houver compra',
    'Acompanhamento das mudanças acordadas',
  ],
} as const

export const manufacturersPage = {
  hero: {
    eyebrow: 'Consultoria para fabricantes',
    title: 'Para quem fabrica cozinhas profissionais e precisa produzir e vender melhor',
    lead: 'Diagnóstico de chão de fábrica e de estrutura comercial para fabricantes de cozinhas e mobiliário em inox, conduzido por quem conhece os dois lados do balcão.',
    highlights: ['Processo produtivo', 'Produtividade', 'Gestão', 'Estrutura comercial'],
    image: {
      src: '/images/projects/estante-inox.jpg',
      alt: 'Estante modulada em aço inox para armazenagem em cozinha profissional',
      caption: 'Mobiliário em inox: padrão de acabamento e repetibilidade de produção',
    },
  },
  challenges: [
    {
      title: 'Produção que não fecha o prazo',
      description:
        'Sequenciamento, setup e gargalo de posto derrubando a data prometida ao cliente — e a credibilidade junto com ela.',
      marker: 'Prazo',
      emphasis: 'derrubando a data prometida ao cliente',
    },
    {
      title: 'Retrabalho que come a margem',
      description:
        'Peça refeita por medida, acabamento ou montagem. O custo aparece no resultado, não no orçamento.',
      marker: 'Retrabalho',
      emphasis: 'O custo aparece no resultado, não no orçamento',
    },
    {
      title: 'Preço sem lastro de custo',
      description:
        'Proposta montada por comparação com o concorrente, sem saber quanto cada peça realmente custa para produzir.',
      marker: 'Margem',
      emphasis: 'sem saber quanto cada peça realmente custa para produzir',
    },
    {
      title: 'Comercial dependente de uma pessoa',
      description:
        'A venda acontece porque alguém específico conhece o cliente. Sem processo, a receita não é previsível.',
      marker: 'Comercial',
      emphasis: 'Sem processo, a receita não é previsível',
    },
    {
      title: 'Carteira concentrada',
      description:
        'Poucos clientes respondendo pela maior parte do faturamento — e um deles pode encerrar o ano.',
      marker: 'Carteira',
      emphasis: 'um deles pode encerrar o ano',
    },
    {
      title: 'Distância do cliente final',
      description:
        'Produto desenhado pela fábrica, não pela operação que vai usá-lo. O que volta como reclamação era previsível no projeto.',
      marker: 'Produto',
      emphasis: 'era previsível no projeto',
    },
  ] as Problem[],
  deliverables: [
    'Diagnóstico de processo produtivo',
    'Mapeamento de gargalos de fábrica',
    'Análise de retrabalho e perdas',
    'Revisão de custo por produto',
    'Diagnóstico da estrutura comercial',
    'Plano de prioridades',
    'Acompanhamento das mudanças acordadas',
  ],
} as const

export const aboutPage = {
  competencies: [
    {
      title: 'Diagnóstico técnico e operacional',
      description: 'Leitura de fluxo, dimensionamento, processo e custo antes de qualquer recomendação.',
    },
    {
      title: 'Arquitetura de cozinha, salão e fachada',
      description: 'Projeto executivo com plantas complementares e memorial que instrui a obra.',
    },
    {
      title: 'Especificação e fornecimento',
      description: 'Equipamentos dimensionados pelo volume real da operação, com orçamento aberto.',
    },
    {
      title: 'Fabricação em inox',
      description: 'Mobiliário e estruturas sob medida em aço inox AISI 304, ou outra liga acordada.',
    },
    {
      title: 'Implantação',
      description: 'Instalação, comissionamento, testes de operação e treinamento da equipe.',
    },
    {
      title: 'Consultoria de operação e crescimento',
      description: 'Melhoria operacional e, quando o gargalo é de demanda, estruturação comercial.',
    },
  ],
} as const
