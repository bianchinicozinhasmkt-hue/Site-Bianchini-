import type { Metadata, Viewport } from 'next'
import { Manrope, Oswald } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'
import { defaultMetadata } from '@/lib/metadata'
import { organizationSchema } from '@/lib/schema'
import { site } from '@/data/site'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsappFloat } from '@/components/layout/whatsapp-float'

const GTM_ID = 'GTM-TD8VCSBK'

/**
 * Leitura e interface. Peso 800 reservado ao título do hero e ao segundo pico
 * tipográfico da página. Não há família serifada no projeto.
 */
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

/**
 * Condensada da marca — a família de títulos do site oficial publicado.
 * Restrita a elementos comerciais e técnicos curtos (rótulo de botão, etiqueta
 * de seção, numeral de métrica, cota). Ver `src/styles/typography.ts`.
 *
 * Três pesos, e só três: 500 para etiquetas, 600 para rótulos de ação e 700
 * para numerais. Cada peso extra é um arquivo a mais na primeira pintura.
 */
const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-condensed',
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#101010',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /*
      `suppressHydrationWarning`: o script abaixo grava `data-js` em <html>
      antes da primeira pintura, de propósito — logo o HTML do servidor e o do
      cliente divergem nesse atributo por construção. Sem isto o React reporta
      um erro de hidratação no console em toda navegação.
    */
    <html
      lang={site.locale}
      className={`${manrope.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/*
          Sinaliza que o JS está ativo antes da primeira pintura. As animações
          de entrada só escondem conteúdo quando esta flag existe.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='on'" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsappFloat />
      </body>
    </html>
  )
}
