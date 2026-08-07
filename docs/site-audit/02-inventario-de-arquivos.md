# 02 — Inventário de arquivos

> Classificação verificada por leitura de código e busca de referências
> (import estático, uso em JSX, link, redirect, sitemap), não por nome de
> arquivo. Metodologia e achados completos de arquitetura em
> `04-arquitetura-e-componentes.md`; este documento é só a classificação.

Categorias usadas: **ativo e necessário** · **ativo, precisa de revisão** ·
**compartilhado** · **legado necessário** · **possível duplicação** ·
**possível remoção** · **não utilizado** · **ainda não confirmado**.

## 1. `src/data/` — 24 arquivos, todos com pelo menos 1 importador

| Arquivo | Classificação | Consumidores |
|---|---|---|
| `site.ts` | ativo e necessário | ~21 arquivos (o mais reutilizado do projeto) |
| `navigation.ts` | ativo, precisa de revisão | `header.tsx`, `mobile-menu.tsx`, `footer.tsx`, `scope-triad-band.tsx` — ver achado P3 (`solutionsNav` morto) em `01-auditoria-geral.md` §2 |
| `hero-slides.ts` | ativo e necessário | `hero-section.tsx` |
| `pillars.ts` | ativo e necessário | `pillars-section.tsx` |
| `team.ts` | ativo e necessário | `leadership-section.tsx` |
| `leonardo.ts` | ativo e necessário | `leonardo-section.tsx`, `leonardo-hero.tsx`, `book-section.tsx`, `credibility-section.tsx`, `/leonardo-bianchini` |
| `testimonials.ts` | ativo, precisa de revisão | `credibility-section.tsx`, `testimonials-section.tsx` — ver achado P1 (consentimento) em `01-auditoria-geral.md` §9 |
| `industry.ts` | ativo e necessário | `industry-inox-section.tsx` |
| `diagnosis.ts` | ativo e necessário | `diagnosis-section.tsx`, `scope-triad-band.tsx` |
| `scope-levels.ts` | ativo e necessário | `scope-section.tsx` |
| `symptom-chapters.ts` | ativo e necessário | `symptoms-section.tsx` |
| `projects.ts` | ativo e necessário | `projects-section.tsx`, `/projetos` |
| `equipment-categories.ts` | ativo e necessário | `equipment-strip-section.tsx` |
| `equipment-lines.ts` | ativo e necessário | `/linhas-de-produtos` |
| `rational.ts` | ativo e necessário | `/linhas-de-produtos/forno-combinado-rational` |
| `solutions.ts` | ativo e necessário | `/solucoes`, várias seções |
| `clients.ts` | ativo e necessário | `credibility-section.tsx`, `trust-section.tsx` |
| `differentials.ts` | ativo e necessário | `differentials-section.tsx` |
| `problems.ts` | ativo e necessário | `problems-section.tsx` |
| `process.ts` | ativo e necessário | `case-study-section.tsx` |
| `comparison.ts` | ativo e necessário | `comparison-section.tsx` |
| `segments.ts` | ativo e necessário | `segments-section.tsx`, `credibility-section.tsx` |
| `faq.ts` | ativo e necessário | `faq-block.tsx` (várias rotas de `/solucoes/*`) |
| `pages.ts` | ativo e necessário | páginas institucionais (`/sobre` etc.) |

Nenhum arquivo de `src/data/` está sem importador.

## 2. `src/components/sections/` — 25 arquivos

Todos ativos e usados (13 na home, os demais em rotas internas — ver
`04-arquitetura-e-componentes.md` para o mapa completo de qual seção
alimenta qual rota). Único ponto de atenção, já resolvido no código com
comentário explícito, não um problema:

| Arquivo | Classificação | Nota |
|---|---|---|
| `book-section.tsx` | ativo, escopo reduzido | Usado só por `/leonardo-bianchini` hoje (`tone="canvas" detailed`). A home tem seu **próprio** bloco de livro, escrito localmente dentro de `credibility-section.tsx` — decisão documentada no próprio código, não é duplicação acidental (card compacto vs. seção completa de uma rota de autoridade). |
| `about-section.tsx` | **removido** | Citado em comentário de `credibility-section.tsx` como já removido do repositório na consolidação de 2026-08 — confirmado: o arquivo não existe mais (`git status` mostra `D src/components/sections/about-section.tsx`, exclusão já feita no working tree, pendente só de commit). |

