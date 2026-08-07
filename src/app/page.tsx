import { HeroEquipamentos } from '@/components/v2/hero-equipamentos'
import { CategoriesShowcase } from '@/components/v2/categories-showcase'
import { PillarsBand } from '@/components/v2/pillars-band'
import { ProjectsDoor } from '@/components/v2/projects-door'
import { ConsultingDoor } from '@/components/v2/consulting-door'
import { ProofSection } from '@/components/v2/proof-section'
import { AuthorityBand } from '@/components/v2/authority-band'
import { FinalCta } from '@/components/v2/final-cta'

/**
 * ============================================================
 * HOME V2 — INTERFACE COMERCIAL, NÃO APRESENTAÇÃO INSTITUCIONAL
 * ============================================================
 *
 * Arquitetura aprovada no Gate 1 (`docs/v2/specs/V2-01-home-arquitetura.md`) e
 * composta no Gate 2 (`docs/v2/wireframes/`). A V1, com 14 seções, está
 * preservada em `main` e na tag `v1-final` — esta página a substitui na branch
 * `v2` (DEC-009, DEC-010).
 *
 *   1  hero .......... Equipamentos: o que vendemos, para quem, com que técnica
 *   2  equipamentos .. vitrine das seis categorias — navegação comercial
 *   3  integração .... "Do projeto à execução", com peso assimétrico
 *   4  projetos ...... porta independente — "Fale com um projetista"
 *   5  consultoria ... porta independente — "Agendar diagnóstico"
 *   6  prova ......... operações entregues, organizações, depoimentos
 *   7  empresa ....... autoridade condensada, uma faixa só
 *   8  CTA final ..... fechamento com três destinos e um peso maior
 *   9  rodapé ........ montado no layout, comum a todas as rotas
 *
 * POR QUE ESTA ORDEM
 * ------------------
 * As **duas primeiras dobras são inteiramente de Equipamentos**, antes de
 * qualquer outro pilar ser nomeado (DEC-005). É isso que torna a prioridade
 * comercial estrutural, e não apenas um discurso: quem chegou para cotar um
 * equipamento pode converter sem rolar até a seção 4 ou 5.
 *
 * A integração aparece na seção 3 — depois de a conversão de Equipamentos já
 * estar disponível, e antes das duas portas independentes. É a leitura literal
 * de "a integração é oferecida, não imposta" (DEC-003): ela nunca precede a
 * possibilidade de agir.
 *
 * Prova vem **depois** das três portas, não no meio delas: mostrada antes, o
 * acervo lê como galeria; depois, é evidência de que cada porta entrega.
 *
 * RITMO DE FUNDO
 * --------------
 * claro → claro → escuro → claro → escuro → claro → claro → escuro.
 * Nenhum par de seções escuras adjacentes, e nenhuma sequência de três claras
 * seguidas sem quebra de composição. As três seções escuras (integração,
 * consultoria, CTA final) são também as três de maior peso argumentativo — o
 * contraste marca mudança de assunto, não decoração.
 *
 * A ORDEM DO MENU DERIVA DAQUI
 * ----------------------------
 * `mainNav` (`src/data/navigation.ts`) reflete a ordem de rolagem:
 * Equipamentos → Projetos → Consultoria → Prova → Empresa. Ao reordenar
 * qualquer seção acima, remeça as âncoras e atualize aquele array — ler o menu
 * da esquerda para a direita tem de ser descer a página do começo ao fim.
 */
export default function HomePage() {
  return (
    <>
      <HeroEquipamentos />
      <CategoriesShowcase />
      <PillarsBand />
      <ProjectsDoor />
      <ConsultingDoor />
      <ProofSection />
      <AuthorityBand />
      <FinalCta />
    </>
  )
}
