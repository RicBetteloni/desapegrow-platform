'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { ProductCard } from '../../components/marketplace/ProductCard'

interface Product {
  id: string
  name: string
  description: string
  slug: string
  price: number
  comparePrice?: number
  stock: number
  images: { url: string; alt: string }[]
  seller: {
    businessName?: string
    user: { name: string }
  }
  category: { name: string }
  totalReviews: number
  avgRating?: number
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/marketplace-products'),
        fetch('/api/categories')
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData.products || [])
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando marketplace...</p>
      </div>
    )
  }

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
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">📂 Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Card key={category.slug} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">💡</div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🌟 Produtos Disponíveis</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center space-x-2">
                  <span>📦</span>
                  <span>Nenhum produto cadastrado ainda</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Seja o primeiro a cadastrar um produto!
                </p>
                <Link href="/vendedor">
                  <Button size="lg">
                    Cadastrar Produto
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}