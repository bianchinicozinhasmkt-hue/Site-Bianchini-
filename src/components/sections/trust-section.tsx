import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { TechLabel } from '@/components/ui/tech'
import { featuredClients } from '@/data/clients'
import { segments } from '@/data/segments'
import { scopeMetrics } from '@/data/site'
import { cn } from '@/lib/utils'

/**
 * Confiança — faixa curta, e não uma tela inteira.
 *
 * A versão anterior gastava uma dobra com seis segmentos descritos em duas
 * colunas antes de chegar aos logotipos. O detalhamento de segmento já vive na
 * página institucional (`SegmentsSection`); aqui a função é outra e é rápida:
 * dizer a escala, dizer onde a empresa atua e mostrar a prova.
 *
 * Três tempos em uma faixa só: dado de escala → índice de segmentos em linha →
 * logotipos reais. Sem título de seção, sem eyebrow e sem CTA — a seção é uma
 * pausa entre o dossiê do diagnóstico e o bloco escuro de Leonardo, não mais
 * um argumento completo.
 *
 * Só entram logos com arquivo real no repositório e marcados como aprovados em
 * `src/data/clients.ts`. Os números exibidos são os confirmados (18 anos,
 * abrangência Brasil) e a contagem verificável de linhas de equipamento — a
 * contagem de projetos saiu de `scopeMetrics` por não ter confirmação
 * comercial (`src/data/site.ts`, "MÉTRICAS PÚBLICAS").
 *
 * A faixa desliza por `transform`, e o lazy loading nativo não carrega o que
 * está fora da viewport horizontal: por isso os logos usam `loading="eager"`.
 *
 * ============================================================
 * CORES REAIS, NÃO CINZA
 * ============================================================
 *
 * A versão anterior aplicava `grayscale` + opacidade 70% a todo logotipo —
 * uma convenção de "faixa de clientes" genérica que, aqui, apagava a única
 * cor que prova que a marca é real. As logos agora entram com a cor oficial
 * de cada uma, sem filtro, ~20% maiores (a escala por arquivo em
 * `src/data/clients.ts` já compensa a proporção de cada um) e com mais
 * respaço entre elas. A faixa continua discreta — o fundo claro e o
 * tamanho contido são o que evita que ela "grite".
 */
const logoScale = {
  sm: 'h-7 md:h-8',
  md: 'h-9 md:h-11',
  lg: 'h-12 md:h-14',
} as const

export function TrustSection() {
  const marquee = [...featuredClients, ...featuredClients]

  return (
    <Section id="confianca" tone="canvas" space="sm" bleed aria-labelledby="confianca-titulo">
      <Container>
        <h2 id="confianca-titulo" className="sr-only">
          Escala de atuação, segmentos atendidos e marcas de operações atendidas
        </h2>

        {/* ---------- Dado de escala + segmentos, na mesma linha ---------- */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          <dl className="flex shrink-0 flex-wrap gap-x-10 gap-y-5">
            {scopeMetrics.map((metric) => (
              <div key={metric.value} className="flex flex-col gap-1">
                <dd className="font-condensed font-bold text-title-2 text-ink">{metric.value}</dd>
                <dt className="max-w-[16ch] text-caption text-muted">{metric.label}</dt>
              </div>
            ))}
          </dl>

          <div className="lg:border-l lg:border-line lg:pl-16">
            <p className="font-condensed text-eyebrow font-semibold uppercase text-ink/60">Segmentos atendidos</p>
            <p className="mt-3 max-w-[62ch] font-sans text-title-3 font-semibold text-ink">
              {segments.map((segment) => segment.title).join(' · ')}
            </p>
            <p className="mt-3 max-w-[58ch] text-body-sm text-muted">
              Volume, cardápio, turno e norma aplicável mudam de um segmento para outro. O que não
              muda é o método: entender a operação antes de desenhar a solução.
            </p>
          </div>
        </div>
      </Container>

      {/* ---------- Prova: logotipos reais, com legenda de contexto ---------- */}
      <div className="mt-10 lg:mt-14">
        <Container>
          <TechLabel className="max-w-xl">
            Marcas de operações atendidas ao longo de 18 anos — exibidas mediante autorização
          </TechLabel>
        </Container>

        {/*
          `group` + `hover:` / `focus-within:` no `ul` pausa a rolagem — a
          animação para de correr, mas nada muda de posição (`animation-play-
          state`, não um segundo keyframe). Funciona por ponteiro e por
          teclado: tabular até um logotipo focável também pausa a faixa.
        */}
        <div className="group marquee-mask mt-6 overflow-hidden border-y border-line bg-surface py-8">
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
    </Section>
  )
}
