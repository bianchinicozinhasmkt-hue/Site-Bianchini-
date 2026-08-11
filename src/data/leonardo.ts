import type { CareerMovement, FieldRecord, SkillDomain } from '@/types'

/**
 * Autoridade de Leonardo Bianchini — construída por evidência, não por adjetivo.
 *
 * ORIGEM DE CADA AFIRMAÇÃO
 * Tudo abaixo vem do site oficial (https://bianchinicozinhas.com.br/, bloco
 * "DESDE 2008 · LEONARDO BIANCHINI") ou do briefing aprovado. Nada é inferido.
 *
 * DELIBERADAMENTE AUSENTE, por não ter base verificável:
 * — número de cozinhas comercializadas ou implantadas por ele;
 * — datas intermediárias de carreira (só 2008 está confirmado);
 * — nomes dos fabricantes por onde passou;
 * — prêmios, rankings, tiragem ou desempenho do livro;
 * — qualquer resultado financeiro atribuído a um cliente.
 *
 * O site oficial diz "mais de 17 anos" e "desde 2008". Aqui a contagem de anos
 * não é repetida: a marca temporal é **2008**, que não envelhece no código. Os
 * anos aparecem a partir de `heroMetrics`/`scopeMetrics` (`src/data/site.ts`),
 * confirmados em **17** pelo comercial em 2026-08-11 — o mesmo que o site
 * oficial publica.
 */
