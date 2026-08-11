import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { InstagramIcon } from '@/components/ui/icons'
import { BookCover } from '@/components/ui/book-cover'
import { book } from '@/data/leonardo'
import { leadershipTeam } from '@/data/team'
import { cn } from '@/lib/utils'

const people = [
  { id: 'leonardo', ...leadershipTeam.leonardo },
  { id: 'guilherme', ...leadershipTeam.guilherme },
] as const

/**
 * Quem conduz — a principal prova de autoridade da home, e a seção que fecha o
 * que os pilares abrem: lá são nomeadas as frentes e a distribuição de
 * responsabilidade (`pillars-section.tsx`); aqui as duas pessoas ganham rosto,
 * credencial e, no caso de Leonardo, obra publicada.
 *
 * ============================================================
 * O QUE QUEBROU NA VERSÃO ANTERIOR (e o que mudou em 2026-08-04)
 * ============================================================
 *
 * A versão anterior punha os dois recortes lado a lado numa grade de duas
 * colunas, cada um numa caixa de `max-w-[16rem]`, com o texto **abaixo** da
 * figura. O resultado, medido na captura de 1440×900
 * (`screenshots/_round1/`): a seção abria com ~70px de título e depois ~450px
 * de grafite quase vazio, com duas figuras pequenas flutuando no meio e os
 * nomes empurrados para fora da dobra. Três defeitos somados:
 *
 *  1. **recorte flutuando** — um PNG com fundo removido, sem nada por baixo,
 *     não tem onde "pousar": lia como figura colada, não como retrato;
 *  2. **espaço morto** — a largura da coluna era ditada pelo texto, a altura
 *     pela figura, e sobrava vão em todas as direções;
 *  3. **hierarquia invertida** — o nome, que é a informação da seção, ficava
 *     depois de 450px de imagem.
 *
 * Agora cada pessoa é uma **faixa editorial** de figura + dossiê, e as duas
 * faixas são espelhadas (figura à esquerda em Leonardo, à direita em
 * Guilherme). O espelhamento não é enfeite: é o que faz a segunda faixa não
 * ser a repetição literal da primeira, e é onde o vão morto da versão anterior
 * foi absorvido.
 *
 *   · **Pedestal, não recorte solto.** A figura fica dentro de um painel com
 *     gradiente vertical sutil, fio superior e régua amarela na base, e
 *     `object-bottom` — a pessoa apoia sobre a régua em vez de pairar. É a
 *     mesma ideia do halo da versão anterior, mas com uma base: profundidade
 *     por luz *e* por apoio, sem sombra dura e sem segunda fotografia.
 *   · **Altura fixa do pedestal** (`h-[22rem]` → `lg:h-[30rem]`), não altura
 *     ditada pela imagem: as duas faixas ficam com o mesmo peso visual mesmo
 *     com PNGs de proporções diferentes (900×1528 e 1024×1536).
 *   · **Nome antes da imagem na leitura do desktop** — o dossiê começa no topo
 *     da faixa, alinhado ao topo do pedestal.
 *
 * ============================================================
 * ESTA SEÇÃO RESPONDE UMA PERGUNTA SÓ (2026-08-10)
 * ============================================================
 *
 * "Com quem eu estou contratando?" — e nada além disso. O livro, que morou aqui
 * entre 2026-08-04 e 2026-08-10, mudou para `#leonardo` junto com a âncora
 * `id="livro"`; a justificativa está no comentário que ficou no lugar dele,
 * dentro do dossiê. Aqui o efeito é duplo: a seção deixou de carregar prova de
 * autoria, que não é a pergunta dela, e os dois dossiês passaram a ter peso
 * equivalente.
 *
 * A seção também **não carrega prova institucional**: números, marcas e
 * depoimentos são de `#credibilidade`, que vem imediatamente depois desde a
 * reordenação de 2026-08-10. Se algum número voltar a entrar aqui, ele vai
 * competir com a seção seguinte — foi assim que "17 anos" acabou colidindo com
 * os "18 anos" de `#credibilidade` (pendência registrada, não resolvida).
 *
 * Os **dois retratos ficam**. Esta é a seção do par, e a paridade entre
 * Leonardo e Guilherme depende de os dois aparecerem com o mesmo tratamento —
 * mesmo pedestal, mesma altura, mesma régua amarela na base. É por isso que o
 * retrato que saiu foi o de `#leonardo`, e não um dos daqui.
 */
