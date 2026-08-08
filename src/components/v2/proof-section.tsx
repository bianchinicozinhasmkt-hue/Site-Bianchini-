import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeader } from '@/components/layout/section'
import { ArrowLink } from '@/components/ui/actions/button'
import { homeDisclosure, homeProofSection } from '@/data/v2/home'
import { featuredProjects, leadProject } from '@/data/projects'
import { featuredClients } from '@/data/clients'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'

/**
 * ============================================================
 * PROVA — EVIDÊNCIA VERIFICÁVEL, EM TRÊS RAIAS
 * ============================================================
 *
 * Três tipos de prova com pesos de confiança diferentes, que não se substituem:
 * operação entregue (fotografia real), marcas de operações atendidas (os mesmos
 * logos que a V1 já exibe, com a mesma ressalva de autorização) e depoimentos
 * identificáveis.
 *
 * FUNCIONA COM CONTEÚDO PARCIAL — E ESTÁ FUNCIONANDO ASSIM AGORA
 * -------------------------------------------------------------
 * Nenhuma raia depende de um número mínimo de itens: a de projetos aceita de 1
 * a 4 registros, a de logos usa `flex-wrap`, e a de depoimentos some inteira
 * quando não há o que publicar. Isso deixou de ser hipótese: **nesta release a
 * raia de depoimentos não é montada**, porque a autorização de uso ainda não
 * voltou do comercial (`homeDisclosure`, em `src/data/v2/home.ts`).
 *
 * A seção continua sólida sem ela — abre com a operação entregue em faixa
 * larga, segue com três registros e fecha com os logos. Nada foi promovido para
 * ocupar o lugar vago e nenhum substituto foi inventado.
 *
 * O QUE ESTA SEÇÃO DELIBERADAMENTE NÃO FAZ
 * ----------------------------------------
 * · **não atribui cliente, local, prazo ou resultado a nenhuma fotografia** —
 *   as legendas descrevem o que está na imagem, como já em `projects.ts`;
 * · **não repete a métrica numérica da primeira dobra.** "3.000+" tem
 *   divergência de confirmação registrada em `src/data/site.ts`; exibi-la duas
 *   vezes na mesma página aumentaria a exposição de um número que o comercial
 *   ainda não fechou, sem acrescentar prova;
 * · **não inventa case.** Nenhum registro do acervo responde "para quem", "qual
 *   problema" e "o que foi coordenado" — essa lacuna é herdada e continua
 *   aberta (`docs/v2/specs/V2-01-home-arquitetura.md`, item A.4). Preencher com
 *   texto novo violaria DEC-006.
 *
 * A raia de projetos usa proporção **fixa** por cartão em vez de mosaico livre:
 * com alturas variadas, a grade alinha pela célula mais alta e abre vãos sob os
 * cartões baixos. Fixando o recorte, o ritmo se mantém com qualquer contagem.
 */
export function ProofSection() {
  /*
    Autorização antes de contagem: os depoimentos existem no repositório, mas
    a reconfirmação de uso ainda não voltou do comercial — até lá a raia não é
    montada (`homeDisclosure`, em `src/data/v2/home.ts`). O dado permanece
    intacto; religar é trocar um booleano.
  */
  const hasTestimonials = homeDisclosure.testimonials && testimonials.length > 0
  const hasClients = featuredClients.length > 0

  return (
    <section id="prova" className="bg-canvas py-16 md:py-20 lg:py-section">
      <Container>
        <SectionHeader
          eyebrow={homeProofSection.eyebrow}
          title={homeProofSection.title}
          lead={homeProofSection.lead}
          action={<ArrowLink href={homeProofSection.cta.href}>{homeProofSection.cta.label}</ArrowLink>}
        />

        {/* ---------- Raia 1: operação entregue ---------- */}
        <Reveal variant="settle" className="mt-12">
          <figure className="flex flex-col">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-graphite lg:aspect-[21/9]">
              <Image
                src={leadProject.image}
                alt={leadProject.alt}
                fill
                quality={86}
                sizes="(max-width: 1279px) 100vw, 1200px"
                className="object-cover object-center"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink">
                {leadProject.title}
              </span>
              <span className="text-body-sm text-muted">{leadProject.caption}</span>
            </figcaption>
          </figure>
        </Reveal>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <li key={project.id}>
              <Reveal variant="settle" delay={index * 70}>
                <figure className="flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-graphite">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      quality={82}
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                  </div>

                  <figcaption className="mt-3 flex flex-col gap-1.5">
                    <span className="font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink">
                      {project.title}
                    </span>
                    <span className="text-body-sm leading-[1.45] text-muted">{project.caption}</span>
                    {project.scope?.length ? (
                      <span className="mt-1 text-[0.75rem] leading-[1.4] text-muted">
                        {project.scope.join(' · ')}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ---------- Raia 2: organizações atendidas ---------- */}
        {hasClients ? (
          <Reveal className="mt-16 border-t border-line pt-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {homeProofSection.clientsLabel}
              </h3>
              <p className="text-[0.75rem] leading-[1.4] text-muted">
                {homeProofSection.clientsNote}
              </p>
            </div>

            {/*
              Grade estática com quebra de linha, não carrossel: um carrossel
              automático sem controle de pausa reprova em WCAG 2.2.2, e a faixa
              deslizante da V1 ainda precisava de `loading="eager"` para não
              perder logo fora da viewport horizontal. Parado, nada disso existe.
            */}
            <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-7">
              {featuredClients.map((client) => (
                <li key={client.id} className="flex items-center">
                  <span
                    className={cn(
                      'relative block w-[6.5rem] opacity-75 transition-opacity duration-200 hover:opacity-100 md:w-[7.5rem]',
                      client.scale === 'sm' && 'h-8 md:h-9',
                      client.scale === 'md' && 'h-9 md:h-10',
                      (client.scale === 'lg' || !client.scale) && 'h-10 md:h-12',
                    )}
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      quality={86}
                      sizes="120px"
                      className="object-contain object-center"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/* ---------- Raia 3: depoimentos identificáveis ---------- */}
        {hasTestimonials ? (
          <Reveal className="mt-14 border-t border-line pt-8">
            <h3 className="font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {homeProofSection.testimonialsLabel}
            </h3>

            <ul className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10">
              {testimonials.map((testimonial) => (
                <li key={testimonial.id}>
                  <figure className="flex h-full flex-col">
                    <blockquote className="text-body leading-[1.6] text-ink">
                      <p>“{testimonial.quote}”</p>
                    </blockquote>

                    <figcaption className="mt-5 flex items-center gap-3">
                      {testimonial.photo ? (
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-canvas-deep">
                          <Image
                            src={testimonial.photo}
                            alt={testimonial.photoAlt ?? testimonial.author}
                            fill
                            quality={86}
                            sizes="44px"
                            className="object-cover object-center"
                          />
                        </span>
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas-deep font-condensed text-body-sm font-semibold text-ink">
                          {testimonial.initials}
                        </span>
                      )}

                      <span className="flex flex-col">
                        <span className="text-body-sm font-semibold text-ink">
                          {testimonial.author}
                        </span>
                        <span className="text-[0.8125rem] leading-[1.35] text-muted">
                          {testimonial.role} · {testimonial.organization}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}
