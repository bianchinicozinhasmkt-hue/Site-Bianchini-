import Image from 'next/image'
import { cn } from '@/lib/utils'
import { leonardo } from '@/data/leonardo'

/**
 * Retrato de Leonardo, em dois enquadramentos.
 *
 * O arquivo é um recorte com canal alfa (900 × 1528, figura inteira, camisa
 * branca) — só funciona sobre grafite; em `canvas` a figura se dissolveria.
 *
 * ============================================================
 * `full` — figura inteira (página de Leonardo)
 * ============================================================
 *
 * A caixa tem a **proporção exata do arquivo**. É isso que faz a composição
 * funcionar: com `object-contain` numa caixa de proporção livre, a figura
 * resolve pela altura e sobra vão dos dois lados — a linha amarela ficaria
 * flutuando longe do ombro. Com a caixa na proporção da imagem, a borda da
 * caixa **é** a borda da figura.
 *
 * A altura vem do pai (`h-full`); a largura é consequência. Quando o pai é mais
 * estreito que `altura × 0,589`, `max-w-full` limita a largura e o
 * `object-contain` deixa folga no topo — nunca corta a cabeça.
 *
 * ============================================================
 * `bust` — meio corpo (home)
 * ============================================================
 *
 * Na home o retrato precisava ocupar ~40% da composição. Pela proporção do
 * arquivo, chegar a 500px de largura exigiria 850px de altura: a figura
 * inteira não cabe nessa largura sem virar uma coluna gigante.
 *
 * Então o enquadramento fecha. A caixa é 4:5, a imagem entra por `cover`
 * ancorada no topo e o corte cai na altura da coxa — o rosto e o olhar sobem
 * para o terço superior, que é onde precisam estar. O corte não aparece: o
 * gradiente de piso começa a 58% e dissolve a base na cor do painel.
 */
export function LeonardoPortrait({
  className,
  priority = false,
  sizes,
  frame = 'full',
}: {
  className?: string
  priority?: boolean
  sizes: string
  /** `full` mantém a figura inteira; `bust` fecha em meio corpo. */
  frame?: 'full' | 'bust'
}) {
  const bust = frame === 'bust'

  return (
    <div
      className={cn(
        'relative max-w-full',
        bust ? 'aspect-[4/5] w-full' : 'aspect-[900/1528] h-full',
        className,
      )}
    >
      {/* Linha amarela: encosta no ombro e desce até o piso. */}
      <span
        aria-hidden="true"
        className="absolute -left-[3px] bottom-0 top-[7%] w-[3px] bg-yellow"
      />

      {/* Piso: o painel fecha para a base, para a figura não flutuar. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent via-graphite-soft/50 to-graphite-soft',
          bust ? 'top-[58%]' : 'top-[22%]',
        )}
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/25" />

      <Image
        src={leonardo.portrait.src}
        alt={leonardo.portrait.alt}
        fill
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        quality={82}
        sizes={sizes}
        className={bust ? 'object-cover object-top' : 'object-contain object-bottom'}
      />
    </div>
  )
}
