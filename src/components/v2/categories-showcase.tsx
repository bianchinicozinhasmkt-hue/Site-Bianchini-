'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeader } from '@/components/layout/section'
import { ArrowLink } from '@/components/ui/actions/button'
import { homeCategories, type HomeCategory } from '@/data/v2/categories'
import { homeCategoriesSection } from '@/data/v2/home'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * ============================================================
 * VITRINE DE CATEGORIAS — NAVEGAÇÃO COMERCIAL, NÃO GALERIA
 * ============================================================
 *
 * Direção escolhida no Gate 2: **navegação editorial com painel ativo** no
 * desktop, lista simples empilhada no mobile. As seis frentes estão sempre
 * presentes nas duas composições (`docs/v2/DECISIONS.md`, DEC-007).
 *
 * O QUE FAZ ISTO NÃO SER UM SLIDER
 * --------------------------------
 * Não há seta de anterior/próximo, não há numeração de posição ("1 de 6") e não
 * há avanço automático. A troca é sempre **seleção direta** de um item da
 * lista, que fica inteira visível o tempo todo. O painel muda de conteúdo, nunca
 * de posição ou tamanho.
 *
 * HOVER NÃO TROCA CONTEÚDO
 * ------------------------
 * `onMouseEnter` disparando a troca faria o painel piscar seis vezes ao
 * atravessar a fileira, e um controle que reage à passagem lê como gráfico, não
 * como controle. A troca é por clique ou teclado — nada essencial depende de
 * hover, que não existe em toque.
 *
 * TECLADO
 * -------
 * `role="tablist"` vertical: `↑`/`↓` movem entre categorias, `Home`/`End` vão
 * para a primeira e a última. O foco acompanha a seleção (`roving tabindex`),
 * então a leitura por teclado é a mesma que a do mouse.
 *
 * MOTION
 * ------
 * A troca é substituição imediata de conteúdo — sem crossfade, sem
 * deslocamento. Não há nada a desligar sob `prefers-reduced-motion`: o único
 * movimento da seção é o realce de 1,02× da fotografia no hover, que a regra
 * global de reduced-motion já neutraliza.
 *
 * LIMITAÇÃO CONHECIDA (sem JavaScript)
 * ------------------------------------
 * Com JS desativado, o painel do desktop fica no estado inicial (Cocção) e as
 * outras cinco categorias aparecem na lista com nome e frase, mas sem painel.
 * O bloco mobile — que carrega as seis categorias completas — continua no HTML
 * enviado pelo servidor, então nada de conteúdo se perde para leitores de
 * máquina; o que se perde é a troca interativa, que é aprimoramento.
 */
