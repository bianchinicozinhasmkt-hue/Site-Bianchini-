import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/*
  `force-static` é exigido por `output: 'export'`: sem ele o Next trata esta
  rota como dinâmica e o build aborta com "export const dynamic =
  force-static not configured on route". O conteúdo já era estático — a
  função não lê requisição, cookie nem cabeçalho —, então a diretiva só declara
  o que sempre foi verdade, e o arquivo passa a ser gerado no export.
*/
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Página de confirmação de conversão não deve ser indexada.
        disallow: ['/obrigado'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
