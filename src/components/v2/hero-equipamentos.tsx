import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { LinkButton } from '@/components/ui/actions/button'
import { ArrowRightIcon } from '@/components/ui/icons'
import { homeHero, homeHeroMetrics } from '@/data/v2/home'
import { homeCategories } from '@/data/v2/categories'

/**
 * ============================================================
 * PRIMEIRA DOBRA DA V2 — EQUIPAMENTOS
 * ============================================================
 *
 * Composição aprovada no Gate 2 (`docs/v2/wireframes/`): coluna de texto à
 * esquerda (~44%), painel de fotografia **reto** à direita (~56%), moldura
 * técnica e legenda de aplicação.
 *
 * O QUE NÃO É HERDADO DA V1, E POR QUÊ
 * ------------------------------------
 * · **A unidade `--u`.** Ela expressa cada medida como um pixel do mockup
 *   1586×992 da V1 — geometria de uma composição que abria por diagnóstico e
 *   tinha diagonal. A V2 não tem mockup pixel-a-pixel aprovado, então amarrar a
 *   dobra a uma unidade derivada de outro desenho seria fixar uma proporção que
 *   ninguém mediu. Aqui a escala é fluida (`clamp`) e a altura é do conteúdo.
 * · **A diagonal** (`.diag-panel`/`.diag-keyline`) e o carrossel de slides. O
 *   Gate 2 descartou os dois: a diagonal por ser cópia mecânica da V1, com três
 *   armadilhas documentadas; o carrossel por esconder o produto atrás de
 *   storytelling rotativo.
 *
 * A FOTOGRAFIA É O SEGUNDO PROTAGONISTA, NÃO FUNDO
 * ------------------------------------------------
 * Ela ocupa painel próprio e dimensionado. Nenhum texto da coluna esquerda
 * passa por cima dela; a única sobreposição é a legenda de aplicação, numa
 * faixa contida no rodapé do painel, que existe por legibilidade — não como
 * gradiente decorativo cobrindo a imagem inteira.
 *
 * ORDEM MOBILE — PRIORIDADE, NÃO ENCAIXE EM 100vh
 * -----------------------------------------------
 * O DOM é: identificação → proposta → os dois CTAs → fotografia → métricas →
 * categorias. É a ordem de prioridade do Gate 2: o que nunca cede espaço vem
 * primeiro, e os chips de categoria são o último elemento — em telas baixas
 * eles simplesmente começam abaixo da dobra, em vez de comprimir título e CTA
 * para caber.
 *
 * No desktop essa mesma ordem é reorganizada por `grid`: a fotografia ocupa a
 * segunda coluna atravessando as duas linhas, e o bloco inferior volta para
 * baixo do CTA na coluna de texto.
 */
