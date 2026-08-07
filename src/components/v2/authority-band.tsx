import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { ArrowLink } from '@/components/ui/actions/button'
import { homeAuthoritySection } from '@/data/v2/home'
import { leadershipTeam } from '@/data/team'

/**
 * ============================================================
 * AUTORIDADE CONDENSADA — UMA FAIXA, NÃO DUAS SEÇÕES
 * ============================================================
 *
 * A V1 tinha duas seções sobre as mesmas pessoas (`quem-conduz` + `leonardo`),
 * ocupando 17,6% da home. A V2 funde as duas numa faixa baixa: apresentar quem
 * responde é credibilidade de apoio, não conversão, e não pode interromper a
 * jornada comercial (`docs/v2/specs/V2-01-home-arquitetura.md`, item E.7).
 *
 * O QUE FICA DE FORA, DE PROPÓSITO
 * --------------------------------
 * · **A trajetória completa** — já existe em `/leonardo-bianchini`, com dossiê
 *   próprio. A faixa aponta para lá em vez de reproduzir.
 * · **O livro** — decisão congelada mantém a capa dentro do dossiê de Leonardo,
 *   sem CTA de compra (`book.purchaseUrl` é `null`).
 * · **Dois bullets, não quatro.** `leadershipTeam` traz quatro por pessoa; aqui
 *   entram os dois primeiros. É apresentação, não currículo — a lista inteira
 *   está na página de destino.
 *
 * Guilherme aparece com o cargo que o dado real registra ("Operação Comercial",
 * `src/data/team.ts`). Isso **não** o transforma no responsável público pelo
 * pilar Consultoria — os dois são coisas distintas (DEC-004), e a seção de
 * Consultoria não depende de nenhuma pessoa nomeada.
 */
export function AuthorityBand() {
  const people = [leadershipTeam.leonardo, leadershipTeam.guilherme]

  return (
    <section id="empresa" className="bg-surface py-14 md:py-16 lg:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
              <Eyebrow>{homeAuthoritySection.eyebrow}</Eyebrow>
              <Heading as={2} size="title-2" className="max-w-[20ch]">
                {homeAuthoritySection.title}
              </Heading>
            </div>

            <ArrowLink href={homeAuthoritySection.cta.href}>
              {homeAuthoritySection.cta.label}
            </ArrowLink>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2 md:gap-10">
          {people.map((person, index) => (
            <li key={person.name}>
              <Reveal variant="side" delay={index * 80}>
                <article className="flex gap-5">
                  <span className="relative h-[5.5rem] w-[4.5rem] shrink-0 overflow-hidden bg-canvas-deep md:h-[6.5rem] md:w-[5.25rem]">
                    <Image
                      src={person.portrait.src}
                      alt={person.portrait.alt}
                      fill
                      quality={86}
                      sizes="84px"
                      className="object-cover object-top"
                    />
                  </span>

                  <div className="flex flex-col">
                    <h3 className="font-sans text-body font-bold text-ink">{person.name}</h3>
                    <p className="mt-0.5 font-condensed text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted">
                      {person.role}
                    </p>

                    <ul className="mt-3 flex flex-col gap-1.5">
                      {person.bullets.slice(0, 2).map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-body-sm leading-[1.45] text-muted">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink/50"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
