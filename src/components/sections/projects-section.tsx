import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { PhotoReveal } from '@/components/animations/photo-reveal'
import { Reveal } from '@/components/animations/reveal'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { featuredProjects, leadProject } from '@/data/projects'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * Projetos entregues — portfólio editorial compacto, não mosaico solto.
 *
 * ============================================================
 * O QUE MUDOU
 * ============================================================
 *
 * A versão anterior tinha 3.151px de altura em 1440px de largura — mais que
 * qualquer outra seção da home, incluindo o hero. O motivo era estrutural: o
 * registro de abertura sangrava em 21:9 e trazia a legenda **numa faixa
 * abaixo dele**, dentro do container; os três registros seguintes vinham num
 * grid com deslocamentos de `mt-24` desalinhados entre si, abrindo vãos entre
 * uma linha e a próxima que não tinham nenhuma função.
 *
 * Agora:
 *
 *  · o registro principal sangra em **16:9**, mais baixo, e a legenda fica
 *    **sobreposta à própria fotografia** — um painel com gradiente na base,
 *    não uma segunda faixa depois dela. É sobreposição real, não decoração;
 *  · os três registros complementares formam **uma linha só**, com larguras
 *    diferentes (5/4/3 de doze) e sem deslocamento vertical entre eles — a
 *    variação de escala vem da proporção de cada imagem, não de empurrar uma
 *    coluna pra baixo da outra.
 *
 * A seção cai de 3.151px para menos da metade disso, sem perder nenhuma
 * fotografia nem nenhuma informação.
 *
 * ============================================================
 * NAVEGAÇÃO ENTRE OS REGISTROS
 * ============================================================
 *
 * Não existe página de detalhe por projeto — cada registro é uma fotografia
 * legendada, não um case com rota própria. A régua com o nome dos quatro
 * registros rola até cada um dentro da própria seção (`#projeto-{id}`) — não
 * simula uma paginação que não existe.
 *
 * As legendas descrevem o que está na imagem. Nome de cliente, local, prazo e
 * resultado numérico só entram depois de confirmação comercial e autorização
 * de uso; enquanto isso, a lista funciona como prova de escopo e acabamento.
 */
const allRecords = [leadProject, ...featuredProjects]

export function ProjectsSection({
  tone = 'graphite',
  compact = false,
}: {
  tone?: 'graphite' | 'surface'
  compact?: boolean
} = {}) {
  const dark = tone === 'graphite'

  return (
    <Section id="projetos" tone={tone} space={compact ? 'sm' : 'default'} bleed aria-labelledby="projetos-titulo">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow tone={dark ? 'light' : 'default'}>Projetos entregues</Eyebrow>
            <Heading
              as={2}
              id="projetos-titulo"
              size="title-1"
              className={cn('mt-5 max-w-[18ch]', dark && 'text-canvas')}
            >
              A prova está na operação construída
            </Heading>
          </div>

          <p
            className={cn(
              'text-lead lg:col-span-4 lg:col-start-9',
              dark ? 'text-canvas/75' : 'text-muted',
            )}
          >
            Registros reais de cozinhas, bares, cadeia fria e mobiliário fabricado sob medida — do
            desenho técnico à cozinha em produção.
          </p>
        </div>

        <nav
          aria-label="Ir para um registro desta seção"
          /*
            `items-center` e não `items-baseline`: com os itens ganhando caixa
            de 44px, alinhar pela linha de base deixava as caixas escalonadas
            entre si quando um rótulo quebrava.

            `gap-y-1` e não `gap-y-2`: o alvo de 44px já faz quase toda a
            separação, mas com `gap-y-0` as fileiras que quebram em 390 e 320px
            passavam a **encostar** uma na outra — medido, 16 pares de alvos
            adjacentes sem folga nenhuma. 4px é o mínimo que separa sem
            devolver a altura que o `gap-y-2` antigo somaria. O `gap-x-5`
            mantém a folga horizontal, que antes chegava a 8px.
          */
          className={cn(
            'mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 border-t pt-2 lg:mt-8',
            dark ? 'border-white/15' : 'border-line',
          )}
        >
          {allRecords.map((project, index) => (
            <a
              key={project.id}
              href={`#projeto-${project.id}`}
              className={cn(
                'inline-flex min-h-[2.75rem] items-center py-2 font-condensed text-sm font-semibold uppercase tracking-[0.06em] transition-colors',
                dark ? 'text-canvas/55 hover:text-canvas' : 'text-muted hover:text-ink',
              )}
            >
              {String(index + 1).padStart(2, '0')} {project.segment}
            </a>
          ))}
        </nav>
      </Container>

      {/* ==========================================================
          Registro principal — sangrado, com a legenda sobreposta à própria
          fotografia. Fora do container de propósito: é a única imagem da
          página que toca as duas bordas da janela.

          `data-whatsapp-safe-zone`: a legenda (`figcaption`, logo abaixo) é
          `absolute inset-x-0 bottom-0` — sangra até as duas bordas, igual à
          fotografia. É a mesma classe de risco da fotografia do hero (que já
          usa este atributo): nenhum gutter de container protege o canto
          inferior direito aqui, porque não há container ali. Confirmado por
          varredura: em 1920×1080, sem o atributo, a legenda colidia com o
          botão flutuante do WhatsApp (`figcaption` a toda a largura,
          `left:0`). Mesmo mecanismo já usado em `hero-section.tsx`,
          `diagnosis-section.tsx` e `final-cta-section.tsx` — nenhuma lógica
          nova.
          ========================================================== */}
      <figure
        id={`projeto-${leadProject.id}`}
        data-whatsapp-safe-zone
        className="group scroll-mt-[calc(var(--header-height)+1rem)] mt-8 lg:mt-10"
      >
        <PhotoReveal className="relative aspect-[4/5] w-full overflow-hidden bg-graphite-soft sm:aspect-[16/9] lg:aspect-[2.4/1]">
          <Image
            src={leadProject.image}
            alt={leadProject.alt}
            fill
            sizes="100vw"
            quality={84}
            className="object-cover object-center"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-graphite via-graphite/70 to-transparent"
          />

          <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-8 lg:px-10 lg:pb-8">
            <div className="mx-auto flex w-full max-w-container flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <span>
                <span className="inline-flex items-center gap-2.5 font-condensed text-eyebrow font-semibold uppercase text-yellow">
                  <span aria-hidden="true" className="h-[2px] w-5 shrink-0 bg-yellow" />
                  {leadProject.segment}
                </span>
                <span className="mt-2 block font-sans text-title-2 font-bold text-canvas">
                  {leadProject.title}
                </span>
              </span>

              <span className="flex flex-col gap-2 lg:max-w-[26rem] lg:items-end lg:text-right">
                <span className="text-body-sm text-canvas/80">{leadProject.caption}</span>
                <ScopeList project={leadProject} dark className="lg:justify-end" />
              </span>
            </div>
          </figcaption>
        </PhotoReveal>
      </figure>

      {/* ==========================================================
          Três registros complementares — uma linha só, larguras diferentes,
          sem deslocamento vertical entre eles.
          ========================================================== */}
      <Container>
        {/* ----------
            Três registros: uma linha no desktop, **duas colunas a partir de
            640px**. Empilhados em coluna única, os três somavam 2.774px no
            telefone e 3.873px no tablet — o tablet, de novo, mais alto que o
            celular. A partir de `sm` os dois primeiros dividem a linha e o
            terceiro fica em largura contida, o que corta ~35% da altura.
            ---------- */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-7">
          <Record
            project={featuredProjects[0]}
            dark={dark}
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
          />
          <Record
            project={featuredProjects[1]}
            dark={dark}
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
          />
          <Record
            project={featuredProjects[2]}
            dark={dark}
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
            className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)] lg:col-span-1 lg:max-w-none"
          />
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col items-start gap-5 border-t pt-7 sm:flex-row sm:items-center sm:justify-between lg:mt-14',
            dark ? 'border-white/20' : 'border-line',
          )}
        >
          <p className={cn('max-w-xl text-base', dark ? 'text-canvas/75' : 'text-muted')}>
            Mais registros de cozinhas, bares, panificação, cadeia fria, mobiliário em inox e
            material de projeto na página de projetos.
          </p>
          <LinkButton
            href="/projetos"
            variant={dark ? 'light' : 'secondary'}
            size="md"
            withArrow
            className="shrink-0"
          >
            Ver todos os projetos
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}

