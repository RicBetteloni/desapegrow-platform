'use client'
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
  AlertCircle
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
        image: product.images[0]?.url || '/placeholder.png'
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    alert('✅ Produto adicionado ao carrinho!')
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">🏪 Marketplace</h1>

          {/* Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className="whitespace-nowrap"
            >
              Todas
            </Button>
            {categories.map((cat: Category) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.slug)}
                className="whitespace-nowrap"
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Produtos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: Product) => (
              <Card 
                key={product.id} 
                className="hover:shadow-lg transition-shadow group overflow-hidden relative"
              >
                {/* Imagem */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.images[0]?.url || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 right-2 space-y-1">
                    {product.comparePrice && product.comparePrice > product.price && (
                      <Badge className="bg-red-500 text-white block text-xs">
                        -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </Badge>
                    )}
                    
                    {product.stock === 0 && (
                      <Badge className="bg-red-600 text-white block text-xs">
                        Sem Estoque
                      </Badge>
                    )}
                    
                    {product.stock > 0 && product.stock <= 5 && (
                      <Badge className="bg-orange-500 text-white block text-xs">
                        Últimas {product.stock}!
                      </Badge>
                    )}
                  </div>

                  {/* Overlay sem estoque */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-white text-center">
                        <AlertCircle className="w-8 h-8 mx-auto mb-1" />
                        <p className="font-semibold text-sm">Indisponível</p>
                      </div>
                    </div>
                  )}

                  {/* Link para detalhes */}
                  <Link 
                    href={`/produtos/${product.slug}`}
                    className="absolute inset-0"
                  />
                </div>

                <CardContent className="p-3 space-y-2">
                  {/* Categoria */}
                  <Badge variant="secondary" className="text-xs">
                    {product.category.icon} {product.category.name}
                  </Badge>

                  {/* Nome */}
                  <Link href={`/produtos/${product.slug}`}>
                    <h3 className="font-semibold text-sm line-clamp-2 hover:text-green-700">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Avaliação */}
                  {product.totalReviews > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{product.avgRating?.toFixed(1)}</span>
                      <span className="text-gray-500">({product.totalReviews})</span>
                    </div>
                  )}

                  {/* Preço */}
                  <div>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <p className="text-xs text-gray-500 line-through">
                        R$ {product.comparePrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-lg font-bold text-green-600">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Botão */}
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full text-sm"
                  >
                    {product.stock === 0 ? (
                      'Sem Estoque'
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Adicionar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* BOTÕES DE NAVEGAÇÃO - NOVO */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/vendedor/meus-anuncios">
            <Button className="w-full sm:w-auto">📦 Meus Anúncios</Button>
          </Link>
          <Link href="/carrinho">
            <Button variant="outline" className="w-full sm:w-auto">🛒 Meu Carrinho</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
