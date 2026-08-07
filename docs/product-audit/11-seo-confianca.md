# 11 — SEO técnico, confiança e jurídico

## 1. Qualidade técnica de SEO — o que está certo

| item | estado |
| --- | --- |
| `title` único e descritivo por rota | ✅ 16/16 |
| `meta description` única por rota | ✅ 16/16, todas entre 120 e 180 caracteres |
| exatamente 1 `<h1>` por rota | ✅ 16/16 |
| `canonical` declarado | ✅ nas 13 rotas indexáveis |
| `robots` correto | ✅ `index,follow` nas públicas; `noindex,nofollow` em `/obrigado` e no 404 |
| Open Graph completo | ✅ `type`, `locale`, `siteName`, `title`, `description`, `url`, `image` |
| Twitter Card | ✅ `summary_large_image` em todas |
| `sitemap.xml` | ✅ 13 rotas com prioridade e `changeFrequency` coerentes; `/obrigado` fora |
| `robots.txt` | ✅ permite tudo, bloqueia `/obrigado`, aponta o sitemap |
| JSON-LD | ✅ `ProfessionalService` global · `BreadcrumbList` em 8 rotas · `FAQPage` em 4 · `Person` em `/leonardo-bianchini` — todos válidos |
| links internos | ✅ 30–48 por rota, sem âncora quebrada |
| slugs | ✅ em português, descritivos, sem parâmetro |
| `alt` de imagem | ✅ 0 ausente em todo o site |
| redirects 301 | ✅ dois, ambos 308 permanentes |
| cabeçalhos de segurança | ✅ `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, HSTS, `Permissions-Policy` |
| conteúdo duplicado | ✅ nenhuma rota repete `title` ou `description` |

**Isto é um trabalho de SEO técnico acima da média.** Não há nada estruturalmente
quebrado.

## 2. Dependência de domínio — **bloqueador de publicação**

`NEXT_PUBLIC_SITE_URL` não está definida. Consequência medida no build:

```
canonical  →  http://localhost:3000/
og:image   →  http://localhost:3000/images/projects/cozinha-completa.jpg
sitemap    →  http://localhost:3000/…  (13 URLs)
JSON-LD    →  "url": "http://localhost:3000"
```

`src/data/site.ts` emite um aviso não fatal (apareceu 7× no log deste build). A
decisão de não derrubar o build é defensável, mas **o efeito é uma publicação
silenciosamente inútil**: canônicas apontando para localhost fazem o Google
descartar as páginas.

**Antes de publicar:** definir `NEXT_PUBLIC_SITE_URL`, rebuildar e conferir
`curl /sitemap.xml | head`. **P0.**

## 3. Dependência de conteúdo — oportunidades

| oportunidade | por quê | dado necessário |
| --- | --- | --- |
| **imagem OG por rota** | 14 das 16 rotas compartilham `cozinha-completa.jpg`. Só `/leonardo-bianchini` tem a sua. Compartilhamento por WhatsApp — canal principal deste público — mostra sempre a mesma foto | 4–6 imagens 1200×630 |
| **páginas de segmento** | "cozinha para hotel", "cozinha hospitalar", "cozinha para rede/franquia" são buscas reais e a empresa tem os logos (Marriott, Rede D'Or, SESC). Não existe página para nenhuma | autorização de uso + 1 caso por segmento |
| **páginas de caso** | `/projetos/[slug]` com problema → escopo → entrega. É o que transforma prova em conteúdo indexável | os casos de `01-estrategia-produto.md` §3 |
| **`LocalBusiness` com endereço** | hoje o schema traz cidade/UF, sem logradouro. Busca local depende disso | endereço completo |
| **conteúdo por linha de equipamento** | `/linhas-de-produtos` tem 2.073 palavras num único documento de 11.672px. Uma página por linha capturaria busca de cauda longa | nenhum — o conteúdo já existe |
| **`Product`/`Offer` na página Rational** | única página de produto do site, sem schema de produto | nenhum |

## 4. Confiança, jurídico e reputação

| elemento | classificação | observação |
| --- | --- | --- |
| 18 anos de atuação | **verificado** | fonte declarada no projeto |
| 3.000+ projetos entregues | **presente, sem confirmação documentada** | `src/data/site.ts` registra a pendência explicitamente: houve divergência entre "1.000" e "3.000" em material fora do código e o valor final não foi validado pelo comercial. **Precisa de decisão antes de publicar** |
| 10 logos exibidos | **dependente de autorização** | são clientes reais, mas não há registro de autorização de uso de marca. Rede D'Or, Petrobras, Marriott, SESC e Amil têm políticas de uso de marca — publicar sem autorização é risco jurídico real |
| 5 logos ocultos (`featured: false`) | **corretamente retidos** | aguardando confirmação |
| 2 depoimentos | **dependente de autorização** | `src/data/testimonials.ts` registra a pendência: cargo atual, texto final e autorização de uso do depoimento, do retrato e da menção à organização |
| retratos de Leonardo e Guilherme | **presente** | uso interno, presumidamente autorizado |
| livro "Dominando as Vendas…" | **presente, incompleto** | `purchaseUrl` é `null` e nenhum CTA de compra é renderizado — correto. Falta ano e editora, que também é o motivo de `author` estar fora do `Person` schema |
| SLA "Retorno em até 1 dia útil" | **presente, sem confirmação** | aparece no rodapé, em `/contato` e no formulário. É uma promessa operacional pública |
| horário "Segunda a sexta, 8h às 18h" | **presente** | |
| WhatsApp `+55 21 99518-1918` | **⚠️ conflito de fonte** | `src/data/site.ts` traz este número, "atualizado em 2026-08-03, não alterar sem confirmação comercial". **`CLAUDE.md` documenta `+55 21 96469-0650`.** Um dos dois está errado. Enquanto a divergência existir, qualquer agente ou pessoa que "corrija o código pela documentação" publica o número errado |
| e-mail `comercial@bianchinicozinhas.com.br` | **verificado** | consistente em todas as fontes |
| "17 anos" (bullet de Leonardo) × "18 anos" (métrica da empresa) | **presente, sem confirmação** | pode ser correto (empresa × pessoa), mas na mesma página os dois números convivem sem explicação |
| **CNPJ e razão social** | **ausente** | não estão no rodapé, nem em `/sobre`, nem na política de privacidade — que declara textualmente que "serão incluídos antes da publicação definitiva" |
| endereço completo | **ausente** | só "Rio de Janeiro · RJ · Brasil" |
| política de privacidade | **presente, incompleta** | finalidade, base legal, compartilhamento, retenção e direitos estão escritos; **falta a identificação do controlador**, exigida pelo art. 9º da LGPD |
| percentuais de economia, ROI, métricas de case | **corretamente ausentes** | disciplina cumprida em todo o site |

## 5. Riscos jurídicos, por gravidade

1. **P0 — Política de privacidade sem controlador identificado.** Coleta dados
   pessoais (nome, e-mail, WhatsApp, cidade) por formulário, com checkbox de
   consentimento que aponta para uma política que não diz quem é o controlador.
   Não publicar assim.
2. **P0 — Logos de clientes sem autorização registrada.** Dez marcas de terceiros,
   várias delas grandes empresas com política de marca. Precisa de confirmação
   comercial antes da publicação.
3. **P1 — Depoimentos sem autorização registrada.** Nome, cargo, empresa e
   retrato de duas pessoas identificáveis, com pendência anotada no próprio
   arquivo.
4. **P1 — "3.000+ projetos" não validado.** É a métrica mais visível do site
   (aparece no hero, em `#credibilidade` e na `meta description`) e o próprio
   código registra que o número não foi confirmado.
5. **P2 — SLA público sem processo de suporte declarado.** "Retorno em até 1 dia
   útil" é promessa contratável.
6. **P2 — Conflito de número de WhatsApp entre código e documentação.**

## 6. Segurança — nota

Não há `Content-Security-Policy`, e `next.config.ts` explica por quê: os dois
`<script>` inline de `layout.tsx` (flag `data-js` e JSON-LD) exigiriam nonce por
requisição, o que tiraria as páginas do pré-render estático. **A justificativa é
tecnicamente correta.** Registrado como item de V2 com medição, não como falha.

Os demais cabeçalhos estão presentes e bem escolhidos, incluindo
`Permissions-Policy` negando câmera, microfone, geolocalização e pagamento —
proteção contra script de terceiro futuro (pixel, chat).
