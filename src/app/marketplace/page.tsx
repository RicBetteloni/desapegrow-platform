import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <span>🌱</span>
            <span>Desapegrow</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/vendedor">
              <Button>Vender</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🛒 Marketplace</h1>
          <p className="text-gray-600 text-lg">
            Descubra equipamentos incríveis e ganhe pontos a cada compra!
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📂 Categorias</h2>
          <Suspense fallback={<div>Carregando categorias...</div>}>
            <CategoriesGrid />
          </Suspense>
        </div>

        {/* Coming Soon Message */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <span>🚧</span>
              <span>Produtos em Breve!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              O catálogo de produtos está sendo preparado. Em breve você poderá:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Navegar por produtos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Ganhar pontos nas compras</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Sistema de favoritos</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Reviews com pontos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Busca avançada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Dashboard do vendedor</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button size="lg">
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente separado para as categorias
async function CategoriesGrid() {
  // Por enquanto, vamos simular as categorias
  const categories = [
    { name: "Equipamentos de Iluminação", slug: "iluminacao", icon: "💡" },
    { name: "Ventilação e Climatização", slug: "ventilacao", icon: "🌀" },
    { name: "Sistemas Hidropônicos", slug: "hidroponia", icon: "💧" },
    { name: "Fertilizantes e Nutrição", slug: "fertilizantes", icon: "🧪" },
    { name: "Substratos e Vasos", slug: "substratos", icon: "🏺" }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Card key={category.slug} className="hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">{category.icon}</div>
            <h3 className="font-semibold text-sm">{category.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}