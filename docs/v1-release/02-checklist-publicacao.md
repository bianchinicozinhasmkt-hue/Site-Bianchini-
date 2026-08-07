# Checklist de publicação — V1

O código está em estado de **candidato final de produção**. Esta rodada não fez commit,
push, deploy nem alteração de DNS, por instrução. O que falta é decisão e credencial —
não código.

Auditoria em [`01-auditoria.md`](./01-auditoria.md).

---

## 1. Antes de publicar — bloqueadores externos

Nenhum destes é código. Todos dependem de informação que o projeto ainda não tem.

- [ ] **Confirmar o domínio definitivo.**
      É a decisão que trava as demais. `bianchinicozinhas.com.br` é o domínio da marca
      publicada hoje — confirmar se a V1 assume esse endereço, um subdomínio, ou outro.

- [ ] **Definir `NEXT_PUBLIC_SITE_URL` no ambiente de deploy**, com `https://` e com ou
      sem `www` **exatamente** como o domínio vai responder.
      Sem ela, `sitemap.xml`, `robots.txt`, as canônicas e o Open Graph saem apontando
      para `http://localhost:3000`. O build **não falha** nesse caso — ele imprime
      `[bianchini] NEXT_PUBLIC_SITE_URL não definida` no log. **Procure essa linha no log
      do primeiro deploy.** Se ela aparecer, o site subiu errado.
      Modelo em `.env.example`.

- [ ] **Decidir entre `www` e apex** e configurar o redirecionamento permanente de um
      para o outro no host. Servir os dois sem redirect duplica todas as URLs para o
      índice de busca.

- [ ] **Confirmar o número de WhatsApp.** O código usa `+55 21 99518-1918`
      (`src/data/site.ts`, com nota "atualizado em 2026-08-03, não alterar sem confirmação
      comercial"); o `CLAUDE.md` ainda lista `+55 21 96469-0650`. **É o número que recebe
      todo lead do site** — todos os CTAs, o botão flutuante e o formulário desembocam
      nele. Confirmar antes de publicar, não depois.

- [ ] **Validar o formulário de contato ponta a ponta.** Não existe backend:
      `contact-form.tsx` monta a mensagem e abre WhatsApp ou e-mail. Enviar um teste real
      pelos dois caminhos e confirmar que chega.

---

## 2. Publicação

- [ ] Criar branch e commit a partir do estado atual. A árvore tem **43 arquivos
      rastreados modificados, 9 removidos e ~779 novos** — é o rebuild inteiro, ainda não
      commitado. Cópia de segurança já existe fora do repositório (ver
      [`00-estado-inicial.md`](./00-estado-inicial.md), seção 5).
- [ ] Revisar o que entra: `_entrega_chatgpt/` (258 arquivos, cópia paralela do código),
      `bianchini-site-original-para-analise.zip` e `docs/` (429 capturas) **não precisam ir
      para o repositório de produção**.
- [ ] Node 20.9+ no host (`package.json` → `engines`).
- [ ] Build de produção no host: `npm ci && npm run build`.
- [ ] Conferir no log: nenhum aviso `[bianchini]`, 19 rotas estáticas geradas.
- [ ] Apontar o DNS e emitir o certificado. `Strict-Transport-Security` já vai nos
      cabeçalhos com validade de 1 ano — **só ligue o domínio quando o HTTPS estiver
      funcionando**, porque o HSTS impede o navegador de voltar a HTTP por um ano.

---

## 3. Depois de publicar — verificar no domínio real

- [ ] `https://SEU-DOMINIO/sitemap.xml` — as 13 URLs com o domínio real, sem `localhost`.
- [ ] `https://SEU-DOMINIO/robots.txt` — `Disallow: /obrigado` e a linha `Sitemap:` correta.
- [ ] Ver o código-fonte da home: `<link rel="canonical">` com o domínio real.
- [ ] Colar a home no depurador de compartilhamento do WhatsApp/LinkedIn — a imagem de
      Open Graph precisa carregar (é `/images/projects/cozinha-completa.jpg`, 1400×1050).
- [ ] Testar os dois redirecionamentos permanentes: `/forno-combinado-rational` e
      `/construcao-e-reformas`.
- [ ] Abrir a home no celular real: hero, troca de slide, menu, botão do WhatsApp.
- [ ] Enviar o formulário uma vez em produção.
- [ ] Registrar o site no Google Search Console e submeter o sitemap.

---

## 4. O que já está pronto e verificado

Não precisa reverificar antes de publicar — foi medido nesta rodada, no build de produção.

| | |
| --- | --- |
| `npm run build` | passa, do zero, 19 rotas estáticas |
| `npm run lint` / `npm run type-check` | limpos |
| Overflow horizontal | 0 em 90 combinações (320 → 1440) |
| Erros de console | nenhum |
| Imagens 404 | nenhuma |
| Acessibilidade estrutural | 1 `h1` por rota, sem salto de nível, `alt` em tudo, todo controle com nome |
| Teclado | foco visível; menu fecha por `Escape` devolvendo o foco ao gatilho |
| Formulário | valida 7 campos, erro associado ao campo |
| `prefers-reduced-motion` | 0 animações rodando, nenhum conteúdo invisível |
| Alvos de toque | todos ≥ 44px, exceto os dois casos justificados abaixo |
| Cabeçalhos de segurança | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, `X-DNS-Prefetch-Control` |
| Segredos | nenhum versionado; `.env*` ignorado |
| Peso da home | 283 KB a 390px / 250 KB a 1440px na primeira dobra |

Os dois alvos abaixo de 44px são deliberados: o **checkbox de consentimento** (24px, com
`<label htmlFor>` associado — o alvo efetivo é o bloco de texto, e 24px é o mínimo do WCAG
2.2 AA 2.5.8) e o **CTA do cabeçalho** (40px, só a partir de 1024px, contexto de mouse).

---

## 5. Riscos conhecidos que sobrevivem à V1

Nenhum impede publicar. Estão em `01-auditoria.md` com detalhe.

1. **Sem CSP.** Os demais cabeçalhos estão postos; a CSP exige nonce e sai do
   pré-render estático — precisa de rodada própria.
2. **`public/` com 12,1 MB**, sendo 8 MB em quatro PNGs de fotografia. O usuário **não
   paga por isso** (o `next/image` entrega AVIF/WebP redimensionado); pesa no bundle de
   deploy.
3. **Home pede 15 requisições de imagem do hero a 1440px** — 3 slides × 2 instâncias.
   Resolver de verdade exige renderização condicional do hero.
4. **Formulário sem backend.** Se um dia entrar endpoint real, manter o fallback e não
   passar a enviar dado pessoal em evento de analytics.
5. **`apple-touch-icon` aponta para `favicon.ico`** — iOS renderiza `.ico` mal.
