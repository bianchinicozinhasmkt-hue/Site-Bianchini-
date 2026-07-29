import Image from 'next/image'
import { featuredClients } from '@/data/clients'
import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'

/** Cada logo recebe a mesma caixa; a altura compensa a proporção do arquivo. */
const scaleClasses = {
  sm: 'h-8 md:h-9',
  md: 'h-11 md:h-12',
  lg: 'h-14 md:h-16',
} as const

function LogoRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {featuredClients.map((client) => (
        <li key={client.id} className="flex w-28 shrink-0 items-center justify-center md:w-32">
          <Image
            src={client.logo}
            alt={ariaHidden ? '' : client.name}
            width={320}
            height={320}
            sizes="128px"
            /* A faixa desliza horizontalmente: lazy loading deixaria logos em
               branco ao entrarem em cena, então carregam de imediato. */
            loading="eager"
            /* Alguns arquivos têm fundo branco chapado; multiply dissolve esse
               retângulo no bege da faixa. */
            className={cn(
              'w-auto max-w-full object-contain mix-blend-multiply',
              scaleClasses[client.scale ?? 'md'],
            )}
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * Faixa de logos com rolagem contínua em CSS puro.
 * A lista é duplicada para o loop e a cópia fica fora da árvore de acessibilidade.
 */
export function TrustSection() {
  return (
    <section aria-label="Operações que confiam na Bianchini" className="border-y border-hairline bg-paper py-10">
      <Container>
        <p className="text-center text-eyebrow font-semibold uppercase text-muted">
          Operações atendidas pela Bianchini
        </p>
      </Container>

      <div className="marquee-mask mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          <LogoRow />
          <LogoRow ariaHidden />
        </div>
      </div>
    </section>
  )
}
