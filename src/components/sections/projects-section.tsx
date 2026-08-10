import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { PhotoReveal } from '@/components/animations/photo-reveal'
import { Reveal } from '@/components/animations/reveal'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { featuredProjects, leadProject, projects } from '@/data/projects'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

const allRecords = [leadProject, ...featuredProjects]

/**
 * ============================================================
 * `lead` POR PROP, DEFAULT DA V1 (2026-08-09)
 * ============================================================
 *
 * A seção é montada na Home e em `/solucoes/cozinhas-industriais`. Na Home ela
 * vem **logo depois de Equipamentos** e precisa provar aquela afirmação: as
 * fotografias são de operações que a Bianchini projetou, especificou, fabricou
 * ou instalou — sem isso, a fileira lê como portfólio de arquitetura e não
 * sustenta a frente comercial que a antecede. O default continua sendo o texto
 * da V1, então a rota interna não muda.
 */
const DEFAULT_LEAD =
  'Registros reais de cozinhas, bares, cadeia fria e mobiliário fabricado sob medida — do desenho técnico à cozinha em produção.'

interface ProjectsSectionProps {
  tone?: 'graphite' | 'surface'
  compact?: boolean
  lead?: string
  /**
   * Composição. `dossier` é a da V1 e continua sendo o **default**, porque é o
   * que `/solucoes/cozinhas-industriais` renderiza — sem uma linha de
   * diferença. `showcase` é a vitrine da Home; ver o bloco de comentário de
   * `ProjectsShowcase`.
   */
  variant?: 'dossier' | 'showcase'
  /**
   * Ajuste de **ritmo entre seções**, não de composição — só padding/margem da
   * moldura. Existe porque a base desta seção é metade de uma transição, e a
   * outra metade pertence à seção seguinte, que muda por página: na Home vem
   * `#pilares` (claro sobre claro, onde o vão precisa ser curto); em
   * `/solucoes/cozinhas-industriais` vem outra coisa. Sem prop, o padding é o
   * de `space` e a rota interna não muda.
   */
  className?: string
}

export function ProjectsSection({
  tone = 'graphite',
  compact = false,
  lead = DEFAULT_LEAD,
  variant = 'dossier',
  className,
}: ProjectsSectionProps = {}) {
  if (variant === 'showcase') {
    return <ProjectsShowcase lead={lead} compact={compact} className={className} />
  }

  return <ProjectsDossier tone={tone} compact={compact} lead={lead} className={className} />
}

/* ============================================================
   VITRINE — a composição da Home
   ============================================================ */

