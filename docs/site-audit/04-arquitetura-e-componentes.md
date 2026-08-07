# 04 — Arquitetura e componentes

> Mapa factual do estado atual (2026-08-04), verificado por leitura direta
> de código (própria e via agente de exploração). Complementa, sem
> substituir, `docs/COMPONENT_MAP.md` e `docs/FRONTEND_ARCHITECTURE.md`
> (podem ter defasado — não conferidos byte a byte nesta rodada).

## 1. Páginas e rotas

19 rotas estáticas geradas pelo build (`npm run build`), 14 delas com
`page.tsx` próprio sob `src/app/`:

| Rota | Objetivo | Seções/blocos reutilizados | Metadata própria |
|---|---|---|---|
| `/` | Home única, navegação por âncora | `HeroSection`, `SymptomsSection`, `ScopeTriadBand`, `DiagnosisSection compact`, `ScopeSection`, `PillarsSection`, `LeadershipSection`, `ProjectsSection tone="surface" compact`, `LeonardoSection`, `JourneySection`, `EquipmentStripSection compact`, `IndustryInoxSection`, `CredibilitySection`, `FinalCtaSection` | Não (herda default) |
| `/contato` | Formulário de diagnóstico + canais diretos | `ContactForm` (em `Suspense`), `nextSteps` | Sim |
| `/leonardo-bianchini` | Autoridade pessoal de Leonardo | `LeonardoHero`, `BookSection tone="canvas" detailed`, `TestimonialsSection`, `FinalCtaSection` | Sim + `personSchema` |
| `/obrigado` | Confirmação pós-formulário (só alcançada via `router.push`, sem link estático) | Conteúdo local + `nextSteps` | Sim, `noindex` |
| `/politica-de-privacidade` | Texto legal — ver pendência em `01-auditoria-geral.md` §9 | Conteúdo local | Sim |
| `/projetos` | Galeria/mosaico do acervo | `PageHero`, mosaico `ProjectCard`, `CaseStudySection`, `TestimonialsSection`, `FinalCtaSection` | Sim |
| `/sobre` | Institucional | `PageHero`, `FeatureGrid`, `ProcessSection`, `DifferentialsSection`, `SegmentsSection`, `TrustSection`, `TestimonialsSection`, `FinalCtaSection` | Sim |
| `/solucoes` | Índice das 4 soluções | `PageHero`, grid `SolutionCard`, `ProcessSection`, `FinalCtaSection` | Sim |
| `/solucoes/cozinhas-industriais` | Solução 1 | `PageHero`, `ProblemsSection`, `FeatureGrid`, `EquipmentStripSection`, `ProcessSection`, `DeliverablesBlock`, `ComparisonSection`, `ProjectsSection`, `FaqBlock`, `FinalCtaSection` | Sim + `faqSchema` |
| `/solucoes/arquitetura` | Solução 2 (destino do redirect de "Construção e Reformas") | `PageHero`, `ProblemsSection`, `CaseStudySection`, `ProcessSection`, `DeliverablesBlock`, `DifferentialsSection`, `FaqBlock`, `FinalCtaSection` | Sim + `faqSchema` |
| `/solucoes/consultoria-para-restaurantes` | Solução 3 | `PageHero`, `ProblemsSection`, `DiagnosisSection`, `FeatureGrid`, `DeliverablesBlock`, `TestimonialsSection`, `FaqBlock`, `FinalCtaSection` | Sim + `faqSchema` |
| `/solucoes/consultoria-para-fabricantes` | Solução B2B | `PageHero`, `ProblemsSection`, `ProcessSection`, `DeliverablesBlock`, `FaqBlock`, `FinalCtaSection` | Sim + `faqSchema` |
| `/linhas-de-produtos` | Índice de 8 linhas de equipamento | Conteúdo local + `FinalCtaSection` | Sim |
| `/linhas-de-produtos/forno-combinado-rational` | Produto único (Rational) | Conteúdo local, CTA próprio (não usa `FinalCtaSection`) | Sim |

Redirects (`next.config.ts`): `/forno-combinado-rational` →
`/linhas-de-produtos/forno-combinado-rational`; `/construcao-e-reformas` →
`/solucoes/arquitetura`. Ambos permanentes, um salto só.

## 2. Seções da home — as 9 ainda não detalhadas em outro documento

(As outras 4 — `HeroSection`, `LeadershipSection`, `IndustryInoxSection`,
`CredibilitySection` — já estão detalhadas em `01-auditoria-geral.md` §1 e
no comentário de cada arquivo.)

