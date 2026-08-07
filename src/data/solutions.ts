import type { Solution } from '@/types'

/**
 * Quatro caminhos principais da home, na hierarquia definida pelo prompt de
 * direção e por GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md §7.3.
 *
 * Consultoria para fabricantes permanece acessível pelo menu e pelo footer,
 * sem competir com estes quatro caminhos.
 *
 * Todas as imagens são fotografias e materiais reais do acervo do projeto.
 */
export const solutions: Solution[] = [
  {
    id: 'cozinhas-industriais',
    title: 'Cozinhas industriais completas',
    problem: 'Preciso montar ou reformar uma cozinha inteira.',
    benefit:
      'Projeto, especificação, fornecimento, instalação e comissionamento sob uma única responsabilidade — sem repasse de culpa entre projetista, fornecedor e instalador.',
    href: '/solucoes/cozinhas-industriais',
    image: '/images/projects/cozinha-completa.jpg',
    alt: 'Cozinha profissional entregue, com linha de cocção, bancadas em inox, prateleiras suspensas e exaustão',
    bullets: ['Dimensionamento por volume real', 'Fabricação sob medida em inox', 'Instalação e comissionamento'],
  },
  {
    id: 'arquitetura',
    title: 'Arquitetura, fluxo e equipamentos',
    problem: 'O espaço não acompanha a operação.',
    benefit:
      'Retaguarda, cozinha, salão e fachada desenhados a partir do fluxo de trabalho, com plantas complementares e memorial que instruem a obra.',
    href: '/solucoes/arquitetura',
    image: '/images/projects/projeto-3d.jpg',
    alt: 'Estudo tridimensional de cozinha profissional com bancadas e equipamentos em inox',
    bullets: ['Layout e fluxo operacional', 'Plantas complementares', 'Estudo 3D antes de fabricar'],
  },
  {
    id: 'consultoria-para-restaurantes',
    title: 'Diagnóstico e consultoria operacional',
    problem: 'A operação existe, mas custa caro e rende pouco.',
    benefit:
      'Leitura técnica de gargalos, desperdícios, produtividade e custo para priorizar o que muda o resultado antes de qualquer investimento.',
    href: '/solucoes/consultoria-para-restaurantes',
    image: '/images/projects/linha-de-fogoes.jpg',
    alt: 'Linha de fogões industriais em operação, com bancada de apoio em aço inox',
    bullets: ['Mapa de fluxo e gargalos', 'Revisão de dimensionamento', 'Plano de prioridades'],
  },
  {
    id: 'crescimento',
    title: 'Crescimento comercial e marketing',
    problem: 'A operação melhorou, mas falta previsibilidade de receita.',
    benefit:
      'Estruturação comercial e marketing conectados ao diagnóstico do negócio — uma extensão do plano operacional, não um serviço solto de agência.',
    href: '/solucoes/consultoria-para-restaurantes#crescimento',
    image: '/images/hero/show-cooking.jpg',
    alt: 'Balcão de distribuição com show cooking integrado ao salão de atendimento',
    bullets: ['Oferta e posicionamento', 'Estrutura comercial', 'Marketing orientado à operação'],
  },
]
