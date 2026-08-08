import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { TrackedLink } from '@/components/v2/tracked-link'
import { heroPillars, heroSecondary, homeHero, type HeroPillar } from '@/data/v2/home'
import { homeHeroMetrics } from '@/data/v2/home'
import { cn } from '@/lib/utils'

/**
 * ============================================================
 * PRIMEIRA DOBRA — UMA CENA, TRÊS PORTAS
 * ============================================================
 *
 * É a principal peça do site: posiciona a empresa, segmenta a intenção do
 * visitante e converte. Não é uma faixa de três cartões — é **uma composição
 * cortada em três**, na linguagem diagonal da V1 (geometria em
 * `globals.css`, seção "HERO DE TRÊS PILARES").
 *
 * A HIERARQUIA É VISUAL, NÃO SÓ TEXTUAL
 * -------------------------------------
 * Equipamentos domina por seis vias simultâneas, e não por ser o primeiro no
 * código:
 *
 *   área ......... ~47% contra ~27% e ~26%, medidos na meia-altura
 *   posição ...... primeiro ponto de leitura, à esquerda
 *   escala ....... único painel que carrega eyebrow + `h1` além do pilar
 *   CTA .......... único com botão preenchido em amarelo; os outros dois são
 *                  CTA textual — a forma diferencia antes da leitura
 *   fotografia ... a imagem de maior impacto e a única calibrada do acervo
 *   keyline ...... o traço amarelo marca a fronteira dele, não as outras
 *
 * OS TRÊS SÃO COMPREENDIDOS SEM INTERAÇÃO
 * ---------------------------------------
 * Nome, pergunta do cliente e CTA de cada pilar estão visíveis no estado
 * inicial. O realce por hover/foco (`:has()` no CSS) muda proporção, nunca
 * presença — e é CSS puro, então funciona antes da hidratação e continua
 * funcionando com JavaScript desligado.
 *
 * Sem autoplay, sem carrossel, sem pilar escondido esperando clique.
 *
 * CADA PAINEL É UMA ÁREA CLICÁVEL INTEIRA
 * ---------------------------------------
 * O alvo é um link sobreposto ao painel inteiro; o CTA visível é a
 * representação dele, não um segundo controle. Como o `clip-path` recorta
 * também o teste de clique, a área sensível assume a forma diagonal do painel
 * — não um retângulo invadindo o vizinho.
 *
 * **Um alvo interativo por painel.** É o que permite a área cheia sem aninhar
 * link dentro de link (HTML inválido) e sem que o mesmo destino apareça duas
 * vezes na navegação por teclado. A ação secundária da dobra vive na barra
 * abaixo da composição, fora dos painéis, pelo mesmo motivo.
 */
