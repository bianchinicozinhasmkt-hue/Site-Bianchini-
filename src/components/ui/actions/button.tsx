import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import type { IconType } from '@/types'
import { cn } from '@/lib/utils'
import { ArrowRightIcon, WhatsappIcon } from '../icons'

/**
 * Botões do sistema.
 *
 * A forma vem do mockup aprovado, conferida em resolução original: retângulo
 * de canto quase reto (3px), rótulo em **condensada, caixa alta** e seta
 * simples ao lado — sem círculo, sem cápsula e sem ícone dentro de moldura.
 * O primário é o amarelo da marca com rótulo grafite; o secundário é a mesma
 * caixa em superfície clara, com borda grafite fina.
 *
 * ============================================================
 * OS QUATRO ESTADOS
 * ============================================================
 *
 * Todo botão do sistema responde em quatro tempos, e nenhum deles depende só
 * de cor:
 *
 *   padrão .......... caixa em repouso, sombra curta no primário
 *   hover ........... camada de preenchimento entrando por uma direção
 *                     (horizontal no primário, de baixo no secundário),
 *                     seta avançando 4px e elevação de 2px
 *   focus-visible ... o mesmo preenchimento do hover, mais o anel global
 *                     (grafite em fundo claro, amarelo em fundo escuro —
 *                     ver `:focus-visible` em globals.css)
 *   active .......... elevação zerada, sombra removida e tom fechado:
 *                     a pressão é sentida, não apenas vista
 *
 * O preenchimento é `transform: scaleX/scaleY` sobre um `::before`, nunca
 * `width`/`height` — a camada não força layout. `isolate` + `-z-10` mantêm a
 * camada atrás do rótulo sem precisar de `z-index` no texto.
 */
type Variant = 'primary' | 'secondary' | 'light' | 'light-outline' | 'whatsapp' | 'whatsapp-light'
type Size = 'sm' | 'md' | 'lg'

/*
  `rounded-[3px]`: o mesmo raio medido nos dois CTAs do mockup. Cantos
  discretos, coerentes com o caráter industrial — não é pílula.

  `font-condensed uppercase`: a condensada da marca (Oswald), restrita a
  rótulo curto. Ver `src/styles/typography.ts`.
*/
const base =
  'group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-[3px] font-condensed font-semibold uppercase tracking-[0.045em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-precise disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

/* Camada de preenchimento comum: presente, parada, atrás do rótulo. */
const fill =
  'before:absolute before:inset-0 before:-z-10 before:transition-transform before:duration-[280ms] before:ease-smooth before:content-[""]'

