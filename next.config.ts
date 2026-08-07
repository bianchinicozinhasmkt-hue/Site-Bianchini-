import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
