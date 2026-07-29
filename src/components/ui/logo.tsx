import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { site } from '@/data/site'

interface LogoProps {
  /** Classes de tamanho (ex.: "h-11 lg:h-14"). A largura acompanha a proporção. */
  className?: string
  asLink?: boolean
  priority?: boolean
  /** `light` usa a versão monocromática branca, para fundos escuros. */
  variant?: 'default' | 'light'
}

/** Logo institucional. Arquivo original 1200×528 (proporção preservada). */
export function Logo({ className, asLink = true, priority = false, variant = 'default' }: LogoProps) {
  const image = (
    <Image
      src={variant === 'light' ? '/images/brand/logo-bianchini-light.png' : '/images/brand/logo-bianchini.png'}
      alt={`${site.brand} — cozinhas profissionais`}
      width={1200}
      height={528}
      priority={priority}
      sizes="(max-width: 1023px) 120px, 160px"
      className={cn('w-auto object-contain', className)}
    />
  )

  if (!asLink) return image

  return (
    <Link href="/" aria-label={`${site.brand} — página inicial`} className="inline-flex items-center">
      {image}
    </Link>
  )
}
