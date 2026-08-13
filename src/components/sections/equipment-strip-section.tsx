import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { PhotoReveal } from '@/components/animations/photo-reveal'
import { Reveal } from '@/components/animations/reveal'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { cn } from '@/lib/utils'

import { equipmentCategories } from '@/data/equipment-categories'

import type { ReactNode } from 'react'

interface EquipmentStripSectionProps {
  compact?: boolean
  /**
   * Composição. `dossier` é a da V1 e continua sendo o **default**, porque é o
   * que `/solucoes/cozinhas-industriais` renderiza. `showcase` é a vitrine da
   * Home — ver o bloco de comentário abaixo.
   */
  variant?: 'dossier' | 'showcase'
  /**
   * Linha de fecho do **dossiê**, à esquerda do CTA. O default é o texto da V1
   * e é o que `/solucoes/cozinhas-industriais` renderiza.
   *
   * ---------- R1 (2026-08-12) ----------
   * A prop deixou de atravessar para a vitrine. Na composição da Home o fecho
   * não é mais um parágrafo no rodapé da seção: a linha de capacidade subiu
   * para a coluna de texto, acima do CTA, e é `capability`. Um mesmo nome de
   * prop servindo dois papéis diferentes era o que tornava difícil enxergar
   * que a Home e a rota interna não compartilham mais este texto.
   */
  note?: ReactNode
  /**
   * Linha de capacidade da **vitrine**, entre o enunciado e o CTA. É a
   * transcrição de `src/data/faq.ts` que a ficha 2 do documento 03 manda
   * preservar como origem do enunciado — sem a cláusula de "avulso × cozinha
   * inteira" e sem o ponteiro de detalhamento por linha, que a mesma ficha
   * manda migrar para a rota de linhas.
   */
  capability?: ReactNode
  /**
   * Ação que encerra a seção. Default = o da V1 ("Ver a solução completa"),
   * preservado para a rota interna; a Home passa a ação comercial.
   */
  cta?: { label: string; href: string }
}

const DEFAULT_CTA = { label: 'Ver a solução completa', href: '/solucoes/cozinhas-industriais' }

/**
 * A capacidade, em uma linha. Transcrição de `src/data/faq.ts` — `kitchensFaq[0]`
 * ("especificamos e fornecemos esse item") e `kitchensFaq[2]` ("logística,
 * montagem, instalação, comissionamento"). Os mesmos quatro verbos já são
 * publicados por `src/data/pillars.ts` na própria Home. Não é afirmação nova.
 */
const DEFAULT_CAPABILITY = 'Especificamos, fornecemos, instalamos e comissionamos.'

