# Estado inicial — antes da preparação do artefato Hostinger

Registrado em 2026-08-05, antes de qualquer alteração feita para esta tarefa.

## Branch e HEAD

- Branch: `chore/auditoria-limpeza-20260731`
- HEAD: `a6603b3 refactor: rebuild Bianchini website with Next.js`
- Commits recentes: `a6603b3`, `b90807c`, `515a5b5`, `fa83ee2`, `14fff69`

## `git status --short`

Working tree tinha, no momento da checagem, um volume grande de alterações **não
commitadas** (modificações, exclusões e arquivos novos) — é o estado real de trabalho em
andamento na V1, não um branch limpo. Nada foi commitado, resetado ou descartado nesta
tarefa. Lista completa capturada em
`docs/hostinger-manual/_snapshots/git-status-short.txt` (cópia bruta do comando).

Resumo por categoria:

- **Modificados (M):** ~50 arquivos — config (`next.config.ts`, `tailwind.config.ts`,
  `tsconfig.json`, `.eslintrc.json`), `src/app/**`, a maior parte de
  `src/components/layout/**` e `src/components/sections/**`, `src/data/**`, `src/lib/**`,
  `src/types/index.ts`, `CLAUDE.md`, `README.md`, `.gitignore`.
- **Excluídos (D):** `BRAND_DIRECTION.md`, dois logos antigos em
  `public/images/brand/`, `about-section.tsx` e cinco primitives antigos de
  `src/components/ui/` (`button`, `heading`, `icon`, `logo`, `reveal`) — substituídos pela
  estrutura atual (`ui/actions/`, `ui/typography/`, componentes novos).
- **Não rastreados (??):** documentação de projeto na raiz (`AGENTS.md`,
  `AUDITORIA_LIMPEZA_REPOSITORIO.md`, `DIRECAO_MESTRA_SITE_BIANCHINI.md`,
  `GUIA_COMPLETO_DO_SITE_BIANCHINI.md`, `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`,
  `MOCKUP_HERO_APROVADO.png`), `_entrega_chatgpt/`, `bianchini-site-original-para-analise.zip`,
  `docs/` (guias e capturas internas), `scripts/` (tooling de auditoria visual via CDP), e
  módulos novos de `src/` que ainda não tinham sido adicionados ao índice (rotas novas em
  `src/app/*`, seções novas em `src/components/sections/*`, `src/components/blocks/`,
  `src/components/forms/`, `src/components/animations/`, `src/components/shared/`, novos
  arquivos de `src/data/*`, `src/hooks/`, `src/lib/analytics.ts`, `src/lib/schema.ts`,
  `src/styles/`).

## `git diff --stat`

53 arquivos rastreados alterados, 5.787 inserções / 2.522 remoções. Maior concentração em
`src/components/sections/hero-section.tsx` (+1461/-…) e `src/app/globals.css`
(+1028). Detalhe completo em `docs/hostinger-manual/_snapshots/git-diffstat.txt`.

## Integridade dos backups existentes

- `bianchini-site-original-para-analise.zip` (10,5 MB, raiz) — presente, não tocado.
- `_entrega_chatgpt/` — presente, não tocado.
- `docs/archive/`, `docs/v1-release/`, demais pastas de `docs/` — presentes, não tocadas.

Nenhum backup foi criado, sobrescrito ou apagado nesta tarefa.

## Ausência de `.env` no projeto e nos backups

Busca por `.env*` em toda a árvore (exceto `node_modules`) encontrou **apenas**
`.env.example` (sem segredo, só a variável `NEXT_PUBLIC_SITE_URL` documentada com valor de
exemplo `http://localhost:3000`). Não existe `.env`, `.env.local` nem qualquer variante com
segredo real no repositório. Confirmado também que `.env*.local` está listado em
`.gitignore`.

## Conflitos, merge interrompido, `.orig`/`.rej`

- `find . -name "*.orig" -o -name "*.rej"` — nenhum resultado.
- `.git/MERGE_HEAD` — não existe.
- `git status` — nenhuma entrada de conflito (`UU`, `AA`, etc.).

Working tree está limpo de resíduos de merge.

## Ambiente de execução local (máquina de preparação, não o servidor)

- `node --version`: **v22.20.0**
- `npm --version`: **10.9.3**
- `package.json.engines.node`: `>=20.9.0`

Estes números são do ambiente local (Windows) usado só para validar o build. A escolha da
versão de Node.js **no Hostinger** é decisão do responsável pelo deploy — recomenda-se
qualquer versão ≥ 20.9 disponível no hPanel (idealmente 20.x LTS ou 22.x).

## Gates de qualidade rodados sobre o estado atual (sem nenhuma alteração de código)

Rodados na íntegra, sem flags de bypass, sobre a árvore de trabalho tal como estava:

- `npm run type-check` → **limpo**, zero erros.
- `npm run lint` → **limpo**, zero erros/avisos.
- `npm run build` → **sucesso**, 19/19 rotas geradas, todas estáticas (`○`). Único aviso
  esperado: `NEXT_PUBLIC_SITE_URL não definida`, porque a variável de ambiente de produção
  ainda não existe nesta máquina — isso é esperado e **não é um bloqueador**; é a variável
  que o responsável define no hPanel antes do build de produção real (ver guia de deploy).

**Conclusão:** não havia bloqueador de build/execução. Nenhuma correção de código foi
necessária para tornar o pacote reproduzível. As únicas ações desta tarefa foram: preparar
o pacote de origem para upload manual e escrever a documentação de deploy — nada em
`src/`, `public/` ou nos dados comerciais foi alterado.
