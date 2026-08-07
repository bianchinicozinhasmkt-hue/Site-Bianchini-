# Auditoria de limpeza do repositório — Bianchini

**Data da auditoria:** 31 de julho de 2026  
**Escopo:** auditoria conservadora e arquivamento aprovado de referências visuais antigas  
**Estado:** arquivamento concluído e validado; nenhuma exclusão executada  
**Fonte visual normativa preservada:** `DIRECAO_MESTRA_SITE_BIANCHINI.md`

## 1. Resumo executivo

O repositório contém um site institucional estático em Next.js 15.5.22, React 19,
TypeScript 5.9 e Tailwind CSS 3.4, gerenciado por npm e `package-lock.json`. O conteúdo
institucional está em `src/data/`, a apresentação em `src/components/`, e os assets reais
em `public/images/`.

A baseline funcional passa em lint, typecheck, build e smoke test. Não existe script de
testes automatizados. A tentativa de `npm ci` falhou por um binário SWC bloqueado por um
processo Node preexistente no Windows; a instalação foi restaurada com
`npm install --package-lock=false`, sem alteração do lockfile.

Não foi encontrada inutilidade versionada que possa ser removida automaticamente com
baixo risco. Existem duas peças de direção visual anterior que contradizem a nova fonte de
verdade, mas ambas se sobrepõem a trabalho local do usuário:

- `BRAND_DIRECTION.md` está rastreado e modificado;
- `docs/home-reference-v1.png` é não rastreado, contém uma referência visual antiga e é
  citado pela implementação atual e por documentação não rastreada.

Por segurança, ambas foram classificadas como **ARQUIVAR**, não como **REMOVER**. Após
aprovação explícita, foram movidas literalmente para `docs/archive/legacy-visual/`, com
hashes preservados, manifesto e aviso de obsolescência. Artefatos gerados continuam
ignorados e não foram apagados.

## 2. Instruções aplicáveis

- `AGENTS.md`: lido integralmente; determina que `sources/` é somente leitura.
- `CLAUDE.md`: lido integralmente; documentação operacional preservada.
- Não foram encontrados outros `AGENTS.md`, `CLAUDE.md`, `.cursorrules` ou instruções
  equivalentes aplicáveis abaixo da raiz.
- `sources/` não foi editado, movido, renomeado ou removido.

## 3. Estado do Git

| Campo | Valor |
|---|---|
| Raiz real | `C:/Users/gabri/Desktop/Projeto-Bianchini` |
| Branch inicial | `main` |
| Branch de segurança | `chore/auditoria-limpeza-20260731` |
| Hash-base | `a6603b36768efa1158eb5462e97a45ff38ddce47` |
| Remote | `origin` → `https://github.com/bianchinicozinhasmkt-hue/Site-Bianchini-.git` |
| Submodules | Nenhum; `.gitmodules` ausente |
| Worktrees | Apenas a árvore atual |
| Sparse checkout | Desabilitado |
| Stash criado | Não |
| Commit/push/merge/deploy | Nenhum |

A branch de segurança aponta para o hash-base, mas **não captura alterações não
commitadas**. Assim, ela protege a referência de base; os hashes abaixo e uma eventual
movimentação reversível protegem os candidatos locais. Nenhuma cópia de segredo foi feita.

### Alterações locais preexistentes protegidas

Todos os caminhos abaixo ficam excluídos de remoção automática.

**Modificados:**

`BRAND_DIRECTION.md`, `CLAUDE.md`, `src/app/globals.css`, `src/app/layout.tsx`,
`src/app/linhas-de-produtos/forno-combinado-rational/page.tsx`,
`src/app/linhas-de-produtos/page.tsx`, `src/app/not-found.tsx`, `src/app/page.tsx`,
`src/components/layout/container.tsx`, `src/components/layout/footer.tsx`,
`src/components/layout/header.tsx`, `src/components/layout/mobile-menu.tsx`,
`src/components/layout/section.tsx`, `src/components/layout/whatsapp-float.tsx`,
todas as 13 seções em `src/components/sections/`, `src/data/navigation.ts`,
`src/data/site.ts`, `src/lib/utils.ts` e `tailwind.config.ts`.

