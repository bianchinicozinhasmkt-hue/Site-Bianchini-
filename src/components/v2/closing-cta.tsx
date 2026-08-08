import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { ArrowRightIcon } from '@/components/ui/icons'
import { homeFinalCta } from '@/data/v2/home'
import { whatsappUrl } from '@/lib/whatsapp'
import { contact } from '@/data/site'

/**
 * ============================================================
 * FECHAMENTO CLARO — O RESPIRO ANTES DO RODAPÉ
 * ============================================================
 *
 * ============================================================
 * O QUE ESTAVA ERRADO
 * ============================================================
 *
 * A home terminava em **três blocos escuros encostados**:
 *
 *   quem conduz (graphite) → CTA final (graphite) → rodapé (graphite)
 *
 * Medido em 1440 × 900: 666 + 693 + 640px, quase 2.000px sem uma única
 * mudança de valor. O rodapé não *chegava* — ele continuava a seção anterior,
 * e a única coisa que o anunciava era a mudança do conteúdo.
 *
 * Havia um segundo defeito, menos óbvio e mais grave: o `FinalCtaSection` da
 * V1 fecha a página com **a geometria que abria a V1** — painel fotográfico
 * diagonal à direita, keyline amarela, na inclinação medida do mockup. Isso
 * fazia sentido enquanto a primeira dobra era a diagonal: era a outra ponta do
 * arco, e o próprio comentário do componente diz isso. A primeira dobra da V2
 * não tem diagonal nenhuma — é um palco retangular de sangria. A diagonal do
 * fim virou a rima de um verso que não existe mais: uma aresta amarela cortando
 * a última tela, sem nada na página que a explique.
 *
 * ============================================================
 * A CORREÇÃO
 * ============================================================
 *
 * Este bloco substitui aquele **só na home**. `FinalCtaSection` continua
 * intacto e continua montado nas nove rotas internas que o usam
 * (`/sobre`, `/solucoes/*`, `/projetos`, `/linhas-de-produtos`,
 * `/leonardo-bianchini`): lá a diagonal ainda rima com o `PageHero`, e mexer
 * nelas seria alterar a V1 fora do escopo.
 *
 * O fechamento é **claro**, e é essa a função principal dele. A sequência
 * passa a ser:
 *
 *   quem conduz (graphite) → fechamento (canvas) → rodapé (graphite)
 *
 * escuro → branco → escuro. O rodapé ganha entrada deliberada, a página ganha
 * ar antes de acabar e o último argumento comercial é lido sobre superfície
 * clara, que é onde texto longo se lê melhor.
 *
 * ============================================================
 * COMPOSIÇÃO
 * ============================================================
 *
 * Doze colunas, e a assimetria é o ponto: o argumento ocupa as cinco primeiras
 * e **a fotografia sangra até a borda direita da janela**, rompendo o
 * container. Não é um cartão de imagem ao lado de um cartão de texto — é uma
 * coluna editorial contra um plano fotográfico que sai da tela.
 *
 * Sem grade de cartões, sem ícone, sem selo, sem número novo. As únicas
 * afirmações são `contact.responseTime`, `contact.hours` e `contact.coverage`,
 * que já são publicadas hoje no rodapé e no CTA da V1.
 *
 * ============================================================
 * UM CTA, E DOIS CAMINHOS QUE NÃO COMPETEM COM ELE
 * ============================================================
 *
 * Ação preenchida: **Equipamentos** — a frente comercial principal
 * (`docs/v2/DECISIONS.md`, DEC-001). Projetos e Consultoria continuam nomeados
 * logo abaixo, em texto, porque são portas de entrada legítimas e independentes
 * (DEC-002) — mas em forma de link, não de botão. A diferença de forma é o que
 * impede que os três leiam como opções indistintas.
 *
 * O WhatsApp fica na linha de canal, junto do e-mail: é **meio de contato**,
 * não uma quarta oferta.
 */