| Componente | Client? | Conteúdo/dado | Âncora | Reveal |
|---|---|---|---|---|
| `SymptomsSection` | sim | 3 "capítulos" (`symptomChapters`) em tabs (desktop)/accordion (mobile): foto + impacto + 2 sintomas cada | `#sintomas` | CSS custom (`data-active`), sem `Reveal` |
| `DiagnosisSection` | sim | 3 "zonas" (`planZones`) em tabs: foto + miniatura de planta sobreposta + `diagnosisAreas`/`diagnosisOutcomes` + `nextSteps` | `#diagnostico` | `Reveal variant="settle"` |
| `ScopeSection` | sim | 5 "níveis de atuação" (`scopeLevels`) em espinhaço horizontal (desktop)/accordion (mobile) | `#atuacao` | CSS custom, sem `Reveal` |
| `ScopeTriadBand` | não | 3 etapas fixas cruzando `scopeTriad` (`navigation.ts`) com `methodSteps` (`diagnosis.ts`, via `findMethodStep` — lança erro se o título buscado não existir no array) | `#transicao` | Sem `Reveal` |
| `PillarsSection` | não | 3 cartões (`pillars.ts`), numeral esmaecido + iniciais do responsável | `#pilares` | `Reveal`, delay escalonado |
| `ProjectsSection` | não | 1 registro principal + 3 registros (`projects.ts`); props `tone`/`compact` | `#projetos` | `PhotoReveal` + `Reveal variant="settle"` |
| `LeonardoSection` | não | Retrato + tese + trajetória (4 marcos selecionados manualmente) + link `#livro` | `#leonardo` | `Reveal variant="settle"` |
| `JourneySection` | não | 3 estágios fixos, misturando `methodSteps[2].description` (por índice posicional) e `positioning.essence` | `#metodo` | Sem `Reveal` |
| `EquipmentStripSection` | não | Categoria prioritária + grade de categorias (`equipmentCategories`); props `compact` | `#equipamentos` | `PhotoReveal` + `Reveal variant="side"` |

**Nota de robustez (não é bug hoje):** `ScopeTriadBand` usa
`findMethodStep(title)` para casar por título de string com um item de
`methodSteps`, e `JourneySection` indexa `methodSteps[2]` por posição —
ambos os padrões dependem de `diagnosis.ts` manter exatamente a mesma
ordem/títulos hoje presentes. Não há erro atual (build e render passam),
mas é um acoplamento implícito entre arquivos que vale ter em mente antes
de reordenar ou renomear itens de `methodSteps` no futuro — qualquer
mudança ali deve conferir os dois consumidores.

## 3. Hooks (`src/hooks/`)

| Hook | Função | Consumidor |
|---|---|---|
| `use-carousel.ts` | Estado de carrossel com autoplay, pausa externa, respeita `prefers-reduced-motion` | `hero-section.tsx` |
| `use-reveal-on-scroll.ts` | `IntersectionObserver` (threshold 0.12), marca visível uma vez; fallback visível se `IntersectionObserver` não existir | `animations/reveal.tsx` |
| `use-scroll-threshold.ts` | `boolean` de "passou de X px de scroll" | `header.tsx`, `whatsapp-float.tsx` |

## 4. `src/lib/`

| Arquivo | Função |
|---|---|
| `whatsapp.ts` | `whatsappUrl(topic)`/`whatsappUrlWithText(text)` — única fonte de URL `wa.me`, mensagens contextuais por origem |
| `analytics.ts` | `trackEvent()` empurra para `window.dataLayer` (sem biblioteca instalada); allowlist negativa impede vazar dado pessoal |
| `schema.ts` | JSON-LD: `organizationSchema`, `personSchema` (Leonardo, só dados confirmados), `breadcrumbSchema(items)`, `faqSchema(items)` |
| `metadata.ts` | `defaultMetadata` + `pageMetadata({title, description, path, image?})` — toda rota interna passa por aqui |
| `utils.ts` | `cn()` (merge de classes Tailwind, com registro das escalas de tipografia customizadas) |

## 5. Dependências entre pilares/dados — mapa de fonte única

Para evitar que um valor comercial (métrica, copy de pilar, dado de
contato) precise ser editado em mais de um lugar:

- **Métricas de escala** (18 anos / 3.000+ / Brasil): fonte única
  `heroMetrics` e `scopeMetrics` em `site.ts`, consumidas por
  `hero-section.tsx` e `credibility-section.tsx`.
- **Copy dos 3 pilares**: duplicada por design (não por acidente) entre
  `hero-slides.ts` (versão "slide", com `context` condensado) e
  `pillars.ts` (versão "cartão") — os dois arquivos citam a mesma origem
  comercial, sem inventar dado novo em nenhum dos dois.
- **Contato** (`contact` em `site.ts`): única fonte para telefone, e-mail,
  Instagram institucional — consumida por `header.tsx`, `footer.tsx`,
  `mobile-menu.tsx`, `whatsapp-float.tsx`, `contact-form.tsx`.
- **Guilherme/Leonardo** (bullets de "Quem conduz"): `team.ts`, que
  reexporta nome/retrato/Instagram de `leonardo.ts` para Leonardo (evita
  duplicar esses três campos) e declara os bullets de Guilherme como
  conteúdo próprio, não derivado de nenhum outro arquivo.

## 6. Oportunidades de consolidação identificadas

