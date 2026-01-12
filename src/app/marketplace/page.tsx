'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  AlertCircle,
  Heart,
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
  subcategories?: Category[]
  _count?: {
    products: number
  }
}

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

function MarketplaceContent() {
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

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

  // Banners do carousel - Design limpo e profissional
  const banners = [
    {
      id: 1,
      title: 'Equipamentos Seminovos',
      subtitle: 'Até 60% mais barato',
      description: 'Encontre kits completos, iluminação LED e muito mais',
      price: 'a partir de R$ 299',
      image: '/kit-dark-box-eco-120.jpg',
      bgColor: 'bg-gradient-to-br from-[#2F5F39] to-[#3A7347]',
      textColor: 'text-white',
      link: '/marketplace',
      badge: 'Economia Real',
      imagePosition: 'right'
    },
    {
      id: 2,
      title: 'Venda Rápido',
      subtitle: 'Anuncie Grátis',
      description: 'Milhares de compradores procurando equipamentos',
      price: 'Sem taxas abusivas',
      image: null,
      bgColor: 'bg-gradient-to-br from-[#E5A12A] to-[#F5B13A]',
      textColor: 'text-white',
      link: '/vendedor/produtos/novo',
      badge: 'Destaque Seu Anúncio',
      imagePosition: null
    },
    {
      id: 3,
      title: 'Iluminação LED',
      subtitle: 'Quantum Board',
      description: 'Tecnologia de ponta com preços acessíveis',
      price: 'de R$ 2.499 por R$ 1.299',
      image: '/tenda2.jpg',
      bgColor: 'bg-gradient-to-br from-[#2F5F39] to-[#3A7347]',
      textColor: 'text-white',
      link: '/marketplace',
      badge: 'Frete Grátis',
      imagePosition: 'right'
    },
    {
      id: 6,
      title: 'Anuncie Aqui',
      subtitle: 'Sua Marca',
      description: '100% público grower • Alta taxa de conversão',
      price: 'Público altamente segmentado',
      image: null,
      bgColor: 'bg-gradient-to-br from-indigo-600 to-violet-700',
      textColor: 'text-white',
      link: '/vendedor/produtos/novo',
      badge: '🎯 Publicidade Segmentada',
      imagePosition: null,
      niches: ['Solo pronto', 'Consultoria', 'Elétrica', 'Impressão 3D', 'Fertilizantes', 'Camisetas', 'Grow Shop']
    }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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


  const clearCategories = () => {
    setSelectedCategories([])
    setExpandedCategory(null)
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

  // Distância mínima de swipe (em pixels)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextBanner()
    } else if (isRightSwipe) {
      prevBanner()
    }
  }

  // Auto-advance carousel - reinicia quando currentBanner muda (navegação manual)
  useEffect(() => {
    const interval = setInterval(nextBanner, 8000)
    return () => clearInterval(interval)
  }, [currentBanner]) // Reinicia o timer quando muda de banner

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
    <div className="bg-[#FAF9F6] min-h-screen pb-12">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Badge de Conta Verificada */}
        {session?.user && (
          <div className="mb-6">
            <Card className="border-[#E9EDE7] bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,.04)]">
              <CardContent className="p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2F5F39] flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-[#1F1F1F] text-sm">
                    Sua conta está verificada
                  </p>
                  <p className="text-xs text-[#6E6E6E]">
                    A verificação fortalece a confiança na comunidade
                  </p>
                </div>
                <Badge className="bg-[#2F5F39] text-white text-xs rounded-full">✓ Verificado</Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Banner Carousel */}
        <div className="max-w-6xl mx-auto mb-8 px-4">
          <div 
            className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-2xl group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
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
                      <div className={`h-full flex flex-col items-center ${
                        banner.image 
                          ? (banner.imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row')
                          : 'justify-center'
                      } gap-4 md:gap-8 px-6 md:px-16 py-6 md:py-8`}>
                        
                        {/* Conteúdo de Texto */}
                        <div className={`${banner.image ? 'flex-1 max-w-xl' : 'max-w-2xl'} ${banner.textColor} z-10 text-center ${banner.image ? 'md:text-left' : ''}`}>
                          {/* Badge */}
                          <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-3">
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
                            <div className="flex flex-nowrap gap-2 md:gap-2 mb-3 md:mb-4 justify-center md:justify-start overflow-x-auto scrollbar-hide px-2">
                              {banner.niches.map((niche, idx) => (
                                <span key={`niche-${index}-${idx}-${niche}`} className="bg-white/30 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold border-2 border-white/50 shadow-lg whitespace-nowrap flex-shrink-0">
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
                          <Button size="sm" className="h-8 md:h-10 bg-white text-gray-900 hover:bg-yellow-300 hover:text-gray-900 font-bold px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm shadow-2xl hover:scale-105 transition-all">
                            Ver ofertas
                          </Button>
                        </div>
                        
                        {/* Imagem do Produto (apenas se existir) - esconde em mobile */}
                        {banner.image && (
                          <div className="hidden md:flex flex-1 items-center justify-center z-10">
                            <div className="relative w-full max-w-md aspect-square">
                              <Image 
                                src={banner.image} 
                                alt={banner.title}
                                fill
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 0vw, 400px"
                                priority={index === currentBanner}
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

            {/* Botões de navegação - Sempre visíveis em mobile, aparecem no hover em desktop */}
            <button
              onClick={prevBanner}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-50 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-50 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((banner, index) => (
                <button
                  key={`indicator-${index}-${banner.title}`}
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
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base bg-white border-[#E9EDE7] rounded-xl focus:border-[#2F5F39] focus:ring-[#2F5F39]"
              />
            </div>
            <Button type="submit" size="lg" className="px-8 h-12 bg-[#2F5F39] hover:bg-[#3A7347] rounded-xl font-semibold">
              Buscar
            </Button>
          </form>
        </div>

        {/* Categorias */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1F1F1F]">📂 Categorias</h2>
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
            {/* Grid 5 colunas em desktop, 3 no tablet, 2 no mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
              {/* Botão TODOS */}
              <button 
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  selectedCategories.length === 0 
                    ? 'border-green-600 bg-green-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-sm'
                }`}
                onClick={clearCategories}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className="text-xl opacity-60">📦</div>
                  <span className="font-semibold text-sm text-gray-900">Todos</span>
                </div>
              </button>

              {/* Categorias Principais */}
              {categories.map((cat: Category) => {
                const isSelected = selectedCategories.includes(cat.slug)
                const isExpanded = expandedCategory === cat.slug
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0
                
                return (
                  <button 
                    key={cat.id} 
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-green-600 bg-green-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      // Se clicar em categoria já selecionada, remove seleção
                      if (isSelected) {
                        setSelectedCategories(prev => prev.filter(c => c !== cat.slug))
                        setExpandedCategory(null)
                      } else {
                        // Se nenhuma está selecionada, seleciona esta e expande
                        if (selectedCategories.length === 0) {
                          setSelectedCategories([cat.slug])
                          if (hasSubcategories) {
                            setExpandedCategory(cat.slug)
                          }
                        } else {
                          // Se já tem outras selecionadas, apenas adiciona (multi-select)
                          setSelectedCategories(prev => [...prev, cat.slug])
                          // Mas não expande (para não poluir com múltiplas subcategorias)
                          setExpandedCategory(null)
                        }
                      }
                    }}
                  >
                    <div className="p-4 flex items-center gap-3">
                      <div className="text-xl opacity-60">{cat.icon}</div>
                      <span className="font-semibold text-sm text-gray-900 text-left line-clamp-2">{cat.name}</span>
                      {hasSubcategories && (
                        <ChevronRight 
                          className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Subcategorias (aparecem quando UMA categoria principal está selecionada OU quando múltiplas subcategorias da mesma categoria) */}
            {expandedCategory && categories.find(c => c.slug === expandedCategory)?.subcategories && (
              <div className="mt-4 max-w-6xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-600">
                      Refinar por subcategoria:
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {categories.find(c => c.slug === expandedCategory)?.subcategories?.length} opções
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .find(c => c.slug === expandedCategory)
                      ?.subcategories?.map((subcat: Category) => {
                        const isSelected = selectedCategories.includes(subcat.slug)
                        const productCount = subcat._count?.products || 0
                        return (
                          <button
                            key={subcat.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              // Quando clica em subcategoria:
                              if (isSelected) {
                                // Se já está selecionada, remove ela
                                const newCategories = selectedCategories.filter(c => c !== subcat.slug)
                                // Se não sobrou nenhuma, volta para a categoria pai
                                setSelectedCategories(newCategories.length > 0 ? newCategories : [expandedCategory!])
                              } else {
                                // Se não está, adiciona (permite múltiplas subcategorias)
                                // Remove categoria pai se estiver no filtro
                                const withoutParent = selectedCategories.filter(c => c !== expandedCategory)
                                setSelectedCategories([...withoutParent, subcat.slug])
                              }
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-green-600 text-white shadow-sm'
                                : productCount > 0
                                  ? 'bg-white border border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50'
                                  : 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                            disabled={productCount === 0 && !isSelected}
                          >
                            <span className="text-base">{subcat.icon}</span>
                            <span>{subcat.name}</span>
                            {productCount > 0 && (
                              <Badge 
                                variant={isSelected ? "secondary" : "default"} 
                                className={`ml-1 text-xs ${isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}
                              >
                                {productCount}
                              </Badge>
                            )}
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem quando múltiplas CATEGORIAS PRINCIPAIS selecionadas */}
            {selectedCategories.length > 1 && !expandedCategory && (
              <div className="mt-4 max-w-6xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                  <p className="text-sm text-blue-700">
                    💡 <strong>{selectedCategories.length} categorias principais</strong> selecionadas. Mostrando todos os produtos. 
                    <button 
                      onClick={clearCategories}
                      className="ml-2 underline font-semibold hover:text-blue-900"
                    >
                      Limpar filtros
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Mensagem quando múltiplas SUBCATEGORIAS selecionadas */}
            {selectedCategories.length > 1 && expandedCategory && (
              <div className="mt-4 max-w-6xl mx-auto">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  <p className="text-sm text-green-700">
                    🔍 Filtrando por <strong>{selectedCategories.length} subcategorias</strong>. 
                    <button 
                      onClick={() => {
                        setSelectedCategories([expandedCategory!])
                      }}
                      className="ml-2 underline font-semibold hover:text-green-900"
                    >
                      Ver todas de {categories.find(c => c.slug === expandedCategory)?.name}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Banner Espaço Publicitário - Aparece ANTES dos produtos */}
        <div className="max-w-6xl mx-auto mb-8 px-4">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl border-2 border-dashed border-gray-300 p-8 md:p-10 shadow-sm relative">
            <div className="text-center">
              <div className="text-4xl mb-2">📢</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Espaço Publicitário</h3>
              <p className="text-sm text-gray-500">728×90 • Entre em contato para anunciar</p>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1F1F1F]">🌿 Produtos Disponíveis</h2>
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
                  {products.map((product: Product, index: number) => {
                const pointsEarned = Math.floor(Number(product.price) * 0.05);
                const discountPercent = product.comparePrice
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;

                return (
                  <>
                    <div 
                      key={product.id} 
                      className="group cursor-pointer"
                    >
                    {/* Imagem - aspect ratio quadrado forçado com object-cover */}
                    <Link href={`/produtos/${product.slug}`} className="block mb-3">
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,.04)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,.08)] transition-shadow">
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
                            <Badge className="bg-[#E5A12A] text-white text-xs font-bold shadow-lg rounded-full px-3">
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
                        <h3 className="font-medium text-sm line-clamp-2 text-[#1F1F1F] hover:text-[#2F5F39] leading-tight transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Preços - formato limpo sem centavos */}
                      <div className="flex items-baseline gap-2">
                        {product.comparePrice && (
                          <span className="text-xs text-[#6E6E6E] line-through">
                            R$ {Math.floor(Number(product.comparePrice))}
                          </span>
                        )}
                        <span className="text-xl font-bold text-[#2F5F39]">
                          R$ {Math.floor(Number(product.price))}
                        </span>
                      </div>

                      {/* Metadata simples: Data e Localização */}
                      <div className="flex items-center gap-1.5 text-xs text-[#6E6E6E]">
                        <span>Hoje</span>
                        <span>•</span>
                        <span>São Paulo</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Publicidade - Aparece após o 8º produto */}
                  {index === 7 && (
                    <div className="col-span-2 sm:col-span-3 xl:col-span-4">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl border-2 border-dashed border-gray-300 p-8 md:p-10 shadow-sm relative min-h-[200px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📢</div>
                          <h3 className="text-xl font-bold text-gray-600 mb-2">Espaço Publicitário</h3>
                          <p className="text-sm text-gray-500">Entre em contato para anunciar</p>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
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
              <Card className="bg-white border-[#E9EDE7] shadow-[0_12px_28px_rgba(0,0,0,.05)] rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl flex-shrink-0">{growTips[currentTip].icon}</span>
                    <div>
                      <h3 className="font-bold text-[#1F1F1F] mb-1">{growTips[currentTip].title}</h3>
                      <p className="text-xs text-[#6E6E6E]">Dica {currentTip + 1} de {growTips.length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#6E6E6E] leading-relaxed">
                    {growTips[currentTip].text}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full mt-4 bg-[#2F5F39] hover:bg-[#3A7347] rounded-xl"
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
export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando marketplace...</p>
        </div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  )
}