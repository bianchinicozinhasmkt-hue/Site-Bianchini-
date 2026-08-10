/**
 * As três frentes comerciais da Bianchini, na hierarquia vigente da V2:
 * **Equipamentos (01), Projetos (02), Consultoria (03)**.
 *
 * ============================================================
 * O QUE MUDOU EM 2026-08-09, E POR QUÊ
 * ============================================================
 *
 * Até aqui este arquivo descrevia a **estrutura organizacional** da empresa —
 * "Projetos / Equipamentos / Operação Comercial", cada um com um `responsible`
 * nomeado — e a seção que o consome abria com "Como a Bianchini está
 * organizada · Três pilares, dois responsáveis". Três defeitos comerciais:
 *
 *  1. **Ordem invertida.** Projetos vinha em 01 e Equipamentos em 02, contra
 *     `docs/v2/DECISIONS.md` DEC-001 (Equipamentos é a prioridade comercial) e
 *     contra a própria primeira dobra, onde Equipamentos é o estado inicial.
 *  2. **Consultoria não existia.** O terceiro pilar público da V2 é
 *     Consultoria (DEC-004); o que estava aqui era "Operação Comercial" —
 *     funil, CRM, metas e geração de demanda —, uma competência real, mas
 *     **interna** da Bianchini, não a porta de entrada que o visitante com uma
 *     operação travada procura. O visitante escolhia "Consultoria" na primeira
 *     dobra e não reencontrava a palavra em nenhum título da página.
 *  3. **Seção sobre a empresa, não sobre o cliente.** Organograma e
 *     distribuição de responsabilidade não respondem a pergunta nenhuma de
 *     quem está comprando — e os dois nomes já aparecem, com retrato e
 *     credencial, em "Quem conduz" (`leadership-section.tsx`), a poucos
 *     milhares de pixels dali.
 *
 * `responsible` **saiu do modelo**. Ele existia para alimentar a faixa "Quem
 * responde por cada frente", removida junto: Leonardo responde por Projetos e
 * Equipamentos e Guilherme por Operação Comercial (`src/data/team.ts`), mas
 * **não há registro de quem responde por Consultoria** — e atribuir isso por
 * dedução seria inventar dado sobre pessoa real (DEC-006). A responsabilidade
 * continua publicada onde tem contexto: "Quem conduz".
 *
 * Operação Comercial não sumiu do site: continua como o nível 05 de "Atuação
 * integrada" (`src/data/scope-levels.ts` — "Comercial, marketing e
 * prospecção") e como o cargo de Guilherme Beghini em "Quem conduz". DEC-004
 * prevê exatamente isso: competência complementar, fora do trio público.
 *
 * ============================================================
 * ORIGEM DE CADA AFIRMAÇÃO — nada novo sobre a empresa
 * ============================================================
 *
 *   dimensionamento "pelo volume real" ..... `src/data/faq.ts`, `kitchensFaq[1]`
 *   instalação e comissionamento ........... `src/data/faq.ts`, `kitchensFaq[2]`
 *   layout, fluxo, dimensionamento ......... versão anterior deste arquivo
 *   plantas complementares de infra ........ `src/data/scope-levels.ts`, nível 02
 *   fluxo, capacidade, processos ........... `src/data/diagnosis.ts`
 *   "termina em prioridades" ............... `src/data/scope-levels.ts`, nível 01
 *
 * ============================================================
 * CONDENSAÇÃO DE 2026-08-09b — MAPA DE ENTRADA, NÃO SEGUNDA EXPLICAÇÃO
 * ============================================================
 *
 * A mensagem não mudou; a **quantidade exibida** mudou. `#pilares` é o mapa de
 * entrada das três frentes — não o lugar de reexplicar cada uma delas, porque
 * cada uma já tem seção, página ou fecho próprio na mesma home. O que saiu:
 *
 *  · **`number` (`01/02/03`).** Equipamentos, Projetos e Consultoria são três
 *    portas independentes, não três etapas. Numerá-las afirmava uma ordem que
 *    não existe — e não há substituto: nenhum selo, ícone ou badge entrou no
 *    lugar. **Número só quando existe sequência real, ordem operacional ou
 *    progressão** (ver o mesmo registro em `pillars-section.tsx` e em
 *    `docs/v2/DESIGN_SYSTEM.md` §1).
 *  · **`cue`.** Era a réplica literal do rótulo da régua da primeira dobra. O
 *    nome da frente já é o mesmo nos dois lugares (`heroStates[].name`), então
 *    a ponte de reconhecimento continua de pé sem uma terceira linha de texto
 *    por coluna.
 *  · **a lista de categorias de equipamento** — publicada inteira em
 *    `src/data/equipment-categories.ts` e na seção de Equipamentos, duas
 *    seções acima;
 *  · **"elétrica, hidráulica, gás e esgoto" e a RDC 216** — o detalhamento vive
 *    em `/solucoes/arquitetura`; aqui basta "infraestrutura";
 *  · **"espaço, custo e demanda"** no fecho de Consultoria — as três frentes
 *    que restam (fluxo, capacidade instalada, processos) já nomeiam a leitura.
 *
 * Perguntas e rótulos de CTA são **intocados**: são eles que fazem o visitante
 * se reconhecer e a porta ser aberta.
 */
export interface Pillar {
  /** Nome da frente, como ela é contratada. */
  title: string
  /** A pergunta concreta que essa frente responde. */
  question: string
  /** Resposta curta — o que a Bianchini entrega nessa frente, sem repetir a seção dela. */
  description: string
  /** Cada frente tem porta própria: nenhuma depende de contratar as outras. */
  cta: { label: string; href: string }
}

export const pillars: Pillar[] = [
  {
    title: 'Equipamentos',
    question: 'Qual equipamento a minha operação precisa — e quem responde pela instalação?',
    description:
      'Especificação dimensionada pelo volume real de produção, fornecimento, instalação e comissionamento.',
    cta: { label: 'Solicitar orçamento', href: '/contato?intencao=equipamentos' },
  },
  {
    title: 'Projetos',
    question: 'Preciso projetar antes de comprar ou de começar a obra?',
    description:
      'Layout, fluxo de produção, dimensionamento e plantas complementares de infraestrutura — o desenho define o que comprar e onde instalar.',
    cta: { label: 'Falar com um projetista', href: '/contato?intencao=arquitetura' },
  },
  {
    title: 'Consultoria',
    question: 'A operação já roda, mas custa caro e rende pouco. Por onde começar?',
    /*
      O fecho é paráfrase deliberada, não redação livre. A primeira versão
      terminava em "o que resolver primeiro, o que pode esperar e o que não
      precisa ser comprado" — que é **literalmente** `methodSteps[2]`
      (`src/data/diagnosis.ts`) e já é publicado pela seção Método, na mesma
      página. Uma varredura do HTML de produção pegou a frase duas vezes na
      home. A afirmação é a mesma e continua vindo da mesma fonte; o que muda é
      a redação, para a página não repetir a si mesma.
    */
    description:
      'Leitura da operação em funcionamento: fluxo, capacidade instalada e processos. O resultado é uma ordem de prioridades, não um orçamento.',
    cta: { label: 'Agendar diagnóstico', href: '/contato?intencao=consultoria' },
  },
]
