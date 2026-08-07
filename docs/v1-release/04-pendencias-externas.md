# Pendências externas e backlog V2

Separado do estado funcional da V1 de propósito: **nada aqui impede a V1 local de estar
pronta**, e nada aqui foi alterado por inferência.

---

## 1. Pendências externas — adiadas deliberadamente

A etapa de publicação foi **interrompida a pedido** e não foi retomada nesta rodada.
Nenhum destes itens é código; todos dependem de confirmação de terceiros.

| Pendência | Situação |
| --- | --- |
| Domínio principal | não confirmado |
| `NEXT_PUBLIC_SITE_URL` | não definida — o build imprime aviso não fatal `[bianchini]` |
| `www` vs apex | não decidido |
| Plataforma de hospedagem | não definida |
| DNS / certificado | não tocados |
| Endpoint remoto do formulário | não existe; o formulário abre WhatsApp ou e-mail |
| Analytics | não configurado |
| CNPJ / razão social | não informados |
| Política jurídica definitiva | pendente de revisão |

### A divergência do WhatsApp — registrada, não resolvida

Por instrução explícita, **o número não foi alterado e a divergência não foi resolvida**.
Fica registrada como confirmação externa futura:

| Onde | Valor |
| --- | --- |
| `src/data/site.ts` (em uso no site) | `+55 21 99518-1918` / `5521995181918` |
| `CLAUDE.md`, lista de dados confirmados | `+55 21 96469-0650` |

O histórico em `docs/site-audit/` mostra que `96469` foi **ativamente removido** do site em
2026-08-04, o que sugere que o valor em uso é o corrente — mas isso é inferência a partir
do histórico, **não confirmação comercial**, e é o número que recebe todo lead do site.

O inventário completo (onde o número existe, o que deriva dele, e as duas substituições
que seriam erro) está em [`06-publicacao.md`](./06-publicacao.md). Trocar o número são
duas linhas.

---

## 2. Backlog V2

Só entram itens que exigem asset novo, conteúdo novo, decisão estratégica ou refatoração
grande — e que não são defeito básico.

### Exigem decisão do gestor

| # | Item | Por quê |
| --- | --- | --- |
| V2-1 | **`heroSlides[].context` sem consumidor no desktop** | a copy foi preservada e segue em uso no mobile; remover de vez é decidir que o marcador compacto substitui o resumo em definitivo |
| V2-2 | **`processSteps` em `src/data/process.ts` sem consumidor** | superado por `methodSteps`, mas é copy real da "Metodologia" do site anterior. O arquivo **não** é morto: `caseStages`, ao lado, está em uso |
| V2-3 | **`heroTitleLines` e `heroPhotoCaption` sem consumidor** | copy aprovada do mockup, hoje substituída pelo carrossel; remover é decidir que o carrossel é definitivo |
| V2-4 | **Confirmar o WhatsApp** e alinhar o `CLAUDE.md` | ver seção 1 |

### Exigem asset ou conteúdo novo

| # | Item |
| --- | --- |
| V2-5 | `apple-touch-icon` aponta para `favicon.ico`; iOS renderiza `.ico` mal — exige PNG 180×180 da marca |
| V2-6 | Fotografias guardadas como PNG: `public/` tem 12,1 MB, com 4 arquivos somando 8 MB. O usuário **não paga por isso** (o `next/image` entrega AVIF/WebP redimensionado); pesa no bundle de deploy |
| V2-7 | Identificar renders como render nos projetos, quando aplicável |

### Exigem refatoração com risco

| # | Item |
| --- | --- |
| V2-8 | **CSP com nonce** — os demais cabeçalhos já estão postos; a CSP exige sair do pré-render estático |
| V2-9 | **Home pede 15 requisições de imagem do hero a 1440px** — 3 slides × 2 instâncias. Resolver de verdade exige renderização condicional do hero, área que o `CLAUDE.md` marca como delicada |
| V2-10 | CTA do cabeçalho com 40px de altura (só ≥1024px, contexto de mouse; proporção de 46% da faixa é decisão documentada) |
| V2-11 | Exports sem consumidor (`scopeSequence`, `scopeSpan`, `heroBookSlide`, `src/styles/tokens.ts`, 15 ícones) — todos tree-shaken, remover **não economiza um byte** no cliente |

### Não entra no backlog

Nada aqui é defeito básico adiado. Os defeitos encontrados nesta rodada e nas anteriores
foram corrigidos na própria rodada — overflow de `/contato`, alvo de toque do logotipo,
`sizes` da instância mobile do hero, numeração repetida, aparência de tabela do seletor,
ordem do header quebrada pela reordenação.
