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
 * As métricas continuam vindo de `src/data/site.ts` — fonte única. A de
 * "projetos entregues" está **filtrada** desta Home enquanto o número não for
 * confirmado pelo comercial (ver `homeHeroMetrics`, logo abaixo).
 */
import type { Metric } from '@/types'
import { heroMetrics } from '@/data/site'

/**
 * ============================================================
 * MÉTRICAS DA PRIMEIRA DOBRA — SÓ AS CONFIRMADAS
 * ============================================================
 *
 * `heroMetrics` (`src/data/site.ts`) traz três entradas. Duas são fatos
 * confirmados e continuam: **18 anos de atuação** e **abrangência Brasil**
 * (`CLAUDE.md`, "Dados confirmados como reais"; `contact.coverage`).
 *
 * A terceira — **"3.000+ projetos entregues"** — foi removida na origem: desde
 * a limpeza de bloqueadores de release ela não existe mais em `heroMetrics`
 * nem em `scopeMetrics`, e portanto não é renderizada em nenhuma rota pública.
 * O motivo está registrado em `src/data/site.ts`, "MÉTRICAS PÚBLICAS":
 * divergência não resolvida entre "1.000" e "3.000" em material fora do
 * código, sem confirmação comercial (`MASTER_BIANCHINI.md` §20, DEC-006).
 *
 * **Nenhum número substituto foi criado.**
 *
 * ESTE FILTRO CONTINUA AQUI DE PROPÓSITO
 * --------------------------------------
 * Ele é hoje redundante — o rótulo que ele remove já não existe na origem — e
 * é exatamente por isso que vale mantê-lo: se a métrica voltar a `site.ts`
 * antes de a confirmação comercial chegar, a Home continua não a publicando.
 * A rede de proteção custa uma linha e o modo de falha que ela cobre é
 * publicar um número inventado na primeira dobra.
 *
 * Ao religar a métrica com o valor confirmado, retire o rótulo desta lista.
 */
const METRICAS_PENDENTES_DE_CONFIRMACAO = ['projetos entregues']

export const homeHeroMetrics: Metric[] = heroMetrics.filter(
  (metric) => !METRICAS_PENDENTES_DE_CONFIRMACAO.includes(metric.label),
)

/**
 * ============================================================
 * PRIMEIRA DOBRA — TRÊS PILARES EM UMA COMPOSIÇÃO SÓ
 * ============================================================
 *
 * O visitante de tráfego pago precisa responder quatro perguntas em segundos:
 * o que a Bianchini faz, quais são as frentes, em qual delas o problema dele
 * se encaixa e o que fazer agora. Por isso cada pilar carrega **a pergunta do
 * cliente**, não uma descrição institucional da empresa.
 *
 * A ordem é a hierarquia comercial (DEC-001) e está expressa em área, posição,
 * contraste e tipo de CTA — não só no texto. Só Equipamentos recebe botão
 * preenchido; Projetos e Consultoria recebem CTA textual.
 *
 * ORIGEM DAS AFIRMAÇÕES — nada novo sobre a empresa
 * ------------------------------------------------
 *   seis frentes de equipamento .... `MASTER_BIANCHINI.md` §3.1, DEC-007
 *   "volume real"/"ficha técnica" .. `equipment-categories.ts`, `faq.ts`
 *   "quem projeta, especifica" ..... `MASTER_BIANCHINI.md` §3.2
 *   layout/fluxo/dimensionamento ... `scope-levels.ts` nível 02
 *   gargalo, processo, equipe ...... `diagnosis.ts` (`diagnosisAreas`)
 */
export const homeHero = {
  eyebrow: 'Cozinhas profissionais e food service',
  /**
   * H1 — **Equipamentos lidera, e o H1 não repete os três pilares.**
   *
   * A redação anterior ("Equipamentos, projeto e consultoria para cozinhas
   * profissionais.") nomeava as três frentes exatamente onde os três painéis
   * logo abaixo já as nomeiam: o visitante lia "Equipamentos, Projetos,
   * Consultoria" duas vezes em 300px, e o H1 gastava a sua única chance
   * repetindo o que a composição já dizia melhor.
   *
   * Aqui o H1 posiciona a frente principal e qualifica a oferta
   * ("especificados para a sua operação" — o mesmo critério de dimensionamento
   * por volume real que a proposta de Equipamentos já declara), e os três
   * pilares abaixo passam a **explicar as três entradas** em vez de ecoar o
   * título. Nenhum fato empresarial novo é afirmado.
   */
  title: 'Equipamentos para cozinha profissional, especificados para a sua operação.',
} as const