/**
 * ============================================================
 * O QUE ESTA COMPOSIÇÃO CORRIGE
 * ============================================================
 *
 * A abertura de Projetos — o H2 seguido da fotografia sangrada — é um dos
 * melhores momentos da Home. O problema estava **logo depois dela**: a rolagem
 * ia de uma prova de largura total para uma fileira de três cartões com
 * moldura, proporção 4:3 obrigatória e um bloco de legenda preenchido embaixo.
 * O visitante saía de "operação construída" e entrava em "catálogo".
 *
 * Entre o título e a prova ainda havia dois planos de espera: o lead numa ilha
 * de 4 colunas à direita (o padrão 7+4 repetido em quase toda a página) e uma
 * régua numerada — `01 COZINHA INDUSTRIAL`, `02 BAR E SALÃO`, … — que só
 * rolava para fotografias visíveis na mesma tela.
 *
 * ============================================================
 * A REGRA DA SEÇÃO: CONTEÚDO AUTOEXPLICATIVO > CONTROLE ADICIONAL
 * ============================================================
 *
 * A régua numerada saiu inteira, e não foi substituída por letra, círculo,
 * ícone ou qualquer outro índice. Ela tinha uma função real — nomear as quatro
 * frentes — e **essa função passou para as próprias fotografias**: o nome do
 * segmento é a etiqueta amarela na base de cada imagem. Nenhuma informação foi
 * perdida; o que sumiu foi a segunda camada de navegação.
 *
 * A numeração saiu porque não representava sequência, método, progresso nem
 * prioridade. Os `id="projeto-{id}"` continuam em cada registro: eles servem a
 * deep-link e a `scroll-mt` do cabeçalho, e não custam nada na tela. Nenhum
 * link do site apontava para eles fora da própria régua — varrido em `src/`.
 *
 * ============================================================
 * POR QUE NÃO É EQUIPAMENTOS COPIADO
 * ============================================================
 *
 * As duas seções são vizinhas e as duas são vitrines, então a diferença tinha
 * de ser estrutural, não de tom:
 *
 *   EQUIPAMENTOS  fundo escuro · o palco é vizinho do texto e sangra só pela
 *                 direita · as quatro provas têm largura igual · a legenda vive
 *                 **abaixo** da fotografia, sobre a superfície da seção.
 *
 *   PROJETOS      fundo claro · a protagonista sangra as duas bordas e o texto
 *                 é que se contém · as três provas têm larguras **diferentes**,
 *                 ditadas pelos arquivos · a legenda vive **dentro** da
 *                 fotografia, com proteção local.
 *
 * Equipamentos é vitrine de produto; Projetos é vitrine de operação entregue.
 *
 * ============================================================
 * A FRISA: MESMA ALTURA, LARGURAS DIFERENTES
 * ============================================================
 *
 * O pedido do gestor foi que uma imagem parecesse alinhada com a outra. A
 * resposta é **altura idêntica** nas três provas: topo coerente, base coerente,
 * e — porque as legendas têm as mesmas três linhas e a mesma âncora na base —
 * etiqueta, título e escopo caem na mesma linha nas três colunas.
 *
 * As larguras (35 / 30 / 35) vieram das fotografias, não de uma proporção
 * escolhida no papel:
 *
 *   `bar-em-inox`          931 × 1400  (0,67 — retrato)
 *   `camara-frigorifica`   750 ×  400  (1,88 — paisagem)
 *   `fritadeiras-e-chapa`  750 × 1000  (0,75 — retrato)
 *
 * A paisagem fica no centro, mas na coluna **estreita**. A primeira versão
 * fazia o contrário — 30/40/30, coluna larga para ela — e a captura reprovou:
 * `camara-frigorifica` é a fotografia mais fraca do trio (muito clara, pouco
 * contraste, pouca profundidade) e dominava a frisa só por área. Área não é
 * hierarquia; a coluna larga tem de ir para as fotografias que sustentam
 * ampliação e têm assunto para mostrar.
 *
 * Ela também é o teto de resolução da seção: com 400px de altura de arquivo,
 * qualquer frisa mais alta a amplia — daí a escala parar em `2xl:h-[25rem]`.
 * Na coluna estreita isso deixou de ser o fator limitante e passou a ser folga:
 * em 1920 ela renderiza 422 × 400 contra 750 × 400, ampliação zero.
 *
 * Os dois retratos têm altura sobrando e aguentam o recorte da faixa; o
 * `object-position` de cada um está calibrado para o assunto (a bancada do bar,
 * a linha de fritadeiras e chapa) e não para o centro geométrico.
 *
 * ============================================================
 * POR QUE NÃO É `forno-combinado` AQUI
 * ============================================================
 *
 * A terceira prova era `forno-combinado.jpg` — a **mesma fotografia** que
 * Equipamentos publica como quarta prova, e sob rótulo quase idêntico
 * ("Tecnologia de cocção"). Com as duas seções agora fotográficas e vizinhas, a
 * repetição aparecia em poucos segundos de rolagem.
 *
 * `fritadeiras-e-chapa.jpg` a substitui: registro real de `src/data/projects.ts`
 * (`fritadeiras-chapa`), legenda e escopo próprios, 750 × 1000 — folga de
 * sobra para o slot — e **não aparece em nenhuma outra seção da Home**. Varrido
 * o acervo inteiro: era a única fotografia de cocção instalada que atendia às
 * três condições ao mesmo tempo. `linha-de-coccao` e `fogao-industrial` estão
 * em Equipamentos ou são foto de catálogo com fundo branco; `fornos-combinados`
 * já fecha a página. Nenhum asset foi criado, e o texto vem inteiro do dado.
 *
 * Abaixo de `lg` a frisa deixa de existir — três colunas em 768px dariam ~200px
 * por prova e o título quebraria em duas linhas, destruindo o alinhamento que é
 * o ponto da composição. Ali as provas viram uma sequência vertical com
 * proporções **diferentes entre si** (4:5, 3:2, 3:4), que é o que impede o
 * telefone de virar o mesmo módulo repetido três vezes.
 *
 * ============================================================
 * ESCALA E SANGRIA
 * ============================================================
 *
 * SANGRIA ≠ COMPOSIÇÃO: só a protagonista rompe o container, e é ela que faz a
 * seção ocupar 1920. A frisa fica contida, porque `camara-frigorifica` não
 * suporta ser esticada — em `2xl` ela ganha `max-w-wide` (1520) em vez do
 * `max-w-container` (1400) do texto, que é o quanto os arquivos permitem
 * absorver sem ampliação.
 *
 * O vão entre a protagonista e a frisa é o **mesmo** dos vãos entre as provas
 * (16px em `lg`): é isso que faz as quatro fotografias lerem como uma
 * composição só, e não como uma imagem seguida de uma grade.
 */
