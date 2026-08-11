'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { diagnosisAreas, diagnosisOutcomes, nextSteps, planZones } from '@/data/diagnosis'
import { cn } from '@/lib/utils'

/**
 * O ponto de partida — o diagnóstico, em **uma composição só**.
 *
 * ============================================================
 * O QUE A FAZIA PARECER UM PDF (recomposição de 2026-08-04)
 * ============================================================
 *
 * A seção media ~1.150px em 1440px e estava montada como cinco blocos
 * concorrentes empilhados: enunciado, foto, controles, painel de leitura,
 * conclusão — e ainda um segundo bloco de encerramento com título próprio,
 * três etapas descritas e um CTA. Quatro defeitos, todos de composição, não
 * de conteúdo:
 *
 *  1. **A grade de seis frentes.** As seis eram sempre listadas, com as duas
 *     da zona ativa marcadas e **quatro esmaecidas** ocupando espaço sem
 *     serem lidas. Uma matriz de itens majoritariamente inertes é literalmente
 *     a forma de uma tabela de relatório — era daí que vinha a sensação de
 *     "PDF colado na página". Agora só as frentes da zona ativa têm forma de
 *     item; as demais viram uma linha corrida de apoio, que preserva a
 *     informação (o diagnóstico lê seis frentes) sem desenhar a tabela.
 *  2. **Dois encerramentos.** "O que essa leitura permite decidir" fechava o
 *     painel da direita e, logo abaixo, "O que acontece depois do primeiro
 *     contato" abria outro bloco alto. Viraram uma **faixa de conclusão
 *     única**, ver abaixo.
 *  3. **Título em três linhas** contra um texto de apoio esmaecido à direita:
 *     o enunciado sozinho comia ~190px antes de qualquer conteúdo.
 *  4. **Controles com cara de cabeçalho de tabela** — três células rentes,
 *     unidas por uma borda superior contínua, sem moldura própria. Ver o
 *     bloco dos controles, mais abaixo.
 *
 * ============================================================
 * CONSOLIDAÇÃO DE `nextSteps` (decisão de conteúdo)
 * ============================================================
 *
 * `nextSteps` ("Conversa inicial · Visita técnica · Devolutiva com
 * prioridades") **repetia** os passos 01–03 de `methodSteps` ("Diagnóstico ·
 * Identificação dos problemas · Priorização das soluções"), que é o que a
 * seção Método (`journey-section.tsx`, âncora `#metodo`) já mostra — o mesmo
 * primeiro movimento do funil contado duas vezes na mesma página.
 *
 * A sequência **não foi removida**: ela responde "o que acontece se eu
 * clicar", e o lugar certo para isso é ao lado do CTA, não no método. O que
 * saiu foram as **descrições** de cada etapa — é nelas que a repetição
 * literal estava, e são elas que faziam o bloco ter altura de seção. Ficaram
 * os três rótulos, em linha, como percurso: o visitante lê a sequência em um
 * movimento de olho, e o detalhe de cada etapa continua íntegro em
 * `data/diagnosis.ts` e no método.
 */
