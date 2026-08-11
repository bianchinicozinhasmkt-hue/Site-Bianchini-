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
    /*
      Barra final obrigatória, e ela não é estética: `trailingSlash: true`
      (`next.config.ts`) faz o export gerar `sobre/index.html`, servido em
      `/sobre/`. Um sitemap apontando para `/sobre` faria o Apache responder
      301 para `/sobre/` em cada URL da lista — um salto inútil em toda página
      indexada, e uma canônica divergente da URL anunciada.

      A raiz já é `/`, então recebe tratamento próprio para não virar `//`.
    */
    url: `${site.url}${route.path === '/' ? '/' : `${route.path}/`}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
