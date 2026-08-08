import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Eyebrow } from '@/components/ui/typography/heading'
import { ArrowRightIcon } from '@/components/ui/icons'
import { TrackedLink } from '@/components/v2/tracked-link'
import { heroPillars, homeHero, type HeroPillar } from '@/data/v2/home'
import { cn } from '@/lib/utils'
import styles from './hero-pillars.module.css'

/**
 * ============================================================
 * PRIMEIRA DOBRA — UMA CENA, TRÊS PORTAS
 * ============================================================
 *
 * **É a única área redesenhada do site.** Tudo abaixo dela é V1, restaurado a
 * partir de `v1-final`; lá só a ordem das seções mudou. Esta dobra e o seu
 * `hero-pillars.module.css` são o escopo inteiro da V2 na home.
 *
 * Não é uma faixa de três cartões — é **uma composição cortada em três**, na
 * linguagem diagonal da V1 (a aresta em `clip-path` e a keyline amarela
 * paralela vêm de lá). Geometria e motion vivem no módulo CSS ao lado; aqui
 * ficam estrutura, hierarquia e copy.
 *
 * ============================================================
 * A ORDEM VISUAL É PROJETOS | EQUIPAMENTOS | CONSULTORIA
 * ============================================================
 *
 * Equipamentos ocupa **o centro**. A composição anterior o punha à esquerda com
 * 44% da largura contra 28% e 28%, e o resultado era um painel principal com
 * dois anexos. Aqui as áreas são 31,5% / 37% / 31,5% — a frente principal é
 * 1,17× um pilar de sustentação, não 1,57× —, e os dois de sustentação têm área
 * idêntica: lêem como um par de portas, não como segundo e terceiro lugares.
 *
 * ============================================================
 * COMO EQUIPAMENTOS LIDERA SEM FOTOGRAFIA PRIVILEGIADA
 * ============================================================
 *
 * Nenhuma das três imagens é mais clara, mais saturada, mais opaca ou menos
 * coberta que as outras — o scrim é literalmente a mesma regra nos três. A
 * liderança vem de sete vias, e nenhuma delas é manipulação de imagem:
 *
 *   1. posição ......... o centro é onde o olho entra numa composição
 *                        simétrica, e para onde ele volta
 *   2. ordem no DOM .... primeiro no código, primeiro no `Tab`, primeiro para
 *                        o leitor de tela (ver nota abaixo)
 *   3. `h1` ............ é o único painel que carrega o título da página
 *   4. etiqueta ........ é o único que carrega a identificação do setor
 *   5. escala .......... a linha de intenção vem num corpo maior que a dos
 *                        outros dois
 *   6. forma do CTA .... único preenchido; os outros dois são contorno. A forma
 *                        diferencia antes de o rótulo ser lido
 *   7. keyline ......... o traço amarelo emoldura as duas fronteiras dele, e só
 *                        as dele
 *
 * A área entra como oitavo sinal, e é de propósito o mais fraco: 37% contra
 * 31,5% não sustentaria a hierarquia sozinho, e não precisa.
 *
 * **Sobre a ordem no DOM.** Ela não acompanha a ordem visual da esquerda para a
 * direita, e isso é uma escolha: o painel central é o que carrega o `h1` e a
 * ação primária, então é ele que deve chegar primeiro ao teclado e ao leitor de
 * tela. No empilhamento do telefone as duas ordens coincidem — Equipamentos é o
 * primeiro da pilha.
 *
 * ============================================================
 * OS TRÊS SÃO COMPREENDIDOS SEM INTERAÇÃO
 * ============================================================
 *
 * Nome, intenção e CTA de cada pilar estão visíveis no estado inicial, em todas
 * as larguras. O realce de foco muda proporção e enquadramento, nunca presença
 * — e é CSS puro (`:has()`), então funciona antes da hidratação e continua
 * funcionando com JavaScript desligado.
 *
 * **Uma linha de intenção por pilar, e nada mais.** A composição anterior
 * carregava numeral, etiqueta, pergunta do cliente, proposta longa, uma barra
 * de métricas e uma ação secundária — a dobra lia como documento técnico. Aqui
 * cada pilar é nome + uma frase + ação; só Equipamentos ganha etiqueta e `h1`,
 * e o nome dele não se repete acima do título porque o próprio `h1` começa por
 * ele.
 *
 * ============================================================
 * CADA PAINEL É UMA ÁREA CLICÁVEL INTEIRA
 * ============================================================
 *
 * O alvo é um link sobreposto ao painel inteiro; o CTA visível é a representação
 * dele, não um segundo controle. Como o `clip-path` recorta também o teste de
 * clique, a área sensível assume a forma diagonal do painel — não um retângulo
 * invadindo o vizinho. **Um alvo interativo por painel**: é o que permite a área
 * cheia sem aninhar link dentro de link e sem que o mesmo destino apareça duas
 * vezes na navegação por teclado.
 *
 * ============================================================
 * A DOBRA É A JANELA INTEIRA
 * ============================================================
 *
 * `pt-[var(--header-height)]` na seção e `h-[calc(100svh-var(--header-height))]`
 * no palco — o mesmo par que a dobra da V1 usa (`hero-section.tsx`). Cabeçalho
 * V1 + hero somam exatamente uma tela, sem teto em `rem` e sem conteúdo em fluxo
 * empurrando por baixo. `svh`, e não `vh`: no telefone `vh` ignora a barra de
 * endereço retrátil e a dobra fica maior que a tela justamente no carregamento.
 *
 * Abaixo de `lg` o palco tem **piso**, não altura fixa: os três pilares mantêm
 * intenção e CTA, e é preferível rolar alguns pixels a cortar um botão de
 * conversão.
 */
