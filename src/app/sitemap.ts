import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * Rotas indexáveis. `/obrigado` fica fora de propósito — é página de
 * confirmação e está marcada como noindex.
 */
const routes: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/solucoes', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/solucoes/cozinhas-industriais', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/solucoes/arquitetura', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/solucoes/consultoria-para-restaurantes', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/solucoes/consultoria-para-fabricantes', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/projetos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/linhas-de-produtos', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/linhas-de-produtos/forno-combinado-rational', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/leonardo-bianchini', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/sobre', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contato', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/politica-de-privacidade', priority: 0.2, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
