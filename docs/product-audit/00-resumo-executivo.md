# Auditoria de produto — resumo executivo

**Data:** 2026-08-05 · **Branch:** `chore/auditoria-limpeza-20260731`
**Build auditado:** `pAuHB26fH_vBqjacZLUpI` (Next.js 15.5.22, 19 rotas, `next start` :3210)
**Escopo:** análise, diagnóstico e planejamento. **Nenhum código de produção foi alterado.**

---

## 1. Estado inicial e proteção

| item | estado |
| --- | --- |
| `npm run build` | ✅ exit 0, 19 rotas, 0 erro |
| `.next/BUILD_ID` | ✅ `pAuHB26fH_vBqjacZLUpI` |
| `npm run lint` | ✅ exit 0, 0 aviso |
| `npx tsc --noEmit` | ✅ exit 0 |
| `next start` | ✅ `Ready in 2.1s` |
| HTTP das 16 rotas públicas | ✅ 200 · 404 correto em rota inexistente · 308 nos 2 redirects |
| erros de console | ✅ 0 em todas as rotas (exceto o 404 intencional) |
| overflow horizontal | ✅ 0 em 11 viewports (320 → 1920) |

**Ponto de restauração:** último commit `a6603b3`. ⚠️ A árvore de trabalho tem
**53 arquivos modificados e ~30 não rastreados sem commit** — toda a V1 validada
existe apenas no disco. Nenhuma tag, nenhum stash, nenhum branch de release.
É o maior risco operacional do projeto hoje (**P0-01**).

## 2. Diagnóstico executivo

A V1 é um produto **maduro, correto e acima da média do setor**. A base técnica
é sólida (0 erro, 0 overflow, 0 imagem sem `alt`, foco visível em todo o teclado,
`prefers-reduced-motion` implementado de verdade, âncoras íntegras, conteúdo sem
dado inventado). O sistema visual tem identidade própria e **não** lê como
template de IA, catálogo antigo nem agência.

O gargalo não é interface — é **produto**:

1. **A prova não prova o suficiente.** `#projetos` está bem posicionado (20,5% da
   página) mas entrega legenda descritiva de fotografia, não caso. Nenhum
   registro responde "para quem", "qual era o problema", "qual foi o escopo",
   "o que a Bianchini coordenou". A promessa é *integradora de operações*; a
   evidência é *fotografia de cozinha bonita*.
2. **O site encaminha, não qualifica.** Oito CTAs "Solicitar diagnóstico" na
   home apontam para o mesmo `/contato` sem contexto — o parâmetro `?intencao=`
   existe e funciona, mas só **1** dos 8 o usa.
3. **Não há medição.** `lib/analytics.ts` empilha eventos em `window.dataLayer`
   e **nenhuma tag GTM/GA4 está instalada**. Hoje é impossível saber o que
   converte.
4. **A primeira dobra mobile esconde a própria estrutura.** Em toda largura de
   toque o marcador do pilar e o seletor ficam **108 a 490px abaixo da dobra**;
   o `h1` troca sozinho a cada 6s sem controle de pausa.

## 3. Principais forças (congelar — ver `14-decisoes-congeladas.md`)

- Geometria e sistema de unidade `--u` da primeira dobra (desktop).
- Regra do amarelo e a divergência documentada de contraste.
- Ordem narrativa da home e a regra "ordem do menu = ordem da rolagem".
- Disciplina de conteúdo: nada inventado, pendências marcadas em comentário.
- Motion: três curvas, quatro variantes de `Reveal`, reduced-motion correto.
- Acessibilidade estrutural: skip link, foco, retenção de foco no menu mobile,
  padrão de abas consistente em quatro seções.

## 4. Principais riscos

| risco | severidade |
| --- | --- |
| V1 inteira sem commit / sem tag | **P0** |
| `NEXT_PUBLIC_SITE_URL` ausente → canônicas, sitemap e OG em `localhost:3000` | **P0** |
| CNPJ e razão social ausentes na política de privacidade (LGPD) | **P0** |
| Formulário sem backend: envio depende de popup do WhatsApp | **P1** |
| Autoplay do hero sem pausa (WCAG 2.2.2 nível A) | **P1** |
| Estrutura de pilares invisível na primeira dobra mobile | **P1** |
| CLS 0,227 em `/contato` mobile (falha Core Web Vitals) | **P1** |
| 494 KB de fotos de hero baixadas para exibir uma | **P1** |
| Cinco pares de texto abaixo de 4,5:1 em fundo sólido | **P1/P2** |
| Zero medição de conversão instalada | **P1** |
| Divergência do WhatsApp entre `CLAUDE.md` e `src/data/site.ts` | **P2** |

## 5. Onde continuar

| assunto | documento |
| --- | --- |
| posicionamento, proposta de valor, o que o produto precisa provar | [`01-estrategia-produto.md`](01-estrategia-produto.md) |
| nove públicos, intenções, lacunas por jornada | [`02-jornadas-e-publicos.md`](02-jornadas-e-publicos.md) |
| ordem da home, tabela seção a seção, CTAs por seção | [`03-arquitetura-informacao.md`](03-arquitetura-informacao.md) |
| avaliação das 14 seções + hero e pilares + projetos | [`04-auditoria-home.md`](04-auditoria-home.md) |
| as 16 rotas, uma a uma | [`05-auditoria-rotas.md`](05-auditoria-rotas.md) |
| paleta, tipografia, densidade, sinais de template | [`06-ui-direcao-arte.md`](06-ui-direcao-arte.md) |
| tokens, duplicações, sistema mínimo para a V2 | [`07-design-system.md`](07-design-system.md) |
| inventário de motion + 11 viewports | [`08-motion-responsividade.md`](08-motion-responsividade.md) |
| WCAG: falhas, recomendações e falsos positivos removidos | [`09-acessibilidade.md`](09-acessibilidade.md) |
| payload, LCP, CLS, arquitetura front-end e dívida | [`10-performance-front-end.md`](10-performance-front-end.md) |
| SEO técnico, confiança, jurídico | [`11-seo-confianca.md`](11-seo-confianca.md) |
| 47 achados com evidência, severidade, impacto e esforço | [`12-backlog-priorizado.md`](12-backlog-priorizado.md) |
| roadmap V1.1 / V2 / futuro com critério de aceite | [`13-roadmap-v1-1-v2.md`](13-roadmap-v1-1-v2.md) |
| o que **não** pode ser redesenhado | [`14-decisoes-congeladas.md`](14-decisoes-congeladas.md) |
| capturas e mapa medido | [`screenshots/`](screenshots/) · [`screenshots/mapa-da-home.md`](screenshots/mapa-da-home.md) |

## 6. Nota de método

Nada aqui foi aceito por comentário de código ou relatório anterior. Toda
afirmação numérica foi medida contra o build acima, em navegador real, e as
medições brutas estão citadas no documento correspondente. Onde a medição foi
ambígua ou dependeu da ferramenta de captura, isso está dito explicitamente
(ver `10-performance-front-end.md` §7 e `09-acessibilidade.md` §5).
