import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { ArrowLink, LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { pillars } from '@/data/pillars'
import { cn } from '@/lib/utils'

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
 * Agora cada frente é contratável por conta própria: pergunta do cliente → o
 * que a Bianchini entrega → ação.
 *
 * ============================================================
 * A COMPOSIÇÃO FOI REFEITA (2026-08-09b) — TRÊS PORTAS, UMA COMPOSIÇÃO
 * ============================================================
 *
 * O conteúdo estava certo e a **apresentação** não: a seção era três cartões
 * numerados dentro de uma moldura compartilhada, com fundo próprio, hover de
 * fundo e 797px de altura em 1440. Lia como grade de planos de SaaS, não como
 * a página de uma empresa de engenharia de cozinha. O que a produzia:
 *
 *  1. **Caixa.** Moldura externa, `gap-px` desenhando divisórias em cruz e
 *     `bg-surface` por item sobre `canvas` — três retângulos preenchidos, lado
 *     a lado, com padding interno de 36px. É o desenho de um cartão.
 *  2. **Numeração.** `01 / 02 / 03` em três portas que **não são uma
 *     sequência**: ninguém contrata Equipamentos "antes" de Consultoria. O
 *     número afirmava uma ordem operacional inexistente.
 *  3. **Texto demais.** Etiqueta de situação + título + pergunta + descrição
 *     longa, com a descrição repetindo a lista de categorias (que a seção de
 *     Equipamentos publica duas seções acima) e a lista de plantas
 *     complementares (que `/solucoes/arquitetura` publica inteira).
 *
 * ------------------------------------------------------------
 * O QUE SUBSTITUIU
 * ------------------------------------------------------------
 *
 * Uma **composição editorial de três colunas**, sem nenhum retângulo: os três
 * blocos correm direto sobre o `canvas` da seção, cada um aberto por uma
 * keyline horizontal na mesma linha, e alinhados por baixo pela ação (`mt-auto`
 * sobre a linha da grade). O que separa uma frente da outra é **espaço,
 * keyline e alinhamento** — não borda, não fundo, não sombra, não radius.
 *
 * Não há divisória vertical entre as colunas de propósito: keyline horizontal
 * compartilhada **mais** régua vertical é exatamente o desenho de uma tabela,
 * que era metade da queixa. A keyline sozinha lê como índice de jornal.
 *
 * No telefone a mesma keyline vira o separador entre as frentes — o mecanismo
 * é um só nos dois breakpoints, e nenhum item ganha caixa, fundo ou padding
 * próprio ao empilhar.
 *
 * ------------------------------------------------------------
 * REGRA REGISTRADA NESTA RODADA
 * ------------------------------------------------------------
 *
 * **Número só quando existe sequência real, ordem operacional ou progressão.**
 * Método (`journey-section`) e níveis de atuação (`scope-section`) são
 * sequências e continuam numerados; três portas paralelas não são, e perderam
 * o índice. E não se troca número por ornamento equivalente: nenhum selo,
 * ícone, badge ou marcador entrou no lugar do `01/02/03`. Registro permanente
 * em `docs/v2/DESIGN_SYSTEM.md` §1 e em `src/data/pillars.ts`.
 *
 * ============================================================
 * PESO ASSIMÉTRICO — SEM DEFORMAR A GRADE
 * ============================================================
 *
 * DEC-001 pede Equipamentos com peso maior quando os três aparecem juntos.
 * Aqui isso é **posição** (primeira coluna), **keyline** (2px grafite contra
 * 2px `line` nas outras duas) e **preenchimento do CTA** (botão primário
 * amarelo contra `ArrowLink` editorial). Nenhuma coluna fica mais larga: as
 * três dividem a linha em partes iguais, porque Projetos e Consultoria são
 * portas igualmente legítimas — uma coluna maior faria delas apêndices.
 *
 * A keyline de destaque é **grafite, não amarela**: ela é marcador com
 * significado (aponta a frente prioritária) em fundo claro, e a regra do
 * amarelo (`CLAUDE.md`) reserva o amarelo, em superfície clara, para
 * preenchimento e hairline decorativa. Por isso as três keylines têm a mesma
 * espessura (2px) — o que muda é só o valor tonal, e a diferença de espessura
 * desalinharia os três títulos em 1px.
 *
 * O amarelo aparece **uma vez** na seção: o preenchimento do CTA de
 * Equipamentos. É preenchimento de botão, não texto nem indicador de estado.
 *
 * ============================================================
 * CABEÇALHO — UMA MASSA, NÃO DUAS PONTAS
 * ============================================================
 *
 * O título ocupava as colunas 1–7 e o parágrafo começava na coluna 9: em 1440
 * isso punha o parágrafo a 906px da margem, com um vazio de ~450px entre o fim
 * da linha mais longa do título e o começo dele — duas massas nos extremos da
 * tela, não um cabeçalho. Agora o título ocupa 1–5 e o parágrafo 6–11.
 *
 * A coluna do título encolheu **sem** mudar onde o título quebra: `max-w-[24ch]`
 * resolve para ~450px e continua sendo o limite efetivo dentro dos 526px de
 * cinco colunas. As três linhas são as mesmas; o que se move é o parágrafo, que
 * sobe de 906px para 567px e passa a encostar na calha da grade.
 *
 * ============================================================
 * RITMO — O PADDING DESTA SEÇÃO É DAS DUAS TRANSIÇÕES
 * ============================================================
 *
 * `#pilares` fica entre `#projetos` (claro) e `#sintomas` (grafite), e o padding
 * dela é metade de cada transição. Por isso ele é **assimétrico e declarado
 * aqui**, em vez de herdado de `space`:
 *
 *  · **topo (64px em lg).** A borda com `#projetos` é claro→claro: a mudança de
 *    tom (`surface` → `canvas`) é sutil e o vão somava 144px com a base de
 *    Projetos — uma tela vazia entre o botão "Ver todos os projetos" e a
 *    etiqueta desta seção. A outra metade foi cortada na Home, em `page.tsx`.
 *  · **base (56px em lg).** A borda com `#sintomas` é claro→grafite, o corte
 *    tonal mais forte da página inteira. Ele **é** a transição; a área clara
 *    antes dele só precisa da pausa, não de uma respiração inteira.
 */
export function PillarsSection() {
  return (
    <Section
      id="pilares"
      tone="canvas"
      space="sm"
      className="md:py-14 lg:pt-16 lg:pb-14"
      bleed
      aria-labelledby="pilares-titulo"
    >
      <Container>
        {/*
          ----------
          O CABEÇALHO PERDEU O VÃO CENTRAL (2026-08-11)
          ----------

          Título nas colunas 1–5 e parágrafo em 6–11 punha, em 1440, o fim da
          linha mais longa do título em x=450 e o começo do parágrafo em x=625:
          175px de nada no meio de um cabeçalho, com as duas massas alinhadas
          pela base e sem nada as ligando. Lia como duas colunas de um documento,
          não como uma abertura.

          Agora o parágrafo entra em 7–12 e é **alinhado ao topo** do bloco do
          título, com uma régua curta sobre ele: as duas massas passam a partir
          da mesma linha horizontal, e é essa linha compartilhada — não a
          proximidade — que as faz ler como um cabeçalho só.
        */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-6">
            <Eyebrow>As três frentes</Eyebrow>
            <Heading as={2} id="pilares-titulo" size="title-1" className="mt-4 max-w-[22ch]">
              Equipamentos, projetos e consultoria — separados ou juntos
            </Heading>
          </div>

          {/*
            A frase que resolve a objeção do visitante de alta intenção: ele não
            precisa comprar a narrativa inteira para agir na frente que veio
            resolver. "Sem repasse de culpa entre projetista, fornecedor e
            instalador" é transcrição de `src/data/solutions.ts`.

            ----------
            COLUNAS 7–12, E ALINHADO PELA BASE (2026-08-11)
            ----------

            Era 6–11: o parágrafo começava em x=625 e terminava em x=1245,
            deixando **155px de sobra à direita** enquanto o vão no meio do
            cabeçalho já era grande. A massa ficava suspensa entre as duas
            margens, sem encostar em nenhuma.

            Em 7–12 ele fecha na margem direita do container — a mesma em que a
            terceira coluna de frentes fecha, logo abaixo. O cabeçalho passa a
            ter as duas âncoras que um cabeçalho precisa: título na guia da
            esquerda, apoio na guia da direita.

            `items-end` (e não `start`): as duas massas fecham na mesma linha de
            base, e é ela que as faz ler como um cabeçalho só em vez de duas
            colunas de documento. Alinhadas pelo topo, o parágrafo — três linhas
            contra as três muito maiores do título — sobrava alto e o vão entre
            elas virava o assunto.
          */}
          {/*
            ----------
            R0-D (2026-08-12) — A ORAÇÃO DO MEIO SAIU POR SER LITERAL EM OUTRA SEÇÃO
            ----------

            "Juntas, não há repasse de culpa entre projetista, fornecedor e
            instalador" é **a mesma frase**, palavra por palavra, que
            `#transicao` publica 2.650px abaixo (`scope-triad-band.tsx`, segundo
            parágrafo) — as duas transcrevendo `src/data/solutions.ts`. Uma
            varredura do texto renderizado da home pegava a oração duas vezes.

            Quem cede é esta, não a de `#transicao`: lá a frase **é** o conteúdo
            do fecho de capítulo (a seção tem 3 blocos e o blueprint a chama de
            exemplo correto de densidade); aqui ela era o meio de um apoio de
            três orações, entre duas que dizem o essencial. O que sobra é o par
            que a seção precisa dizer e mais nada: cada frente sozinha, e a
            integração como vantagem — que é a função narrativa da seção
            (DEC-003, "integrar é opção, não condição").
          */}
          <p className="text-lead text-muted lg:col-span-6 lg:col-start-7">
            Cada frente resolve um problema por conta própria. Integrar é uma vantagem, não uma
            condição para começar.
          </p>
        </div>

        {/*
          `ul`, não `ol`: a lista deixou de ser ordenada quando a numeração saiu,
          e por isso mesmo — três portas paralelas não têm primeira nem terceira.
          A ordem visual é hierarquia comercial (DEC-001), não sequência.

          `as="li"` no `Reveal` — o item da grade precisa ser o próprio `li`, não
          um `div` com o `li` dentro: além da semântica, é o item da grade que
          recebe a altura da linha, e um wrapper intermediário quebraria o
          `mt-auto` que alinha as três ações pela base.

          `gap-y-9` no telefone é a única separação entre as frentes empilhadas
          (mais a keyline de cada uma); em `lg` ele zera e sobra só o `gap-x-10`,
          a calha entre as colunas.
        */}
        {/* ==========================================================
            A HIERARQUIA DENTRO DA COLUNA FOI INVERTIDA (2026-08-11)
            ==========================================================

            **O diagnóstico.** A seção estava correta de conteúdo e lida como
            documento impresso. O que a produzia não era a falta de moldura — era
            a **ausência de contraste de escala**: nome em 24px, pergunta em 16px
            e resposta em 15px, três degraus quase iguais, três vezes, sobre
            fundo liso e sem uma única imagem. Numa página em que todas as outras
            seções são fotográficas, a única inteiramente tipográfica precisa
            resolver a presença na tipografia, e ela não estava resolvendo.

            **A inversão.** O nome da frente vira **rótulo** — condensada
            caixa-alta, 13px, que é exatamente o papel que `CLAUDE.md` reserva
            para a condensada (rótulo comercial curto) e exatamente a forma que a
            mesma palavra tem nas três portas da primeira dobra. A **pergunta do
            cliente** vira o título da coluna, em sans a ~26px. E a resposta fica
            onde estava, pequena e em `muted`.

            Três ganhos, e nenhum deles é ornamento:

              1. **escala.** O degrau entre o maior e o menor texto da coluna
                 passa de 24→15 (1,6×) para 26→15 (1,73×) **com o topo mudando de
                 natureza**: o que domina agora é uma frase, não uma palavra. Uma
                 coluna cuja maior massa é uma pergunta lê como argumento; uma
                 cujo maior elemento é um substantivo lê como verbete;
              2. **rima com a primeira dobra.** "EQUIPAMENTOS · Comprar,
                 substituir ou especificar" na porta da hero e "EQUIPAMENTOS ·
                 Qual equipamento a minha operação precisa…" aqui são a mesma
                 gramática. Quem escolheu uma porta lá em cima reencontra o
                 mesmo objeto aqui — que é a coerência entre sistemas que faltava;
              3. **comercial.** A pergunta é o que o visitante reconhece como
                 sendo o problema *dele*. Ela estava em terceiro plano.

            **O que não entrou:** nenhuma caixa, nenhum fundo por item, nenhum
            número (três portas paralelas não são sequência — regra registrada em
            `docs/v2/DESIGN_SYSTEM.md` §1), nenhum ícone e nenhuma fotografia. A
            seção continua sendo três colunas abertas sobre o fundo da seção.
            ========================================================== */}
        <ul className="mt-10 grid gap-y-10 lg:mt-14 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0">
          {pillars.map((pillar, index) => {
            const priority = index === 0

            return (
              <Reveal
                key={pillar.title}
                as="li"
                delay={index * 90}
                className={cn(
                  'flex h-full flex-col',
                  /*
                    A régua de prioridade passa de 2/2px para **3px grafite
                    contra 1px `line`**. Com as duas em 2px o que distinguia a
                    frente prioritária era só o valor tonal, e a 2px sobre
                    `surface` essa diferença some a dois metros da tela. Em 3
                    contra 1 a hierarquia se lê de longe e continua sendo
                    grafite — marcador com significado em fundo claro nunca é
                    amarelo (`CLAUDE.md`).

                    ----------
                    O RECUO COMPENSA A ESPESSURA — medido, não deduzido
                    ----------

                    `border-top` faz parte da caixa (`box-sizing: border-box`
                    é global aqui), então régua mais grossa empurra o conteúdo
                    para baixo: com `pt-5` nos três, o rótulo de Equipamentos
                    assentava **2px abaixo** dos outros dois. Dois pixels são
                    invisíveis isolados e perfeitamente visíveis quando três
                    rótulos idênticos estão lado a lado — foi o que a captura
                    pegou (y=319 contra 317).

                    O recuo passa a ser o complemento da régua para o mesmo
                    total de 21px: 18 + 3 na prioritária, 20 + 1 nas outras
                    duas. Se a espessura de qualquer uma das duas mudar, este
                    par tem de ser remedido junto.
                  */
                  priority
                    ? 'border-t-[3px] border-ink pt-[1.125rem]'
                    : 'border-t border-line pt-5',
                )}
              >
                {/*
                  O nome da frente como rótulo — a mesma forma que ele tem nas
                  três portas da primeira dobra. `text-ink`, não amarelo: em
                  superfície clara o amarelo só entra como preenchimento ou
                  hairline decorativa, e este é um rótulo com significado.
                */}
                <p className="font-condensed text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink">
                  {pillar.title}
                </p>

                {/*
                  A pergunta do cliente é o título da coluna.

                  `h3` mantém a hierarquia de documento (a seção tem um `h2`, e
                  cada frente continua sendo um nível abaixo dele) — o que mudou
                  foi qual texto ocupa o nível, não a estrutura. O nome da frente
                  continua sendo o primeiro texto lido em cada coluna, então nem
                  a leitura visual nem a de leitor de tela perde a etiqueta.

                  `max-w-prose` é medida de leitura, não composição: em `lg` a
                  coluna tem 413px e o limite nunca pega. Ele existe para a faixa
                  de 640 a 1023px, onde as três frentes ainda estão empilhadas e
                  a linha usaria os 704px inteiros do container — ~94 caracteres.
                */}
                <h3 className="mt-3 max-w-prose font-sans text-[1.375rem] font-bold leading-[1.24] tracking-[-0.014em] text-ink lg:text-[1.625rem]">
                  {pillar.question}
                </h3>

                <p className="mt-4 max-w-prose text-body-sm text-muted">{pillar.description}</p>

                {/*
                  `mt-auto`: as três ações ficam na mesma linha de base mesmo com
                  respostas de comprimentos diferentes — é ela que faz as três
                  colunas lerem como uma composição só, agora que não há mais
                  moldura desenhando esse alinhamento.
                */}
                <div className="mt-auto pt-6 lg:pt-8">
                  {priority ? (
                    <LinkButton href={pillar.cta.href} variant="primary" size="md" withArrow>
                      {pillar.cta.label}
                    </LinkButton>
                  ) : (
                    <ArrowLink href={pillar.cta.href}>{pillar.cta.label}</ArrowLink>
                  )}
                </div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
