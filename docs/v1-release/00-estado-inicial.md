# Estado inicial — rodada V1 (2026-08-05)

Registro do estado da árvore **antes** de qualquer alteração desta rodada. Serve para
provar o que já existia, de onde veio, e para permitir reconstruir o ponto de partida
caso algo se perca.

## 1. Posição no Git

| Item | Valor |
| --- | --- |
| Branch | `chore/auditoria-limpeza-20260731` |
| HEAD | `a6603b3` — _refactor: rebuild Bianchini website with Next.js_ |
| Branch principal | `main` |
| Staging | **vazio** (0 arquivos) |
| Stash | **vazio** |
| Merge / rebase em curso | **nenhum** |

## 2. Volume de alterações não commitadas

| Categoria | Quantidade |
| --- | --- |
| Rastreados modificados (`M`) | 43 |
| Rastreados removidos (`D`) | 7 |
| Não rastreados (`??`), total bruto | 3.341 |
| Não rastreados **de projeto** | 779 |
| Não rastreados de projeto, só código/assets | 90 |

O diff de rastreados soma **5.427 inserções / 2.522 remoções em 50 arquivos**.

A diferença entre 3.341 e 779 é integralmente `.tmp-edge-cdp/` e `.tmp-edge-cdp2/` —
dois perfis do Microsoft Edge criados pela ferramenta de captura via CDP. Não são
projeto e não estão no `.gitignore` (ver `01-auditoria.md`, item de limpeza).

Distribuição dos 779 arquivos de projeto não rastreados:

| Pasta | Arquivos | Natureza |
| --- | --- | --- |
| `docs/` | 429 | capturas e relatórios das rodadas visuais |
| `_entrega_chatgpt/` | 258 | pacote de entrega externo, cópia paralela do código |
| `src/` | 66 | **código novo** — páginas, seções, blocos, dados, hooks, estilos |
| `public/` | 16 | imagens de marca, hero, projetos, equipe, depoimentos, livro |
| `scripts/` | 3 | ferramentas de captura/auditoria via CDP |
| raiz | 7 | guias normativos, mockup aprovado, `AGENTS.md`, zip de análise |

## 3. Integridade — verificações executadas

Nenhuma edição parcial ou interrompida foi encontrada:

- **`.orig` / `.rej` / `.bak` / `*~`**: nenhum arquivo (fora de `node_modules`, `.next` e perfis do Edge)
- **Marcadores de conflito** (`<<<<<<<`, `=======`, `>>>>>>>`) em `src/`: nenhum
- **`git stash list`**: vazio
- **`.git/MERGE_HEAD`, `.git/rebase-merge`**: ausentes
- **Segredos entre os não rastreados**: nenhum. As ocorrências de "token"/"key" são
  todas artefatos internos do perfil do Edge (`Trust Tokens`, `Vpn Tokens`,
  `TrustTokenKeyCommitments`), não credenciais do projeto. Não há `.env` fora do
  `.gitignore`.
- **Validações no estado inicial**: `npm run type-check`, `npm run lint` e
  `npm run build` **passam** (19 rotas estáticas, 0 erro de console).

## 4. Origem provável das alterações

Por timestamps de `docs/` e de `src/`, o trabalho não commitado é a soma de ~8 dias de
rodadas sucessivas sobre o rebuild em Next.js:

| Período | Rodada | Vestígio |
| --- | --- | --- |
| 29–31/07 | rebuild inicial + auditoria de limpeza | `AUDITORIA_LIMPEZA_REPOSITORIO.md`, `docs/archive/`, `hero-validacao/` |
| 01/08 | evolução da home, reskin grafite + amarelo | `home-evolucao*/`, `reskin-grafite-amarelo-20260801/` (32 arquivos em `src/`) |
| 01–03/08 | três passagens de direção de arte | `direcao-arte-*/`, `RELATORIO_TERCEIRA_PASSAGEM_HOME.md` |
| 03/08 | correção final da home, fechamento do hero | `home-correcao-final-20260803/`, `hero-final/` |
| 04–05/08 | auditoria geral do site | `site-audit/` (151 arquivos) |
| 05/08 03h | rodada hero + pilares | `rodada-hero-pilares-20260805/` |
| 05/08 07–08h | rodada de alvos de toque | `rodada-alvos-toque-20260805/` (16 capturas) |
| 05/08 13h | fechamento da rodada de alvos de toque | correção de overflow em `/contato` e rodapé, 2 capturas |

Os 15 arquivos de `src/` com data de 05/08 são das duas últimas rodadas.

## 5. Cópia de segurança (fora do repositório)

Gerada em `C:\Users\gabri\Desktop\`, antes de qualquer alteração desta rodada:

| Arquivo | Conteúdo | Tamanho |
| --- | --- | --- |
| `bianchini-pre-v1.patch` | `git diff --binary` — todas as modificações de arquivos **rastreados** | 405 KB |
| `bianchini-pre-v1-status.txt` | `git status --short` — relação completa | 4 KB |
| `bianchini-pre-v1-untracked-codigo.zip` | os 90 arquivos não rastreados de **código e assets** (`src/`, `public/`, `scripts/`, `.md` da raiz) | 9,0 MB |

O `.zip` existe porque o patch **não** cobre arquivos não rastreados, e uma lista de
nomes não os restaura — sem ele, os 66 arquivos de `src/` criados nas rodadas
anteriores não teriam cópia. Ficaram de fora, por volume e por serem reproduzíveis ou
não essenciais ao build: `docs/` (429 capturas), `_entrega_chatgpt/` (258) e o
`bianchini-site-original-para-analise.zip`. Nenhum deles é tocado nesta rodada.

## 6. Restrições assumidas nesta rodada

Não foram e não serão usados: `git reset`, `git checkout --`, `git restore`,
`git clean`, remoção em massa ou script destrutivo. Nenhuma alteração anterior é
revertida por não pertencer a esta rodada. Não há commit, push, deploy ou alteração
de DNS.
