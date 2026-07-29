import type { Metadata } from 'next'
import { site } from '@/data/site'

const metadataBase = new URL(site.url)

/**
 * Metadata padrão do site. O domínio definitivo ainda não está confirmado —
 * defina NEXT_PUBLIC_SITE_URL no deploy para que canonical, sitemap e Open
 * Graph apontem para o endereço real.
 */
export const defaultMetadata: Metadata = {
  metadataBase,
  title: {
    default: site.title,
    template: `%s — ${site.shortTitle}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: '/',
    images: [
      {
        url: '/images/projects/cozinha-completa.jpg',
        width: 1400,
        height: 1050,
        alt: 'Cozinha profissional projetada e implantada pela Bianchini',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/images/projects/cozinha-completa.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

/** Metadata para páginas internas, herdando os defaults. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${title} — ${site.shortTitle}`,
      description,
      url: path,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} — ${site.shortTitle}`,
      description,
    },
  }
}