export function HeroPillars() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className={cn(styles.hero, 'relative isolate bg-graphite pt-[var(--header-height)]')}
    >
      <div
        className={cn(
          styles.stage,
          'flex min-h-[calc(100svh-var(--header-height))] flex-col',
          'lg:block lg:h-[calc(100svh-var(--header-height))] lg:min-h-[30rem]',
        )}
      >
        {heroPillars.map((pillar) => (
          <HeroPanel key={pillar.id} pillar={pillar} />
        ))}

        {/* ----------
            Keylines amarelas nas duas fronteiras de Equipamentos. Acento pleno
            porque o fundo é grafite — a restrição de 1,4:1 do sistema vale para
            superfície clara, não para esta.
            ---------- */}
        <span
          aria-hidden="true"
          style={{ '--seq': '620ms' } as CSSProperties}
          className={cn(styles.keyline, styles.keylineLeft, 'z-[6] hidden bg-yellow lg:block')}
        />
        <span
          aria-hidden="true"
          style={{ '--seq': '720ms' } as CSSProperties}
          className={cn(styles.keyline, styles.keylineRight, 'z-[6] hidden bg-yellow lg:block')}
        />

        {/* ----------
            Cortina de entrada: uma aresta com a inclinação das fronteiras,
            correndo uma vez só no carregamento. Atravessa os três painéis, então
            a ordem de revelação sai da própria geometria — Projetos primeiro,
            Consultoria por último. Não há três cortinas.

            Acima das fotografias e das keylines, abaixo do alvo de clique
            (`z-20`), para nunca interceptar um toque.
            ---------- */}
        <span aria-hidden="true" className={styles.curtain} />
      </div>
    </section>
  )
}

/**
 * Atrasos da entrada escalonada. A cortina passa entre 140ms e 1.180ms, e cada
 * painel só começa a entrar depois de a aresta ter passado por cima dele — é o
 * que faz a revelação ler como uma coisa só, e não como duas animações
 * concorrentes. Projetos vem primeiro porque é o painel da esquerda.
 *
 * `--seq` e `.hero-seq` são o vocabulário de motion que a V1 já definiu em
 * `globals.css`. Reaproveitados, não duplicados.
 */
const SEQ: Record<HeroPillar['id'], { name: string; body: string }> = {
  projetos: { name: '440ms', body: '560ms' },
  equipamentos: { name: '580ms', body: '700ms' },
  consultoria: { name: '760ms', body: '880ms' },
}

const PANEL_CLASS: Record<HeroPillar['id'], string> = {
  equipamentos: styles.panelEquipamentos,
  projetos: styles.panelProjetos,
  consultoria: styles.panelConsultoria,
}

const BOX_CLASS: Record<HeroPillar['id'], string> = {
  equipamentos: styles.boxEquipamentos,
  projetos: styles.boxProjetos,
  consultoria: styles.boxConsultoria,
}