export function ClosingCta() {
  return (
    <section
      aria-labelledby="fechamento-titulo"
      data-whatsapp-safe-zone
      className="relative isolate overflow-hidden bg-canvas"
    >
      {/* ----------
          Plano fotográfico. Sangra à direita e é `aria-hidden`: a prova
          documentada vive em `/projetos`, com legenda. Aqui é atmosfera —
          uma operação construída, sem cliente, local ou prazo atribuídos.

          Abaixo de `lg` ele sai inteiro em vez de virar véu de fundo: numa
          coluna única, fotografia atrás de texto escuro sobre `canvas` é
          justamente o tipo de contraste que a régua do amarelo já proíbe.
          ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block"
      >
        {/*
          `linha-de-coccao.jpg` — fotografia de operação real já no acervo
          aprovado (`public/images/hero/`), e a que **fala do CTA desta seção**:
          a ação preenchida aqui é de equipamentos, e o que está em cena é uma
          linha de cocção instalada, com coifa, chapa, fritadeira e balcão
          refrigerado.

          A primeira montagem usou `cozinha-completa.jpg` — a imagem de Open
          Graph do site. Sobre `canvas` ela lê lavada: é uma fotografia de tom
          alto, e o degradê de dissolução por cima levava o lado esquerdo a
          quase branco. Esta é mais fechada e tem matéria, então sobrevive à
          dissolução.
        */}
        <Image
          src="/images/hero/linha-de-coccao.jpg"
          alt=""
          fill
          quality={80}
          sizes="42vw"
          /*
            `60% 38%`, e não `center`: centrado, o recorte pega meio metro de
            piso na base e corta a coifa no topo. Subindo o ponto de ancoragem,
            o que fica no quadro é a linha de equipamento — coifa, chapa,
            fritadeira e balcão.
          */
          className="object-cover object-[60%_38%]"
        />
        {/*
          Dissolução na aresta esquerda — o plano entra na página em vez de
          terminar num corte reto contra o `canvas`. É um degradê da **própria
          cor de fundo**, não um véu escuro por cima da fotografia, e morre aos
          38%: os dois terços da direita ficam com luz, inox e profundidade
          intactos. Antes ele ia até 58% e clareava metade da imagem.
        */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#EFEDEB_0%,rgba(239,237,235,0.66)_14%,rgba(239,237,235,0.16)_28%,rgba(239,237,235,0)_38%)]" />
      </div>

      <Container className="relative py-20 md:py-24 lg:py-section-lg">
        <div className="grid lg:grid-cols-12">
          {/*
            Cinco colunas de doze, ancoradas na guia esquerda — a mesma do `h1`
            da primeira dobra, do cabeçalho e de toda seção da página.
          */}
          <Reveal variant="up" className="lg:col-span-6 xl:col-span-5">
            <Eyebrow>{homeFinalCta.eyebrow}</Eyebrow>

            <Heading as={2} id="fechamento-titulo" size="title-1" className="mt-4">
              {homeFinalCta.title}
            </Heading>

            {/*
              `max-w` em `ch`: o limite que importa num parágrafo é o
              comprimento de linha, e ele precisa acompanhar o corpo do texto.
            */}
            <p className="mt-5 max-w-[52ch] text-lead text-muted">{homeFinalCta.lead}</p>

            <div className="mt-9">
              <LinkButton
                href={homeFinalCta.primary.href}
                variant="primary"
                size="lg"
                withArrow
                className="w-full sm:w-auto"
              >
                Solicitar orçamento
              </LinkButton>
            </div>

            {/* ----------
                As outras duas portas: nomeadas, em texto, subordinadas.
                ---------- */}
            <ul className="mt-7 flex flex-col gap-1 border-t border-ink/12 pt-5 sm:flex-row sm:gap-8">
              {homeFinalCta.secondary.map((cta) => (
                <li key={cta.href}>
                  <Link
                    href={cta.href}
                    className="group inline-flex min-h-[2.75rem] w-fit items-center gap-2 text-body-sm font-semibold text-ink transition-colors hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite"
                  >
                    {cta.label}
                    {/*
                      Marcador em grafite, não em amarelo: em fundo claro o
                      amarelo só entra como preenchimento ou hairline — sobre
                      `canvas` ele dá 1,4:1. A regra está em `src/styles/colors.ts`.
                    */}
                    <ArrowRightIcon
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-ink/50 transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-visible:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* ----------
                Linha de canal e de expectativa. Três fatos, todos já
                publicados hoje no rodapé e no CTA das rotas internas —
                `contact.responseTime`, `contact.hours`, `contact.coverage`.
                Nenhum número novo, nenhuma promessa nova.
                ---------- */}
            <div className="mt-8 flex flex-col gap-3 border-t border-ink/12 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
              <a
                href={whatsappUrl('equipamentos')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.75rem] w-fit items-center text-body-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
              >
                {homeFinalCta.whatsappLabel}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-[2.75rem] w-fit items-center text-body-sm text-muted transition-colors hover:text-ink"
              >
                {contact.email}
              </a>
            </div>

            {/*
              `tracking-[0.08em]` e `leading-[1.8]`: a 0,12em a linha inteira
              não cabia na coluna e quebrava em duas linhas coladas uma na
              outra, com o segundo trecho órfão. Continua em duas linhas em
              telas estreitas, mas com entrelinha de rótulo.
            */}
            <p className="mt-3 font-condensed text-eyebrow font-semibold uppercase leading-[1.8] tracking-[0.08em] text-muted">
              {contact.responseTime} · {contact.hours} · {contact.coverage}
            </p>
          </Reveal>
        </div>
      </Container>

      {/* ----------
          A mesma fotografia no telefone, **em fluxo e de sangria**, depois do
          conteúdo em vez de atrás dele.

          Sobrepor num viewport de coluna única não é opção: texto escuro sobre
          `canvas` com fotografia por trás é exatamente o contraste que a régua
          de cor do projeto proíbe. E deixar o fechamento sem imagem nenhuma
          fazia a última tela do telefone ser só tipografia, sem o fôlego que a
          seção existe para dar. Em fluxo, ela fecha a página e entrega para o
          rodapé.
          ---------- */}
      {/*
        Sem margem própria: o vão até aqui é o `py` inferior do `Container`
        logo acima (80px no telefone, 96 em tablet). Uma margem somaria aos
        dois e abriria um vazio que não tem função nenhuma.
      */}
      <div aria-hidden="true" className="relative h-56 w-full sm:h-72 lg:hidden">
        <Image
          src="/images/hero/linha-de-coccao.jpg"
          alt=""
          fill
          quality={78}
          sizes="100vw"
          className="object-cover object-[60%_38%]"
        />
      </div>
    </section>
  )
}
