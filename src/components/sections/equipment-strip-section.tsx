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
   * Home — ver o bloco de comentário abaixo.
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
 * DUAS COMPOSIÇÕES, UM COMPONENTE
 * ============================================================
 *
 * Esta seção é montada em **duas** rotas: a Home e
 * `/solucoes/cozinhas-industriais`. A recomposição visual vale só para a Home,
 * então ela entra como `variant="showcase"` — a rota interna não passa
 * `variant` e continua recebendo `dossier`, que é o layout da V1 **sem uma
 * linha de diferença**. Nenhum texto, imagem ou dado foi alterado: as duas
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
 * quatro planos empilhados que não se tocavam (banner → ficha da categoria →
 * grade de miniaturas → fecho), e quatro fotografias reais renderizadas a
 * **112×135**. Numa seção que vende equipamento de investimento relevante, a
 * imagem era o menor elemento da tela.
 *
 * ============================================================
 * O QUE `ca7a1c3` ERROU — E O QUE ESTA VERSÃO FAZ DIFERENTE
 * ============================================================
 *
 * A primeira tentativa de correção (commit `ca7a1c3`, reprovada visualmente)
 * confundiu **protagonismo com área máxima**. Ela pôs a fotografia da cocção
 * sangrando a janela inteira numa altura de quase um viewport, com o H2 em
 * `text-display` sobre um scrim que fechava a metade esquerda da imagem, e
 * transformou as outras quatro categorias em quatro blocos gigantes 2×2 sem
 * vão. Medido: a seção ficou **mais alta** que a que substituía (1.976 contra
 * 1.565px em 1440) apesar de ter menos texto, virou uma segunda primeira dobra,
 * e as quatro provas passaram a disputar atenção com a protagonista em vez de
 * se subordinarem a ela.
 *
 * As quatro regras que saem daquele erro, e que esta composição aplica:
 *
 *   PROTAGONISMO ≠ ÁREA MÁXIMA — quem faz a fotografia dominar é a hierarquia,
 *   não a contagem de pixels. Uma imagem grande cercada por quatro imagens
 *   igualmente grandes deixa de ser protagonista.
 *
 *   SANGRIA ≠ COMPOSIÇÃO — usar a viewport não é sangrar tudo. Aqui só a
 *   fotografia do palco rompe o container, e só pela direita.
 *
 *   TEXTO INTEGRADO ≠ TUDO SOBRE SCRIM — o enunciado tem plano editorial
 *   próprio, sobre o grafite da seção. O que entra na fotografia é apenas o
 *   bloco da categoria prioritária, com proteção **local**, num canto.
 *
 *   VITRINE ≠ MOSAICO — as quatro provas são uma fileira alinhada de
 *   fotografias limpas, de mesmo tamanho e claramente menores que o palco.
 *
 * ============================================================
 * ESCALA DAS FOTOGRAFIAS — O QUE OS ARQUIVOS AGUENTAM
 * ============================================================
 *
 * Medidos: `linha-de-fogoes` 1024×768, `refrigeradores-verticais` 940×689,
 * `mobiliario-inox` 1170×964, `linha-de-coccao` 787×1400 (vertical),
 * `forno-combinado` 1109×1400 (vertical).
 *
 * O palco ocupa 7 de 12 colunas e sangra só pela direita: em 1440 renderiza a
 * ~820px contra uma fonte de 1024 (0,80×) e em 1920 a ~1.030px (1,01×). As
 * quatro provas ficam em ~310px de largura em 1440 — entre 0,26× e 0,39× das
 * fontes, nítidas com folga. Era a escala do experimento reprovado que borrava
 * `forno-combinado`: 1.120px de largura num recorte de 2,5:1, que mostrava
 * menos de um quarto da fotografia.
 *
 * A proporção 4:5 das provas veio dos assets, não de estética: duas são
 * verticais (0,56 e 0,79) e duas horizontais (1,36 e 1,21). Num slot de 0,8
 * nenhuma perde o assunto — a mais cortada mostra 59% da largura original.
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
        `overflow-hidden` é requisito, não acabamento: a fotografia do palco
        sangra por `-mr` calculado em `100vw`, que inclui a barra de rolagem.
        Sem o recorte na seção, sobrariam ~15px de rolagem horizontal.
      */
      className="relative isolate overflow-hidden"
    >
      {/* ==========================================================
          PALCO — enunciado à esquerda, fotografia dominante à direita.

          A fotografia ocupa 7 de 12 colunas e sangra **só pela borda direita**.
          Ela não passa por baixo do texto: os dois planos são vizinhos, e a
          profundidade vem da diferença de escala e do bloco da categoria, que
          se apoia na base da imagem. Não há scrim geral — o enunciado vive
          sobre o grafite da própria seção, e é isso que mantém a fotografia
          visível de ponta a ponta.

          A altura do palco é ditada pela coluna de texto, nunca por `vh`: é o
          que impede a seção de virar uma segunda primeira dobra.
          ========================================================== */}
      <Container>
        <div className="grid items-center gap-9 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="light">Equipamentos e tecnologia</Eyebrow>

              {/*
                `title-1`, não `display`. Em `display` o enunciado quebrava em
                quatro linhas monumentais e ganhava o mesmo peso perceptivo do
                H1 da primeira dobra — a Home passava a ter duas heroes
                seguidas. Em `title-1` com `max-w-[22ch]` são três linhas de
                seção. A frase não mudou.
              */}
              <Heading
                as={2}
                id="equipamentos-titulo"
                size="title-1"
                className="mt-5 max-w-[22ch] text-canvas"
              >
                Especificado pelo volume real, não pela ficha técnica
              </Heading>

              <p className="mt-5 max-w-[44ch] text-lead text-canvas/75">
                A capacidade instalada é definida pela produção, pelo cardápio e pelos horários de
                pico. Equipamento sobrando é capital parado; faltando, é gargalo todo turno.
              </p>

              {/*
                `size="md"`, como na versão anterior à recomposição: o CTA
                precisa ter peso comercial, não competir com a fotografia. Em
                `lg` o experimento reprovado deixava um botão de 56px de altura
                ao lado de uma imagem de 960px, e o olho ia para o botão.
              */}
              <LinkButton href={cta.href} variant="primary" size="md" withArrow className="mt-8">
                {cta.label}
              </LinkButton>
            </Reveal>
          </div>

          {/* ----------
              A fotografia vai da coluna 6 até a borda direita da janela.

              A sangria é **exatamente a guia**, com o sinal invertido: a guia é
              a distância da aresta da janela até a aresta interna do container,
              então recuá-la devolve a imagem ao vidro. Sem breakpoint, e sem
              recalcular a guia.

              ---------- R0-A (2026-08-12) ----------

              Era `calc((100vw − min(100vw,1400px))/2 + 2.5rem)` — a guia
              reconstruída à mão, e a única das cinco cópias que usava `100vw`.
              `vw` inclui a barra de rolagem, então a fotografia terminava ~7px
              **além** do vidro (invisível, porque `body` recorta o eixo
              horizontal) e desalinhada das outras três expressões. `--guia`
              resolve por `cqw`, que ignora a barra — ver o bloco em
              `globals.css`.

              É sangria, não guia de texto: o cálculo é **derivado** da guia,
              como manda a separação entre eixo de mídia e eixo de conteúdo.
              ---------- */}
          <div className="lg:col-span-7 lg:mr-[calc(-1*var(--guia))]">
            {/*
              `figure`, não `PhotoReveal` direto: no telefone a legenda **sai**
              de cima da fotografia e passa a correr abaixo dela. A 390px de
              largura um parágrafo de três linhas cobria metade da imagem e
              caía sobre a coifa clara — ilegível, e o oposto de "precisamos
              ver o equipamento". A partir de `sm` ela volta a ser sobreposta.

              A proporção abre de 4:3 no telefone para 8:5 em `lg`: em 7:5 a
              fotografia ficava mais alta que a coluna de texto e abria ~175px
              de grafite vazio acima e abaixo dela em 1920.
            */}
            <figure>
              <PhotoReveal className="relative aspect-[4/3] w-full overflow-hidden bg-graphite sm:aspect-[16/10] lg:aspect-[8/5]">
                <Image
                  src={primary.image}
                  alt={primary.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 62vw"
                  quality={84}
                  priority
                  className="object-cover object-[58%_center]"
                />

                {/* ----------
                    Proteção **local**. O gradiente sobe do rodapé e é cortado
                    por uma máscara horizontal que o mata a 78% da largura —
                    então ele existe só embaixo do bloco de texto, e a metade
                    direita da fotografia continua limpa. O experimento
                    reprovado fechava metade da imagem com um gradiente
                    horizontal, e o resultado era preto com uma fotografia ao
                    lado.
                    ---------- */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[54%] bg-[linear-gradient(0deg,rgba(16,16,16,0.95)_0%,rgba(16,16,16,0.86)_26%,rgba(16,16,16,0.42)_58%,transparent_100%)] [mask-image:linear-gradient(90deg,#000_0%,#000_52%,transparent_82%)] sm:block"
                />

                {/*
                  CATEGORIA PRIORITÁRIA sobre a fotografia — é o único texto que
                  entra na imagem. A lista dos quatro tipos de cocção saiu da
                  Home: eram quatro linhas competindo com a fotografia num
                  canto, e o detalhamento por linha vive em
                  `/linhas-de-produtos`, para onde a nota de fecho aponta.
                  `equipment-categories.ts` está intacto e a rota interna
                  continua publicando os quatro.
                */}
                <figcaption className="absolute inset-x-0 bottom-0 hidden p-5 sm:block sm:max-w-[27rem] lg:p-7">
                  <CookingBlock name={primary.name} benefit={primary.benefit} />
                </figcaption>
              </PhotoReveal>

              <figcaption className="mt-5 sm:hidden">
                <CookingBlock name={primary.name} benefit={primary.benefit} />
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>

      {/* ==========================================================
          AS OUTRAS QUATRO FRENTES — uma fileira alinhada, dentro do container
          e claramente menor que o palco.

          Quatro fotografias de mesma proporção e mesma largura, com o título e
          uma frase **abaixo** da imagem, sobre a superfície da própria seção.
          Sem moldura, sem preenchimento e sem gradiente cobrindo o
          equipamento: a exigência aqui é enxergar o inox, e legenda por cima
          só se justificaria se coubesse em uma linha.

          A fileira é o que sustenta o alinhamento: mesma base, mesma altura de
          imagem, títulos na mesma posição, mesma lógica de legenda.
          ========================================================== */}
      <Container>
        {/*
          Quatro em linha só a partir de `xl`. Em 1024 o container de 944px
          dividido por quatro dava 221px por prova — abaixo do que uma
          fotografia de equipamento precisa para ser reconhecida. Entre 1024 e
          1279 a fileira vira 2×2, com ~442px cada, e o alinhamento continua
          válido: mesma base, mesma altura, títulos na mesma posição.
        */}
        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-white/12 pt-10 sm:grid-cols-2 lg:mt-16 lg:pt-12 xl:grid-cols-4 xl:gap-x-5">
          {rest.map((category, index) => (
            <Reveal key={category.id} as="li" variant="settle" delay={index * 70}>
              <figure>
                {/*
                  A proporção acompanha a largura do slot, porque é ela que
                  decide quanta altura a fileira custa:

                    telefone  1 coluna, ~350px  →  16:9  (~197px)
                    sm/lg     2 colunas          →  4:3   (218px em 640, 345 em 1024)
                    xl        4 colunas, ~315px  →  4:5   (394px)

                  Em 4:5 na coluna única do telefone cada prova media 488px e
                  as quatro somavam quase duas telas — a seção ia a 3.355px. Em
                  4:5 nas duas colunas de 1024 elas somavam 1.150px e levavam a
                  seção a 2.104px. O retrato só se paga quando o slot é
                  estreito, que é o caso do `xl`.
                */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-graphite sm:aspect-[4/3] xl:aspect-[4/5]">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    /*
                      O ponto de virada é 1279, não 1023: a fileira só vira
                      quatro colunas em `xl`. Declarar 24vw a partir de 1024
                      pedia 246px para um slot que renderiza 460px.
                    */
                    sizes="(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 24vw"
                    quality={82}
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <h3 className="font-sans text-title-3 font-bold text-canvas">{category.name}</h3>
                  <p className="mt-1.5 text-body-sm leading-relaxed text-canvas/70">
                    {category.benefit}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        {/*
          `data-whatsapp-safe-zone`: a quarta prova e a nota de fecho terminam
          coladas na borda inferior direita, que é onde o botão flutuante do
          WhatsApp mora. Sem o atributo ele cobria a legenda de "Tecnologia de
          cocção" em 1440 e 1920. Mesmo mecanismo já usado no hero, no
          diagnóstico, em projetos e no fechamento — nenhuma lógica nova.
        */}
        <p
          data-whatsapp-safe-zone
          className="mt-12 max-w-[68ch] text-base text-canvas/75 lg:mt-14"
        >
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

/**
 * O bloco da categoria prioritária. Vive sobre a fotografia a partir de `sm` e
 * abaixo dela no telefone — o texto é o mesmo nos dois casos, então ele mora
 * aqui em vez de ser duplicado nos dois ramos.
 */
function CookingBlock({ name, benefit }: { name: string; benefit: string }) {
  return (
    <>
      <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-yellow">
        Categoria prioritária
      </p>
      <p className="mt-1.5 font-sans text-title-3 font-bold text-canvas">{name}</p>
      <p className="mt-2 max-w-[42ch] text-body-sm leading-relaxed text-canvas/85">{benefit}</p>
    </>
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
