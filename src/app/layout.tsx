import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AgeVerification from '@/components/AgeVerification'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Desapegrow - Marketplace de Equipamentos Grow',
  description: 'Compre e venda equipamentos para cultivo indoor',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: [
      { url: '/logo/logo.svg', type: 'image/svg+xml' },
      { url: '/logo/logo.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: '/logo/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen overflow-x-hidden`}>
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