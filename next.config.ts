import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
    ============================================================
    SITE ESTÁTICO — `export` (2026-08-11)
    ============================================================

    **Decisão do gestor, e ela define a arquitetura de entrega.** A hospedagem é
    a mesma que servia a V1: uma pasta jogada no painel da Hostinger, sem
    processo Node rodando. Um build `standalone` — que foi o que esta rodada
    tentou primeiro — não funciona ali por construção: ele produz um
    `server.js` que **alguém precisa executar**, e não há quem execute.

    Export estático é, portanto, o único modelo compatível com o host. O que ele
    custa está registrado abaixo, com a compensação de cada item:

      · **`redirects()` deixam de existir no Next.** Os dois links antigos
        (`/forno-combinado-rational` e `/construcao-e-reformas`) passam a ser
        resolvidos por `RedirectPermanent` no `.htaccess` que o script de pacote
        gera. Continuam 301, continuam para o mesmo destino;
      · **`headers()` deixam de existir no Next.** Os cinco cabeçalhos de
        segurança passam para o mesmo `.htaccess`, via `mod_headers`. Continuam
        sendo emitidos, agora pelo Apache/LiteSpeed;
      · **`next/image` perde a otimização.** É a única perda sem compensação
        possível sem servidor: `unoptimized: true` desliga AVIF/WebP e o
        redimensionamento por breakpoint, e cada imagem passa a ser servida no
        arquivo original. Está medido e reportado no `HOSTINGER-DEPLOY.md` —
        é o preço de não ter Node, não um descuido.

    `trailingSlash: true` **não é preferência de URL**: é o que faz o export
    gerar `sobre/index.html` em vez de `sobre.html`. Apache serve o primeiro
    nativamente em `/sobre/`; o segundo dependeria de `MultiViews` ou de regra
    de reescrita, que nem toda hospedagem compartilhada tem ligada. Com ele, a
    pasta funciona ao ser simplesmente copiada — que é o requisito.
  */
  output: 'export',
  trailingSlash: true,
  images: {
    /*
      `unoptimized` é imposto pelo `output: 'export'`: sem servidor não há
      otimizador, e o build falha se ele não estiver ligado. Consequência real,
      registrada para não ser esquecida: `formats` (AVIF/WebP) e `qualities`
      deixam de ter efeito, e cada `<Image>` passa a servir o arquivo original
      de `public/`, no tamanho original, em qualquer largura de tela.

      `sizes`, `priority` e `loading` continuam valendo — o navegador ainda
      decide o que baixar primeiro. O que se perde é a reamostragem e a
      recodificação.
    */
    unoptimized: true,
  },
  /*
    ============================================================
    `redirects()` E `headers()` SAÍRAM DAQUI (2026-08-11)
    ============================================================

    Não foram removidos do produto: foram **transferidos**. Com
    `output: 'export'` o Next ignora os dois e emite aviso de build — eles
    dependem de um servidor que não existe nesta hospedagem.

    Os dois passaram para o `.htaccess` que `scripts/gerar-pacote-hostinger.mjs`
    escreve dentro do pacote, onde o Apache/LiteSpeed da Hostinger os aplica:

      · `/forno-combinado-rational` → `/linhas-de-produtos/forno-combinado-rational/`
      · `/construcao-e-reformas`    → `/solucoes/arquitetura/`
        (fora do escopo por decisão do gestor em 2026-08-03; o redirect existe
        só por compatibilidade de link antigo, e vai direto à página que cobre
        o conteúdo, sem salto intermediário)

      · X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
        Strict-Transport-Security e Permissions-Policy

    Não há `Content-Security-Policy`, e continua sendo de propósito: o
    `layout.tsx` injeta dois `<script>` inline (a flag `data-js`, que precisa
    rodar antes da primeira pintura, e o JSON-LD), então uma CSP útil exigiria
    nonce por requisição — impossível em arquivo estático.

    **Ao mexer em qualquer um dos dois, mexa no script do pacote.** Este arquivo
    deixou de ser a fonte deles.
  */
}

export default nextConfig
