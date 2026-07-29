import type { NavItem } from '@/types'

/** Navegação principal — todos os destinos existem (âncoras válidas ou rotas reais). */
export const mainNav: NavItem[] = [
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Diferenciais', href: '/#diferenciais' },
  { label: 'Processo', href: '/#processo' },
  { label: 'Segmentos', href: '/#segmentos' },
  { label: 'Projetos', href: '/#projetos' },
  { label: 'Equipamentos', href: '/linhas-de-produtos' },
]

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'A Bianchini',
    items: [
      { label: 'Sobre a empresa', href: '/#sobre' },
      { label: 'Diferenciais', href: '/#diferenciais' },
      { label: 'Processo de trabalho', href: '/#processo' },
      { label: 'Fornecedor vs. parceria', href: '/#comparacao' },
      { label: 'Projetos', href: '/#projetos' },
      { label: 'Depoimentos', href: '/#depoimentos' },
    ],
  },
  {
    title: 'Segmentos',
    items: [
      { label: 'Restaurantes & bares', href: '/#segmentos' },
      { label: 'Hotéis & resorts', href: '/#segmentos' },
      { label: 'Padarias & confeitarias', href: '/#segmentos' },
      { label: 'Hospitais & institucional', href: '/#segmentos' },
      { label: 'Franquias & redes', href: '/#segmentos' },
      { label: 'Ambientes extremos', href: '/#segmentos' },
    ],
  },
  {
    title: 'Equipamentos',
    items: [
      { label: 'Todas as linhas', href: '/linhas-de-produtos' },
      { label: 'Mobiliário inox', href: '/linhas-de-produtos#mobiliario' },
      { label: 'Cocção', href: '/linhas-de-produtos#coccao' },
      { label: 'Refrigeração', href: '/linhas-de-produtos#refrigeracao' },
      { label: 'Exaustão & ventilação', href: '/linhas-de-produtos#exaustao' },
      { label: 'Forno combinado Rational', href: '/linhas-de-produtos/forno-combinado-rational' },
    ],
  },
]
