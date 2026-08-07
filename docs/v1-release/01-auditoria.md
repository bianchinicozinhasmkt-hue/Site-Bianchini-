# Auditoria integrada V1 — 2026-08-05

Rodada única cobrindo UX/UI, motion, responsividade, limpeza, otimização e hardening.
Estado inicial em [`00-estado-inicial.md`](./00-estado-inicial.md); checklist de publicação em
[`02-checklist-publicacao.md`](./02-checklist-publicacao.md).

## Como foi medido

Nada aqui é impressão de leitura de código. Tudo foi medido no build de produção
(`next build` + `next start`), com Edge headless via CDP:

| Verificação | Cobertura |
| --- | --- |
| UX/UI, hierarquia, imagens, âncoras, overflow | 15 rotas × 6 viewports = **90 combinações** (320/390/768/1024/1366/1440) |
| Alvos de toque | 14 rotas × 4 viewports = 56 combinações, **1.998 elementos interativos** medidos por geometria real |
| Motion | `prefers-reduced-motion` em `reduce` e `no-preference`, 390 e 1440 |
| Teclado | 25 paradas de `Tab` na home |
| Peso transferido | 6 rotas × 2 viewports, cache desligado |
| Perda visual da otimização | diferença de pixel em canvas, 1440×900 |

## Resultado em uma linha

O site chegou nesta rodada **sem defeito básico de UX/UI**. As três correções aplicadas
são de payload, de alvo de toque e de configuração — nenhuma de layout, conteúdo ou
composição visual. Nada do trabalho visual aprovado foi tocado.

---

## Bloqueador V1 — corrigido

### B1. Domínio ausente publicava `localhost` no sitemap, robots e canônicas

`site.url` cai em `http://localhost:3000` quando `NEXT_PUBLIC_SITE_URL` não existe, e o
build **passava em silêncio**. Publicado assim, `sitemap.xml`, `robots.txt`, todas as
canônicas e as imagens de Open Graph apontariam para localhost — falha que só aparece
depois de indexada, e cara de reverter.

Não dá para corrigir com um domínio fixo, porque o domínio ainda não foi confirmado. O que
entrou foi um **aviso de build não fatal** em [`site.ts`](../../src/data/site.ts), impresso no
log de deploy. Não fatal de propósito: derrubar o build puniria um host que monte as
variáveis só em runtime.

Verificado nos dois sentidos — sem a variável o aviso aparece; com
`NEXT_PUBLIC_SITE_URL=https://www.bianchinicozinhas.com.br` o build fica silencioso e
compila limpo. **A definição da variável continua sendo item 1 do checklist**: o aviso
avisa, não resolve.

---

## Correções seguras V1 — aplicadas

### C1. Instância mobile do hero baixava a foto em largura cheia no desktop

`hero-section.tsx` declarava `sizes="100vw"` no bloco `lg:hidden`. `hidden` não impede
download: a 1440px o navegador resolvia a largura pela janela real e pedia a candidata
`w=1920`. É exatamente a armadilha das "duas instâncias da foto do hero" anotada no
`CLAUDE.md` — só a instância do desktop a respeitava.

Corrigido para `sizes="(max-width: 1023px) 100vw, 1px"`, o inverso do desktop. Medido a
1440px, as três fotos do carrossel na instância oculta passaram a vir em `w=640`
(67 + 29 + 14 KB) em vez da largura cheia. Sem efeito visual: o elemento não é exibido
nessa faixa.

### C2. Faixa decorativa servida em qualidade de fotografia de primeiro plano

`scope-triad-band.tsx` carrega `bar-em-inox.jpg` como fundo `aria-hidden`, a `opacity-45`,
sob um gradiente que cobre de 74% a 98%. Estava em `quality={78}` — a mesma faixa das
fotos que o site mostra de frente.

Reduzido para `quality={60}` (valor já declarado em `images.qualities`). **Verificado por
diferença de pixel antes de aceitar**, e a primeira medição reprovou: 7% dos pixels
acima de 8/255. Recapturado com espera de decodificação real — a captura anterior pegara
a imagem antes de decodificar — o resultado foi:

