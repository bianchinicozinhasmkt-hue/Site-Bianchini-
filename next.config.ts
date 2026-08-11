import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
    ============================================================
    PACOTE DE PRODUÇÃO — `standalone` (2026-08-11)
    ============================================================

    **Este site não é estático, e a tentativa de exportá-lo seria uma conversão
    arquitetural.** `output: 'export'` desligaria três coisas que o projeto usa
    hoje e que não são opcionais:

      · os `redirects()` abaixo (`/forno-combinado-rational` e
        `/construcao-e-reformas`) — em export eles são simplesmente ignorados,
        com aviso de build, e os links antigos passariam a dar 404;
      · os `headers()` de segurança — `X-Content-Type-Options`,
        `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security` e
        `Permissions-Policy` deixariam de ser emitidos;
      · a otimização de imagem do `next/image`, que exigiria
        `images.unoptimized: true`. Com AVIF/WebP desligados, os PNG da primeira
        dobra passariam a ser servidos no tamanho original em toda largura de
        tela — regressão direta de performance na dobra que é o LCP.

    `standalone` **não muda nada disso**: mesma renderização, mesmas rotas,
    mesmas imagens, mesmos cabeçalhos. Ele só altera o **formato do artefato de
    build**, montando em `.next/standalone/` um servidor autocontido com apenas
    as dependências que o rastreamento de módulos comprova serem necessárias.
    É por isso que ele entra numa rodada de fechamento: é mudança de empacotamento,
    não de arquitetura.

    O que o `standalone` **não** copia, e o script de pacote copia à mão (é o
    comportamento documentado do Next, não um defeito):

      `.next/static/`  → `.next/standalone/.next/static/`
      `public/`        → `.next/standalone/public/`

    `sharp` é a única dependência de runtime que precisa de atenção: o
    otimizador de imagem a usa em produção e ela traz binário por plataforma. O
    rastreamento a inclui a partir do `node_modules` da máquina de build, então
    **o pacote gerado no Windows só serve para host Windows**. Para a Hostinger
    (Linux), o passo `npm ci --omit=dev` no servidor resolve — ver
    `HOSTINGER-DEPLOY.md`.
  */
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    /*
      A partir do Next 16 todo `quality` usado precisa estar declarado aqui.
      Sem a lista, cada <Image> com qualidade customizada emite um aviso no
      console em desenvolvimento. Os valores abaixo são exatamente os usados
      no projeto — ao introduzir um novo, acrescente-o à lista.
    */
    qualities: [60, 70, 72, 74, 76, 78, 80, 82, 84, 86],
  },
  async redirects() {
    return [
      {
        source: '/forno-combinado-rational',
        destination: '/linhas-de-produtos/forno-combinado-rational',
        permanent: true,
      },
      {
        /*
          "Construção e Reformas" saiu do escopo (decisão do gestor,
          2026-08-03) — não existe mais como seção, card ou âncora. O redirect
          permanece só por compatibilidade de link antigo, direto para a
          página real que cobre o conteúdo (layout, fluxo, readequação e
          ampliação): um salto só, sem passar por `/projetos-arquitetonicos`.
        */
        source: '/construcao-e-reformas',
        destination: '/solucoes/arquitetura',
        permanent: true,
      },
    ]
  },
  /*
    Cabeçalhos de segurança.

    Não há `Content-Security-Policy` aqui de propósito: o `layout.tsx` injeta
    dois `<script>` inline (a flag `data-js`, que precisa rodar antes da
    primeira pintura, e o JSON-LD), então uma CSP útil exige nonce por
    requisição — o que tira as páginas do pré-render estático. É melhoria de
    V2, com medição, não algo para entrar às vésperas da publicação.

    `Strict-Transport-Security` só tem efeito sobre HTTPS; em `localhost` o
    navegador ignora. Um ano, com subdomínios, sem `preload` — entrar na lista
    de preload é decisão de domínio, não de aplicação, e é difícil de desfazer.
  */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          /*
            O site não usa câmera, microfone, geolocalização nem pagamento.
            Negar explicitamente impede que um script de terceiro incluído no
            futuro (pixel, chat) peça essas permissões em nome do domínio.
          */
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default nextConfig
