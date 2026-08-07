# 00 — Contexto e objetivos

> Documento de referência da auditoria iniciada em 2026-08-04. Não substitui o
> `CLAUDE.md` (fonte normativa de convenções de código e conteúdo) nem os
> relatórios de direção de arte em `docs/` (`RELATORIO_TERCEIRA_PASSAGEM_HOME.md`,
> `RELATORIO_EVOLUCAO_HOME.md`, `RELATORIO_AUTORIDADE_LEONARDO.md`,
> `COMPONENT_MAP.md`, `DESIGN_SPEC.md`, `FRONTEND_ARCHITECTURE.md`) — resume o
> ponto de partida desta rodada e aponta para onde cada decisão anterior já
> está registrada, em vez de reescrevê-la.

## 1. Contexto da Bianchini

A Bianchini é uma empresa de **diagnóstico, projeto, implantação e consultoria
de operações de food service** — não um catálogo de equipamentos. 18 anos de
atuação, mais de 3.000 projetos entregues, sediada no Rio de Janeiro com
atendimento em todo o Brasil.

A empresa é conduzida por dois responsáveis, cada um por uma frente distinta:

- **Leonardo Bianchini** — projetos, engenharia, equipamentos. No setor desde
  2008, autor do livro *"Dominando as Vendas de Equipamentos de Cozinhas
  Industrial e Profissional"*.
- **Guilherme Beghini** — operação comercial (CRM/ERP, estruturação de time de
  vendas, geração de demanda, IA aplicada a vendas). Foi dono de restaurante
  por 8 anos antes de assumir essa frente.

Uma terceira frente, **indústria do inox**, atende um público diferente (o
fabricante de equipamentos, não o operador de cozinha) e por isso não é um
quarto pilar — é uma seção própria, separada dos três pilares.

## 2. Público

