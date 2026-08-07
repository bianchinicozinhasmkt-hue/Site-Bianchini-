import type { Project } from '@/types'

/**
 * Fotografias reais de operações entregues, presentes no acervo do projeto.
 *
 * As legendas descrevem exclusivamente o que está na imagem. Nenhum nome de
 * cliente, unidade, local, prazo ou número foi atribuído — esses dados só
 * podem entrar depois de confirmação comercial e autorização de uso.
 */
export const projects: Project[] = [
  {
    id: 'cozinha-completa',
    title: 'Cozinha profissional completa',
    caption: 'Cocção, apoio refrigerado, mobiliário em inox e exaustão integrados no mesmo projeto.',
    image: '/images/projects/cozinha-completa.jpg',
    alt: 'Cozinha profissional em operação com fritadeiras, bancadas em inox, prateleiras suspensas e coifas',
    segment: 'Cozinha industrial',
    scope: ['Projeto executivo', 'Especificação', 'Fabricação em inox', 'Instalação'],
  },
  {
    id: 'linha-coccao',
    title: 'Linha de cocção sob coifa',
    caption: 'Chapa, char-broiler, salamandra e balcão refrigerado sob exaustão dimensionada.',
    image: '/images/hero/linha-de-coccao.jpg',
    alt: 'Linha de cocção com chapa, char-broiler e balcão refrigerado sob coifa em aço inox',
    segment: 'Cocção',
    scope: ['Dimensionamento', 'Especificação', 'Exaustão'],
  },
  {
    id: 'bar-inox',
    title: 'Estrutura de bar em inox',
    caption: 'Módulo frontal com cuba, apoio refrigerado under-bar e escalonamento de garrafas.',
    image: '/images/hero/bar-em-inox.jpg',
    alt: 'Balcão de bar em aço inox com cuba, apoio refrigerado e prateleiras escalonadas para garrafas',
    segment: 'Bar e salão',
    scope: ['Mobiliário sob medida', 'Apoio refrigerado'],
  },
  {
    id: 'show-cooking',
    title: 'Distribuição com show cooking',
    caption: 'Praça de finalização integrada ao salão, com lâmpadas de calor e apoio de louça.',
    image: '/images/hero/show-cooking.jpg',
    alt: 'Balcão de distribuição com show cooking, lâmpadas de calor e nichos para louça',
    segment: 'Distribuição',
    scope: ['Layout de salão', 'Mobiliário sob medida'],
  },
  {
    id: 'mobiliario-inox',
    title: 'Mobiliário sob medida',
    caption: 'Bancada com gaveteiro, armários fechados, pia dupla e prateleiras de parede.',
    image: '/images/projects/mobiliario-inox.jpg',
    alt: 'Bancada em aço inox com gaveteiro, armários, pia dupla e prateleiras de parede',
    segment: 'Mobiliário em inox',
    scope: ['Fabricação sob medida', 'Instalação'],
  },
  {
    id: 'refrigeracao',
    title: 'Refrigeração de linha',
    caption: 'Refrigeradores verticais e balcões de apoio posicionados junto à praça de produção.',
    image: '/images/projects/refrigeradores-verticais.jpg',
    alt: 'Refrigeradores verticais em inox e balcões refrigerados ao longo de uma praça de produção',
    segment: 'Refrigeração',
    scope: ['Especificação', 'Cadeia fria'],
  },
  {
    id: 'camara-frigorifica',
    title: 'Câmara frigorífica',
    caption: 'Câmara com estantes moduladas em inox, dimensionada para o giro do estoque.',
    image: '/images/projects/camara-frigorifica.jpg',
    alt: 'Interior de câmara frigorífica com estantes moduladas em aço inox',
    segment: 'Cadeia fria',
    scope: ['Dimensionamento', 'Armazenagem'],
  },
  {
    id: 'planta-executiva',
    title: 'Planta executiva',
    caption: 'Layout técnico com posicionamento de equipamentos, bancadas e circulação integrado ao salão.',
    image: '/images/projects/planta-executiva.jpg',
    alt: 'Planta executiva em CAD de uma cozinha profissional com salão de atendimento',
    segment: 'Projeto',
    scope: ['Layout', 'Plantas complementares', 'Memorial descritivo'],
  },
  {
    id: 'projeto-3d',
    title: 'Estudo tridimensional',
    caption: 'Modelo 3D para validar alturas, acessos e ergonomia antes de qualquer peça ser fabricada.',
    image: '/images/projects/projeto-3d.jpg',
    alt: 'Modelo tridimensional de cozinha profissional com bancadas e equipamentos em inox',
    segment: 'Projeto',
    scope: ['Estudo 3D', 'Validação com o cliente'],
  },
  {
    id: 'fritadeiras-chapa',
    title: 'Praça de fritura e chapa',
    caption: 'Fritadeiras e chapa alinhadas com apoio de bancada e escoamento previsto em projeto.',
    image: '/images/projects/fritadeiras-e-chapa.jpg',
    alt: 'Fritadeiras elétricas e chapa em linha, com bancada de apoio em aço inox',
    segment: 'Cocção',
    scope: ['Especificação', 'Instalação'],
  },
  {
    id: 'forno-combinado',
    title: 'Cocção assistida em linha',
    caption: 'Forno combinado e frigideiras basculantes instalados sob exaustão, sobre base em inox.',
    image: '/images/projects/forno-combinado.jpg',
    alt: 'Forno combinado com painel digital ao lado de frigideiras basculantes, sob coifa em aço inox',
    segment: 'Tecnologia de cocção',
    scope: ['Especificação', 'Instalação', 'Comissionamento'],
  },
  {
    id: 'estante-inox',
    title: 'Armazenagem em inox',
    caption: 'Estantes moduladas em aço inox para estoque seco e apoio de produção.',
    image: '/images/projects/estante-inox.jpg',
    alt: 'Estante modulada em aço inox para armazenagem em cozinha profissional',
    segment: 'Armazenagem',
    scope: ['Fabricação sob medida'],
  },
]

/**
 * Registro que abre a seção da home, em faixa sangrada. É a fotografia de
 * maior resolução do acervo (1400 px) — a única que sustenta largura total sem
 * ampliação perceptível, e por isso não se repete em nenhuma outra seção.
 */
export const leadProject = projects.find((project) => project.id === 'cozinha-completa')!

/**
 * Seleção da home: **três** registros grandes, não seis miniaturas iguais.
 *
 * O critério é a fotografia, não a variedade de escopo: entram só imagens que
 * aguentam ser exibidas grandes (≥ 750 px) e que são registro de operação
 * instalada. Ficaram de fora as fotos de catálogo com fundo branco
 * (`estante-inox`, `fogao-industrial`) e os documentos, que já aparecem no
 * diagnóstico e no painel de níveis. A fotografia cuja origem está pendente
 * permanece fora de todos os dados públicos até confirmação.
 *
 * As duas primeiras são verticais e a terceira, horizontal: a variação de
 * proporção é o ritmo do mosaico. A lista completa fica em /projetos.
 */
export const featuredProjects = ['bar-inox', 'forno-combinado', 'camara-frigorifica']
  .map((id) => projects.find((project) => project.id === id)!)
  .filter(Boolean)
