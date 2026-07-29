import type { Testimonial } from '@/types'

/**
 * Depoimentos reais, com autor e empresa identificáveis, recuperados do site
 * anterior. O depoimento genérico atribuído a "Marina Silva · Rede Hospitalar"
 * foi removido por ser placeholder sem origem verificável.
 *
 * Para incluir novos depoimentos, adicione objetos com autor e cargo reais.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'walney-cerqueira',
    quote:
      'Leonardo é um profissional raro em food service. Entende a operação de verdade — não só vende equipamento. Da concepção do projeto à implantação, executa com precisão, transformando briefing em realidade.',
    author: 'Walney Cerqueira',
    role: 'Gerente Nacional de Vendas · COZIL Equipamentos',
    initials: 'WC',
  },
  {
    id: 'joao-carlos-peres',
    quote:
      'Acompanhei Leonardo em todos os fabricantes de cozinha por onde passou. Sempre se destacou — não por vender mais, mas por construir relações de confiança e entregar resultado real para os clientes.',
    author: 'João Carlos R. Peres',
    role: 'Diretor Presidente · SINDAL',
    initials: 'JP',
  },
]