| métrica | valor |
| --- | --- |
| diferença máxima de canal | **4 / 255** |
| pixels com diferença > 8 | **0%** |
| pixels com diferença > 2 | 0,01% |
| diferença média | 0,147 |

Ganho: **176 KB → 93 KB** na requisição de 1920px.

### C3. Logotipo do cabeçalho com alvo de toque de 34px

Único controle presente em todas as rotas, e o menor de todos: 34px de altura no mobile,
40px no tablet. O lockup tem altura fixa por legibilidade da segunda linha, então o
**link** passou a carregar a caixa (`min-h-[2.75rem]`) e a imagem continua com a altura
que a marca pede, centrada dentro dela. Cabe na faixa de 64px do cabeçalho mobile — nada
se desloca. Só o cabeçalho usa `asLink`; o rodapé chama com `asLink={false}`.

Confirmado: o logotipo saiu da lista de alvos sub-44px na medição final.

### C4. Cabeçalhos de segurança ampliados

Havia `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy`. Entraram
`Strict-Transport-Security` (1 ano, com subdomínios, **sem `preload`** — entrar na lista
de preload é decisão de domínio e é difícil de desfazer), `Permissions-Policy` negando
câmera, microfone, geolocalização e pagamento, e `X-DNS-Prefetch-Control`.

`Content-Security-Policy` ficou **de fora de propósito**: o `layout.tsx` injeta dois
scripts inline (a flag `data-js`, que precisa rodar antes da primeira pintura, e o
JSON-LD), então uma CSP útil exige nonce por requisição — o que tira as páginas do
pré-render estático. É V2, com medição, não algo para entrar às vésperas da publicação.

### C5. Perfis do Edge poluíam o versionamento

`.tmp-edge-cdp/` e `.tmp-edge-cdp2/`, criados pelos scripts de captura, respondiam por
**2.562 dos 3.341 arquivos não rastreados**. Entraram no `.gitignore`. Os diretórios em si
não foram apagados — são reutilizados pela ferramenta de captura.

### C6. Dois logotipos órfãos removidos

`logo-bianchini.png` (209 KB) e `logo-bianchini-light.png` (55 KB): o lockup antigo
"BIANCHINI KITCHEN PRO", que o próprio componente documenta como "não é a marca oficial e
não deve ser usado". Sem nenhuma referência no código e iam junto no bundle, já que
`public/` é copiada inteira. Estavam versionados —
`git show HEAD:public/images/brand/logo-bianchini.png` os recupera. Comentário do `Logo`
atualizado.

---

## O que foi auditado e estava correto

Registrado porque "nada encontrado" também é resultado, e evita reauditar na próxima rodada.

| Frente | Resultado |
| --- | --- |
| Overflow horizontal | **0** em 90 combinações |
| Hierarquia de títulos | exatamente 1 `<h1>` por rota, nenhum salto de nível |
| `alt` em imagens | nenhuma imagem sem `alt` |
| Nome acessível | nenhum link, botão ou tab anônimo |
| Âncoras internas | nenhuma sem destino; nenhum `href="#"` vazio |
| Imagens 404 | nenhuma; 57 referências, todas existem em `public/` |
| `quality` declarada | todas as usadas constam de `images.qualities` |
| `<Image fill>` sem `sizes` | nenhum |
| Erros de console | nenhum (o único 404 é a rota de teste que eu mesmo pedi) |
| Foco de teclado | marca visível nas 25 paradas testadas |
| Menu mobile | abre, fecha por `Escape` **devolvendo o foco ao gatilho**, fecha por clique no fundo |
| Formulário | valida 7 campos, cada erro associado por `aria-describedby`, foco vai para o status, não navega |
| `prefers-reduced-motion` | **0 animações rodando**; cortina do hero em `display: none`; fotografia do hero visível em todos os casos |
| Animação em laço | uma só, a faixa de logos — e ela para com `reduce` |
| `console.log` / `TODO` / placeholder | nenhum no código |
| `/obrigado` | `noindex, nofollow`, e fora do sitemap |
| Segredos versionados | nenhum; `.env.example` presente, `.env*` ignorados |

