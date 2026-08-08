import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { TrackedLink } from '@/components/v2/tracked-link'
import { heroPillars, heroSecondary, homeHero, type HeroPillar } from '@/data/v2/home'
import { homeHeroMetrics } from '@/data/v2/home'
import { cn } from '@/lib/utils'

/**
 * ============================================================
 * PRIMEIRA DOBRA — UMA CENA, TRÊS PORTAS
 * ============================================================
 *
 * É a principal peça do site: posiciona a empresa, segmenta a intenção do
 * visitante e converte. Não é uma faixa de três cartões — é **uma composição
 * cortada em três**, na linguagem diagonal da V1 (geometria, grade tonal e
 * motion em `globals.css`, seção "PRIMEIRA DOBRA — TRÊS PILARES EM UMA
 * COMPOSIÇÃO SÓ").
 *
 * ============================================================
 * A DOBRA É A JANELA INTEIRA, E NADA ALÉM DELA
 * ============================================================
 *
 * `h-[100svh]` na seção, com o cabeçalho sobreposto (`position: fixed`, fora
 * do fluxo): cabeçalho + hero somam exatamente uma tela, e a seção seguinte
 * começa no primeiro pixel abaixo dela.
 *
 * Medido antes desta rodada, com a altura anterior
 * (`clamp(34rem, 100svh − header, 46rem)` mais uma barra em fluxo):
 *
 *     1920 × 1080 .... dobra 813px — sobravam **267px** da seção seguinte
 *     1440 × 900 ..... dobra 813px — sobravam **87px**
 *      768 × 1024 .... dobra 1090px — **66px** além da tela
 *      390 × 844 ..... dobra 979px — **135px** além
 *      360 × 800 ..... dobra 977px — **177px** além
 *
 * Ou seja: teto fixo de 46rem estourando em desktop amplo e conteúdo em fluxo
 * estourando no telefone. Os dois casos são resolvidos pela mesma estrutura —
 * a seção fixa a altura, o palco toma a folga (`flex-1`) e a barra de apoio
 * mede pelo conteúdo (`shrink-0`).
 *
 * `svh` (a menor altura visível) e não `vh`: no telefone `vh` ignora a barra
 * de endereço retrátil e a dobra fica maior que a tela justamente no
 * carregamento, que é o momento que importa para tráfego pago.
 *
 * O piso `min-h-[34rem]` existe para janela muito baixa (desktop com muitas
 * barras, telefone deitado): abaixo disso a composição deixaria de caber e é
 * preferível rolar alguns pixels a decapitar um pilar.
 *
 * ============================================================
 * A HIERARQUIA DE EQUIPAMENTOS NÃO VEM DA FOTOGRAFIA
 * ============================================================
 *
 * As três fotografias recebem **o mesmo tratamento**: mesmo ponto de preto,
 * mesmo ponto de branco, mesma saturação, mesmo véu, mesma temperatura (os
 * números medidos estão em `globals.css`). Nenhuma é mais clara, mais opaca ou
 * mais saturada que as outras. Equipamentos lidera por nove vias, e nenhuma
 * delas é manipulação de imagem:
 *
 *   1. posição ......... primeiro ponto de leitura, à esquerda, onde o olho
 *                        ocidental entra na composição
 *   2. ordem no DOM .... primeiro no código, primeiro no `Tab`, primeiro para
 *                        o leitor de tela
 *   3. `h1` ............ é o único painel que carrega o título da página
 *   4. etiqueta ........ é o único que carrega a identificação da empresa
 *   5. escala .......... o nome do pilar vem num corpo maior que o dos outros
 *   6. forma do CTA .... único preenchido; os outros dois são contorno. A
 *                        forma diferencia antes de o rótulo ser lido
 *   7. keyline ......... o traço amarelo marca a fronteira dele, e só a dele
 *   8. copy ............ é o único que enumera as seis frentes de equipamento
 *   9. área ............ 44% contra 28% e 28% — a mais discreta das nove, e
 *                        deliberadamente insuficiente sozinha
 *
 * Os dois pilares de sustentação têm **a mesma área**: lêem como um par de
 * portas, não como segundo e terceiro lugares.
 *
 * ============================================================
 * OS TRÊS SÃO COMPREENDIDOS SEM INTERAÇÃO
 * ============================================================
 *
 * Nome, pergunta do cliente e CTA de cada pilar estão visíveis no estado
 * inicial. O realce por hover/foco (`:has()` no CSS) muda proporção, nunca
 * presença — e é CSS puro, então funciona antes da hidratação e continua
 * funcionando com JavaScript desligado.
 *
 * Sem autoplay, sem carrossel, sem pilar escondido esperando clique.
 *
 * ============================================================
 * CADA PAINEL É UMA ÁREA CLICÁVEL INTEIRA
 * ============================================================
 *
 * O alvo é um link sobreposto ao painel inteiro; o CTA visível é a
 * representação dele, não um segundo controle. Como o `clip-path` recorta
 * também o teste de clique, a área sensível assume a forma diagonal do painel
 * — não um retângulo invadindo o vizinho.
 *
 * **Um alvo interativo por painel.** É o que permite a área cheia sem aninhar
 * link dentro de link (HTML inválido) e sem que o mesmo destino apareça duas
 * vezes na navegação por teclado. A ação secundária da dobra vive na barra
 * abaixo da composição, fora dos painéis, pelo mesmo motivo.
 */
