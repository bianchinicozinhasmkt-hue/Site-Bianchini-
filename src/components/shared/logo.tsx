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
 * ============================================================
 * LOGOTIPO — O LOCKUP ANTERIOR, RESTAURADO (2026-08-11)
 * ============================================================
 *
 * "BIANCHINI KITCHEN PRO" (1200 × 528), com o símbolo da chama em hexágono.
 * É o lockup que o repositório usava até `04c20f7`, recuperado de `a6603b3`
 * por decisão explícita do gestor nesta rodada.
 *
 * ------------------------------------------------------------
 * O QUE ESTAVA AQUI ANTES, E POR QUE SAIU
 * ------------------------------------------------------------
 *
 * `logo-bianchini-oficial.png` (452 × 129) — o `LOGOMARCA-1.png` publicado em
 * bianchinicozinhas.com.br, lockup "BIANCHINI / COZINHAS PROFISSIONAIS", em
 * amarelo da marca. Os dois arquivos **continuam em `public/images/brand/`** e
 * continuam sendo o logotipo declarado no schema.org (`src/lib/schema.ts`), que
 * não foi tocado: o dado estruturado aponta para a marca publicada no domínio
 * oficial, e mudar isso sem confirmação seria alterar a identidade que o site
 * declara a buscadores.
 *
 * ------------------------------------------------------------
 * DIVERGÊNCIA REGISTRADA — não é esquecimento
 * ------------------------------------------------------------
 *
 * Esta restauração contraria dois pontos escritos no repositório, e os dois
 * ficam registrados aqui em vez de serem apagados:
 *
 *   · `CLAUDE.md` diz que o azul-marinho `#000E1E` e o bordô `#7E0F29` saíram
 *     do projeto em 2026-08-01 e "não devem voltar". O lockup restaurado é
 *     navy + carmim;
 *   · a versão anterior deste comentário registrava que KITCHEN PRO "não é a
 *     marca oficial".
 *
 * **Na prática o navy e o carmim não aparecem em tela.** Os dois únicos pontos
 * de uso — cabeçalho (`header.tsx`) e rodapé (`footer.tsx`) — chamam
 * `variant="light"`, que é o arquivo **monocromático branco**. O `default`
 * colorido não é referenciado por nenhum componente. O efeito visível da troca
 * é, portanto, o descritor ("KITCHEN PRO" no lugar de "COZINHAS PROFISSIONAIS")
 * e a proporção.
 *
 * ------------------------------------------------------------
 * A PROPORÇÃO MUDOU, E ELA DITA A ALTURA
 * ------------------------------------------------------------
 *
 * 2,27:1, contra os 3,5:1 do lockup que saiu. Duas consequências, as duas
 * medidas e já compensadas em `header.tsx` e `footer.tsx`:
 *
 *   1. **na mesma altura o logotipo fica mais estreito** — a 34px eram 119px de
 *      largura e passam a 77px. Não há risco de estouro em nenhuma largura;
 *   2. **a segunda linha exige mais altura.** "KITCHEN PRO" ocupa ~9% da altura
 *      do arquivo: a 34px a caixa-alta dela renderiza a ~3px e some. O lockup
 *      anterior era de duas linhas curtas numa caixa achatada e sobrevivia a
 *      34px; este não. Daí as alturas terem subido para 40/48px no cabeçalho e
 *      36px no rodapé — os mesmos valores que o header usava quando este
 *      logotipo estava em produção (`h-10 sm:h-11 lg:h-14`, ajustado para a
 *      faixa de altura do cabeçalho atual, que é mais baixa que a de então).
 *
 * A faixa do cabeçalho **não mudou**: continua o token responsivo por `clamp()`
 * de `globals.css` (64px no telefone, 76–88 em tablet, 90–96 em desktop amplo).
 * O que mudou foi só a altura da imagem dentro dela.
 */
export function Logo({ className, asLink = true, priority = false, variant = 'default' }: LogoProps) {
  const image = (
    <Image
      src={
        variant === 'light'
          ? '/images/brand/logo-bianchini-light.png'
          : '/images/brand/logo-bianchini.png'
      }
      alt={`${site.brand} — cozinhas profissionais`}
      width={1200}
      height={528}
      priority={priority}
      /*
        `sizes` acompanha a largura real de renderização, senão o preload baixa
        uma candidata diferente da usada e o console avisa. A 48px de altura
        (o maior degrau, no desktop) o logotipo tem ~109px de largura; 128px
        cobre com folga e continua bem abaixo do que a proporção anterior pedia.
      */
      sizes="(max-width: 767px) 96px, 128px"
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
