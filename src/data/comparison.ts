import type { ComparisonRow } from '@/types'

/** Comparação "Fornecedor tradicional vs. Bianchini" do site anterior. */
export const comparisonRows: ComparisonRow[] = [
  {
    aspect: 'Responsabilidade',
    traditional: 'Vende o equipamento. Projeto e instalação ficam com terceiros.',
    bianchini: 'Diagnóstico, projeto, especificação e implantação sob um único responsável.',
  },
  {
    aspect: 'Ponto de partida',
    traditional: 'Começa pela lista de equipamentos disponível em catálogo.',
    bianchini: 'Começa pelo fluxo e pelo volume real da operação.',
  },
  {
    aspect: 'Documentação técnica',
    traditional: 'Ficha técnica do produto. Plantas complementares por conta do cliente.',
    bianchini: 'Projeto executivo, plantas de elétrica, hidráulica, gás e esgoto, memorial descritivo.',
  },
  {
    aspect: 'Conformidade',
    traditional: 'Adequação sanitária e de bombeiros resolvida depois, na correção.',
    bianchini: 'RDC 216, normas sanitárias e bombeiros considerados já na etapa de projeto.',
  },
  {
    aspect: 'Entrega',
    traditional: 'Equipamento entregue na obra. Coordenação e atrasos por sua conta.',
    bianchini: 'Instalação, comissionamento, treinamento da equipe e operação assistida.',
  },
  {
    aspect: 'Relação',
    traditional: 'Termina na nota fiscal.',
    bianchini: 'Continua no acompanhamento da operação e nas expansões seguintes.',
  },
]