/**
 * Equipamentos — parte da solução, não catálogo.
 *
 * ============================================================
 * DUAS COMPOSIÇÕES, UM COMPONENTE
 * ============================================================
 *
 * Esta seção é montada em **duas** rotas: a Home e
 * `/solucoes/cozinhas-industriais`. A recomposição visual vale só para a Home,
 * então ela entra como `variant="showcase"` — a rota interna não passa
 * `variant` e continua recebendo `dossier`, que é o layout da V1 **sem uma
 * linha de diferença**. Nenhum texto, imagem ou dado foi alterado: as duas
 * composições leem o mesmo `equipmentCategories`.
 *
 * `note` e `cta` continuam props com os valores da V1 como default, pelo mesmo
 * motivo de sempre.
 *
 * ============================================================
 * POR QUE A HOME PRECISOU DE OUTRA COMPOSIÇÃO
 * ============================================================
 *
 * A auditoria visual global de 2026-08-10 mediu esta seção como a mais fraca da
 * página — e ela é a frente comercial prioritária (DEC-001). O que havia:
 * quatro planos empilhados que não se tocavam (banner → ficha da categoria →
 * grade de miniaturas → fecho), e quatro fotografias reais renderizadas a
 * **112×135**. Numa seção que vende equipamento de investimento relevante, a
 * imagem era o menor elemento da tela.
 *
 * ============================================================
 * O QUE `ca7a1c3` ERROU — E O QUE ESTA VERSÃO FAZ DIFERENTE
 * ============================================================
 *
 * A primeira tentativa de correção (commit `ca7a1c3`, reprovada visualmente)
 * confundiu **protagonismo com área máxima**. Ela pôs a fotografia da cocção
 * sangrando a janela inteira numa altura de quase um viewport, com o H2 em
 * `text-display` sobre um scrim que fechava a metade esquerda da imagem, e
 * transformou as outras quatro categorias em quatro blocos gigantes 2×2 sem
 * vão. Medido: a seção ficou **mais alta** que a que substituía (1.976 contra
 * 1.565px em 1440) apesar de ter menos texto, virou uma segunda primeira dobra,
 * e as quatro provas passaram a disputar atenção com a protagonista em vez de
 * se subordinarem a ela.
 *
 * As quatro regras que saem daquele erro, e que esta composição aplica:
 *
 *   PROTAGONISMO ≠ ÁREA MÁXIMA — quem faz a fotografia dominar é a hierarquia,
 *   não a contagem de pixels. Uma imagem grande cercada por quatro imagens
 *   igualmente grandes deixa de ser protagonista.
 *
 *   SANGRIA ≠ COMPOSIÇÃO — usar a viewport não é sangrar tudo. A vitrine tem
 *   **uma** aresta sangrada, a direita, e palco e faixa a compartilham.
 *
 *   TEXTO INTEGRADO ≠ TUDO SOBRE SCRIM — o enunciado tem plano editorial
 *   próprio, sobre o grafite da seção. O que entra na fotografia é só o **nome**
 *   da frente, com proteção local.
 *
 *   VITRINE ≠ MOSAICO — as quatro provas são uma faixa contínua de fotografias
 *   limpas, de mesmo tamanho e claramente menores que o palco.
 *
 * ============================================================
 * R1 (2026-08-12) — A RECOMPOSIÇÃO QUE FECHOU A SEÇÃO
 * ============================================================
 *
 * A rodada anterior tinha resolvido a escala das fotografias, mas o inventário
 * de `20f7e8c` ainda reprovava em quatro contas da ficha 2 (documento 03):
 *
 *   14 blocos de texto (teto 12) · 5 cards (teto 0) · 5 regiões amarelas
 *   (teto 3) · 1.379px de altura em 1440 (teto 1.100).
 *
 * E numa quinta, que é a que importa comercialmente: a fotografia protagonista
 * ocupava **20,6%** da área da seção enquanto as quatro provas somavam 24,0% —
 * juntas, elas eram maiores que a protagonista. Uma vitrine cuja categoria
 * prioritária perde em massa para o conjunto das secundárias não tem
 * protagonista, tem uma grade com uma célula grande.
 *
 * O que mudou, e por quê:
 *
 *   A · OS CINCO CARDS ERAM `bg-graphite` — a caixa de cada fotografia
 *   carregava #101010 dentro de uma seção `graphite-soft` (#1A1A1A).
 *   Superfície própria distinta da superfície da seção **é** a construção de
 *   card no sistema (documento 01 §7.3), e era essa a única que o inventário
 *   achava aqui. Como toda imagem é `fill` + `object-cover`, o fundo nunca
 *   aparecia depois do carregamento: sai a caixa, a composição renderizada não
 *   muda. Mesmo diagnóstico e mesma correção que R0-D aplicou em `#transicao`.
 *
 *   B · A CATEGORIA VOLTOU A SER FOTOGRAFIA + NOME. Saíram os quatro parágrafos
 *   de benefício da faixa, o benefício da cocção e a etiqueta "categoria
 *   prioritária". O benefício da cocção repetia literalmente o H2 ("pelo volume
 *   real, não pela ficha técnica"); os outros quatro explicavam o que a
 *   fotografia já mostra. Todos continuam publicados em
 *   `/solucoes/cozinhas-industriais` e em `/linhas-de-produtos`.
 *
 *   C · UMA ARESTA SANGRADA, COMPARTILHADA. A faixa passou a recuar a guia
 *   pela direita igual ao palco, então os dois terminam na **mesma** vertical.
 *   É o que faz a faixa ler como continuação da composição e não como um
 *   segundo componente empilhado dentro da seção — e não introduz mecanismo
 *   novo, é o mesmo `calc(-1 * var(--guia))`.
 *
 *   D · SEM VÃO NA FAIXA. Quatro fotografias encostadas formam uma superfície
 *   fotográfica única; com `gap` elas voltavam a ler como quatro objetos, que é
 *   meio caminho de volta para o cartão.
 *
 *   E · 65/35 EM VEZ DE 61/39. O palco foi de 7 para 8 de 12 colunas a partir
 *   de `xl`. Em `lg` ele fica em 7: com 4 colunas a coluna de texto cairia para
 *   261px em 1024 e o H2 quebraria em cinco linhas.
 *
 * Resultado medido em 1440: protagonista 36,2% da área contra 24,0% da faixa
 * inteira — a relação se inverteu, que era o objetivo.
 *
 * ============================================================
 * ESCALA DAS FOTOGRAFIAS — O QUE OS ARQUIVOS AGUENTAM
 * ============================================================
 *
 * Medidos: `linha-de-fogoes` 1024×768, `refrigeradores-verticais` 940×689,
 * `mobiliario-inox` 1170×964, `linha-de-coccao` 787×1400 (vertical),
 * `forno-combinado` 1109×1400 (vertical). **Nenhum foi trocado em R1** — a
 * troca só se justifica por defeito objetivo (§26 do briefing), e no viewport
 * de referência nenhum é ampliado.
 *
 * O palco ocupa 8 de 12 colunas a partir de `xl` e sangra pela direita: em 1440
 * renderiza a ~920px contra uma fonte de 1024 (0,90×) e em 1920 a ~1.177px
 * (1,15×) — ampliação leve, longe do borrão que reprovou `ca7a1c3`, que pedia
 * 1.120px num recorte de 2,5:1.
 *
 * A proporção da faixa é **5:4 em `lg`**, não 4:5 nem 4:3, e a razão são os
 * arquivos: duas provas são verticais (0,56 e 0,79) e duas horizontais (1,36 e
 * 1,21). Em 4:3 a `linha-de-coccao` mostraria 42% da altura original — recorte
 * agressivo demais para uma coifa. Em 5:4 ela mostra 53% e o `forno-combinado`
 * 75%, e a faixa custa 274px em vez de 342px (1:1), que era o que estourava o
 * teto de altura.
 */
