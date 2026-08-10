import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { PhotoReveal } from '@/components/animations/photo-reveal'
import { Reveal } from '@/components/animations/reveal'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'

import { equipmentCategories } from '@/data/equipment-categories'

import type { ReactNode } from 'react'

interface EquipmentStripSectionProps {
  compact?: boolean
  /**
   * Composição. `dossier` é a da V1 e continua sendo o **default**, porque é o
   * que `/solucoes/cozinhas-industriais` renderiza. `showcase` é a vitrine da
   * Home, introduzida em 2026-08-10 — ver o bloco de comentário abaixo.
   */
  variant?: 'dossier' | 'showcase'
  /**
   * Linha de fecho, à esquerda do CTA. **O default é o texto da V1** e é o que
   * `/solucoes/cozinhas-industriais` continua renderizando — quem passa um
   * valor aqui é só a Home.
   */
  note?: ReactNode
  /**
   * Ação que encerra a seção. Default = o da V1 ("Ver a solução completa"),
   * preservado para a rota interna; a Home passa a ação comercial.
   */
  cta?: { label: string; href: string }
}

const DEFAULT_CTA = { label: 'Ver a solução completa', href: '/solucoes/cozinhas-industriais' }

/**
 * Equipamentos — parte da solução, não catálogo.
 *
 * ============================================================
 * DUAS COMPOSIÇÕES, UM COMPONENTE (2026-08-10)
 * ============================================================
 *
 * Esta seção é montada em **duas** rotas: a Home e
 * `/solucoes/cozinhas-industriais`. A recomposição visual desta rodada vale só
 * para a Home, então ela entrou como `variant="showcase"` — a rota interna não
 * passa `variant` e continua recebendo `dossier`, que é o layout da V1 **sem
 * uma linha de diferença**. Nenhum texto, imagem ou dado foi alterado: as duas
 * composições leem o mesmo `equipmentCategories`.
 *
 * `note` e `cta` continuam props com os valores da V1 como default, pelo mesmo
 * motivo de sempre.
 *
 * ============================================================
 * POR QUE A HOME PRECISOU DE OUTRA COMPOSIÇÃO
 * ============================================================
 *
 * A auditoria visual global de 2026-08-10 mediu esta seção como a mais fraca da
 * página — e ela é a frente comercial prioritária (DEC-001). O que havia:
 * **2.443 caracteres** em 26 blocos de texto, quatro planos empilhados que não
 * se tocavam (banner → ficha da categoria → grade de miniaturas → fecho), e
 * quatro fotografias reais renderizadas a **112×135**. Numa seção que vende
 * equipamento de investimento relevante, a imagem era o menor elemento da tela:
 * 30% da área em desktop, uma faixa de 160px de altura no telefone.
 *
 * A regra que esta composição inaugura é "a fotografia decide a seção, o texto
 * explica". Três decisões saem dela:
 *
 *  1. **A fotografia da categoria prioritária virou palco.** Ela sangra pela
 *     borda direita da janela e ocupa a altura inteira do bloco de abertura;
 *     o enunciado, a categoria e o CTA vivem sobre ela, na guia esquerda, com
 *     um scrim que abre da esquerda para a direita. A foto passa **por trás**
 *     da coluna de texto em vez de ficar ao lado dela — é daí que vem a
 *     profundidade, não de borda.
 *  2. **A vitrine secundária perdeu as miniaturas e os cards.** As quatro
 *     categorias restantes são agora quatro fotografias grandes, encostadas
 *     umas nas outras **sem vão e sem moldura**, em duas faixas de proporção
 *     alternada (7/5 e depois 5/7). Sem o vão, as quatro leem como uma vitrine
 *     contínua; com a alternância, não leem como grade. O nome e o benefício
 *     entram sobre a própria fotografia.
 *  3. **A seção abre de um jeito próprio.** O par "H2 à esquerda + parágrafo à
 *     direita em 7+4 colunas" — que a auditoria encontrou em onze das treze
 *     seções — não existe aqui: o enunciado está dentro do palco.
 *
 * ============================================================
 * ESCALA DAS FOTOGRAFIAS — POR QUE ESTAS PROPORÇÕES
 * ============================================================
 *
 * As proporções não são estéticas, são o que os arquivos aguentam. Medidos:
 * `linha-de-fogoes` 1024×768, `refrigeradores-verticais` 940×689,
 * `mobiliario-inox` 1170×964, `linha-de-coccao` 787×1400 (vertical),
 * `forno-combinado` 1109×1400 (vertical).
 *
 * O palco começa em `lg:left-[32%]`: em 1440 a foto renderiza a ~980px de
 * largura contra uma fonte de 1024 — **sem ampliação**. Sangrar a janela
 * inteira levaria a 1.440px (1,4×) e a 1.920px (1,9×), que é onde a fonte
 * quebra. As duas faixas de 7/5 dão 840 e 600px em 1440, também abaixo das
 * fontes. A única ampliação que sobra é a de `refrigeradores-verticais` em
 * 1920 (1,19×), aceitável porque a legenda cobre a base.
 *
 * Se um dia entrar fotografia de cocção em resolução maior, o palco pode
 * sangrar a janela inteira sem mudar mais nada — é só o `lg:left` sair.
 */