export const leonardo = {
  name: 'Leonardo Bianchini',
  /** Descrição do próprio site oficial, com "Industrias" corrigido. */
  role: 'Especialista em cozinhas comerciais e industriais',
  scope: 'Foodservice (FS) e Quick Service Restaurants (QSR)',
  /** Único marco temporal confirmado. */
  since: '2008',
  path: '/leonardo-bianchini',
  /** Perfil oficial — único `sameAs` declarado no schema. */
  linkedin: 'https://www.linkedin.com/in/leonardo-bianchini-06842328/',
  /** Perfil pessoal — só na seção "Quem conduz", nunca no cabeçalho. */
  instagram: 'https://www.instagram.com/leonardo.d.bianchini/',
  /** Identificador exibido junto ao ícone — o link em si usa `instagram` acima. */
  instagramHandle: '@leonardo.d.bianchini',

  /**
   * Retrato recuperado do site oficial (foto-leonardo-site2.png), recortado na
   * caixa de alfa. É um recorte com fundo removido — funciona sobre
   * grafite, não sobre off-white, onde a camisa branca se dissolveria.
   * PENDENTE: fotografia profissional em alta resolução.
   */
  portrait: {
    src: '/images/team/leonardo-bianchini.png',
    alt: 'Leonardo Bianchini, de braços cruzados e camisa branca, em retrato de meio corpo',
    width: 900,
    height: 1528,
  },

  home: {
    eyebrow: 'Quem conduz o diagnóstico',
    title: 'Experiência prática do projeto ao pós-venda.',
    paragraphs: [
      'Leonardo Bianchini atua no setor de cozinhas profissionais e industriais desde 2008, conectando conhecimento técnico, operação, equipamentos e estratégia comercial.',
      'Sua experiência acompanha todo o ciclo do negócio: diagnóstico, viabilidade, fluxo, projeto, especificação, implantação, vendas e pós-venda.',
      'Essa visão integrada orienta o método da Bianchini: compreender o problema antes de recomendar a solução e direcionar cada investimento para o que realmente melhora a operação.',
    ],
    /** Editorial, em régua — não é grade de três cards. */
    competencies: [
      {
        title: 'Cozinhas industriais e food service',
        detail: 'Operações de diferentes portes, do restaurante independente à cozinha institucional.',
      },
      {
        title: 'Projetos, equipamentos e implantação',
        detail: 'Viabilidade, fluxo, layout, especificação técnica e acompanhamento de obra.',
      },
      {
        title: 'Estratégia comercial e desenvolvimento de fabricantes',
        detail: 'Leitura de mercado, estrutura de vendas e relação com a indústria do setor.',
      },
    ],
    cta: { label: 'Conhecer a trajetória de Leonardo', href: '/leonardo-bianchini' },
  },

  page: {
    eyebrow: 'Leonardo Bianchini',
    title: 'O olhar por trás do método Bianchini.',
    lead: 'Especialista em cozinhas profissionais e industriais, Leonardo conecta diagnóstico, projeto, equipamentos, operação e estratégia comercial para ajudar empresas de food service a fazer escolhas melhores e investir com mais segurança.',
  },

  thesis: {
    eyebrow: 'Tese de trabalho',
    title: 'Antes de recomendar, é preciso entender a operação.',
    lead: 'Equipamento não resolve problema de fluxo. Reforma não corrige dimensionamento errado. A ordem das decisões é o que separa investimento de gasto.',
    points: [
      {
        marker: '01',
        title: 'Diagnóstico',
        description:
          'A leitura começa dentro da operação, com a equipe em turno: volume, cardápio, espaço, instalação e processo. É o que revela a causa, e não apenas o sintoma.',
      },
      {
        marker: '02',
        title: 'Necessidades reais',
        description:
          'Separar o que precisa ser resolvido do que apenas parece urgente. Boa parte do que se pede no primeiro contato muda depois que a operação é medida.',
      },
      {
        marker: '03',
        title: 'Priorização',
        description:
          'Nem tudo entra no mesmo momento. A ordem das etapas é definida pelo impacto na operação e pela capacidade real de investimento do negócio.',
      },
      {
        marker: '04',
        title: 'Investimento',
        description:
          'Especificação técnica existe para dimensionar corretamente — evitar o equipamento sobredimensionado, o subdimensionado e o que não será usado.',
      },
      {
        marker: '05',
        title: 'Economia',
        description:
          'A economia aparece como consequência: menos retrabalho, menos desperdício, menos compra equivocada e menos adaptação depois da entrega.',
      },
      {
        marker: '06',
        title: 'Resultado operacional',
        description:
          'O critério final é o turno funcionando: fluxo sem cruzamento, equipe sem improviso e estrutura que acompanha o crescimento do negócio.',
      },
    ],
  },

  /**
   * Linha editorial, não cronologia. Só o marco de 2008 tem data — os demais
   * movimentos são rotulados pelo tipo de atuação, exatamente para não sugerir
   * uma sequência de anos que não foi confirmada.
   */
  trajectory: [
    {
      id: 'origem',
      marker: 'Desde 2008',
      title: 'Dentro do setor de cozinhas profissionais e industriais',
      description:
        'Atuação contínua na estruturação de operações de alimentação de diferentes portes e complexidades, sempre a partir da operação real — não do catálogo.',
    },
    {
      id: 'comercial',
      marker: 'Frente comercial',
      title: 'Vendas e desenvolvimento junto a fabricantes',
      description:
        'Trajetória comercial construída dentro da indústria de equipamentos de cozinha, o que deu leitura de mercado, de produto e de como o setor realmente decide uma compra.',
    },
    {
      id: 'tecnica',
      marker: 'Frente técnica',
      title: 'Do estudo de viabilidade à implantação',
      description:
        'Análise de fluxo e layout, desenvolvimento de projeto técnico conforme a RDC 216 da Anvisa e especificação de equipamentos, exaustão e câmaras frigoríficas.',
    },
    {
      id: 'campo',
      marker: 'Em campo',
      title: 'Operações de restaurantes a hospitais',
      description:
        'Participação na implantação de cozinhas para restaurantes, pizzarias, bares, hotéis, hospitais, cozinhas industriais e operações corporativas.',
    },
    {
      id: 'bianchini',
      marker: 'Hoje',
      title: 'À frente da Bianchini Cozinhas Profissionais',
      description:
        'Liderança de uma operação que conecta consultoria estratégica, projeto técnico, equipamentos e acompanhamento de implantação sob uma mesma responsabilidade.',
    },
    {
      id: 'autoria',
      marker: 'Autoria',
      title: 'Publicação do livro sobre vendas no setor',
      description:
        'Sistematização da experiência comercial em cozinhas industriais e profissionais, da prospecção ao pós-venda, em formato de livro.',
    },
  ] satisfies CareerMovement[],

  /**
   * Onze frentes agrupadas em três domínios sobre uma linha contínua — não uma
   * grade de onze cards. O agrupamento é o argumento: as frentes só valem
   * porque se comunicam entre si.
   */
  skillMap: [
    {
      id: 'operacao',
      title: 'Operação',
      summary: 'O que acontece no turno, antes de qualquer desenho.',
      skills: ['Diagnóstico de operação', 'Fluxo e layout', 'Processos'],
    },
    {
      id: 'projeto',
      title: 'Projeto e equipamentos',
      summary: 'A tradução técnica do que a operação precisa.',
      skills: [
        'Projeto técnico',
        'Equipamentos',
        'Exaustão e refrigeração',
        'Implantação',
      ],
    },
    {
      id: 'mercado',
      title: 'Indústria e mercado',
      summary: 'De onde o equipamento vem e como o setor decide.',
      skills: ['Chão de fábrica', 'Vendas', 'Pós-venda', 'Marketing e crescimento'],
    },
  ] satisfies SkillDomain[],

  /** Segmentos citados no site oficial. */
  sectors: [
    'Restaurantes',
    'Pizzarias',
    'Bares',
    'Hotéis',
    'Hospitais',
    'Cozinhas industriais',
    'Operações corporativas',
    'Fabricantes de equipamentos',
  ],

  /**
   * Registros de campo recortados do mosaico SELFS-2.png do site oficial, em
   * resolução nativa (~190px). São exibidos pequenos, como contact sheet — não
   * são ampliados. Sem cliente, local ou data associados, conforme a regra de
   * conteúdo do projeto.
   * PENDENTE: fotografia profissional de campo em alta resolução.
   */
  fieldRecords: [
    {
      src: '/images/team/leonardo-forno-combinado.jpg',
      alt: 'Leonardo Bianchini ao lado do painel de um forno combinado',
      caption: 'Equipamento',
    },
    {
      src: '/images/team/leonardo-visita-de-fabrica.jpg',
      alt: 'Leonardo Bianchini de capacete de segurança em visita industrial',
      caption: 'Visita de fábrica',
    },
    {
      src: '/images/team/leonardo-linha-de-producao.jpg',
      alt: 'Leonardo Bianchini em galpão de linha de produção de equipamentos',
      caption: 'Chão de fábrica',
    },
    {
      src: '/images/team/leonardo-camara-frigorifica.jpg',
      alt: 'Leonardo Bianchini diante da porta de uma câmara frigorífica',
      caption: 'Câmara frigorífica',
    },
  ] satisfies FieldRecord[],

  /**
   * Temas de trabalho, não artigos. Nenhum conteúdo foi publicado ainda — a
   * seção declara isso abertamente em vez de listar peças inexistentes.
   */
  contentTopics: [
    {
      title: 'Escolhas de equipamentos',
      description: 'Como dimensionar sem sobrar capacidade ociosa nem faltar produção no pico.',
    },
    {
      title: 'Erros de fluxo',
      description: 'Cruzamento de sujo e limpo, retorno de percurso e gargalos criados no papel.',
    },
    {
      title: 'Desperdício',
      description: 'Onde a perda se instala: no processo, no armazenamento e na especificação.',
    },
    {
      title: 'Vendas no setor',
      description: 'Da prospecção ao fechamento em um mercado técnico e de ciclo longo.',
    },
    {
      title: 'Implantação',
      description: 'O que decide a entrega: compatibilização, cronograma e acompanhamento de obra.',
    },
    {
      title: 'Gestão de fabricantes',
      description: 'Estrutura comercial, canal e relação entre indústria e projeto.',
    },
  ],

  finalCta: {
    title: 'Transforme experiência em decisões melhores para sua operação.',
    text: 'Converse com a Bianchini para identificar gargalos, definir prioridades e construir uma solução adequada à realidade do seu negócio.',
    label: 'Solicitar diagnóstico',
    href: '/contato',
  },
} as const