export function HeroPillars() {
  return (
    <section
      aria-labelledby="hero-titulo"
      /*
        `overflow-hidden` não é acabamento: `clip-path` conta como área
        rolável, e sem ele os três painéis abrem rolagem horizontal.
      */
      className="hero-tri relative isolate overflow-hidden bg-graphite"
    >
      <div
        className={cn(
          'relative flex flex-col',
          'lg:block lg:h-[clamp(34rem,calc(100svh-var(--header-height)),46rem)]',
        )}
      >
        {heroPillars.map((pillar, index) => (
          <HeroPanel key={pillar.id} pillar={pillar} position={index} />
        ))}

        {/* ----------
            A luz da cena. Fica **sobre os três painéis de uma vez** — é o
            que faz três fotografias de origens diferentes lerem como um
            ambiente só, iluminado do mesmo lado (globals.css, "AS TRÊS
            FOTOGRAFIAS COMO UMA CENA SÓ"). Painel a painel isso não
            funciona: cada véu pararia na aresta e a emenda apareceria.
            ---------- */}
        <span
          aria-hidden="true"
          className="hero-tri-ramp pointer-events-none absolute inset-0 z-[5]"
        />

        {/* Keyline amarela: marca a fronteira da frente principal. */}
        <span
          aria-hidden="true"
          className="hero-tri-key pointer-events-none absolute inset-0 z-[6] hidden bg-yellow lg:block"
        />
        {/* Keyline branca discreta entre os dois pilares de sustentação. */}
        <span
          aria-hidden="true"
          className="hero-tri-key2 pointer-events-none absolute inset-0 z-[6] hidden bg-white/30 lg:block"
        />
      </div>

      {/* ----------
          Barra de apoio: credenciais confirmadas à esquerda, ação secundária à
          direita. Fica **fora** dos painéis de propósito — dentro, seria um
          segundo link aninhado na área clicável do pilar.
          ---------- */}
      <div className="relative border-t border-white/12 bg-graphite-deep">
        <Container>
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <dl className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {homeHeroMetrics.map((metric) => (
                <div key={metric.label} className="flex items-baseline gap-2">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="font-condensed text-[0.9375rem] font-bold uppercase tracking-[0.03em] text-canvas">
                    {metric.value}
                  </dd>
                  <span aria-hidden="true" className="text-[0.75rem] text-canvas/60">
                    {metric.label}
                  </span>
                </div>
              ))}
            </dl>

            <TrackedLink
              href={heroSecondary.href}
              event="hero_orcamento_click"
              className="group inline-flex min-h-[2.75rem] w-fit items-center gap-2 text-body-sm font-semibold text-canvas transition-colors hover:text-white"
            >
              {heroSecondary.label}
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="shrink-0 text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1"
              />
            </TrackedLink>
          </div>
        </Container>
      </div>
    </section>
  )
}

const PANEL_CLASS = ['hero-tri-a', 'hero-tri-b', 'hero-tri-c'] as const
const BOX_CLASS = ['hero-tri-box-a', 'hero-tri-box-b', 'hero-tri-box-c'] as const
const MEDIA_CLASS = ['hero-tri-media-a', 'hero-tri-media-b', 'hero-tri-media-c'] as const

/**
 * Grade tonal por painel. Leva as três origens de imagem — cozinha real,
 * estudo 3D e câmara frigorífica — para o mesmo território de aço e grafite.
 * Os valores estão em globals.css; aqui só a atribuição.
 */
const PHOTO_CLASS = ['hero-tri-photo-a', 'hero-tri-photo-b', 'hero-tri-photo-c'] as const

/**
 * Alturas do empilhamento móvel: Equipamentos vale mais que os outros dois
 * somados, e os três cabem na primeira tela.
 *
 * Conta em 390×844 (menos 64px de cabeçalho): 456 + 194 + 194, menos os dois
 * encaixes de 36px das diagonais = 772px. Em 360×800 dá 728px. Em ambos os
 * três caminhos aparecem sem rolagem — que é o requisito de tráfego pago.
 *
 * **`min-height`, não `height`.** Com altura fixa, um painel cujo conteúdo
 * cresça um pouco não empurra nada: o excedente sai por cima (o conteúdo é
 * alinhado pela base) e vai parar dentro da cunha que a diagonal recorta dos
 * primeiros ~36px. Foi o que aconteceu em 360px, onde a pergunta de Projetos
 * quebra em duas linhas em vez de uma e o título "PROJETOS" saía cortado ao
 * meio — o painel tinha altura de sobra na tela, mas não podia usá-la.
 *
 * Com `min-height` a altura declarada vira **piso**, não teto: a proporção
 * entre os três se mantém em todas as larguras em que o conteúdo cabe, e nas
 * mais estreitas o painel cresce o necessário em vez de recortar o próprio
 * título. Alguns pixels de rolagem custam menos que um pilar decapitado.
 */
const MOBILE_HEIGHT = [
  'min-h-[max(60svh,26rem)]',
  'min-h-[max(23svh,10.5rem)]',
  'min-h-[max(23svh,10.5rem)]',
]

