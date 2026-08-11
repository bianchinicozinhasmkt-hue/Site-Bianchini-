import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { industry } from '@/data/industry'

/**
 * Indústria do inox — seção própria e separada dos três pilares (público é o
 * fabricante, não o operador de cozinha).
 *
 * **Sem fotografia desde 2026-08-11** — a justificativa completa está no
 * comentário do cabeçalho, dentro do componente. `industry.image` continua no
 * dado (`src/data/industry.ts`) porque a mesma entrada alimenta a capa de
 * `manufacturersPage` em `pages.ts`; o que saiu foi o uso aqui.
 */
export function IndustryInoxSection() {
  return (
    <Section
      id="industria-do-inox"
      tone="graphite"
      space="default"
      bleed
      aria-labelledby="industria-do-inox-titulo"
    >
      <Container>
        {/* ==========================================================
            A FOTO DE PRODUTO SAIU (2026-08-11)
            ==========================================================

            `estante-inox.jpg` é uma peça isolada sobre fundo branco de estúdio,
            e ocupava aqui uma caixa de proporção 4/3 com canto arredondado,
            preenchimento `graphite-soft`, contorno interno de 1px e uma vinheta
            radial por cima — tudo isso para tentar impedir que um retângulo
            branco explodisse no meio de uma seção grafite. O comentário anterior
            descrevia o resultado com precisão: "lê como card de produto". Era
            esse o problema, não a solução.

            Três razões somadas para removê-la, e não para tratá-la melhor:

              1. **é o único canto arredondado da home.** O vocabulário do site
                 não tem `radius`; a caixa existia só para acomodar o arquivo;
              2. **não carrega informação.** `aria-hidden`, `alt=""`, sem
                 legenda, produto genérico do acervo — a própria seção a
                 declarava decorativa;
              3. **o motivo já está publicado duas vezes acima.** Mobiliário em
                 inox aparece em `#equipamentos` (vitrine, "Mobiliário em inox")
                 e no mosaico de `#projetos`. Esta seria a terceira peça de inox
                 em fundo neutro da mesma página — a "duplicação de motivo
                 visual" que o briefing manda eliminar. O mesmo diagnóstico já
                 tinha sido feito para este arquivo em `src/data/differentials.ts`,
                 onde ele foi substituído por outra fotografia pela razão idêntica.

            **Nada entrou no lugar, e o espaço não sobrou.** O cabeçalho passa a
            ser uma banda de duas colunas — título à esquerda, texto à direita,
            fechando na margem —, que é a mesma gramática de `#pilares` e de
            `#credibilidade`. Medido, a seção encolheu 214px em 1440 e o vão
            morto sob o parágrafo (~130px, entre o fim do texto e a régua dos
            entregáveis) desapareceu junto.
            ========================================================== */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-6">
            <Eyebrow tone="light">{industry.eyebrow}</Eyebrow>
            <Heading
              as={2}
              id="industria-do-inox-titulo"
              size="title-1"
              className="mt-5 max-w-[16ch] text-canvas"
            >
              {industry.title}
            </Heading>
          </div>

          <p className="text-lead text-canvas/75 lg:col-span-6 lg:col-start-7">{industry.text}</p>
        </div>

        <ol className="mt-10 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-10 lg:pt-12">
          {industry.deliverables.map((item) => (
            <li key={item.number}>
              <p className="font-condensed text-caption font-bold tabular-nums text-yellow">
                {item.number}
              </p>
              <h3 className="mt-3 font-sans font-bold text-body text-canvas">{item.title}</h3>
              <p className="mt-2 text-body-sm text-canvas/70">{item.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/15 pt-8 lg:mt-12">
          <LinkButton href={industry.ctas.primary.href} variant="light" size="md" withArrow>
            {industry.ctas.primary.label}
          </LinkButton>
          <LinkButton href={industry.ctas.secondary.href} variant="light-outline" size="md" withArrow>
            {industry.ctas.secondary.label}
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}
