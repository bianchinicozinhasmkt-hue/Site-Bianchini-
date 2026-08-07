import { HeroSection } from '@/components/sections/hero-section'
import { ScopeTriadBand } from '@/components/sections/scope-triad-band'
import { SymptomsSection } from '@/components/sections/symptoms-section'
import { DiagnosisSection } from '@/components/sections/diagnosis-section'
import { ScopeSection } from '@/components/sections/scope-section'
import { PillarsSection } from '@/components/sections/pillars-section'
import { LeadershipSection } from '@/components/sections/leadership-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { LeonardoSection } from '@/components/sections/leonardo-section'
import { JourneySection } from '@/components/sections/journey-section'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { IndustryInoxSection } from '@/components/sections/industry-inox-section'
import { CredibilitySection } from '@/components/sections/credibility-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'

/**
 * ============================================================
 * NARRATIVA COMERCIAL DA HOME — REORDENADA EM 2026-08-05
 * ============================================================
 *
 * A ordem anterior tinha sido montada por necessidades locais, uma de cada
 * vez, e o resultado media contra ela: **`#projetos` abria em y=6766 de
 * 15.914px — 42% da página**. A prova principal da Bianchini, que é a operação
 * construída, chegava depois de sintomas, transição, diagnóstico, cinco níveis
 * de atuação, três pilares e o dossiê dos dois responsáveis.
 *
 * A sequência agora é a progressão comercial, e não a ordem em que as seções
 * foram escritas:
 *
 *   1  hero .............. o que a Bianchini entrega + os três pilares
 *   2  sintomas .......... o problema que o visitante reconhece na operação dele
 *   3  transição ......... o sistema: da leitura da operação à entrega instalada
 *   4  pilares ........... as três frentes desse sistema, nomeadas
 *   5  **projetos** ...... a prova — operações construídas
 *   6  diagnóstico ....... como as decisões são tomadas
 *   7  quem conduz ....... quem responde pela operação (Leonardo + Guilherme)
 *   8  método ............ como o trabalho acontece, etapa a etapa
 *   9  leonardo .......... a autoridade que sustenta o método
 *   10 atuação ........... os cinco níveis, e a ponte para equipamentos
 *   11 equipamentos ...... consequência do projeto, não catálogo
 *   12 indústria do inox . a frente para fabricantes
 *   13 credibilidade ..... reconhecimento, depois de mostrar o trabalho
 *   14 CTA final ......... solicitar diagnóstico
 *
 * **Por que projetos em 5, e não logo depois do hero.** Aberto sem contexto,
 * o acervo lê como galeria. Nas posições 2–4 o visitante já reconheceu o
 * problema (sintomas), entendeu que existe um sistema que vai da leitura à
 * instalação (transição) e viu as três frentes nomeadas (pilares) — então as
 * fotos passam a ser evidência de um método, não portfólio solto.
 *
 * **Por que `atuação` desceu para 10.** Ela detalha cinco níveis de serviço; é
 * aprofundamento, não prova, e vinha antes dos projetos. Em 10 ela vira a ponte
 * natural para equipamentos, que é o nível seguinte de detalhe.
 *
 * **Por que `quem conduz` e `leonardo` não ficam coladas.** São duas seções
 * sobre as mesmas pessoas; adjacentes, a segunda lê como repetição da primeira.
 * O método (8) entre elas dá função a cada uma: a primeira apresenta quem
 * responde, a segunda sustenta o método que acabou de ser mostrado.
 *
 * RITMO DE FUNDO — a restrição que limitou a ordem
 *
 * Nenhuma sequência aqui é livre: as seções escuras somam quase metade da
 * página, e três delas seguidas produzem a "mancha escura sem transição" que a
 * composição não pode ter. A ordem acima mantém **exatamente dois pares**
 * escuros adjacentes — `sintomas`+`transição` e `equipamentos`+`inox` —, que é
 * o mesmo número da ordem anterior. Foi essa conta, e não preferência
 * narrativa, que manteve `atuação` (surface) entre `leonardo` e `equipamentos`.
 *
 * A ordem dos links do header **deriva** desta sequência, medida no navegador
 * (`src/data/navigation.ts`) — nunca o contrário.
 *
 * ------------------------------------------------------------
 * Histórico anterior (2026-08-02 / 08-03), preservado:
 * a home foi reconstruída consolidando 15 seções em 11 e ampliada para página
 * única — a navegação principal deixou de apontar para rotas próprias e passou
 * a rolar até âncoras da própria home.
 *
 * "Construção e Reformas" **não** é uma dessas seções — saiu do escopo por
 * decisão do gestor (2026-08-03) e não existe como seção, card ou âncora em
 * lugar nenhum do site. `/construcao-e-reformas` segue existindo só como
 * redirect de compatibilidade (ver `next.config.ts`), sem destino na home.
 *
 * As rotas antigas (`/solucoes/*`, `/projetos`, `/sobre`, `/leonardo-bianchini`
 * etc.) continuam existindo, sem alteração — só saíram da navegação de
 * destaque. A remoção definitiva fica para uma etapa futura.
 *
 * Duas mudanças de fundo em relação à versão anterior:
 *
 *  · **Leonardo move para depois de projetos**, não mais entre a faixa de
 *    confiança e os níveis de atuação — a home agora mostra primeiro *o que*
 *    a Bianchini entrega (projetos reais) e só então *quem* está por trás do
 *    método, antes de detalhar os cinco níveis de atuação;
 *  · **método e diferenciais, que eram duas seções consecutivas com o mesmo
 *    esqueleto** (eyebrow + título + lead, depois uma fileira de blocos
 *    foto+texto separados por linha), viraram uma seção só
 *    (`JourneySection`) — as provas dos diferenciais entram *dentro* dos três
 *    momentos do método, não como uma segunda lista depois dele;
 *  · **confiança, depoimentos, livro e a seção institucional**, que eram
 *    quatro blocos repetindo "a empresa é grande e reconhecida", viraram uma
 *    seção só (`CredibilitySection`) no fim da página, antes do CTA — a
 *    posição que o argumento de prova social ocupa melhor: depois de mostrar
 *    o trabalho, não no meio dele.
 *
 * RITMO DE COMPOSIÇÃO
 *
 * Nenhuma dupla de seções consecutivas compartilha o mesmo esqueleto visual.
 * A grade cartesiana só existe sob a planta executiva, no diagnóstico; a
 * diagonal do hero não se repete em nenhuma outra seção.
 *
 *   hero          canvas          · diagonal + fotografia + métricas
 *   entrega       graphite        · trilho conectando 3 massas assimétricas
 *   sintomas      graphite        · fotografia fixa sangrada + 3 capítulos
 *   diagnóstico   canvas-deep     · evidência 60/40 + 3 zonas + faixa de conclusão
 *   atuação       surface         · espinhaço horizontal + painel sobreposto
 *   pilares       canvas          · 3 faces em moldura única + faixa de responsáveis
 *   quem conduz   graphite        · 2 faixas espelhadas: pedestal + dossiê (+ livro)
 *   projetos      surface         · registro sangrado + 3 registros em linha
 *   leonardo      graphite        · retrato + citação + trajetória
 *   jornada       canvas→graphite · 3 massas em degrau + faixa de conclusão
 *   equipamentos  graphite-soft   · painel panorâmico + dossiê em grade
 *   ind. do inox  graphite        · foto decorativa + 4 entregas + 2 CTAs
 *   credibilidade canvas          · números, logos e depoimentos
 *   CTA           graphite        · diagonal do hero, invertida
 *
 * Três mudanças de composição em 2026-08-04 (sem mexer na **ordem**):
 *
 *  · **o livro saiu da credibilidade** e foi para dentro do dossiê de Leonardo,
 *    em "quem conduz" — junto com a âncora `id="livro"`, que é destino de
 *    `#livro` (`leonardo-section.tsx`) e `/#livro` (`data/industry.ts`);
 *  · **pilares deixaram de nomear o responsável em cada cartão** (Leonardo
 *    respondia por dois dos três e aparecia duplicado): a oferta ficou nos
 *    cartões e a responsabilidade virou uma faixa com as duas pessoas;
 *  · **o diagnóstico perdeu o segundo encerramento** — "o que a leitura permite
 *    decidir" e "o que acontece depois do primeiro contato" viraram uma faixa
 *    só, e as descrições de `nextSteps` saíram por repetirem `methodSteps`
 *    01–03, que é o que a seção de método já mostra.
 *
 * Detalhe e justificativa de cada uma em `docs/site-audit/`.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SymptomsSection />
      <ScopeTriadBand />
      <PillarsSection />
      <ProjectsSection tone="surface" compact />
      <DiagnosisSection compact />
      <LeadershipSection />
      <JourneySection />
      <LeonardoSection />
      <ScopeSection />
      <EquipmentStripSection compact />
      <IndustryInoxSection />
      <CredibilitySection />
      <FinalCtaSection />
    </>
  )
}