export function EquipmentStripSection({
  compact = false,
  variant = 'dossier',
  note,
  capability,
  cta = DEFAULT_CTA,
}: EquipmentStripSectionProps = {}) {
  if (variant === 'showcase') {
    return <EquipmentShowcase capability={capability} cta={cta} />
  }

  return <EquipmentDossier compact={compact} note={note} cta={cta} />
}

/* ============================================================
   VITRINE — a composição da Home
   ============================================================ */

function EquipmentShowcase({
  capability,
  cta,
}: {
  capability?: ReactNode
  cta: { label: string; href: string }
}) {
  const [primary, ...rest] = equipmentCategories
  if (!primary) return null

  return (
    <Section
      id="equipamentos"
      tone="graphite-soft"
      space="sm"
      bleed
      aria-labelledby="equipamentos-titulo"
      /*
        `overflow-hidden` é requisito, não acabamento: a fotografia do palco
        sangra por `-mr` calculado em `100vw`, que inclui a barra de rolagem.
        Sem o recorte na seção, sobrariam ~15px de rolagem horizontal.
      */
      className="relative isolate overflow-hidden"
    >
      {/* ==========================================================
          PALCO — enunciado à esquerda, fotografia dominante à direita.

          A fotografia ocupa 8 de 12 colunas a partir de `xl` (7 em `lg`) e
          sangra **só pela borda direita**. Ela não passa por baixo do texto: os
          dois planos são vizinhos, e a profundidade vem da diferença de escala.
          Não há scrim geral — o enunciado vive sobre o grafite da própria
          seção, e é isso que mantém a fotografia visível de ponta a ponta.

          A altura do palco é ditada pela fotografia, nunca por `vh`: é o que
          impede a seção de virar uma segunda primeira dobra.
          ========================================================== */}
      <Container>
        <div className="grid items-center gap-9 lg:grid-cols-12 lg:gap-12">
          {/*
            5 de 12 em `lg`, 4 em `xl`. A distribuição-alvo da ficha é 65/35 e
            em `xl` ela sai exata (400px de texto contra 920px de fotografia em
            1440). Em `lg` não: com 4 colunas o texto cairia para 261px em 1024
            e o H2 quebraria em cinco linhas. O teto de massa vale onde há
            largura para cumpri-lo sem quebrar o enunciado.
          */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Reveal>
              <Eyebrow tone="light">Equipamentos e tecnologia</Eyebrow>

              {/*
                `title-1`, não `display`. Em `display` o enunciado quebrava em
                quatro linhas monumentais e ganhava o mesmo peso perceptivo do
                H1 da primeira dobra — a Home passava a ter duas heroes
                seguidas. Em `title-1` com `max-w-[22ch]` são três linhas de
                seção. A frase não mudou.
              */}
              <Heading
                as={2}
                id="equipamentos-titulo"
                size="title-1"
                className="mt-5 max-w-[22ch] text-canvas"
              >
                Especificado pelo volume real, não pela ficha técnica
              </Heading>

              <p className="mt-5 max-w-[44ch] text-lead text-canvas/75">
                A capacidade instalada é definida pela produção, pelo cardápio e pelos horários de
                pico. Equipamento sobrando é capital parado; faltando, é gargalo todo turno.
              </p>

              {/*
                A LINHA DE CAPACIDADE — o que a seção precisa responder antes do
                CTA ("vocês fornecem, ou só desenham?"). Era o parágrafo de 223
                caracteres no rodapé da seção; virou uma linha na coluna de
                texto, imediatamente acima da ação que ela habilita.

                O que saiu dela está publicado em outro lugar, e foi conferido
                antes do corte: a cláusula "avulso ou cozinha inteira" é
                `faq.ts` (`kitchensFaq[0]`), é renderizada na FAQ de
                `/solucoes/cozinhas-industriais` e é dita **nesta mesma Home**
                por `#credibilidade` ("do equipamento avulso à cozinha
                inteira"); o ponteiro de detalhamento por linha é
                `/linhas-de-produtos`, que publica as cinco categorias com
                âncora própria e continua alcançável pelo rodapé.
              */}
              <p className="mt-4 max-w-[44ch] text-body font-semibold text-canvas">
                {capability ?? DEFAULT_CAPABILITY}
              </p>

              {/*
                `size="md"`: o CTA precisa ter peso comercial, não competir com
                a fotografia. Em `lg` o experimento reprovado deixava um botão
                de 56px de altura ao lado de uma imagem de 960px, e o olho ia
                para o botão.
              */}
              <LinkButton href={cta.href} variant="primary" size="md" withArrow className="mt-8">
                {cta.label}
              </LinkButton>
            </Reveal>
          </div>

          {/* ----------
              A fotografia vai da coluna 5 (6 em `lg`) até a borda direita da
              janela.

              A sangria é **exatamente a guia**, com o sinal invertido: a guia é
              a distância da aresta da janela até a aresta interna do container,
              então recuá-la devolve a imagem ao vidro. Sem breakpoint, e sem
              recalcular a guia.

              ---------- R0-A (2026-08-12) ----------

              Era `calc((100vw − min(100vw,1400px))/2 + 2.5rem)` — a guia
              reconstruída à mão, e a única das cinco cópias que usava `100vw`.
              `vw` inclui a barra de rolagem, então a fotografia terminava ~7px
              **além** do vidro (invisível, porque `body` recorta o eixo
              horizontal) e desalinhada das outras três expressões. `--guia`
              resolve por `cqw`, que ignora a barra — ver o bloco em
              `globals.css`.

              É sangria, não guia de texto: o cálculo é **derivado** da guia,
              como manda a separação entre eixo de mídia e eixo de conteúdo.
              ---------- */}
          <div className="lg:col-span-7 lg:mr-[calc(-1*var(--guia))] xl:col-span-8">
            {/*
              A proporção abre de 4:3 no telefone para 8:5 em `lg`: em 7:5 a
              fotografia ficava mais alta que a coluna de texto e abria ~175px
              de grafite vazio acima e abaixo dela em 1920.

              `settle`, não `PhotoReveal`: a ficha 2 fixa `settle` como o único
              motion da seção, e passar a usá-lo aqui faz palco e faixa entrarem
              com o mesmo gesto — uma seção, uma composição. `PhotoReveal`
              continua servindo o dossiê, onde a cortina é a linguagem da V1.
            */}
            <Reveal variant="settle">
              <CategoryPhoto
                category={primary}
                priority
                quality={84}
                sizes="(max-width: 1023px) 100vw, 64vw"
                ratio="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[8/5]"
                framing="object-[58%_center]"
                lead
              />
            </Reveal>
          </div>
        </div>
      </Container>

      {/* ==========================================================
          AS OUTRAS QUATRO FRENTES — uma faixa fotográfica contínua.

          Quatro fotografias encostadas, de mesma proporção e mesma largura,
          terminando na **mesma vertical** que o palco. Não há vão, moldura,
          preenchimento nem parágrafo por item: a frente é a fotografia mais o
          nome, e o nome cabe em uma linha — que é a condição sob a qual este
          projeto aceita legenda sobre a imagem.

          É isso que faz a faixa ler como continuação do palco em vez de um
          segundo componente empilhado dentro da seção.
          ========================================================== */}
      <Container>
        {/*
          Quatro em linha já em `lg`. Com a sangria, a faixa mede 952px em 1024
          e cada prova fica em 238px — 2,1× a largura da miniatura de 112px que
          a auditoria visual global reprovou, e o dobro do que a versão anterior
          conseguia em 1024. Manter 2×2 até `xl` custaria 762px de faixa e
          estouraria sozinho o teto de altura da ficha.

          `data-whatsapp-safe-zone`: a última prova termina colada na borda
          inferior direita, que é onde o botão flutuante do WhatsApp mora — sem
          o atributo ele cobre o nome de "Tecnologia de cocção" em 1440 e 1920.
          Mesmo mecanismo já usado no hero, no diagnóstico, em projetos e no
          fechamento.
        */}
        <ul
          data-whatsapp-safe-zone
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:mr-[calc(-1*var(--guia))] lg:mt-14 lg:grid-cols-4"
        >
          {rest.map((category, index) => (
            <Reveal key={category.id} as="li" variant="settle" delay={index * 70}>
              {/*
                5:4 em `lg`, não 4:3 nem 1:1 — a razão está nos arquivos, e no
                bloco de escala do topo: duas provas são verticais (0,56 e
                0,79). Em 4:3 a `linha-de-coccao` mostraria 42% da altura
                original; em 5:4 mostra 53%. E 1:1 levaria a faixa a 342px em
                1440, o que sozinho recolocaria a seção acima do teto.
              */}
              <CategoryPhoto
                category={category}
                quality={82}
                sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 25vw"
                ratio="aspect-[4/3] lg:aspect-[5/4]"
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/**
 * Uma frente = uma fotografia + o nome dela. Não há cartão: nenhuma superfície
 * própria, nenhuma borda, nenhum raio, nenhuma ficha.
 *
 * O nome vive **sobre** a imagem, num canto, protegido por um gradiente local
 * que ocupa a base e morre antes da metade da altura — nunca um scrim geral. É
 * o mesmo mecanismo em todas as larguras, o que é o que a ficha 2 pede para o
 * telefone ("nome sobreposto") e o que mantém palco e faixa falando a mesma
 * língua.
 *
 * O `bg-graphite` que ficava na caixa da imagem **saiu**: era ele que fazia
 * cada fotografia contar como card no inventário (superfície #101010 dentro de
 * uma seção #1A1A1A). Como a imagem é `fill` + `object-cover`, o fundo nunca
 * aparecia depois do carregamento — sai a caixa, não a composição.
 */
function CategoryPhoto({
  category,
  ratio,
  sizes,
  quality,
  framing,
  priority = false,
  lead = false,
}: {
  category: (typeof equipmentCategories)[number]
  /** Proporção da caixa, por breakpoint. É ela que dita a altura da seção. */
  ratio: string
  sizes: string
  quality: number
  /** Enquadramento fino do recorte, quando o assunto não está no centro. */
  framing?: string
  priority?: boolean
  /** A categoria prioritária: nome maior e respiro maior. */
  lead?: boolean
}) {
  return (
    <figure className={cn('relative w-full overflow-hidden', ratio)}>
      <Image
        src={category.image}
        alt={category.alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={cn('object-cover', framing)}
      />

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(16,16,16,0.9)_0%,rgba(16,16,16,0.62)_38%,rgba(16,16,16,0.2)_72%,transparent_100%)]',
          lead ? 'h-[40%]' : 'h-[46%]',
        )}
      />

      {/* ----------
          A cor e a escala vão no **próprio** elemento de texto, nunca no
          `figcaption`.

          `globals.css` tem `h1..h4 { @apply ... text-ink }` na camada base —
          uma declaração no elemento, que vence a herança. Um `text-canvas` no
          wrapper deixa os quatro `h3` da faixa em grafite sobre grafite: eles
          somem, e somem **só na faixa**, porque o nome da prioritária é um `p`
          e herda normalmente. Foi assim que a primeira versão desta composição
          entrou; o recorte ampliado (`medicoes/zoom-nomes.mjs`) é o que pegou.
          ---------- */}
      <figcaption className={cn('absolute inset-x-0 bottom-0', lead ? 'p-5 lg:p-7' : 'p-4 lg:p-5')}>
        {/*
          A prioritária é um `p` e as outras quatro são `h3` — é a estrutura de
          documento que a seção já publicava antes de R1, e ela não muda por
          causa de composição: o nome da categoria em destaque não é um título
          de subseção irmão dos outros quatro.
        */}
        {lead ? (
          <p className="font-sans text-title-2 font-bold text-canvas">{category.name}</p>
        ) : (
          <h3 className="font-sans text-title-3 font-bold text-canvas">{category.name}</h3>
        )}
      </figcaption>
    </figure>
  )
}

/* ============================================================
   DOSSIÊ — a composição da V1, intocada, servindo a rota interna
   ============================================================ */

function EquipmentDossier({
  compact,
  note,
  cta,
}: {
  compact: boolean
  note?: ReactNode
  cta: { label: string; href: string }
}) {
  const [primary, ...rest] = equipmentCategories

  return (
    <Section id="equipamentos" tone="graphite-soft" space={compact ? 'sm' : 'default'} bleed aria-labelledby="equipamentos-titulo">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow tone="light">Equipamentos e tecnologia</Eyebrow>
            <Heading
              as={2}
              id="equipamentos-titulo"
              size="title-1"
              className="mt-5 max-w-[20ch] text-canvas"
            >
              Especificado pelo volume real, não pela ficha técnica
            </Heading>
          </div>

          <p className="text-lead text-canvas/75 lg:col-span-4 lg:col-start-9">
            A capacidade instalada é definida pela produção, pelo cardápio e pelos horários de
            pico. Equipamento sobrando é capital parado; faltando, é gargalo todo turno.
          </p>
        </div>

        {/* ==========================================================
            Categoria prioritária — painel panorâmico, dimensionamento real.
            ========================================================== */}
        {primary ? (
          <figure className="mt-10 lg:mt-14">
            <PhotoReveal className="relative aspect-[4/3] w-full overflow-hidden bg-graphite sm:aspect-[16/9] lg:aspect-[2.8/1]">
              <Image
                src={primary.image}
                alt={primary.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 78vw"
                quality={84}
                className="object-cover"
              />
            </PhotoReveal>

            <figcaption className="mt-5 grid gap-x-12 gap-y-4 border-t border-white/20 pt-5 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="font-condensed text-sm font-semibold uppercase text-canvas/75">
                  Categoria prioritária
                </p>
                <p className="mt-2 font-sans font-bold text-title-2 text-canvas">{primary.name}</p>
                <p className="mt-3 max-w-[46ch] text-body text-canvas/75">{primary.benefit}</p>
              </div>

              <ul className="lg:col-span-6 lg:col-start-7">
                {primary.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-white/15 py-2.5 text-base text-canvas/85 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-2.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        ) : null}

        {/* ==========================================================
            Demais categorias — dossiê em grade, foto real + dados curtos.
            ========================================================== */}
        <ul className="mt-12 grid gap-x-8 gap-y-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:mt-16 lg:pt-12">
          {rest.map((category, index) => (
            <Reveal key={category.id} as="li" variant="side" delay={index * 60}>
              <div className="flex gap-5">
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-graphite sm:w-28">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="112px"
                    quality={76}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans font-bold text-title-3 text-canvas">{category.name}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-canvas/75">{category.benefit}</p>
                  <p className="mt-2 text-sm leading-relaxed text-canvas/65">{category.items.join(' · ')}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-5 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base text-canvas/75">
            {note ?? (
              <>
                O detalhamento por linha de equipamento — incluindo o{' '}
                <Link
                  href="/linhas-de-produtos/forno-combinado-rational"
                  className="font-semibold text-canvas underline decoration-yellow underline-offset-4 transition-colors hover:text-white"
                >
                  forno combinado Rational
                </Link>{' '}
                — fica na página de linhas.
              </>
            )}
          </p>
          <LinkButton href={cta.href} variant="primary" size="md" withArrow className="shrink-0">
            {cta.label}
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}
