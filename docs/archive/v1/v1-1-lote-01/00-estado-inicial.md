# Lote 01 da V1.1 — estado inicial e proteção

**Data:** 2026-08-05 · **Branch:** `chore/auditoria-limpeza-20260731`
**Escopo:** seis problemas P1 da auditoria de produto. Nada além disso.

## 1. Pontos de restauração

| ponto | referência | integridade |
| --- | --- | --- |
| branch de trabalho | `chore/auditoria-limpeza-20260731` → `a6603b3` | ✅ `git cat-file -t` = commit |
| branch principal | `main` → `a6603b3` | ✅ `git cat-file -t` = commit |
| repositório | `git fsck --no-dangling` | ✅ sem erro |

⚠️ **Os dois pontos apontam para o mesmo commit.** Na prática existe **um**
ponto de restauração em git, e ele é anterior a toda a V1: a árvore de trabalho
tem 53 arquivos rastreados modificados, 8 apagados e ~30 não rastreados, nenhum
deles commitado. É o **P0-01** da auditoria e continua aberto — commit e tag
não estavam no escopo deste lote.

## 2. Backup incremental

Gerado antes de qualquer alteração, fora do repositório:

```
scratchpad/backup-pre-v1.1-20260805/
  repo-historico.bundle      24 MB   git bundle --all  ·  "records a complete history" ✅
  projeto-src-docs.tar.gz   278 MB   805 arquivos: src/, public/, docs/, scripts/, configs
```

Excluídos do arquivo: `node_modules`, `.next`, `.git`, `*.zip`,
`tsconfig.tsbuildinfo` e **qualquer `.env`**. Verificado: nenhum arquivo `.env`
no pacote. O único arquivo de ambiente do projeto é `.env.example`, que não
contém segredo (traz `NEXT_PUBLIC_SITE_URL=http://localhost:3000`).

## 3. Build de referência

```
npm run type-check   exit 0
npm run lint         exit 0
npm run build        exit 0 · 19 rotas · BUILD_ID  UiteCIQWVcn4UiYdRM-mr
next start -p 3211   ✓ Ready in 5.6s
```

Todas as 16 rotas públicas responderam 200; `/rota-inexistente` respondeu 404.
**Todas as medições "antes" desta rodada foram feitas contra esse servidor** —
nenhuma contra build anterior, nenhuma contra conexão recusada.

O encerramento do servidor 3211, depois das medições, foi intencional; o
`ERR_CONNECTION_REFUSED` que ele produz no log de tarefas **não é erro da
aplicação**.

## 4. Métricas "antes" (build `UiteCIQWVcn4UiYdRM-mr`)

### P1-01 · formulário

| verificação | resultado |
| --- | --- |
| `window.open` substituído por um que devolve `null` (bloqueio) | a janela não abriu |
| navegou para `/obrigado` mesmo assim | **sim** |
| texto exibido ao visitante | "SOLICITAÇÃO ENVIADA · Recebemos o seu contato" |
| algum envio real além da abertura do WhatsApp | **nenhum** — não há backend, endpoint nem serviço de e-mail |

### P1-03 · autoplay

`h1` em t=0 / t=6,3s / t=12,6s / t=18,9s: `Projetar para a operação real.` →
`Equipar com retorno calculado.` → `Estruturar a operação que vende.` →
`Projetar para a operação real.` (ciclo fechado).
Botões dentro do hero: `Pilar anterior`, `Projetos`, `Equipamentos`,
`Operação Comercial`, `Próximo pilar`. **Nenhum controle de pausa.**
Comportamento idêntico em 390×844 com toque emulado.

### P1-02 · primeira dobra no toque

| viewport | marcador (y) | seletor (y) | limite | na dobra? |
| --- | --- | --- | --- | --- |
| 390 × 844 | 952 | 1.171 | 844 | não · não |
| 360 × 800 | 1.071 | 1.290 | 800 | não · não |
| 320 × 800 | 1.020 | 1.263 | 800 | não · não |
| 768 × 1024 | 1.166 | 1.349 | 1.024 | não · não |
| 1366 × 768 | 166 | 661 | 768 | sim · sim |

### P1-04 · contraste em `#atuacao`

Legenda `<p class="absolute inset-x-4 bottom-4 … text-white">`, 14px, sem fundo
próprio (`rgba(0,0,0,0)`), sobre gradiente `from-graphite/90 to-transparent`
cobrindo 40% da caixa. Razão medida na auditoria: **1,28:1**.

### P1-05 · CLS de `/contato`

390 × 844, cache frio, CPU 4×, 1,6 Mbps / 150ms: **CLS 0,2266**.
Maior deslocamento: `+0,2265 @3.668ms`, fonte `ASIDE.flex.flex-col.gap-8`.
O HTML do servidor continha "Carregando formulário…" — o fallback do `Suspense`.

### P1-06 · fotografias do hero

Contadas apenas as três fotos dos slides
(`hero-industrial-kitchen`, `linha-de-coccao`, `operacao-comercial`), pelas
assinaturas de qualidade das duas instâncias (q=82 desktop, q=78 mobile):

| viewport | peso | requisições | no caminho crítico |
| --- | --- | --- | --- |
| 1440 × 900 | **317 KB** | 6 | 6 (todas) |
| 390 × 844 | **168 KB** | 6 | 6 (todas) |

Peso total da home: 1.139 KB em 1440 × 900 · 684 KB em 390 × 844.

## 5. Arquivos que este lote se propôs a alterar

Registrado antes de começar, e cumprido sem exceção:

| arquivo | por quê |
| --- | --- |
| `src/components/forms/contact-form.tsx` | P1-01, P1-05 |
| `src/app/contato/page.tsx` | P1-05 |
| `src/components/sections/hero-section.tsx` | P1-02, P1-03, P1-06 |
| `src/hooks/use-carousel.ts` | P1-03 |
| `src/components/sections/scope-section.tsx` | P1-04 |
| `src/components/ui/icons.tsx` | P1-03 (glifos de pausa/reprodução) |
| `src/app/globals.css` | P1-02 (caixa do marcador) |

Nenhum outro arquivo de produção foi tocado — verificado por `mtime` ao fim da
rodada.