**Excluídos no working tree pelo usuário:**

`src/components/ui/button.tsx`, `src/components/ui/heading.tsx`,
`src/components/ui/icon.tsx`, `src/components/ui/logo.tsx` e
`src/components/ui/reveal.tsx`.

**Não rastreados:**

`AGENTS.md`, `DIRECAO_MESTRA_SITE_BIANCHINI.md`, os quatro itens em `docs/`,
`public/images/hero/hero-industrial-kitchen.png`, novos componentes em
`src/components/animations/`, `src/components/shared/` e `src/components/ui/`, três hooks
em `src/hooks/` e os arquivos de tokens em `src/styles/`.

## 4. Estrutura e funcionamento

### Stack e organização

- Node.js `v22.20.0`; requisito declarado: Node 20.9 ou superior.
- npm `10.9.3`; um único pacote, sem workspaces ou monorepo.
- Next.js App Router, Server Components por padrão, build estático.
- Alias `@/*` → `src/*`.
- TypeScript strict, `noUnusedLocals` e `noUnusedParameters`.
- Tokens em `src/styles/`, adaptados por `tailwind.config.ts`.
- Não foi detectada geração de código, glob import ou import dinâmico relevante.

### Rotas

- `/`
- `/linhas-de-produtos`
- `/linhas-de-produtos/forno-combinado-rational`
- `/_not-found`
- `/robots.txt`
- `/sitemap.xml`
- Redirect permanente de `/forno-combinado-rational` para a rota interna correspondente.

### Conteúdo, dados e integrações

- Conteúdo real/local: `src/data/`.
- Assets: `public/images/{brand,clients,hero,lines,projects}`.
- WhatsApp: centralizado em `src/lib/whatsapp.ts`; links gerados com mensagem codificada.
- E-mail: gerado pelo mesmo módulo.
- SEO: metadata, canonical, Open Graph/Twitter, sitemap e robots implementados.
- Headers de segurança e redirect: `next.config.ts`.
- CMS, banco, migrations, schemas, seeds e APIs próprias: não encontrados.
- Formulário de envio: não encontrado.
- Analytics/`gtag`: não encontrado.
- CI/CD específico: não encontrado.
- Deploy: documentado no `README.md`; nenhuma configuração Vercel específica presente.
- Variável de ambiente encontrada, apenas por nome: `NEXT_PUBLIC_SITE_URL`.
- Arquivos suspeitos de segredo: nenhum; somente `.env.example`.

### Assets

Todos os 48 arquivos de `public/` têm referência estática encontrada em código,
dados/documentação ou convenção do framework. Isso inclui os 15 logos de clientes, logos da
marca, fotos reais de projetos, linhas de produto, hero e favicon. Não há asset público
classificável como órfão. Todos foram classificados como **PRESERVAR**.

## 5. Baseline de validação

| Validação | Resultado | Observação |
|---|---|---|
| `node --version` | PASSOU | `v22.20.0` |
| `npm --version` | PASSOU | `10.9.3` via `npm.cmd`; `npm.ps1` é bloqueado pela política local |
| `npm ci` | FALHOU | `EPERM` ao remover `next-swc.win32-x64-msvc.node`, aberto por processo Node preexistente |
| Restauração de dependências | PASSOU | `npm install --package-lock=false --no-audit --no-fund`; lockfile permaneceu sem diff |
| `npm run lint` | PASSOU | exit 0 |
| `npm run type-check` | PASSOU | exit 0 |
| Testes | NÃO DISPONÍVEL | não existe script `test` |
| `npm run build` | PASSOU | 8 páginas estáticas geradas; exit 0 |
| Inicialização de produção | PASSOU | `next start -p 3100` |
| Rotas principais | PASSOU | três rotas HTML retornaram HTTP 200 |
| SEO | PASSOU | `/robots.txt` e `/sitemap.xml` retornaram HTTP 200 |
| Assets no smoke test | PASSOU | logo, hero e favicon retornaram HTTP 200 e MIME correto |
| Erros do servidor | PASSOU | stderr vazio durante o smoke test bem-sucedido |
| Console/interações visuais | NÃO EXECUTADO | exige browser interativo; não necessário para classificar os candidatos atuais |

