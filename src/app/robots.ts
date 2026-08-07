import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

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
