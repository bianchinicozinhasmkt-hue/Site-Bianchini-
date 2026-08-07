# `docs/archive/` — índice do arquivo histórico

```text
STATUS: REFERENCE (este índice) / o conteúdo arquivado abaixo é HISTORICAL ou SUPERSEDED
USO: NENHUM ARQUIVO SOB ESTE DIRETÓRIO PODE SER USADO COMO DIREÇÃO VIGENTE
```

Este diretório existe para que histórico **não seja apagado** e ao mesmo tempo **não seja
confundido com direção atual**. Nenhum arquivo aqui — em nenhuma subpasta — orienta
implementação, conteúdo, arquitetura ou design da V1 ou da V2. Se um agente chegar aqui
procurando "o que fazer", a resposta é: não é aqui, volte para `docs/v2/README.md` (índice
de navegação vigente) ou `CLAUDE.md`.

Nada foi excluído nesta organização — tudo foi movido com `git mv`, preservando o histórico
do Git.

## Subpastas

### `superseded/`

Documentos que **já foram a direção vigente** e foram formalmente substituídos por um
documento nomeado. Cada um tem um cabeçalho `STATUS: SUPERSEDED` indicando o substituto.

- `DIRECAO_MESTRA_SITE_BIANCHINI.md` — direção visual/de conteúdo v1.0 (31/07/2026).
  Substituído por `GUIA_COMPLETO_DO_SITE_BIANCHINI.md` (conteúdo/layout) e
  `MASTER_BIANCHINI.md` (hierarquia comercial e arquitetura-alvo da V2). A superseção já
  estava registrada em `CLAUDE.md` e no `README.md` da raiz antes desta reorganização —
  mover o arquivo apenas torna essa decisão física, não a cria.

### `v1/`

Relatórios de entrega e rodadas de correção da V1, já concluídos. Valor: rastreabilidade
de o que foi feito e por quê — não são fonte de requisito.

- `relatorios/` — três relatórios de evolução visual da Home V1 (autoridade de Leonardo,
  evolução da Home, "terceira passagem" de de-templatização). Sequenciais entre si; o mais
  recente incorpora o aprendizado dos anteriores, mas nenhum deles é normativo — a home V1
  atual, e a arquitetura aprovada da V2 (`docs/v2/specs/`), é que valem.
- `v1-1-lote-01/` — seis correções pontuais da V1 (formulário, hero mobile, contraste,
  CLS, performance) e a validação final do lote. Todas as correções descritas já estão
  refletidas no código atual — este é o registro de como e quando.

### `audits/`

Rodadas de auditoria estruturada, já concluídas, cujo achados foram corrigidos na própria
rodada (registrado em cada relatório de validação final).

- `site-audit/` — rodada 2 de auditoria de UX/acessibilidade/performance da Home V1
  (2026-08-04), oito documentos (contexto, achados, inventário de arquivos, decisões de
  design da rodada, arquitetura de componentes, plano de implementação, validação final,
  changelog) mais uma rodada 3 parcial (reforma do seletor de pilares do hero). Diagnóstico
  histórico — para o diagnóstico de produto ainda tratado como referência viva, ver
  `docs/product-audit/` (que **não** foi movido para cá; continua em `docs/`, citado por
  `MASTER_BIANCHINI.md` §13 e por `docs/v2/specs/V2-01-home-arquitetura.md`).

### `legacy-visual/` (pré-existente, não recriado nesta etapa)

Direção visual anterior à identidade grafite/amarelo atual (navy/bordô), arquivada em
31/07/2026, com manifesto de hashes e caminho de recuperação. Inclui agora também
`AUDITORIA_LIMPEZA_REPOSITORIO.md`, o relatório da própria auditoria que arquivou esse
material — vive aqui porque os dois descrevem o mesmo evento.

### `raw-assets/` (pré-existente, não recriado nesta etapa)

Dois arquivos `.zip` (`lines.zip`, `projetos.zip`) sem README próprio. Não inspecionados
nesta etapa de governança documental — são binários, não documentos de direção, e ficam
fora do escopo desta correção (nenhum `.md` cita conteúdo normativo a partir deles).

## O que NÃO está aqui e por quê

- **`docs/product-audit/`** — permanece em `docs/`, fora do arquivo. É diagnóstico da V1
  que o próprio `MASTER_BIANCHINI.md` (§13) declara "continua relevante", e é citado
  extensivamente (25 referências) pela spec aprovada `docs/v2/specs/V2-01-home-arquitetura.md`.
  Mover essas 14 páginas quebraria essas citações sem necessidade — a regra de precedência
  (`docs/v2/README.md`) já deixa claro que é referência, não decisão.
- **`docs/v1-release/`** — permanece em `docs/`, fora do arquivo, porque três dos seus seis
  arquivos (`02-checklist-publicacao.md`, `04-pendencias-externas.md`, `06-publicacao.md`)
  são **checklists e pendências ainda abertas** (domínio, `NEXT_PUBLIC_SITE_URL`, WhatsApp
  definitivo, formulário ponta a ponta), não histórico fechado — arquivá-los faria essas
  pendências reais parecerem resolvidas. Os outros três arquivos da mesma pasta
  (`00-estado-inicial.md`, `01-auditoria.md`, `03-hero-e-fluxo.md`, mais
  `capturas/fluxo/mapa-de-posicoes.md`) são o suporte histórico direto dessas pendências e
  ficam junto por coesão, não por engano de classificação.
- **`docs/hostinger-manual/`** — permanece em `docs/`: `01-guia-deploy-hostinger.md` é
  manual de deploy reutilizável (referência viva até a V1 ser publicada), e
  `00-estado-inicial.md` é um snapshot pequeno e de baixo risco que oferece contexto direto
  para o guia ao lado.

Esta lista existe para que "por que não foi arquivado" nunca precise ser deduzido de novo.