export function LeadershipSection() {
  return (
    <Section
      id="quem-conduz"
      tone="graphite"
      space="default"
      bleed
      aria-labelledby="quem-conduz-titulo"
      /*
        ----------
        `pt` REDUZIDO EM 2026-08-10 — a segunda parte do capítulo de autoridade
        ----------

        Ver o bloco equivalente em `leonardo-section.tsx`. Com `#credibilidade`
        movida para depois desta seção, `#leonardo` e `#quem-conduz` ficaram
        adjacentes e as duas são grafite: o encontro precisa ler como um capítulo
        em duas partes, não como duas telas empilhadas. Metade do vão veio de lá,
        metade daqui, e a régua abaixo marca a divisão sem introduzir superfície
        nova. Nada do conteúdo desta seção mudou.
        ----------
      */
      className="relative isolate overflow-hidden pt-8 md:pt-10 lg:pt-10"
    >
      <Container>
        {/*
          A régua do capítulo. `border-white/12` é a mesma hairline sobre grafite
          que esta seção já usa no selo do livro — divisor do sistema, não
          elemento novo.

          A margem inferior é menor que o vão acima da régua (48px contra 80px
          em desktop) de propósito: a linha fica mais perto do que ela abre do
          que do que ela fecha, e por isso lê como cabeçalho da segunda parte do
          capítulo. Somada ao `pb` reduzido de `#leonardo`, ela **cabe dentro**
          do vão que já existia — o encontro encolheu de 160px para 128px em vez
          de crescer.
        */}
        <hr aria-hidden="true" className="mb-9 border-0 border-t border-white/12 md:mb-10 lg:mb-12" />

        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow tone="light">Quem conduz</Eyebrow>
            <Heading as={2} id="quem-conduz-titulo" size="title-1" className="mt-5 text-canvas">
              Os dois responsáveis pela sua operação
            </Heading>
          </div>

          {/*
            Enunciado derivado do que já está em `pillars.ts` e `team.ts` — não
            é credencial nova. Existe para a seção não abrir com um título
            solto sobre 400px de grafite, que era parte do vazio anterior.
          */}
          {/*
            Ajuste de uma frase em 2026-08-09, por consistência factual e não
            por edição de estilo: "as três frentes" nomeava projetos,
            equipamentos e **operação comercial**, enquanto a seção "As três
            frentes" (`pillars-section.tsx`) passou a nomear equipamentos,
            projetos e **consultoria**. A mesma página contava duas trincas
            diferentes. Aqui a contagem sai — o que a seção precisa dizer é que
            se fala com quem responde, não quantas frentes existem. A divisão
            de responsabilidade entre as duas pessoas continua íntegra e vem de
            `src/data/team.ts`.
          */}
          <p className="text-lead text-canvas/70 lg:col-span-4 lg:col-start-9">
            Projetos e equipamentos de um lado, operação comercial do outro — você fala com quem
            responde pela frente que contratou, não com um organograma.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-14 border-t border-white/12 pt-12 lg:mt-16 lg:gap-20 lg:pt-16">
          {people.map((person, index) => {
            /* Espelhamento: Leonardo com a figura à esquerda, Guilherme à direita. */
            const mirrored = index % 2 === 1

            return (
              <Reveal key={person.id} variant="settle">
                {/*
                  `lg:items-center`, não `items-start` (2026-08-10). O dossiê era
                  alinhado ao topo do pedestal porque, com o bloco do livro
                  dentro, a coluna de Leonardo preenchia os 480px da figura. Sem
                  o livro ela mede 195px, e o alinhamento ao topo despejava ~288px
                  de grafite morto sob os bullets — a coluna lia como truncada.
                  Guilherme já tinha ~200px do mesmo defeito antes desta rodada.

                  Centrado, o vão se distribui acima e abaixo do dossiê e a
                  coluna lê como composição contra o retrato. É só alinhamento:
                  nenhum conteúdo foi criado para encher a coluna, e no telefone
                  (empilhado) nada muda, porque a classe é `lg:`.
                */}
                <article className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                  {/* ---------- Pedestal: a figura apoiada, não flutuando ---------- */}
                  <div
                    className={cn(
                      'lg:col-span-5',
                      mirrored ? 'lg:order-2 lg:col-start-8' : 'lg:order-1',
                    )}
                  >
                    <div className="relative h-[22rem] w-full overflow-hidden sm:h-[26rem] lg:h-[30rem]">
                      {/*
                        Superfície do pedestal numa camada própria, com máscara
                        horizontal: aplicada direto no contêiner, ela desenhava
                        um retângulo cinza de arestas retas sobre o grafite — o
                        mesmo defeito de "placa com borda visível" já corrigido
                        em `leonardo-section.tsx`. Mascarada, a superfície morre
                        antes das laterais e o que se vê é variação de luz.
                      */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%)] [mask-image:linear-gradient(90deg,transparent_0%,black_14%,black_86%,transparent_100%)]"
                      />
                      {/* Halo — a luz que separa a figura do grafite. */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(245,198,75,0.13),transparent_62%)]"
                      />
                      <Image
                        src={person.portrait.src}
                        alt={person.portrait.alt}
                        fill
                        sizes="(max-width: 1023px) 92vw, 38vw"
                        quality={84}
                        className="object-contain object-bottom"
                      />
                    </div>
                    {/*
                      Régua de apoio — a base sobre a qual a figura se assenta.
                      É o único elemento do pedestal com aresta plena: a
                      superfície some nas laterais, a régua não, e é ela que
                      dá o "chão".
                    */}
                    <div aria-hidden="true" className="h-[3px] w-full bg-yellow" />
                  </div>

                  {/* ---------- Dossiê ---------- */}
                  <div
                    className={cn(
                      'lg:col-span-6',
                      mirrored ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-7',
                    )}
                  >
                    <h3 className="font-sans font-bold text-title-2 text-canvas">{person.name}</h3>

                    {/*
                      Papel + Instagram na mesma linha de identidade — assinatura
                      de perfil, não um link solto depois das credenciais. O
                      handle é o texto (não "Instagram de Leonardo"): já está no
                      bloco dele, repetir o nome no rótulo era redundante.
                    */}
                    {/*
                      `gap-y-0`: o link do Instagram passou a trazer 44px de
                      caixa própria, e o `gap-y-1.5` antigo somava a ela. O
                      cargo continua sendo texto — quem cresceu foi só o alvo.
                    */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0">
                      <p className="font-condensed text-caption font-semibold uppercase tracking-[0.09em] text-yellow">
                        {person.role}
                      </p>
                      {'instagram' in person && person.instagram ? (
                        <a
                          href={person.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[2.75rem] w-fit items-center gap-1.5 py-2 text-caption font-medium text-canvas/60 transition-colors duration-200 hover:text-yellow"
                        >
                          <InstagramIcon size={14} />
                          {'instagramHandle' in person ? person.instagramHandle : 'Instagram'}
                          <span className="sr-only"> (abre em nova aba)</span>
                        </a>
                      ) : null}
                    </div>

                    {'opening' in person && person.opening ? (
                      <p className="mt-5 max-w-[38ch] text-lead font-medium text-canvas">
                        {person.opening}
                      </p>
                    ) : null}

                    {/* Credenciais — grade compacta, não lista corrida. */}
                    <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      {person.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-body-sm leading-snug text-canvas/75"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.5em] h-[2px] w-2.5 shrink-0 bg-yellow/70"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {/* ==========================================================
                        O LIVRO VOLTA PARA O DOSSIÊ DE LEONARDO (2026-08-11)
                        ==========================================================

                        Ele morou aqui até 2026-08-10, mudou para `#leonardo` e
                        volta agora — a pedido explícito do gestor ("fazer a
                        referência ao livro acontecer junto à foto principal do
                        Leonardo, de forma coerente e integrada") e porque a
                        composição confirma o pedido.

                        **O que a mudança de 2026-08-10 acertou e o que ela não
                        previu.** Ela acertou o diagnóstico de desequilíbrio: com
                        o bloco antigo — capa de 160px, `eyebrow`, `headline`,
                        `relation` e selo empilhados — o artigo de Leonardo media
                        1.260px contra 737 de Guilherme em 390px de largura. Só
                        que a solução foi mover, e mover criou dois defeitos
                        novos: em `#leonardo` o livro virou objeto solto numa
                        coluna própria, sem relação visual com nada, e o dossiê
                        daqui ficou com ~288px de grafite morto sob os bullets —
                        quatro linhas de credencial ao lado de um retrato de
                        480px.

                        **A forma é que estava errada, não o lugar.** O que volta
                        não é o bloco antigo: é uma **linha de credencial**
                        — capa pequena à esquerda, `relation` e selo à direita,
                        aberta por hairline. Sem `eyebrow` ("Autor e especialista
                        do setor" repete o que o cargo e os bullets já dizem) e
                        sem `headline` (o argumento de tese vive em `#leonardo`,
                        que é a seção da tese). Medido, o acréscimo é de ~190px
                        no artigo de Leonardo em 390px, contra os 540 do bloco
                        antigo — e ele cai exatamente no vazio que já existia,
                        então o desequilíbrio corrigido em 2026-08-10 não volta.

                        `book.purchaseUrl` continua `null` e **nenhum CTA de
                        compra é renderizado** — a regra de `CLAUDE.md` não muda.
                        ========================================================== */}
                    {/*
                      `id` no `div`, não no `Reveal`: o primitive não expõe `id`,
                      e pôr a âncora dentro dele deixaria o alvo do link sujeito
                      ao estado de revelação. O `scroll-mt` compensa o cabeçalho
                      fixo.
                    */}
                    {person.id === 'leonardo' ? (
                      <div
                        id="livro"
                        className="mt-7 scroll-mt-[calc(var(--header-height)+1rem)] border-t border-white/15 pt-6"
                      >
                        <div className="flex items-start gap-5">
                          <BookCover className="w-[5.5rem] shrink-0 sm:w-[6.25rem]" />

                          <div className="min-w-0 flex-1">
                            <p className="max-w-[46ch] text-body-sm leading-relaxed text-canvas/75">
                              {book.relation}
                            </p>
                            {/*
                              Só o selo. O título do livro se lê na capa, ao
                              lado, e continua no `alt` dela (`BookCover`) para
                              leitor de tela e indexação.
                            */}
                            <p className="mt-3 font-condensed text-caption font-semibold uppercase tracking-[0.07em] text-yellow">
                              {book.seal}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