/**
 * Livro de Leonardo Bianchini.
 *
 * PENDENTE DE CONFIRMAÇÃO — não localizado em nenhuma fonte pública em
 * 31/07/2026 (site oficial, página de mentorias e busca aberta): link oficial
 * de compra, ano, editora ou autopublicação e ISBN.
 *
 * `cover` foi recebida do comercial em 2026-08-03 (arquivo real, 1024×1536,
 * salvo em `public/images/book/dominando-vendas-equipamentos-cozinha.png`) —
 * `BookCover` já troca a composição tipográfica pela imagem sozinho quando
 * este campo deixa de ser `null`, sem precisar editar o componente.
 * `purchaseUrl` segue nulo: sem link oficial confirmado, nenhum CTA "Ver na
 * Amazon" é renderizado — o único CTA do bloco leva à página de Leonardo.
 *
 * Proibido: chamar de bestseller, atribuir prêmio, ranking ou tiragem.
 */
export const book = {
  title: 'Dominando as Vendas de Equipamentos de Cozinhas Industrial e Profissional',
  subtitle: 'Estratégias completas: da captação ao pós-venda',
  author: 'Leonardo Bianchini',
  /** Selo textual aprovado — sem estrela, ranking ou premiação. */
  seal: 'Da captação ao pós-venda',
  eyebrow: 'Autor e especialista do setor',
  headline: 'Conhecimento de mercado transformado em método.',
  text: 'Autor de “Dominando as Vendas de Equipamentos de Cozinhas Industrial e Profissional”, Leonardo Bianchini sistematizou sua experiência da prospecção ao pós-venda — o mesmo olhar comercial e consultivo aplicado pela Bianchini na análise de operações, equipamentos e oportunidades.',
  synopsis:
    'O livro reúne, em uma sequência única, o percurso comercial de quem vende equipamento para cozinha industrial e profissional: entender o mercado, encontrar a oportunidade, chegar à empresa certa, ouvir a necessidade antes de propor, desenhar a solução, negociar, fechar e sustentar a relação depois da entrega.',
  /** Temas que o livro aborda publicamente, conforme o briefing. */
  topics: [
    'Mercado de cozinhas industriais',
    'Identificação de oportunidades',
    'Prospecção',
    'Abordagem de empresas',
    'Entendimento das necessidades',
    'Soluções personalizadas',
    'Negociação',
    'Fechamento',
    'Pós-venda',
    'Fidelização',
  ],
  /** Relação entre o livro e o trabalho da empresa. */
  relation:
    'A mesma leitura comercial que estrutura o livro é a que a Bianchini aplica ao analisar uma operação: entender a necessidade real antes de recomendar equipamento, e tratar o pós-venda como parte do projeto, não como consequência dele.',
  cover: '/images/book/dominando-vendas-equipamentos-cozinha.png' as string | null,
  /** PENDENTE: link oficial de compra. Não usar link não oficial. */
  purchaseUrl: null as string | null,
  /** PENDENTE: ano, editora/autopublicação e ISBN. */
  year: null as string | null,
  publisher: null as string | null,
  isbn: null as string | null,
} as const