## 3. `src/components/ui/`, `blocks/`, `shared/`, `animations/`

Todos os arquivos têm pelo menos 1 importador confirmado — nenhum
componente órfão encontrado nesta auditoria.

| Pasta | Arquivos | Classificação |
|---|---|---|
| `ui/actions/` | `button.tsx` | ativo e necessário — uso extenso |
| `ui/typography/` | `heading.tsx` | ativo e necessário — uso extenso |
| `ui/` | `accordion.tsx`, `card.tsx`, `field.tsx`, `icons.tsx`, `book-cover.tsx`, `tech.tsx`, `leonardo-portrait.tsx` | ativo e necessário — cada um com importador confirmado |
| `blocks/` | `page-hero.tsx`, `feature-grid.tsx`, `deliverables-block.tsx`, `faq-block.tsx` | compartilhado — reutilizados por múltiplas rotas de `/solucoes/*`, `/sobre` |
| `shared/` | `logo.tsx` | ativo e necessário — `header.tsx`, `footer.tsx` |
| `animations/` | `reveal.tsx`, `photo-reveal.tsx` | ativo e necessário — uso muito extenso (`reveal.tsx` em ~20 arquivos) |

Removidos no working tree, confirmados sem referência ativa restante
(`git status` mostra `D`, exclusão feita, pendente de commit):
`ui/button.tsx`, `ui/heading.tsx`, `ui/icon.tsx`, `ui/logo.tsx`,
`ui/reveal.tsx` — versões antigas, substituídas pelas equivalentes em
`ui/actions/`, `ui/typography/`, `ui/icons.tsx`, `shared/logo.tsx`,
`animations/reveal.tsx`.

## 4. `src/hooks/` — 3 arquivos, todos ativos

`use-carousel.ts` (hero), `use-reveal-on-scroll.ts` (`Reveal`),
`use-scroll-threshold.ts` (header, WhatsApp flutuante).

## 5. `src/lib/`

`analytics.ts`, `schema.ts`, `metadata.ts`, `utils.ts`, `whatsapp.ts` —
todos ativos e necessários, resumidos em `04-arquitetura-e-componentes.md`.

## 6. Assets em `public/`

| Caminho | Classificação | Nota |
|---|---|---|
| `public/images/brand/*` | ativo e necessário | logos oficiais, referenciados por `Logo` |
| `public/images/hero/*` | ativo e necessário | 3 fotos do carrossel da hero |
| `public/images/clients/*` | ativo e necessário | logos de clientes na faixa de credibilidade |
| `public/images/projects/*.jpg` | ativo e necessário | fotos de projeto usadas em `#diagnostico`/`#projetos` |
| `public/images/team/*` | ativo e necessário | retratos de Leonardo/Guilherme e registros de campo |
| `public/images/book/*` | ativo e necessário | capa real do livro |
| `public/images/testimonials/*` | ativo e necessário | fotos dos 2 depoimentos — ver achado P1 de consentimento |
| `public/images/lines.zip` | **possível remoção — executada (movido)** | não referenciado por código; servido publicamente por estar sob `public/`. Movido para `docs/archive/raw-assets/` nesta rodada (não apagado). |
| `public/images/projects/projetos.zip` | **possível remoção — executada (movido)** | idem acima. |

## 7. Arquivos na raiz e material de referência externo

