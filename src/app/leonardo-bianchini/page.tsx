import type { Metadata } from 'next'
import Image from 'next/image'
import { LeonardoHero } from '@/components/sections/leonardo-hero'
import { BookSection } from '@/components/sections/book-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { IndexNumeral, TechLabel, TickRule } from '@/components/ui/tech'
import { leonardo } from '@/data/leonardo'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema, personSchema } from '@/lib/schema'

const path = '/leonardo-bianchini'

export const metadata: Metadata = pageMetadata({
  title: 'Leonardo Bianchini',
  absoluteTitle: 'Leonardo Bianchini | Especialista em Cozinhas Industriais e Food Service',
  description:
    'Conheça a trajetória de Leonardo Bianchini, especialista em cozinhas profissionais, equipamentos, implantação e estratégia para empresas de food service.',
  path,
  /*
    Cartão social próprio, em 1200 × 630 — o retrato cru é um PNG vertical com
    transparência: LinkedIn e WhatsApp o recortariam na horizontal e achatariam
    o alfa contra fundo branco. O JPG abaixo compõe o mesmo retrato sobre o
    grafite da marca, com logo e assinatura.
  */
  image: {
    url: '/images/team/leonardo-bianchini-og.jpg',
    alt: 'Leonardo Bianchini, especialista em cozinhas profissionais e industriais',
    width: 1200,
    height: 630,
  },
})

/**
 * Página de autoridade de Leonardo Bianchini.
 *
 * A ordem é argumentativa, não biográfica: primeiro *como ele trabalha* (tese),
 * depois *onde isso foi construído* (trajetória), depois *o alcance técnico*
 * (mapa de competências e setores), então as provas externas — livro e
 * depoimentos — e só no fim a conversa.
 *
 * Um único `h1`, no hero. Todas as seções abrem em `h2`, e os itens internos
 * descem para `h3`/`h4` sem pular nível.
 *
 * Nenhuma data intermediária de carreira é exibida: só 2008 está confirmado.
 * Ver as notas de origem e as pendências em `src/data/leonardo.ts`.
 */