O primeiro smoke test não iniciou devido a uma colisão `Path`/`PATH` do PowerShell ao
construir o ambiente do processo. A segunda tentativa iniciou de modo isolado, validou todos
os alvos e encerrou somente o PID criado pela auditoria.

## 6. Árvore relevante

```text
.
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── DIRECAO_MESTRA_SITE_BIANCHINI.md
├── BRAND_DIRECTION.md
├── docs/
│   ├── COMPONENT_MAP.md
│   ├── DESIGN_SPEC.md
│   ├── FRONTEND_ARCHITECTURE.md
│   └── home-reference-v1.png
├── public/
│   ├── favicon.ico
│   └── images/{brand,clients,hero,lines,projects}
├── src/
│   ├── app/
│   ├── components/{animations,layout,sections,shared,ui}
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── package.json
├── package-lock.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

Gerados/locais ignorados: `.next/`, `node_modules/`, `tsconfig.tsbuildinfo`,
`.next-start.*.log`, `next-env.d.ts` e `.claude/settings.local.json`.

## 7. Inventário e classificação de candidatos

| Caminho | Status Git | Categoria | Evidência | Referências | Classificação | Risco | Recuperação |
|---|---|---|---|---|---|---|---|
| `DIRECAO_MESTRA_SITE_BIANCHINI.md` | Não rastreado | Documento mestre | Declara-se documento normativo e fonte principal de verdade, versão 1.0 de 31/07/2026 | Prompt desta tarefa; decisões de design, conteúdo, UX, SEO e implementação | **PRESERVAR** | Alto | Não tocar; SHA-256 `2B9C30ABF21108E77D5A8EFD6E3242054364095DA0DE0AF219348D6803B29949` |
| `BRAND_DIRECTION.md` | Rastreado, modificado no estado inicial | Direção visual antiga | Declara-se “fonte única de verdade” e contradiz o mestre em paleta, tipografia, raios e acentos: `signal/steel`, Space Grotesk/IBM Plex Mono e raio 0 versus champagne, DM Serif/Manrope e raios 8–24 do mestre | Referências ativas neutralizadas após aprovação; base no commit `a6603b3` | **ARQUIVAR — EXECUTADO** | Médio/alto | Arquivado literalmente em `docs/archive/legacy-visual/BRAND_DIRECTION_20260729.md`; movimento inverso recupera a versão atual. SHA-256 `1C8BA3977D12A658770DC6AC984CDC1F21D9BF2442452FA0194B2E2BF6731957` |
| `docs/home-reference-v1.png` | Não rastreado no estado inicial | Referência visual antiga | Mockup preto/carmim/dourado, com composição e conteúdo incompatíveis com a nova direção; contém exemplos de métricas/cases que não devem orientar conteúdo real | Referências ativas neutralizadas após aprovação | **ARQUIVAR — EXECUTADO** | Alto | Arquivado literalmente em `docs/archive/legacy-visual/home-reference-v1.png`; movimento inverso recupera o arquivo. SHA-256 `4BBB40FC48C8962CEA3D302889F955D3380EB85A834C54ED62AA36C793BF3599` |
| `docs/DESIGN_SPEC.md` | Não rastreado | Documentação técnica de design | Explicita que documenta infraestrutura, não direção visual; descreve tokens e guardrails válidos | `src/styles/`, `Container`, `Section`; uma linha cita o mockup antigo | **PRESERVAR** | Médio | Manter; revisar apenas a referência ao mockup após decisão humana |
| `docs/COMPONENT_MAP.md` | Não rastreado | Arquitetura técnica | Mapa factual dos componentes e hooks atuais | Estrutura atual de `src/components/` e `src/hooks/` | **PRESERVAR** | Baixo | Manter |
| `docs/FRONTEND_ARCHITECTURE.md` | Não rastreado | Arquitetura técnica | Define responsabilidades, imports, tokens e assets sem impor direção visual conflitante | Estrutura atual do projeto | **PRESERVAR** | Baixo | Manter |
| `CLAUDE.md` | Rastreado, modificado | Instrução operacional | Deve ser preservado por regra absoluta; ainda aponta `BRAND_DIRECTION.md` como oficial | Comandos, conteúdo real, convenções e definição de pronto | **PRESERVAR** | Alto | Manter; correção pontual da referência requer aprovação por sobrepor alteração do usuário |
| `README.md` | Rastreado | Instalação/operação | Deve ser preservado por regra absoluta; design system descrito está desatualizado e aponta `BRAND_DIRECTION.md` | Stack, comandos, estrutura, env e deploy | **PRESERVAR** | Alto | Manter; atualizar documentação somente em tarefa aprovada |
| `.next/` | Ignorado | Build/cache | Gerado pelo Next; aproximadamente 78.942.095 bytes após baseline | Coberto por `/.next/` e `.next/` no `.gitignore` | **IGNORAR LOCALMENTE** | Baixo | Regenerado por `npm run build`; não apagar nesta etapa |
| `node_modules/` | Ignorado | Dependências/cache local | Gerado pelo npm; aproximadamente 563.301.923 bytes | Coberto pelo `.gitignore`; necessário para validação local | **IGNORAR LOCALMENTE** | Baixo | Regenerável pelo lockfile quando o processo que bloqueia SWC for encerrado; não apagar |
| `tsconfig.tsbuildinfo` | Ignorado | Cache TypeScript | Arquivo incremental, 100.211 bytes | Coberto por `*.tsbuildinfo` | **IGNORAR LOCALMENTE** | Baixo | Regenerável por TypeScript; não apagar |
| `.next-start.stderr.log` | Ignorado | Log temporário | Arquivo vazio, não versionado | Coberto por `*.log` | **IGNORAR LOCALMENTE** | Baixo | Sem conteúdo; não apagar dados do usuário |
| `.next-start.stdout.log` | Ignorado | Log temporário | Arquivo vazio, não versionado; hash idêntico ao stderr apenas por ambos serem vazios | Coberto por `*.log` | **IGNORAR LOCALMENTE** | Baixo | Sem conteúdo; não apagar dados do usuário |
| `public/**` | Rastreado, exceto novo hero não rastreado | Assets reais | Fotos, logos, linhas de produto e marca; todos possuem referência estática ou convenção comprovada | Código, `src/data/`, metadata e framework | **PRESERVAR** | Alto | Git para rastreados; novo hero protegido como trabalho local |
| Código de `src/**` | Misto; grande sobreposição local | Código potencialmente morto | Build/typecheck não indicam módulos quebrados; não há prova suficiente de código morto removível | Imports estáticos, rotas e composição da home | **PRESERVAR** | Alto | Nenhuma remoção de código nesta tarefa |

## 8. Documentos contraditórios

### Conflito confirmado

`DIRECAO_MESTRA_SITE_BIANCHINI.md` determina grafite/canvas/champagne,
DM Serif Display/Manrope, raios de 8–24 px e uma direção premium editorial-técnica.

`BRAND_DIRECTION.md` determina grafite frio, `signal` laranja e `steel` azul,
Space Grotesk/DM Sans/IBM Plex Mono, controles com raio 0 e afirma substituir
integralmente direções anteriores. Ambas se declaram normativas. Pela instrução explícita
desta tarefa, prevalece `DIRECAO_MESTRA_SITE_BIANCHINI.md`.

`docs/home-reference-v1.png` materializa outra linguagem preto/carmim/dourado. Além da
contradição visual, o mockup exibe conteúdo ilustrativo que não deve ser tratado como dado
institucional verificável.

### Referências que exigem alinhamento posterior

- `CLAUDE.md:11`
- `README.md` na seção “Design system”
- `src/app/globals.css` no comentário inicial
- `tailwind.config.ts` no comentário inicial
- `src/data/site.ts` no comentário inicial
- `src/app/page.tsx` e `src/data/navigation.ts` em comentários sobre o mockup
- `docs/DESIGN_SPEC.md` na última linha

Após aprovação explícita, somente referências documentais e comentários foram alinhados à
fonte mestre. Nenhum valor visual, componente ou comportamento foi alterado.

## 9. Plano aprovado e executado

### Lista exata classificada como REMOVER

**Vazia.** Não há arquivo rastreado ou não rastreado que satisfaça simultaneamente prova
inequívoca de inutilidade, baixo risco e ausência de sobreposição com trabalho do usuário.

**Tamanho total proposto para remoção:** 0 bytes.

### Lista exata arquivada

1. `BRAND_DIRECTION.md` → `docs/archive/legacy-visual/BRAND_DIRECTION_20260729.md`
2. `docs/home-reference-v1.png` →
   `docs/archive/legacy-visual/home-reference-v1.png`

Tamanho combinado: **1.550.721 bytes** (aprox. 1,48 MiB). O arquivamento não liberou
espaço; removeu os itens dos caminhos ativos e os preservou com aviso explícito de que não
são fonte de verdade.

Controles executados:

1. confirmar novamente branch, hash-base e `git status`;
2. recalcular os dois hashes e abortar se mudarem;
3. criar `docs/archive/legacy-visual/README.md` indicando que o material é histórico,
   obsoleto e não normativo;
4. usar apenas movimentos literais individuais;
5. registrar no manifesto caminho original, caminho novo, hash, tamanho e motivo;
6. não alterar código/UI;
7. atualizar somente referências documentais/comentários que apontavam a fonte visual antiga.

### Decisões humanas recebidas

- Arquivar os dois itens, sem excluir seu conteúdo.
- Impedir conflito com qualquer referência visual ativa antes da aplicação manual da nova
  direção.

### Mudanças propostas no `.gitignore`

Nenhuma. Build, dependências, caches, logs, env local, editor e sistema operacional já estão
cobertos. Não há justificativa para ocultar documentos ou assets que devam ser versionados.

## 10. Plano de recuperação

- Hash-base: `a6603b36768efa1158eb5462e97a45ff38ddce47`.
- Branch local de referência: `chore/auditoria-limpeza-20260731`.
- Para itens rastreados sem mudanças locais futuras, o conteúdo-base pode ser consultado sem
  alterar o working tree com:
  `git show a6603b36768efa1158eb5462e97a45ff38ddce47:<caminho>`.
- A versão modificada de `BRAND_DIRECTION.md` está preservada em
  `docs/archive/legacy-visual/BRAND_DIRECTION_20260729.md`; seu hash está no manifesto. A
  recuperação é o movimento literal de volta para `BRAND_DIRECTION.md`.
- `docs/home-reference-v1.png`, originalmente não rastreado, está preservado em
  `docs/archive/legacy-visual/home-reference-v1.png`; a recuperação é o movimento literal
  de volta.
- Nenhum comando destrutivo, stash, commit, push, merge, deploy ou PR foi executado.

## 11. Riscos e dúvidas em aberto

1. Há processos Node preexistentes nas portas 3000 e 3001; um deles mantém SWC/Sharp aberto.
   Eles não foram encerrados porque sua propriedade não foi confirmada.
2. A branch de segurança não substitui backup de arquivos não rastreados ou modificados.
3. As referências ativas ao mockup e ao documento visual antigo foram neutralizadas. Apenas
   o arquivo histórico, o manifesto e este relatório os mencionam.
4. O repositório não tem testes automatizados nem browser E2E; o smoke test cobre servidor,
   rotas, SEO e assets, mas não interação, responsividade ou console do navegador.
5. O domínio definitivo depende de `NEXT_PUBLIC_SITE_URL`; nenhum valor de ambiente foi lido.

## 12. Resultado final

- Arquivos excluídos: nenhum.
- Arquivos arquivados: dois, exatamente conforme a aprovação.
- `.gitignore`: inalterado.
- Espaço liberado: 0 bytes; o conteúdo histórico foi preservado.
- Referências visuais antigas ativas: nenhuma encontrada após busca textual abrangente.
- Lint, typecheck e build pós-arquivamento: passaram.
- Smoke test pós-arquivamento: três rotas HTML, robots, sitemap, logo, hero e favicon
  retornaram HTTP 200; stderr vazio.
- Falha preexistente mantida: `npm ci` bloqueado por processo Node externo segurando SWC.
- Commit, push, merge, deploy e PR: nenhum.

A auditoria e o arquivamento aprovado estão concluídos. A implementação visual atual não foi
modificada; `DIRECAO_MESTRA_SITE_BIANCHINI.md` é a única fonte normativa ativa para a
aplicação manual seguinte.
