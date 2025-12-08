'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ArrowLeft } from 'lucide-react'

export default function MeusAnunciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/vendedor">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">📦 Meus Anúncios</h1>
            <p className="text-gray-600">Gerencie seus produtos à venda</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Produtos Ativos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Package className="w-5 h-5" />
                Produtos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-green-600">
              0
            </CardContent>
          </Card>

          {/* Card 2: Rascunhos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                📝 Rascunhos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-yellow-600">
              0
            </CardContent>
          </Card>

          {/* Card 3: Aguardando Aprovação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                ⏳ Aguardando
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-blue-600">
              0
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/vendedor/produtos/novo">
            <Button size="lg" className="text-xl px-8">
              ➕ Criar Novo Anúncio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