export function EquipmentStripSection({
  compact = false,
  variant = 'dossier',
  note,
  cta = DEFAULT_CTA,
}: EquipmentStripSectionProps = {}) {
  if (variant === 'showcase') {
    return <EquipmentShowcase note={note} cta={cta} />
  }

  return <EquipmentDossier compact={compact} note={note} cta={cta} />
}

/* ============================================================
   VITRINE — a composição da Home
   ============================================================ */

function EquipmentShowcase({
  note,
  cta,
}: {
  note?: ReactNode
  cta: { label: string; href: string }
}) {
  const [primary, ...rest] = equipmentCategories
  if (!primary) return null

  return (
    <Section
      id="equipamentos"
      tone="graphite-soft"
      space="sm"
      bleed
      aria-labelledby="equipamentos-titulo"
      /*
        `py-0`: a seção inteira é composta por blocos que sangram, e cada um
        traz o próprio respiro. Padding de seção aqui abriria uma faixa de
        grafite acima do palco e quebraria a continuidade com a primeira dobra.
      */
      className="relative isolate overflow-hidden py-0 md:py-0"
    >
      {/* ==========================================================
          PALCO — a linha de cocção sangrando pela direita.
          ========================================================== */}
      <div className="relative">
        {/* ----------
            A fotografia. No telefone ela é um bloco próprio, com altura real
            (proporção 4:5) acima do texto — não um fundo atrás dele, que é o
            que a fazia sumir. A partir de `lg` ela passa a ocupar a altura
            inteira do palco e sangra até a borda direita da janela.
            ---------- */}
        <PhotoReveal className="relative aspect-[4/5] w-full overflow-hidden bg-graphite sm:aspect-[16/10] lg:absolute lg:inset-y-0 lg:left-[32%] lg:right-0 lg:aspect-auto lg:w-auto">
          <Image
            src={primary.image}
            alt={primary.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 70vw"
            quality={84}
            priority
            className="object-cover object-[62%_center]"
          />

          {/* ----------
              Scrim direcional: sobe do rodapé no telefone (onde o texto vem
              depois) e abre da esquerda para a direita no desktop (onde o
              texto está por cima). Ele existe para dar piso de contraste ao
              enunciado — não para escurecer a fotografia inteira, que foi o
              defeito diagnosticado na primeira dobra.

              O primeiro stop do gradiente do desktop é **opaco**, não 0,97:
              a fotografia começa em `lg:left-[32%]` e à esquerda dela existe o
              `graphite-soft` liso da seção. Com 0,97 sobrava uma diferença de
              um ponto entre os dois, e em 1920 ela aparecia como uma costura
              vertical no meio do palco. Opaco, a borda da fotografia deixa de
              existir para o olho e os dois planos leem como um só.
              ---------- */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(26,26,26,0.94)_0%,rgba(26,26,26,0.4)_40%,transparent_72%)] lg:bg-[linear-gradient(90deg,rgb(26,26,26)_0%,rgba(26,26,26,0.92)_20%,rgba(26,26,26,0.38)_52%,transparent_80%)]"
          />
        </PhotoReveal>

        <Container className="relative">
          <div className="max-w-[34rem] py-12 md:py-14 lg:max-w-[30rem] lg:py-20 xl:max-w-[33rem] xl:py-24">
            <Reveal>
              <Eyebrow tone="light">Equipamentos e tecnologia</Eyebrow>
              <Heading
                as={2}
                id="equipamentos-titulo"
                size="display"
                className="mt-5 max-w-[16ch] text-canvas"
              >
                Especificado pelo volume real, não pela ficha técnica
              </Heading>

              <p className="mt-6 max-w-[44ch] text-lead text-canvas/80">
                A capacidade instalada é definida pela produção, pelo cardápio e pelos horários de
                pico. Equipamento sobrando é capital parado; faltando, é gargalo todo turno.
              </p>
            </Reveal>

            {/* ----------
                CATEGORIA PRIORITÁRIA — dentro do palco, não numa ficha abaixo
                dele. A fotografia **é** a linha de cocção: separar as duas
                obrigava o visitante a sair da imagem para descobrir o que
                estava vendo.
                ---------- */}
            <Reveal delay={80} className="mt-9 border-t border-white/20 pt-7 lg:mt-11 lg:pt-8">
              <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-yellow">
                Categoria prioritária
              </p>
              <p className="mt-2 font-sans text-title-2 font-bold text-canvas">{primary.name}</p>
              <p className="mt-3 max-w-[44ch] text-body text-canvas/80">{primary.benefit}</p>

              {/*
                Os quatro tipos da cocção em duas colunas discretas, sem
                divisória por item. Eram quatro linhas separadas por hairline —
                o padrão que fazia a seção ler como ficha técnica. Continuam
                aqui porque provam a amplitude da categoria prioritária; as
                listas equivalentes das outras quatro categorias saíram (ver o
                comentário da vitrine secundária).
              */}
              <ul className="mt-5 grid max-w-[38ch] grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {primary.items.map((item) => (
                  <li key={item} className="text-body-sm text-canvas/70">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/*
              O CTA fecha o palco, não a seção: a ação é consequência do que a
              vitrine principal acabou de mostrar. A vitrine secundária, abaixo,
              amplia o escopo e encerra com a nota que leva ao detalhamento.
            */}
            <Reveal delay={140} className="mt-9 lg:mt-10">
              <LinkButton href={cta.href} variant="primary" size="lg" withArrow>
                {cta.label}
              </LinkButton>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* ==========================================================
          VITRINE SECUNDÁRIA — quatro fotografias encostadas, sem vão.

          Duas faixas de proporção alternada (7/5 e 5/7). A alternância é o que
          impede a leitura de grade; a ausência de vão e de moldura é o que
          impede a leitura de cartão. As legendas entram sobre a própria
          fotografia, ancoradas na base.

          As listas de tipos das quatro categorias (`category.items`) **não são
          renderizadas aqui**: eram quatro linhas corridas separadas por `·`,
          somando ~280 caracteres ilegíveis em varredura, e repetiam o que
          `/linhas-de-produtos` publica por extenso — para onde a nota de fecho
          aponta. O dado continua intacto em `equipment-categories.ts` e segue
          em uso na composição `dossier` da rota interna.
          ========================================================== */}
      <ul className="grid grid-cols-1 lg:grid-cols-12">
        {rest.map((category, index) => {
          /* 7/5 na primeira faixa, 5/7 na segunda. */
          const wide = index % 4 === 0 || index % 4 === 3
          return (
            <li
              key={category.id}
              className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
            >
              {/*
                A altura é generosa de propósito: a 14rem as fotografias
                viravam letterbox (2,1:1 para fontes de 1,3:1) e a legenda de
                três linhas transbordava o gradiente, caindo sobre o inox claro.
                A 17–28rem o recorte respeita a proporção das fontes e a base
                tem espaço para o texto.
              */}
              <figure className="group relative h-[17rem] w-full overflow-hidden bg-graphite sm:h-[20rem] lg:h-[24rem] xl:h-[28rem]">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  quality={82}
                  className="object-cover transition-transform duration-[420ms] ease-premium group-hover:scale-[1.02] motion-reduce:transition-none"
                />
                {/*
                  O gradiente sobe mais alto e fecha mais embaixo que o do
                  palco: aqui a legenda tem três linhas e cai sobre fotografias
                  de inox iluminado, que é o pior caso de contraste da seção.
                */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(16,16,16,0.96)_0%,rgba(16,16,16,0.9)_22%,rgba(16,16,16,0.5)_46%,rgba(16,16,16,0.06)_74%,transparent_100%)]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
                  <h3 className="font-sans text-title-3 font-bold text-canvas">{category.name}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-body-sm leading-relaxed text-canvas/80">
                    {category.benefit}
                  </p>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>

      {/* ==========================================================
          NOTA DE FECHO — encosta na base da vitrine, sem divisória: a mudança
          de superfície (fotografia → grafite) já é a separação.
          ========================================================== */}
      <Container>
        <p className="max-w-[68ch] py-8 text-base text-canvas/75 lg:py-10">
          {note ?? (
            <>
              O detalhamento por linha de equipamento — incluindo o{' '}
              <Link
                href="/linhas-de-produtos/forno-combinado-rational"
                className="font-semibold text-canvas underline decoration-yellow underline-offset-4 transition-colors hover:text-white"
              >
                forno combinado Rational
              </Link>{' '}
              — fica na página de linhas.
            </>
          )}
        </p>
      </Container>
    </Section>
  )
}

/* ============================================================
   DOSSIÊ — a composição da V1, intocada, servindo a rota interna
   ============================================================ */

function EquipmentDossier({
  compact,
  note,
  cta,
}: {
  compact: boolean
  note?: ReactNode
  cta: { label: string; href: string }
}) {
  const [primary, ...rest] = equipmentCategories

  return (
    <Section id="equipamentos" tone="graphite-soft" space={compact ? 'sm' : 'default'} bleed aria-labelledby="equipamentos-titulo">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow tone="light">Equipamentos e tecnologia</Eyebrow>
            <Heading
              as={2}
              id="equipamentos-titulo"
              size="title-1"
              className="mt-5 max-w-[20ch] text-canvas"
            >
              Especificado pelo volume real, não pela ficha técnica
            </Heading>
          </div>

          <p className="text-lead text-canvas/75 lg:col-span-4 lg:col-start-9">
            A capacidade instalada é definida pela produção, pelo cardápio e pelos horários de
            pico. Equipamento sobrando é capital parado; faltando, é gargalo todo turno.
          </p>
        </div>

        {/* ==========================================================
            Categoria prioritária — painel panorâmico, dimensionamento real.
            ========================================================== */}
        {primary ? (
          <figure className="mt-10 lg:mt-14">
            <PhotoReveal className="relative aspect-[4/3] w-full overflow-hidden bg-graphite sm:aspect-[16/9] lg:aspect-[2.8/1]">
              <Image
                src={primary.image}
                alt={primary.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 78vw"
                quality={84}
                className="object-cover"
              />
            </PhotoReveal>

            <figcaption className="mt-5 grid gap-x-12 gap-y-4 border-t border-white/20 pt-5 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="font-condensed text-sm font-semibold uppercase text-canvas/75">
                  Categoria prioritária
                </p>
                <p className="mt-2 font-sans font-bold text-title-2 text-canvas">{primary.name}</p>
                <p className="mt-3 max-w-[46ch] text-body text-canvas/75">{primary.benefit}</p>
              </div>

              <ul className="lg:col-span-6 lg:col-start-7">
                {primary.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-white/15 py-2.5 text-base text-canvas/85 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-2.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        ) : null}

        {/* ==========================================================
            Demais categorias — dossiê em grade, foto real + dados curtos.
            ========================================================== */}
        <ul className="mt-12 grid gap-x-8 gap-y-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:mt-16 lg:pt-12">
          {rest.map((category, index) => (
            <Reveal key={category.id} as="li" variant="side" delay={index * 60}>
              <div className="flex gap-5">
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-graphite sm:w-28">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="112px"
                    quality={76}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans font-bold text-title-3 text-canvas">{category.name}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-canvas/75">{category.benefit}</p>
                  <p className="mt-2 text-sm leading-relaxed text-canvas/65">{category.items.join(' · ')}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-5 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base text-canvas/75">
            {note ?? (
              <>
                O detalhamento por linha de equipamento — incluindo o{' '}
                <Link
                  href="/linhas-de-produtos/forno-combinado-rational"
                  className="font-semibold text-canvas underline decoration-yellow underline-offset-4 transition-colors hover:text-white"
                >
                  forno combinado Rational
                </Link>{' '}
                — fica na página de linhas.
              </>
            )}
          </p>
          <LinkButton href={cta.href} variant="primary" size="md" withArrow className="shrink-0">
            {cta.label}
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}
