import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography/heading'
import { ArrowLink, LinkButton } from '@/components/ui/actions/button'
import { homeProjectsSection } from '@/data/v2/home'
import { scopeLevels } from '@/data/scope-levels'

/**
 * ============================================================
 * PROJETOS — PORTA INDEPENDENTE
 * ============================================================
 *
 * Quem chega precisando projetar não deve ser obrigado a entrar pela porta de
 * Equipamentos (`docs/v2/DECISIONS.md`, DEC-002). A seção tem CTA próprio,
 * evidência própria e não exige leitura das outras duas frentes.
 *
 * DOIS TIPOS DE EVIDÊNCIA, DOIS RÓTULOS — DEC-008
 * -----------------------------------------------
 * Planta e render **não** dividem a mesma moldura sem distinção. Cada painel
 * declara o que é no próprio rótulo, e o do estudo 3D diz explicitamente que
 * não é obra executada. Confundir os dois é o tipo de prova fabricada que a
 * regra de não-invenção proíbe — e é fácil de cometer sem querer, porque os
 * dois arquivos vivem lado a lado em `public/images/projects/`.
 *
 * Os entregáveis vêm de `scopeLevels` (nível 02, "Projeto e engenharia"), que
 * já é conteúdo real e revisado — nada de lista nova escrita aqui.
 */
export function ProjectsDoor() {
  const deliverables = scopeLevels.find((level) => level.id === 'projeto')?.deliverables ?? []

  return (
    <section id="projetos" className="bg-surface py-16 md:py-20 lg:py-section">
      <Container>
        {/*
          A coluna de texto encolheu (40fr → 34fr) e as duas evidências
          cresceram: a autoridade desta seção vem do **documento**, não do
          parágrafo. Antes os dois painéis ocupavam metade da metade e liam
          como miniatura de apoio — "imagem + texto", que é exatamente o que
          esta porta não pode parecer.
        */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] lg:items-center lg:gap-x-12">
          <div className="flex flex-col">
            <Reveal>
              <Eyebrow>{homeProjectsSection.eyebrow}</Eyebrow>
              <Heading as={2} size="title-1" className="mt-5 max-w-[16ch]">
                {homeProjectsSection.title}
              </Heading>
              <Lead className="mt-5">{homeProjectsSection.lead}</Lead>
            </Reveal>

            <Reveal delay={80} className="mt-7">
              <ul className="flex flex-col gap-3 border-t border-line pt-6">
                {deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-body-sm text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140} className="mt-8">
              {/* ----------
                  Lado a lado só onde a coluna é a página inteira.

                  A partir de `lg` esta coluna vale 34fr de ~1.216px — cerca de
                  390px. Os dois CTAs em linha não cabem ali, e o rótulo do
                  botão preenchido quebrava em duas linhas dentro da caixa
                  amarela, que é o pior lugar da página para uma quebra: o
                  bloco de cor fica com duas alturas e o CTA primário perde a
                  forma. Empilhados, os dois mantêm a caixa e a ordem de
                  prioridade continua legível de cima para baixo.
                  ---------- */}
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-5">
                <LinkButton href={homeProjectsSection.cta.href} size="md" withArrow>
                  {homeProjectsSection.cta.label}
                </LinkButton>
                <ArrowLink href={homeProjectsSection.secondaryCta.href}>
                  {homeProjectsSection.secondaryCta.label}
                </ArrowLink>
              </div>
            </Reveal>
          </div>

          {/* ---------- Documento e render, cada um com o tipo declarado ---------- */}
          <Reveal variant="settle" delay={100}>
            <div className="grid gap-5 sm:grid-cols-2">
              {homeProjectsSection.evidence.map((item) => (
                <figure key={item.id} className="flex flex-col">
                  {/*
                    O rótulo de tipo sobe para **dentro** da imagem, numa tarja
                    grafite: é a mesma legenda técnica do hero e das categorias,
                    e resolve de uma vez o requisito de DEC-008 — o tipo viaja
                    colado à evidência, não numa linha solta abaixo que pode ser
                    lida separada dela.
                  */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-canvas-deep">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      quality={82}
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover object-center"
                    />

                    <span className="absolute left-0 top-0 inline-flex items-center gap-2 bg-graphite px-3 py-2 font-condensed text-[0.625rem] font-semibold uppercase leading-none tracking-[0.12em] text-canvas">
                      <span aria-hidden="true" className="h-[2px] w-4 shrink-0 bg-yellow" />
                      {item.kind}
                    </span>
                  </div>

                  <figcaption className="mt-3 text-body-sm leading-[1.45] text-muted">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
