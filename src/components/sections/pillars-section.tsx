import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { pillars } from '@/data/pillars'
import { leadershipTeam } from '@/data/team'

/**
 * Os três pilares — estrutura organizacional da Bianchini. Diferente dos
 * "cinco níveis de atuação" (processo, `scope-section.tsx`) e dos "quatro
 * caminhos de solução" (oferta, `solutions.ts`): aqui a pergunta é "o que a
 * empresa faz e quem responde por isso".
 *
 * ============================================================
 * POR QUE OFERTA E RESPONSABILIDADE FORAM SEPARADAS (2026-08-04)
 * ============================================================
 *
 * A versão anterior repetia o **responsável dentro de cada cartão**. Como
 * Leonardo responde por dois dos três pilares, "Leonardo Bianchini" aparecia
 * duas vezes lado a lado, em selos idênticos — lia como erro de montagem, não
 * como informação. Pior: o rodapé de cada cartão dependia da altura do texto
 * acima dele, e o terceiro pilar (copy mais curta) subia o selo uns 26px em
 * relação aos outros dois, desalinhando a fileira inteira.
 *
 * Agora são duas camadas:
 *
 *   cartões ...... **o que** a Bianchini entrega — três, simétricos, sem nome
 *                  de pessoa
 *   faixa ........ **quem responde** — duas pessoas, uma vez cada, com os
 *                  pilares que cada uma cobre
 *
 * Cada nome aparece uma vez só, e a distribuição real (2 + 1) fica explícita
 * em vez de ser deduzida por repetição.
 *
 * A faixa lê `leadershipTeam` — a mesma fonte de "Quem conduz"
 * (`leadership-section.tsx`), que vem logo depois. Nome e função não são
 * redigitados aqui: se mudarem lá, mudam aqui, e as duas seções não podem
 * divergir. Os pilares de cada pessoa são derivados de `pillars.responsible`
 * pelo nome, não listados à mão pelo mesmo motivo.
 *
 * **Sem fotografia e sem numeral gigante.** Os retratos são o recurso da
 * seção seguinte e usá-los aqui roubaria o efeito dela; o numeral esmaecido
 * de 6,5rem que ficava atrás de cada cartão saiu por ferir o teto de
 * composição registrado em `CLAUDE.md` ("numeral gigante: nenhum na home;
 * índices são pequenos e ficam na margem") — além de ser cortado pela borda
 * do cartão e disputar com o próprio título.
 */

/** Pessoas na ordem dos pilares que respondem — não em ordem alfabética nem fixa no código. */
const leads = [leadershipTeam.leonardo, leadershipTeam.guilherme].map((person) => ({
  name: person.name,
  role: person.role,
  pillars: pillars.filter((pillar) => pillar.responsible === person.name),
}))

export function PillarsSection() {
  return (
    <Section id="pilares" tone="canvas" space="default" bleed aria-labelledby="pilares-titulo">
      <Container>
        <Eyebrow>Como a Bianchini está organizada</Eyebrow>
        <Heading as={2} id="pilares-titulo" size="title-1" className="mt-5 max-w-[20ch]">
          Três pilares, dois responsáveis
        </Heading>

        {/* ==========================================================
            Camada 1 — a oferta. Três cartões simétricos, sem nome de pessoa.
            ========================================================== */}
        {/*
          `as="li"` — o item da grade precisa ser o próprio `li`, não um `div`
          do `Reveal` com o `li` dentro: além da semântica da lista, é o item
          da grade que recebe a altura da linha, e um wrapper intermediário
          quebrava o `gap-px` que desenha a moldura.

          Os cartões dividem uma moldura só (`gap-px` sobre `bg-line`): são
          três faces de uma mesma estrutura, não três objetos soltos — e a
          junção fica com a espessura exata de um fio, sem o vão irregular que
          três caixas com borda própria produziam.
        */}
        <ol className="mt-10 grid gap-px border border-line bg-line lg:mt-14 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal
              key={pillar.number}
              as="li"
              delay={index * 90}
              className="group flex h-full flex-col bg-surface p-7 transition-colors duration-300 ease-smooth hover:bg-canvas-deep lg:p-9"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[2px] w-6 shrink-0 bg-yellow transition-[width] duration-300 ease-smooth group-hover:w-10"
                />
                <span className="font-condensed text-eyebrow font-bold tabular-nums tracking-[0.12em] text-ink/45">
                  {pillar.number}
                </span>
              </div>

              <h3 className="mt-5 max-w-[16ch] font-sans font-bold text-title-2 text-ink">
                {pillar.title}
              </h3>
              <p className="mt-4 max-w-[40ch] text-body text-muted">{pillar.description}</p>
            </Reveal>
          ))}
        </ol>

        {/* ==========================================================
            Camada 2 — a responsabilidade. Duas pessoas, uma vez cada.

            Grade de duas colunas com o mesmo tratamento nos dois lados: nome,
            função e os pilares cobertos, alinhados na mesma linha de base. É
            deliberadamente **tipográfica** — sem retrato, sem selo de
            iniciais, sem cartão — para não antecipar a composição de "Quem
            conduz", que vem em seguida e é onde os dois ganham imagem.
            ========================================================== */}
        <Reveal variant="settle">
          <div className="mt-10 border-t-2 border-ink pt-7 lg:mt-12 lg:pt-8">
            <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-ink/60">
              Quem responde por cada frente
            </p>

            <dl className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:gap-16">
              {leads.map((lead, index) => (
                <div
                  key={lead.name}
                  className={
                    index > 0
                      ? 'border-t border-line pt-8 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0 lg:pl-16'
                      : undefined
                  }
                >
                  <dt className="font-sans font-bold text-title-3 text-ink">{lead.name}</dt>
                  <dd className="mt-1.5 font-condensed text-caption font-semibold uppercase tracking-[0.09em] text-ink/70">
                    {lead.role}
                  </dd>
                  <dd className="mt-4 flex flex-wrap gap-2">
                    {lead.pillars.map((pillar) => (
                      <span
                        key={pillar.number}
                        className="inline-flex items-baseline gap-2 border border-line bg-surface px-3 py-1.5 text-caption font-semibold text-ink"
                      >
                        <span className="font-condensed tabular-nums text-ink/45">
                          {pillar.number}
                        </span>
                        {pillar.title}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
