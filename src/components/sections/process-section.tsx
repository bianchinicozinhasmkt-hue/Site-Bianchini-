import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { PhotoReveal } from '@/components/animations/photo-reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { methodSteps } from '@/data/diagnosis'
import { cn } from '@/lib/utils'

/**
 * Método integrado — **narrativa de três momentos com evidência**, não três
 * colunas de texto.
 *
 * ============================================================
 * O QUE MUDOU
 * ============================================================
 *
 * A versão anterior eram três colunas equivalentes: número, título e duas
 * etapas em texto. Correta e ilegível como narrativa — nada mostrava que existe
 * **passagem de responsabilidade** entre entender, decidir e entregar.
 *
 * Agora cada momento traz uma evidência real do acervo, e as três evidências
 * são de naturezas diferentes de propósito, porque é isso que a passagem
 * significa:
 *
 *   Entender ... a operação como ela é — fotografia de cozinha em produção
 *   Decidir .... o estudo do que ela vai ser — documento 3D do projeto
 *   Entregar ... o equipamento no lugar — fotografia da instalação
 *
 * De fotografia para documento e de documento de volta para fotografia: a
 * leitura vira a realidade, a decisão vira desenho, o desenho vira operação.
 *
 * ============================================================
 * A LINHA
 * ============================================================
 *
 * A linha do método é construída da esquerda para a direita quando a seção
 * entra (`PhotoReveal` com máscara horizontal, 650ms) e os três momentos
 * chegam atrás dela, a 90ms de distância. É o que separa isto de uma timeline
 * genérica: o que se vê é um projeto avançando, não bolinhas aparecendo.
 *
 * A emenda entre momentos é um traço curto no topo de cada coluna — o do
 * momento aberto é grafite, os seguintes são `line`. Sem ícone, sem losango,
 * sem numeral gigante.
 *
 * ============================================================
 * TRÊS CARDS IGUAIS, E POR QUE NÃO MAIS
 * ============================================================
 *
 * As três evidências tinham a mesma proporção (4/3) na mesma altura — o que
 * lia como narrativa no texto continuava lendo como grade na imagem. Agora
 * cada uma tem seu próprio formato (largo → vertical → quadrado) e sua própria
 * altura de partida, e o documento do meio **invade a coluna anterior**
 * (margem negativa à esquerda): é a fase "Decidir" avançando fisicamente sobre
 * "Entender", a única sobreposição da seção — sem sombra pesada, só a camada.
 *
 * Fecha com uma linha de transferência de responsabilidade: os três momentos
 * outra vez, ligados por seta, abaixo da grade — não repete os cards, resume o
 * percurso numa frase.
 */
interface ProcessSectionProps {
  /** Permite reaproveitar a seção em páginas internas com outro texto. */
  eyebrow?: string
  title?: string
  lead?: string
  tone?: 'canvas' | 'surface' | 'canvas-deep'
}

/**
 * Os três momentos, cada um com as suas duas etapas e a evidência que o
 * comprova. As etapas vêm de `methodSteps` — se um passo for editado lá, o
 * momento acompanha. As legendas são neutras: o acervo não registra cliente,
 * local nem prazo, e inventar seria pior que não legendar.
 */
const methodMoments = [
  {
    number: '01',
    title: 'Entender',
    summary: 'Visita técnica e leitura da operação como ela funciona hoje.',
    steps: methodSteps.slice(0, 2),
    media: {
      src: '/images/projects/cozinha-completa.jpg',
      alt: 'Cozinha profissional completa em operação, com linha de cocção, coifa e bancadas em aço inox',
      caption: 'A operação como ela é — leitura em campo.',
      kind: 'Fotografia de operação',
      /* Largo e baixo: a leitura inicial é panorâmica. */
      aspect: '16/10',
      offset: '',
    },
  },
  {
    number: '02',
    title: 'Decidir',
    summary: 'Prioridade, projeto e o investimento direcionado ao que muda a operação.',
    steps: methodSteps.slice(2, 4),
    media: {
      src: '/images/projects/projeto-3d-recorte.jpg',
      alt: 'Estudo tridimensional de cozinha profissional, com bancadas, refrigeração e circulação posicionadas',
      caption: 'O que ela vai ser — estudo 3D do acervo Bianchini.',
      kind: 'Documento de projeto',
      /*
        Vertical, deslocado só na horizontal — invade a coluna de "Entender"
        pela borda, sem subir por cima do próprio resumo do momento. Um
        deslocamento vertical aqui (testado e descartado) cobria o parágrafo
        de "Decidir" com a própria imagem, o que é o erro oposto do
        pretendido: a peça precisa avançar sobre o vizinho, não sobre si.
      */
      aspect: '4/5',
      offset: 'lg:-ml-6 xl:-ml-9',
    },
  },
  {
    number: '03',
    title: 'Entregar',
    summary: 'Fabricação, obra, instalação e acompanhamento depois da entrega.',
    steps: methodSteps.slice(4, 6),
    media: {
      src: '/images/projects/forno-combinado.jpg',
      alt: 'Forno combinado instalado e comissionado em cozinha profissional',
      caption: 'O equipamento no lugar — registro do acervo Bianchini.',
      kind: 'Fotografia de entrega',
      /* Quadrado e deslocado para baixo: fecha a jornada, assentado. */
      aspect: '1/1',
      offset: 'lg:mt-6',
    },
  },
] as const

