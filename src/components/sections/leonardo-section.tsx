import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { ArrowRightIcon } from '@/components/ui/icons'
import { LeonardoPortrait } from '@/components/ui/leonardo-portrait'
import { book, leonardo } from '@/data/leonardo'

/**
 * Leonardo — o ápice humano e de autoridade da home.
 *
 * ============================================================
 * DOIS DEFEITOS CORRIGIDOS NESTA PASSAGEM
 * ============================================================
 *
 *  1. **Aresta retangular visível.** O fragmento do estudo 3D entrava como um
 *     `<div>` posicionado com `opacity-[0.07]` — e a borda desse retângulo
 *     aparecia como um degrau de luminosidade no meio do grafite, atravessando
 *     o título. Um plano de fundo que se anuncia como retângulo não é
 *     profundidade, é um erro de composição. Agora o fragmento é dissolvido
 *     por `mask-image` radial: não existe borda para ver.
 *
 *  2. **"Retrato de um lado, texto do outro".** Era exatamente a estrutura que
 *     a direção de arte pediu para eliminar — duas colunas independentes com
 *     um vão preto entre elas. Agora o retrato e o texto **se sobrepõem**: a
 *     coluna de texto começa dentro da faixa do retrato (`-ml` negativo em
 *     `xl`) e o nome de Leonardo é uma faixa que atravessa a base da figura.
 *     São planos que se cruzam, não colunas encostadas.
 *
 * ============================================================
 * O QUE A SEÇÃO PRECISA COMUNICAR
 * ============================================================
 *
 * Quem conduz o diagnóstico · experiência desde 2008 · especialidade ·
 * visão de negócio · frentes de atuação · trajetória · o livro.
 *
 * Tudo isso já existia em `src/data/leonardo.ts` — nada foi escrito aqui.
 * O que mudou é a hierarquia: a tese domina, a assinatura atravessa o
 * retrato, e trajetória/frentes/livro descem como uma **faixa de credenciais
 * agrupada**, não como três blocos soltos.
 */
