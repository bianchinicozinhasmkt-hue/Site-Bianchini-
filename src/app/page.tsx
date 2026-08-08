import { HeroStage } from '@/components/v2/hero-stage'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { SymptomsSection } from '@/components/sections/symptoms-section'
import { DiagnosisSection } from '@/components/sections/diagnosis-section'
import { PillarsSection } from '@/components/sections/pillars-section'
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
 * `src/components/v2/`, e **fora da montagem**. Nenhuma faixa de confiança,
 * grade de benefícios ou métrica nova ficou entre a hero e a primeira seção V1:
 * terminada a dobra, começa `EquipmentStripSection`.
 *
 * ============================================================
 * A ORDEM — O FUNIL, E NÃO O HISTÓRICO DE EDIÇÃO
 * ============================================================
 *
 *   1  hero V2 ........... graphite     · escolha da necessidade: um palco, três estados
 *   2  **equipamentos** .. graphite-soft· EQUIPAMENTOS — a frente principal, na segunda seção
 *   3  projetos .......... surface      · PROJETOS — operações projetadas e construídas
 *   4  sintomas .......... graphite     · o que trava na operação dele
 *   5  diagnóstico ....... canvas-deep  · CONSULTORIA — como a causa é encontrada
 *   6  pilares ........... canvas       · INTEGRAÇÃO — as três frentes nomeadas
 *   7  entrega ........... graphite     · INTEGRAÇÃO — do diagnóstico à instalação
 *   8  atuação ........... surface      · ESCOPO — os cinco níveis de contratação
 *   9  indústria do inox . graphite     · a frente de fabricação, para fabricantes
 *   10 método ............ canvas→graph.· MÉTODO — como o trabalho acontece
 *   11 leonardo .......... graphite     · AUTORIDADE que sustenta o método
 *   12 credibilidade ..... canvas       · PROVA — números, clientes e depoimentos
 *   13 quem conduz ....... graphite     · QUEM CONDUZ (+ o livro, em `id="livro"`)
 *   14 CTA final ......... graphite     · CONVERSÃO
 *
 * **Equipamentos é a segunda seção da página.** Era essa a exigência: quem
 * chegou para cotar equipamento não atravessa quatro grandes seções antes de
 * encontrar a frente principal — ele rola uma vez.
 *
 * **Sintomas antes de diagnóstico.** As duas formam a etapa de consultoria:
 * a primeira faz o visitante reconhecer o problema na operação dele, a segunda
 * mostra como a causa é encontrada. Invertidas, o diagnóstico responde uma
 * pergunta que ninguém fez ainda — e `sintomas` já aponta para `#diagnostico`
 * no próprio texto, na V1.
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
 * mancha sem transição. Esta sequência mantém **exatamente dois pares escuros
 * adjacentes** — `hero`+`equipamentos` e `quem conduz`+`CTA` —, que é o mesmo
 * número da V1. `sintomas`, `entrega` e `inox` ficam isolados entre seções
 * claras; `método` termina em grafite e entrega para `leonardo`, que é a mesma
 * transição que a V1 fazia de `método` para `leonardo`.
 *
 * A ORDEM DO MENU DERIVA DAQUI
 * ----------------------------
 * `mainNav` (`src/data/navigation.ts`) tem os cinco itens da V1 e reflete o `Y`
 * medido de cada âncora nesta sequência. Ao reordenar qualquer seção acima,
 * **remeça** — ler o menu da esquerda para a direita tem de ser descer a página
 * do começo ao fim.
 */
export default function HomePage() {
  return (
    <>
      <HeroStage />
      <EquipmentStripSection compact />
      <ProjectsSection tone="surface" compact />
      <SymptomsSection />
      <DiagnosisSection compact />
      <PillarsSection />
      <ScopeTriadBand />
      <ScopeSection />
      <IndustryInoxSection />
      <JourneySection />
      <LeonardoSection />
      <CredibilitySection />
      <LeadershipSection />
      <FinalCtaSection />
    </>
  )
}
