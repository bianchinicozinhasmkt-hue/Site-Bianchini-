# Guia de deploy manual — Hostinger (upload de ZIP)

Este guia é para o responsável que vai operar o hPanel. O Claude **não** executa nenhum
passo daqui — acesso à Hostinger, DNS, domínio e deploy são manuais, por decisão explícita
desta rodada.

## O artefato

`release/bianchini-v1-hostinger-2026-08-05.zip` (12,5 MB), gerado a partir do estado atual
da working tree (ver `00-estado-inicial.md`). Contém **código-fonte**, não um build
pronto — o build precisa rodar no servidor, pelo motivo explicado abaixo. Conteúdo:

- `src/`, `public/` — aplicação completa.
- `package.json`, `package-lock.json` — mesmas versões já validadas localmente
  (Next 15.5.22, React 19.2.0).
- `next.config.ts`, `next-env.d.ts`, `tailwind.config.ts`, `postcss.config.mjs`,
  `tsconfig.json`, `.eslintrc.json` — configuração de build.
- `.env.example` — variável de ambiente documentada (sem segredo).
- `README.md` — comandos e stack, para referência.

Deliberadamente **fora** do ZIP: `node_modules/` (o servidor reinstala), `.next/` (o
servidor gera — ver por quê abaixo), `.git/`, documentação interna de projeto
(`docs/`, `AGENTS.md`, `AUDITORIA_*`, `DIRECAO_MESTRA*`, `GUIA_*`,
`MOCKUP_HERO_APROVADO.png`), backups (`_entrega_chatgpt/`,
`bianchini-site-original-para-analise.zip`) e `scripts/` (tooling de auditoria visual, não
usado em produção). Nada disso é necessário para build ou runtime, e enviá-los só
aumentaria o pacote e a superfície de coisas para revisar no servidor.

## Por que o build não vem pronto

`NEXT_PUBLIC_SITE_URL` é usada em tempo de **build** (`src/lib/metadata.ts`, `sitemap.ts`,
`robots.ts`) para gerar canonical, Open Graph e sitemap. Se eu buildasse aqui, o valor
ficaria congelado em `http://localhost:3000` — e eu não posso adivinhar o domínio final
(instrução explícita: nada de configurar domínio por suposição). Por isso o `next build`
**precisa rodar no servidor**, depois que a variável de ambiente real estiver definida.

## Passo a passo no hPanel

1. **Criar a aplicação Node.js** em hPanel → Node.js. Escolher versão **≥ 20.9**
   (`package.json.engines.node`); 20.x LTS ou 22.x atendem. A versão exata é decisão sua —
   não há motivo técnico para preferir uma sobre a outra além do que a Hostinger oferecer
   como LTS no momento.
2. **Upload do ZIP** para a pasta raiz da aplicação (a que o hPanel apontar) e extrair.
3. **Variáveis de ambiente**, na aba do app Node.js:
   - `NEXT_PUBLIC_SITE_URL` = domínio final com protocolo, ex.:
     `https://www.bianchinicozinhas.com.br` (confirme o domínio real antes deste passo —
     é o único valor que precisa estar certo antes do build).
   - `NODE_ENV=production` (se o painel não definir isso automaticamente para apps Node —
     confirme).
4. **Instalar dependências**: rodar `npm install` (ou `npm ci`, se o painel expuser
   terminal/SSH e o `package-lock.json` estiver presente — `npm ci` é mais estrito e
   recomendado quando disponível).
5. **Build de produção**: `npm run build`. Isso vai gerar `.next/` já com o
   `NEXT_PUBLIC_SITE_URL` correto embutido nas páginas estáticas.
6. **Startup file / comando de start**: `npm run start` (equivale a `next start`, que lê a
   porta de `process.env.PORT` quando o painel a define — não é preciso passar `-p`
   manualmente). Se o painel da Hostinger exigir um arquivo `.js` específico como "Startup
   File" em vez de um comando `npm`, isso é uma particularidade do painel a resolver na
   hora — não há como prever qual variante de UI a conta vai mostrar sem acesso a ela.
7. **Domínio e DNS**: conectar o domínio à aplicação e apontar o DNS conforme o próprio
   fluxo do hPanel. Fora do escopo desta preparação.
8. **Deploy** (iniciar/reiniciar a aplicação Node no painel).

## Smoke test remoto (checklist)

Baseado na "Definição de pronto" de `CLAUDE.md` — rodar contra a URL pública já no ar:

- [ ] Home carrega sem erro 500/502 e sem erro no console do navegador.
- [ ] `npm run build` no servidor terminou sem avisos de `NEXT_PUBLIC_SITE_URL não
      definida` (se aparecer, a variável não foi lida antes do build — corrigir e
      rebuildar).
- [ ] `/sitemap.xml` e `/robots.txt` respondem e apontam para o domínio real, não
      `localhost`.
- [ ] Nenhuma imagem quebrada (checar Rede/Network no DevTools por 404 em `/_next/image`
      ou em `/images/*`).
- [ ] Menu mobile abre, navega e fecha (clique, Esc, clique fora).
- [ ] Botão de WhatsApp abre conversa com o número correto
      (`+55 21 96469-0650` — não deve ter sido alterado).
- [ ] Formulário de contato monta a mensagem e abre WhatsApp/e-mail (sem backend — isso é
      esperado, não é bug).
- [ ] Sem overflow horizontal em 320 / 390 / 768 / 1024 / 1440px.
- [ ] `/forno-combinado-rational` e `/construcao-e-reformas` redirecionam (301) para as
      rotas atuais.
- [ ] HTTPS ativo (o `Strict-Transport-Security` do `next.config.ts` só faz efeito sob
      HTTPS — em HTTP puro ele é ignorado pelo navegador, não é erro).

## Rollback

Se algo falhar depois do deploy, o hPanel normalmente permite parar a aplicação Node ou
reverter para uma versão anterior de arquivos, se você mantiver o ZIP anterior. Este
artefato não altera nada em produção por si só — ele só existe localmente até você fazer o
upload.
