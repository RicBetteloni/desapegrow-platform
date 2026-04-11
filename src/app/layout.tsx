import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Providers } from '@/components/providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AgeVerification from '@/components/AgeVerification'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const GTM_ID = 'GTM-WVJS63N7'

export const metadata: Metadata = {
  title: 'Desapegrow - Marketplace de Equipamentos Grow',
  description: 'Compre e venda equipamentos para cultivo indoor',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics 4 - Global Site Tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-H4Y8WPR3HC" strategy="afterInteractive" />
        <Script id="ga4-script" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-H4Y8WPR3HC', {
  'page_path': window.location.pathname,
  'send_page_view': true,
  'allow_google_signals': true,
  'allow_ad_personalization_signals': true
});`}
        </Script>
        
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen overflow-x-hidden`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <AgeVerification />
          <Header />
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}