Decisores B2B de operações de food service (donos e gestores de restaurantes,
hotéis, hospitais, cozinhas industriais e institucionais) e, separadamente,
fabricantes de equipamentos de cozinha profissional (frente "indústria do
inox"). Linguagem técnica sem ser hermética — o site fala de RDC 216, fluxo,
exaustão, dimensionamento, mas sempre traduzindo para consequência de
operação ("a escolha errada cobra todo mês em consumo, retrabalho e parada de
cozinha").

## 3. Proposta do site

Copy central, aprovada e transcrita literalmente em `src/data/site.ts`
(`positioning.promise`), não deve ser reescrita:

> "Diagnosticamos, estruturamos e transformamos operações de food service."

O site não vende equipamento isolado — vende a leitura da operação que
precede a escolha certa de projeto, equipamento e estrutura comercial.

## 4. Os três pilares

| # | Pilar | Responsável | Copy estratégica (aprovada) |
|---|---|---|---|
| 01 | Projetos | Leonardo | "Do estudo de viabilidade ao projeto técnico em conformidade com a RDC 216 da Anvisa. Layout, fluxo, exaustão e câmaras dimensionados para a operação real, não para o papel." |
| 02 | Equipamentos | Leonardo | "Especificação técnica e fornecimento de equipamentos profissionais e tecnológicos com retorno calculado. A escolha errada cobra todo mês em consumo, retrabalho e parada de cozinha." |
| 03 | Operação Comercial | Guilherme | "Funil, CRM, metas, time e geração de demanda. Cozinha eficiente sem operação de vendas continua sem faturamento." |

A frase final do pilar 03 é uma ponte estratégica obrigatória entre cozinha e
faturamento — não deve ser diluída em nenhuma reescrita futura.

Estado verificado em 2026-08-04 (ver `01-auditoria-geral.md`): os três pilares
já estão implementados como os três slides do carrossel da hero
(`src/data/hero-slides.ts`) e repetidos como os três cartões de
`pillars-section.tsx` (`#pilares`) — copy consistente com a tabela acima nos
dois lugares.

## 5. Função da home

Página única: a navegação principal não leva mais a rotas próprias, rola até
âncoras da própria home (decisão de 2026-08-03, documentada em
`src/data/navigation.ts` e no comentário de `src/app/page.tsx`). A sequência
narrativa atual (13 seções) é:

```
hero → sintomas → transição (tríade) → diagnóstico → atuação (5 níveis) →
pilares (3) → quem conduz (Leonardo + Guilherme) → projetos → autoridade de
Leonardo → método/jornada → equipamentos → indústria do inox → credibilidade
(escala, logos, depoimentos, livro) → CTA final
```

Rotas antigas (`/solucoes/*`, `/projetos`, `/sobre`, `/leonardo-bianchini`,
`/linhas-de-produtos*`) continuam existindo por compatibilidade e SEO, sem
link de destaque na navegação principal — alcançáveis pelo rodapé e por CTAs
contextuais.

## 6. Princípios visuais

Fonte normativa, nesta ordem (repetido de `CLAUDE.md`, porque é a regra mais
importante do projeto e a mais fácil de violar por engano):

1. `MOCKUP_HERO_APROVADO.png` — geometria do hero.
2. Identidade publicada em bianchinicozinhas.com.br — grafite `#101010`,
   amarelo da marca, Oswald condensada em rótulos.
3. Dados e projetos reais da Bianchini.
4. `GUIA_COMPLETO_DO_SITE_BIANCHINI.md`.
5. `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`.

O sistema de cor navy/bordô (`docs/archive/legacy-visual/`) está superado e
não deve retornar. Os "tetos" de vocabulário visual (grade cartesiana,
diagonal, numeral gigante, densidade de divisores) estão documentados em
`CLAUDE.md` §"Vocabulário visual" e não são repetidos aqui — quem for alterar
composição de seção deve ler aquele bloco primeiro.

## 7. Restrições (não negociáveis nesta auditoria)

- Não inventar clientes, números, cases, depoimentos, certificações,
  credenciais ou serviços não aprovados.
- Não reintroduzir "Construção e Reformas" como pilar, seção ou âncora — o
  redirect `/construcao-e-reformas` → `/solucoes/arquitetura` é a única
  sobrevivência aprovada.
- Não reintroduzir credenciais antigas de Guilherme ("30 anos em gestão",
  "mil colaboradores", operação de restaurantes, formação acadêmica) — os
  quatro pontos aprovados estão fechados, ver `05-plano-de-implementacao.md`
  se houver tentativa de expandi-los.
- `book.purchaseUrl` permanece `null` até existir link oficial confirmado.
- Não usar Framer Motion, nem biblioteca de ícones, nem biblioteca de
  animação — `CLAUDE.md` já rejeita essas adições.
- Não repetir o redesenho de cartões da hero recentemente revertido — ver
  §8.

## 8. Decisões estratégicas já aprovadas relevantes para esta rodada

- **Hero como carrossel de 3 pilares, sem cards** — a navegação dos pilares
  vive direto sobre a fotografia (sem painel opaco, sem cartão), documentado
  em `hero-section.tsx`. Verificado nesta auditoria como o estado atual do
  código (ver `01-auditoria-geral.md`, item "Hero"): a reversão pedida no
  briefing desta rodada **já está aplicada** — não há trabalho pendente de
  reversão, só de refinamento pontual.
- **Quatro seções viraram uma** (`CredibilitySection`): `TrustSection`,
  `TestimonialsSection`, `BookSection` e `AboutSection` saíram da home e
  passaram a existir só em rotas internas — motivo e trade-offs documentados
  no comentário de `credibility-section.tsx`.
- **Método e diferenciais consolidados em `JourneySection`** — mesmo
  raciocínio de evitar duas seções com o mesmo esqueleto visual em sequência.
- **Leonardo movido para depois de projetos** na sequência da home.

## 9. O que esta rodada de auditoria cobre

Este ciclo (2026-08-04) audita o estado **depois** da reversão seletiva da
navegação dos pilares da hero (pré-condição informada pelo gestor) e antes de
qualquer nova alteração visual. Ver `01-auditoria-geral.md` para os achados,
`05-plano-de-implementacao.md` para a fila priorizada, e
`07-registro-de-alteracoes.md` para o que foi de fato alterado nesta rodada.

## 10. Decisões que dependem do gestor (não resolvidas por esta auditoria)

Registradas aqui centralmente; repetidas no ponto relevante de cada
documento:

- **Depoimentos de Walney Cerqueira e João Carlos R. Peres** —
  `src/data/testimonials.ts` marca explicitamente **pendente de confirmação
  com os depoentes** (cargo atual, texto final, autorização de uso do
  depoimento, do retrato e da menção à organização) antes da publicação. Os
  depoimentos **já estão publicados na home hoje** (seção Credibilidade). Isto
  é risco de conteúdo, não bug técnico — decisão do gestor: confirmar
  autorização ou remover/ocultar até confirmar.
- **Métrica "3.000+ projetos"** — `src/data/site.ts` registra divergência
  observada entre "1.000" e "3.000" em material fora do código; o projeto usa
  "3.000+" em todo lugar hoje, mas o valor final não foi validado pelo
  comercial.
- **Livro de Leonardo** — ano, editora/autopublicação, ISBN e link oficial de
  compra seguem `null`/pendentes; `heroBookSlide` existe como estrutura de
  dados pronta mas **não deve ser renderizado** enquanto isso não for
  resolvido (o próprio arquivo `leonardo.ts` documenta o bloqueio).

---

## 11. Rodada 2 (2026-08-04) — atualização e lição de método

Esta rodada **reauditou a home exigência por exigência do briefing**, e não
contra a documentação interna do projeto. A diferença importou: cinco itens que
a rodada 1 deu como já implementados **não estavam no código** (imagem
obrigatória do slide 3, Instagram no header desktop, Leonardo duplicado nos
cartões de pilar, livro fora do contexto de Leonardo, número de WhatsApp antigo
no formulário). Ver `01-auditoria-geral.md`.

**Lição de método, para as próximas rodadas:** o repositório é bem documentado, e
os comentários de componente descrevem o *estado-alvo* com precisão — o que os
torna fáceis de confundir com o *estado atual*. O comentário de
`credibility-section.tsx`, por exemplo, descrevia a seção como resultado de uma
consolidação, e era verdade; só que a consolidação descrita ali era a fusão de
quatro seções, não a mudança que o briefing pedia. Auditar contra o comentário
teria confirmado que estava tudo certo.

**Procedimento adotado daqui em diante:** cada exigência do briefing vira uma
linha de verificação com um **artefato verificável** — arquivo e linha, valor no
HTML renderizado, ou resultado de uma consulta por CDP. "O código já implementa"
não é resultado de verificação.

### Alterações de contexto institucional nesta rodada

- **Posição institucional das redes:** o rodapé passa a ser o lugar canônico do
  Instagram da empresa. O cabeçalho não tem mais rede social; o menu mobile
  mantém o item, com rótulo e alvo de toque de 44px.
- **Livro:** a apresentação do livro na home é **uma só**, dentro do dossiê de
  Leonardo em "Quem conduz". `purchaseUrl` segue `null` e nenhum CTA de compra é
  renderizado — o bloqueio do item 3 da §10 continua valendo integralmente.
- **Responsabilidade pelos pilares:** a home passa a dizer explicitamente
  "três pilares, dois responsáveis" — Leonardo em Projetos e Equipamentos,
  Guilherme em Operação Comercial. A associação é derivada de
  `pillars.responsible` e `team.role`, não redigitada.

### Pendências da §10 — situação

| Item | Situação após esta rodada |
|---|---|
| Depoimentos sem confirmação de autorização | **Aberto.** Não alterado, nem publicado de forma nova. Continua sendo a pendência mais séria do projeto |
| Métrica "3.000+ projetos" | **Aberto.** Não alterada |
| Livro: ano, editora, ISBN, link de compra | **Aberto.** Segue `null`; nenhum CTA de compra renderizado |
| `NEXT_PUBLIC_SITE_URL` de produção | **Aberto** |
