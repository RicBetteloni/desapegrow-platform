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
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon.png',
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
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