export function HeroEquipamentos() {
  return (
    <section className="relative overflow-hidden bg-canvas pb-14 pt-[calc(var(--header-height)+2.5rem)] md:pb-20 lg:pb-24 lg:pt-[calc(var(--header-height)+4rem)]">
      <Container>
        <div className="grid gap-y-10 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-[clamp(2rem,4vw,4rem)] lg:gap-y-8">
          {/* ---------- Bloco superior: identificação, proposta, ação ---------- */}
          <div className="flex flex-col lg:col-start-1 lg:row-start-1">
            <Reveal>
              <p className="inline-flex items-center gap-3 font-condensed text-[0.75rem] font-semibold uppercase leading-none tracking-[0.14em] text-ink">
                <span aria-hidden="true" className="h-[2px] w-7 shrink-0 bg-yellow-deep" />
                {homeHero.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-5 max-w-[15ch] font-sans text-[clamp(1.875rem,5.4vw,3.25rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink lg:max-w-[16ch]">
                {homeHero.title}
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-5 max-w-[46ch] text-[clamp(0.9375rem,1.05vw,1.0625rem)] leading-[1.6] text-muted">
                {homeHero.lead}
              </p>
            </Reveal>

            <Reveal delay={180} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <LinkButton
                  href={homeHero.primaryCta.href}
                  size="lg"
                  withArrow
                  className="w-full sm:w-auto"
                >
                  {homeHero.primaryCta.label}
                </LinkButton>

                <LinkButton
                  href={homeHero.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {homeHero.secondaryCta.label}
                </LinkButton>
              </div>
            </Reveal>
          </div>

          {/* ---------- Painel de fotografia ---------- */}
          <Reveal
            variant="settle"
            delay={140}
            className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-stretch"
          >
            <figure className="relative h-full">
              {/* ----------
                  Moldura técnica: hairline contínua mais quatro cantos em "L".
                  É informação, não textura — cita o vocabulário de desenho
                  ortográfico já usado no produto sem repetir o componente de
                  blueprint da V1.
                  ---------- */}
              <div className="relative h-full border border-line bg-canvas-deep p-2 md:p-2.5">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2 top-2 h-[2px] w-10 bg-yellow md:left-2.5 md:top-2.5"
                />

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-graphite sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem] xl:min-h-[30rem]">
                  <Image
                    src={homeHero.media.src}
                    alt={homeHero.media.alt}
                    fill
                    priority
                    quality={86}
                    sizes="(max-width: 1023px) 100vw, 56vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* ----------
                  Legenda de aplicação — única sobreposição sobre a foto.

                  Fica como **filha direta do `figure`**, não dentro da caixa da
                  imagem: `figcaption` só é válido como primeiro ou último filho
                  do `figure`, e aninhá-lo mais fundo invalida a figura inteira.
                  O posicionamento visual é o mesmo — o `figure` é o contexto
                  `relative`, e os deslocamentos abaixo repetem o `padding` da
                  moldura para a legenda encostar na base da fotografia.
                  ---------- */}
              <figcaption className="absolute bottom-2 left-2 right-2 bg-graphite/85 px-4 py-3 md:bottom-2.5 md:left-2.5 md:right-2.5 md:px-5">
                <span className="block font-condensed text-[0.6875rem] font-medium uppercase leading-[1.35] tracking-[0.1em] text-canvas md:text-[0.75rem]">
                  {homeHero.media.caption}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* ---------- Bloco inferior: métricas e categorias ---------- */}
          <div className="flex flex-col lg:col-start-1 lg:row-start-2">
            <Reveal delay={80} className="border-t border-line pt-6">
              {/* ----------
                  `dt` é o rótulo e `dd` é o valor, nessa ordem no código — um
                  `div` dentro de `dl` só pode conter `dt` seguido de `dd`, e a
                  versão anterior punha um `span` solto ao lado dos dois, o que
                  invalida a lista e faz o rótulo ser anunciado duas vezes (uma
                  no `dt` em `sr-only`, outra no `span`).

                  `flex-col-reverse` inverte só a pintura: o numeral aparece
                  acima do rótulo, como na composição, sem mexer na ordem
                  semântica nem duplicar texto para leitor de tela.
                  ---------- */}
              <dl className="flex flex-wrap gap-x-8 gap-y-5">
                {homeHeroMetrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col-reverse gap-1">
                    <dt className="max-w-[12em] text-[0.75rem] leading-[1.35] text-muted">
                      {metric.label}
                    </dt>
                    <dd className="font-condensed text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-none tracking-[-0.005em] text-ink">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* ----------
                Seletor compacto: os **seis** nomes de categoria, sem foto. É a
                ponte de leitura entre a primeira dobra e a vitrine — cada chip
                leva ao item correspondente da seção 2, que ativa o painel dele.

                Preparo e Higienização entram com o mesmo tratamento visual dos
                outros quatro: a pendência é de conteúdo do painel de destino,
                não da existência da frente.
                ---------- */}
            <Reveal delay={140} className="mt-7">
              <p className="font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {homeHero.categoriesLabel}
              </p>

              <ul className="mt-3 flex flex-wrap gap-2">
                {homeCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`#equipamentos-${category.id}`}
                      className="group inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-[3px] border border-line bg-surface px-3 py-2 font-condensed text-[0.8125rem] font-medium uppercase tracking-[0.05em] text-ink transition-[background-color,border-color] duration-200 ease-precise hover:border-ink hover:bg-canvas-deep"
                    >
                      {category.name}
                      <ArrowRightIcon
                        size={13}
                        aria-hidden="true"
                        className="shrink-0 text-muted transition-transform duration-200 ease-precise group-hover:translate-x-0.5 group-hover:text-ink"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