| Caminho | Classificação | Nota |
|---|---|---|
| `MOCKUP_HERO_APROVADO.png` | ativo e necessário | especificação visual obrigatória do hero |
| `CLAUDE.md`, `README.md` | ativo e necessário | fonte normativa e operacional |
| `GUIA_COMPLETO_DO_SITE_BIANCHINI.md`, `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md` | ativo e necessário | 4ª/5ª fonte de autoridade de conteúdo/visual, ver `CLAUDE.md` |
| `DIRECAO_MESTRA_SITE_BIANCHINI.md` | legado necessário | citado por `AUDITORIA_LIMPEZA_REPOSITORIO.md` como fonte normativa de uma rodada anterior; `CLAUDE.md` já a supera para conflitos de cor/tipografia (grafite+amarelo vence) — preservar como histórico, não editar |
| `AUDITORIA_LIMPEZA_REPOSITORIO.md` | legado necessário | relatório da rodada de limpeza de 2026-07-31; contexto histórico útil, não reexecutar |
| `AGENTS.md` | ativo e necessário | define `_entrega_chatgpt/` como somente leitura |
| `_entrega_chatgpt/` | **não tocar** | mirror local somente leitura de um projeto ChatGPT externo, por regra explícita de `AGENTS.md` — pode ser substituído externamente a qualquer momento, não editar/mover/remover |
| `bianchini-site-original-para-analise.zip` (10,5MB, raiz) | ainda não confirmado | material de análise do site anterior, não referenciado por código nem por documentação ativa. Não removido nesta rodada — decisão do gestor se ainda é necessário no repositório de trabalho ou se deve migrar para armazenamento externo |
| `docs/archive/` | legado necessário | material histórico já triado em rodada anterior (`docs/archive/legacy-visual/`) — não normativo, preservado por regra |
| `docs/mockups/`, `docs/direcao-arte-*/`, `docs/hero-*/`, `docs/home-evolucao*/`, `docs/home-correcao-final-20260803/`, `docs/leonardo-validacao/` | ativo, precisa de revisão | evidência visual de rodadas de direção de arte anteriores (screenshots de validação). Não normativos para decisão nova, mas úteis como histórico de "antes/depois" — candidatos a consolidar num único `docs/archive/direcao-arte/` numa limpeza futura, não decidido nesta rodada |
| `docs/COMPONENT_MAP.md`, `docs/DESIGN_SPEC.md`, `docs/FRONTEND_ARCHITECTURE.md` | ativo, precisa de revisão | mapas técnicos de rodadas anteriores; podem ter defasado frente ao código atual (não conferidos byte a byte nesta rodada — ver `04-arquitetura-e-componentes.md` para o mapa atualizado) |
| `docs/RELATORIO_TERCEIRA_PASSAGEM_HOME.md`, `docs/RELATORIO_EVOLUCAO_HOME.md`, `docs/RELATORIO_AUTORIDADE_LEONARDO.md` | ativo e necessário | citados por `CLAUDE.md` como fonte do "vocabulário visual" vigente — normativos |
| `scripts/visual-audit.mjs` | ativo e necessário | script de auditoria visual usado em rodada anterior (2026-08-03); mantido |
| `scripts/site-audit-capture.mjs`, `scripts/site-audit-responsive.mjs` | ativo e necessário | criados nesta rodada para `screenshots/before|after/` e para a varredura de responsividade — ver `01-auditoria-geral.md` §1 e §5 |

## 8. Diretórios de trabalho do navegador headless (não versionados)

`.tmp-edge-cdp/`, `.tmp-edge-cdp2/`, `.tmp-edge-cdp3/` — perfis temporários
do Edge usados para captura via CDP (nesta rodada e em rodadas anteriores).
Não versionados (`??` no `git status`), sem função fora da sessão de
captura. Classificação: **não utilizado** pelo site — seguro remover ou
deixar ignorado; não fazem parte do código-fonte nem do build.

## 9. Resumo — nada removido, dois arquivos movidos

Consistente com a regra de segurança da auditoria (nunca remover por
suspeita de nome), **nenhum arquivo foi apagado nesta rodada**. As duas
únicas movimentações de arquivo foram os `.zip` de `public/images/` para
`docs/archive/raw-assets/` (§6), reversíveis com um `git mv` inverso — ver
`07-registro-de-alteracoes.md` para o registro completo com rollback.

---

## 10. Rodada 2 (2026-08-04) — atualização do inventário

