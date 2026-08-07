import type { Testimonial } from '@/types'

/**
 * Depoimentos publicados no site oficial (https://bianchinicozinhas.com.br/,
 * bloco "DEPOIMENTOS"), recuperados do HTML da própria página em 31/07/2026.
 * São os dois únicos com autor, cargo e organização identificáveis.
 *
 * TEXTO: transcrição do original, com correção apenas de ortografia e de
 * omissões evidentes — o sentido não foi alterado e nada foi acrescentado.
 * As versões anteriores destes dois depoimentos neste repositório eram
 * reescritas, não transcrições; foram substituídas pelo original corrigido.
 *
 *   Walney Cerqueira
 *     "impar" → "ímpar" · "concepcao" → "concepção"
 *     "conhecimento ímpar food service" → "… ímpar em food service"
 *     "ajudando transformar" → "ajudando a transformar"
 *
 *   João Carlos R. Peres
 *     "a muitos anos" → "há muitos anos"
 *     "de cozinhas que ele passou" → "de cozinhas por onde ele passou"
 *     "ajudando as companhia crescerem" → "ajudando as companhias a crescerem"
 *
 * PENDENTE DE CONFIRMAÇÃO com os depoentes, antes da publicação:
 * cargo atual, texto final, autorização de uso do depoimento, do retrato e da
 * menção à organização. Os retratos vieram de CERQUEIRA.png e JOAO-PERES.png,
 * do próprio site oficial.
 *
 * Para incluir novos depoimentos, use autor, cargo e organização reais. Sem
 * autoria identificável, não entra.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'walney-cerqueira',
    quote:
      'Leonardo Bianchini é um profissional muito qualificado, com conhecimento ímpar em food service. Da concepção do negócio até a implantação, atuando de forma efetiva e ajudando a transformar sonhos em realidade.',
    author: 'Walney Cerqueira',
    role: 'Gerente Nacional de Vendas',
    organization: 'Cozil Equipamentos',
    initials: 'WC',
    photo: '/images/testimonials/walney-cerqueira.jpg',
    photoAlt: 'Retrato de Walney Cerqueira',
    context: 'Sobre a atuação de Leonardo da concepção do negócio à implantação',
  },
  {
    id: 'joao-carlos-peres',
    quote:
      'Conheço o Leonardo Bianchini há muitos anos, pude acompanhar a trajetória de sucesso dele na área de vendas, por todos os fabricantes de cozinhas por onde ele passou, sempre tendo excelente desempenho, ajudando as companhias a crescerem e fazendo muitos amigos.',
    author: 'João Carlos R. Peres',
    role: 'Diretor-Presidente',
    organization: 'SINDAL — Sindicato dos Fabricantes de Equipamentos de Cozinhas Industrial',
    initials: 'JP',
    photo: '/images/testimonials/joao-carlos-peres.jpg',
    photoAlt: 'Retrato de João Carlos R. Peres',
    context: 'Sobre a trajetória comercial de Leonardo junto a fabricantes do setor',
  },
]
