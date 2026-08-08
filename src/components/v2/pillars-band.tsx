import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { homePillarsSection } from '@/data/v2/home'

/**
 * ============================================================
 * DO PROJETO À EXECUÇÃO — INTEGRAÇÃO OFERECIDA, NÃO IMPOSTA
 * ============================================================
 *
 * Terceira dobra. É a primeira vez que Projetos e Consultoria são nomeados: as
 * duas dobras anteriores foram inteiramente de Equipamentos, que é o que torna
 * a hierarquia estrutural e não apenas discursiva (`docs/v2/DECISIONS.md`,
 * DEC-005).
 *
 * A ASSIMETRIA NÃO É SÓ TAMANHO DE CARTÃO
 * ---------------------------------------
 * A regra de ouro (`MASTER_BIANCHINI.md` §3.4) pede maior peso visual para
 * Equipamentos. Aqui isso é entregue em quatro dimensões independentes, todas
 * a favor da mesma frente:
 *
 *   1. **primeiro ponto de leitura** — o cartão de Equipamentos é o primeiro no
 *      DOM e ocupa a coluna de ataque no desktop;
 *   2. **CTA de maior prioridade** — só ele recebe botão preenchido, com o
 *      mesmo rótulo do CTA primário da primeira dobra; Projetos e Consultoria
 *      usam link textual;
 *   3. **evidência visual mais forte** — só ele tem fotografia;
 *   4. **maior área e mais conteúdo útil** — ~57% da largura e mais elementos
 *      (foto + título + frase + botão) contra título + frase + link.
 *
 * NENHUM RETRATO DE PESSOA AQUI
 * -----------------------------
 * Uma versão anterior do wireframe reservava retrato do responsável em cada
 * cartão, inclusive um espaço "a nomear" para Consultoria. Isso amarrava a
 * composição a uma decisão de conteúdo que não existe: o responsável público de
 * Consultoria não está definido (`docs/v2/V2_PRODUCT.md` §4, DEC-004). A
 * identificação de pessoas tem lugar próprio na seção de autoridade — aqui os
 * três cartões comunicam por conteúdo, e a seção funciona sem depender de
 * ninguém ser nomeado.
 *
 * A integração é dita como possibilidade ("funcionam separadas ou juntas"),
 * nunca como condição de contratação — DEC-003.
 */
export function PillarsBand() {
  const { equipment, support } = homePillarsSection

  return (
    <section
      id="do-projeto-a-execucao"
      className="on-dark bg-graphite py-16 text-canvas md:py-20 lg:py-section"
    >
      <Container>
        <Reveal>
          <Eyebrow tone="light">{homePillarsSection.eyebrow}</Eyebrow>
          <Heading as={2} size="title-1" className="mt-5 max-w-[18ch] text-canvas">
            {homePillarsSection.title}
          </Heading>
          <Lead tone="light" className="mt-5">
            {homePillarsSection.lead}
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] lg:gap-8">
          {/* ---------- Equipamentos — maior área, única fotografia ---------- */}
          <Reveal variant="settle">
            <article className="flex h-full flex-col border border-white/12 bg-graphite-soft">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-graphite-deep">
                <Image
                  src={equipment.media.src}
                  alt={equipment.media.alt}
                  fill
                  quality={82}
                  sizes="(max-width: 1023px) 100vw, 57vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h3 className="font-condensed text-[1.375rem] font-semibold uppercase tracking-[0.04em] text-yellow">
                  {equipment.name}
                </h3>
                <p className="mt-3 max-w-[48ch] text-body text-canvas/80">{equipment.statement}</p>

                <div className="mt-auto pt-7">
                  <LinkButton href={equipment.cta.href} variant="primary" size="md" withArrow>
                    {equipment.cta.label}
                  </LinkButton>
                </div>
              </div>
            </article>
          </Reveal>

          {/* ---------- Projetos e Consultoria — peso igual entre si ---------- */}
          <div className="grid gap-6 lg:grid-rows-2 lg:gap-8">
            {support.map((pillar, index) => (
              <Reveal key={pillar.id} variant="side" delay={index * 80}>
                {/*
                  Numeral + régua no topo, texto maior e vão interno menor. As
                  duas caixas dividiam a altura do cartão de Equipamentos e
                  sobrava um buraco no meio de cada uma — era isso que as fazia
                  ler como card de SaaS. O numeral também amarra a seção à
                  primeira dobra, onde os pilares já são 01/02/03.
                */}
                <article className="flex h-full flex-col border border-white/12 p-6 md:p-7">
                  <div className="flex items-center gap-3">
                    <span className="font-condensed text-[0.75rem] font-bold leading-none tracking-[0.08em] text-yellow">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true" className="h-px w-6 bg-yellow/60" />
                    <h3 className="font-condensed text-[1.125rem] font-semibold uppercase tracking-[0.04em] text-canvas">
                      {pillar.name}
                    </h3>
                  </div>

                  <p className="mt-4 text-[1.0625rem] font-semibold leading-[1.35] text-canvas">
                    {pillar.statement}
                  </p>
                  <p className="mt-2 max-w-[42ch] text-body-sm leading-[1.5] text-canvas/70">
                    {pillar.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <Link
                      href={pillar.cta.href}
                      className="group inline-flex min-h-[2.75rem] w-fit items-center text-body-sm font-semibold text-canvas transition-colors hover:text-white"
                    >
                      <ArrowLinkLabel>{pillar.cta.label}</ArrowLinkLabel>
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/**
 * O rótulo do link com o mesmo traço amarelo de `ArrowLink` em fundo escuro.
 * Existe porque estes dois links apontam para âncoras da própria página e não
 * precisam da caixa de 44px duas vezes — a caixa já está no `<Link>` externo.
 */
function ArrowLinkLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center gap-2 pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-right after:scale-x-0 after:bg-yellow after:transition-transform after:duration-[240ms] after:ease-precise after:content-[''] group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100">
      {children}
      <ArrowRightIcon
        size={16}
        aria-hidden="true"
        className="shrink-0 text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-visible:translate-x-1"
      />
    </span>
  )
}
