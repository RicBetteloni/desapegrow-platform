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
  const [currentTip, setCurrentTip] = useState(0)

  // Dicas rotativas de cultivo
  const growTips = [
    {
      icon: '💧',
      title: 'Cuidado com Rega em Excesso',
      text: 'Excesso de água pode causar fungus gnats e apodrecimento das raízes. Deixe o substrato secar entre as regas!'
    },
    {
      icon: '🌡️',
      title: 'Controle de VPD',
      text: 'Ventilação correta garante um VPD ideal. Temperatura e umidade equilibradas = plantas saudáveis e melhor crescimento!'
    },
    {
      icon: '💡',
      title: 'Distância da Luz',
      text: 'LEDs muito próximos podem queimar as folhas. Mantenha 30-45cm de distância e ajuste conforme a fase de crescimento.'
    },
    {
      icon: '🌿',
      title: 'pH Ideal do Substrato',
      text: 'Mantenha o pH entre 6.0-7.0 para solo e 5.5-6.5 para hidro. pH incorreto bloqueia absorção de nutrientes!'
    },
    {
      icon: '🍃',
      title: 'Poda e Desfolha',
      text: 'Remova folhas amarelas e baixeiras para melhorar circulação de ar. Mas cuidado: não estresse demais a planta!'
    },
    {
      icon: '⏰',
      title: 'Fotoperíodo Correto',
      text: 'Vegetativo: 18h luz / 6h escuro. Floração: 12h luz / 12h escuro. Use timer para manter ciclo consistente!'
    },
    {
      icon: '🧪',
      title: 'EC e Nutrientes',
      text: 'Meça a EC da solução nutritiva! Excesso de nutrientes (EC alta) queima as pontas das folhas. Less is more!'
    },
    {
      icon: '🌬️',
      title: 'Circulação de Ar',
      text: 'Ventiladores oscilantes fortalecem os caules e previnem mofo. Ar parado = problemas futuros!'
    },
    {
      icon: '🔍',
      title: 'Inspeção Diária',
      text: 'Verifique diariamente por pragas, manchas nas folhas e sinais de estresse. Prevenção é melhor que tratamento!'
    },
    {
      icon: '📊',
      title: 'Anote Tudo',
      text: 'Mantenha um diário do cultivo: rega, nutrientes, pH, problemas. Isso ajuda a replicar sucessos e evitar erros!'
    }
  ]

  // Banners do carousel - Estilo OLX com imagens reais
  const banners = [
    {
      id: 1,
      title: 'Monte seu Grow',
      subtitle: 'Completo',
      description: 'Kit Grow Box com iluminação LED + exaustor',
      price: 'a partir de R$ 899',
      image: '/kit-dark-box-eco-120.jpg',
      bgColor: 'bg-gradient-to-br from-purple-600 to-purple-800',
      textColor: 'text-white',
      link: '/marketplace',
      badge: 'Economia de até 60%',
      imagePosition: 'right'
    },
    {
      id: 2,
      title: 'Iluminação LED',
      subtitle: 'Quantum Board',
      description: 'A melhor tecnologia para seu cultivo indoor',
      price: 'de R$ 2.499 por R$ 1.299',
      image: '/Iluminacao5.png',
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textColor: 'text-white',
      link: '/marketplace',
      badge: 'Frete Grátis',
      imagePosition: 'left'
    },
    {
      id: 3,
      title: 'Grow Tents',
      subtitle: 'Profissionais',
      description: 'Tendas refletivas de alta qualidade seminovas',
      price: 'a partir de R$ 349',
      image: '/tenda5.png',
      bgColor: 'bg-gradient-to-br from-green-600 to-emerald-700',
      textColor: 'text-white',
      link: '/marketplace',
      badge: 'Condição Impecável',
      imagePosition: 'right'
    },
    {
      id: 4,
      title: 'Exaustores',
      subtitle: 'Silenciosos',
      description: 'Controle perfeito de temperatura e odor',
      price: 'de R$ 899 por R$ 549',
      image: '/Exaustor1.png',
      bgColor: 'bg-gradient-to-br from-cyan-600 to-blue-700',
      textColor: 'text-white',
      link: '/marketplace',
      badge: '40% OFF',
      imagePosition: 'left'
    },
    {
      id: 5,
      title: 'Venda seu',
      subtitle: 'Equipamento',
      description: 'Anuncie grátis e venda rápido',
      price: 'Sem taxas abusivas',
      image: '/kit-3-vasos-feltro-27l-grow.png',
      bgColor: 'bg-gradient-to-br from-pink-600 to-rose-700',
      textColor: 'text-white',
      link: '/vendedor/produtos/novo',
      badge: '🎯 Milhares de compradores',
      imagePosition: 'right'
    },
    {
      id: 6,
      title: 'Anuncie Aqui',
      subtitle: 'Sua Marca',
      description: '100% público grower, alta taxa de conversão',
      price: 'Público altamente segmentado',
      image: null,
      bgColor: 'bg-gradient-to-br from-indigo-600 to-violet-700',
      textColor: 'text-white',
      link: '/vendedor/produtos/novo',
      badge: '🎯 Máxima Conversão',
      imagePosition: 'center',
      niches: ['Solo pronto', 'Consultoria', 'Elétrica', 'Impressão 3D', 'Fertilizantes', 'Camisetas', 'Grow Shop']
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
    const interval = setInterval(nextBanner, 8000)
    return () => clearInterval(interval)
  }, [])

  // Rotacionar dicas a cada visita (baseado em número aleatório salvo)
  useEffect(() => {
    const savedTipIndex = localStorage.getItem('currentTipIndex')
    if (savedTipIndex) {
      setCurrentTip(parseInt(savedTipIndex))
    } else {
      const randomIndex = Math.floor(Math.random() * growTips.length)
      setCurrentTip(randomIndex)
      localStorage.setItem('currentTipIndex', randomIndex.toString())
    }
  }, [])

  // Mudar para próxima dica na próxima visita
  useEffect(() => {
    const nextTipIndex = (currentTip + 1) % growTips.length
    localStorage.setItem('currentTipIndex', nextTipIndex.toString())
  }, [currentTip])

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 pb-12">
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
        <div className="max-w-6xl mx-auto mb-8 px-4">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-2xl group">
            {/* Banner atual */}
            <div className="relative h-auto min-h-[320px] md:h-80">
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
                    <div className={`w-full h-full ${banner.bgColor} cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden`}>
                      <div className={`h-full flex flex-col md:flex-row items-center ${
                        banner.image ? (banner.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse') : 'justify-center'
                      } gap-4 md:gap-8 px-4 md:px-16 py-6 md:py-8`}>
                        
                        {/* Conteúdo de Texto */}
                        <div className={`${banner.image ? 'flex-1' : 'max-w-3xl'} ${banner.textColor} z-10 text-center ${banner.image ? 'md:text-left' : ''}`}>
                          {/* Badge */}
                          <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-2">
                            {banner.badge}
                          </div>
                          
                          {/* Título */}
                          <h2 className="text-2xl md:text-4xl font-black mb-1 leading-tight">
                            {banner.title}
                          </h2>
                          
                          {/* Subtítulo */}
                          <h3 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 leading-tight opacity-80">
                            {banner.subtitle}
                          </h3>
                          
                          {/* Descrição */}
                          <p className="text-sm md:text-lg mb-2 opacity-90">
                            {banner.description}
                          </p>
                          
                          {/* Nichos (apenas para banner de anúncios) */}
                          {banner.niches && (
                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3 justify-center md:justify-start">
                              {banner.niches.map((niche, idx) => (
                                <span key={idx} className="bg-white/20 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-semibold border border-white/30">
                                  {niche}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Preço */}
                          <p className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-yellow-300">
                            {banner.price}
                          </p>
                          
                          {/* CTA */}
                          <Button size="sm" className="md:h-12 bg-white text-gray-900 hover:bg-yellow-300 hover:text-gray-900 font-bold px-5 md:px-6 py-4 md:py-5 shadow-2xl hover:scale-105 transition-all">
                            Ver ofertas
                          </Button>
                        </div>
                        
                        {/* Imagem do Produto (apenas se existir) - esconde em mobile */}
                        {banner.image && (
                          <div className="hidden md:flex flex-1 items-center justify-center z-10">
                            <div className="relative w-full max-w-xs aspect-square">
                              <img 
                                src={banner.image} 
                                alt={banner.title}
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                        )}
                        
                      </div>
                      
                      {/* Efeito de luz de fundo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Botões de navegação */}
            <button
              onClick={prevBanner}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-50 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-50 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
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

        {/* Publicidade Horizontal - Banner Consultoria Jurídica */}
        <div className="max-w-6xl mx-auto mb-8">
          <a 
            href="/deals/parceiros?ref=banner-juridico" 
            target="_blank"
            className="block hover:opacity-90 transition-opacity"
          >
            <img 
              src="/banners/ads/consultoria-juridica.svg" 
              alt="Consultoria Jurídica - Habeas Corpus para Cultivo"
              className="w-full rounded-lg shadow-sm"
            />
          </a>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product: Product) => {
                const pointsEarned = Math.floor(Number(product.price) * 0.05);
                const discountPercent = product.comparePrice
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;

                return (
                  <div 
                    key={product.id} 
                    className="group cursor-pointer"
                  >
                    {/* Imagem - aspect ratio quadrado forçado com object-cover */}
                    <Link href={`/produtos/${product.slug}`} className="block mb-3">
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-2xl">
                        <img
                          src={product.images?.[0]?.url || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Botão Favoritar */}
                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10 shadow-sm"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              isFavorite(product.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-600'
                            }`}
                          />
                        </button>

                        {/* Badge desconto (somente se houver) */}
                        {discountPercent > 0 && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-500 text-white text-xs font-semibold shadow-sm">
                              -{discountPercent}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Textos abaixo da imagem */}
                    <div className="flex flex-col gap-1">
                      {/* Nome do Produto */}
                      <Link href={`/produtos/${product.slug}`}>
                        <h3 className="font-normal text-sm line-clamp-2 text-gray-900 hover:text-gray-600 leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Preços - formato limpo sem centavos */}
                      <div className="flex items-baseline gap-2">
                        {product.comparePrice && (
                          <span className="text-xs text-gray-400 line-through">
                            R$ {Math.floor(Number(product.comparePrice))}
                          </span>
                        )}
                        <span className="text-xl font-semibold text-gray-900">
                          R$ {Math.floor(Number(product.price))}
                        </span>
                      </div>

                      {/* Metadata simples: Data e Localização */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>Hoje</span>
                        <span>•</span>
                        <span>São Paulo</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Publicidade */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              {/* Publicidade 1 - Consultoria Cultivo */}
              <a 
                href="/deals/parceiros?ref=banner-cultivo" 
                target="_blank"
                className="block hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/banners/ads/consultoria-cultivo.svg" 
                  alt="Consultoria de Cultivo Indoor com Professor"
                  className="w-full rounded-lg shadow-sm"
                />
              </a>

              {/* Publicidade 2 - Elétrica Grow */}
              <a 
                href="/deals/parceiros?ref=banner-eletrica" 
                target="_blank"
                className="block hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/banners/ads/eletrica-grow.svg" 
                  alt="Instalação Elétrica para Grow Room"
                  className="w-full rounded-lg shadow-sm"
                />
              </a>

              {/* Dicas / Call to Action */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl flex-shrink-0">{growTips[currentTip].icon}</span>
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">{growTips[currentTip].title}</h3>
                      <p className="text-xs text-gray-500">Dica {currentTip + 1} de {growTips.length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-800 leading-relaxed">
                    {growTips[currentTip].text}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setCurrentTip((currentTip + 1) % growTips.length)}
                  >
                    Próxima Dica →
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
