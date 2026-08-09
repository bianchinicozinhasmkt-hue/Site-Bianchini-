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

/**
 * Equipamentos — parte da solução, não catálogo.
 *
 * ============================================================
 * COPY POR PROPS, DEFAULTS DA V1 (2026-08-09)
 * ============================================================
 *
 * Esta seção é montada em **duas** rotas: a Home e
 * `/solucoes/cozinhas-industriais`. A rodada de conteúdo estratégico precisava
 * mudar o fecho da Home — dizer que a Bianchini **especifica, fornece, instala
 * e comissiona**, e trocar a ação de navegação ("Ver a solução completa") por
 * ação comercial ("Solicitar orçamento de equipamentos") —, mas alterar o
 * texto fixo mudaria a página interna junto, o que estava fora do escopo
 * autorizado.
 *
 * Por isso `note` e `cta` viraram props **com os valores da V1 como default**:
 * a rota interna renderiza exatamente o que renderizava antes, sem uma linha
 * de diferença, e só a Home passa valores novos. Enunciado, título, lead,
 * painel da categoria prioritária e grade das demais não mudaram em nenhuma
 * das duas.
 *
 * ============================================================
 * O QUE MUDOU
 * ============================================================
 *
 * As quatro categorias que não eram a prioritária viviam como **linhas de
 * texto puro**: título, benefício e lista de itens, sem nenhuma imagem — a
 * seção inteira dependia de uma única fotografia grande no topo e de
 * divisórias horizontais para o resto. Cada categoria em `equipment-
 * categories.ts` já tem uma fotografia real própria; elas só não estavam
 * sendo usadas.
 *
 * Agora as quatro entram como uma **grade de dossiê técnico**: fotografia
 * pequena + nome + benefício, em duas colunas — real material, não decoração.
 * A categoria prioritária continua grande, no topo, porque é a única com
 * fotografia de largura suficiente para sustentar o painel panorâmico.
 *
 * ============================================================
 * A LÓGICA QUE A COMPOSIÇÃO EXPLICITA
 * ============================================================
 *
 * demanda → dimensionamento → equipamento → implantação. O enunciado da seção
 * já afirma isso ("a capacidade instalada é definida pela produção..."); o
 * painel prioritário mostra o resultado dimensionado, e a grade das quatro
 * categorias é o catálogo de decisões técnicas que sustentam esse
 * dimensionamento — não um cardápio de produtos.
 */
export function EquipmentStripSection({
  compact = false,
  note,
  cta = { label: 'Ver a solução completa', href: '/solucoes/cozinhas-industriais' },
}: EquipmentStripSectionProps = {}) {
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
