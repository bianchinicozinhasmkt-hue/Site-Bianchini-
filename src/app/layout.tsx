import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'
import { defaultMetadata } from '@/lib/metadata'
import { site } from '@/data/site'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsappFloat } from '@/components/layout/whatsapp-float'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A2840',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale} className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        {/*
          Sinaliza que o JS está ativo antes da primeira pintura. As animações
          de entrada só escondem conteúdo quando esta flag existe.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='on'" }}
        />
      </head>
      <body>
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
