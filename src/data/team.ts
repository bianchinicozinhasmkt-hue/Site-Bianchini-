import { leonardo } from '@/data/leonardo'

/**
 * Os dois responsáveis mostrados na seção "Quem conduz" da home
 * (`leadership-section.tsx`). Leonardo já tem um perfil extenso em
 * `leonardo.ts` (autoridade, trajetória, livro) — aqui ele entra só com o
 * resumo de bullets pedido para esta seção específica, sem duplicar dado:
 * nome, retrato e cargo continuam vindo de `leonardo`.
 *
 * Guilherme Beghini é conteúdo novo — não existia em nenhum lugar do
 * repositório antes desta passagem. Os bullets abaixo são os fornecidos
 * diretamente pelo comercial da Bianchini; nada foi inferido ou completado.
 */
export const leadershipTeam = {
  leonardo: {
    name: leonardo.name,
    role: 'Projetos e Equipamentos',
    portrait: leonardo.portrait,
    /** Só aqui — o Instagram pessoal não entra no cabeçalho. */
    instagram: leonardo.instagram,
    instagramHandle: leonardo.instagramHandle,
    /*
      A credencial de autoria **saiu desta lista** em 2026-08-04: o livro
      passou a ter um bloco próprio dentro do dossiê de Leonardo, com capa,
      título e selo (`leadership-section.tsx`). Mantê-la aqui repetiria o
      mesmo fato duas vezes na mesma faixa, a poucos centímetros de distância.
      O dado não foi removido do projeto — continua em `book`, `leonardo.ts`.
    */
    bullets: [
      '17 anos estruturando cozinhas profissionais e industriais.',
      'Viabilidade, layout, fluxo e projeto técnico conforme a RDC 216.',
      'Especificação de equipamentos, exaustão e câmaras frigoríficas.',
      'Carreira comercial dentro dos maiores fabricantes do setor.',
    ],
  },
  guilherme: {
    name: 'Guilherme Beghini',
    role: 'Operação Comercial',
    portrait: {
      src: '/images/team/foto-recortada-guilherme.png',
      alt: 'Guilherme Beghini, em retrato de meio corpo',
      width: 837,
      height: 1254,
    },
    /** Abertura obrigatória, fornecida literalmente — não reescrever. */
    opening: 'Quem estrutura a sua operação comercial já foi dono de restaurante por 8 anos.',
    /**
     * Lista reduzida em 2026-08-03, a pedido do comercial — texto literal,
     * substitui a lista anterior por inteiro. Não completar com as
     * credenciais antigas ("Há 30 anos em gestão", liderança de equipes,
     * operações próprias, formação acadêmica): saíram por decisão do
     * comercial, não por edição editorial.
     */
    bullets: [
      'Implantação e desenvolvimento de CRM e ERP, do desenho do processo à especificação com o time de desenvolvimento.',
      'Estruturação e formação de time comercial, de três a trezentos vendedores.',
      'Geração de demanda e gestão de campanhas.',
      'IA aplicada à previsibilidade de vendas e à automação da rotina comercial.',
    ],
  },
} as const