export function LeonardoSection() {
  return (
    <Section
      id="leonardo"
      tone="graphite"
      space="default"
      bleed
      aria-labelledby="leonardo-titulo"
      /*
        ----------
        `pb` REDUZIDO EM 2026-08-10 — a base do capítulo de autoridade
        ----------

        Esta seção passou a ser seguida diretamente por `#quem-conduz`
        (`credibilidade` desceu para depois dela — ver `src/app/page.tsx`). Duas
        seções grafite adjacentes, cada uma com `space="default"`, punham 160px
        de vão vazio entre a última credencial daqui e a etiqueta de lá: no
        telefone o par lia como duas telas grafite empilhadas, não como um
        assunto em duas partes.

        As duas metades do vão foram reduzidas — aqui e no `pt` de
        `leadership-section.tsx`, que ainda ganhou a régua que marca a divisão.
        O encontro passou de 160px de grafite vazio para 128px **com uma régua
        dentro**, a 80px daqui e a 48px da etiqueta seguinte: a linha lê como
        cabeçalho da segunda parte, não como fim de assunto. Só o espaçamento
        externo mudou; conteúdo, retrato, livro e composição estão intactos.
        ----------
      */
      className="relative isolate overflow-hidden pb-8 md:pb-10 lg:pb-10"
    >
      {/* ----------
          Fragmento de documento ao fundo, **sem borda**.

          `mask-image` radial dissolve o retângulo nas quatro direções, então
          o que se vê é uma variação de textura no grafite — não uma placa
          mais clara com aresta reta atravessando o título, que era o defeito
          da versão anterior.
          ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[6%] -top-[10%] hidden h-[78%] w-[52%] lg:block"
        style={{
          backgroundImage: 'url(/images/projects/projeto-3d-recorte.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.09,
          filter: 'saturate(0)',
          maskImage: 'radial-gradient(ellipse 62% 62% at 62% 42%, #000 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at 62% 42%, #000 0%, transparent 78%)',
        }}
      />

      <Container className="relative">
        {/* ==========================================================
            Retrato e tese sobrepostos.

            `lg:-ml-16 xl:-ml-24` na coluna de texto: ela **entra por cima**
            da faixa do retrato em vez de começar depois dele. O `z-10` e o
            `pl` compensatório garantem que o texto continue legível — o que
            se sobrepõe é a caixa, não as letras sobre a figura.
            ========================================================== */}
        {/*
          `lg:row-start-1` nos **dois** filhos é obrigatório. Sem ele, o grid
          vê duas peças com `col-start` explícito que se sobrepõem na coluna 5
          e joga a segunda para a linha seguinte — foi exatamente o que
          aconteceu na primeira tentativa: o texto desabou para baixo do
          retrato e a seção cresceu 397px. Com a linha declarada, as duas
          ocupam a mesma faixa e a sobreposição acontece de verdade.
        */}
        <div className="lg:grid lg:grid-cols-12 lg:items-end">
          <Reveal
            variant="settle"
            className="relative lg:col-span-5 lg:col-start-1 lg:row-start-1"
          >
            <div className="mx-auto max-w-[20rem] pl-[3px] sm:max-w-[24rem] lg:max-w-none">
              <LeonardoPortrait
                frame="bust"
                sizes="(max-width: 639px) 84vw, (max-width: 1023px) 56vw, 38vw"
              />
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mt-0">
            <Eyebrow tone="light" as="p">
              {leonardo.home.eyebrow}
            </Eyebrow>

            <h2
              id="leonardo-titulo"
              className="mt-5 max-w-[17ch] font-sans font-extrabold text-display text-canvas"
            >
              {leonardo.thesis.title}
            </h2>

            <p className="mt-6 max-w-[52ch] text-lead text-canvas/75">{leonardo.thesis.lead}</p>

            {/* ----------
                Assinatura como **faixa que atravessa** a base do retrato:
                superfície própria (`graphite-soft`), sangrando para a
                esquerda por cima da figura. É o único elemento que cruza os
                dois planos — e é ele que costura a composição.

                Só a faixa cruza, de propósito. A primeira tentativa fez a
                **coluna de texto inteira** avançar sobre o retrato, e o
                resultado foi título e parágrafo por cima do rosto e do
                braço: ilegíveis os dois. Sobreposição em composição vale
                para uma peça, não para o bloco de leitura.
                ---------- */}
            <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 bg-graphite-soft px-5 py-4 lg:-ml-20 lg:pl-20 xl:-ml-28 xl:pl-28">
              <span className="font-sans text-title-3 font-bold text-canvas">{leonardo.name}</span>
              <span className="text-body-sm text-canvas/70">{leonardo.role}</span>
              <span className="font-condensed text-caption uppercase tracking-[0.08em] text-yellow">
                No setor desde {leonardo.since}
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================================
            FAIXA DE CREDENCIAIS — trajetória, frentes e livro agrupados
            numa superfície só, não em três blocos soltos.
            ========================================================== */}
        <div className="mt-10 grid gap-x-10 gap-y-8 lg:mt-12 lg:grid-cols-12">
          <div className="flex flex-col gap-4 text-body-sm text-canvas/75 lg:col-span-5">
            {leonardo.home.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[54ch]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {/* Trajetória — quatro marcos, ligados por trilha contínua. */}
            <p className="font-condensed text-eyebrow font-semibold uppercase text-canvas/55">
              Trajetória
            </p>
            <ol className="relative mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                leonardo.trajectory[0],
                leonardo.trajectory[1],
                leonardo.trajectory[2],
                leonardo.trajectory[4],
              ].map((moment) => (
                <li key={moment.id} className="border-t-2 border-yellow/60 pt-3">
                  <p className="font-condensed text-caption font-semibold uppercase tracking-[0.06em] text-yellow/85">
                    {moment.marker}
                  </p>
                  <p className="mt-1 max-w-[24ch] text-body-sm font-semibold text-canvas">
                    {moment.title}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-8 font-condensed text-eyebrow font-semibold uppercase text-canvas/55">
              Frentes de atuação
            </p>
            <p className="mt-2 text-body-sm font-semibold text-canvas">
              {leonardo.home.competencies.map((item) => item.title).join(' · ')}
            </p>

            {/* Livro como evidência de autoria, ligado à seção própria. */}
            <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="#livro"
                className="group flex items-center gap-3 text-left"
              >
                <span
                  aria-hidden="true"
                  className="h-9 w-[0.5rem] shrink-0 bg-yellow transition-transform duration-200 ease-precise group-hover:scale-y-105"
                />
                <span>
                  <span className="block font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-canvas/50">
                    Autor de
                  </span>
                  <span className="block max-w-[34ch] text-body-sm font-semibold text-canvas group-hover:text-canvas/80">
                    {book.title}
                  </span>
                </span>
                <ArrowRightIcon
                  size={16}
                  className="shrink-0 text-canvas/60 transition-transform duration-200 ease-precise group-hover:translate-x-1"
                />
              </Link>

              <LinkButton
                href={leonardo.home.cta.href}
                variant="light-outline"
                size="md"
                withArrow
                className="shrink-0"
              >
                {leonardo.home.cta.label}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
