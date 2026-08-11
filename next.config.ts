import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
    ============================================================
    MODELO DE ENTREGA — APLICAÇÃO NEXT, COMPILADA PELO HOST
    ============================================================

    Nenhum `output` é declarado, e isso é a configuração correta para esta
    hospedagem — não um esquecimento. O histórico vale registrar porque as duas
    alternativas foram tentadas em produção e as duas falharam por razões
    diferentes:

      1. **`output: 'standalone'`** — produzia um `server.js` autocontido. O
         painel da Hostinger não executa um binário pronto: ele recebe
         **código-fonte** e compila. Enviar o build já pronto fez o painel rodar
         `next build` sobre um pacote sem `src/`, e abortar com "Couldn't find
         any `pages` or `app` directory";
      2. **`output: 'export'`** — produzia `out/`, um site estático. Também não
         serve aqui: o preset "Next.js" do painel roda `npm start` depois do
         build, e `next start` recusa rodar contra um projeto exportado.

    O painel de **Implantações** é um pipeline de build: sobe-se um zip do
    projeto, ele escolhe o preset (Next.js), a versão do Node (22.x) e executa
    `npm install` → `npm run build` → `npm start`. Ou seja, ele quer exatamente
    um projeto Next comum. É o que este arquivo descreve.

    Consequência prática: `redirects()`, `headers()` e a otimização de imagem do
    `next/image` **funcionam**, porque existe servidor. Foi por isso que a
    tentativa de export estático foi abandonada — ela custava as três coisas, e
    o custo não era necessário.

    `NEXT_PUBLIC_SITE_URL` precisa estar definida em **Variáveis de ambiente**
    no painel, e não aqui: ela é lida em `src/data/site.ts` durante o build, e
    quem executa o build é o host.
  */
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