const SHOWCASE_ORDER = ['bar-inox', 'camara-frigorifica', 'fritadeiras-chapa']

/**
 * A seleção da frisa é da **vitrine**, não dos dados: `featuredProjects`
 * continua intacto, porque é ele que a variante `dossier` publica em
 * `/solucoes/cozinhas-industriais`. Se algum id sumir de `projects.ts`, a
 * vitrine volta silenciosamente para `featuredProjects`.
 */
const orderedProofs = SHOWCASE_ORDER.map((id) =>
  projects.find((project) => project.id === id),
).filter((project): project is Project => Boolean(project))

const showcaseProofs =
  orderedProofs.length === SHOWCASE_ORDER.length ? orderedProofs : featuredProjects

/**
 * Apresentação por prova. Fora de `lg` a proporção é de cada fotografia; em
 * `lg` a altura passa a ser compartilhada e só a largura da coluna varia.
 */
const PROOF_LAYOUT = [
  {
    /* Retrato à esquerda, coluna larga. `38%` guarda a bancada, as taças e as
       garrafas — no centro geométrico entraria o piso de madeira. */
    box: 'aspect-[4/5] md:aspect-[3/4] lg:aspect-auto',
    position: 'object-[center_38%]',
    cell: '',
    sizes: '(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 33vw',
  },
  {
    /* Paisagem: coluna **estreita** no desktop, faixa inteira no tablet. */
    box: 'aspect-[3/2] md:aspect-[21/9] lg:aspect-auto',
    position: 'object-[center_46%]',
    cell: 'md:order-last md:col-span-2 lg:order-none lg:col-span-1',
    sizes: '(max-width: 1023px) 92vw, 28vw',
  },
  {
    /* Retrato à direita, coluna larga. `55%` desce o enquadramento para a linha
       de fritadeiras e a chapa; no centro entraria o revestimento liso da
       parede, que é o quarto superior sem assunto da fotografia. */
    box: 'aspect-[3/4] lg:aspect-auto',
    position: 'object-[center_55%]',
    cell: '',
    sizes: '(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 33vw',
  },
]

/** Altura compartilhada da frisa — o alinhamento inteiro depende dela. */
const PROOF_HEIGHT = 'lg:h-[20rem] xl:h-[22.5rem] 2xl:h-[25rem]'

