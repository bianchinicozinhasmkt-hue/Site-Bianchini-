import type { Project } from '@/types'

/**
 * Fotografias reais de operações entregues, presentes no acervo do projeto.
 * As legendas descrevem o que está na imagem — nenhuma atribuição de cliente,
 * unidade ou número foi criada.
 */
export const projects: Project[] = [
  {
    id: 'cozinha-completa',
    title: 'Cozinha profissional completa',
    caption: 'Cocção, apoio refrigerado, mobiliário em inox e exaustão integrados no mesmo projeto.',
    image: '/images/projects/cozinha-completa.jpg',
    alt: 'Cozinha profissional em operação com fritadeiras, bancadas em inox, prateleiras suspensas e coifas',
  },
  {
    id: 'bar-inox',
    title: 'Estrutura de bar em inox',
    caption: 'Módulo frontal com cuba, apoio refrigerado under-bar e escalonamento de garrafas.',
    image: '/images/hero/bar-em-inox.jpg',
    alt: 'Balcão de bar em aço inox com cuba, apoio refrigerado e prateleiras escalonadas para garrafas',
  },
  {
    id: 'linha-coccao',
    title: 'Linha de cocção sob coifa',
    caption: 'Chapa, char-broiler, salamandra e balcão refrigerado sob exaustão dimensionada.',
    image: '/images/hero/linha-de-coccao.jpg',
    alt: 'Linha de cocção com chapa, char-broiler e balcão refrigerado sob coifa em aço inox',
  },
  {
    id: 'show-cooking',
    title: 'Distribuição com show cooking',
    caption: 'Praça de finalização integrada ao salão, com lâmpadas de calor e apoio de louça.',
    image: '/images/hero/show-cooking.jpg',
    alt: 'Balcão de distribuição com show cooking, lâmpadas de calor e nichos para louça',
  },
  {
    id: 'mobiliario-inox',
    title: 'Mobiliário sob medida',
    caption: 'Bancada com gaveteiro, armários fechados, pia dupla e prateleiras de parede.',
    image: '/images/projects/mobiliario-inox.jpg',
    alt: 'Bancada em aço inox com gaveteiro, armários, pia dupla e prateleiras de parede',
  },
  {
    id: 'refrigeracao',
    title: 'Refrigeração de linha',
    caption: 'Refrigeradores verticais e balcões de apoio posicionados junto à praça de produção.',
    image: '/images/projects/refrigeradores-verticais.jpg',
    alt: 'Refrigeradores verticais em inox e balcões refrigerados ao longo de uma praça de produção',
  },
]
