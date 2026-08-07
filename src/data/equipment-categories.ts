import type { EquipmentCategory } from '@/types'

/**
 * Categorias apresentadas pelo benefício operacional antes da especificação
 * (referência RATIONAL — GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md §5.4).
 *
 * As listas descrevem tipos de equipamento que a Bianchini especifica e
 * fornece; não são catálogo de marca nem promessa de disponibilidade
 * imediata. Detalhamento por linha em /linhas-de-produtos.
 */
export const equipmentCategories: EquipmentCategory[] = [
  {
    id: 'coccao',
    name: 'Cocção',
    benefit:
      'Sustentar o pico sem fila na praça quente: capacidade dimensionada pelo volume real, não pela ficha técnica.',
    items: ['Fogões e char-broilers', 'Chapas e fritadeiras', 'Fornos combinados', 'Caldeirões e frigideiras basculantes'],
    image: '/images/projects/linha-de-fogoes.jpg',
    alt: 'Linha de fogões industriais com bancada de apoio em aço inox',
  },
  {
    id: 'refrigeracao',
    name: 'Refrigeração',
    benefit:
      'Cortar perda de insumo e manter a cadeia fria dentro da faixa, com armazenagem que acompanha o giro do estoque.',
    items: ['Câmaras frigoríficas', 'Refrigeradores e freezers verticais', 'Balcões refrigerados', 'Ultracongeladores'],
    image: '/images/projects/refrigeradores-verticais.jpg',
    alt: 'Refrigeradores verticais em aço inox alinhados em praça de produção',
  },
  {
    id: 'mobiliario',
    name: 'Mobiliário em inox',
    benefit:
      'Aproveitar cada metro do espaço existente: peças fabricadas sob medida, sem adaptação e sem improviso na obra.',
    items: ['Bancadas e mesas', 'Pias e cubas', 'Estantes e prateleiras', 'Armários e gaveteiros'],
    image: '/images/projects/mobiliario-inox.jpg',
    alt: 'Bancada em aço inox com gaveteiro, armários, pia dupla e prateleiras de parede',
  },
  {
    id: 'exaustao',
    name: 'Exaustão e ventilação',
    benefit:
      'Ambiente respirável e vistoria sem pendência: exaustão calculada junto com a linha de cocção, não depois dela.',
    items: ['Coifas e capelas', 'Dutos e filtros', 'Insuflamento e reposição de ar', 'Tratamento de gordura'],
    image: '/images/hero/linha-de-coccao.jpg',
    alt: 'Coifa em aço inox sobre linha de cocção em cozinha profissional',
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia de cocção',
    benefit:
      'Padronizar o resultado entre turnos e reduzir dependência de improviso, com processos gravados no equipamento.',
    items: ['Fornos combinados programáveis', 'Cocção assistida', 'Controle e registro de processo', 'Treinamento da equipe'],
    image: '/images/projects/forno-combinado.jpg',
    alt: 'Forno combinado profissional instalado em cozinha industrial',
  },
]
