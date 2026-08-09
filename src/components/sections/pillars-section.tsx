import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { ArrowLink, LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { pillars } from '@/data/pillars'

/**
 * As três frentes comerciais — a seção onde **Projetos e Consultoria ganham
 * nome, pergunta e porta própria**, e onde a integração é oferecida sem ser
 * imposta.
 *
 * ============================================================
 * O QUE ESTA SEÇÃO ERA, E POR QUE MUDOU (2026-08-09)
 * ============================================================
 *
 * Era o organograma: "Como a Bianchini está organizada · Três pilares, dois
 * responsáveis", com os cartões em Projetos → Equipamentos → Operação
 * Comercial e uma segunda camada listando quem responde por cada frente. O
 * diagnóstico completo está em `src/data/pillars.ts`; em resumo, ela falava da
 * empresa em vez de responder a uma pergunta do cliente, invertia a hierarquia
 * comercial vigente (DEC-001) e nunca nomeava Consultoria — o terceiro caminho
 * que a própria primeira dobra oferece.
 *
 * Agora cada cartão é uma frente contratável: situação → pergunta → o que a
 * Bianchini entrega → ação. E a seção subiu na página (de 6ª para 4ª): quem
 * acabou de ver Equipamentos e a prova fotográfica encontra aqui os outros
 * dois caminhos, **antes** de a página começar a falar de sintomas e
 * diagnóstico.
 *
 * ============================================================
 * A COMPOSIÇÃO NÃO FOI REDESENHADA
 * ============================================================
 *
 * Mesma moldura compartilhada (`gap-px` sobre `bg-line`, três faces de uma
 * estrutura só), mesmo marcador de hairline amarela, mesma escala tipográfica,
 * mesma entrada em `Reveal` escalonada. O que saiu foi a **segunda camada** —
 * a faixa "Quem responde por cada frente" —, e por motivo de conteúdo, não de
 * estética: ela repetia, em tipografia, os dois nomes que "Quem conduz"
 * apresenta com retrato e credencial, e dependia de um campo `responsible` que
 * não pode ser preenchido para Consultoria sem inventar dado sobre pessoa real.
 *
 * ============================================================
 * PESO ASSIMÉTRICO — E POR QUE ELE É SÓ DO PRIMEIRO CARTÃO
 * ============================================================
 *
 * DEC-001 pede Equipamentos com peso maior quando os três aparecem juntos. Aqui
 * isso é **posição (01) + preenchimento do CTA**: o de Equipamentos é o botão
 * primário amarelo, os outros dois são `ArrowLink` grafite. Nenhum cartão fica
 * maior, mais claro ou com fotografia — a moldura continua simétrica, porque
 * três faces de tamanhos diferentes leem como erro de montagem, não como
 * hierarquia.
 *
 * O amarelo cheio é legítimo em fundo claro: é **preenchimento de CTA**, não
 * texto nem indicador de estado (regra do amarelo, `CLAUDE.md`).
 */
export function PillarsSection() {
  return (
    <Section id="pilares" tone="canvas" space="default" bleed aria-labelledby="pilares-titulo">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>As três frentes</Eyebrow>
            <Heading as={2} id="pilares-titulo" size="title-1" className="mt-5 max-w-[22ch]">
              Equipamentos, projetos e consultoria — separados ou juntos
            </Heading>
          </div>

          {/*
            A frase que resolve a objeção do visitante de alta intenção: ele não
            precisa comprar a narrativa inteira para agir na frente que veio
            resolver. "Sem repasse de culpa entre projetista, fornecedor e
            instalador" é transcrição de `src/data/solutions.ts`.
          */}
          <p className="text-lead text-muted lg:col-span-4 lg:col-start-9">
            Cada frente resolve um problema por conta própria. Juntas, não há repasse de culpa
            entre projetista, fornecedor e instalador — mas integrar é uma vantagem, não uma
            condição para começar.
          </p>
        </div>

        {/*
          `as="li"` — o item da grade precisa ser o próprio `li`, não um `div`
          do `Reveal` com o `li` dentro: além da semântica da lista, é o item
          da grade que recebe a altura da linha, e um wrapper intermediário
          quebrava o `gap-px` que desenha a moldura.

          Os cartões dividem uma moldura só (`gap-px` sobre `bg-line`): são
          três faces de uma mesma estrutura, não três objetos soltos — e a
          junção fica com a espessura exata de um fio, sem o vão irregular que
          três caixas com borda própria produziam.
        */}
        <ol className="mt-10 grid gap-px border border-line bg-line lg:mt-14 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal
              key={pillar.number}
              as="li"
              delay={index * 90}
              className="group flex h-full flex-col bg-surface p-7 transition-colors duration-300 ease-smooth hover:bg-canvas-deep lg:p-9"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[2px] w-6 shrink-0 bg-yellow transition-[width] duration-300 ease-smooth group-hover:w-10"
                />
                <span className="font-condensed text-eyebrow font-bold tabular-nums tracking-[0.12em] text-ink/45">
                  {pillar.number}
                </span>
                {/* A mesma frase da régua da primeira dobra — quem escolheu lá reconhece aqui. */}
                <span className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.09em] text-muted">
                  {pillar.cue}
                </span>
              </div>

              <h3 className="mt-5 font-sans font-bold text-title-2 text-ink">{pillar.title}</h3>

              {/* A pergunta do cliente, não a descrição da empresa. */}
              <p className="mt-3 max-w-[34ch] font-sans text-body font-semibold text-ink">
                {pillar.question}
              </p>

              <p className="mt-3 max-w-[40ch] text-body-sm text-muted">{pillar.description}</p>

              {/*
                `mt-auto`: os três CTAs ficam na mesma linha de base mesmo com
                descrições de comprimentos diferentes — sem isso o botão de
                Equipamentos subiria e a fileira leria desalinhada.
              */}
              <div className="mt-auto pt-7">
                {index === 0 ? (
                  <LinkButton href={pillar.cta.href} variant="primary" size="md" withArrow>
                    {pillar.cta.label}
                  </LinkButton>
                ) : (
                  <ArrowLink href={pillar.cta.href}>{pillar.cta.label}</ArrowLink>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
