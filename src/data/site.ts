import type { Metric } from '@/types'

/**
 * Dados institucionais. Todo conteúdo aqui vem do site anterior da Bianchini
 * ou de GUIA_COMPLETO_DO_SITE_BIANCHINI.md — nada é inventado.
 */
export const site = {
  name: 'Bianchini Cozinhas',
  brand: 'Bianchini Kitchen Pro',
  holding: 'Bianchini Holding',
  tagline: 'Diagnóstico, projeto e implantação de operações de food service',
  title:
    'Bianchini — Diagnóstico, Projeto e Implantação de Cozinhas Industriais',
  shortTitle: 'Bianchini',
  description:
    'Diagnosticamos, estruturamos e transformamos operações de food service. Cozinhas industriais completas, arquitetura e fluxo, especificação de equipamentos, implantação e consultoria operacional. 17 anos e mais de 3.000 projetos entregues.',
  keywords: [
    'cozinha industrial',
    'projeto de cozinha industrial',
    'implantação de cozinha profissional',
    'consultoria para restaurantes',
    'diagnóstico operacional food service',
    'arquitetura de cozinha e salão',
    'equipamentos para cozinha profissional',
    'consultoria para fabricantes de cozinha',
  ],
  locale: 'pt-BR',
  /**
   * ============================================================
   * DOMÍNIO DE PUBLICAÇÃO — CONFIRMADO (2026-08-11)
   * ============================================================
   *
   * `bianchinicozinhas.com.br`, confirmado pelo gestor. É o domínio publicado,
   * o do e-mail comercial e o que `CLAUDE.md` já registrava como identidade
   * oficial da marca.
   *
   * **O padrão deixou de ser `http://localhost:3000`, e a mudança tem causa
   * concreta.** Enquanto o domínio era desconhecido, cair em localhost e gritar
   * no log era o comportamento defensável: um domínio inventado é pior que um
   * óbvio erro de configuração.
   *
   * Só que o primeiro deploy real provou o custo desse desenho. O host compila
   * o projeto, a variável precisa ser cadastrada no painel dele, ela não foi, e
   * o site subiu **funcionando** com `canonical`, `og:url` e as 14 URLs do
   * `sitemap.xml` apontando para `http://localhost:3000`. O aviso saiu no log —
   * dezenas de vezes — e passou despercebido no meio da saída do build, que é
   * exatamente o que um aviso não-fatal faz num pipeline automatizado.
   *
   * Com o domínio confirmado, o padrão correto é ele. `NEXT_PUBLIC_SITE_URL`
   * continua tendo precedência, e é o que se usa para publicar num subdomínio de
   * teste sem tocar no código.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bianchinicozinhas.com.br',
} as const

/*
  O aviso agora é sobre **divergência**, não sobre ausência: se a variável
  estiver definida e apontar para outro domínio que não o de produção, quem lê o
  log de deploy vê qual dos dois venceu. Ausência deixou de ser problema — o
  padrão é o domínio real.

  Continua atrás de `typeof window` para não rodar no navegador, e de
  `NODE_ENV` para não poluir o `npm run dev`.
*/
if (
  typeof window === 'undefined' &&
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NEXT_PUBLIC_SITE_URL !== 'https://bianchinicozinhas.com.br'
) {
  console.warn(
    `\n[bianchini] NEXT_PUBLIC_SITE_URL define ${process.env.NEXT_PUBLIC_SITE_URL} — ` +
      'sitemap, robots, canonical e Open Graph vão usar esse domínio, não bianchinicozinhas.com.br.\n',
  )
}

/**
 * Copy aprovada do hero, transcrita do mockup
 * `MOCKUP_HERO_APROVADO.png`. Não substituir.
 */
export const positioning = {
  eyebrow: 'Cozinhas industriais e food service',
  promise: 'Diagnosticamos, estruturamos e transformamos operações de food service.',
  support:
    'Da cozinha industrial e dos equipamentos aos processos, comercial e marketing: escolhas melhores para reduzir desperdícios, investir com inteligência e melhorar resultados.',
  essence: 'Entender primeiro. Escolher melhor. Investir com inteligência. Operar com mais resultado.',
} as const

/**
 * Quebras de linha do título, medidas no mockup: cinco linhas, com a linha
 * mais longa ("Diagnosticamos,") ocupando 507 px dos 1586 px de largura.
 * São quebras de composição — no mobile o título volta a fluir.
 */
export const heroTitleLines = [
  'Diagnosticamos,',
  'estruturamos e',
  'transformamos',
  'operações de',
  'food service',
] as const

/** Legenda no rodapé da fotografia do hero, conforme o mockup. */
export const heroPhotoCaption =
  'Operação entregue: projeto, especificação, fabricação e instalação'

export const contact = {
  /**
   * ============================================================
   * TELEFONE — FONTE ÚNICA, CONFIRMADO PELO COMERCIAL (2026-08-11)
   * ============================================================
   *
   * **Divergência encerrada.** O gestor confirmou por escrito, nesta data, o
   * número comercial oficial:
   *
   *   +55 21 96469-0650   ← confirmado, em uso aqui
   *   +55 21 99518-1918   ← o que estava em uso até 2026-08-11; **não usar**
   *
   * O número confirmado é justamente o que versões anteriores do `CLAUDE.md`
   * registravam e que a auditoria de V1 apontava como divergente
   * (`docs/v1-release/04-pendencias-externas.md`). A escolha **não** foi
   * técnica: veio do comercial, que é o que a regra sempre exigiu.
   *
   * SE O NÚMERO MUDAR DE NOVO, ALTERE **SÓ ESTES DOIS CAMPOS**
   * ---------------------------------------------------------
   * `phoneDisplay` (formatado, o que o visitante lê) e `phoneE164` (só
   * dígitos, com país e DDD, sem `+` — é o formato que o `wa.me` exige).
   * Mantenha os dois apontando para o mesmo número.
   *
   * Uma edição aqui basta para o site inteiro. Todo consumidor deriva daqui,
   * e não existe número escrito à mão em nenhum outro arquivo:
   *
   *   `lib/whatsapp.ts` ....... monta todo link `wa.me` (`whatsappUrl`,
   *                             `whatsappUrlWithText`) — usado por contato,
   *                             rodapé, menu mobile, botão flutuante, CTA
   *                             final da V1 e da V2, formulário e as duas
   *                             páginas de linhas de produtos
   *   `lib/schema.ts` ......... `telephone` do JSON-LD da organização
   *   `layout/footer.tsx` ..... texto exibido
   *   `layout/mobile-menu.tsx`  texto exibido + `tel:`
   *   `app/contato/page.tsx` .. texto exibido + `tel:`
   */
  phoneDisplay: '+55 21 96469-0650',
  phoneE164: '5521964690650',
  email: 'comercial@bianchinicozinhas.com.br',
  city: 'Rio de Janeiro',
  state: 'RJ',
  country: 'Brasil',
  locationLabel: 'Rio de Janeiro · RJ · Brasil',
  coverage: 'Atendimento em todo o Brasil',
  /** Instagram institucional — cabeçalho, menu mobile e rodapé. */
  instagram: 'https://www.instagram.com/bianchinicozinhas/',
  /** Expectativa de retorno comunicada ao visitante. Ajustar se o SLA mudar. */
  responseTime: 'Retorno em até 1 dia útil',
  hours: 'Segunda a sexta, 8h às 18h',
} as const

/**
 * ============================================================
 * TEMPO DE ATUAÇÃO — 17 ANOS, CONFIRMADO (2026-08-11)
 * ============================================================
 *
 * **Divergência encerrada.** O projeto publicava "18 anos" aqui e em
 * `differentials.ts`/`credibility-section.tsx`, e "17 anos" em `team.ts`
 * (dossiê de Leonardo) — a mesma página contava duas idades. A colisão estava
 * registrada como pendência aberta em `leadership-section.tsx` e não podia ser
 * resolvida por dedução, porque escolher entre dois números de negócio é
 * decisão comercial.
 *
 * O gestor confirmou por escrito, nesta data: **17 anos**. É também o que o
 * site oficial publica ("mais de 17 anos", "desde 2008" — ver
 * `src/data/leonardo.ts`), então a correção alinha o site ao domínio e ao
 * dossiê ao mesmo tempo.
 *
 * `heroMetrics` e `scopeMetrics` são a **fonte única** do valor. Nenhuma seção
 * deve escrever a idade à mão: as ocorrências em prosa que existem hoje
 * (`differentials.ts`, `credibility-section.tsx`, `app/sobre/page.tsx`,
 * `site.description`) foram todas alinhadas a 17 nesta rodada e continuam
 * sendo texto editorial — se a idade mudar de novo, elas precisam ser
 * remedidas junto, e `grep -rn "17 anos" src/` as encontra.
 *
 * FONTE ÚNICA da métrica de projetos/cozinhas entregues: "3.000+", usada aqui
 * e em `scopeMetrics` abaixo — nenhum outro valor deve ser introduzido em
 * nenhuma outra seção sem passar por este arquivo. PENDENTE: confirmação
 * comercial definitiva do número exato (houve divergência apontada entre
 * "1.000" e "3.000" em material fora do código; o projeto usa "3.000+" em
 * todo lugar hoje, mas o valor final ainda não foi validado pelo comercial).
 */
export const heroMetrics: Metric[] = [
  { value: '17', label: 'anos de atuação' },
  { value: '3.000+', label: 'projetos entregues' },
  { value: 'Brasil', label: 'abrangência de atendimento' },
]

export const scopeMetrics: Metric[] = [
  { value: '17 anos', label: 'Atuação dentro de operações de alimentação' },
  { value: '3.000+', label: 'Projetos entregues em todo o Brasil' },
  { value: '8 linhas', label: 'Equipamentos especificados dentro do projeto' },
]