Dois alertas do meu próprio instrumental foram investigados e **descartados como artefato
de medição**, não defeitos do site:

- **`.reveal` em opacidade 0**: aparecia com rolagem de 55ms por passo, variava de execução
  para execução e sumia com 260ms de parada (0 de 18 presos). O `IntersectionObserver` não
  tinha tempo de disparar.
- **Imagem "quebrada"** em 1024×768 (`linha-de-coccao.jpg&w=828&q=78`): apareceu em 1 das
  90 combinações, sem nenhuma resposta HTTP ≥ 400 correspondente. Requisitada
  diretamente três vezes, responde sempre `200 image/jpeg`, 145.429 bytes idênticos. Era
  o `<img>` amostrado no estado `complete && naturalWidth === 0`, com a requisição ainda
  em voo durante a troca de viewport.

A mesma cautela vale para a leitura destes números: **medição instável é medição a
refazer, não achado**. Os dois alertas acima só viraram "artefato" depois de reteste
dedicado — o primeiro deles, a faixa decorativa, chegou a reprovar na primeira
comparação de pixel e só passou quando a captura esperou a decodificação real.

---

## Melhorias V2 — não aplicadas, com motivo

Nenhuma impede a publicação. Todas exigem decisão, conteúdo novo ou refatoração com risco.

| # | Item | Por que ficou fora |
| --- | --- | --- |
| V2-1 | **CSP com nonce** | exige sair do pré-render estático; precisa de medição própria |
| V2-2 | **Fotos guardadas como PNG** — `public/` tem 12,1 MB, com 4 PNGs somando 8 MB | o `next/image` já entrega AVIF/WebP redimensionado, então **o usuário não paga por isso**; o ganho é de bundle de deploy. Converter fontes é mexer em asset aprovado |
| V2-3 | **Home a 1440px pede 15 requisições de imagem do hero** | são 3 slides × 2 instâncias; eliminar de verdade exige renderização condicional do hero, que o `CLAUDE.md` marca como área delicada |
| V2-4 | **CTA "Solicitar diagnóstico" no cabeçalho com 40px** | só aparece a partir de 1024px, contexto de mouse; a proporção (46% da faixa) é decisão documentada |
| V2-5 | **`processSteps` em `src/data/process.ts` sem consumidor** | foi superado por `methodSteps`, mas carrega copy real da "Metodologia" do site anterior. **Não apaguei conteúdo confirmado** — precisa de decisão do gestor. O arquivo **não** é morto: `caseStages`, no mesmo arquivo, está em uso |
| V2-6 | **`heroTitleLines` e `heroPhotoCaption` sem consumidor** | são a copy aprovada do mockup, hoje substituída pelo carrossel (`heroSlides`). Remover é decidir que o carrossel é definitivo |
| V2-7 | **Exports sem consumidor**: `scopeSequence`, `scopeSpan`, `heroBookSlide`, `src/styles/tokens.ts`, 15 ícones | todos são tree-shaken — remover **não economiza um byte** no cliente e adiciona risco |
| V2-8 | **`apple-touch-icon` aponta para `favicon.ico`** | iOS renderiza `.ico` mal; corrigir exige gerar um PNG 180×180 da marca |
| V2-9 | **Deriva de documentação**: `CLAUDE.md` lista o WhatsApp `+55 21 96469-0650`; o código traz `+55 21 99518-1918` com nota "atualizado em 2026-08-03, não alterar sem confirmação comercial" | o código parece ser o mais recente, mas **confirmar qual é o número certo é decisão comercial**, não técnica |

### Uma armadilha que quase virou "limpeza"

Minha varredura estática apontou as qualidades `60`, `74` e `86` como declaradas sem uso em
`next.config.ts`. A medição de rede mostrou `q=74` em praticamente toda imagem — o valor
chega por props, fora do alcance de busca textual. **Removê-las teria devolvido 400 no
otimizador e sumido com as imagens em produção, sem erro de build.** A lista ficou intacta.
