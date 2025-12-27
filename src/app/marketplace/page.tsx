'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingCart, 
  Search, 
  Star,
  AlertCircle,
  Heart,
  TrendingUp
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  status: string
  images: Array<{ url: string; alt: string | null }>
  avgRating: number | null
  totalReviews: number
  category: {
    name: string
    icon: string
  }
  seller: {
    id: string
    user: {
      name: string
    }
  }
}

interface Category {
  id: string
  slug: string
  name: string
  icon: string
}

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function MarketplacePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      alert('Este produto está sem estoque!')
      return
    }

    const currentCart = localStorage.getItem('cart')
    const cart: CartItem[] = currentCart ? JSON.parse(currentCart) : []

    const existingItemIndex = cart.findIndex((item: CartItem) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url || '/placeholder.png'
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    alert('✅ Produto adicionado ao carrinho!')
  }

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const index = favorites.indexOf(productId)
    
    if (index >= 0) {
      favorites.splice(index, 1)
      alert('❌ Removido dos favoritos')
    } else {
      favorites.push(productId)
      alert('❤️ Adicionado aos favoritos!')
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }

  const isFavorite = (productId: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    return favorites.includes(productId)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams()
    if (search) newParams.append('q', search)
    if (selectedCategory) newParams.append('category', selectedCategory)
    router.push(`/marketplace?${newParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🛒 Marketplace</h1>
          <p className="text-gray-600 text-lg">
            Descubra equipamentos incríveis e ganhe pontos a cada compra!
          </p>
        </div>

        {/* Busca */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button type="submit" size="lg" className="px-8">
              Buscar
            </Button>
          </form>
        </div>

        {/* Categorias */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">📂 Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat: Category) => (
                <Card 
                  key={cat.id} 
                  className="hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Produtos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🌿 Produtos Disponíveis</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">Nenhum produto encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => {
                const pointsEarned = Math.floor(Number(product.price) * 0.05);
                const discountPercent = product.comparePrice
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;

                return (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col border-2 border-transparent hover:border-green-200"
                  >
                    {/* Imagem - altura fixa com object-contain para manter proporção */}
                    <div className="relative h-64 bg-white overflow-hidden border-b">
                      <Link href={`/produtos/${product.slug}`} className="block h-full">
                        <img
                          src={product.images?.[0]?.url || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      {/* Botão Favoritar */}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                      >
                        <Heart 
                          className={`h-5 w-5 ${
                            isFavorite(product.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`}
                        />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {/* Badge Mais Vendido (exemplo - pode ser baseado em vendas reais) */}
                        {product.totalReviews > 10 && (
                          <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold shadow-md flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Popular
                          </Badge>
                        )}
                        {discountPercent > 0 && (
                          <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-md">
                            -{discountPercent}%
                          </Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge className="bg-gray-500 text-white text-xs font-semibold shadow-md">
                            Esgotado
                          </Badge>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md animate-pulse">
                            Só {product.stock}!
                          </Badge>
                        )}
                      </div>

                      {/* Badge Frete Grátis (exemplo - pode ser baseado em regra de negócio) */}
                      {product.price >= 100 && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <Badge className="bg-green-600 text-white text-xs font-semibold shadow-md w-full justify-center">
                            🚚 Frete Grátis
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col">
                      {/* Nome do Produto */}
                      <Link href={`/produtos/${product.slug}`} className="block mb-2">
                        <h3 className="font-semibold text-base line-clamp-2 hover:text-green-600 transition-colors min-h-[48px] leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Avaliação com Estrelas */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                product.avgRating && star <= Math.round(product.avgRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.totalReviews})
                        </span>
                      </div>

                      {/* Preços */}
                      <div className="mb-3">
                        {product.comparePrice && (
                          <div className="text-xs text-gray-500 line-through mb-1">
                            R$ {Number(product.comparePrice).toFixed(2).replace('.', ',')}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">
                          R$ {Number(product.price).toFixed(2).replace('.', ',')}
                        </div>
                        {/* Parcelamento */}
                        <div className="text-xs text-gray-600 mt-1">
                          ou 3x de R$ {(Number(product.price) / 3).toFixed(2).replace('.', ',')} sem juros
                        </div>
                      </div>

                      {/* CultivoCoins */}
                      {pointsEarned > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-full px-3 py-1.5 mb-4 w-fit">
                          <span className="text-sm">⚡</span>
                          <span>+{pointsEarned} CultivoCoins</span>
                        </div>
                      )}

                      {/* Espaçador flex */}
                      <div className="flex-1"></div>

                      {/* Botão Adicionar ao Carrinho */}
                      <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock === 0 ? 'Indisponível' : 'Adicionar'}
                      </Button>

                      {/* Vendedor */}
                      <p className="text-xs text-gray-500 text-center mt-3">
                        Vendido por <span className="font-medium">{product.seller?.user?.name || 'Vendedor'}</span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
