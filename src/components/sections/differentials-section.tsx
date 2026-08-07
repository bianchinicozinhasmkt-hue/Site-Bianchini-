import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { ArrowLink } from '@/components/ui/actions/button'
import { Eyebrow } from '@/components/ui/typography/heading'
import { positioning, scopeMetrics } from '@/data/site'
import { differentialClaims } from '@/data/differentials'
import { cn } from '@/lib/utils'

/**
 * Diferenciais — **três afirmações**, não seis tópicos equivalentes.
 *
 * Os seis itens continuam disponíveis em `src/data/differentials.ts`; a Home
 * publica apenas as três afirmações centrais, cada uma apoiada por material
 * real ou por números já confirmados no conteúdo institucional.
 *
 * A seção abre pela frase de essência (copy aprovada em `positioning`) em
 * escala grande e sem caixa: é a única vez que ela aparece na home, e por isso
 * ocupa a largura inteira em vez de viver numa citação lateral.
 *
 * O vão entre essa frase e a primeira evidência era o maior espaço vazio sem
 * função da home (~130px de branco puro) — `mt-14/20` mais o próprio respiro
 * da seção. Fecha em `mt-8/10`: a frase e a primeira afirmação passam a ler
 * como a mesma composição, não como dois blocos empilhados.
 *
 * **As três evidências não entram da mesma maneira.** O registro de campo
 * assenta, a peça de acervo entra pelo lado e os números sobem — cada uma
 * chega como o que é, e a repetição idêntica (que é o que denuncia composição
 * automática) não acontece. As três compartilham curva e faixa de duração.
 */
const EVIDENCE_MOTION = ['settle', 'side', 'up'] as const

/** As duas afirmações provadas por fotografia. */
const photoClaims = differentialClaims.filter(
  (claim): claim is typeof claim & { material: { kind: 'image'; src: string; alt: string; caption: string } } =>
    claim.material.kind === 'image',
)

/** A afirmação provada por número — tem forma própria, não é uma terceira coluna. */
const metricClaim = differentialClaims.find((claim) => claim.material.kind === 'metrics')

export function DifferentialsSection() {
  return (
    <Section
      id="diferenciais"
      tone="surface"
      space="default"
      bleed
      aria-labelledby="diferenciais-titulo"
      /* As evidências sangram para fora do container; sem isto viram rolagem. */
      className="overflow-hidden"
    >
      <Container>
        <Eyebrow>Por que Bianchini</Eyebrow>

        <h2
          id="diferenciais-titulo"
          className="mt-6 max-w-[24ch] font-sans font-bold text-title-1 text-ink"
        >
          {positioning.essence}
        </h2>

        {/* ==========================================================
            Duas afirmações com evidência fotográfica.

            Cada uma é **afirmação → evidência → o que muda**: número e título
            afirmam, a fotografia comprova, a descrição diz o que isso altera
            para quem contrata. Nenhuma caixa, nenhuma sombra, nenhum card.

            A assimetria é medida, não decorativa: a evidência ocupa 7 das 12
            colunas contra 5 do texto, e **sangra para fora do container** pelo
            lado externo (`-mr`/`-ml` negativos). É o recurso do §11 — área
            fotográfica ultrapassando o container — e é o que dá profundidade
            sem recorrer a sombra ou gradiente.
            ========================================================== */}
        <div className="mt-8 space-y-12 lg:mt-10 lg:space-y-16">
          {photoClaims.map((claim, index) => {
            const flipped = index % 2 === 1
            return (
              <article
                key={claim.id}
                className="grid items-center gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-14 lg:pt-14"
              >
                <Reveal
                  className={cn(
                    'lg:col-span-5',
                    flipped ? 'lg:order-2 lg:col-start-8' : 'lg:col-start-1',
                  )}
                >
                  <p className="font-condensed text-caption font-bold tabular-nums text-ink">
                    {claim.lead.number}
                  </p>
                  <h3 className="mt-3 font-sans font-bold text-title-2 text-ink">
                    {claim.lead.title}
                  </h3>
                  <p className="mt-5 max-w-[52ch] text-lead text-muted">{claim.lead.description}</p>
                </Reveal>

                <Reveal
                  variant={EVIDENCE_MOTION[index]}
                  delay={110}
                  className={cn(
                    'lg:col-span-7',
                    flipped
                      ? 'lg:order-1 lg:col-start-1 lg:-ml-10 xl:-ml-16'
                      : 'lg:col-start-6 lg:-mr-10 xl:-mr-16',
                  )}
                >
                  <figure>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas-deep">
                      <Image
                        src={claim.material.src}
                        alt={claim.material.alt}
                        fill
                        sizes="(max-width: 1023px) 92vw, 56vw"
                        quality={82}
                        className="object-cover"
                      />
                    </div>
                    <figcaption
                      className={cn(
                        'mt-4 max-w-[46ch] border-l-2 border-yellow-deep pl-4 text-caption text-muted',
                        flipped && 'lg:ml-10 xl:ml-16',
                      )}
                    >
                      {claim.material.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              </article>
            )
          })}
        </div>

        {/* ==========================================================
            Terceira afirmação — a que é sustentada por número, não por
            fotografia. Vira **faixa de largura inteira**, não uma coluna
            estreita com um `dl` perdido: a mudança de forma é o que impede
            que as três afirmações leiam como três variações do mesmo bloco.
            ========================================================== */}
        {metricClaim ? (
          <Reveal className="mt-12 border-t border-line pt-8 lg:mt-14 lg:pt-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
              <div className="lg:col-span-5">
                <p className="font-condensed text-caption font-bold tabular-nums text-ink">
                  {metricClaim.lead.number}
                </p>
                <h3 className="mt-3 font-sans font-bold text-title-2 text-ink">
                  {metricClaim.lead.title}
                </h3>
              </div>

              <p className="max-w-[52ch] text-lead text-muted lg:col-span-4">
                {metricClaim.lead.description}
              </p>

              <dl className="lg:col-span-3">
                {scopeMetrics.slice(0, 2).map((metric) => (
                  <div key={metric.value} className="border-t border-line py-4 first:border-t-0 first:pt-0">
                    <dd className="font-condensed text-title-1 font-bold leading-none text-ink">
                      {metric.value}
                    </dd>
                    <dt className="mt-2 text-caption text-muted">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        ) : null}

        <ArrowLink href="/sobre" className="mt-12">
          Como a Bianchini trabalha
        </ArrowLink>
      </Container>
    </Section>
  )
}