export default function LeonardoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Leonardo Bianchini', path },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <LeonardoHero />

      {/* ============ 2. Tese de trabalho ============ */}
      <Section id="tese" tone="canvas" space="lg" bleed aria-labelledby="tese-titulo">
        <div className="mx-auto w-full max-w-container px-5 md:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow as="p">{leonardo.thesis.eyebrow}</Eyebrow>
              <Heading as={2} id="tese-titulo" size="title-1" className="mt-5">
                {leonardo.thesis.title}
              </Heading>
            </div>

            <p className="text-lead text-muted lg:col-span-6 lg:col-start-7 lg:self-end">
              {leonardo.thesis.lead}
            </p>
          </div>

          {/*
            Seis tempos em régua contínua, não em cards: cada um herda a borda
            superior do anterior, de modo que a leitura desce como uma lista de
            decisões — que é exatamente o que a tese descreve.
          */}
          <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {leonardo.thesis.points.map((point, index) => (
              <Reveal
                key={point.marker}
                as="li"
                delay={index * 50}
                className="flex flex-col gap-3 border-b border-line px-0 py-8 sm:odd:pr-10 sm:even:border-l sm:even:pl-10 lg:[&:nth-child(3n+1)]:pr-10 lg:[&:nth-child(3n+2)]:border-l lg:[&:nth-child(3n+2)]:px-10 lg:[&:nth-child(3n+3)]:border-l lg:[&:nth-child(3n+3)]:pl-10"
              >
                <IndexNumeral className="text-title-3">{point.marker}</IndexNumeral>
                <h3 className="font-sans text-title-3 font-bold text-ink">{point.title}</h3>
                <p className="text-body-sm text-muted">{point.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* ============ 3. Trajetória ============ */}
      <Section
        id="trajetoria"
        tone="graphite"
        space="lg"
        aria-labelledby="trajetoria-titulo"
        className="relative overflow-hidden"
      >

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:self-start">
            <Eyebrow tone="light" as="p">
              Trajetória
            </Eyebrow>
            <Heading as={2} id="trajetoria-titulo" size="title-1" className="mt-5 text-canvas">
              Construída dentro da operação e dentro da indústria
            </Heading>
            <p className="mt-6 max-w-md text-body-sm text-canvas/70">
              Uma linha de atuação, não uma cronologia: só 2008 é marco confirmado. Os demais
              movimentos são frentes de trabalho, e não datas.
            </p>

            {/* Contact sheet: registros de campo em resolução nativa, exibidos
                pequenos de propósito — ampliá-los degradaria a imagem. */}
            <div className="mt-10">
              <TechLabel tone="light">Registros de campo</TechLabel>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {leonardo.fieldRecords.map((record) => (
                  <li key={record.src} className="w-[4.5rem]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[2px] ring-1 ring-white/15">
                      <Image
                        src={record.src}
                        alt={record.alt}
                        fill
                        quality={78}
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-1.5 text-[0.6875rem] leading-tight text-canvas/50">
                      {record.caption}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/*
            Linha editorial: marcador à esquerda, conteúdo à direita, separados
            por um fio contínuo que atravessa todos os movimentos.
          */}
          <ol className="lg:col-span-7 lg:col-start-6">
            {leonardo.trajectory.map((movement, index) => (
              <Reveal
                key={movement.id}
                as="li"
                delay={index * 50}
                className="grid gap-x-8 gap-y-2 border-t border-white/15 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_1fr]"
              >
                <p className="text-caption font-semibold uppercase tracking-[0.14em] text-yellow">
                  {movement.marker}
                </p>
                <div>
                  <h3 className="font-sans text-title-3 font-bold text-canvas">{movement.title}</h3>
                  <p className="mt-2 max-w-[58ch] text-body-sm text-canvas/70">
                    {movement.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* ============ 4. Mapa de competências ============ */}
      <Section
        id="competencias"
        tone="canvas-deep"
        space="lg"
        aria-labelledby="competencias-titulo"
        className="relative overflow-hidden"
      >

        <div className="relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-6">
              <Eyebrow as="p">Mapa de competências</Eyebrow>
              <Heading as={2} id="competencias-titulo" size="title-1" className="mt-5 max-w-[20ch]">
                Onze frentes que só funcionam juntas
              </Heading>
            </div>
            <p className="text-body-sm text-muted lg:col-span-5 lg:col-start-8">
              Nenhuma delas resolve sozinha. O que muda o resultado de uma operação é a passagem
              entre elas — do diagnóstico ao projeto, do projeto à fábrica, da fábrica ao pós-venda.
            </p>
          </div>

          {/*
            Diagrama de três domínios sobre uma linha contínua. No desktop o fio
            é horizontal e os nós marcam onde cada domínio se ancora; abaixo de
            `md` o fio vira a própria borda superior de cada domínio, para não
            virar um traço solto atravessando conteúdo empilhado.
          */}
          <div className="relative mt-14 lg:mt-20">
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-1 hidden h-px bg-steel/40 md:block"
            />

            <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
              {leonardo.skillMap.map((domain, index) => (
                <Reveal key={domain.id} delay={index * 70} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -top-[3px] left-0 hidden h-[9px] w-[9px] rotate-45 border border-ink bg-canvas-deep md:block"
                  />

                  <div className="border-t border-line pt-6 md:border-t-0 md:pt-10">
                    <h3 className="font-sans text-title-2 font-bold text-ink">{domain.title}</h3>
                    <p className="mt-2 text-body-sm text-muted">{domain.summary}</p>

                    <ul className="mt-6">
                      {domain.skills.map((skill) => (
                        <li
                          key={skill}
                          className="flex items-center gap-3 border-b border-line py-3 text-body text-ink last:border-b-0"
                        >
                          <span aria-hidden="true" className="h-[2px] w-4 shrink-0 bg-ink" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============ 5. Setores ============ */}
      <Section id="setores" tone="surface" space="default" aria-labelledby="setores-titulo">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow as="p">Setores</Eyebrow>
            <Heading as={2} id="setores-titulo" size="title-2" className="mt-5">
              Onde essa experiência foi aplicada
            </Heading>
          </div>

          {/* Régua de rótulos: uma linha contínua, sem etiqueta em caixa. */}
          <div className="lg:col-span-7 lg:col-start-6">
            <TickRule />
            <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {leonardo.sectors.map((sector) => (
                <li
                  key={sector}
                  className="flex items-center gap-2.5 font-sans text-title-3 font-semibold text-ink"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-ink" />
                  {sector}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ============ 6. Livro ============ */}
      <BookSection tone="canvas" detailed />

      {/* ============ 7. Depoimentos ============ */}
      <TestimonialsSection />

      {/* ============ 8. Conteúdos ============ */}
      <Section id="conteudos" tone="canvas-deep" space="lg" aria-labelledby="conteudos-titulo">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow as="p">Conteúdos</Eyebrow>
            <Heading as={2} id="conteudos-titulo" size="title-1" className="mt-5 max-w-[18ch]">
              Temas que orientam o trabalho
            </Heading>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            {/*
              Declaração honesta em vez de vitrine vazia: a estrutura existe,
              mas nenhum artigo ou vídeo foi publicado ainda — e nenhum é
              inventado para preencher a seção.
            */}
            <p className="text-body-sm text-muted">
              Esta área está preparada para receber artigos e vídeos de Leonardo. Ainda não há
              publicações — os temas abaixo são os que orientam o trabalho e podem ser tratados
              diretamente em uma conversa.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid border-t border-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {leonardo.contentTopics.map((topic, index) => (
            <Reveal
              key={topic.title}
              as="li"
              delay={index * 40}
              className="flex flex-col gap-2 border-b border-line py-7 sm:odd:pr-10 sm:even:border-l sm:even:pl-10 lg:[&:nth-child(3n+1)]:pr-10 lg:[&:nth-child(3n+2)]:border-l lg:[&:nth-child(3n+2)]:px-10 lg:[&:nth-child(3n+3)]:border-l lg:[&:nth-child(3n+3)]:pl-10"
            >
              <h3 className="font-sans text-title-3 font-bold text-ink">{topic.title}</h3>
              <p className="text-body-sm text-muted">{topic.description}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ============ 9. CTA final ============ */}
      <FinalCtaSection
        eyebrow="Próximo passo"
        title={leonardo.finalCta.title}
        description={leonardo.finalCta.text}
        primaryLabel={leonardo.finalCta.label}
        primaryHref={leonardo.finalCta.href}
      />
    </>
  )
}
