'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Desapegrow</h1>
        <p className="text-lg text-gray-600 mb-8">Marketplace Gamificado</p>
        <Link href="/marketplace" className="bg-green-600 text-white px-6 py-2 rounded inline-block hover:bg-green-700">
          Ver Produtos
        </Link>
      </div>
    </div>
  )
}
