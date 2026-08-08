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
 * PRIMEIRA DOBRA — UM PALCO, TRÊS ESTADOS COMERCIAIS
 * ============================================================
 *
 * O visitante de tráfego pago precisa responder quatro perguntas em segundos: o
 * que a Bianchini faz, quais são as frentes, em qual delas o problema dele se
 * encaixa e o que fazer agora.
 *
 * A montagem anterior tentava responder as quatro **ao mesmo tempo**, com três
 * fotografias verticais de altura inteira lado a lado. Não funcionou: três cenas
 * disputando o mesmo campo de visão fazem cada uma perder escala, e nenhuma
 * consegue ser a cena. Aqui há uma cena por vez, no tamanho que uma fotografia
 * de operação real precisa ter, e os três caminhos ficam nomeados numa régua
 * editorial embaixo dela.
 *
 * Equipamentos lidera por ser o **estado inicial** — o que a página mostra a
 * quem chega, o que o `h1` diz e o que o CTA preenchido oferece. Não por
 * fotografia maior, mais clara ou mais saturada.
 *
 * ORIGEM DAS AFIRMAÇÕES — nada novo sobre a empresa
 * ------------------------------------------------
 *   seis frentes de equipamento ..... `MASTER_BIANCHINI.md` §3.1, DEC-007
 *   "volume real"/"ficha técnica" ... `equipment-categories.ts`, `faq.ts`
 *   "quem projeta, especifica" ...... `MASTER_BIANCHINI.md` §3.2
 *   layout/fluxo/dimensionamento .... `scope-levels.ts` nível 02
 *   "raramente começa no equipamento" ... `symptoms.ts`, a mesma afirmação que
 *                                     a seção de sintomas já publica
 *   fluxo, processo, custo .......... `diagnosis.ts` (`diagnosisAreas`)
 */
export const homeHero = {
  /**
   * Instrução do seletor. Fica **colada à régua**, não como linha própria acima
   * dela: é o rótulo do controle, e uma frase de largura inteira ali roubaria
   * altura da fotografia sem dizer nada que o controle já não diga.
   */
  railHint: 'Escolha o que sua operação precisa resolver',
  /**
   * H1 — título do **estado inicial**, portanto o `h1` que o servidor entrega e
   * que buscador e prévia de link leem. Quando o visitante troca de estado, o
   * mesmo `h1` passa a carregar o título daquele estado: um título de nível 1
   * por página, sempre visível e sempre descrevendo o que está na tela.
   *
   * ============================================================
   * COPY TRAVADA — NÃO ENCURTAR (2026-08-08)
   * ============================================================
   *
   * Este texto é **conteúdo aprovado do briefing de entrega**, não uma escolha
   * de redação deste arquivo. Uma rodada anterior o trocou por "Equipamentos
   * dimensionados para a sua operação." (46 caracteres) para resolver um
   * problema de composição: aos 49px de corpo que o `h1` tinha então, os 74
   * caracteres rendiam **quatro linhas** e um bloco de 209,7px em 1440 × 900,
   * empurrando lead e CTA para baixo do centro óptico.
   *
   * O problema era real; a correção estava no lugar errado. **Copy aprovada não
   * é variável de layout.** O ajuste vive agora na tipografia — o teto do corpo
   * do `h1` caiu de 3,5rem para 2,875rem no desktop —, e o título completo cabe
   * em três linhas com a mesma altura de bloco que a versão curta tinha em
   * quatro. Ver `HEADLINE_MIN` em `hero-stage.tsx` para a contagem medida.
   *
   * Ao mexer neste texto, remeça `HEADLINE_MIN`. Ao querer encurtá-lo, não:
   * peça a mudança a quem aprovou a copy.
   */
  title: 'Equipamentos para cozinha profissional, especificados para a sua operação.',
} as const

export interface HeroState {
  id: 'equipamentos' | 'projetos' | 'consultoria'
  /** Índice na régua — `01`, `02`, `03`. Ordem comercial, não cronológica. */
  number: string
  /** Rótulo na régua dos três caminhos. */
  name: string
  /** Complemento do rótulo, na régua. Não é slogan: é a situação do cliente. */
  cue: string
  /** Etiqueta acima do título. Nomeia a frente antes de o título ser lido. */
  eyebrow: string
  /** Título do estado. No estado inicial, é `homeHero.title`. */
  headline: string
  /** Uma frase — o que a Bianchini entrega nessa frente. */
  intent: string
  cta: { label: string; href: string }
  /** Evento de conversão, um por caminho. */
  event: 'hero_equipamentos_click' | 'hero_projetos_click' | 'hero_consultoria_click'
  media: {
    src: string
    alt: string
    /**
     * `photo` ....... fotografia real, de sangria, cobrindo o palco inteiro.
     * `document` .... material de projeto apresentado **em tamanho controlado**
     *                 sobre o palco, sem ampliação destrutiva do arquivo. Ver o
     *                 bloco "PROJETOS" logo abaixo: é uma limitação de acervo
     *                 declarada, não uma escolha de composição.
     */
    kind: 'photo' | 'document'
    /** Enquadramento do recorte dentro do palco (só `kind: 'photo'`). */
    objectPosition?: string
    /** Resolução real do arquivo, para conferência do `sizes` e do teto de escala. */
    intrinsic: string
    /** Legenda técnica curta — só `kind: 'document'`. */
    caption?: string
  }
}

