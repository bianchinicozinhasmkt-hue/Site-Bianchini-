import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { BookCover } from '@/components/ui/book-cover'
import { book, leonardo } from '@/data/leonardo'

interface BookSectionProps {
  tone?: 'canvas' | 'surface' | 'canvas-deep'
  /**
   * Versão longa, para a página de Leonardo: acrescenta subtítulo destacado,
   * sinopse e a relação entre o livro e o trabalho da Bianchini.
   */
  detailed?: boolean
  headingId?: string
}

/**
 * Livro e conteúdo — prova de autoridade, não oferta.
 *
 * O livro entra **depois** dos depoimentos e **antes** do institucional: é o
 * último argumento de autoridade antes de a home voltar a falar da empresa.
 * Por isso o único CTA leva à página de Leonardo, e não a uma compra: o CTA de
 * conversão da home continua sendo o diagnóstico, e o livro não disputa com ele.
 *
 * Enquanto não houver link oficial de compra confirmado (`book.purchaseUrl`),
 * nenhum botão "comprar" é exibido — não se publica link não oficial. Quando o
 * link chegar, o botão "Conhecer o livro" aparece sozinho, à frente do
 * secundário.
 *
 * Sem estrela, nota, ranking, tiragem ou premiação: o único selo é textual e
 * descreve o escopo do conteúdo.
 */
export function BookSection({
  tone = 'surface',
  detailed = false,
  headingId = 'livro-titulo',
}: BookSectionProps) {
  return (
    <Section id="livro" tone={tone} space="default" bleed aria-labelledby={headingId}>
      <Container>
        <div className="grid gap-x-10 gap-y-9 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          {/* ---------- Objeto ---------- */}
          <Reveal variant="settle" className="lg:col-span-4">
            <div className="flex flex-col items-start">
              <BookCover className="max-w-[15rem] sm:max-w-[17rem] lg:max-w-none" />

              {/* Selo textual — escopo do conteúdo, sem métrica de vaidade. */}
              <p className="mt-6 font-condensed text-eyebrow font-semibold uppercase text-ink">{book.seal}</p>
            </div>
          </Reveal>

          {/* ---------- Argumento ---------- */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Eyebrow as="p">{book.eyebrow}</Eyebrow>

            <Heading as={2} id={headingId} size="title-1" className="mt-5 max-w-[20ch]">
              {book.headline}
            </Heading>

            {detailed ? (
              <p className="mt-6 max-w-[52ch] font-sans text-title-3 font-medium text-ink">
                {book.subtitle}
              </p>
            ) : null}

            <p className="mt-6 max-w-[58ch] text-lead text-muted">{book.text}</p>

            {detailed ? (
              <div className="mt-6 flex flex-col gap-5 text-body text-muted">
                <p className="max-w-[62ch]">{book.synopsis}</p>
                <p className="max-w-[62ch]">{book.relation}</p>
              </div>
            ) : null}

            <h3 className="mt-10 border-t border-line pt-8 font-condensed text-eyebrow font-semibold uppercase text-ink/60">
              O que o livro aborda
            </h3>

            {/*
              Índice de temas em linha corrida: dez itens em duas colunas com
              divisor e traço amarelo cada era mais um bloco listrado na página.
            */}
            <p className="mt-4 max-w-[62ch] font-sans text-body font-semibold text-ink">
              {book.topics.join(' · ')}
            </p>

            {/*
              Ambos secundários: o botão amarelo da página é o do diagnóstico.
              Na versão longa (a própria página de Leonardo) o link "Conhecer
              Leonardo" sairia para a página onde o visitante já está — então
              não é renderizado.
            */}
            {book.purchaseUrl || !detailed ? (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {book.purchaseUrl ? (
                  <LinkButton href={book.purchaseUrl} variant="secondary" size="lg" withArrow external>
                    Conhecer o livro
                  </LinkButton>
                ) : null}

                {detailed ? null : (
                  <LinkButton href={leonardo.path} variant="secondary" size="lg" withArrow>
                    Conhecer Leonardo
                  </LinkButton>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}
