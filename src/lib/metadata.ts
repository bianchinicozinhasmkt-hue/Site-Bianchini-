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

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  /**
   * Imagem social própria da página. Sem ela a página herda a do site.
   * Use 1200 × 630 — é a proporção que LinkedIn, WhatsApp e X recortam sem
   * cortar o assunto.
   */
  image?: { url: string; alt: string; width?: number; height?: number }
  /** Título completo, quando o template `%s — Bianchini` não serve. */
  absoluteTitle?: string
}

/** Metadata para páginas internas, herdando os defaults. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle,
}: PageMetadataOptions): Metadata {
  const socialTitle = absoluteTitle ?? `${title} — ${site.shortTitle}`
  const images = image
    ? [{ url: image.url, width: image.width ?? 1200, height: image.height ?? 630, alt: image.alt }]
    : defaultMetadata.openGraph?.images

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: socialTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: socialTitle,
      description,
      images: image ? [image.url] : defaultMetadata.twitter?.images,
    },
  }
}