/**
 * ============================================================
 * AS TRÊS IMAGENS — CADA UMA DIZ O SEU ESTADO SEM O TEXTO
 * ============================================================
 *
 * Critério: **o visitante tem de saber do que trata o palco antes de ler uma
 * palavra** — e as três precisam pertencer ao mesmo mundo visual, porque elas
 * ocupam o *mesmo* lugar, uma depois da outra. Uma imagem que salta de exposição
 * ou de matéria na troca destrói a leitura de composição única.
 *
 *   EQUIPAMENTOS .. `hero-industrial-kitchen.png` (**1672 × 941**, recorte
 *                   atualizado pelo gestor — o arquivo anterior era 1916 × 821).
 *                   A fotografia âncora do site: inox, coifa contínua, ilha de
 *                   produção e fornos, com escala de operação real. É ela que
 *                   define o alvo tonal dos outros dois estados, e é a única com
 *                   resolução para sangrar num palco de 1586px sem ampliação.
 *
 *   CONSULTORIA ... `operacao-comercial.png` (1448 × 1086). O balcão de
 *                   atendimento com PDV, pedidos embalados para retirada, louça
 *                   empilhada e a linha de produção acesa ao fundo — uma
 *                   operação **em funcionamento**, que é a condição de quem
 *                   procura diagnóstico. Não é cozinha vazia nem reunião
 *                   corporativa genérica: o que está em cena é o ponto onde
 *                   fluxo, processo e gargalo aparecem.
 *
 * ============================================================
 * PROJETOS — LIMITAÇÃO DE ACERVO, E A SOLUÇÃO ADOTADA
 * ============================================================
 *
 * **O acervo não tem material de projeto em alta resolução.** Levantamento
 * completo de `public/images/projects/` (2026-08-08):
 *
 *   projeto-3d.jpg .............. 900 × 395   ← arquivo real
 *   projeto-3d-recorte.jpg ...... 900 × 299   ← recorte do mesmo arquivo
 *   projeto-3d-hero.jpg ........ 2033 × 1027  ← **reamostragem 2,6× do real**
 *   planta-executiva.jpg ........ 900 × 393   ← arquivo real
 *   planta-executiva-recorte.jpg  900 × 293   ← recorte do mesmo arquivo
 *   planta-executiva-hero.jpg .. 2280 × 1179  ← **reamostragem do real**
 *
 * Nenhuma fotografia do acervo representa *projeto*: as demais são operações
 * construídas, que é a matéria do estado de Equipamentos — usá-las aqui daria
 * dois estados ilustrados pelo mesmo assunto.
 *
 * Descontando o corte de 118px à esquerda (onde o material de origem traz um
 * selo "02" gravado, que não pode ir para a primeira dobra), o detalhe **real**
 * do estudo 3D é de **782px de largura**. Sangrado num palco de 1440px, isso é
 * 1,84× de ampliação — foi exatamente o que produziu a cena lavada, cinza e sem
 * definição registrada na auditoria.
 *
 * A ordem de decisão pedida chega então ao último item: **reduzir a área visual
 * da imagem e aplicar composição documental, sem ampliar o arquivo.** É o que
 * `kind: 'document'` faz — o estudo entra como prancha ancorada ao canto do
 * palco, com teto de largura de renderização, sobre o mesmo fundo grafite. A
 * caixa do palco, a coluna de conteúdo, a régua e a faixa de métricas não mudam:
 * muda **o que preenche o palco**, que é a única variação que os três estados
 * têm permissão de ter.
 *
 * Nenhum desfoque pesado é usado para esconder resolução, e nada foi gerado,
 * redesenhado ou montado.
 *
 * **PENDÊNCIA ABERTA.** Uma exportação em alta do mesmo estudo (ou uma
 * fotografia real de prancha/obra em projeto) substitui isto trocando `src`,
 * `intrinsic` e `kind` para `'photo'` — nenhuma outra mudança.
 *
 * Tratamento tonal em `hero-stage.module.css` — mínimo, e declarado item a item.
 */
