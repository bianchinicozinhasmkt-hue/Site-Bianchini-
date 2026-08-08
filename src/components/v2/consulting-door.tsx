import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { homeConsultingSection } from '@/data/v2/home'
import { diagnosisAreas, diagnosisOutcomes } from '@/data/diagnosis'

/**
 * ============================================================
 * CONSULTORIA — PORTA INDEPENDENTE
 * ============================================================
 *
 * A outra porta de sustentação (`docs/v2/DECISIONS.md`, DEC-002), com o mesmo
 * peso visual de Projetos e natureza deliberadamente distinta: Projetos mostra
 * **documento** em superfície clara ("aqui está o desenho que instrui a obra");
 * Consultoria abre pelo **sintoma reconhecível** em superfície escura
 * ("reconheça o problema antes de ouvir a oferta").
 *
 * NÃO DEPENDE DE PESSOA NOMEADA
 * -----------------------------
 * Não existe decisão confirmada sobre responsável público, foto, nome ou cargo
 * para este pilar — "Operação Comercial" (Guilherme Beghini) é competência
 * interna e **não** é o pilar público Consultoria (DEC-004,
 * `docs/v2/V2_PRODUCT.md` §4). Nenhum elemento aqui é estruturado em torno de
 * uma pessoa: a seção comunica por conteúdo, processo e evidência.
 *
 * Se um especialista público for confirmado no futuro, ele entra como reforço
 * (citação atribuída, retrato junto ao CTA) **sem alterar esta arquitetura** —
 * classificação `CONTEÚDO OPCIONAL FUTURO — NÃO BLOQUEADOR`.
 *
 * A PROGRESSÃO É EXPLÍCITA
 * ------------------------
 *   diagnóstico ... o título abre pelo sintoma, não pela oferta
 *   análise ....... as seis frentes lidas na visita (`diagnosisAreas`)
 *   decisão ....... o que a leitura permite decidir (`diagnosisOutcomes`)
 *   melhoria ...... o último item da própria lista, mais o CTA
 *
 * `diagnosisOutcomes` são consequências de método, não promessas de resultado:
 * nenhum percentual de economia é declarado, porque não há base verificável.
 */
export function ConsultingDoor() {
  return (
    <section
      id="consultoria"
      className="on-dark bg-graphite py-16 text-canvas md:py-20 lg:py-section"
    >
      <Container>
        <Reveal>
          <Eyebrow tone="light">{homeConsultingSection.eyebrow}</Eyebrow>
          <Heading as={2} size="title-1" className="mt-5 max-w-[20ch] text-canvas">
            {homeConsultingSection.title}
          </Heading>
          <Lead tone="light" className="mt-5">
            {homeConsultingSection.lead}
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-x-12">
          <Reveal variant="settle">
            <figure className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/12 bg-graphite-deep lg:aspect-[3/4]">
                <Image
                  src={homeConsultingSection.media.src}
                  alt={homeConsultingSection.media.alt}
                  fill
                  quality={82}
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 text-body-sm leading-[1.45] text-canvas/60">
                {homeConsultingSection.media.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col">
            {/* ---------- Análise: as seis frentes lidas na visita ---------- */}
            <Reveal variant="side">
              <h3 className="font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-yellow">
                {homeConsultingSection.areasLabel}
              </h3>

              {/* ----------
                  Seis frentes como **lista numerada de leitura**, não como
                  grade de seis caixas.

                  Em duas colunas com borda em cada item, a seção lia como
                  catálogo de serviços — e era o bloco mais fragmentado da
                  página. Em coluna única, com numeral técnico e uma régua
                  separando as linhas, ela passa a se ler como o roteiro da
                  visita: uma frente depois da outra, na ordem em que são
                  levantadas.
                  ---------- */}
              <ul className="mt-5 flex flex-col">
                {diagnosisAreas.map((area, index) => (
                  <li
                    key={area.title}
                    className="flex gap-4 border-t border-white/12 py-3 first:border-t-0 first:pt-0"
                  >
                    <span className="mt-[0.2em] shrink-0 font-condensed text-[0.75rem] font-bold leading-none tracking-[0.08em] text-yellow">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-body-sm font-semibold text-canvas">{area.title}</span>
                      <span className="text-[0.8125rem] leading-[1.45] text-canvas/70">
                        {area.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* ---------- Decisão e melhoria ---------- */}
            <Reveal variant="side" delay={80} className="mt-9">
              <h3 className="font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-yellow">
                {homeConsultingSection.outcomesLabel}
              </h3>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {diagnosisOutcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-center gap-2 text-body-sm text-canvas/85 before:h-[3px] before:w-[3px] before:shrink-0 before:rounded-full before:bg-yellow before:content-['']"
                  >
                    {outcome}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140} className="mt-9">
              <LinkButton href={homeConsultingSection.cta.href} variant="primary" size="md" withArrow>
                {homeConsultingSection.cta.label}
              </LinkButton>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
