/**
 * ============================================================
 * COPY OPERACIONAL DA HOME V2
 * ============================================================
 *
 * Redação desenvolvida no modo de entrega, cumprindo o contrato semântico
 * fixado no Gate 1 (`docs/v2/specs/V2-01-home-arquitetura.md`, item E) e a
 * composição aprovada no Gate 2 (`docs/v2/wireframes/`).
 *
 * REGRA DE ORIGEM — nenhuma afirmação nova sobre a empresa
 * -------------------------------------------------------
 * Todo fato citado aqui já existe no repositório e pode ser rastreado:
 *
 *   "dimensionado pelo volume real, não pela ficha técnica"
 *       → `src/data/equipment-categories.ts` (benefício de Cocção) e
 *         `src/data/faq.ts` ("Pelo volume real de produção, pelos horários de
 *         pico e pelo cardápio — não pela ficha técnica do fabricante")
 *   "especificamos e fornecemos"
 *       → `src/data/faq.ts`, `kitchensFaq[0]`; `src/data/rational.ts`
 *         ("Fornecido, instalado e comissionado pela Bianchini")
 *   "quem projeta, especifica"
 *       → `MASTER_BIANCHINI.md` §3.2 (princípio do pilar Projetos)
 *   "Do projeto à execução."
 *       → `MASTER_BIANCHINI.md` §2.2 (assinatura conceitual aprovada)
 *   entregáveis de projeto e frentes de diagnóstico
 *       → `src/data/scope-levels.ts`, `src/data/diagnosis.ts`
 *
 * O que **não** aparece, por não ter base verificável: percentual de economia,
 * prazo, preço, condição comercial ("direto de fábrica"), certificação, nome de
 * cliente, resultado de case, marca representada além da única confirmada
 * (Rational, em `rational.ts`). Ver `docs/v2/DECISIONS.md`, DEC-006.
 *
 * As métricas (18 anos, 3.000+ projetos, Brasil) continuam vindo de
 * `src/data/site.ts` — fonte única, com a pendência de confirmação do número
 * exato registrada lá e não resolvida aqui.
 */

export const homeHero = {
  eyebrow: 'Equipamentos para cozinha profissional',
  title: 'Equipamentos para cozinha profissional, dimensionados pela operação — não pela ficha técnica.',
  lead: 'Cocção, refrigeração, preparo, higienização, mobiliário em aço inox e exaustão: especificamos e fornecemos o equipamento certo para o volume real de produção. Projeto e consultoria entram quando a decisão precisa vir antes da compra.',
  primaryCta: { label: 'Solicitar orçamento de equipamentos', href: '/contato?intencao=equipamentos' },
  secondaryCta: { label: 'Conhecer projetos e consultoria', href: '#do-projeto-a-execucao' },
  /** Rótulo do seletor compacto que liga a primeira dobra à vitrine. */
  categoriesLabel: 'Categorias',
  media: {
    src: '/images/hero/hero-industrial-kitchen.png',
    alt: 'Cozinha industrial profissional em aço inox, com coifa contínua, luminárias suspensas e bancada central de produção',
    /** Legenda de aplicação: descreve o que está na fotografia, nada além. */
    caption: 'Cozinha industrial em aço inox — coifa contínua, bancada central e apoio de produção',
  },
} as const

export const homeCategoriesSection = {
  eyebrow: 'Categorias',
  title: 'O que a Bianchini especifica e fornece',
  lead: 'Seis frentes de equipamento para cozinha profissional. Escolha a que você precisa resolver — a cotação parte dela, não de um pacote fechado.',
  /**
   * Resposta à objeção mais frequente do público de alta intenção, transcrita
   * de `src/data/faq.ts` (`kitchensFaq[0]`) — não é copy nova.
   */
  objection: {
    question: 'Vende equipamento avulso ou só projeto completo?',
    answer:
      'Os dois formatos existem. Se a sua operação precisa de um equipamento específico, especificamos e fornecemos esse item.',
  },
  pendingNote: 'Conteúdo desta categoria em preparação. A frente já é atendida — fale com o comercial para especificação e cotação.',
} as const