function ProjectsShowcase({
  lead,
  compact,
  className,
}: {
  lead: string
  compact: boolean
  className?: string
}) {
  return (
    <Section
      id="projetos"
      tone="surface"
      space={compact ? 'sm' : 'default'}
      className={className}
      bleed
      aria-labelledby="projetos-titulo"
    >
      {/* ==========================================================
          ABERTURA — título e prova, sem plano de espera entre os dois.

          O lead desceu da ilha de 4 colunas para logo abaixo do H2, com
          `max-w` de leitura: ele deixou de ser uma massa independente e virou
          apoio curto do título, que era uma das três integrações previstas. O
          texto não mudou uma palavra.
          ========================================================== */}
      <Container>
        <Reveal>
          <Eyebrow>Projetos entregues</Eyebrow>
          <Heading as={2} id="projetos-titulo" size="title-1" className="mt-5 max-w-[19ch]">
            A prova está na operação construída
          </Heading>
          <p className="mt-4 max-w-[64ch] text-lead text-muted">{lead}</p>
        </Reveal>
      </Container>

      {/* ==========================================================
          PROTAGONISTA — a única fotografia da página que toca as duas bordas
          da janela, e o melhor momento da seção. Preservada.

          A legenda continua sobreposta, mas a proteção deixou de ser um
          gradiente de 2/3 da altura em toda a largura: agora ela é cortada por
          uma máscara horizontal que a mata a 78% da largura e vive na base
          esquerda, alinhada com o H2 acima. A metade superior e a faixa
          direita da fotografia ficam limpas.

          `data-whatsapp-safe-zone`: a `figcaption` é `absolute inset-x-0` e
          sangra até as duas bordas, igual à fotografia — nenhum gutter de
          container protege o canto inferior direito aqui. Mesmo mecanismo já
          usado no hero, no diagnóstico, em equipamentos e no fechamento.
          ========================================================== */}
      <figure
        id={`projeto-${leadProject.id}`}
        data-whatsapp-safe-zone
        className="mt-9 scroll-mt-[calc(var(--header-height)+1rem)] lg:mt-11"
      >
        {/*
          `lg:aspect-[2/1]` antes do 2,4:1 de `xl`: em 1024 a proporção larga
          deixava a fotografia com 427px de altura e a ficha ocupava 44% dela —
          o título caía exatamente onde a proteção já tinha se dissolvido, sobre
          o espelho branco do fundo. Medido com o texto escondido: contraste
          2,09:1, reprova AA. Em 2:1 a mesma ficha ocupa 35%.
        */}
        <PhotoReveal className="relative aspect-[4/5] w-full overflow-hidden bg-graphite-soft sm:aspect-[16/9] lg:aspect-[2/1] xl:aspect-[2.4/1]">
          <Image
            src={leadProject.image}
            alt={leadProject.alt}
            fill
            sizes="100vw"
            quality={84}
            className="object-cover object-center"
          />

          <figcaption className="absolute inset-x-0 bottom-0 hidden pb-6 sm:block lg:pb-9">
            {/*
              A proteção é ancorada na **ficha**, não numa fração da fotografia:
              o gradiente cobre a caixa da legenda mais 96px de rampa acima
              dela, então ele acompanha o texto em qualquer proporção e em
              qualquer largura. Preso a `h-[48%]` da imagem, ele protegia bem em
              1920 e deixava o título desprotegido em 1024 — a altura da foto
              muda, a da ficha não.

              A máscara horizontal mata o gradiente a 78% da largura, então a
              faixa direita da fotografia continua limpa. Ela vive neste `div`,
              e não na `figcaption`, porque `mask-image` recorta os filhos: na
              legenda, ela apagaria o próprio texto.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 bg-[linear-gradient(0deg,rgba(16,16,16,0.95)_0%,rgba(16,16,16,0.92)_55%,rgba(16,16,16,0.55)_80%,transparent_100%)] [mask-image:linear-gradient(90deg,#000_0%,#000_50%,transparent_78%)]"
            />

            <Container className="relative">
              <LeadPlate onPhoto />
            </Container>
          </figcaption>
        </PhotoReveal>

        {/*
          No telefone a legenda **sai** de cima da fotografia. A 390px um bloco
          de cinco linhas cobriria metade da imagem e cairia sobre o piso claro
          do fundo — ilegível, e o oposto de "a prova está na operação". A
          troca de posição da legenda entre telefone e desktop é também o que
          dá ao mobile um ritmo próprio: aqui a legenda corre embaixo, nas três
          provas ela continua dentro da fotografia.
        */}
        <figcaption className="mt-5 sm:hidden">
          <Container>
            <LeadPlate />
          </Container>
        </figcaption>
      </figure>

      {/* ==========================================================
          FRISA — três operações na mesma altura, larguras 30 / 40 / 30.

          `mt-4` em `lg` é o mesmo valor do `gap` entre as colunas: o vão
          vertical que separa a protagonista da frisa é idêntico ao vão
          horizontal que separa as provas entre si, e é isso que faz as quatro
          fotografias lerem como uma composição só.
          ========================================================== */}
      <Container className="2xl:max-w-wide">
        {/*
          As larguras desiguais (35 / 30 / 35) só entram em `xl`. Entre 1024 e
          1279 as três colunas são iguais: ali a coluna estreita cairia para
          ~274px, o escopo de "Bar e salão" precisa de 247px contra 234
          disponíveis, quebraria em duas linhas e **subiria o título dessa
          coluna 23px** — o alinhamento da frisa, que é a razão de ser da
          composição, morreria justamente na largura em que ela estreia.
        */}
        {/*
          Entre 768 e 1023 a frisa vira **dois retratos lado a lado com a
          paisagem em faixa embaixo** — a ordem visual que os próprios arquivos
          pedem. Em coluna única ali as três provas somavam 1.240px e levavam a
          seção a 2.142px, 15% **acima** da composição que ela substitui; nesta
          disposição somam 775px. A paisagem troca de lugar por `order`, não por
          ordem de DOM: as três são figuras não focáveis e a leitura por teclado
          não passa por elas.
        */}
        <ul className="mt-3 grid gap-3 md:grid-cols-2 lg:mt-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-[7fr_6fr_7fr]">
          {showcaseProofs.map((project, index) => {
            const layout = PROOF_LAYOUT[index] ?? PROOF_LAYOUT[0]

            return (
              <li key={project.id} className={cn('min-w-0', layout.cell)}>
                <figure
                  id={`projeto-${project.id}`}
                  className="group scroll-mt-[calc(var(--header-height)+1rem)]"
                >
                  <PhotoReveal
                    className={cn(
                      'media-zoom relative w-full overflow-hidden bg-canvas-deep',
                      layout.box,
                      PROOF_HEIGHT,
                    )}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes={layout.sizes}
                      quality={82}
                      className={cn('object-cover', layout.position)}
                    />

                    {/* ----------
                        FOTOGRAFIA PRIMEIRO, IDENTIFICAÇÃO DEPOIS.

                        A ficha não perdeu nenhuma informação — segmento,
                        título e escopo continuam os três lá, com o mesmo texto
                        do dado. O que saiu foi **peso visual**: o traço amarelo
                        antes do segmento (mobília gráfica repetida três vezes
                        em fotografias que já se distinguem sozinhas), 1px de
                        cada escala de texto, e o respiro entre as linhas. É a
                        protagonista que mantém o traço — ela é a ficha
                        principal, e a repetição é que virava padrão de cartão.
                        ---------- */}
                    <figcaption className="absolute inset-x-0 bottom-0 p-3.5 xl:p-4">
                      {/*
                        A proteção cobre a ficha mais 48px de rampa — não uma
                        fração da fotografia. Com a legenda mais leve a ficha
                        encolheu, e a rampa caiu de 64 para 48px: o gradiente
                        agora ocupa ~37% da altura do quadro em 1440 (era 46%)
                        e ~42% em 1024 (era 52%). A metade de cima de cada
                        fotografia fica intocada, e nenhuma delas lê como meia
                        imagem preta. Contraste remedido no pixel depois da
                        redução — ver README das capturas.
                      */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -top-12 bottom-0 bg-[linear-gradient(0deg,rgba(16,16,16,0.93)_0%,rgba(16,16,16,0.88)_52%,rgba(16,16,16,0.48)_78%,transparent_100%)]"
                      />
                      <span className="relative block">
                        <span className="block font-condensed text-[0.75rem] font-semibold uppercase leading-none tracking-[0.13em] text-yellow">
                          {project.segment}
                        </span>
                        <span className="mt-1.5 block font-sans text-title-3 font-bold leading-tight text-canvas">
                          {project.title}
                        </span>
                        {/*
                          Dois itens de escopo, não a lista inteira: é o que
                          cabe em **uma** linha na coluna mais estreita (274px
                          em 1024). Uma segunda linha aqui empurraria o título
                          para cima nessa coluna e quebraria o alinhamento da
                          frisa, que é a razão de ser da composição. A lista
                          completa continua em /projetos e no registro
                          principal.
                        */}
                        <ScopeLine
                          items={(project.scope ?? []).slice(0, 2)}
                          className="mt-1 text-[0.75rem] leading-snug text-canvas/75"
                        />
                      </span>
                    </figcaption>
                  </PhotoReveal>
                </figure>
              </li>
            )
          })}
        </ul>
      </Container>

      {/* ==========================================================
          FECHO — consequência da vitrine, não fim de componente.

          Sem régua acima: a base das três provas já é uma linha horizontal
          contínua, e uma hairline 32px abaixo dela seria a mesma linha
          desenhada duas vezes. A ação vem primeiro e alinhada à esquerda, no
          mesmo eixo do H2; a nota fica ao lado, como apoio.

          O vão caiu de 36/44px para 22/26px e a nota desceu de `body-sm` para
          `caption`: com o afastamento anterior o par botão + parágrafo se
          descolava da frisa e lia como rodapé interno da seção. Encostado na
          base das fotografias, ele lê como o passo seguinte da própria vitrine
          — prova, e então "ver mais". Nem o rótulo, nem o destino, nem o texto
          da nota mudaram, e continua havendo **uma** ação.
          ========================================================== */}
      <Container>
        <Reveal>
          <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7 lg:mt-6">
            <LinkButton href="/projetos" variant="secondary" size="md" withArrow className="shrink-0">
              Ver todos os projetos
            </LinkButton>
            <p className="max-w-[58ch] text-caption leading-relaxed text-muted">
              Mais registros de cozinhas, bares, panificação, cadeia fria, mobiliário em inox e
              material de projeto na página de projetos.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

/**
 * A ficha do registro principal. O mesmo texto serve a fotografia (a partir de
 * `sm`) e a superfície da seção (no telefone), então ele mora aqui em vez de
 * ser duplicado nos dois ramos — só a cor muda.
 */
function LeadPlate({ onPhoto = false }: { onPhoto?: boolean }) {
  return (
    <div className="max-w-[46rem]">
      <span
        className={cn(
          'inline-flex items-center gap-3 font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em]',
          onPhoto ? 'text-yellow' : 'text-ink',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('h-[2px] w-6 shrink-0', onPhoto ? 'bg-yellow' : 'bg-yellow-deep')}
        />
        {leadProject.segment}
      </span>

      <span
        className={cn(
          'mt-2 block font-sans text-title-2 font-bold',
          onPhoto ? 'text-canvas' : 'text-ink',
        )}
      >
        {leadProject.title}
      </span>

      <span
        className={cn(
          'mt-2 block max-w-[52ch] text-body-sm',
          onPhoto ? 'text-canvas/85' : 'text-muted',
        )}
      >
        {leadProject.caption}
      </span>

      <ScopeLine
        items={leadProject.scope ?? []}
        className={cn('mt-2.5 text-body-sm', onPhoto ? 'text-canvas/70' : 'text-muted')}
      />
    </div>
  )
}

/**
 * Escopo entregue, em linha — substitui "resultado" enquanto não houver
 * medição.
 *
 * O separador acompanha o item **anterior**, não o seguinte. Quando a linha
 * quebra — e ela quebra: no escopo de quatro itens do registro principal em
 * 390px — um separador à frente faz a segunda linha começar com "· ", que lê
 * como marcador de lista solto. Atrás, a quebra cai depois do ponto e as duas
 * linhas começam com palavra.
 */
function ScopeLine({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null

  return (
    <p className={cn('flex flex-wrap gap-x-2.5 gap-y-1', className)}>
      {items.map((item, index) => (
        <span key={item}>
          {item}
          {index < items.length - 1 ? (
            <span aria-hidden="true" className="ml-2.5">
              ·
            </span>
          ) : null}
        </span>
      ))}
    </p>
  )
}

/* ============================================================
   DOSSIÊ — a composição da V1, intocada, servindo a rota interna
   ============================================================ */

/**
 * Projetos entregues — portfólio editorial compacto, não mosaico solto.
 *
 * ============================================================
 * O QUE MUDOU
 * ============================================================
 *
 * A versão anterior tinha 3.151px de altura em 1440px de largura — mais que
 * qualquer outra seção da home, incluindo o hero. O motivo era estrutural: o
 * registro de abertura sangrava em 21:9 e trazia a legenda **numa faixa
 * abaixo dele**, dentro do container; os três registros seguintes vinham num
 * grid com deslocamentos de `mt-24` desalinhados entre si, abrindo vãos entre
 * uma linha e a próxima que não tinham nenhuma função.
 *
 * Agora:
 *
 *  · o registro principal sangra em **16:9**, mais baixo, e a legenda fica
 *    **sobreposta à própria fotografia** — um painel com gradiente na base,
 *    não uma segunda faixa depois dela. É sobreposição real, não decoração;
 *  · os três registros complementares formam **uma linha só**, com larguras
 *    diferentes (5/4/3 de doze) e sem deslocamento vertical entre eles — a
 *    variação de escala vem da proporção de cada imagem, não de empurrar uma
 *    coluna pra baixo da outra.
 *
 * A seção cai de 3.151px para menos da metade disso, sem perder nenhuma
 * fotografia nem nenhuma informação.
 *
 * ============================================================
 * NAVEGAÇÃO ENTRE OS REGISTROS
 * ============================================================
 *
 * Não existe página de detalhe por projeto — cada registro é uma fotografia
 * legendada, não um case com rota própria. A régua com o nome dos quatro
 * registros rola até cada um dentro da própria seção (`#projeto-{id}`) — não
 * simula uma paginação que não existe.
 *
 * As legendas descrevem o que está na imagem. Nome de cliente, local, prazo e
 * resultado numérico só entram depois de confirmação comercial e autorização
 * de uso; enquanto isso, a lista funciona como prova de escopo e acabamento.
 *
 * **Esta composição serve `/solucoes/cozinhas-industriais` e não muda.** A Home
 * passou a montar `variant="showcase"` — a régua numerada e os três cartões
 * saíram de lá, não daqui.
 */
function ProjectsDossier({
  tone,
  compact,
  lead,
  className,
}: {
  tone: 'graphite' | 'surface'
  compact: boolean
  lead: string
  className?: string
}) {
  const dark = tone === 'graphite'

  return (
    <Section
      id="projetos"
      tone={tone}
      space={compact ? 'sm' : 'default'}
      className={className}
      bleed
      aria-labelledby="projetos-titulo"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow tone={dark ? 'light' : 'default'}>Projetos entregues</Eyebrow>
            <Heading
              as={2}
              id="projetos-titulo"
              size="title-1"
              className={cn('mt-5 max-w-[18ch]', dark && 'text-canvas')}
            >
              A prova está na operação construída
            </Heading>
          </div>

          <p
            className={cn(
              'text-lead lg:col-span-4 lg:col-start-9',
              dark ? 'text-canvas/75' : 'text-muted',
            )}
          >
            {lead}
          </p>
        </div>

        <nav
          aria-label="Ir para um registro desta seção"
          /*
            `items-center` e não `items-baseline`: com os itens ganhando caixa
            de 44px, alinhar pela linha de base deixava as caixas escalonadas
            entre si quando um rótulo quebrava.

            `gap-y-1` e não `gap-y-2`: o alvo de 44px já faz quase toda a
            separação, mas com `gap-y-0` as fileiras que quebram em 390 e 320px
            passavam a **encostar** uma na outra — medido, 16 pares de alvos
            adjacentes sem folga nenhuma. 4px é o mínimo que separa sem
            devolver a altura que o `gap-y-2` antigo somaria. O `gap-x-5`
            mantém a folga horizontal, que antes chegava a 8px.
          */
          className={cn(
            'mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 border-t pt-2 lg:mt-8',
            dark ? 'border-white/15' : 'border-line',
          )}
        >
          {allRecords.map((project, index) => (
            <a
              key={project.id}
              href={`#projeto-${project.id}`}
              className={cn(
                'inline-flex min-h-[2.75rem] items-center py-2 font-condensed text-sm font-semibold uppercase tracking-[0.06em] transition-colors',
                dark ? 'text-canvas/55 hover:text-canvas' : 'text-muted hover:text-ink',
              )}
            >
              {String(index + 1).padStart(2, '0')} {project.segment}
            </a>
          ))}
        </nav>
      </Container>

      {/* ==========================================================
          Registro principal — sangrado, com a legenda sobreposta à própria
          fotografia. Fora do container de propósito: é a única imagem da
          página que toca as duas bordas da janela.

          `data-whatsapp-safe-zone`: a legenda (`figcaption`, logo abaixo) é
          `absolute inset-x-0 bottom-0` — sangra até as duas bordas, igual à
          fotografia. É a mesma classe de risco da fotografia do hero (que já
          usa este atributo): nenhum gutter de container protege o canto
          inferior direito aqui, porque não há container ali. Confirmado por
          varredura: em 1920×1080, sem o atributo, a legenda colidia com o
          botão flutuante do WhatsApp (`figcaption` a toda a largura,
          `left:0`). Mesmo mecanismo já usado em `hero-section.tsx`,
          `diagnosis-section.tsx` e `final-cta-section.tsx` — nenhuma lógica
          nova.
          ========================================================== */}
      <figure
        id={`projeto-${leadProject.id}`}
        data-whatsapp-safe-zone
        className="group scroll-mt-[calc(var(--header-height)+1rem)] mt-8 lg:mt-10"
      >
        <PhotoReveal className="relative aspect-[4/5] w-full overflow-hidden bg-graphite-soft sm:aspect-[16/9] lg:aspect-[2.4/1]">
          <Image
            src={leadProject.image}
            alt={leadProject.alt}
            fill
            sizes="100vw"
            quality={84}
            className="object-cover object-center"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-graphite via-graphite/70 to-transparent"
          />

          <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-8 lg:px-10 lg:pb-8">
            <div className="mx-auto flex w-full max-w-container flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <span>
                <span className="inline-flex items-center gap-2.5 font-condensed text-eyebrow font-semibold uppercase text-yellow">
                  <span aria-hidden="true" className="h-[2px] w-5 shrink-0 bg-yellow" />
                  {leadProject.segment}
                </span>
                <span className="mt-2 block font-sans text-title-2 font-bold text-canvas">
                  {leadProject.title}
                </span>
              </span>

              <span className="flex flex-col gap-2 lg:max-w-[26rem] lg:items-end lg:text-right">
                <span className="text-body-sm text-canvas/80">{leadProject.caption}</span>
                <ScopeLine
                  items={leadProject.scope ?? []}
                  className="text-sm text-canvas/60 lg:justify-end"
                />
              </span>
            </div>
          </figcaption>
        </PhotoReveal>
      </figure>

      {/* ==========================================================
          Três registros complementares — uma linha só, larguras diferentes,
          sem deslocamento vertical entre eles.
          ========================================================== */}
      <Container>
        {/* ----------
            Três registros: uma linha no desktop, **duas colunas a partir de
            640px**. Empilhados em coluna única, os três somavam 2.774px no
            telefone e 3.873px no tablet — o tablet, de novo, mais alto que o
            celular. A partir de `sm` os dois primeiros dividem a linha e o
            terceiro fica em largura contida, o que corta ~35% da altura.
            ---------- */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-7">
          <Record
            project={featuredProjects[0]}
            dark={dark}
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
          />
          <Record
            project={featuredProjects[1]}
            dark={dark}
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
          />
          <Record
            project={featuredProjects[2]}
            dark={dark}
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
            className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)] lg:col-span-1 lg:max-w-none"
          />
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col items-start gap-5 border-t pt-7 sm:flex-row sm:items-center sm:justify-between lg:mt-14',
            dark ? 'border-white/20' : 'border-line',
          )}
        >
          <p className={cn('max-w-xl text-base', dark ? 'text-canvas/75' : 'text-muted')}>
            Mais registros de cozinhas, bares, panificação, cadeia fria, mobiliário em inox e
            material de projeto na página de projetos.
          </p>
          <LinkButton
            href="/projetos"
            variant={dark ? 'light' : 'secondary'}
            size="md"
            withArrow
            className="shrink-0"
          >
            Ver todos os projetos
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}

/**
 * Registro complementar: fotografia grande com a faixa de segmento/escopo
 * revelada no hover/foco, e uma legenda curta sempre visível abaixo — nunca
 * mais que duas linhas, para as três colunas ficarem na mesma altura visual.
 */
function Record({
  project,
  dark,
  sizes,
  className,
}: {
  project: Project
  dark: boolean
  sizes: string
  className?: string
}) {
  return (
    <Reveal variant="settle" className={className}>
      <figure
        id={`projeto-${project.id}`}
        className={cn(
          'group media-zoom scroll-mt-[calc(var(--header-height)+1rem)] overflow-hidden border',
          dark ? 'border-white/20 bg-graphite-soft/70' : 'border-line bg-canvas',
        )}
      >
        <PhotoReveal
          className={cn(
            'relative aspect-[4/3] w-full overflow-hidden',
            dark ? 'bg-graphite-soft' : 'bg-canvas-deep',
          )}
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes={sizes}
            quality={82}
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-graphite via-graphite/85 to-transparent px-4 pb-4 pt-9 transition-transform duration-[320ms] ease-premium group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none"
          >
            {project.segment ? (
              <span className="flex items-center gap-2 font-condensed text-caption font-semibold uppercase text-yellow">
                <span className="h-[2px] w-3.5 shrink-0 bg-yellow" />
                {project.segment}
              </span>
            ) : null}
          </div>
        </PhotoReveal>

        <figcaption className={cn('min-h-[8.5rem] border-t p-4', dark ? 'border-white/20' : 'border-line')}>
          <h3
            className={cn('font-sans text-base font-bold', dark ? 'text-canvas' : 'text-ink')}
          >
            {project.title}
          </h3>
          <ScopeLine
            items={project.scope ?? []}
            className={cn('mt-1.5 text-sm', dark ? 'text-canvas/60' : 'text-muted')}
          />
        </figcaption>
      </figure>
    </Reveal>
  )
}