/**
 * Recorte da caixa da fotografia à região do painel. Só existe a partir de
 * `lg`; no empilhamento cada painel já é a própria caixa. A justificativa está
 * no módulo CSS — sem isto, `cover` enquadra contra o palco inteiro e `sizes`
 * descreve uma caixa que não é a real.
 */
const MEDIA_CLASS: Record<HeroPillar['id'], string> = {
  equipamentos: styles.mediaEquipamentos,
  projetos: styles.mediaProjetos,
  consultoria: styles.mediaConsultoria,
}

/**
 * Largura da caixa de cada painel, para o navegador escolher a variante certa.
 * Os valores são as larguras reais declaradas em `.media*` no módulo CSS —
 * 47% no centro, 38% em cada pilar de sustentação. Ao mexer naqueles limites,
 * atualize aqui.
 */
const SIZES: Record<HeroPillar['id'], string> = {
  equipamentos: '(max-width: 1023px) 100vw, 47vw',
  projetos: '(max-width: 1023px) 100vw, 38vw',
  consultoria: '(max-width: 1023px) 100vw, 38vw',
}

const PHOTO_CLASS: Record<HeroPillar['id'], string> = {
  equipamentos: styles.photoEquipamentos,
  projetos: styles.photoProjetos,
  consultoria: styles.photoConsultoria,
}

/**
 * Proporção do empilhamento móvel: `flex-grow` sobre `flex-basis` automático,
 * mais um piso por painel. Os três dividem a altura disponível, e o piso é o que
 * garante que nenhum deles fique menor que o próprio bloco de conversão —
 * `grow` sozinho reparte sobra, não protege conteúdo.
 */
const MOBILE_SIZE: Record<HeroPillar['id'], string> = {
  equipamentos: 'grow-[1.5] min-h-[20.5rem]',
  projetos: 'grow-[1] min-h-[14rem]',
  consultoria: 'grow-[1] min-h-[14rem]',
}