const variants: Record<Variant, string> = {
  /* Horizontal, da esquerda: o preenchimento acompanha a leitura. */
  primary: cn(
    'bg-yellow text-ink shadow-cta',
    fill,
    'before:origin-left before:scale-x-0 before:bg-yellow-bright',
    'hover:-translate-y-[2px] hover:shadow-cta-hover hover:before:scale-x-100',
    'focus-visible:before:scale-x-100',
    'active:translate-y-0 active:bg-yellow-deep active:shadow-none',
  ),
  /* De baixo: o grafite sobe e o rótulo inverte. */
  secondary: cn(
    'border border-ink/70 bg-transparent text-ink hover:text-canvas focus-visible:text-canvas',
    fill,
    'before:origin-bottom before:scale-y-0 before:bg-ink',
    'hover:border-ink hover:before:scale-y-100 focus-visible:before:scale-y-100',
    'active:translate-y-px',
  ),
  light: cn(
    'bg-canvas text-ink shadow-cta',
    fill,
    'before:origin-left before:scale-x-0 before:bg-white',
    'hover:-translate-y-[2px] hover:shadow-cta-hover hover:before:scale-x-100',
    'focus-visible:before:scale-x-100',
    'active:translate-y-0 active:shadow-none',
  ),
  /* Par do primário em fundo escuro: contorno claro que se preenche. */
  'light-outline': cn(
    'border border-white/35 text-canvas hover:text-ink focus-visible:text-ink',
    fill,
    'before:origin-bottom before:scale-y-0 before:bg-canvas',
    'hover:border-canvas hover:before:scale-y-100 focus-visible:before:scale-y-100',
    'active:translate-y-px',
  ),
  /* ==========================================================
     WHATSAPP — CANAL SECUNDÁRIO (doc 01 §8 papel 3, delta G-2)
     ==========================================================

     Duas variantes, uma construção. `whatsapp` é para superfície clara e
     `whatsapp-light` para superfície escura — o mesmo par de nomes de
     `secondary`/`light-outline`, onde "light" quer dizer "tinta clara, sobre
     fundo escuro".

     As duas são **contorno**, nunca massa. É a regra de par do sistema: quando
     PRIMARY e WHATSAPP aparecem lado a lado eles compartilham altura, raio e
     escala de rótulo — e **não** compartilham construção de superfície. Uma
     massa e um contorno; a hierarquia é lida antes da cor.

     O verde fica no **glifo**, que é o que torna o canal reconhecível. Ele
     inverte junto com a superfície no hover, para não ficar preso contra o
     preenchimento que sobe: ver `Content`.
     ========================================================== */
  whatsapp: cn(
    'border border-ink/70 bg-transparent text-ink hover:text-canvas focus-visible:text-canvas',
    fill,
    'before:origin-bottom before:scale-y-0 before:bg-ink',
    'hover:border-ink hover:before:scale-y-100 focus-visible:before:scale-y-100',
    'active:translate-y-px',
  ),
  'whatsapp-light': cn(
    'border border-white/35 bg-transparent text-canvas hover:text-ink focus-visible:text-ink',
    fill,
    'before:origin-bottom before:scale-y-0 before:bg-canvas',
    'hover:border-canvas hover:before:scale-y-100 focus-visible:before:scale-y-100',
    'active:translate-y-px',
  ),
}

const isWhatsapp = (variant: Variant) => variant === 'whatsapp' || variant === 'whatsapp-light'

const sizes: Record<Size, string> = {
  sm: 'min-h-[2.75rem] px-4 py-2.5 text-body-sm',
  md: 'min-h-[3rem] px-5 py-3 text-body-sm',
  lg: 'min-h-[3.5rem] px-6 py-3.5 text-body',
}

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Seta à direita do rótulo, com deslocamento de 4px no hover. */
  withArrow?: boolean
  children: ReactNode
  className?: string
}

function Content({
  children,
  withArrow,
  variant,
}: Pick<CommonProps, 'children' | 'withArrow' | 'variant'>) {
  return (
    <>
      {/* ----------
          A CELA DO GLIFO — FIO DE TINTA, E O VERDE QUE INVERTE

          O glifo do WhatsApp ganha cela própria, separada do rótulo por um fio
          — é o acabamento que o papel 3 do sistema pede, e o mesmo que o CTA
          da dobra já usava. `self-stretch` faz o fio acompanhar a altura do
          conteúdo sem depender do `py-*` de cada tamanho.

          **O verde troca de tom com a superfície, não de cor.** Em repouso a
          caixa é contorno e o glifo é o verde de tela (`--whatsapp`) sobre
          escuro ou o fechado (`--whatsapp-deep`) sobre claro; no hover o
          preenchimento sobe e inverte a superfície, então os dois trocam de
          lugar. É o mesmo matiz nos quatro estados — o que muda é o fundo
          debaixo dele.
          ---------- */}
      {variant && isWhatsapp(variant) ? (
        <span
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center self-stretch pr-3',
            variant === 'whatsapp'
              ? 'border-r border-ink/25 text-[var(--whatsapp-deep)] group-hover:border-canvas/25 group-hover:text-[var(--whatsapp)] group-focus-visible:border-canvas/25 group-focus-visible:text-[var(--whatsapp)]'
              : 'border-r border-canvas/25 text-[var(--whatsapp)] group-hover:border-ink/25 group-hover:text-[var(--whatsapp-deep)] group-focus-visible:border-ink/25 group-focus-visible:text-[var(--whatsapp-deep)]',
            'transition-colors duration-200 ease-precise',
          )}
        >
          <WhatsappIcon size={19} />
        </span>
      ) : null}
      {children}
      {withArrow ? (
        <ArrowRightIcon
          size={18}
          className="shrink-0 transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-visible:translate-x-1"
        />
      ) : null}
    </>
  )
}