export const homePillarsSection = {
  eyebrow: 'Integração',
  title: 'Do projeto à execução.',
  lead: 'As três frentes funcionam separadas ou juntas. Você contrata a que resolve o seu problema — integrar é uma opção, não uma condição.',
  equipment: {
    name: 'Equipamentos',
    statement: 'A frente principal: especificação técnica e fornecimento para a operação que você já tem ou vai abrir.',
    cta: { label: 'Solicitar orçamento de equipamentos', href: '/contato?intencao=equipamentos' },
    media: {
      src: '/images/projects/cozinha-completa.jpg',
      alt: 'Cozinha profissional em operação com fritadeiras, bancadas em inox, prateleiras suspensas e coifas',
    },
  },
  support: [
    {
      id: 'projetos',
      name: 'Projetos',
      statement: 'Quem projeta, especifica.',
      description: 'Layout, fluxo e dimensionamento antes de qualquer compra.',
      cta: { label: 'Fale com um projetista', href: '#projetos' },
    },
    {
      id: 'consultoria',
      name: 'Consultoria',
      statement: 'Diagnóstico da operação.',
      description: 'Leitura do que já funciona, do que trava e do que não precisa ser comprado.',
      cta: { label: 'Agendar diagnóstico', href: '#consultoria' },
    },
  ],
} as const

export const homeProjectsSection = {
  eyebrow: 'Projetos',
  title: 'Quem projeta, especifica.',
  lead: 'O desenho vem antes da compra: layout técnico, fluxo de produção e plantas complementares que instruem a obra e evitam o equipamento errado.',
  cta: { label: 'Fale com um projetista', href: '/contato?intencao=arquitetura' },
  secondaryCta: { label: 'Ver projetos entregues', href: '/projetos' },
  /**
   * Os dois materiais de projeto do acervo, com o tipo declarado no próprio
   * rótulo — render nunca é apresentado como obra entregue
   * (`docs/v2/DECISIONS.md`, DEC-008).
   */
  evidence: [
    {
      id: 'planta',
      kind: 'Documento de projeto',
      src: '/images/projects/planta-executiva.jpg',
      alt: 'Planta executiva em CAD de uma cozinha profissional com salão de atendimento',
      caption: 'Planta executiva com posicionamento de equipamentos, bancadas e circulação',
    },
    {
      id: 'estudo-3d',
      kind: 'Estudo 3D — não é obra executada',
      src: '/images/projects/projeto-3d.jpg',
      alt: 'Modelo tridimensional de cozinha profissional com bancadas e equipamentos em inox',
      caption: 'Modelo usado para validar alturas, acessos e ergonomia antes da fabricação',
    },
  ],
} as const

export const homeConsultingSection = {
  eyebrow: 'Consultoria',
  title: 'A cozinha liga, mas a operação não acompanha.',
  lead: 'Custo que aparece todo mês sem explicação, equipe que improvisa a cada turno, capacidade instalada que não corresponde ao que a operação vende. O diagnóstico começa pela leitura da operação real — não por uma proposta.',
  areasLabel: 'O que é analisado na visita técnica',
  outcomesLabel: 'O que o diagnóstico permite decidir',
  cta: { label: 'Agendar diagnóstico', href: '/contato?intencao=consultoria' },
  media: {
    src: '/images/projects/refrigeradores-verticais.jpg',
    alt: 'Refrigeradores verticais em aço inox e balcões refrigerados ao longo de uma praça de produção',
    caption: 'Capacidade instalada contra volume real: uma das seis frentes lidas na visita técnica',
  },
} as const

export const homeProofSection = {
  eyebrow: 'Prova',
  title: 'Operações entregues',
  lead: 'Registros fotográficos de operações que a Bianchini projetou, especificou, fabricou ou instalou. As legendas descrevem o que está na imagem — sem cliente, local ou prazo atribuídos.',
  cta: { label: 'Ver todos os projetos', href: '/projetos' },
  clientsLabel: 'Organizações atendidas',
  testimonialsLabel: 'Depoimentos',
} as const

export const homeAuthoritySection = {
  eyebrow: 'Quem conduz',
  title: 'Quem responde pela operação',
  cta: { label: 'Conhecer a trajetória', href: '/leonardo-bianchini' },
} as const

export const homeFinalCta = {
  eyebrow: 'Próximo passo',
  title: 'Diga o que a sua operação precisa resolver.',
  lead: 'O retorno parte do que você precisa hoje: um equipamento específico, um projeto completo ou a leitura de uma operação que já está rodando.',
  primary: { label: 'Solicitar orçamento de equipamentos', href: '/contato?intencao=equipamentos' },
  secondary: [
    { label: 'Fale com um projetista', href: '/contato?intencao=arquitetura' },
    { label: 'Agendar diagnóstico', href: '/contato?intencao=consultoria' },
  ],
  whatsappLabel: 'Conversar pelo WhatsApp',
} as const