export interface HeroPillar {
  id: 'equipamentos' | 'projetos' | 'consultoria'
  index: string
  name: string
  /** A pergunta do cliente que este pilar responde. */
  question: string
  /** Proposta curta — o que a Bianchini entrega nessa frente. */
  proposition: string
  cta: { label: string; href: string }
  /** Evento de conversão, um por caminho. */
  event: 'hero_equipamentos_click' | 'hero_projetos_click' | 'hero_consultoria_click'
  media: {
    src: string
    alt: string
    /**
     * Enquadramento do recorte. As duas fotografias de projeto do acervo têm um
     * numeral ("01"/"02") gravado no canto superior esquerdo pelo material de
     * origem; empurrar o enquadramento para a direita mantém esse canto fora do
     * painel, sem precisar editar o arquivo.
     */
     objectPosition?: string
    /** Rótulo de tipo, quando a imagem não é fotografia de operação. */
    kind?: string
  }
}

export const heroPillars: HeroPillar[] = [
  {
    id: 'equipamentos',
    index: '01',
    name: 'Equipamentos',
    question: 'Preciso comprar ou especificar equipamentos.',
    proposition:
      'Cocção, refrigeração, preparo, higienização, inox e exaustão — dimensionados pelo volume real da operação, não pela ficha técnica.',
    cta: { label: 'Solicitar orçamento', href: '/contato?intencao=equipamentos' },
    event: 'hero_equipamentos_click',
    media: {
      src: '/images/hero/hero-industrial-kitchen.png',
      alt: 'Cozinha industrial profissional em aço inox, com coifa contínua, luminárias suspensas e bancada central de produção',
    },
  },
  {
    id: 'projetos',
    index: '02',
    name: 'Projetos',
    question: 'Vou abrir, reformar ou reorganizar uma cozinha.',
    proposition: 'Layout, fluxo, dimensionamento e especificação antes da compra. Quem projeta, especifica.',
    cta: { label: 'Falar com um projetista', href: '/contato?intencao=arquitetura' },
    event: 'hero_projetos_click',
    media: {
      src: '/images/projects/projeto-3d.jpg',
      alt: 'Modelo tridimensional de cozinha profissional com bancadas, refrigeração e equipamentos em inox',
      objectPosition: '68% center',
      kind: 'Estudo 3D',
    },
  },
  {
    id: 'consultoria',
    index: '03',
    name: 'Consultoria',
    question: 'Minha operação já roda, mas trava.',
    proposition: 'Diagnóstico de fluxo, processo, equipe, cardápio e custo — para achar a causa antes de comprar qualquer coisa.',
    cta: { label: 'Agendar diagnóstico', href: '/contato?intencao=consultoria' },
    event: 'hero_consultoria_click',
    media: {
      src: '/images/projects/camara-frigorifica.jpg',
      alt: 'Interior de câmara frigorífica com caixas empilhadas em estantes e evaporador de teto',
      objectPosition: '38% center',
    },
  },
]

/** Ação secundária da dobra — fica fora dos painéis para não aninhar links. */
export const heroSecondary = {
  label: 'Ver as seis categorias de equipamento',
  href: '#equipamentos',
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
  /**
   * Rótulo e ressalva transcritos da afirmação que a V1 **já publica** sobre os
   * mesmos logos (`trust-section.tsx`: "Marcas de operações atendidas ao longo
   * de 18 anos — exibidas mediante autorização"). Uma versão anterior deste
   * arquivo dizia "Organizações atendidas", que afirma um pouco mais (que toda
   * marca da faixa é uma organização atendida, e não uma marca de operação
   * atendida) e omitia a ressalva de autorização. Reusar o texto vigente evita
   * criar afirmação nova sobre conteúdo que ainda depende de confirmação.
   */
  clientsLabel: 'Marcas de operações atendidas',
  clientsNote: 'Exibidas mediante autorização.',
  testimonialsLabel: 'Depoimentos',
} as const

/**
 * ============================================================
 * O QUE A HOME PODE PUBLICAR HOJE
 * ============================================================
 *
 * Interruptor de divulgação, não de layout: separa "o dado existe no
 * repositório" de "o dado está autorizado a aparecer em público". Enquanto for
 * `false`, o bloco correspondente simplesmente não é montado — o dado
 * permanece intacto em `src/data/`, e religar é trocar este booleano.
 *
 * `testimonials`: os dois depoimentos de `src/data/testimonials.ts` são
 * transcrições do site oficial, mas o próprio arquivo registra como **pendente
 * de confirmação** o cargo atual, o texto final e a autorização de uso do
 * depoimento, do retrato e da menção à organização. Até a reconfirmação
 * comercial, eles ficam fora da composição pública da Home.
 *
 * Escopo desta decisão: **a Home V2.** As rotas herdadas da V1 (`/sobre`,
 * `/projetos`, `/leonardo-bianchini`, `/solucoes/consultoria-para-restaurantes`)
 * continuam montando `TestimonialsSection` como antes — mexer nelas nesta etapa
 * seria alterar a V1 congelada por conta própria. A pendência está reportada
 * para decisão humana.
 */
export const homeDisclosure: { testimonials: boolean } = {
  testimonials: false,
}

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