export function CategoriesShowcase() {
  const [activeId, setActiveId] = useState(homeCategories[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const active = homeCategories.find((category) => category.id === activeId) ?? homeCategories[0]

  const select = useCallback((category: HomeCategory) => {
    setActiveId(category.id)
    trackEvent('categoria_equipamento_visualizada', { categoria: category.id })
  }, [])

  /**
   * Os chips da primeira dobra apontam para `#equipamentos-<id>`. O navegador
   * rola até o botão correspondente; aqui a categoria é ativada junto, para que
   * o painel já mostre o que o visitante pediu.
   */
  useEffect(() => {
    const applyHash = () => {
      const match = window.location.hash.match(/^#equipamentos-(.+)$/)
      if (!match) return
      const found = homeCategories.find((category) => category.id === match[1])
      if (found) setActiveId(found.id)
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = homeCategories.length - 1
    let next: number | null = null

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last

    if (next === null) return
    event.preventDefault()
    select(homeCategories[next])
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="equipamentos" className="bg-canvas py-16 md:py-20 lg:py-section">
      <Container>
        <SectionHeader
          eyebrow={homeCategoriesSection.eyebrow}
          title={homeCategoriesSection.title}
          lead={homeCategoriesSection.lead}
        />

        {/* ==========================================================
            DESKTOP — lista completa à esquerda, painel ativo à direita
            ========================================================== */}
        <div className="mt-12 hidden lg:grid lg:grid-cols-[minmax(0,30fr)_minmax(0,70fr)] lg:gap-x-10">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Categorias de equipamento"
            className="flex flex-col border-t border-line"
          >
            {homeCategories.map((category, index) => {
              const selected = category.id === active.id

              return (
                <button
                  key={category.id}
                  id={`equipamentos-${category.id}`}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  /*
                    Só o painel da categoria ativa existe no DOM, então apontar
                    `aria-controls` nos seis produziria cinco referências a `id`
                    inexistente — pior que omitir. A relação inversa
                    (`aria-labelledby` no painel) continua completa.
                  */
                  aria-controls={selected ? `painel-${category.id}` : undefined}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(category)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    'group relative flex min-h-[3.5rem] flex-col justify-center border-b border-line py-4 pl-4 pr-3 text-left transition-colors duration-200 ease-precise',
                    selected ? 'bg-surface' : 'hover:bg-surface/60',
                  )}
                >
                  {/*
                    Estado ativo com três sinais, um deles não-cromático: régua
                    de 2px na borda de ataque, peso tipográfico e contraste do
                    rótulo. A régua é **grafite** — em superfície clara o amarelo
                    não pode ser indicador de estado (1,4:1 sobre `canvas`).
                  */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-y-0 left-0 w-[2px] origin-top transition-transform duration-200 ease-precise',
                      selected ? 'scale-y-100 bg-ink' : 'scale-y-0 bg-ink',
                    )}
                  />

                  <span
                    className={cn(
                      'font-condensed text-[1.0625rem] uppercase leading-tight tracking-[0.03em] transition-colors',
                      selected ? 'font-semibold text-ink' : 'font-medium text-muted group-hover:text-ink',
                    )}
                  >
                    {category.name}
                  </span>

                  <span
                    className={cn(
                      'mt-1 line-clamp-1 text-[0.8125rem] leading-[1.4]',
                      selected ? 'text-muted' : 'text-muted/75',
                    )}
                  >
                    {category.statement}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            id={`painel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`equipamentos-${active.id}`}
            tabIndex={0}
            className="flex flex-col"
          >
            <CategoryMedia category={active} />

            <div className="mt-6 flex flex-1 flex-col">
              <h3 className="font-sans text-title-3 font-bold text-ink">{active.name}</h3>
              <p className="mt-3 max-w-[62ch] text-body text-muted">{active.statement}</p>

              {active.items.length ? (
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {active.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-body-sm text-ink before:h-[3px] before:w-[3px] before:shrink-0 before:rounded-full before:bg-ink before:content-['']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 max-w-[62ch] border-l-2 border-line pl-4 text-body-sm text-muted">
                  {homeCategoriesSection.pendingNote}
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-2 pt-7">
                <ArrowLink href={active.cta.href}>{active.cta.label}</ArrowLink>
                {active.note ? (
                  <Link
                    href={active.note.href}
                    className="inline-flex min-h-[2.75rem] items-center text-body-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                  >
                    {active.note.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            MOBILE / TABLET — seis cartões, todos no mesmo estado

            Sem painel ativo: em coluna única não há espaço para lista +
            painel, e replicar o padrão de abas produziria uma lista com
            maioria de itens inertes — que é o que faz uma seção parecer
            tabela de relatório. Aqui todos os seis mostram o mesmo nível de
            conteúdo, e nada depende de interação.
            ========================================================== */}
        <ul className="mt-10 flex flex-col gap-6 lg:hidden">
          {homeCategories.map((category) => (
            <li key={category.id}>
              <Reveal variant="up">
                <article className="flex flex-col border-t border-line pt-5">
                  <CategoryMedia category={category} compact />

                  <h3 className="mt-4 font-sans text-title-3 font-bold text-ink">{category.name}</h3>
                  <p className="mt-2 text-body-sm text-muted">{category.statement}</p>

                  {category.items.length ? (
                    <p className="mt-3 text-body-sm text-ink">{category.items.join(' · ')}</p>
                  ) : (
                    <p className="mt-3 border-l-2 border-line pl-4 text-body-sm text-muted">
                      {homeCategoriesSection.pendingNote}
                    </p>
                  )}

                  <ArrowLink href={category.cta.href} className="mt-2">
                    {category.cta.label}
                  </ArrowLink>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ----------
            Objeção do público de alta intenção, respondida na própria vitrine
            em vez de ficar numa FAQ interna. Texto transcrito de
            `src/data/faq.ts` — não é copy nova.
            ---------- */}
        <Reveal className="mt-12 border-t border-line pt-6">
          <p className="max-w-[70ch] text-body-sm text-muted">
            <span className="font-semibold text-ink">{homeCategoriesSection.objection.question}</span>{' '}
            {homeCategoriesSection.objection.answer}
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

/**
 * Área de imagem do painel.
 *
 * Categoria sem dataset **não** recebe fotografia emprestada de outra frente
 * nem ícone genérico de "em construção": recebe uma moldura técnica vazia, que
 * é coerente com o vocabulário da página e diz a verdade — o conteúdo ainda não
 * foi publicado (`docs/v2/DECISIONS.md`, DEC-006).
 */
function CategoryMedia({ category, compact = false }: { category: HomeCategory; compact?: boolean }) {
  const ratio = compact ? 'aspect-[16/10]' : 'aspect-[16/9]'

  if (!category.media) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden border border-dashed border-line bg-canvas-deep',
          ratio,
        )}
      >
        <span aria-hidden="true" className="absolute left-4 top-4 h-[2px] w-8 bg-yellow-deep" />
        <span className="absolute bottom-4 left-4 right-4 font-condensed text-[0.6875rem] font-medium uppercase leading-[1.4] tracking-[0.12em] text-muted">
          Conteúdo em preparação
        </span>
      </div>
    )
  }

  return (
    <div className={cn('group relative w-full overflow-hidden bg-graphite', ratio)}>
      <Image
        src={category.media.src}
        alt={category.media.alt}
        fill
        quality={82}
        sizes={compact ? '100vw' : '(max-width: 1023px) 100vw, 62vw'}
        className="object-cover object-center transition-transform duration-[420ms] ease-smooth motion-reduce:transition-none"
      />
    </div>
  )
}
