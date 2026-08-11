import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { TechLabel } from '@/components/ui/tech'
import { featuredClients } from '@/data/clients'
import { segments } from '@/data/segments'
import { scopeMetrics } from '@/data/site'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'

const logoScale = {
  sm: 'h-7 md:h-8',
  md: 'h-9 md:h-11',
  lg: 'h-12 md:h-14',
} as const

/**
 * Credibilidade — escala, segmentos, logotipos, depoimentos e livro, **uma
 * seção só**, só na home.
 *
 * ============================================================
 * POR QUE QUATRO SEÇÕES VIRARAM UMA
 * ============================================================
 *
 * `TrustSection`, `TestimonialsSection`, `BookSection` e `AboutSection`
 * somavam 2.960px na home e repetiam o mesmo argumento com pouca variação:
 * "a empresa é grande, é reconhecida, tem autoridade" — dito quatro vezes,
 * cada uma com o próprio eyebrow, o próprio título e a própria régua. É
 * exatamente a repetição que a direção de arte pediu para cortar.
 *
 * `TrustSection`, `TestimonialsSection` e `BookSection` continuam existindo
 * como componentes — são usadas em `/sobre`, `/projetos`,
 * `/leonardo-bianchini` e `/solucoes/consultoria-para-restaurantes` — só saem
 * da home. `AboutSection` não é usada em nenhuma outra rota; a única frase
 * dela que não se repetia em outro lugar da home entra aqui, condensada, e o
 * componente foi removido do repositório.
 *
 * ============================================================
 * TRÊS DENSIDADES, UMA SEÇÃO
 * ============================================================
 *
 *   escala ....... números + segmentos, em linha — a mesma composição
 *                  compacta que a `TrustSection` já usava
 *   prova ........ logotipos reais, coloridos, em faixa deslizante
 *   depoimentos .. dois, lado a lado, tipografia grande sem caixa
 *
 * Cada zona muda de forma (linha de números, faixa deslizante, citação): é a
 * variedade que evita a seção virar mais uma repetição do padrão "título,
 * texto, linha".
 *
 * Eram **quatro** densidades até 2026-08-04 — a quarta era o livro, movido
 * para o dossiê de Leonardo em `leadership-section.tsx`. Ver o comentário no
 * fim deste arquivo.
 */