export function ProcessSection({
  eyebrow = 'Método integrado',
  title = 'Do diagnóstico ao acompanhamento, sob uma única responsabilidade',
  lead = 'O mesmo time responde pelo entendimento do problema, pelo desenho da solução, pelo fornecimento e pela entrega em operação.',
  tone = 'canvas',
}: ProcessSectionProps = {}) {
  return (
    <Section
      id="metodo"
      tone={tone}
      space="default"
      bleed
      aria-labelledby="metodo-titulo"
      /* `isolate`: a sobreposição do documento usa `z-10` só dentro desta
         seção — sem isto ela poderia disputar empilhamento com a seção
         seguinte em navegadores que otimizam o contexto de forma diferente. */
      className="isolate overflow-hidden"
    >
      <Container>
        {/*
          Enunciado em coluna única e alinhamento à esquerda — as seções
          vizinhas (projetos e diferenciais) abrem em duas colunas, e repetir
          a moldura três vezes seguidas apagaria a diferença entre elas.
        */}
        <div className="max-w-[46rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading as={2} id="metodo-titulo" size="title-1" className="mt-5">
            {title}
          </Heading>
          <p className="mt-6 max-w-[58ch] text-lead text-muted">{lead}</p>
        </div>

        <ol className="relative mt-12 grid gap-12 md:mt-16 lg:grid-cols-3 lg:gap-10">
          {/* ----------
              A linha, construída da esquerda para a direita. `PhotoReveal`
              observa o elemento-pai (a `<ol>`), então a máscara dispara pela
              lista inteira e não por si mesma.
              ---------- */}
          <PhotoReveal
            mask="right"
            className="pointer-events-none absolute left-[0.3rem] top-3 h-[calc(100%-1.5rem)] w-px lg:left-0 lg:right-0 lg:top-0 lg:h-px lg:w-auto"
          >
            <span aria-hidden="true" className="block h-full w-full bg-line" />
          </PhotoReveal>

          {methodMoments.map((moment, index) => (
            <Reveal
              as="li"
              key={moment.title}
              variant="side"
              delay={200 + index * 90}
              className="relative pl-9 lg:pl-0 lg:pr-8"
            >
              {/* Emenda: o traço do momento aberto é grafite; os seguintes, line. */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 top-[0.2rem] h-3 w-3 lg:-top-[1px] lg:h-[2px] lg:w-14',
                  index === 0 ? 'bg-ink' : 'bg-line',
                )}
              />

              <div className="lg:pt-9">
                <p className="font-condensed text-caption font-bold tabular-nums text-ink">
                  {moment.number}
                </p>
                <h3 className="mt-2 font-sans text-title-2 font-bold text-ink">{moment.title}</h3>
                <p className="mt-3 max-w-[34ch] text-body-sm text-muted">{moment.summary}</p>

                {/* ----------
                    Evidência do momento. É o que transforma a lista em
                    narrativa: fotografia → documento → fotografia. Cada uma
                    tem seu próprio formato e deslocamento — `offset` desloca a
                    `figure` inteira, criando a sobreposição do documento sobre
                    a coluna anterior.
                    ---------- */}
                <figure className={cn('relative z-10 mt-7', moment.media.offset)}>
                  <div
                    className="relative w-full overflow-hidden bg-canvas-deep"
                    style={{ aspectRatio: moment.media.aspect }}
                  >
                    <Image
                      src={moment.media.src}
                      alt={moment.media.alt}
                      fill
                      sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 30vw"
                      quality={82}
                      className={cn(
                        'object-cover',
                        /* O estudo 3D é documento: entra dessaturado, como a planta. */
                        moment.media.kind === 'Documento de projeto' &&
                          'saturate-[0.35] contrast-[1.06]',
                      )}
                    />
                  </div>
                  <figcaption className="mt-3 flex flex-col gap-1">
                    <span className="font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.11em] text-ink/55">
                      {moment.media.kind}
                    </span>
                    <span className="text-caption text-muted">{moment.media.caption}</span>
                  </figcaption>
                </figure>

                {/* As duas etapas do momento, sem caixa e sem ícone. */}
                <ol className="mt-7 space-y-6">
                  {moment.steps.map((step) => (
                    <li key={step.number} className="border-t border-line pt-4">
                      <p className="font-condensed text-caption font-semibold tabular-nums text-ink">
                        {step.number}
                      </p>
                      <h4 className="mt-1.5 font-sans text-body font-semibold text-ink">
                        {step.title}
                      </h4>
                      <p className="mt-2 max-w-[38ch] text-body-sm text-muted">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* ==========================================================
            Conclusão — transferência de responsabilidade.

            Não repete os três cards: resume o percurso numa frase e reafirma
            que é uma única equipe atravessando os três momentos, com os
            próprios títulos ligados por seta em vez de uma lista nova.
            ========================================================== */}
        <Reveal
          variant="line"
          className="mt-14 flex flex-col gap-5 border-t border-line pt-8 lg:mt-16 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="max-w-[46ch] text-body-sm text-muted">
            As três fases seguem sob a mesma responsabilidade — do primeiro diagnóstico ao
            acompanhamento depois da entrega, sem repasse entre empresas diferentes.
          </p>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-condensed text-eyebrow font-semibold uppercase tracking-[0.04em] text-ink">
            {methodMoments.map((moment, index) => (
              <span key={moment.title} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-ink/30">
                    →
                  </span>
                ) : null}
                {moment.title}
              </span>
            ))}
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
