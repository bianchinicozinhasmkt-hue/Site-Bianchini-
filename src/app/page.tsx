import Link from 'next/link'
import { HeroStage } from '@/components/v2/hero-stage'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { PillarsSection } from '@/components/sections/pillars-section'
import { SymptomsSection } from '@/components/sections/symptoms-section'
import { DiagnosisSection } from '@/components/sections/diagnosis-section'
import { ScopeTriadBand } from '@/components/sections/scope-triad-band'
import { ScopeSection } from '@/components/sections/scope-section'
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
 * Esta página tem exatamente **uma** área redesenhada: a primeira dobra
 * (`HeroStage`). Todo o resto são as **mesmas catorze seções da V1**, nos
 * mesmos componentes, com o mesmo layout, a mesma tipografia, o mesmo motion e
 * o mesmo comportamento responsivo de `v1-final`. Nenhuma delas foi
 * redesenhada, refatorada, harmonizada com a hero ou convertida em componente
 * V2.
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
 *   7  entrega ........... graphite     · INTEGRAÇÃO — do diagnóstico à instalação
 *   8  atuação ........... surface      · ESCOPO — os cinco níveis de contratação
 *   9  indústria do inox . graphite     · a frente de fabricação, para fabricantes
 *   10 método ............ canvas→graph.· MÉTODO — como o trabalho acontece
 *   11 leonardo .......... graphite     · AUTORIDADE que sustenta o método
 *   12 credibilidade ..... canvas       · PROVA — números, clientes e depoimentos
 *   13 quem conduz ....... graphite     · QUEM CONDUZ (+ o livro, em `id="livro"`)
 *   14 fechamento ........ graphite     · CONVERSÃO — `FinalCtaSection`, a mesma das rotas internas
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
 * O ÚNICO MOVIMENTO DESTA RODADA (2026-08-09): `#pilares`, DE 6ª PARA 4ª
 * ============================================================
 *
 * A rodada de conteúdo estratégico mudou **uma** posição. `#pilares` — que
 * deixou de ser o organograma da empresa e passou a ser "As três frentes",
 * onde Projetos e Consultoria ganham nome, pergunta do cliente e CTA próprio
 * (ver `pillars-section.tsx`) — subiu de 6ª para 4ª, entre `projetos` e
 * `sintomas`.
 *
 * O motivo é de funil, não de estética. Na posição antiga, a página oferecia
 * três caminhos na primeira dobra e só voltava a nomeá-los **depois** de duas
 * seções inteiras de consultoria (`sintomas` + `diagnostico`): quem escolheu
 * "Projetos" ou "Consultoria" lá em cima atravessava ~3.600px sem reencontrar
 * a própria porta. Na 4ª, a sequência fecha o argumento de Equipamentos
 * (seção 2), mostra a prova dele (seção 3) e abre as outras duas frentes antes
 * de a página começar a falar de sintomas — que passam a ser a **entrada** do
 * bloco de consultoria, e não um assunto que aparece antes de a consultoria
 * ter sido nomeada.
 *
 * Tudo o mais ficou na mesma posição. `sintomas` continua antes de
 * `diagnostico` pelo motivo de sempre: a primeira faz o visitante reconhecer o
 * problema na operação dele, a segunda mostra como a causa é encontrada, e
 * `sintomas` já aponta para `#diagnostico` no próprio texto.
 *
 * **Por que `método` cai depois de `autoridade`.** Regra da V1, não
 * preferência: `leonardo` e `quem conduz` são duas seções sobre as mesmas
 * pessoas e, adjacentes, a segunda lê como repetição da primeira. Separá-las
 * exige uma seção entre elas, e `credibilidade` é a única que serve sem quebrar
 * o funil. Com isso `método` fica em 10 e `autoridade` em 11 — a única
 * divergência desta ordem em relação ao funil pedido, e ela continua **antes**
 * de quem conduz e da conversão.
 *
 * RITMO DE FUNDO — a restrição que limitou a ordem
 * ------------------------------------------------
 * As seções escuras somam quase metade da página, e três seguidas viram uma
 * mancha sem transição. Nesta ordem há **dois pares escuros adjacentes** —
 * `hero`+`equipamentos` e `quem conduz`+`fechamento` —, o mesmo teto que a V1
 * já respeitava, e o mesmo número de antes do movimento de `#pilares`: ela
 * trocou uma vizinhança clara (`diagnostico`+`pilares`) por outra
 * (`projetos`+`pilares`), sem criar par escuro novo. `sintomas`, `entrega` e
 * `inox` continuam isolados entre seções claras; `método` termina em grafite e
 * entrega para `leonardo`, que é a mesma transição que a V1 fazia.
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
          EQUIPAMENTOS — o fecho da seção passa a ser comercial.

          A seção também é montada em `/solucoes/cozinhas-industriais`, e lá o
          fecho continua sendo o da V1 ("Ver a solução completa"): `note` e
          `cta` são props com o texto da V1 como default, então a rota interna
          não mudou. O que a Home diz aqui — especificamos, fornecemos,
          instalamos e comissionamos; avulso **ou** cozinha inteira — é
          transcrição de `src/data/faq.ts` (`kitchensFaq[0]` e `[2]`), não
          afirmação nova.
          ========================================================== */}
      <EquipmentStripSection
        compact
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
      <ScopeSection />
      <IndustryInoxSection />
      <JourneySection />
      <LeonardoSection />
      <CredibilitySection />
      <LeadershipSection />

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
