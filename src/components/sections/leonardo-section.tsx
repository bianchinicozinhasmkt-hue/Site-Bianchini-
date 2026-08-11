import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { leonardo } from '@/data/leonardo'

/**
 * ============================================================
 * A TESE — E SÓ A TESE (consolidação de 2026-08-10)
 * ============================================================
 *
 * Até esta rodada a seção era **duas coisas ao mesmo tempo**: a tese de
 * trabalho de Leonardo e um dossiê biográfico comprimido — retrato de busto,
 * três parágrafos de biografia, quatro marcos de trajetória, três frentes de
 * atuação e uma menção ao livro. O dossiê era o problema: `#quem-conduz`, logo
 * abaixo, publica as mesmas credenciais em bullets, e `/leonardo-bianchini`
 * publica a versão completa (6 marcos de trajetória contra 4, `skillMap` de 11
 * frentes contra 3). A home tinha um resumo da página interna colado ao lado de
 * uma seção que dizia o mesmo em outro formato.
 *
 * Depois que `#credibilidade` desceu para depois de `#quem-conduz`, as duas
 * seções de autoridade ficaram adjacentes e a repetição virou leitura direta:
 * o **mesmo arquivo** de retrato duas vezes em 600px de desktop e 2.100px de
 * telefone, e o livro citado aqui para ser mostrado inteiro logo abaixo.
 *
 * A divisão passou a ser:
 *
 *   `#leonardo` ...... por que essa forma de pensar a cozinha é diferente
 *   `#quem-conduz` ... quem responde hoje pelas frentes contratadas
 *   `#credibilidade` . a prova — números, marcas e depoimentos
 *
 * O que saiu daqui, e por quê:
 *
 *   · **retrato de busto** — `leonardo-bianchini.png` continua na home, uma vez
 *     só, em `#quem-conduz`, que é a seção do par de responsáveis e onde a
 *     paridade com Guilherme depende dos dois retratos lado a lado. Nenhuma
 *     fotografia entrou no lugar: os `fieldRecords` de `leonardo.ts` são
 *     recortes de ~190px nativos, marcados no próprio dado como pendentes de
 *     fotografia profissional, e não sustentam um slot grande.
 *   · **trajetória (4 marcos)** e **frentes de atuação (3 competências)** —
 *     restadas como bullets em `#quem-conduz` e publicadas completas em
 *     `/leonardo-bianchini`, alcançável pelo CTA que continua no fim desta
 *     seção. Nenhum dado foi apagado: `leonardo.trajectory`, `home.competencies`
 *     e `skillMap` seguem intactos e em uso na página interna.
 *   · **link "Autor de…"** — o livro passou a viver aqui, então o link virou
 *     auto-referência.
 *   · **primeiro parágrafo de `home.paragraphs`** — "atua no setor … desde
 *     2008, conectando conhecimento técnico, operação, equipamentos e estratégia
 *     comercial" é trajetória e enumeração de competências, as duas restadas nos
 *     bullets de `#quem-conduz`. O marco temporal não se perdeu: "No setor desde
 *     2008" continua na assinatura, logo acima. Os parágrafos 2 e 3 ficam
 *     inteiros e **não foram reescritos** — o 2 define a visão integrada e o 3 é
 *     o que a liga ao método da Bianchini, que é a razão da seção existir.
 *
 * ============================================================
 * COMPOSIÇÃO — A TESE DOMINA, O LIVRO APOIA
 * ============================================================
 *
 * Sem o retrato, a tese ocupa a largura inteira em vez de sete das doze
 * colunas: o H2 em `text-display` é o maior elemento da seção e nada disputa com
 * ele. O espaço aberto **não foi preenchido** — não entrou textura, citação
 * decorativa, ícone nem cartão. O que existe abaixo do enunciado é uma banda de
 * duas colunas: a visão à esquerda, o livro à direita, em escala subordinada.
 *
 * A **assinatura perdeu a superfície** e virou linha editorial sobre hairline.
 * A faixa `bg-graphite-soft` existia para atravessar a base do retrato e costurar
 * os dois planos da composição antiga; sem retrato, ela seria só uma barra cinza
 * flutuando. As três informações — nome, papel e "No setor desde 2008" — são as
 * mesmas, na mesma ordem.
 *
 * O **livro entra como prova da tese**, não como anúncio: sem moldura, sem
 * sombra, sem CTA de compra (`book.purchaseUrl` continua `null`), separado por
 * hairline e com a capa em escala menor que a do bloco anterior. A ordem de
 * leitura no telefone é tese → visão → livro → CTA, que é a progressão do
 * argumento: o livro é a evidência de que essa forma de pensar foi
 * sistematizada, e o CTA leva a quem quer a trajetória inteira.
 *
 * `id="livro"` mora aqui agora — é destino de `/#livro` (`data/industry.ts`) e
 * é a **única** ocorrência na home. Mover o bloco sem mover a âncora quebraria
 * o link do inox.
 *
 * O fragmento de documento ao fundo continua: ele nunca ocupou o lugar do
 * retrato (fica no canto superior direito, o retrato ficava à esquerda) e é a
 * única variação de textura do grafite. Sem ele a seção fica chapada.
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
        Encontro com `#quem-conduz` remedido nesta rodada — ver o `pt` e a régua
        em `leadership-section.tsx`. A seção encolheu bastante, então os valores
        da rodada anterior não foram preservados por já terem sido ajustados:
        foram medidos de novo contra as alturas novas.
      */
      className="relative isolate overflow-hidden pb-10 md:pb-12 lg:pb-12"
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
            O ENUNCIADO E O ARGUMENTO, LADO A LADO (2026-08-11)
            ==========================================================

            A composição anterior era vertical: enunciado em largura inteira,
            assinatura em largura inteira, e só então uma banda de duas colunas
            com a visão à esquerda e o livro à direita. Com o livro fora daqui
            (ver o bloco abaixo), a coluna da direita ficaria **vazia** e a seção
            voltaria a ser o que a rodada anterior corrigiu em `#quem-conduz`:
            uma metade de tela com texto e a outra com grafite.

            Medido em 1440 × 900 antes desta rodada: o título de `display`
            terminava em x=690 e nada ocupava os 690px seguintes até a margem —
            e, mais abaixo, os parágrafos terminavam em x=620 com a mesma sobra.
            Duas faixas de vazio à direita, uma sobre a outra.

            Agora é um **spread editorial**: o enunciado (etiqueta → título de
            `display` → assinatura) ocupa as colunas 1–6 e o argumento (lead +
            os dois parágrafos) as colunas 8–12, alinhados pelo topo. A seção
            passa a compor a tela nos dois eixos, e o vazio que sobra fica onde
            vazio funciona — abaixo, antes do CTA.
            ========================================================== */}
        <div className="grid gap-x-10 gap-y-9 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-6">
            {/*
              `thesis.eyebrow` ("Tese de trabalho"), e não `home.eyebrow`
              ("Quem conduz o diagnóstico").

              ----------
              A DUPLICAÇÃO DE RÓTULO (2026-08-11)
              ----------

              Esta seção e `#quem-conduz`, imediatamente abaixo e no mesmo
              grafite, abriam **as duas** anunciando quem conduz: "QUEM CONDUZ O
              DIAGNÓSTICO" aqui e "QUEM CONDUZ" ali. Era essa a "duplicação
              perceptiva" relatada — dois cabeçalhos consecutivos prometendo a
              mesma coisa e entregando conteúdos diferentes, o que faz o leitor
              procurar a relação entre eles em vez de ler o argumento.

              A correção não inventa copy: `leonardo.thesis.eyebrow` já existe em
              `src/data/leonardo.ts` desde antes desta rodada, foi escrita para
              este bloco e é o rótulo correto — a seção **é** a tese, e o título
              que ela já usava (`thesis.title`) vem do mesmo objeto. O que havia
              era um par etiqueta/título de origens trocadas.

              Com a troca, as duas seções passam a dizer coisas diferentes:
              `#leonardo` é a tese, `#quem-conduz` são as pessoas.
            */}
            <Eyebrow tone="light" as="p">
              {leonardo.thesis.eyebrow}
            </Eyebrow>

            <h2
              id="leonardo-titulo"
              className="mt-5 max-w-[16ch] font-sans font-extrabold text-display text-canvas"
            >
              {leonardo.thesis.title}
            </h2>

            {/* ----------
                Assinatura: linha editorial sobre hairline, não faixa com
                superfície própria. Mesmas três informações da versão anterior —
                nome, papel e o marco temporal, que é dado único da home.
                ---------- */}
            <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-white/15 pt-5">
              <span className="font-sans text-title-3 font-bold text-canvas">{leonardo.name}</span>
              <span className="text-body-sm text-canvas/70">{leonardo.role}</span>
              <span className="font-condensed text-caption uppercase tracking-[0.08em] text-yellow">
                No setor desde {leonardo.since}
              </span>
            </div>
          </Reveal>

          {/* ----------
              O argumento. `lg:pt-*` alinha a primeira linha do lead com a
              primeira linha do título de `display`, e não com o topo da caixa
              dele: as duas colunas têm corpos muito diferentes e alinhar
              caixas deixaria o lead visivelmente alto.
              ---------- */}
          <Reveal variant="side" className="lg:col-span-5 lg:col-start-8 lg:pt-14">
            <p className="max-w-[46ch] text-lead text-canvas/85">{leonardo.thesis.lead}</p>

            <div className="mt-6 flex flex-col gap-4 text-body-sm text-canvas/75">
              {/*
                `slice(1)`: o primeiro parágrafo é trajetória e enumeração de
                competências, as duas restadas nos bullets de `#quem-conduz`. Os
                dois que ficam são a visão integrada e a ligação dela com o
                método — o argumento desta seção. O dado não foi tocado.
              */}
              {leonardo.home.paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph} className="max-w-[52ch]">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ==========================================================
            O LIVRO SAIU DAQUI, E VOLTOU PARA JUNTO DO RETRATO (2026-08-11)
            ==========================================================

            O bloco completo — capa, `eyebrow`, `headline`, `relation`, selo e a
            âncora `id="livro"` — foi para o dossiê de Leonardo em
            `#quem-conduz` (`leadership-section.tsx`). Ele já tinha morado lá
            até 2026-08-10, e a volta é pedido explícito do gestor nesta rodada:
            "fazer a referência ao livro acontecer junto à foto principal do
            Leonardo, de forma coerente e integrada".

            A razão de composição confirma o pedido. Aqui o livro era **um
            objeto solto**: uma capa de 160px com quatro linhas de texto ao lado,
            numa coluna própria, sem relação visual com nada em volta — "o livro
            parece um elemento separado demais", nas palavras do briefing. E era
            a terceira aparição de Leonardo em menos de 1.200px de rolagem, já
            que a capa traz uma fotografia dele: cena de Consultoria na primeira
            dobra, capa aqui, retrato logo abaixo.

            Junto do retrato ele deixa de ser objeto e passa a ser **credencial**:
            a capa fica ao lado da pessoa que a assina, o `relation` explica a
            ligação com o método, e as duas coisas se sustentam mutuamente em vez
            de disputar. De quebra resolve o vazio medido no dossiê de Leonardo
            (~288px de grafite morto sob os bullets).

            `id="livro"` foi junto — é destino de `/#livro` (`data/industry.ts`)
            e continua sendo a **única** ocorrência na home.
            ========================================================== */}

        {/*
          O CTA fecha a seção, depois do argumento: tese → visão → quem quiser a
          trajetória inteira vai para a página dela.
        */}
        <Reveal className="mt-12 lg:mt-14">
          <LinkButton href={leonardo.home.cta.href} variant="light-outline" size="md" withArrow>
            {leonardo.home.cta.label}
          </LinkButton>
        </Reveal>
      </Container>
    </Section>
  )
}