Nenhuma consolidação estrutural urgente foi encontrada — a arquitetura já
está bem segmentada (dado em `src/data/`, apresentação em
`src/components/`, sem componente duplicando outro). As duas únicas
oportunidades reais, ambas de baixíssimo risco e já resolvidas nesta
rodada, estão em `01-auditoria-geral.md` §2 (export morto
`solutionsNav`, constantes órfãs em `spacing.ts`).

Um candidato de **médio prazo, não executado nesta rodada** por não ter
urgência nem risco a mitigar: os múltiplos diretórios de evidência visual
em `docs/` (`hero-validacao/`, `hero-final/`, `home-evolucao/`,
`home-evolucao-v3/`, `home-correcao-final-20260803/`,
`leonardo-validacao/`, `direcao-arte-2026080{1,2,3}/`) poderiam ser
consolidados sob um único `docs/archive/direcao-arte/<data>/` para reduzir
a quantidade de pastas soltas na raiz de `docs/` — puramente
organizacional, sem efeito em código ou conteúdo. Registrado como possível
item de faxina futura, não como pendência desta auditoria.

---

## 7. Rodada 2 (2026-08-04) — atualização

### 7.1 Ordem real da home (inalterada)

A **sequência de seções não mudou**. O que mudou foi a composição de quatro
delas e a posição de um bloco:

hero → sintomas → transição (tríade) → diagnóstico → atuação (5 níveis) →
pilares → quem conduz → projetos → leonardo → método → equipamentos →
indústria do inox → credibilidade → CTA final

O mapa de composição com a caracterização de cada seção está no comentário de
`src/app/page.tsx`, atualizado nesta rodada.

### 7.2 Movimentação de bloco e de âncora

| O que | De | Para |
|---|---|---|
| Bloco do livro | `credibility-section.tsx` (fim da seção) | `leadership-section.tsx`, dentro do dossiê de Leonardo |
| Âncora `id="livro"` | idem | idem — **acompanhou o bloco** |

A âncora tem **dois links de entrada**, ambos verificados após a mudança:

- `components/sections/leonardo-section.tsx:188` → `href="#livro"`
- `data/industry.ts:49` → `{ label: 'Conheça o livro', href: '/#livro' }`

### 7.3 Nova dependência entre seções (fonte única)

`pillars-section.tsx` passou a importar `leadershipTeam` de `data/team.ts` — a
**mesma fonte** que `leadership-section.tsx` usa. É deliberado: a faixa de
responsabilidade dos pilares e a seção "Quem conduz" dizem a mesma coisa sobre
as mesmas duas pessoas e não podem divergir. Nome e função não são redigitados;
os pilares de cada pessoa são derivados filtrando `pillars.responsible` pelo
nome.

Mapa resultante:

- `data/pillars.ts` → `pillars-section.tsx` (cartões + derivação da faixa)
- `data/team.ts` → `pillars-section.tsx` (faixa de responsabilidade) e
  `leadership-section.tsx` (dossiês)
- `data/leonardo.ts` → `leadership-section.tsx` (bloco do livro),
  `leonardo-section.tsx` e `book-section.tsx` (`/leonardo-bianchini`)

### 7.4 Responsabilidades — o que cada seção responde

| Seção | Pergunta que responde | Não responde |
|---|---|---|
| pilares | o que a empresa entrega e quem responde por cada frente | quem são essas pessoas |
| quem conduz | quem são, com que credencial e que obra publicada | em que etapa do processo entram |
| atuação | em que nível a Bianchini entra | por onde o cliente entra |
| método | como o trabalho acontece, do diagnóstico ao acompanhamento | o que acontece logo após o primeiro contato |
| diagnóstico | por que o diagnóstico vem antes da compra — e o que acontece depois do primeiro contato | como é o processo completo |

A última linha é a divisão de trabalho que resolveu a repetição entre
`nextSteps` e `methodSteps`: o **diagnóstico** responde "o que acontece se eu
clicar agora"; o **método** responde "como é o trabalho inteiro".

### 7.5 Estado de componente adicionado

`hero-section.tsx` ganhou dois estados (`displayIndex`, `leaving`) e um
`useRef` de timeout, para a substituição coordenada de conteúdo na troca de
slide. O timeout é limpo no unmount, junto com o de interação que já existia.
Com `prefers-reduced-motion` o caminho da defasagem não é executado.

Custo medido: **+0,4kB** no bundle da home (11,8 → 12,2kB). First Load JS
inalterado (139kB).

### 7.6 Oportunidades de consolidação — situação

Três das identificadas na rodada 1 foram executadas nesta:

- livro em dois lugares → um
- credencial de autoria em dois lugares → um
- `nextSteps` × `methodSteps` → divisão de papéis explícita

Continuam em aberto (sem urgência, registradas para uma etapa futura):

- rotas antigas (`/solucoes/*`, `/projetos`, `/sobre`, `/leonardo-bianchini`)
  fora da navegação de destaque mas ainda existentes por SEO e compatibilidade
  — **não remover sem análise de tráfego e de links externos**;
- consolidação dos diretórios de evidência visual em `docs/`;
- `show-cooking.jpg`, que deixou de ser usado pela hero (ver
  `02-inventario-de-arquivos.md` §10.1).
