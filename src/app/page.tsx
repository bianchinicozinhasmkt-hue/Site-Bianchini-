import Link from 'next/link'
import { HeroStage } from '@/components/v2/hero-stage'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { PillarsSection } from '@/components/sections/pillars-section'
import { SymptomsSection } from '@/components/sections/symptoms-section'
import { DiagnosisSection } from '@/components/sections/diagnosis-section'
import { ScopeTriadBand } from '@/components/sections/scope-triad-band'
import { IndustryInoxSection } from '@/components/sections/industry-inox-section'
import { JourneySection } from '@/components/sections/journey-section'
import { LeonardoSection } from '@/components/sections/leonardo-section'
import { CredibilitySection } from '@/components/sections/credibility-section'
import { LeadershipSection } from '@/components/sections/leadership-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'

/**
 * ============================================================
 * HOME = HERO V2 + SITE V1, E SÓ A ORDEM MUDOU
 * ============================================================
 *
 * Esta página tem **duas** áreas redesenhadas: a primeira dobra (`HeroStage`) e
 * a ponte `#transicao` (`ScopeTriadBand`), reduzida em 2026-08-10 de um segundo
 * método a um fecho editorial de capítulo — ver o bloco desta rodada, abaixo.
 * As outras onze seções são as **mesmas da V1**, nos mesmos componentes, com o
 * mesmo layout, a mesma tipografia, o mesmo motion e o mesmo comportamento
 * responsivo de `v1-final`. Nenhuma delas foi redesenhada, refatorada,
 * harmonizada com a hero ou convertida em componente V2 — `#leonardo`,
 * `#quem-conduz` e `#credibilidade` receberam apenas ajuste de espaçamento de
 * encontro, sem tocar em conteúdo, composição ou dados.
 *
 * Os componentes V2 que já ocuparam esta página — `CategoriesShowcase`,
 * `PillarsBand`, `ProjectsDoor`, `ConsultingDoor`, `ProofSection`,
 * `AuthorityBand`, `FinalCta` — continuam no repositório, em
 * `src/components/v2/`, e **fora da montagem**. `ClosingCta` também: foi
 * criado e montado em 2026-08-08 no lugar de `FinalCtaSection` sem
 * autorização, e a restauração da baseline em 2026-08-08 devolveu o
 * fechamento ao componente V1. Nenhuma faixa de confiança,
 * grade de benefícios ou métrica nova ficou entre a hero e a primeira seção V1:
 * terminada a dobra, começa `EquipmentStripSection`.
 *
 * ============================================================
 * A ORDEM — O FUNIL, E NÃO O HISTÓRICO DE EDIÇÃO
 * ============================================================
 *
 *   1  hero V2 ........... graphite     · NECESSIDADE: um palco, três estados
 *   2  **equipamentos** .. graphite-soft· EQUIPAMENTOS — a frente principal, na segunda seção
 *   3  projetos .......... surface      · PROVA da frente acima: operações construídas
 *   4  **as três frentes** canvas       · PROJETOS e CONSULTORIA nomeadas, com porta própria
 *   5  sintomas .......... graphite     · o que trava na operação dele
 *   6  diagnóstico ....... canvas-deep  · CONSULTORIA — como a causa é encontrada
 *   7  transição ......... canvas-deep  · PONTE curta: da leitura para a execução
 *   8  indústria do inox . graphite     · a frente de fabricação, para fabricantes
 *   9  método ............ canvas→graph.· MÉTODO — o único sistema de etapas da página
 *   10 leonardo .......... graphite     · AUTORIDADE que sustenta o método
 *   11 quem conduz ....... graphite     · QUEM RESPONDE (+ o livro, em `id="livro"`)
 *   12 credibilidade ..... canvas       · PROVA — números, clientes e depoimentos
 *   13 fechamento ........ graphite     · CONVERSÃO — `FinalCtaSection`, a mesma das rotas internas
 *
 * O fechamento é `FinalCtaSection`, sem alteração de composição — o mesmo
 * componente que as nove rotas internas usam, com o mesmo painel diagonal e a
 * mesma keyline amarela do mockup. O que a Home passa por props é copy e
 * destino do CTA (ver o bloco no fim deste arquivo). Não há componente V2 de
 * fechamento montado nesta página.
 *
 * **Equipamentos é a segunda seção da página.** Era essa a exigência: quem
 * chegou para cotar equipamento não atravessa quatro grandes seções antes de
 * encontrar a frente principal — ele rola uma vez.
 *
 * ============================================================
 * OS DOIS MOVIMENTOS DESTA RODADA (2026-08-10)
 * ============================================================
 *
 * **1. `#atuacao` saiu da montagem, e `#transicao` deixou de ser um método.**
 *
 * A página explicava "como a Bianchini trabalha" em três lugares no espaço de
 * quatro seções: `#transicao` com três etapas numeradas, `#atuacao` com cinco
 * níveis numerados e `#metodo` com as etapas completas. Três sistemas, três
 * numerações, o mesmo arco diagnóstico → projeto → implantação repetido em cada
 * um — a leitura resultante era "sistema → sistema → sistema", que é o que faz
 * uma página comercial parecer manual.
 *
 * A consolidação deu uma responsabilidade a cada seção: `#diagnostico` mostra
 * como a causa é encontrada, `#transicao` é a **ponte** da leitura para a
 * execução (uma frase, sem numeral e sem cartão — ver `scope-triad-band.tsx`) e
 * `#metodo` passa a ser o **único** lugar da home que detalha etapas.
 *
 * `ScopeSection` (`#atuacao`) continua no repositório, com `scope-levels.ts` e
 * as imagens intactos — o que saiu foi a montagem nesta página. Nenhuma âncora
 * do site apontava para `#atuacao`, e 80% do conteúdo dela vivia atrás de
 * estado (aba/accordion): o único nível visível na abertura repetia o que o
 * `#diagnostico` já tinha dito duas seções antes.
 *
 * **2. `#credibilidade` passou para depois de `#quem-conduz`.** Decisão do
 * gestor. O fim da página lia "autoridade → prova → responsáveis → conversão",
 * com a prova interrompendo a apresentação das pessoas; agora lê
 * **autoridade → responsáveis → prova → conversão**, e `#credibilidade` — os
 * números, os logotipos e os depoimentos — é o último argumento antes do CTA.
 *
 * Isso desfaz a razão pela qual `método` caía depois de `autoridade` na ordem
 * anterior: `credibilidade` estava ali para separar `leonardo` de
 * `quem conduz`. Sem esse separador, as duas ficam adjacentes de propósito e o
 * encontro é tratado como **um capítulo em duas partes** — padding reduzido dos
 * dois lados e uma régua no topo de `quem conduz`, em vez de dois blocos de
 * grafite empilhados com 160px de vão entre eles. A redundância de conteúdo
 * entre as duas seções é assunto de outra rodada, não desta.
 *
 * Tudo o mais ficou na mesma posição. `sintomas` continua antes de
 * `diagnostico` pelo motivo de sempre: a primeira faz o visitante reconhecer o
 * problema na operação dele, a segunda mostra como a causa é encontrada, e
 * `sintomas` já aponta para `#diagnostico` no próprio texto.
 *
 * RITMO DE FUNDO — a restrição que limitou a ordem
 * ------------------------------------------------
 * As seções escuras somam quase metade da página, e três seguidas viram uma
 * mancha sem transição. Continuam sendo **dois pares escuros adjacentes** —
 * `hero`+`equipamentos` e `leonardo`+`quem conduz` —, o mesmo teto de sempre: a
 * rodada trocou o par `quem conduz`+`fechamento` pelo novo par de autoridade, e
 * `credibilidade` (canvas) passou a separar `quem conduz` do `fechamento`.
 *
 * Foi essa conta que definiu a cor da nova `#transicao`. Grafite, como era, ela
 * encostaria direto em `#industria-do-inox` — par escuro novo, e o terceiro da
 * página. Clara, ela fecha o capítulo do diagnóstico (usa o mesmo `canvas-deep`,
 * separada só por uma régua) e devolve a mudança tonal para onde ela significa
 * alguma coisa: claro → escuro na entrada do inox. `sintomas` e `inox` seguem
 * isolados entre seções claras; `método` termina em grafite e entrega para
 * `leonardo`, que é a mesma transição que a V1 fazia.
 *
 * A ORDEM DO MENU DERIVA DAQUI
 * ----------------------------
 * `mainNav` (`src/data/navigation.ts`) tem os cinco itens da V1 e reflete o `Y`
 * medido de cada âncora nesta sequência. Ao reordenar qualquer seção acima,
 * **remeça** — ler o menu da esquerda para a direita tem de ser descer a página
 * do começo ao fim. Remedido nesta rodada: ver o fim de `navigation.ts`.
 */
