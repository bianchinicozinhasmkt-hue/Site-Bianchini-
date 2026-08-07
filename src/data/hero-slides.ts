import { RulerIcon, TrendingUpIcon, WrenchIcon } from '@/components/ui/icons'
import type { IconType } from '@/types'

/**
 * Os três slides do carrossel da hero — um por pilar (`src/data/pillars.ts`).
 * Copy fornecida pelo comercial; nada foi inventado ou completado aqui.
 *
 * Correção de 2026-08-03: os três slides usam o mesmo tratamento (fotografia
 * real, painel diagonal) — antes o slide 3 misturava o retrato de Guilherme
 * com a capa do livro num painel escuro à parte, o que quebrava a
 * consistência visual entre slides e misturava dois assuntos (a autoridade
 * de Leonardo, autor do livro, dentro do slide de Operação Comercial, que é
 * a frente de Guilherme). O livro segue fora da hero por decisão do gestor —
 * continua íntegro em `credibility-section.tsx`.
 *
 * `grade` marca a única foto com a curva de cor calibrada para o mockup
 * aprovado (`hero-industrial-kitchen.png` — é literalmente a fotografia do
 * mockup). Aplicar essa curva a outro arquivo deslocaria a cor dele para um
 * lado que não foi medido; por isso as outras fotos não a usam.
 *
 * DOIS TEXTOS DE APOIO, UM POR LADO DA DOBRA (2026-08-05)
 * -------------------------------------------------------
 * O módulo de pilares mudou de lado: identificação e seletor foram para a
 * coluna clara, abaixo das métricas, e a fotografia passou a receber um bloco
 * editorial. Cada lado carrega um texto com papel distinto:
 *
 *   `context` .... **coluna esquerda**, colado à identificação do pilar. É o
 *                  resumo de uma linha — o que o pilar é, em uma frase, para
 *                  ser lido junto do seletor sem competir com o título.
 *   `detail` ..... **sobre a fotografia** (desktop) e dentro da faixa grafite
 *                  (mobile). É o texto que explica o pilar: o raciocínio
 *                  operacional e comercial por trás dele.
 *
 * Nenhum dos dois repete o `title` da coluna esquerda de propósito: o título
 * nomeia a promessa do pilar, o `detail` diz por que ela se sustenta.
 *
 * ORIGEM DE `detail`: condensação de `src/data/pillars.ts` (descrição de cada
 * pilar) somada ao `text` do próprio slide. Nenhum número, percentual, prazo,
 * cliente ou resultado novo entra aqui — as três frentes descritas (projeto
 * antes da compra, especificação pela operação, estrutura comercial ligada à
 * capacidade) já são as que o site afirma em `pillars.ts`, `solutions.ts` e
 * `pages.ts`.
 *
 * No mobile o `detail` **substitui** o `context` em vez de somar-se a ele: em
 * coluna única os dois diriam a mesma coisa duas vezes, e o mais explicativo é
 * o que serve melhor quando não há segunda coluna para dividir o assunto.
 *
 * `cta.icon` volta a existir em 2026-08-03: o CTA secundário passou a usar um
 * ícone contextual por pilar em vez da seta (que já é o sinal do CTA
 * primário — repeti-la nos dois botões deixava de diferenciar "converter" de
 * "explorar"). Régua, chave e curva ascendente são o vocabulário já usado
 * pelo próprio pilar em outras partes do site (não inventado aqui).
 */