function HeroPanel({ pillar, position }: { pillar: HeroPillar; position: number }) {
  const isPrimary = position === 0

  return (
    <div
      className={cn(
        'hero-tri-panel group relative w-full',
        /*
          No telefone o painel é uma caixa de fluxo que **cresce com o
          conteúdo**: `justify-end` mantém os três alinhados pela base quando
          sobra altura, e o `min-height` age só como piso. No desktop volta a
          ser um painel absoluto de altura fixa, onde a diagonal é vertical e
          a proporção entre as três regiões é a hierarquia comercial.
        */
        'flex flex-col justify-end',
        PANEL_CLASS[position],
        MOBILE_HEIGHT[position],
        'lg:absolute lg:inset-0 lg:block lg:h-auto lg:min-h-0',
      )}
    >
      {/* ---------- Fotografia: enquadrada na região do painel ---------- */}
      <div className={cn('absolute inset-0 lg:inset-y-0', MEDIA_CLASS[position])}>
        <Image
          src={pillar.media.src}
          alt={pillar.media.alt}
          fill
          priority={isPrimary}
          quality={isPrimary ? 86 : 82}
          sizes={isPrimary ? '(max-width: 1023px) 100vw, 55vw' : '(max-width: 1023px) 100vw, 30vw'}
          style={{ objectPosition: pillar.media.objectPosition }}
          className={cn('object-cover', 'hero-tri-photo', PHOTO_CLASS[position])}
        />

        {/*
          Véu de legibilidade, não decoração: o texto é o mesmo nos três
          painéis e precisa do mesmo piso de contraste em todos.

          Ele pesa na base, onde o conteúdo fica, e deixa o topo respirar. O
          véu dos painéis de sustentação **aliviou** quando a grade tonal
          entrou: antes ele carregava sozinho a tarefa de igualar três
          luminâncias, e para isso precisava fechar tanto que apagava a
          fotografia. Agora a grade iguala o tom e o véu volta a fazer só o
          que o nome diz.
        */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0',
            isPrimary
              ? 'bg-gradient-to-t from-graphite via-graphite/70 to-graphite/25'
              : 'hero-tri-veil',
          )}
        />
      </div>

      {/* ---------- Conteúdo (não recebe clique: o alvo é o link ao fim) ---------- */}
      <div
        className={cn(
          /*
            `relative` no telefone (fluxo, empurra a altura do painel) e
            `absolute` no desktop (sobreposta à fotografia). Enquanto era
            absoluta nas duas larguras, nenhum `min-height` do painel
            respondia ao conteúdo: em 360px a pergunta de Projetos quebra em
            duas linhas, o bloco transbordava por cima e o título "PROJETOS"
            era decapitado pela cunha da diagonal.
          */
          /*
            `lg:inset-y-0`, **nunca `lg:inset-0`**: o `left`/`right` de cada
            caixa vem de `.hero-tri-box-*` (globals.css), que é o que a
            mantém dentro da zona segura da diagonal. `inset-0` tem a mesma
            especificidade e é emitido depois, então zera os dois lados e as
            três caixas passam a ocupar a composição inteira — as de Projetos
            e Consultoria vão parar debaixo da fotografia de Equipamentos e
            somem no recorte. Aqui só o eixo vertical é declarado.
          */
          /*
            `lg:w-auto` pelo mesmo motivo: num elemento absoluto com `left` e
            `right` declarados, `width: 100%` vence os dois e a caixa volta a
            ocupar a composição inteira. No telefone o `w-full` é necessário
            (a caixa está em fluxo); no desktop a largura tem de ser derivada
            das duas âncoras.
          */
          'pointer-events-none relative z-10 flex w-full flex-col justify-end lg:absolute lg:inset-y-0 lg:w-auto',
          'px-5 pb-6 md:px-8 lg:px-0 lg:pb-10',
          /*
            No mobile a aresta diagonal corre no **topo** dos painéis de
            sustentação. Sem esta folga o título encostava nela e saía cortado
            — o recorte é da composição, não do texto.
          */
          !isPrimary && 'pt-[calc(var(--tri-mcut)+0.5rem)] lg:pt-0',
          BOX_CLASS[position],
        )}
      >
        {/*
          `justify-end` alinha os três pilares pela **base**, e não pelo topo.
          Sem ele o conteúdo de Projetos e Consultoria encostava no alto da
          composição e desaparecia atrás do cabeçalho fixo — além de quebrar a
          linha de base que faz os três lerem como uma cena só.

          O `padding-top` reserva a faixa do cabeçalho: se um pilar crescer de
          texto, ele para antes de passar por baixo da marca.
        */}
        <div
          className={cn(
            'flex flex-col justify-end lg:h-full',
            /*
              A faixa do cabeçalho é reservada onde o painel encosta no topo da
              página: no desktop isso vale para os três (todos vão de ponta a
              ponta); no telefone, só para Equipamentos, que é o primeiro da
              pilha. Sem isso a etiqueta e o `h1` passavam por baixo da marca.
            */
            isPrimary && 'pt-[calc(var(--header-height)+0.5rem)]',
            'lg:pt-[calc(var(--header-height)+1.5rem)]',
            isPrimary ? 'lg:pl-[6vw] lg:pr-8' : 'lg:pl-7',
            position === 1 && 'lg:pr-7',
            position === 2 && 'lg:pr-[max(2rem,4vw)]',
          )}
        >
          {/* ----------
              Só o painel principal carrega a identificação da empresa — e ela
              aparece **em todas as larguras**. Uma versão anterior escondia
              este bloco abaixo de `lg`: no telefone a página ficava sem `h1` e
              sem dizer o que a Bianchini faz, justamente onde a maior parte do
              tráfego pago chega.
              ---------- */}
          {isPrimary ? (
            <div className="flex flex-col justify-center pb-5 lg:flex-1 lg:pb-0 lg:pt-10">
              {/*
                A etiqueta sai no telefone: ela diz o mesmo que o `h1` logo
                abaixo, e os 32px que ocupa eram o que fazia a primeira linha
                do título passar por baixo do cabeçalho. Em desktop sobra
                altura e ela volta, como textura de marca.
              */}
              <p className="hidden items-center gap-3 font-condensed text-[0.75rem] font-semibold uppercase leading-none tracking-[0.16em] text-yellow lg:inline-flex">
                <span aria-hidden="true" className="h-[2px] w-8 shrink-0 bg-yellow" />
                {homeHero.eyebrow}
              </p>
              <h1
                id="hero-titulo"
                /*
                  Medida mais larga no telefone: `17ch` foi calibrado para a
                  coluna do desktop, e em 360px ele limitava o título a 275px
                  numa caixa de 320px — o `h1` quebrava em quatro linhas por
                  falta de largura concedida, não por falta de espaço, e a
                  primeira linha subia até encostar no cabeçalho (6px de
                  folga). Com `21ch` o texto usa a largura que já existe e
                  volta a três linhas, sem reduzir corpo tipográfico.
                */
                className="mt-4 max-w-[21ch] font-sans text-[clamp(1.5rem,5.6vw,2.875rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-canvas lg:mt-5 lg:max-w-[17ch] lg:leading-[1.05]"
              >
                {homeHero.title}
              </h1>
            </div>
          ) : null}

          <div className={cn('flex flex-col', isPrimary && 'lg:pb-2')}>
            {/* ----------
                Numeral do pilar, rótulo de tipo da imagem e nome.

                **No telefone o numeral fica na mesma linha do nome; no
                desktop, na linha de cima.** Não é preferência de composição:
                empilhado, o numeral caía dentro da cunha que a diagonal
                recorta do topo dos painéis de sustentação — os painéis do
                telefone têm 194px e a aresta consome os primeiros ~36px, então
                "02" e "03" simplesmente não apareciam. Só "01" sobrevivia,
                porque o painel de Equipamentos não tem corte no topo.

                Numeração pela metade é pior que numeração nenhuma: ela promete
                um sistema e entrega um rótulo solto. Na mesma linha do nome,
                os três aparecem em qualquer largura, e é o mesmo elemento —
                não há numeral duplicado no HTML para o leitor de tela ler duas
                vezes.

                O traço só existe quando há rótulo depois dele: dois dos três
                pilares não declaram tipo de imagem, e o traço ficava pendurado
                no vazio à direita do numeral. Régua serve para separar dois
                elementos, não para decorar um.
                ---------- */}
            <div className="flex flex-wrap items-baseline gap-x-3 lg:block">
              <span className="font-condensed text-[0.8125rem] font-bold leading-none tracking-[0.08em] text-yellow">
                {pillar.index}
              </span>
              {/*
                `lg:ml-3` porque no desktop o contêiner vira `block` e o
                `gap-x-3` do flex deixa de valer — sem isso o traço encosta no
                numeral.
              */}
              {pillar.media.kind ? (
                <span className="hidden items-center gap-3 lg:ml-3 lg:inline-flex">
                  <span aria-hidden="true" className="h-px w-6 bg-yellow/60" />
                  <span className="font-condensed text-[0.625rem] font-medium uppercase tracking-[0.14em] text-canvas/70">
                    {pillar.media.kind}
                  </span>
                </span>
              ) : null}

              <h2
                className={cn(
                  'font-condensed font-semibold uppercase leading-none tracking-[0.02em] text-canvas lg:mt-3',
                  isPrimary
                    ? 'text-[clamp(1.75rem,3.4vw,2.75rem)]'
                    : 'text-[clamp(1.375rem,2.1vw,1.875rem)]',
                )}
              >
                {pillar.name}
              </h2>
            </div>

            {/* A pergunta do cliente — é o que faz o visitante se reconhecer. */}
            <p
              className={cn(
                'mt-2 font-sans font-semibold text-canvas',
                isPrimary ? 'text-[1.0625rem] lg:text-[1.1875rem]' : 'text-[0.9375rem]',
              )}
            >
              {pillar.question}
            </p>

            <p
              className={cn(
                'mt-2 text-canvas/75',
                isPrimary
                  ? 'max-w-[42ch] text-body-sm'
                  : 'hidden max-w-[34ch] text-[0.8125rem] leading-[1.45] lg:block',
              )}
            >
              {pillar.proposition}
            </p>

            {/* ----------
                CTA visível — é a *representação* do alvo, não um segundo
                controle: quem navega é o link sobreposto ao painel, logo
                abaixo. Por isso é `span`, e não `a`.

                A forma diferencia a hierarquia antes da leitura: só
                Equipamentos recebe preenchimento amarelo.
                ---------- */}
            <div className="mt-5">
              {isPrimary ? (
                <span className="inline-flex min-h-[3.25rem] items-center gap-3 rounded-[3px] bg-yellow px-6 font-condensed text-[0.9375rem] font-semibold uppercase tracking-[0.05em] text-ink transition-colors duration-200 ease-precise group-hover:bg-yellow-bright">
                  {pillar.cta.label}
                  <ArrowRightIcon
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-200 ease-precise group-hover:translate-x-1"
                  />
                </span>
              ) : (
                <span className="inline-flex min-h-[2.75rem] items-center gap-2 font-condensed text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-canvas transition-colors duration-200 ease-precise group-hover:text-white">
                  <span className="relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-yellow after:content-['']">
                    {pillar.cta.label}
                  </span>
                  <ArrowRightIcon
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1"
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ----------
          O alvo real: cobre o painel inteiro e recebe a forma diagonal do
          `clip-path` do pai. É o único elemento interativo do painel.
          ---------- */}
      <TrackedLink
        href={pillar.cta.href}
        event={pillar.event}
        className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow"
      >
        <span className="sr-only">
          {pillar.name}: {pillar.cta.label}
        </span>
      </TrackedLink>
    </div>
  )
}
