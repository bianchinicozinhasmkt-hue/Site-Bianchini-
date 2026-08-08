/**
 * Indústria do inox — consultoria e gestão para fábricas de equipamentos de
 * cozinha profissional. Público e proposta diferentes do resto da home (fala
 * com quem fabrica, não com quem opera uma cozinha), por isso é seção própria
 * e separada dos três pilares (`pillars.ts`), que descrevem a estrutura da
 * Bianchini para o cliente operador.
 *
 * A imagem usada na seção (`industry-inox-section.tsx`) reaproveita
 * `/images/projects/estante-inox.jpg`, já usada como imagem de capa de
 * `manufacturersPage` em `pages.ts` — um produto genérico em inox, sem
 * cliente, obra ou fábrica identificada, conforme pedido.
 */
export const industry = {
  eyebrow: 'Indústria do inox',
  title: 'Sua fábrica produz bem. E vende bem?',
  text: 'Consultoria e gestão para fábricas de equipamentos de cozinha profissional. Atuamos dos dois lados do portão: o processo que produz e a operação que vende.',
  deliverables: [
    {
      number: '01',
      title: 'Processo produtivo',
      description:
        'Diagnóstico de chão de fábrica: gargalos, refugo de chapa, retrabalho e custo real por peça.',
    },
    {
      number: '02',
      title: 'Estruturação comercial',
      description:
        'Política de preço e margem, definição de canais, rede de representantes e distribuidores.',
    },
    {
      number: '03',
      title: 'Time de vendas',
      description:
        'Formação técnica e comercial: do conhecimento do produto ao fechamento e ao pós-venda.',
    },
    {
      number: '04',
      title: 'CRM e previsibilidade',
      description:
        'Funil, metas e acompanhamento. Sair da venda por relacionamento e chegar à venda por processo.',
    },
  ],
  image: {
    src: '/images/projects/estante-inox.jpg',
    alt: '',
  },
  ctas: {
    primary: { label: 'Agendar diagnóstico', href: '/contato?intencao=fabricantes' },
    secondary: { label: 'Conheça o livro', href: '/#livro' },
  },
} as const