export function HeroPillars() {
  return (
    <section
      aria-labelledby="hero-titulo"
      /*
        `overflow-hidden` não é acabamento: `clip-path` e `transform` contam
        como área rolável, e sem ele os painéis, a cortina de entrada e o zoom
        de hover abrem rolagem horizontal.
      */
      className="hero-tri relative isolate flex h-[100svh] min-h-[34rem] flex-col overflow-hidden bg-graphite"
    >
      <HeroGrades />

      {/* ----------
          O palco: toma toda a folga que a barra de apoio não usa. É ele que
          faz a dobra fechar exatamente na janela em qualquer altura, sem teto
          fixo em `rem` e sem conteúdo em fluxo empurrando por baixo.
          ---------- */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:block">
        {heroPillars.map((pillar, index) => (
          <HeroPanel key={pillar.id} pillar={pillar} position={index} />
        ))}

        {/* ----------
            A luz da cena. Fica **sobre os três painéis de uma vez** — é o
            que faz três fotografias de origens diferentes lerem como um
            ambiente só, iluminado do mesmo lado. Painel a painel isso não
            funciona: cada véu pararia na aresta e a emenda apareceria.
            ---------- */}
        <span
          aria-hidden="true"
          className="hero-tri-ramp pointer-events-none absolute inset-0 z-[5]"
        />

        {/* Keyline amarela: marca a fronteira da frente principal. */}
        <span
          aria-hidden="true"
          className="hero-tri-key pointer-events-none absolute inset-0 z-[6] hidden origin-top bg-yellow lg:block [--seq:520ms]"
        />
        {/* Keyline branca discreta entre os dois pilares de sustentação. */}
        <span
          aria-hidden="true"
          className="hero-tri-key2 pointer-events-none absolute inset-0 z-[6] hidden origin-top bg-white/30 lg:block [--seq:660ms]"
        />

        {/* ----------
            Cortina de entrada: uma aresta que corre pela diagonal da
            composição, uma vez só, no carregamento. Ela atravessa os três
            painéis, então a ordem de revelação sai da própria geometria —
            Equipamentos primeiro, Consultoria por último.

            `z-[7]`: acima das fotografias, das keylines e da rampa; abaixo do
            alvo de clique (`z-20`), para nunca interceptar um toque, e abaixo
            do conteúdo (`z-10`)… não — o conteúdo também é coberto de
            propósito, e por isso ele carrega a própria entrada escalonada
            (`.hero-seq`), que começa depois da passagem da cortina.
            ---------- */}
        <span
          aria-hidden="true"
          className="hero-tri-curtain pointer-events-none absolute inset-0 z-[7]"
        />
      </div>

      {/* ----------
          Barra de apoio: credenciais confirmadas à esquerda, ação secundária à
          direita. Fica **fora** dos painéis de propósito — dentro, seria um
          segundo link aninhado na área clicável do pilar.

          `shrink-0`: ela mede pelo próprio conteúdo e o palco fica com o
          restante. Invertido, uma barra que crescesse comeria a composição.
          ---------- */}
      <div className="relative z-[8] shrink-0 border-t border-white/[0.14] bg-graphite-deep">
        <Container>
          {/*
            ============================================================
            A BARRA MEDE 88px NO TELEFONE, NÃO 144px
            ============================================================

            Medida em 390 × 844 na rodada anterior, ela ocupava **144px — 17% da
            primeira tela** — porque as duas métricas quebravam em duas linhas
            (`gap-x-6` largo demais para 350px de caixa) e a ação secundária
            vinha numa terceira. Cada pixel gasto aqui sai do palco, que é onde
            os três pilares vivem.

            Agora as duas métricas dividem uma linha (`gap-x-4` abaixo de `sm`,
            que é o que faz "18 anos de atuação" e "BRASIL abrangência de
            atendimento" caberem lado a lado em 360px) e a ação fica na segunda.
            O corpo e o alvo de toque não mudaram.
          */}
          <div className="hero-seq flex flex-col gap-1.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-4 [--seq:900ms]">
            <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-6">
              {homeHeroMetrics.map((metric) => (
                <div key={metric.label} className="flex items-baseline gap-1.5 sm:gap-2">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="font-condensed text-[0.875rem] font-bold uppercase tracking-[0.03em] text-canvas sm:text-[0.9375rem]">
                    {metric.value}
                  </dd>
                  <span aria-hidden="true" className="text-[0.6875rem] text-canvas/60 sm:text-[0.75rem]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </dl>

            <TrackedLink
              href={heroSecondary.href}
              event="hero_orcamento_click"
              className="group -my-1 inline-flex min-h-[2.75rem] w-fit items-center gap-2 py-1 text-body-sm font-semibold text-canvas transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow sm:my-0 sm:py-0"
            >
              {heroSecondary.label}
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="shrink-0 text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1"
              />
            </TrackedLink>
          </div>
        </Container>
      </div>
    </section>
  )
}

/**
 * ============================================================
 * GRADE TONAL — UM FILTRO POR ARQUIVO, UM ALVO SÓ
 * ============================================================
 *
 * `feComponentTransfer` com `type="gamma"` é a transferência `A · in^E + O`
 * por canal. Os três conjuntos abaixo **não foram escolhidos a olho**: cada um
 * é a solução do sistema que leva os três âncoras do histograma daquele
 * arquivo (p05, p50, p95) aos mesmos três valores de destino — 0,032 / 0,205 /
 * 0,660. O `saturate()` que acompanha cada um (em `globals.css`) foi resolvido
 * pelo mesmo caminho, para que as três cheguem à mesma saturação final.
 *
 * A tabela do antes e do depois está em `globals.css`, "AS TRÊS FOTOGRAFIAS
 * COMO UMA CENA SÓ". Ao trocar qualquer uma das três imagens, **remeça** — os
 * valores são específicos do arquivo, não do estilo.
 *
 * `colorInterpolationFilters="sRGB"` é obrigatório: no padrão (`linearRGB`) a
 * mesma gama produz outro resultado, e os números acima deixam de valer. É a
 * mesma escolha do filtro do hero da V1.
 *
 * O elemento é `absolute h-0 w-0`: existe para ser referenciado por `url(#id)`,
 * não para ocupar espaço.
 */
const GRADES = [
  { id: 'hero-grade-a', amplitude: 0.897, exponent: 0.678, offset: 0.0247 },
  { id: 'hero-grade-b', amplitude: 0.644, exponent: 2.243, offset: 0.027 },
  { id: 'hero-grade-c', amplitude: 1.041, exponent: 0.902, offset: -0.0432 },
] as const

function HeroGrades() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
      <defs>
        {GRADES.map(({ id, amplitude, exponent, offset }) => (
          <filter key={id} id={id} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude={amplitude} exponent={exponent} offset={offset} />
              <feFuncG type="gamma" amplitude={amplitude} exponent={exponent} offset={offset} />
              <feFuncB type="gamma" amplitude={amplitude} exponent={exponent} offset={offset} />
            </feComponentTransfer>
          </filter>
        ))}
      </defs>
    </svg>
  )
}

const PANEL_CLASS = ['hero-tri-a', 'hero-tri-b', 'hero-tri-c'] as const
const BOX_CLASS = ['hero-tri-box-a', 'hero-tri-box-b', 'hero-tri-box-c'] as const
const MEDIA_CLASS = ['hero-tri-media-a', 'hero-tri-media-b', 'hero-tri-media-c'] as const
const PHOTO_CLASS = ['hero-tri-photo-a', 'hero-tri-photo-b', 'hero-tri-photo-c'] as const

/**
 * Atrasos da entrada escalonada, um por painel. Reusa `--seq` e `.hero-seq`,
 * o vocabulário de motion que a V1 já definiu (`globals.css`) — não um segundo
 * mecanismo paralelo.
 *
 * A cortina passa entre 140ms e 1.180ms; cada painel só começa a entrar depois
 * de a aresta já ter passado por cima dele, o que é o que faz a revelação ler
 * como uma coisa só e não como duas animações concorrentes.
 */
const SEQ_TITLE = ['[--seq:420ms]', '[--seq:640ms]', '[--seq:760ms]'] as const
const SEQ_BODY = ['[--seq:560ms]', '[--seq:720ms]', '[--seq:840ms]'] as const

/**
 * ============================================================
 * PROPORÇÃO DO EMPILHAMENTO MÓVEL
 * ============================================================
 *
 * `flex-grow`, não `min-height`. A versão anterior declarava pisos em `svh`
 * (60/23/23) e o resultado medido era a dobra estourando a tela em toda largura
 * de toque — 135px em 390 × 844, 177px em 360 × 800, 303px em 320 × 720 —,
 * porque piso não é teto: com o conteúdo crescendo, os três painéis somavam
 * mais que a janela.
 *
 * Com `flex-grow` sobre `flex-basis: 0` a repartição é **relativa**: os três
 * dividem exatamente a altura que o palco tem, seja ela qual for. Equipamentos
 * fica com ~49% e os dois de sustentação com ~25,5% cada — a mesma leitura do
 * desktop (uma frente principal e duas portas de mesmo peso), no eixo que o
 * telefone permite.
 *
 * As margens negativas do encaixe diagonal (`--tri-mcut`, em `globals.css`)
 * entram no cálculo do espaço livre antes da repartição, então os três painéis
 * somam a altura do palco **depois** do encaixe. Não sobra nem falta pixel.
 *
 * `min-h-0` é obrigatório: sem ele o `min-height: auto` do item flex impede o
 * encolhimento e a soma volta a estourar.
 */
const MOBILE_GROW = ['grow-[1.78]', 'grow-[1]', 'grow-[1]'] as const

function HeroPanel({ pillar, position }: { pillar: HeroPillar; position: number }) {
  const isPrimary = position === 0
  /**
   * No empilhamento, a aresta diagonal do painel corre no **topo** de Projetos
   * e Consultoria e na **base** de Equipamentos e Projetos — o último não tem
   * corte inferior. Cada painel precisa de folga só do lado em que a aresta
   * passa; folga dos dois lados desperdiçaria altura numa dobra que fecha
   * exatamente na tela.
   */
  const hasTopCut = position > 0
  const hasBottomCut = position < heroPillars.length - 1

  return (
    <div
      className={cn(
        'hero-tri-panel group relative w-full',
        /*
          No telefone o painel é um item de fluxo que divide a altura do palco
          com os outros dois; `justify-end` alinha os três pela base. No desktop
          volta a ser um painel absoluto, onde a diagonal é vertical e a
          proporção entre as três regiões é a hierarquia comercial.
        */
        'flex min-h-0 basis-0 flex-col justify-end',
        MOBILE_GROW[position],
        PANEL_CLASS[position],
        'lg:absolute lg:inset-0 lg:block lg:h-auto lg:min-h-0 lg:grow-0 lg:basis-auto',
      )}
    >
      {/* ---------- Fotografia: enquadrada na região do painel ---------- */}
      <div className={cn('absolute inset-0 lg:inset-y-0', MEDIA_CLASS[position])}>
        <Image
          src={pillar.media.src}
          alt={pillar.media.alt}
          fill
          priority={isPrimary}
          /*
            `eager` nos dois painéis de sustentação: eles estão na primeira
            dobra em toda largura, então não há nada a adiar. `priority` já
            implica `eager` no principal, e passar os dois juntos emite aviso
            do `next/image`.
          */
          loading={isPrimary ? undefined : 'eager'}
          /*
            Mesma qualidade nos três — qualidade diferente por painel seria mais
            uma forma de privilegiar Equipamentos por tratamento de imagem, que
            é justamente o que esta dobra não pode fazer. 86 consta de
            `images.qualities` em `next.config.ts`; fora da lista o otimizador
            responde 400 e a imagem some sem erro de build.
          */
          quality={86}
          sizes={isPrimary ? '(max-width: 1023px) 100vw, 50vw' : '(max-width: 1023px) 100vw, 34vw'}
          style={{ objectPosition: pillar.media.objectPosition }}
          className={cn('object-cover', 'hero-tri-photo', PHOTO_CLASS[position])}
        />

        {/*
          Véu de legibilidade, **idêntico nos três**: o texto é o mesmo em todos
          os painéis e precisa do mesmo piso de contraste em todos. Antes o
          painel principal recebia um gradiente mais leve que os outros dois —
          fotografia mais aberta no pilar principal é privilégio por tratamento
          de imagem, e a dobra não pode tê-lo.
        */}
        <div aria-hidden="true" className="hero-tri-veil absolute inset-0" />
      </div>

      {/* ---------- Conteúdo (não recebe clique: o alvo é o link ao fim) ---------- */}
      <div
        className={cn(
          /*
            `relative` no telefone (fluxo, dentro da caixa que o flex dimensiona)
            e `absolute` no desktop (sobreposta à fotografia).
          */
          /*
            `lg:inset-y-0`, **nunca `lg:inset-0`**: o `left`/`right` de cada
            caixa vem de `.hero-tri-box-*` (globals.css), que é o que a mantém
            dentro da zona segura da diagonal. `inset-0` tem a mesma
            especificidade e é emitido depois, então zera os dois lados e as
            três caixas passam a ocupar a composição inteira — as de Projetos e
            Consultoria vão parar debaixo da fotografia de Equipamentos e somem
            no recorte. Aqui só o eixo vertical é declarado.
          */
          /*
            `lg:w-auto` pelo mesmo motivo: num elemento absoluto com `left` e
            `right` declarados, `width: 100%` vence os dois e a caixa volta a
            ocupar a composição inteira.
          */
          'pointer-events-none relative z-10 flex w-full min-h-0 flex-col justify-end lg:absolute lg:inset-y-0 lg:w-auto',
          'px-5 md:px-8 lg:px-0 lg:pb-10',
          /*
            ============================================================
            FOLGA PARA A ARESTA — DOS DOIS LADOS, NÃO SÓ DO TOPO
            ============================================================

            No empilhamento a aresta diagonal corre no topo dos painéis de
            sustentação **e na base dos dois primeiros**. A folga superior já
            existia; a inferior faltava, e o resultado medido em 390 × 844 foi
            o CTA primário com a cela da seta **cortada na diagonal** — o botão
            de conversão da dobra saindo pela metade. O mesmo acontecia com
            "Falar com um projetista".

            Consultoria é o último da pilha e não tem corte inferior, então não
            recebe a folga: numa dobra que fecha exatamente na tela, cada folga
            desnecessária sai da altura de algum pilar.
          */
          hasTopCut ? 'pt-[calc(var(--tri-mcut)+0.375rem)] lg:pt-0' : null,
          hasBottomCut ? 'pb-[calc(var(--tri-mcut)+0.25rem)] lg:pb-10' : 'pb-5 lg:pb-10',
          BOX_CLASS[position],
        )}
      >
        <div
          className={cn(
            'flex min-h-0 flex-col justify-end lg:h-full',
            /*
              A faixa do cabeçalho é reservada onde o painel encosta no topo da
              página: no desktop isso vale para os três (todos vão de ponta a
              ponta); no telefone, só para Equipamentos, que é o primeiro da
              pilha. Sem isso a etiqueta e o `h1` passavam por baixo da marca.
            */
            isPrimary && 'pt-[calc(var(--header-height)+0.25rem)]',
            'lg:pt-[calc(var(--header-height)+1.5rem)]',
            /*
              O recuo dos painéis de sustentação abre em `xl` e fecha em `lg`:
              em 1024–1279px a caixa de cada um tem ~230px, e 56px de recuo
              deixavam ao CTA menos largura do que o rótulo pede. A margem da
              composição continua existindo — ela só deixa de ser maior que o
              conteúdo que precisa caber dentro dela.
            */
            isPrimary ? 'lg:pl-[6vw] lg:pr-8' : 'lg:pl-5 xl:pl-7',
            position === 1 && 'lg:pr-3 xl:pr-6',
            position === 2 && 'lg:pr-6 xl:pr-[max(2rem,4vw)]',
          )}
        >
          {/* ----------
              Só o painel principal carrega a identificação da empresa e o `h1`
              — dois dos nove sinais de hierarquia. E eles aparecem **em todas
              as larguras**: uma versão anterior escondia este bloco abaixo de
              `lg`, e no telefone a página ficava sem `h1` e sem dizer o que a
              Bianchini faz, justamente onde a maior parte do tráfego pago
              chega.

              `justify-start` no telefone: o `h1` ancora imediatamente abaixo da
              faixa reservada ao cabeçalho e a folga que sobrar cai **entre** o
              título e o bloco do pilar. Centrado, ele distribuía a folga pelos
              dois lados e a metade de cima entrava por baixo da marca — medido:
              primeira linha a 51px num cabeçalho de 64px.

              No desktop a centragem volta, porque lá o bloco divide uma coluna
              alta com o pilar e a folga é composição, não sobra.
              ---------- */}
          {isPrimary ? (
            <div className="flex min-h-0 flex-col justify-start lg:flex-1 lg:justify-center lg:pt-10">
              {/*
                A etiqueta sai no telefone: ela diz o mesmo que o `h1` logo
                abaixo, e os 32px que ocupa eram o que fazia a primeira linha do
                título passar por baixo do cabeçalho. Em desktop sobra altura e
                ela volta, como textura de marca.
              */}
              <p
                className={cn(
                  'hero-seq hidden items-center gap-3 font-condensed text-[0.75rem] font-semibold uppercase leading-none tracking-[0.16em] text-yellow lg:inline-flex',
                  '[--seq:340ms]',
                )}
              >
                <span aria-hidden="true" className="h-[2px] w-8 shrink-0 bg-yellow" />
                {homeHero.eyebrow}
              </p>
              <h1
                id="hero-titulo"
                /*
                  ============================================================
                  DUAS ESCALAS, PORQUE A COLUNA NÃO É A JANELA
                  ============================================================

                  Abaixo de `sm` **não há medida**: o título usa a largura que a
                  caixa tem. `17ch` (o valor do desktop) limitava o título a
                  275px numa caixa de 320px e `21ch` ainda o deixava em quatro
                  linhas em 320 e 360 — quebra por falta de largura concedida,
                  não por falta de espaço, e cada linha extra sai da altura do
                  CTA na dobra fechada. De `sm` para cima a caixa já é larga o
                  bastante para a medida voltar a ser o que controla o
                  comprimento de linha.

                  A partir de `lg` o título vive numa **coluna de ~44% da
                  janela**, não na janela. Amarrá-lo a `5,6vw` media contra ele:
                  em 1024 × 768 o corpo batia no teto de 44px dentro de uma
                  coluna de ~380px, o título ia a **seis linhas** e transbordava
                  por cima do bloco do pilar — as palavras "operação." e
                  "EQUIPAMENTOS" impressas uma sobre a outra. `2,9vw` é a mesma
                  proporção medida contra a coluna: 28px em 1024, 42px em 1440,
                  48px (teto) em 1920, e quatro linhas em todos eles.

                  `19ch` em `lg` e `17ch` a partir de `xl` pela mesma razão: em
                  desktop estreito a coluna precisa de toda a medida que tem.
                */
                className={cn(
                  /*
                    **Sem margem superior abaixo de `lg`.** Ela existe para
                    separar o `h1` da etiqueta institucional — e a etiqueta é
                    `lg:inline-flex`, ou seja, não é sequer um item do flex
                    abaixo desse ponto. No telefone eram 12px de folga contra
                    nada, e 12px numa dobra que fecha na tela são a diferença
                    entre o `h1` começar abaixo do cabeçalho ou por baixo dele.
                  */
                  'hero-seq font-sans font-extrabold leading-[1.08] tracking-[-0.03em] text-canvas lg:mt-5',
                  /*
                    O piso é 1,375rem, não 1,5rem: em 360px o título ficava em
                    **quatro** linhas, e a quarta linha (25px) é exatamente o
                    que faltava para o bloco do pilar caber sem empurrar o `h1`
                    para debaixo do cabeçalho. A 22px ele fecha em três linhas e
                    continua sendo, de longe, o maior corpo da dobra.
                  */
                  'text-[clamp(1.375rem,5.4vw,2.75rem)] sm:max-w-[21ch]',
                  'lg:max-w-[19ch] lg:text-[clamp(1.75rem,2.9vw,3rem)] lg:leading-[1.04] xl:max-w-[17ch]',
                  '[--seq:420ms]',
                )}
              >
                {homeHero.title}
              </h1>
            </div>
          ) : null}

          {/*
            `shrink-0` também aqui, e não só no bloco interno: um `shrink-0`
            aninhado dentro de um pai que encolhe apenas move o transbordo um
            nível para fora. A cadeia inteira do bloco do pilar — numeral, nome,
            pergunta e CTA — é conteúdo de conversão e não cede altura. Quem
            cede é o bloco do título, logo acima, que tem folga de centragem.
          */}
          <div className={cn('flex shrink-0 flex-col', isPrimary && 'lg:pb-2')}>
            {/* ----------
                Numeral do pilar e nome.

                **No telefone o numeral fica na mesma linha do nome; no desktop,
                na linha de cima.** Não é preferência de composição: empilhado,
                o numeral caía dentro da cunha que a diagonal recorta do topo
                dos painéis de sustentação — "02" e "03" simplesmente não
                apareciam. Só "01" sobrevivia, porque o painel de Equipamentos
                não tem corte no topo.

                Numeração pela metade é pior que numeração nenhuma: ela promete
                um sistema e entrega um rótulo solto. Na mesma linha do nome, os
                três aparecem em qualquer largura, e é o mesmo elemento — não há
                numeral duplicado no HTML para o leitor de tela ler duas vezes.
                ---------- */}
            {/*
              O vão entre o `h1` e o nome do pilar mora **aqui**, como margem do
              bloco que não encolhe — e não como `padding` do bloco do título,
              que encolhe. Medido em 390 × 844 com o vão no título: ele era
              consumido pelo `flex-shrink` e a última linha do `h1` chegava a
              **sobrepor** "EQUIPAMENTOS" em 14px. Numa margem de um item
              `shrink-0`, o vão é garantido em qualquer altura de painel.
            */}
            <div
              className={cn(
                'hero-seq flex flex-wrap items-baseline gap-x-3 lg:block',
                isPrimary && 'mt-4 lg:mt-0',
                SEQ_TITLE[position],
              )}
            >
              <span className="font-condensed text-[0.8125rem] font-bold leading-none tracking-[0.08em] text-yellow">
                {pillar.index}
              </span>

              <h2
                className={cn(
                  'font-condensed font-semibold uppercase leading-none tracking-[0.02em] text-canvas lg:mt-3',
                  /*
                    Escala: o nome da frente principal vem num corpo maior. É um
                    dos nove sinais de hierarquia, e um que não depende de cor,
                    opacidade nem área.
                  */
                  isPrimary
                    ? 'text-[clamp(1.75rem,3.4vw,2.75rem)]'
                    : 'text-[clamp(1.375rem,2.1vw,1.875rem)]',
                )}
              >
                {pillar.name}
              </h2>
            </div>

            {/*
              ============================================================
              O BLOCO DE CONVERSÃO NÃO ENCOLHE
              ============================================================

              `shrink-0`, e é a diferença entre o CTA aparecer ou não. Sem ele
              este bloco é um item flex com `min-height: 0` herdado do pai e o
              navegador o comprime abaixo da própria altura de conteúdo quando o
              painel está apertado — a caixa encolhe, o conteúdo **não**, e o
              excedente sai pela base, onde a fotografia do painel seguinte o
              cobre. Medido em 360 × 800: o CTA primário terminava 20px abaixo
              da caixa que deveria contê-lo.

              Quem cede altura, quando falta, é o bloco do título logo acima —
              ele tem folga de centragem; a pergunta e o CTA não têm.
            */}
            <div className={cn('hero-seq flex shrink-0 flex-col', SEQ_BODY[position])}>
              {/*
                A pergunta do cliente — é o que faz o visitante se reconhecer.

                `leading-[1.3]` no telefone e entrelinha normal a partir de `lg`:
                aqui ela quebra em duas linhas em 360px, e as duas linhas com
                entrelinha de leitura corrida custavam ~12px que faltavam para o
                CTA sair de baixo da fotografia do painel seguinte. Numa frase
                de duas linhas em corpo grande a entrelinha fechada não custa
                legibilidade; no desktop, onde a frase é única e o painel é
                alto, ela volta ao normal.
              */}
              <p
                className={cn(
                  'mt-2 font-sans font-semibold leading-[1.3] text-canvas lg:leading-normal',
                  isPrimary ? 'text-[1.0625rem] lg:text-[1.1875rem]' : 'text-[0.9375rem]',
                )}
              >
                {pillar.question}
              </p>

              {/*
                ============================================================
                A PROPOSTA É DE DESKTOP — NOS TRÊS PAINÉIS
                ============================================================

                Ela ganha contraste quando o pilar está em foco (parte da
                resposta ao ponteiro e ao teclado descrita em `globals.css`) e
                nunca desaparece nessa transição: o estado de repouso já é
                legível.

                **Mas ela não existe no telefone, e agora isso vale também para
                Equipamentos.** Os painéis de sustentação já a escondiam; o
                principal a mantinha, e o resultado medido em 390 × 844 foi o
                pior defeito desta dobra: a última linha da proposta saía
                cortada ao meio e **o CTA primário ficava inteiramente fora da
                tela**. Uma primeira dobra de tráfego pago sem o botão de
                conversão é a falha mais cara que esta página pode ter.

                O critério para o corte é qual conteúdo o `h1` já cobre. O
                título diz "Equipamentos para cozinha profissional,
                especificados para a sua operação"; a proposta detalha as seis
                frentes e o critério de dimensionamento. A pergunta do cliente
                fica, porque é ela que produz o reconhecimento e é o que dá
                paralelismo aos três pilares — sem ela o telefone perderia a
                estrutura que faz os três lerem como três portas. As seis
                frentes continuam a um toque, na barra logo abaixo ("Ver as seis
                categorias de equipamento").
              */}
              <p
                className={cn(
                  'mt-2 hidden text-canvas/75 transition-colors duration-200 ease-precise lg:block',
                  'group-hover:text-canvas/95 group-focus-within:text-canvas/95',
                  isPrimary ? 'max-w-[42ch] text-body-sm' : 'max-w-[34ch] text-[0.8125rem] leading-[1.45]',
                )}
              >
                {pillar.proposition}
              </p>

              <div className="mt-2.5 sm:mt-4 lg:mt-5">
                {isPrimary ? (
                  <HeroPrimaryCta label={pillar.cta.label} />
                ) : (
                  <HeroSupportCta label={pillar.cta.label} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------
          O alvo real: cobre o painel inteiro e recebe a forma diagonal do
          `clip-path` do pai. É o único elemento interativo do painel.
          ---------- */}
      <TrackedLink
        href={pillar.cta.href}
        event={pillar.event}
        className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow"
      >
        <span className="sr-only">
          {pillar.name}: {pillar.cta.label}
        </span>
      </TrackedLink>
    </div>
  )
}

/**
 * ============================================================
 * OS CTAs DA DOBRA
 * ============================================================
 *
 * Os dois são `span`, não `a`: quem navega é o link sobreposto ao painel. Eles
 * são a **representação** do alvo — daí todo estado ser dirigido por
 * `group-hover` / `group-focus-within`, e não por `:hover` próprio.
 *
 * **A forma diferencia antes da leitura.** O primário é uma massa preenchida; o
 * de sustentação é contorno. Um visitante que só varre a dobra já sabe qual é o
 * caminho principal sem ler nenhum dos três rótulos.
 *
 * O que os tira do genérico é a **cela da seta**: os dois terminam num quadrado
 * separado do rótulo por um fio, que é onde o movimento acontece. É a mesma
 * gramática de instrumento — mostrador e comando — do resto do vocabulário
 * técnico do site, e não a cápsula com ícone que qualquer biblioteca entrega.
 *
 * Preenchimento por `transform: scaleX` sobre um `::before`, nunca por
 * `width`: é a mecânica de botão fixada em `CLAUDE.md`.
 */
function HeroPrimaryCta({ label }: { label: string }) {
  return (
    <span
      className={cn(
        /* 48px no telefone, 52 a partir de `sm` — o piso de toque são 44px. */
        'relative inline-flex min-h-[3rem] items-stretch overflow-hidden rounded-[2px] bg-yellow sm:min-h-[3.25rem]',
        'font-condensed text-[0.9375rem] font-semibold uppercase tracking-[0.05em] text-ink',
        /*
          O realce do hover é uma camada que cresce de baixo para cima sobre o
          amarelo — `scaleY` num `::before`, não troca de `background-color`:
          a transição de cor lê como piscada, a que cresce lê como pressão.
        */
        'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-yellow-bright',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'group-hover:before:scale-y-100 group-focus-within:before:scale-y-100',
      )}
    >
      <span className="relative z-10 flex items-center px-6">{label}</span>
      {/* Cela da seta: separada do rótulo por um fio de tinta, não por espaço. */}
      <span
        aria-hidden="true"
        className="relative z-10 flex w-[3.25rem] shrink-0 items-center justify-center border-l border-ink/20"
      >
        <ArrowRightIcon
          size={18}
          className="transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-within:translate-x-1"
        />
      </span>
    </span>
  )
}

function HeroSupportCta({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex min-h-[2.75rem] items-stretch overflow-hidden rounded-[2px] sm:min-h-[2.875rem]',
        /*
          Contorno, não sublinhado. Como sublinhado eles liam como "links
          esquecidos no pé do painel": nenhuma caixa, nenhuma área declarada,
          nenhuma promessa de que ali há uma ação. Com contorno a dobra passa a
          ter três ações com forma — uma preenchida e duas de contorno.
        */
        /*
          Um degrau de corpo menor em `lg`, voltando ao normal em `xl`: é o que
          mantém "Falar com um projetista" e "Agendar diagnóstico" em uma linha
          na faixa de desktop estreito, onde a caixa do painel de sustentação é
          a mais apertada da composição.
        */
        'border border-canvas/35 font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-canvas xl:text-[0.8125rem]',
        'transition-colors duration-200 ease-precise group-hover:border-canvas/70 group-focus-within:border-canvas/70',
        /* Preenchimento por `scaleX` a partir da borda de ataque. */
        'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-canvas/[0.12]',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'group-hover:before:scale-x-100 group-focus-within:before:scale-x-100',
      )}
    >
      {/*
        Fio amarelo na borda de ataque: é o que amarra os dois CTAs de
        sustentação ao mesmo sistema do primário sem lhes dar preenchimento —
        amarelo como hairline, não como massa.
      */}
      <span aria-hidden="true" className="relative z-10 w-[3px] shrink-0 bg-yellow" />
      <span className="relative z-10 flex items-center px-3 xl:px-4">{label}</span>
      <span
        aria-hidden="true"
        className="relative z-10 flex w-10 shrink-0 items-center justify-center border-l border-canvas/25 xl:w-11"
      >
        <ArrowRightIcon
          size={16}
          className="text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-within:translate-x-1"
        />
      </span>
    </span>
  )
}