export function CredibilitySection() {
  const marquee = [...featuredClients, ...featuredClients]

  return (
    <Section id="credibilidade" tone="canvas" space="default" bleed aria-labelledby="credibilidade-titulo">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>Credibilidade</Eyebrow>
            <Heading as={2} id="credibilidade-titulo" size="title-1" className="mt-5 max-w-[18ch]">
              Reconhecimento construído dentro do setor
            </Heading>
          </div>
          {/*
            Enunciado trocado em 2026-08-09. Era: "Arquitetura, engenharia,
            equipamentos, processo e estratégia comercial tratados como um
            sistema só — **não como frentes separadas**." A ressalva final
            contradizia a página: as frentes *podem* ser contratadas separadas
            (DEC-003), e a seção seguinte da home passou a dizer exatamente
            isso. Além disso, numa seção cuja função é escala e reconhecimento,
            o enunciado descrevia método — que é assunto de `#metodo`.

            O que entra no lugar é o alcance: 17 anos (dado confirmado pelo
            comercial em 2026-08-11 —
            `src/data/site.ts`) e a amplitude real de contratação, do item
            avulso à cozinha inteira (`src/data/faq.ts`, `kitchensFaq[0]`).
            Nenhum número novo.
          */}
          <p className="text-lead text-muted lg:col-span-4 lg:col-start-9">
            Dezessete anos dentro de operações de alimentação — do equipamento avulso à cozinha
            inteira projetada, fornecida e instalada.
          </p>
        </div>

        {/* ----------
            Escala + segmentos. `md:flex-row` (não só `lg:`): entre 768 e
            1023px os dois blocos cabiam lado a lado e estavam empilhando à
            toa — parte do motivo de o tablet ficar mais alto que o celular.
            ---------- */}
        <div className="mt-10 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-start md:gap-12 lg:mt-12 lg:gap-16">
          <dl className="flex shrink-0 flex-wrap gap-x-10 gap-y-5">
            {scopeMetrics.map((metric) => (
              <div key={metric.value} className="flex flex-col gap-1">
                <dd className="font-condensed font-bold text-title-2 text-ink">{metric.value}</dd>
                <dt className="max-w-[16ch] text-caption text-muted">{metric.label}</dt>
              </div>
            ))}
          </dl>

          <div className="md:border-l md:border-line md:pl-12 lg:pl-16">
            <p className="font-condensed text-eyebrow font-semibold uppercase text-ink/60">
              Segmentos atendidos
            </p>
            <p className="mt-3 max-w-[62ch] font-sans text-title-3 font-semibold text-ink">
              {segments.map((segment) => segment.title).join(' · ')}
            </p>
          </div>
        </div>
      </Container>

      {/* ---------- Logotipos reais, em faixa deslizante ---------- */}
      <div className="mt-10 lg:mt-12">
        <Container>
          <TechLabel className="max-w-xl">
            Marcas de operações atendidas ao longo de 17 anos — exibidas mediante autorização
          </TechLabel>
        </Container>

        <div className="group marquee-mask mt-5 overflow-hidden border-y border-line bg-surface py-7">
          <ul className="flex w-max animate-marquee items-center gap-14 pr-14 [animation-play-state:running] motion-reduce:animate-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] md:gap-20 md:pr-20">
            {marquee.map((client, index) => (
              <li key={`${client.id}-${index}`} className="flex shrink-0 items-center">
                <Image
                  src={client.logo}
                  alt={index < featuredClients.length ? client.name : ''}
                  aria-hidden={index >= featuredClients.length}
                  width={220}
                  height={110}
                  loading="eager"
                  quality={82}
                  sizes="220px"
                  className={cn('w-auto object-contain', logoScale[client.scale ?? 'md'])}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Container>
        {/* ==========================================================
            Depoimentos — dois, lado a lado, sem carrossel.
            ========================================================== */}
        {testimonials.length > 0 ? (
          <div className="mt-12 grid gap-y-10 border-t border-line pt-10 md:grid-cols-2 md:gap-x-10 lg:mt-14 lg:gap-x-14">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 80}>
                <figure
                  className={
                    index > 0
                      ? 'border-t border-line pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0 lg:pl-14'
                      : undefined
                  }
                >
                  {testimonial.context ? (
                    <p className="mb-4 font-condensed text-eyebrow font-semibold uppercase text-ink">
                      {testimonial.context}
                    </p>
                  ) : null}

                  <blockquote className="font-sans text-title-3 font-medium leading-[1.5] text-ink">
                    <p>{testimonial.quote}</p>
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-4">
                    {testimonial.photo ? (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.photoAlt ?? ''}
                        width={60}
                        height={60}
                        quality={80}
                        sizes="60px"
                        className="h-[60px] w-[60px] shrink-0 rounded-[2px] object-cover ring-1 ring-line"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[2px] bg-canvas-deep font-sans text-body font-bold text-ink ring-1 ring-line"
                      >
                        {testimonial.initials}
                      </span>
                    )}

                    <span className="flex flex-col">
                      <span className="text-body-sm font-semibold text-ink">{testimonial.author}</span>
                      <span className="text-caption text-muted">
                        {testimonial.role} · {testimonial.organization}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : null}

        {/*
          ---------- O livro **não fica mais aqui** (2026-08-04) ----------

          O cartão do livro ocupava o fim desta seção, a ~6.000px da única
          apresentação de Leonardo na home — lia como anúncio de produto
          encaixado entre os depoimentos e o CTA final, e repetia a credencial
          de autoria que já estava nos bullets dele. Foi consolidado dentro do
          dossiê de Leonardo em `leadership-section.tsx`, que agora carrega
          também a âncora `id="livro"` (destino de `#livro` na seção de
          Leonardo e de `/#livro` em `data/industry.ts`).

          O que sobrou aqui — escala, segmentos, logotipos reais e os dois
          depoimentos — são **outras** provas, não repetição do livro, e por
          isso a seção continua existindo em vez de ser absorvida.
        */}
      </Container>
    </Section>
  )
}