type LinkButtonProps = CommonProps & {
  href: string
  /** Links externos recebem target/rel automaticamente. */
  external?: boolean
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>

/** Link com aparência de botão. Usa next/link para rotas internas. */
export function LinkButton({
  href,
  external,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className,
  children,
  ...props
}: LinkButtonProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  const classes = buttonClasses(variant, size, className)
  const content = (
    <Content withArrow={withArrow} variant={variant}>
      {children}
    </Content>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  )
}

type ButtonProps = CommonProps & {
  /** Substitui o rótulo por um indicador de progresso e bloqueia o clique. */
  loading?: boolean
  loadingLabel?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

/** Botão de ação real (formulários, accordions, filtros). */
export function Button({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  loading = false,
  loadingLabel = 'Enviando…',
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
          />
          {loadingLabel}
        </>
      ) : (
        <Content withArrow={withArrow} variant={variant}>
          {children}
        </Content>
      )}
    </button>
  )
}

/**
 * ============================================================
 * O QUARTO ESTADO — PRESSÃO (doc 01 §8)
 * ============================================================
 *
 * `scale(0.985)` em 120ms `precise`, cancelado por `motion-reduce`. É
 * `transform`, então não reflui a linha nem move o vizinho.
 *
 * A dobra já carrega esta mesma gramática (`pressState` em `hero-stage.tsx`).
 * **A duplicação é deliberada nesta rodada**: a hero está congelada desde
 * 2026-08-12 e importar daqui exigiria editá-la, o que R0-C não pode fazer.
 * Unificar as duas é dívida registrada, não esquecimento.
 */
const pressState =
  'transition-transform duration-[120ms] ease-precise active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100'

/**
 * CTA do cabeçalho — papel 5 do sistema, **NAV CTA** (doc 01 §8).
 *
 * A altura acompanha a faixa reduzida (46% dela, com piso de 40px) em vez dos
 * pixels do mockup, pelo mesmo motivo do cabeçalho (ver `header.tsx`).
 *
 * ============================================================
 * R0-C (2026-08-12) — CONFORMIDADE: H-2, H-3 e H-4
 * ============================================================
 *
 * Três mecanismos mudaram, e nenhum deles é preferência — os três tinham norma
 * fixada e implementação divergente:
 *
 *   · **H-2 · raio 3px → 2px.** Doc 01 §7.1: o raio de 2px é o **único** raio
 *     do sistema, e existe para evitar aliasing de canto absoluto em massa
 *     preenchida — não é decisão estética e não deve crescer;
 *   · **H-3 · o preenchimento troca de eixo.** Era `scaleX` da esquerda, em
 *     280ms `smooth`. Doc 01 §8 fixa `scaleY` da base, 220ms `precise`, para
 *     **todos** os papéis de botão — é o mesmo gesto dos dois CTAs da dobra, e
 *     ter o cabeçalho num eixo próprio fazia a ação persistente responder
 *     diferente da ação que ela repete;
 *   · **H-4 · a sombra de hover saiu.** `0 8px 16px -10px` a 0,8 de preto é a
 *     "sombra dramática" da blacklist (doc 01 §14.2): contradiz a aresta viva e
 *     produz cartão flutuante, que é gramática de SaaS.
 *
 * **A elevação de 1px saiu junto com a sombra, e isso é consequência, não
 * escopo novo.** `hover:-translate-y-px` + `hover:shadow-…` eram **um** gesto:
 * o objeto levanta e a sombra prova que levantou. Removida a sombra, o que
 * sobraria é um salto de 1px sem causa — e a tabela de estados de §8 lista, no
 * hover, só o preenchimento.
 *
 * Pelo mesmo motivo o `active` foi refeito: as três cláusulas antigas
 * (`translate-y-0`, `bg-yellow-deep`, `shadow-none`) existiam para desfazer a
 * elevação e a sombra que deixaram de existir, e a troca de `background-color`
 * é o que §8 proíbe explicitamente. No lugar entra a pressão normativa do
 * sistema — ver `pressState`, acima.
 *
 * O anel de foco continua sendo o global: o cabeçalho é `on-dark`, então
 * `:focus-visible` rende anel amarelo de 2px com offset de 2px sobre grafite
 * (globals.css), que é exatamente o que §8 pede. **Ele não é sombra estética e
 * não foi tocado por H-4.**
 *
 * Altura, recuo, largura, tipografia e posição continuam idênticos.
 */