export const heroStates: HeroState[] = [
  {
    id: 'equipamentos',
    number: '01',
    name: 'Equipamentos',
    cue: 'Comprar, substituir ou especificar',
    eyebrow: 'Equipamentos para cozinhas profissionais',
    headline: homeHero.title,
    /*
      "instalação e comissionamento" não é afirmação nova: `src/data/rational.ts`
      já publica "Fornecido, instalado e comissionado pela Bianchini", e
      `faq.ts` (`kitchensFaq[0]`) publica "especificamos e fornecemos".
      "volume real de produção" é transcrição literal de `faq.ts`.
    */
    intent:
      'Da especificação à instalação e ao comissionamento, a Bianchini ajuda sua empresa a investir no equipamento certo para o volume real de produção.',
    /*
      Rótulo travado pelo briefing de entrega: "SOLICITAR ORÇAMENTO". Era
      "Solicitar especificação e orçamento" — mais preciso, mas mais longo e
      não é o texto aprovado. O mesmo vale para os outros dois CTAs: "Falar com
      um projetista" e "Agendar diagnóstico", literais.
    */
    cta: { label: 'Solicitar orçamento', href: '/contato?intencao=equipamentos' },
    event: 'hero_equipamentos_click',
    media: {
      kind: 'photo',
      src: '/images/hero/hero-industrial-kitchen.png',
      intrinsic: '1672x941',
      alt: 'Cozinha industrial profissional em aço inox, com coifa contínua, luminárias suspensas e bancada central de produção',
      /*
        62%: o terço esquerdo do arquivo é quase preto e é justamente onde a
        coluna de texto assenta. À direita estão a ilha em inox, as luminárias e
        os fornos — a matéria do estado. Subiu de 58% para 62% quando o gestor
        trocou o recorte do arquivo (1916 × 821 → 1672 × 941): o novo enquadre é
        mais alto e menos largo, então o mesmo percentual mostrava menos linha.
      */
      objectPosition: '62% center',
    },
  },
  {
    id: 'projetos',
    number: '02',
    name: 'Projetos',
    cue: 'Abrir, reformar ou reorganizar',
    eyebrow: 'Projetos para food service',
    headline: 'Abrir, reformar ou reorganizar começa pelo projeto.',
    /*
      "Layout, fluxo, infraestrutura e dimensionamento" são os entregáveis já
      publicados em `src/data/scope-levels.ts` (nível 02) — não uma lista nova.
    */
    intent:
      'Layout, fluxo, infraestrutura e dimensionamento definidos antes da compra e da implantação.',
    cta: { label: 'Falar com um projetista', href: '/contato?intencao=arquitetura' },
    event: 'hero_projetos_click',
    media: {
      kind: 'document',
      src: '/images/projects/projeto-3d-hero.jpg',
      /*
        2033 × 1027 é o arquivo; **782 × 395 é o detalhe real** (ver o bloco
        PROJETOS acima). O teto de largura de renderização no componente é
        derivado deste segundo número, não do primeiro.
      */
      intrinsic: '2033x1027 (detalhe real 782x395)',
      alt: 'Estudo 3D de projeto de cozinha profissional em vista axonométrica, com bancadas em inox, ilha refrigerada, prateleiras e a circulação entre os postos',
      /*
        A legenda declara o tipo do material. `docs/v2/DECISIONS.md`, DEC-008:
        render nunca é apresentado como obra executada.
      */
      caption: 'Estudo 3D de layout — material de projeto, não obra executada',
    },
  },
  {
    id: 'consultoria',
    number: '03',
    name: 'Consultoria',
    cue: 'Corrigir gargalos e melhorar resultados',
    eyebrow: 'Diagnóstico operacional',
    headline: 'Encontre a causa antes de investir na solução.',
    /*
      "fluxo, capacidade, processos e equipamentos" são quatro das seis frentes
      já publicadas em `src/data/diagnosis.ts` (`diagnosisAreas`).
    */
    intent:
      'A Bianchini analisa fluxo, capacidade, processos e equipamentos para indicar prioridades com mais segurança.',
    cta: { label: 'Agendar diagnóstico', href: '/contato?intencao=consultoria' },
    event: 'hero_consultoria_click',
    media: {
      kind: 'photo',
      src: '/images/hero/operacao-comercial.png',
      intrinsic: '1448x1086',
      alt: 'Balcão de atendimento com terminal de ponto de venda, pedidos embalados para retirada, louça empilhada e a linha de produção em aço inox acesa ao fundo',
      /*
        46%: em `center` o palco pega a planta e o vaso da esquerda e perde o
        balcão. Aqui a leitura é a operação — PDV, pedidos prontos e a produção
        ao fundo.
      */
      objectPosition: '46% center',
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
