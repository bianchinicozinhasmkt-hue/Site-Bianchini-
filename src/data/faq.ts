import type { FaqItem } from '@/types'

/**
 * Perguntas frequentes por página. Respostas conservadoras: descrevem escopo
 * e método, sem prometer prazo, preço ou percentual de economia.
 */
export const kitchensFaq: FaqItem[] = [
  {
    question: 'A Bianchini vende equipamento avulso ou só projeto completo?',
    answer:
      'Os dois formatos existem, mas a recomendação sempre nasce do diagnóstico. Se a sua operação precisa de um equipamento específico, especificamos e fornecemos esse item. Se o problema é de fluxo ou dimensionamento, comprar o equipamento isolado costuma custar mais caro do que resolver a causa.',
  },
  {
    question: 'Como o equipamento é dimensionado?',
    answer:
      'Pelo volume real de produção, pelos horários de pico e pelo cardápio — não pela ficha técnica do fabricante. Esse levantamento é feito na etapa de diagnóstico e orienta a especificação.',
  },
  {
    question: 'Vocês fazem a instalação?',
    answer:
      'Sim. O escopo cobre logística, montagem, instalação, comissionamento e testes de operação, além do treinamento da equipe na entrega.',
  },
  {
    question: 'O que está incluído no projeto executivo?',
    answer:
      'Layout técnico com posicionamento de equipamentos e circulação, plantas complementares de elétrica, hidráulica, gás e esgoto, memorial descritivo, cronograma e orçamento aberto.',
  },
  {
    question: 'A Bianchini atende fora do Rio de Janeiro?',
    answer:
      'Sim. A empresa é sediada no Rio de Janeiro e atende operações em todo o Brasil.',
  },
]

export const architectureFaq: FaqItem[] = [
  {
    question: 'Qual a diferença entre esse projeto e o de um escritório de arquitetura?',
    answer:
      'O desenho parte da operação, não só do espaço. Fluxo de produção, volume, exaustão, cadeia fria e ergonomia entram como restrição de projeto desde a primeira planta — e a mesma equipe responde pela especificação e pela implantação depois.',
  },
  {
    question: 'Vocês trabalham com o arquiteto que já está no projeto?',
    answer:
      'Sim. É comum atuarmos junto ao arquiteto responsável pelo salão e pela fachada, cuidando da retaguarda, da cozinha e da compatibilização com as instalações.',
  },
  {
    question: 'O projeto contempla exigências sanitárias e do Corpo de Bombeiros?',
    answer:
      'Conformidade é tratada dentro do projeto — RDC 216, normas sanitárias e exigências de segurança entram na etapa de desenho, não como correção depois da vistoria.',
  },
  {
    question: 'Quais são os entregáveis?',
    answer:
      'Planta de layout, plantas complementares, estudo tridimensional, memorial descritivo, especificação técnica e cronograma. O detalhamento final depende do escopo contratado.',
  },
]

export const consultingFaq: FaqItem[] = [
  {
    question: 'A consultoria garante redução de custo?',
    answer:
      'Não trabalhamos com promessa de percentual. O diagnóstico aponta onde há desperdício, retrabalho e capacidade ociosa, e prioriza o que tem maior efeito na operação. O resultado depende da execução das mudanças acordadas.',
  },
  {
    question: 'Preciso comprar equipamento para contratar a consultoria?',
    answer:
      'Não. Em parte dos casos a recomendação é justamente não comprar: ajustar fluxo, processo ou uso do que já existe resolve o problema com investimento menor.',
  },
  {
    question: 'Como começa o trabalho?',
    answer:
      'Por uma conversa inicial e uma visita técnica à operação. A devolutiva apresenta os problemas encontrados e a ordem recomendada para resolvê-los.',
  },
  {
    question: 'Marketing entra na consultoria?',
    answer:
      'Como extensão do diagnóstico, quando o gargalo do negócio é de demanda e não de operação. É uma frente complementar — a Bianchini não atua como agência.',
  },
]

export const manufacturersFaq: FaqItem[] = [
  {
    question: 'Para que tipo de fábrica esse trabalho é indicado?',
    answer:
      'Fabricantes de cozinhas profissionais e de mobiliário em inox que enfrentam gargalo de produção, inconsistência de qualidade, custo alto de retrabalho ou estrutura comercial pouco previsível.',
  },
  {
    question: 'O trabalho é de chão de fábrica ou comercial?',
    answer:
      'Depende do diagnóstico. O escopo pode cobrir processo produtivo, produtividade e gestão, estrutura comercial, ou os dois quando os problemas estão conectados.',
  },
  {
    question: 'Há garantia de confidencialidade?',
    answer:
      'Sim. Informações de processo, custo, carteira e projeto são tratadas como confidenciais e não são publicadas no site nem usadas como material comercial sem autorização por escrito.',
  },
]
