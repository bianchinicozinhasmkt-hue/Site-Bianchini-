import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { InstagramIcon } from '@/components/ui/icons'
import { BookCover } from '@/components/ui/book-cover'
import { leadershipTeam } from '@/data/team'
import { book } from '@/data/leonardo'
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
 * O LIVRO MORA AQUI (consolidação de 2026-08-04)
 * ============================================================
 *
 * O livro era um cartão próprio no fim de `credibility-section.tsx`, a ~6.000px
 * de distância do único lugar da home onde Leonardo é apresentado — lia como
 * anúncio de produto encaixado entre depoimentos e o CTA final, e repetia a
 * credencial "autor de…" que já estava nos bullets dele. Agora é um bloco
 * dentro do dossiê de Leonardo: capa real em tamanho legível, e o texto que
 * entra não é a sinopse comercial, é `book.relation` — a ponte entre o método
 * do livro e o método que a Bianchini aplica. É isso que o transforma de
 * produto em **prova de método publicado**.
 *
 * `id="livro"` continua existindo, agora aqui: é destino de `#livro`
 * (`leonardo-section.tsx`) e de `/#livro` (`data/industry.ts`). Mover o bloco
 * sem mover a âncora quebraria os dois links.
 *
 * `book.purchaseUrl` segue `null` e **nenhum CTA de compra é renderizado** —
 * não há link oficial confirmado. Ver `src/data/leonardo.ts`.
 */
export function LeadershipSection() {
  return (
    <Section
      id="quem-conduz"
      tone="graphite"
      space="default"
      bleed
      aria-labelledby="quem-conduz-titulo"
      className="relative isolate overflow-hidden"
    >
      <Container>
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
          <p className="text-lead text-canvas/70 lg:col-span-4 lg:col-start-9">
            Projetos e equipamentos de um lado, operação comercial do outro — as três frentes
            respondem a duas pessoas, não a um organograma.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-14 border-t border-white/12 pt-12 lg:mt-16 lg:gap-20 lg:pt-16">
          {people.map((person, index) => {
            /* Espelhamento: Leonardo com a figura à esquerda, Guilherme à direita. */
            const mirrored = index % 2 === 1

            return (
              <Reveal key={person.id} variant="settle">
                <article className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
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
                        Livro — só no dossiê de Leonardo, como prova de método
                        publicado. Sem CTA de compra: `book.purchaseUrl` é nulo.
                        ========================================================== */}
                    {person.id === 'leonardo' ? (
                      <div
                        id="livro"
                        className="mt-8 scroll-mt-[calc(var(--header-height)+1rem)] border-t border-white/12 pt-8"
                      >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                          <BookCover className="mx-auto w-[9.5rem] shrink-0 sm:mx-0 lg:w-[11rem]" />

                          <div className="min-w-0 flex-1">
                            <p className="font-condensed text-eyebrow font-semibold uppercase tracking-[0.11em] text-yellow">
                              {book.eyebrow}
                            </p>
                            <h4 className="mt-3 max-w-[28ch] font-sans font-bold text-title-3 text-canvas">
                              {book.headline}
                            </h4>
                            <p className="mt-3 max-w-[54ch] text-body-sm text-canvas/70">
                              {book.relation}
                            </p>
                            {/*
                              Só o selo. A linha anterior repetia `book.title`
                              inteiro — que já se lê na capa, ao lado — em
                              condensada caixa-alta a 55% de opacidade: três
                              linhas de texto pouco legível dizendo o que a
                              imagem já dizia. O título continua no `alt` da
                              capa (`BookCover`), então segue disponível para
                              leitor de tela e para indexação.
                            */}
                            <p className="mt-4 border-t border-white/12 pt-3 font-condensed text-caption font-semibold uppercase tracking-[0.07em] text-canvas/70">
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