export function DiagnosisSection({ compact = false }: { compact?: boolean } = {}) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const current = planZones[active] ?? planZones[0]

  /** Frentes que a zona ativa **não** cobre — viram linha de apoio, não itens. */
  const otherAreas = diagnosisAreas
    .filter((area) => !current.areas.includes(area.title))
    .map((area) => area.title)

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = planZones.length - 1
    const next = {
      ArrowRight: Math.min(active + 1, last),
      ArrowLeft: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  return (
    <Section
      id="diagnostico"
      tone="canvas-deep"
      space={compact ? 'sm' : 'default'}
      bleed
      aria-labelledby="diagnostico-titulo"
    >
      <Container>
        {/* ---------- Enunciado: uma linha, duas colunas, sem altura de capa ---------- */}
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>O ponto de partida</Eyebrow>
            {/*
              `max-w-[26ch]`, não `[20ch]`: em 20ch o título quebrava em três
              linhas e o enunciado sozinho passava de 190px de altura.
            */}
            <Heading as={2} id="diagnostico-titulo" size="title-1" className="mt-4 max-w-[26ch]">
              Antes de recomendar qualquer solução, entendemos a operação
            </Heading>
          </div>

          <p className="text-body text-muted lg:col-span-4 lg:col-start-9">
            O diagnóstico separa o que precisa ser resolvido do que apenas parece urgente. É ele
            que define onde investir primeiro — e o que não precisa ser comprado.
          </p>
        </div>

        {/* ==========================================================
            MESA DE PROJETO — evidência (60%) + leitura (40%).
            No mobile empilha na ordem do DOM: foto → controles → leitura.
            ========================================================== */}
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:items-start lg:gap-10">
          {/* ---------- A. Evidência: uma fotografia, a planta como selo ---------- */}
          <Reveal variant="settle">
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas sm:aspect-[16/10]">
                {planZones.map((zone, index) => (
                  <Image
                    key={zone.id}
                    src={zone.media.src}
                    alt={index === active ? zone.media.alt : ''}
                    aria-hidden={index !== active}
                    fill
                    sizes="(max-width: 1023px) 92vw, 52vw"
                    quality={80}
                    data-active={index === active}
                    className="panel-photo object-cover"
                  />
                ))}

                {/*
                  Selo de localização: a planta reduzida a uma miniatura no
                  canto da foto, como um mapa sobre uma foto de imóvel — apoio
                  discreto, não uma segunda evidência para "ler". Ampliado de
                  96×64 para 128×80 em 2026-08-04: no tamanho anterior o
                  desenho virava uma mancha cinza e os losangos de zona não
                  eram distinguíveis, o que tornava o selo decoração em vez de
                  mapa. O contraste também subiu, pelo mesmo motivo.
                */}
                {/*
                  `rounded-sm` e a sombra projetada saíram em 2026-08-11. O
                  vocabulário do site não tem raio de canto nem sombra
                  projetada em lugar nenhum, e este selo era a única ocorrência
                  das duas coisas na home — lia como um cartão colado sobre a
                  fotografia. O que separa o selo do fundo continua sendo o
                  contorno branco, que agora é o único recurso e ganha 1px.
                */}
                <div className="absolute bottom-3 left-3 h-[4.5rem] w-[7rem] overflow-hidden border-2 border-white/60 sm:h-20 sm:w-32">
                  <Image
                    src="/images/projects/planta-executiva-recorte.jpg"
                    alt="Planta executiva em CAD de uma cozinha profissional, com salão de atendimento cotado, linha de produção e área de retaguarda"
                    fill
                    sizes="128px"
                    quality={72}
                    className="object-cover grayscale contrast-[1.3] brightness-[1.08]"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-canvas-deep/10" />
                  {planZones.map((zone, index) => {
                    const selected = index === active
                    return (
                      <span
                        key={zone.id}
                        aria-hidden="true"
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                        className="pointer-events-none absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                      >
                        <span
                          className={cn(
                            'block rotate-45 border transition-[background-color,border-color,transform] duration-[260ms] ease-precise',
                            selected
                              ? 'h-[9px] w-[9px] scale-110 border-ink bg-yellow shadow-[0_0_0_3px_rgba(16,16,16,0.25)]'
                              : 'h-[5px] w-[5px] border-ink/50 bg-canvas',
                          )}
                        />
                      </span>
                    )
                  })}
                </div>
              </div>
              <figcaption className="mt-2 text-caption text-muted">{current.media.caption}</figcaption>
            </figure>

            {/* ==========================================================
                CONTROLES DAS TRÊS ZONAS

                A versão anterior eram três células rentes ligadas por uma
                borda superior contínua e sem moldura própria — a forma de um
                cabeçalho de tabela, que é justamente o que a seção não podia
                parecer. Agora cada zona é um **botão com caixa própria**, na
                mesma linguagem dos outros controles do site: superfície
                `surface` sobre `canvas-deep`, borda inteira, e o estado ativo
                marcado por **três sinais somados** — preenchimento grafite,
                índice amarelo (legítimo: o fundo virou escuro) e um traço na
                base. Estado não sinalizado só por cor, conforme a regra de
                acessibilidade do projeto.
                ========================================================== */}
            <div
              role="tablist"
              aria-label="Zonas de leitura da planta"
              aria-orientation="horizontal"
              className="mt-4 grid grid-cols-3 gap-2"
            >
              {planZones.map((zone, index) => {
                const selected = index === active
                return (
                  <button
                    key={zone.id}
                    ref={(node) => {
                      tabsRef.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${zone.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={onTabKeyDown}
                    /* ==========================================================
                       A MOLDURA INTEIRA SAI, FICA A RÉGUA (2026-08-11)
                       ==========================================================

                       As três zonas eram retângulos com borda nos quatro lados.
                       Três retângulos contornados lado a lado sob uma fotografia
                       são a forma de uma barra de abas genérica — "botões que
                       parecem tabs sem presença", que é o que o briefing desta
                       rodada manda eliminar.

                       A correção é a mesma gramática que as três portas da
                       primeira dobra passaram a usar nesta rodada, transposta
                       para superfície clara: **régua no topo, laterais e base
                       abertas**. Não é uma escolha estética repetida por acaso —
                       são dois seletores de zona/frente na mesma página, e eles
                       precisavam ler como o mesmo tipo de objeto.

                       Os sinais do estado ativo continuam sendo quatro, e um
                       deles não é cor: preenchimento grafite (inversão de
                       luminância), régua de 3px contra 1, índice amarelo
                       (legítimo — o fundo do item ativo é escuro) e o traço na
                       base. Como em `#pilares`, o recuo compensa a espessura da
                       régua para que os três rótulos assentem na mesma linha.
                       ========================================================== */
                    className={cn(
                      'group relative flex flex-col items-start gap-1.5 px-3 pb-2.5 text-left',
                      'transition-[background-color,border-color,color] duration-[220ms] ease-precise',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-deep',
                      selected
                        ? 'border-t-[3px] border-ink bg-ink pt-[0.5rem] text-canvas'
                        : 'border-t border-line bg-surface pt-2.5 text-ink hover:border-ink/45 hover:bg-canvas',
                    )}
                  >
                    <span
                      className={cn(
                        'font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.09em]',
                        selected ? 'text-yellow' : 'text-muted',
                      )}
                    >
                      Zona {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-caption font-semibold leading-tight sm:text-body-sm">
                      {zone.label}
                    </span>
                    {/* Terceiro sinal do estado ativo — não depende de cor. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-3 bottom-0 h-[2px] bg-yellow transition-opacity duration-[220ms]',
                        selected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* ---------- B. Leitura da zona ativa ---------- */}
          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${current.id}`}
            className="relative"
          >
            {/* Altura mínima: sem ela a coluna encolhe e cresce a cada troca. */}
            <div className="flex min-h-[19rem] flex-col lg:min-h-[20rem]">
              <div key={current.id} className="scope-panel">
                <h3 className="font-sans font-bold text-title-2 text-ink">{current.label}</h3>
                <p className="mt-3 max-w-[42ch] text-body text-ink/80">{current.reading}</p>

                {/* Consequência principal — o que está em jogo nesta zona. */}
                <p className="mt-4 max-w-[42ch] border-l-2 border-ink pl-3.5 text-body-sm font-medium text-ink">
                  {current.consequence}
                </p>

                {/*
                  Frentes: só as da zona ativa têm forma de item. As outras
                  quatro entram como uma linha corrida — a informação de que o
                  diagnóstico lê seis frentes continua na página, sem a matriz
                  de itens inertes que desenhava a tabela.
                */}
                <div className="mt-6 border-t border-line pt-4">
                  <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-ink/60">
                    Frentes lidas nesta zona
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {current.areas.map((area) => (
                      <li
                        key={area}
                        className="border-l-2 border-ink bg-surface px-3 py-1.5 text-body-sm font-semibold text-ink"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 max-w-[46ch] text-caption text-muted">
                    Também no diagnóstico: {otherAreas.join(' · ')}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            FAIXA DE CONCLUSÃO — um encerramento, não dois.

            Junta o que eram dois blocos altos: "o que essa leitura permite
            decidir" (que fechava a coluna da direita) e "o que acontece
            depois do primeiro contato" (que abria um bloco próprio, com
            título, três etapas descritas e CTA). Aqui viram duas faixas de
            uma linha cada — decisões à esquerda, percurso + CTA à direita —
            e o CTA fica no fim da leitura, que é onde ele converte.
            ========================================================== */}
        <Reveal variant="line">
          <div className="mt-8 border-t-2 border-ink pt-6 lg:mt-10" data-whatsapp-safe-zone>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-ink/60">
                  O que essa leitura permite decidir
                </p>
                <ul className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                  {diagnosisOutcomes.map((outcome) => (
                    <li key={outcome} className="text-body-sm font-medium text-ink">
                      {outcome}
                      <span aria-hidden="true" className="ml-2.5 text-line last:hidden">
                        ·
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-ink/60">
                  Depois do primeiro contato
                </p>
                {/* Percurso em linha — rótulos, sem as descrições que repetiam o método. */}
                <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  {nextSteps.map((step, index) => (
                    <li key={step.number} className="flex items-center gap-2 text-body-sm text-ink">
                      <span className="font-condensed font-bold tabular-nums text-ink/45">
                        {step.number}
                      </span>
                      <span className="font-medium">{step.title}</span>
                      {index < nextSteps.length - 1 ? (
                        <span aria-hidden="true" className="ml-1 h-px w-4 bg-line" />
                      ) : null}
                    </li>
                  ))}
                </ol>

                <LinkButton href="/contato" variant="primary" size="lg" withArrow className="mt-5">
                  Solicitar diagnóstico
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
