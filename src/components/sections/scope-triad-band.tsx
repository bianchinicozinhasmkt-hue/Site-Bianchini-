import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { ArrowLink } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'

/**
 * ============================================================
 * A PONTE — NÃO É MAIS UM MÉTODO, É O FECHO DO CAPÍTULO
 * ============================================================
 *
 * Até 2026-08-10 esta faixa era um **segundo sistema processual**: três cartões
 * com fotografia, numeral `01/02/03`, título e descrição — e as descrições vinham
 * de `methodSteps`, o mesmo dado que a seção `#metodo` publica logo abaixo. Com
 * `#atuacao` (cinco níveis) ainda montada entre as duas, a home explicava "como a
 * Bianchini trabalha" em **três lugares diferentes**, com três numerações
 * diferentes, no espaço de quatro seções. Era daí que vinha a leitura de manual:
 * sistema → sistema → sistema.
 *
 * A consolidação desta rodada deu a cada seção uma responsabilidade única:
 *
 *   `#diagnostico` .... como a causa é encontrada
 *   `#transicao` ...... **esta** — a ponte da leitura para a execução
 *   `#metodo` ......... o único lugar que detalha as etapas do trabalho
 *
 * Por isso aqui não há mais numeral, cartão, stepper nem descrição por etapa. O
 * arco diagnóstico → projeto → implantação continua dito — em **uma frase**, com
 * o vocabulário de `scopeTriad` (`src/data/navigation.ts`) —, e o detalhamento
 * pertence ao Método. Se um marcador voltar a aparecer aqui (badge, ícone,
 * círculo, letra), o problema volta com ele: o que se queria era menos sistema
 * visual, não outro sistema com decoração diferente.
 *
 * ============================================================
 * POR QUE CLARA, E NO MESMO TOM DO DIAGNÓSTICO
 * ============================================================
 *
 * A faixa era grafite. Com `#atuacao` (surface) fora da montagem, ela passaria a
 * encostar direto em `#industria-do-inox`, também grafite — duas manchas escuras
 * seguidas, sem transição, contra o teto de fundos escuros do projeto.
 *
 * A escolha não foi só "clarear": ela usa **exatamente o `canvas-deep` do
 * `#diagnostico`**, com uma hairline no topo em vez de troca de tom. Assim a
 * ponte lê como o parágrafo final do capítulo de diagnóstico — uma continuação
 * separada por uma régua —, e não como uma segunda página branca empilhada na
 * primeira. A mudança tonal real fica para a fronteira seguinte, que é onde ela
 * significa alguma coisa: claro → escuro, entrando em `#industria-do-inox`.
 *
 * O `pt-0` é parte disso. A régua encosta na borda da seção, então o vão acima
 * dela é o `padding-bottom` do diagnóstico e o vão abaixo é o respiro do novo
 * trecho — a divisão de capítulo fica marcada por uma linha, não por um vazio.
 *
 * **`md:pt-0` não é redundante.** `space="sm"` entrega `py-12 md:py-16`, e o
 * `tailwind-merge` só resolve conflito **dentro da mesma variante**: um `pt-0`
 * sem breakpoint cancela o `py-12` da base e deixa o `md:py-16` de pé. Medido
 * antes da correção: em 1440 a régua caía 64px abaixo da borda e o vão entre o
 * último elemento do diagnóstico e a linha ia a 128px — o dobro do mobile, que
 * é onde a base valia. Ao sobrescrever padding vindo de `space`, declare a
 * variante junto.
 *
 * ============================================================
 * UMA IMAGEM, E POR QUE ESTA
 * ============================================================
 *
 * Eram três fotografias; passou a ser uma, subordinada ao texto. A escolha
 * evitou repetição de vizinhança: `cozinha-completa` abre `#projetos` em faixa
 * sangrada e reaparece em `#metodo`; `projeto-3d-recorte` e `forno-combinado`
 * também estão no Método; `bar-em-inox`, `linha-de-fogoes` e
 * `refrigeradores-verticais` já aparecem em `#projetos` ou nas zonas do
 * `#diagnostico`. `producao-panificacao` é a única fotografia de operação
 * instalada do acervo que **não aparece em nenhuma outra seção da home** — o alt
 * e a legenda são os de `src/data/differentials.ts`, sem atribuição de cliente,
 * local ou prazo.
 */