export function HeaderCta({
  href,
  label = 'Solicitar orçamento',
  className,
}: {
  href: string
  label?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-[2px] bg-yellow font-condensed font-semibold uppercase tracking-[0.05em] text-ink',
        'h-11 px-[1.15rem] text-[0.8125rem] xl:text-[0.875rem]',
        'lg:h-[max(2.5rem,calc(var(--header-height)*0.46))]',
        'before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-yellow-bright before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'hover:before:scale-y-100 focus-visible:before:scale-y-100',
        pressState,
        className,
      )}
    >
      {label}
      <ArrowRightIcon
        size={16}
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 ease-precise group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]"
      />
    </Link>
  )
}

/**
 * CTAs da primeira dobra. Ambos retangulares, com 68px de altura no desktop
 * (4.25rem):
 *
 *   primário ..... caixa amarela, rótulo grafite, seta simples
 *   secundário ... borda grafite, rótulo grafite, ícone contextual
 *
 * Até 2026-08-03 as medidas liam `--u` (1px do mockup, definido em
 * `.hero-fold`), fixando a dobra a uma composição de conteúdo único. Com o
 * carrossel de 3 slides a hero deixou de ser uma composição fixa — os
 * valores aqui viraram `rem` fixos, próximos aos originais (a diferença é
 * subpixel), sem depender de uma variável que só a hero definia. O
 * acabamento é o mesmo dos botões de seção — preenchimento deslizante,
 * avanço da seta e microelevação — para que a primeira dobra e o resto da
 * página respondam igual.
 */
export function HeroPrimaryCta({
  href,
  label = 'Solicitar diagnóstico',
  className,
}: {
  href: string
  label?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'hero-action group relative isolate inline-flex items-center justify-between gap-4 overflow-hidden rounded-[3px] bg-yellow font-condensed uppercase text-ink',
        'shadow-cta transition-[background-color,box-shadow,transform] duration-200 ease-precise',
        'hover:-translate-y-[2px] hover:shadow-cta-hover',
        'active:translate-y-0 active:bg-yellow-deep active:shadow-none',
        'h-14 pl-5 pr-4',
        'lg:h-[4.25rem] lg:gap-8 lg:pl-7 lg:pr-6',
        'before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-yellow-bright before:transition-transform before:duration-[280ms] before:ease-smooth before:content-[""]',
        'hover:before:scale-x-100 focus-visible:before:scale-x-100',
        className,
      )}
    >
      {label}
      <ArrowRightIcon
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:h-5 lg:w-5"
      />
    </Link>
  )
}

/**
 * Par do `HeroPrimaryCta`: mesma altura e mesma borda grafite do mockup
 * aprovado — mas com **ícone contextual**, não seta. Decisão de 2026-08-03:
 * com seta nos dois botões, o par lia como "duas variações do mesmo clique";
 * o ícone por pilar (régua, chave, curva ascendente — ver `hero-slides.ts`)
 * diferencia "converter agora" (primário) de "explorar o pilar" (secundário)
 * antes mesmo da leitura do rótulo, e reforça de qual pilar o CTA é filho.
 * `icon` é obrigatório aqui de propósito: sem um valor padrão, um uso novo
 * não pode esquecer de passar o glifo do pilar.
 */
