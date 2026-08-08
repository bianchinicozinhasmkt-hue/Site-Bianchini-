import { HeroPillars } from '@/components/v2/hero-pillars'
import { PillarsSection } from '@/components/sections/pillars-section'
import { SymptomsSection } from '@/components/sections/symptoms-section'
import { ScopeTriadBand } from '@/components/sections/scope-triad-band'
import { ScopeSection } from '@/components/sections/scope-section'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { IndustryInoxSection } from '@/components/sections/industry-inox-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { DiagnosisSection } from '@/components/sections/diagnosis-section'
import { LeonardoSection } from '@/components/sections/leonardo-section'
import { JourneySection } from '@/components/sections/journey-section'
import { LeadershipSection } from '@/components/sections/leadership-section'
import { CredibilitySection } from '@/components/sections/credibility-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'

/**
 * ============================================================
 * HOME = HERO V2 + SITE V1, E SÓ A ORDEM MUDOU
 * ============================================================
 *
 * Esta página tem exatamente **uma** área redesenhada: a primeira dobra
 * (`HeroPillars`). Todo o resto são as **mesmas catorze seções da V1**, nos
 * mesmos componentes, com o mesmo layout, a mesma tipografia, o mesmo motion e
 * o mesmo comportamento responsivo de `v1-final`. Nenhuma delas foi
 * redesenhada, refatorada, harmonizada com a hero ou convertida em componente
 * V2.
 *
 * Os componentes V2 que ocupavam esta página — `CategoriesShowcase`,
 * `PillarsBand`, `ProjectsDoor`, `ConsultingDoor`, `ProofSection`,
 * `AuthorityBand`, `FinalCta` — **saíram da montagem** e continuam no
 * repositório, em `src/components/v2/`, para uma etapa futura. Nenhuma faixa,
 * barra de confiança, grade de benefícios ou métrica nova ficou entre a hero e
 * a primeira seção V1: terminada a dobra, começa `PillarsSection`.
 *
 * ============================================================
 * A ORDEM — JORNADA COMERCIAL, NÃO HISTÓRICO DE EDIÇÃO
 * ============================================================
 *
 * A única alteração permitida abaixo da hero foi a **sequência**, e ela segue a
 * prioridade comercial vigente: Equipamentos > Projetos > Consultoria, com a
 * integração entre as três frentes oferecida, não imposta.
 *
 *   1  hero V2 ........... graphite     · três portas: Projetos | EQUIPAMENTOS | Consultoria
 *   2  pilares ........... canvas       · ENTENDER A EMPRESA: as três frentes nomeadas
 *   3  sintomas .......... graphite     · NECESSIDADE: o que trava na operação dele
 *   4  entrega ........... graphite     · o sistema, do diagnóstico à instalação
 *   5  atuação ........... surface      · os cinco níveis — e a ponte para equipamentos
 *   6  **equipamentos** .. graphite-soft· SOLUÇÃO PRINCIPAL
 *   7  indústria do inox . graphite     · a frente de fabricação, vizinha de equipamentos
 *   8  projetos .......... surface      · PROJETOS: operações projetadas e construídas
 *   9  diagnóstico ....... canvas-deep  · CONSULTORIA: como as decisões são tomadas
 *   10 leonardo .......... graphite     · AUTORIDADE que sustenta o método
 *   11 método ............ canvas→graph.· MÉTODO: como o trabalho acontece
 *   12 quem conduz ....... graphite     · QUEM CONDUZ (+ o livro, em `id="livro"`)
 *   13 credibilidade ..... canvas       · PROVA: números, clientes e depoimentos
 *   14 CTA final ......... graphite     · CONVERSÃO
 *
 * **Por que `pilares` abre, e não `sintomas`.** A hero V2 é grafite. Sintomas e
 * entrega também são, e as três seguidas produzem a mancha escura que o teto de
 * fundos da home proíbe. `pilares` é claro, nomeia as três frentes que a dobra
 * acabou de apresentar e sustenta a etapa "entender a empresa" — resolve ritmo
 * e narrativa ao mesmo tempo.
 *
 * **Por que `atuação` ficou logo antes de `equipamentos`.** É a ponte que a V1
 * já usava: os cinco níveis terminam no nível de detalhe seguinte, que é o
 * equipamento especificado. Aqui ela ganha uma segunda função — é o separador
 * claro entre o par escuro `sintomas`+`entrega` e o par `equipamentos`+`inox`.
 *
 * **Por que `método` ficou entre `leonardo` e `quem conduz`.** Regra da V1, e
 * não preferência: são duas seções sobre as mesmas pessoas, e adjacentes a
 * segunda lê como repetição da primeira. É também o que impede um terceiro par
 * escuro. O custo é a única divergência desta ordem em relação à jornada pedida
 * — `método` cai depois de `autoridade` em vez de antes; continua **antes** de
 * quem conduz e da prova final, que é o que a etapa exige.
 *
 * RITMO DE FUNDO — a restrição que limitou a ordem
 * ------------------------------------------------
 * As seções escuras somam quase metade da página, e três seguidas viram uma
 * mancha sem transição. Esta sequência mantém **exatamente dois pares escuros
 * adjacentes** — `sintomas`+`entrega` e `equipamentos`+`inox` —, que é o mesmo
 * número da V1. `método` termina em grafite e entrega para `quem conduz`, que é
 * a mesma transição que a V1 fazia de `método` para `leonardo`.
 *
 * A ORDEM DO MENU DERIVA DAQUI
 * ----------------------------
 * `mainNav` (`src/data/navigation.ts`) tem os cinco itens da V1 e reflete o `Y`
 * medido de cada âncora nesta sequência: Soluções (#pilares) → Equipamentos
 * (#equipamentos) → Projetos (#projetos) → Método (#metodo) → Empresa
 * (#quem-conduz). Ao reordenar qualquer seção acima, **remeça** — ler o menu da
 * esquerda para a direita tem de ser descer a página do começo ao fim.
 */
export default function HomePage() {
  return (
    <>
      <HeroPillars />
      <PillarsSection />
      <SymptomsSection />
      <ScopeTriadBand />
      <ScopeSection />
      <EquipmentStripSection compact />
      <IndustryInoxSection />
      <ProjectsSection tone="surface" compact />
      <DiagnosisSection compact />
      <LeonardoSection />
      <JourneySection />
      <LeadershipSection />
      <CredibilitySection />
      <FinalCtaSection />
    </>
  )
}