/**
 * Estrutura preparada para um slide do livro na primeira dobra — pedido
 * explicitamente pelo comercial, ainda **não implementado na hero**.
 *
 * `hero-section.tsx` é uma dobra única, com geometria travada em `--u`
 * (medida do mockup) e uma sequência de entrada que não se repete — não existe
 * mecanismo de carrossel/slide ali, e criar um agora seria uma mudança de
 * arquitetura da hero, fora do escopo de uma correção pontual. Os dados abaixo
 * deixam a estrutura pronta para quando essa decisão for tomada (se a hero vai
 * virar carrossel, ou se este conteúdo entra como uma seção separada).
 *
 * PENDENTE, nesta ordem de bloqueio:
 * 1. Decisão de produto: como o "slide" é implementado (carrossel na hero vs.
 *    seção própria) — não decidido aqui.
 * 2. ~~`book.cover`~~ — resolvido em 2026-08-03, ver `book` acima.
 * 3. `book.purchaseUrl` (link oficial da Amazon) — ainda `null`; **não usar
 *    URL não oficial ou adivinhada**.
 *
 * Enquanto (1) e (3) não existirem, nenhum componente deve renderizar este
 * slide na hero nem um CTA "Ver na Amazon" — ficariam incompletos ou quebrados.
 */
export const heroBookSlide = {
  eyebrow: 'Autor e especialista do setor',
  headline: 'Formamos equipes de vendas em equipamentos gastronômicos. Método publicado, resultado comprovado.',
  portrait: leonardo.portrait,
  cover: book.cover,
  ctaLabel: 'Ver na Amazon',
  purchaseUrl: book.purchaseUrl,
  /** `true` enquanto (1) ou (3) da lista acima não estiverem resolvidos. */
  pending: true,
} as const