### 10.1 Assets

| Arquivo | Classificação anterior | Agora |
|---|---|---|
| `public/images/hero/operação-comerrcial.png` | **não utilizado** — existia em `public/` sem nenhuma referência em `src/` | **ativo e necessário**, renomeado para `public/images/hero/operacao-comercial.png` e ligado ao slide 3 da hero |
| `public/images/hero/show-cooking.jpg` | ativo (slide 3 da hero) | **possível remoção — ainda não confirmado.** Deixou de ser usado pela hero; zero referências em `src/` (verificado). **Não foi removido**: é fotografia de acervo, e descartar material do acervo é decisão do gestor, não da auditoria |

Motivo do rename: o padrão de `public/` documentado em `CLAUDE.md` é minúsculo,
sem acento e com hífen; e um caminho acentuado depende de normalização Unicode
consistente entre Windows (onde o arquivo foi salvo) e o servidor de produção
(Linux, byte-sensitive). Feito em dois passos, conforme a armadilha de
case-insensitivity do Windows registrada em `CLAUDE.md`.

### 10.2 Componentes

| Arquivo | Situação |
|---|---|
| `components/sections/pillars-section.tsx` | **ativo — reescrito.** Deixou de importar `IndexNumeral`; passou a importar `leadershipTeam` |
| `components/sections/leadership-section.tsx` | **ativo — reescrito.** Passou a importar `BookCover` e `book` |
| `components/sections/diagnosis-section.tsx` | **ativo — reescrito.** Mesmas importações, menos `CheckIcon` |
| `components/sections/credibility-section.tsx` | **ativo — reduzido.** Deixou de importar `BookCover`, `LinkButton`, `book`, `leonardo` |
| `components/sections/scope-section.tsx` | **ativo — só os controles alterados** |
| `components/sections/hero-section.tsx` | **ativo — alterado** (enquadramento, alinhamento, fundo, scrims, transição, `aria`) |
| `components/layout/header.tsx` | **ativo — alterado.** Deixou de importar `InstagramIcon` e `contact` |
| `components/layout/mobile-menu.tsx` | **ativo — alterado** (bloco de contato) |
| `components/ui/book-cover.tsx` | **ativo — compartilhado.** Agora consumido por `leadership-section.tsx` (home) e `book-section.tsx` (`/leonardo-bianchini`). Não alterado |
| `components/sections/book-section.tsx` | **ativo — legado necessário.** Não é usado na home (já não era), mas segue em `/leonardo-bianchini`. **Não remover** |
| `components/ui/tech.tsx` → `IndexNumeral` | **ativo.** Deixou de ser usado pelos pilares, mas continua consumido por outras seções — verificado antes de qualquer conclusão |

### 10.3 Dados

| Arquivo | Situação |
|---|---|
| `src/data/hero-slides.ts` | alterado: slide 3 + dois campos opcionais no tipo (`media.position`, `media.positionDesktop`) |
| `src/data/team.ts` | alterado: bullet de autoria de Leonardo removido — **o dado não saiu do projeto**, segue em `book`/`leonardo.ts` |
| `src/data/diagnosis.ts` | **não alterado.** `nextSteps` continua íntegro com as descrições; o que mudou foi só o que a home renderiza |
| `src/data/pillars.ts` | **não alterado.** `responsible` continua sendo a fonte da associação pilar → pessoa |

### 10.4 Screenshots

`screenshots/before/` e `screenshots/after/` foram recriados para esta rodada.
As capturas da rodada 1 **não foram apagadas** — foram movidas para
`screenshots/_round1/before/` e `screenshots/_round1/after/`.

### 10.5 Nada removido

Como na rodada 1, **nenhum arquivo foi removido do repositório**. Um asset foi
renomeado; um asset (`show-cooking.jpg`) passou a "possível remoção — ainda não
confirmado". Os itens da rodada 1 marcados "ainda não confirmado"
(`bianchini-site-original-para-analise.zip` na raiz, consolidação dos
diretórios de evidência visual em `docs/`) continuam sem decisão.
