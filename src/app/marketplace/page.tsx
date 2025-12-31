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
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useSession } from 'next-auth/react'

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
    slug: string
  }
  seller: {
    id: string
    user: {
      name: string
      isEmailVerified?: boolean
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
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)

  // Banners do carousel
  const banners = [
    {
      id: 1,
      title: 'Grow Shop Sustentável 🌱',
      subtitle: 'Equipamentos de cultivo seminovos com até 60% OFF - Qualidade garantida',
      image: '/banners/grow-shop.jpg',
      bgColor: 'from-emerald-600 via-green-600 to-teal-600',
      link: '/marketplace?category=grow'
    },
    {
      id: 2,
      title: 'Desapegue & Ganhe Grows ♻️',
      subtitle: 'Venda seu equipamento usado e acumule moedas virtuais para cultivar',
      image: '/banners/desapegue-grows.jpg',
      bgColor: 'from-purple-600 via-indigo-600 to-blue-600',
      link: '/vendedor/produtos/novo'
    },
    {
      id: 3,
      title: 'LED, Ventilação & Mais 💡',
      subtitle: 'Monte seu grow room completo com economia e consciência ambiental',
      image: '/banners/equipamentos.jpg',
      bgColor: 'from-amber-600 via-orange-600 to-red-600',
      link: '/marketplace'
    },
    {
      id: 4,
      title: 'Cultivo Consciente 🌍',
      subtitle: 'Reutilize, economize e contribua para um planeta mais verde',
      image: '/banners/sustentavel.jpg',
      bgColor: 'from-lime-600 via-green-700 to-emerald-700',
      link: '/marketplace?destaque=sustentavel'
    }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, selectedCategories])

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

      // Se nenhuma categoria selecionada, buscar tudo
      // Se uma categoria, buscar só ela
      // Se múltiplas, buscar todas e juntar resultados
      if (selectedCategories.length === 0) {
        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()
        setProducts(data.products || [])
      } else if (selectedCategories.length === 1) {
        params.append('category', selectedCategories[0])
        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        // Múltiplas categorias - buscar cada uma e combinar
        const allProducts: Product[] = []
        const productIds = new Set<string>()
        
        for (const category of selectedCategories) {
          const categoryParams = new URLSearchParams(params)
          categoryParams.append('category', category)
          const response = await fetch(`/api/products?${categoryParams}`)
          const data = await response.json()
          
          // Adicionar produtos únicos (evitar duplicatas)
          data.products?.forEach((product: Product) => {
            if (!productIds.has(product.id)) {
              productIds.add(product.id)
              allProducts.push(product)
            }
          })
        }
        
        setProducts(allProducts)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(c => c !== categorySlug)
      } else {
        return [...prev, categorySlug]
      }
    })
  }

  const clearCategories = () => {
    setSelectedCategories([])
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
    if (selectedCategories.length > 0) {
      newParams.append('category', selectedCategories[0])
    }
    router.push(`/marketplace?${newParams.toString()}`)
  }

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextBanner, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Badge de Conta Verificada */}
        {session?.user && (
          <div className="mb-6 max-w-4xl mx-auto">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">
                    Sua conta está verificada, isso fortalece a confiança.
                  </p>
                  <p className="text-sm text-green-700">
                    A verificação de identidade ajuda a manter o ambiente seguro para todos.
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">✓ Verificado</Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Banner Carousel */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
            {/* Banner atual */}
            <div className="relative h-64 md:h-80">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentBanner 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentBanner 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  <Link href={banner.link}>
                    <div className={`w-full h-full bg-gradient-to-r ${banner.bgColor} flex items-center justify-between px-12 cursor-pointer hover:scale-[1.02] transition-transform`}>
                      <div className="text-white max-w-xl z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                          {banner.title}
                        </h2>
                        <p className="text-xl md:text-2xl drop-shadow-md">
                          {banner.subtitle}
                        </p>
                        <Button size="lg" className="mt-6 bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                          Ver Ofertas
                        </Button>
                      </div>
                      {/* Placeholder para imagem/ilustração */}
                      <div className="hidden md:block text-8xl opacity-50">
                        🌿
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Botões de navegação */}
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBanner 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">📂 Filtrar por Categoria</h2>
              {selectedCategories.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearCategories}
                  className="text-red-600 hover:text-red-700"
                >
                  Limpar filtros ({selectedCategories.length})
                </Button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
              {/* Botão TODOS */}
              <Card 
                className={`hover:shadow-md transition-all cursor-pointer ${
                  selectedCategories.length === 0 
                    ? 'ring-2 ring-green-500 bg-green-50' 
                    : 'hover:border-green-200'
                }`}
                onClick={clearCategories}
              >
                <CardContent className="p-3 text-center min-w-[110px]">
                  <div className="text-2xl mb-1">📦</div>
                  <h3 className="font-medium text-xs">Todos</h3>
                </CardContent>
              </Card>

              {/* Categorias */}
              {categories.map((cat: Category) => {
                const isSelected = selectedCategories.includes(cat.slug)
                return (
                  <Card 
                    key={cat.id} 
                    className={`hover:shadow-md transition-all cursor-pointer ${
                      isSelected 
                        ? 'ring-2 ring-green-500 bg-green-50' 
                        : 'hover:border-green-200'
                    }`}
                    onClick={() => toggleCategory(cat.slug)}
                  >
                    <CardContent className="p-3 text-center min-w-[110px]">
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <h3 className="font-medium text-xs line-clamp-2">{cat.name}</h3>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Publicidade Horizontal */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 font-medium">📢 Espaço Publicitário 728x90</p>
              <p className="text-xs text-gray-400 mt-1">Banner horizontal - Anuncie aqui</p>
            </CardContent>
          </Card>
        </div>

        {/* Produtos */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🌿 Produtos Disponíveis</h2>
            {/* Espaço para filtros adicionais */}
          </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Coluna principal - Produtos */}
              <div className="lg:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      {/* Breadcrumb - Categoria */}
                      <div className="mb-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCategory(product.category.slug)
                          }}
                        >
                          {product.category.icon} {product.category.name}
                        </Badge>
                      </div>

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
                      <div className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                        <span>Vendido por</span>
                        <span className="font-medium">{product.seller?.user?.name || 'Vendedor'}</span>
                        {product.seller?.user?.isEmailVerified && (
                          <ShieldCheck className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Publicidade */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              {/* Publicidade 1 */}
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 font-medium">📢 Publicidade</p>
                  <p className="text-xs text-gray-400 mt-1">300x250</p>
                  <div className="h-48 flex items-center justify-center text-gray-300 text-4xl mt-2">
                    🌱
                  </div>
                </CardContent>
              </Card>

              {/* Publicidade 2 */}
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 font-medium">📢 Publicidade</p>
                  <p className="text-xs text-gray-400 mt-1">300x250</p>
                  <div className="h-48 flex items-center justify-center text-gray-300 text-4xl mt-2">
                    🎯
                  </div>
                </CardContent>
              </Card>

              {/* Dicas / Call to Action */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-green-900 mb-2">💡 Dica do Dia</h3>
                  <p className="text-sm text-green-800">
                    Ganhe CultivoCoins a cada compra e troque por descontos exclusivos!
                  </p>
                  <Button size="sm" className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    Saiba Mais
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  )
}
