/**
 * Os três pilares da Bianchini — a estrutura organizacional da empresa, não
 * um caminho de solução comercial (isso já existe em `src/data/solutions.ts`)
 * nem os cinco níveis de atuação (`src/data/scope-levels.ts`). Cada pilar tem
 * um responsável nomeado, porque é isso que a composição precisa comunicar:
 * quem conduz o quê.
 *
 * "Construção e Reformas" saiu do escopo por decisão do gestor — não existe
 * como pilar, seção ou âncora em lugar nenhum do site. Indústria do inox
 * também não entra aqui: é público e proposta de valor diferentes
 * (fabricante, não operador), com seção própria em `industry.ts`. Marketing
 * digital e formatação de franquias não têm frente própria — ficam descritos
 * dentro de Operação Comercial.
 */
export interface Pillar {
  number: string
  title: string
  description: string
  responsible: string
}

export const pillars: Pillar[] = [
  {
    number: '01',
    title: 'Projetos',
    description:
      'Do estudo de viabilidade ao projeto técnico em conformidade com a RDC 216 da Anvisa. Layout, fluxo, exaustão e câmaras dimensionados para a operação real, não para o papel.',
    responsible: 'Leonardo Bianchini',
  },
  {
    number: '02',
    title: 'Equipamentos',
    description:
      'Especificação técnica e fornecimento de equipamentos profissionais e tecnológicos com retorno calculado. A escolha errada cobra todo mês em consumo, retrabalho e parada de cozinha.',
    responsible: 'Leonardo Bianchini',
  },
  {
    number: '03',
    title: 'Operação Comercial',
    description:
      'Funil, CRM, metas, time e geração de demanda. Cozinha eficiente sem operação de vendas continua sem faturamento.',
    responsible: 'Guilherme Beghini',
  },
]
