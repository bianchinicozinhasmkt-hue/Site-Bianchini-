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

/**
 * Logotipo institucional — a marca **oficial** da Bianchini.
 *
 * O arquivo é o `LOGOMARCA-1.png` publicado em bianchinicozinhas.com.br
 * (452 × 129), o mesmo declarado como logo da organização no schema.org do
 * site, e é o lockup que aparece no mockup aprovado:
 * "BIANCHINI / COZINHAS PROFISSIONAIS".
 *
 * O original vem com o fundo escuro achatado no bitmap, sem canal alfa. As duas
 * versões usadas aqui foram geradas a partir dele derivando o alfa da própria
 * luminância — nada foi redesenhado, reposicionado nem reescalado:
 *
 *   `light` ... amarelo da marca (#F3CC4D), para o grafite do cabeçalho e do
 *               rodapé. É praticamente o mesmo `yellow` do sistema (#F5C64B) —
 *               o logotipo confirma a paleta.
 *   `default` . grafite, para superfície clara.
 *
 * O lockup anterior do repositório ("BIANCHINI KITCHEN PRO", 1200 × 528) foi
 * removido de `public/images/brand/` na preparação da V1 (2026-08-05): não é a
 * marca oficial, não era referenciado por nenhum componente e ia junto no
 * bundle de deploy, já que `public/` é copiada inteira. Estava versionado —
 * `git show HEAD:public/images/brand/logo-bianchini.png` o recupera.
 *
 * A proporção é 3,5:1 — bem mais larga que o lockup antigo (2,3:1). Ao definir
 * altura, lembre que a largura resultante é ~3,5× maior.
 */
export function Logo({ className, asLink = true, priority = false, variant = 'default' }: LogoProps) {
  const image = (
    <Image
      src={
        variant === 'light'
          ? '/images/brand/logo-bianchini-oficial.png'
          : '/images/brand/logo-bianchini-oficial-grafite.png'
      }
      alt={`${site.brand} — cozinhas profissionais`}
      width={452}
      height={129}
      priority={priority}
      /*
        `sizes` acompanha a largura real de renderização, senão o preload baixa
        uma candidata diferente da usada e o console avisa. A 40px de altura o
        logotipo tem ~140px de largura; 176px cobre o desktop com folga.
      */
      sizes="(max-width: 767px) 132px, 176px"
      className={cn('w-auto object-contain', className)}
    />
  )

  if (!asLink) return image

  /*
    O **link** carrega o alvo de toque, não a imagem. O lockup tem altura fixa
    por legibilidade da segunda linha (34px no mobile, 40px do tablet para
    cima), e essas são também as alturas que a área clicável tinha — medidas
    abaixo dos 44px que o projeto adota, no único controle que aparece em toda
    rota. `min-h` resolve sem tocar no logotipo: a imagem continua com a altura
    que a marca pede e fica centrada dentro de uma caixa maior. Cabe na faixa
    de 64px do cabeçalho mobile, então nada se desloca.

    Só o cabeçalho usa `asLink`; o rodapé chama com `asLink={false}` e não
    recebe caixa nenhuma.
  */
  return (
    <Link
      href="/"
      aria-label={`${site.brand} — página inicial`}
      className="inline-flex min-h-[2.75rem] items-center"
    >
      {image}
    </Link>
  )
}
