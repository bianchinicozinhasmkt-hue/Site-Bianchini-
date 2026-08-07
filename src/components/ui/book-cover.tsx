import Image from 'next/image'
import { cn } from '@/lib/utils'
import { book } from '@/data/leonardo'

/**
 * Objeto-livro.
 *
 * `book.cover` recebeu o arquivo real em 2026-08-03. Enquanto `book.cover` for
 * `null` (caso volte a ficar, por exemplo numa reversão), este componente
 * compõe o volume tipograficamente, com o título, o subtítulo e o autor reais
 * sobre a paleta da marca — representação editorial, marcada como decorativa
 * para leitores de tela porque o mesmo texto aparece ao lado, no corpo da
 * seção. Com `book.cover` preenchido, essa composição sai de cena sozinha.
 *
 * O tamanho do texto é expresso em `cqw` porque a capa é um contêiner de
 * consulta: assim o título mantém a mesma proporção da capa em qualquer
 * largura, da coluna do desktop ao mobile de 320px, sem breakpoint.
 */
export function BookCover({ className }: { className?: string }) {
  const frame = cn('relative aspect-[2/3] w-full max-w-[19rem]', className)

  if (book.cover) {
    return (
      <div className={frame}>
        <Image
          src={book.cover}
          alt={`Capa do livro ${book.title}, de ${book.author}`}
          fill
          quality={82}
          sizes="(max-width: 1023px) 60vw, 19rem"
          className="object-contain object-center"
        />
      </div>
    )
  }

  return (
    <div className={frame}>
      {/* Volume: segunda folha deslocada, para o livro ter espessura. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-3 -right-2 left-3 rounded-r-[2px] bg-graphite-soft/70 ring-1 ring-white/10"
      />

      <div
        aria-hidden="true"
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2px] bg-graphite shadow-[0_18px_40px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/12 [container-type:inline-size]"
      >
        {/* Lombada. */}
        <span className="absolute inset-y-0 left-0 w-[7.5%] bg-ink" />
        <span className="absolute inset-y-0 left-[7.5%] w-px bg-white/15" />

        <div className="relative flex h-full flex-col justify-between pb-[7cqw] pl-[14cqw] pr-[8cqw] pt-[8cqw]">
          <p className="text-[3.1cqw] font-bold uppercase tracking-[0.18em] text-canvas/55">
            Livro
          </p>

          <div>
            <p className="font-sans text-[6.6cqw] font-extrabold leading-[1.12] tracking-[-0.02em] text-canvas">
              {book.title}
            </p>
            <span className="mt-[4cqw] block h-[2px] w-[22%] bg-yellow" />
            <p className="mt-[3.5cqw] text-[3.6cqw] leading-[1.35] text-canvas/70">
              {book.subtitle}
            </p>
          </div>

          <p className="text-[3.8cqw] font-semibold tracking-[0.02em] text-canvas/85">
            {book.author}
          </p>
        </div>
      </div>
    </div>
  )
}