export interface HeroSlide {
  id: string
  number: string
  pillar: string
  title: string
  text: string
  /** Resumo de uma linha, na coluna clara — ver o comentário do módulo acima. */
  context: string
  /** Bloco editorial sobre a fotografia (desktop) / na faixa grafite (mobile). */
  detail: { label: string; text: string }
  cta: { label: string; href: string; icon: IconType }
  media: {
    src: string
    alt: string
    grade?: boolean
    /**
     * Enquadramento por slide, quando `center` não serve. O painel do desktop
     * é recortado na diagonal — a faixa realmente visível é a **direita** —,
     * então uma foto com assunto à esquerda do centro precisa ser deslocada
     * para não cair dentro do corte. `positionDesktop` vale só no painel
     * diagonal; `position` vale na caixa cheia do mobile, que não tem corte.
     */
    position?: string
    positionDesktop?: string
  }
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'projetos',
    number: '01',
    pillar: 'Projetos',
    title: 'Projetar para a operação real.',
    text: 'Do estudo de viabilidade ao projeto técnico em conformidade com a RDC 216. Layout, fluxo, exaustão e câmaras dimensionados para funcionar na prática.',
    context: 'Layout, fluxo e engenharia antes da compra.',
    detail: {
      label: 'Antes da compra',
      text: 'Layout, fluxo, exaustão e câmaras são dimensionados antes de o primeiro equipamento ser comprado. É o que define a operação no papel — e tira da obra o improviso, o retrabalho e o erro de implantação.',
    },
    cta: { label: 'Ver projetos', href: '#projetos', icon: RulerIcon },
    media: {
      src: '/images/hero/hero-industrial-kitchen.png',
      alt: 'Cozinha industrial profissional em aço inox, com coifa contínua, luminárias suspensas e bancada central de produção',
      grade: true,
    },
  },
  {
    id: 'equipamentos',
    number: '02',
    pillar: 'Equipamentos',
    title: 'Equipar com retorno calculado.',
    text: 'Especificação e fornecimento de equipamentos profissionais e tecnológicos. A escolha certa reduz consumo, retrabalho e parada de cozinha.',
    context: 'Especificação técnica orientada pela operação.',
    detail: {
      label: 'Especificação pela operação',
      text: 'A escolha parte da rotina da cozinha: capacidade por turno, consumo e o que a linha precisa entregar no pico. Especificar pela operação, e não pelo catálogo, é o que evita desperdício, parada e compra errada.',
    },
    cta: { label: 'Ver equipamentos', href: '#equipamentos', icon: WrenchIcon },
    media: {
      src: '/images/hero/linha-de-coccao.jpg',
      alt: 'Linha de cocção industrial em operação, com equipamentos profissionais em aço inox',
    },
  },
  {
    id: 'operacao-comercial',
    number: '03',
    pillar: 'Operação Comercial',
    title: 'Estruturar a operação que vende.',
    text: 'Funil, CRM, metas, time e geração de demanda. Cozinha eficiente sem operação de vendas continua sem faturamento.',
    context: 'Processo, CRM, time e geração de demanda.',
    detail: {
      label: 'Da cozinha ao faturamento',
      text: 'Processo, CRM, metas, time e geração de demanda estruturados junto com a capacidade real da operação. Uma cozinha eficiente sem estrutura de vendas continua sem faturamento.',
    },
    cta: { label: 'Ver operação comercial', href: '#quem-conduz', icon: TrendingUpIcon },
    /*
      Substituição obrigatória (2026-08-04): o slide usava `show-cooking.jpg`,
      um balcão de distribuição — evidência de *cozinha*, não de *operação
      comercial*, o que deixava o terceiro pilar ilustrado pelo assunto dos
      dois primeiros. O arquivo entregue pelo gestor mostra o ponto onde a
      operação vira faturamento: balcão de atendimento com PDV, pedidos
      embalados para retirada e a produção ao fundo.

      O arquivo chegou como `operação-comerrcial.png` (com acento e um "r"
      duplicado). Foi renomeado para `operacao-comercial.png` — o padrão de
      `public/` documentado em `CLAUDE.md` é minúsculo, sem acento e com
      hífen, e um caminho acentuado ainda depende de normalização Unicode
      consistente entre Windows e o servidor de produção (Linux).

      `positionDesktop` puxa o enquadramento para a direita porque o painel do
      desktop é cortado na diagonal: em `center`, o PDV e as sacolas caíam
      atrás do corte e sobrava só a parede de inox do fundo.
    */
    media: {
      src: '/images/hero/operacao-comercial.png',
      alt: 'Balcão de atendimento com terminal de ponto de venda, pedidos embalados para retirada e a linha de produção em aço inox ao fundo',
      position: '50% 45%',
      positionDesktop: '62% 45%',
    },
  },
]