export function ScopeTriadBand() {
  return (
    <Section
      id="transicao"
      tone="canvas-deep"
      space="sm"
      bleed
      aria-labelledby="transicao-titulo"
      className="pt-0 pb-14 md:pt-0 md:pb-16 lg:pb-20"
    >
      <Container>
        <div className="border-t border-line pt-10 md:pt-12 lg:pt-14">
          <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-12">
            <Reveal className="lg:col-span-6">
              <Eyebrow>Do diagnóstico à instalação</Eyebrow>
              <Heading as={2} id="transicao-titulo" size="title-1" className="mt-4 max-w-[20ch]">
                Da leitura da operação à entrega em funcionamento.
              </Heading>

              {/*
                O arco inteiro numa frase. Os três termos ganham peso porque são
                o vocabulário do site (`scopeTriad`), não porque sejam etapas de
                um percurso numerado — ênfase tipográfica dentro de texto
                corrido é o oposto de um stepper, e é o teto desta seção.
              */}
              <p className="mt-5 max-w-[52ch] text-lead text-muted">
                O <strong className="font-semibold text-ink">diagnóstico</strong> encontra a
                prioridade, o <strong className="font-semibold text-ink">projeto</strong> orienta a
                decisão e a <strong className="font-semibold text-ink">implantação</strong> leva
                isso à operação.
              </p>

              {/*
                Transcrição de `src/data/solutions.ts` — a mesma frase que a
                faixa já publicava antes desta rodada. Responde à pergunta desta
                seção (preciso das três para contratar? não), e não à pergunta do
                Método (como o trabalho acontece).
              */}
              <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-muted">
                Cada etapa pode ser contratada por si. Quando vêm juntas, não há repasse de culpa
                entre projetista, fornecedor e instalador — é a mesma empresa do desenho ao
                comissionamento.
              </p>

              {/*
                `ArrowLink`, não botão preenchido: o diagnóstico acima fecha com
                o CTA primário "Solicitar diagnóstico", e um segundo botão cheio
                a 200px dele disputaria a mesma ação. Este leva para dentro da
                própria página.
              */}
              <ArrowLink href="#metodo" className="mt-6">
                Conhecer o método
              </ArrowLink>
            </Reveal>

            <Reveal variant="settle" className="lg:col-span-5 lg:col-start-8">
              <figure>
                {/*
                  ----------
                  R0-D (2026-08-12) — O CARD RESIDUAL ERA ESTE `bg-canvas` (S-15)
                  ----------

                  A caixa da fotografia carregava `bg-canvas` (#EFEDEB) dentro de
                  uma seção `canvas-deep` (#E6E3DE). Isso é, pela definição do
                  sistema (doc 01 §7.3), a construção de um **card**: superfície
                  própria, distinta da superfície da seção, com conteúdo dentro —
                  e era o único card que o inventário de 2026-08-10 achava na
                  home inteira fora de `#equipamentos`, `#projetos` e
                  `#diagnostico`. Numa faixa que foi reduzida de "segundo método"
                  a fecho editorial justamente para não ter cartão, sobrar a
                  superfície do cartão contradiz a redução.

                  **Removido, não substituído.** Nada entrou no lugar — nem
                  borda, nem régua, nem moldura, nem `bg` mais próximo do tom da
                  seção. A fotografia é `fill` + `object-cover`, então preenche a
                  caixa inteira e o fundo nunca aparecia depois do carregamento:
                  a composição renderizada é idêntica, e o que sai é a caixa.
                */}
                <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[5/4]">
                  <Image
                    src="/images/projects/producao-panificacao.jpg"
                    alt="Área de produção de panificação em operação, com fornos, carros de assadeiras e bancadas em aço inox"
                    fill
                    sizes="(max-width: 1023px) 92vw, 38vw"
                    quality={82}
                    className="object-cover"
                  />
                </div>
                {/* Keyline amarela: hairline decorativa, o único uso legítimo do amarelo em fundo claro. */}
                <figcaption className="mt-3 border-l-2 border-yellow pl-3 text-caption text-muted">
                  Operação de panificação em produção — registro do acervo Bianchini.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