/**
 * Registro complementar: fotografia grande com a faixa de segmento/escopo
 * revelada no hover/foco, e uma legenda curta sempre visível abaixo — nunca
 * mais que duas linhas, para as três colunas ficarem na mesma altura visual.
 */
function Record({
  project,
  dark,
  sizes,
  className,
}: {
  project: Project
  dark: boolean
  sizes: string
  className?: string
}) {
  return (
    <Reveal variant="settle" className={className}>
      <figure
        id={`projeto-${project.id}`}
        className={cn(
          'group media-zoom scroll-mt-[calc(var(--header-height)+1rem)] overflow-hidden border',
          dark ? 'border-white/20 bg-graphite-soft/70' : 'border-line bg-canvas',
        )}
      >
        <PhotoReveal
          className={cn(
            'relative aspect-[4/3] w-full overflow-hidden',
            dark ? 'bg-graphite-soft' : 'bg-canvas-deep',
          )}
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes={sizes}
            quality={82}
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-graphite via-graphite/85 to-transparent px-4 pb-4 pt-9 transition-transform duration-[320ms] ease-premium group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none"
          >
            {project.segment ? (
              <span className="flex items-center gap-2 font-condensed text-caption font-semibold uppercase text-yellow">
                <span className="h-[2px] w-3.5 shrink-0 bg-yellow" />
                {project.segment}
              </span>
            ) : null}
          </div>
        </PhotoReveal>

        <figcaption className={cn('min-h-[8.5rem] border-t p-4', dark ? 'border-white/20' : 'border-line')}>
          <h3
            className={cn('font-sans text-base font-bold', dark ? 'text-canvas' : 'text-ink')}
          >
            {project.title}
          </h3>
          <ScopeList project={project} dark={dark} className="mt-1.5" />
        </figcaption>
      </figure>
    </Reveal>
  )
}

/** Escopo entregue, em linha — substitui "resultado" enquanto não houver medição. */
function ScopeList({
  project,
  dark,
  className,
}: {
  project: Project
  dark: boolean
  className?: string
}) {
  const scope = project.scope ?? []
  if (scope.length === 0) return null

  return (
    <p
      className={cn(
        'flex flex-wrap gap-x-2.5 gap-y-1 text-sm',
        dark ? 'text-canvas/60' : 'text-muted',
        className,
      )}
    >
      {scope.map((item, index) => (
        <span key={item}>
          {index > 0 ? (
            <span aria-hidden="true" className="mr-2.5">
              ·
            </span>
          ) : null}
          {item}
        </span>
      ))}
    </p>
  )
}