export function HeroSecondaryCta({
  href,
  label,
  icon: Icon,
  className,
}: {
  href: string
  label: string
  icon: IconType
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'hero-action group relative isolate inline-flex items-center justify-between overflow-hidden rounded-[3px] border-[1.5px] border-ink/75 font-condensed uppercase text-ink',
        'transition-[color,border-color,transform] duration-200 ease-precise hover:border-ink hover:text-canvas focus-visible:text-canvas active:translate-y-px',
        'h-14 gap-6 px-5',
        'lg:h-[4.25rem] lg:gap-8 lg:pl-7 lg:pr-6',
        'before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-ink before:transition-transform before:duration-[280ms] before:ease-smooth before:content-[""]',
        'hover:before:scale-y-100 focus-visible:before:scale-y-100',
        className,
      )}
    >
      {label}
      {/*
        `translate-x-1` era o avanço da seta — não faz sentido genérico para um
        glifo qualquer (régua, chave, curva). O sinal de hover vira escala:
        funciona para qualquer forma e ainda lê como "resposta ao toque".
      */}
      <Icon
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 ease-precise group-hover:scale-110 group-focus-visible:scale-110 lg:h-5 lg:w-5"
      />
    </Link>
  )
}

interface ArrowLinkProps {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
  tone?: 'dark' | 'light'
}

/**
 * Link textual com seta — navegação, não conversão.
 *
 * Fica na família de leitura, em caixa baixa: é texto, não rótulo comercial.
 * O sinal de hover é um sublinhado que cresce da esquerda mais o avanço da
 * seta; em fundo escuro o traço é amarelo, em fundo claro é grafite (o
 * amarelo sobre `canvas` não alcança contraste — ver `src/styles/colors.ts`).
 *
 * ============================================================
 * ÁREA DE TOQUE — DUAS CAIXAS, NÃO UMA (2026-08-05)
 * ============================================================
 *
 * Ele **não** é um link inline dentro de frase: aparece sozinho, encerrando um
 * bloco ("Como o diagnóstico encontra a causa", "Conhecer", "Como a Bianchini
 * trabalha"). É controle independente, e media 24 a 28px de altura.
 *
 * Somar `padding` vertical ao próprio `<a>` resolveria o alvo e quebraria o
 * desenho: o sublinhado é um `::after` ancorado em `bottom-0`, então desceria
 * junto e passaria a correr ~10px abaixo do texto, solto.
 *
 * Daí duas caixas: o **`<a>` carrega o alvo** (`min-h` de 44px, mais `py` para
 * o caso de o rótulo quebrar em duas linhas) e um **`<span>` interno carrega o
 * traço**, colado ao texto como antes. O `group` continua no `<a>`, então
 * hover e `focus-visible` acionam as duas animações, e o anel de foco passa a
 * envolver a área inteira em vez de só a linha de texto.
 *
 * `w-fit`: a área acompanha o rótulo. Sem ele o link vira uma faixa da largura
 * do pai — medido em 904px na página de soluções — e responde a cliques a meia
 * tela de distância do texto.
 */
export function ArrowLink({ href, children, className, external, tone = 'dark' }: ArrowLinkProps) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  const classes = cn(
    'group inline-flex min-h-[2.75rem] w-fit items-center py-2 font-sans text-body-sm font-semibold transition-colors duration-200 ease-precise',
    tone === 'dark' ? 'text-ink' : 'text-canvas hover:text-white',
    className,
  )
  const content = (
    <span
      className={cn(
        'relative inline-flex items-center gap-2 pb-1',
        'after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-right after:scale-x-0 after:transition-transform after:duration-[240ms] after:ease-precise after:content-[""]',
        'group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100',
        tone === 'dark' ? 'after:bg-ink' : 'after:bg-yellow',
      )}
    >
      {children}
      <ArrowRightIcon
        size={17}
        aria-hidden="true"
        className={cn(
          'shrink-0 transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-visible:translate-x-1',
          tone === 'light' && 'text-yellow',
        )}
      />
    </span>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