export default function HomePage() {
  return (
    <>
      <HeroStage />

      {/* ==========================================================
          EQUIPAMENTOS — a primeira seção recomposta pela direção de arte
          final (2026-08-10).

          `variant="showcase"` é a vitrine da Home: a fotografia da categoria
          prioritária vira palco e sangra pela borda direita, o enunciado e o
          CTA vivem sobre ela, e as outras quatro frentes viram quatro
          fotografias grandes encostadas sem vão — no lugar das miniaturas de
          112×135 que a auditoria visual global reprovou. A justificativa
          completa está em `equipment-strip-section.tsx`.

          A seção também é montada em `/solucoes/cozinhas-industriais`, que
          **não passa `variant`** e continua recebendo a composição `dossier`
          da V1, sem uma linha de diferença. `note` e `cta` seguem props com o
          texto da V1 como default pelo mesmo motivo. O que a Home diz aqui —
          especificamos, fornecemos, instalamos e comissionamos; avulso **ou**
          cozinha inteira — é transcrição de `src/data/faq.ts`
          (`kitchensFaq[0]` e `[2]`), não afirmação nova.

          `compact` deixou de ser passado: a vitrine controla o próprio
          respiro, bloco a bloco, porque cada um deles sangra.
          ========================================================== */}
      <EquipmentStripSection
        variant="showcase"
        note={
          <>
            Especificamos, fornecemos, instalamos e comissionamos — um equipamento específico ou a
            cozinha inteira, os dois formatos existem. O detalhamento por linha, incluindo o{' '}
            <Link
              href="/linhas-de-produtos/forno-combinado-rational"
              className="font-semibold text-canvas underline decoration-yellow underline-offset-4 transition-colors hover:text-white"
            >
              forno combinado Rational
            </Link>
            , fica na página de linhas.
          </>
        }
        cta={{ label: 'Solicitar orçamento de equipamentos', href: '/contato?intencao=equipamentos' }}
      />

      {/* ==========================================================
          PROVA da seção acima. O `lead` da Home nomeia o que a Bianchini fez
          em cada registro (projetou, especificou, fabricou ou instalou) — sem
          isso a fileira lê como portfólio de arquitetura e não sustenta a
          frente comercial que a antecede. Default da prop = texto da V1, que é
          o que `/solucoes/cozinhas-industriais` continua usando.
          ========================================================== */}
      <ProjectsSection
        tone="surface"
        compact
        lead="Cozinhas, bares, cadeia fria e mobiliário em inox que a Bianchini projetou, especificou, fabricou ou instalou. As legendas descrevem o que está na imagem — sem cliente, local ou prazo atribuídos."
        /*
          Só a **base** da seção, e só na Home: a seção seguinte é `#pilares`,
          e essa borda é claro→claro (`surface` → `canvas`). Com o padding
          padrão, os 48/64px daqui somavam 144px de vão com os 80px de topo de
          `#pilares` — uma tela vazia entre o botão "Ver todos os projetos" e a
          etiqueta da seção seguinte, sem nada acontecendo. Nada da composição
          de Projetos muda: `/solucoes/cozinhas-industriais` não passa a prop e
          continua com o padding de `space`.
        */
        className="pb-8 md:pb-10"
      />

      <PillarsSection />
      <SymptomsSection />
      <DiagnosisSection compact />
      <ScopeTriadBand />
      <IndustryInoxSection />
      <JourneySection />
      <LeonardoSection />
      <LeadershipSection />
      <CredibilitySection />

      {/* ==========================================================
          CONVERSÃO — mesmo componente, mesma composição, copy da Home.

          O fechamento oferecia uma porta só: "Solicitar diagnóstico". Numa
          página cuja prioridade comercial é Equipamentos (DEC-001) e que abre
          com "Solicitar orçamento" na primeira dobra, terminar exigindo
          diagnóstico é a integração imposta no ponto de conversão — o que
          DEC-003 pede para não fazer.

          Agora o par de pontas da página combina: a dobra abre com orçamento
          de equipamentos, o fechamento repete essa ação, e o texto nomeia as
          três necessidades para que quem veio por projeto ou por diagnóstico se
          reconheça — o formulário de `/contato` tem o seletor de necessidade, e
          as portas nomeadas de Projetos e Consultoria estão em `#pilares`.

          Nenhuma prop de composição foi passada: painel diagonal, keyline,
          fotografia, WhatsApp e faixa de atendimento são os da V1.
          ========================================================== */}
      <FinalCtaSection
        title="Diga o que a sua operação precisa resolver."
        description="Um equipamento específico, um projeto completo ou a leitura de uma operação que já está rodando — o retorno parte do que você precisa hoje."
        primaryLabel="Solicitar orçamento de equipamentos"
        primaryHref="/contato?intencao=equipamentos"
        topic="equipamentos"
      />
    </>
  )
}