function HeroPanel({ pillar }: { pillar: HeroPillar }) {
  const isPrimary = pillar.id === 'equipamentos'
  const seq = SEQ[pillar.id]

  return (
    <div
      className={cn(
        styles.panel,
        'group relative flex w-full flex-col justify-end',
        MOBILE_SIZE[pillar.id],
        PANEL_CLASS[pillar.id],
        'lg:absolute lg:inset-0 lg:block lg:min-h-0 lg:grow-0',
      )}
    >
      {/* ---------- Fotografia ---------- */}
      <div className={cn('absolute inset-0 overflow-hidden', MEDIA_CLASS[pillar.id])}>
        <Image
          src={pillar.media.src}
          alt={pillar.media.alt}
          fill
          priority={isPrimary}
          /*
            `eager` nos dois de sustentação: eles estão na primeira dobra em toda
            largura, então não há nada a adiar. `priority` já implica `eager` no
            principal, e passar os dois juntos emite aviso do `next/image`.
          */
          loading={isPrimary ? undefined : 'eager'}
          /*
            Mesma qualidade nos três — qualidade diferente por painel seria mais
            uma forma de privilegiar Equipamentos por tratamento de imagem. 86
            consta de `images.qualities` em `next.config.ts`; fora da lista o
            otimizador responde 400 e a imagem some sem erro de build e sem aviso
            em produção.
          */
          quality={86}
          /*
            ============================================================
            UM `sizes` POR PAINEL, MEDIDO NA CAIXA DE CADA UM
            ============================================================

            As caixas não têm a mesma largura (47% no centro, 38% nos dois de
            sustentação), e um valor único para os três tem custo real. Com
            `48vw` em todos, a 1920px o navegador chegou a pedir a variante de
            **3840px** para o painel de Consultoria: um PNG de 1,8 MB
            reprocessado no maior tamanho da lista, para preencher uma caixa de
            730px. Somado às ~20 otimizações que a home dispara na primeira
            visita, o pedido ficava na fila e o painel **aparecia preto** —
            medido em produção, não em desenvolvimento.

            Com a medida certa, os dois painéis laterais caem para a variante de
            828px e o central para a de 1080px.
          */
          sizes={SIZES[pillar.id]}
          style={{ objectPosition: pillar.media.objectPosition }}
          className={cn('object-cover', styles.photo, PHOTO_CLASS[pillar.id])}
        />

        {/*
          Scrim local: fecha na base, onde o texto assenta, e desaparece antes da
          meia-altura. A metade de cima de cada painel fica sem cobertura nenhuma
          — é o que devolve o inox, a textura e a profundidade que o véu uniforme
          da composição anterior apagava.
        */}
        <span aria-hidden="true" className={styles.scrim} />
        <span aria-hidden="true" className={styles.capline} />
      </div>

      {/* ---------- Conteúdo (não recebe clique: o alvo é o link ao fim) ---------- */}
      <div
        className={cn(
          /*
            `lg:inset-y-0`, **nunca `lg:inset-0`**: o `left`/`right` de cada caixa
            vem do módulo CSS, que é o que a mantém dentro da zona segura da
            diagonal. `inset-0` tem a mesma especificidade e é emitido depois,
            então zeraria os dois lados e as três caixas passariam a ocupar a
            composição inteira. `lg:w-auto` pelo mesmo motivo: num elemento
            absoluto com `left` e `right` declarados, `width: 100%` vence os dois.
          */
          'pointer-events-none relative z-10 flex w-full flex-col justify-end',
          'lg:absolute lg:inset-y-0 lg:w-auto',
          'px-5 pb-6 md:px-8 lg:px-0 lg:pb-[7vh]',
          /*
            Folga para a cunha diagonal do encaixe móvel. Ela existe só onde a
            aresta corre por cima do conteúdo — no topo dos dois painéis de
            sustentação. Numa dobra apertada, folga desnecessária sai da altura
            de algum pilar.
          */
          isPrimary ? 'pt-6' : 'pt-[calc(var(--mcut)+0.75rem)] lg:pt-0',
          BOX_CLASS[pillar.id],
        )}
      >
        {/*
          O bloco do título é **ancorado na base**, junto do bloco de conversão —
          não centrado na altura do painel. Centrado, em 1920 × 1080 sobravam
          ~200px de vão entre o `h1` e a linha de intenção, e o título lia como
          legenda solta no meio da fotografia. Ancorado, os três painéis
          compartilham a mesma linha de base e a folga toda vai para cima, onde
          está a imagem — que é o que a dobra quer mostrar.
        */}
        {isPrimary ? (
          <div className="flex flex-col justify-end">
            {/*
              A etiqueta identifica o setor — quarto sinal de hierarquia, e
              nenhum outro painel a tem. Sai abaixo de `sm`, onde os ~32px que
              ela ocupa fazem falta ao bloco de conversão.

              O `--seq` vive no wrapper porque `Eyebrow` é um primitive da V1 e
              não aceita `style` — e alterá-lo seria mexer num componente V1.

              O wrapper é `div`, e **não `span`**: `Eyebrow` renderiza um `<p>`
              aqui, e `<p>` dentro de `<span>` é HTML inválido. O parser do
              navegador move o parágrafo para fora do `span`, a árvore do
              cliente deixa de bater com a do servidor e o React derruba a
              hidratação da página inteira com "server rendered text didn't
              match the client".
            */}
            <div
              className="hero-seq hidden sm:block"
              style={{ '--seq': '340ms' } as CSSProperties}
            >
              {/*
                Um degrau menor até `xl`: em 1024 × 768 a caixa do painel
                central tem ~330px e a etiqueta quebrava em duas linhas, com o
                traço sobrando na primeira. Etiqueta de duas linhas lê como
                erro, não como composição.
              */}
              <Eyebrow
                tone="light"
                as="p"
                className="text-[0.625rem] tracking-[0.13em] xl:text-[0.6875rem] xl:tracking-[0.16em]"
              >
                {homeHero.eyebrow}
              </Eyebrow>
            </div>

            <h1
              id="hero-titulo"
              style={{ '--seq': '420ms' } as CSSProperties}
              /*
                Duas escalas, porque a coluna não é a janela. A partir de `lg` o
                título vive numa coluna de ~37% da largura da janela: amarrá-lo a
                `vw` da janela o levaria a seis linhas em 1024px, transbordando
                por cima do bloco de conversão. `2,45vw` é a mesma proporção
                medida contra a coluna — 25px em 1024, 35px em 1440 e 44px (teto)
                em 1920.
              */
              className={cn(
                'hero-seq mt-3 font-sans font-extrabold leading-[1.08] tracking-[-0.03em] text-canvas',
                'text-[clamp(1.5rem,5.6vw,2.5rem)] sm:max-w-[20ch]',
                'lg:mt-4 lg:max-w-[17ch] lg:text-[clamp(1.5rem,2.45vw,2.75rem)] lg:leading-[1.05]',
              )}
            >
              {homeHero.title}
            </h1>
          </div>
        ) : null}

        {/*
          O bloco de conversão não encolhe. Sem `shrink-0` o navegador o comprime
          abaixo da própria altura de conteúdo quando o painel está apertado — a
          caixa encolhe, o conteúdo não, e o excedente sai pela base, onde a
          fotografia do painel seguinte o cobre. Quem cede altura é o bloco do
          título, que tem folga de centragem.
        */}
        <div className={cn('flex shrink-0 flex-col', isPrimary && 'lg:pt-6')}>
          {isPrimary ? null : (
            <h2
              style={{ '--seq': seq.name } as CSSProperties}
              className="hero-seq font-condensed text-[clamp(1.5rem,2.3vw,2rem)] font-semibold uppercase leading-none tracking-[0.02em] text-canvas"
            >
              {pillar.name}
            </h2>
          )}

          <div
            style={{ '--seq': seq.body } as CSSProperties}
            className="hero-seq flex shrink-0 flex-col"
          >
            {/*
              Uma linha de intenção, e só. É o que faz o visitante se reconhecer
              sem transformar a dobra em documento técnico. O corpo maior no
              painel central é o quinto sinal de hierarquia.
            */}
            <p
              className={cn(
                'font-sans font-medium text-canvas/85',
                isPrimary
                  ? 'mt-4 max-w-[44ch] text-[0.9375rem] leading-[1.5] lg:text-[1.0625rem]'
                  : 'mt-2.5 max-w-[30ch] text-[0.875rem] leading-[1.45] lg:text-[0.9375rem]',
              )}
            >
              {pillar.intent}
            </p>

            <div className="mt-4 lg:mt-6">
              {isPrimary ? (
                <HeroPrimaryCta label={pillar.cta.label} />
              ) : (
                <HeroSupportCta label={pillar.cta.label} />
              )}
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
 * de sustentação é contorno com um fio amarelo na borda de ataque. Quem só varre
 * a dobra já sabe qual é o caminho principal sem ler nenhum dos três rótulos — e
 * os dois secundários continuam tendo caixa, área e presença suficientes para
 * não lerem como link esquecido no pé do painel.
 *
 * O que os tira do genérico é a **cela da seta**: os dois terminam num quadrado
 * separado do rótulo por um fio, que é onde o movimento acontece. É a gramática
 * de instrumento — mostrador e comando — do resto do vocabulário do site, e não
 * a cápsula com ícone que qualquer biblioteca entrega.
 *
 * Preenchimento por `transform: scaleX/scaleY` sobre um `::before`, nunca por
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
          amarelo — `scaleY` num `::before`, não troca de `background-color`: a
          transição de cor lê como piscada, a que cresce lê como pressão.
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
        'relative inline-flex min-h-[2.875rem] items-stretch overflow-hidden rounded-[2px]',
        'border border-canvas/40 font-condensed text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-canvas',
        'transition-colors duration-200 ease-precise group-hover:border-canvas/75 group-focus-within:border-canvas/75',
        /* Preenchimento por `scaleX` a partir da borda de ataque. */
        'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-canvas/[0.14]',
        'before:transition-transform before:duration-[220ms] before:ease-precise before:content-[""]',
        'group-hover:before:scale-x-100 group-focus-within:before:scale-x-100',
      )}
    >
      {/*
        Fio amarelo na borda de ataque: amarra os dois CTAs de sustentação ao
        mesmo sistema do primário sem lhes dar preenchimento — amarelo como
        hairline, não como massa.
      */}
      <span aria-hidden="true" className="relative z-10 w-[3px] shrink-0 bg-yellow" />
      <span className="relative z-10 flex items-center px-3.5">{label}</span>
      <span
        aria-hidden="true"
        className="relative z-10 flex w-11 shrink-0 items-center justify-center border-l border-canvas/25"
      >
        <ArrowRightIcon
          size={16}
          className="text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-within:translate-x-1"
        />
      </span>
    </span>
  )
}
