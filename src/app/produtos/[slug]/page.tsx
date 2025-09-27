'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ArrowLeft, Star, Heart, ShoppingCart, Zap } from 'lucide-react'
import { useCart } from '../../../hooks/useCart'
import { useFavorites } from '../../../hooks/useFavorites'
import { cn } from '../../../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'


interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  images: { url: string; alt?: string }[]
  seller: {
    businessName?: string
    user: { name: string }
  }
  category: { name: string }
  totalReviews: number
  avgRating?: number
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviews] = useState([
        {
            id: '1',
            rating: 5,
            title: 'Excelente produto!',
            content: 'LED de ótima qualidade, chegou super rápido e bem embalado. As plantas já estão respondendo muito bem à nova iluminação. Recomendo demais!',
            createdAt: '2024-01-15T10:30:00Z',
            user: {
            name: 'Maria Silva',
            avatar: ''
            },
            pointsAwarded: true
        },
        {
            id: '2', 
            rating: 4,
            title: 'Muito bom custo-benefício',
            content: 'Para o preço, está muito bom. A qualidade da luz é boa e consumo é baixo mesmo. Só achei que podia ter vindo com mais acessórios.',
            createdAt: '2024-01-10T15:45:00Z',
            user: {
            name: 'João Costa',
            avatar: ''
            },
            pointsAwarded: true
        },
        {
            id: '3',
            rating: 5,
            title: 'Superou minhas expectativas',
            content: 'Estava com receio de comprar, mas valeu muito a pena. Meu grow melhorou 100% com esse LED. Plantas mais verdes e crescendo mais rápido.',
            createdAt: '2024-01-08T09:20:00Z',
            user: {
            name: 'Pedro Oliveira',
            avatar: ''
            },
            pointsAwarded: true
        }
    ])
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorited } = useFavorites()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.slug) {
        setError('Slug do produto não encontrado')
        setLoading(false)
        return
      }

      try {
        console.log('Buscando produto:', params.slug)
        
        const response = await fetch(`/api/marketplace-products/${params.slug}`)
        
        if (!response.ok) {
          console.error('Erro na resposta:', response.status, response.statusText)
          setError(`Produto não encontrado (${response.status})`)
          return
        }

        const data = await response.json()
        console.log('Produto encontrado:', data)
        
        if (data.product) {
          setProduct(data.product)
        } else {
          setError('Dados do produto não encontrados')
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error)
        setError('Erro ao carregar produto')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.slug])

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
          <div className="container mx-auto">
            <Link href="/marketplace">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Marketplace
              </Button>
            </Link>
          </div>
        </nav>
        <div className="container mx-auto p-6 text-center">
          <div className="text-2xl">🌱</div>
          <p>Carregando produto...</p>
        </div>
      </div>
    )
  }

  // Mostrar erro
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
          <div className="container mx-auto">
            <Link href="/marketplace">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Marketplace
              </Button>
            </Link>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">😵</div>
              <h2 className="text-xl font-bold mb-2">Produto não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                {error || 'O produto que você está procurando não existe.'}
              </p>
              <Link href="/marketplace">
                <Button>Ver outros produtos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const pointsEarned = Math.floor(product.price * quantity * 0.05)
  const favorited = isFavorited(product.id)
  const mainImage = product.images[selectedImageIndex] || product.images[0]

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto">
          <Link href="/marketplace">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Marketplace
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <Image
                src={mainImage?.url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'}
                alt={mainImage?.alt || product.name}
                fill
                className="object-cover"
              />
              
              {/* Badges na Imagem */}
              <div className="absolute top-4 left-4 space-y-2">
                {discountPercent > 0 && (
                  <Badge variant="destructive">
                    -{discountPercent}%
                  </Badge>
                )}
                {product.stock < 5 && product.stock > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Últimas {product.stock} unidades
                  </Badge>
                )}
              </div>

              {/* Botão de Favorito */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute top-4 right-4 h-10 w-10 rounded-full',
                  favorited 
                    ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                    : 'bg-white/80 hover:bg-white text-gray-600'
                )}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart className={cn('h-5 w-5', favorited && 'fill-current')} />
              </Button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 relative rounded border-2 overflow-hidden',
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Header do Produto */}
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              {product.avgRating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(product.avgRating!) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.avgRating.toFixed(1)} ({product.totalReviews} avaliações)
                  </span>
                </div>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-green-600">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {product.comparePrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              {/* Pontos que serão ganhos */}
              <div className="flex items-center space-x-2 text-green-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm">
                  Ganhe {pointsEarned} CultivoCoins nesta compra
                </span>
              </div>
            </div>

            {/* Seleção de Quantidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade:</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">
                  ({product.stock} disponíveis)
                </span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              
              <Button variant="outline" size="lg" className="w-full">
                Comprar Agora
              </Button>
            </div>

            {/* Informações do Vendedor */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Vendido por:</h3>
                <p className="text-sm">
                  {product.seller.businessName || product.seller.user.name}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção de Detalhes com Abas */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações ({product.totalReviews})</TabsTrigger>
            <TabsTrigger value="seller">Vendedor</TabsTrigger>
          </TabsList>

          {/* Aba Descrição */}
          <TabsContent value="description">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Descrição do Produto</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Reviews */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Resumo das Avaliações */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Rating Médio */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="text-4xl font-bold text-green-600">
                          {product.avgRating?.toFixed(1)}
                        </div>
                        <div>
                          <div className="flex justify-center mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  product.avgRating && star <= Math.round(product.avgRating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.totalReviews} avaliações
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Distribuição de Estrelas */}
                    <div>
                      <h4 className="font-semibold mb-3">Distribuição</h4>
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = rating === 5 ? 15 : rating === 4 ? 6 : rating === 3 ? 2 : 0
                        const percentage = (count / product.totalReviews) * 100
                        
                        return (
                          <div key={rating} className="flex items-center space-x-3 text-sm mb-1">
                            <span className="w-3">{rating}</span>
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-6 text-muted-foreground">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Reviews */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      {/* Header do Review */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{review.user.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        {review.pointsAwarded && (
                          <Badge className="bg-green-100 text-green-800">
                            +10 pontos 🪙
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* Título e Conteúdo */}
                      {review.title && (
                        <h5 className="font-semibold mb-2">{review.title}</h5>
                      )}

                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {review.content}
                      </p>

                      {/* Badge Verificado */}
                      <div className="flex items-center space-x-2 pt-3 border-t">
                        <Badge variant="outline" className="text-xs">
                          ✅ Compra verificada
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action para Avaliar */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">
                        🎁 Ganhe 50 CultivoCoins
                      </h4>
                      <p className="text-sm text-green-700">
                        Avalie este produto e ganhe pontos!
                      </p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Avaliar Produto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Vendedor */}
          <TabsContent value="seller">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Informações do Vendedor</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      {product.seller.businessName || product.seller.user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Vendedor verificado
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="font-bold text-green-600">98%</div>
                      <div className="text-xs text-muted-foreground">Avaliações Positivas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">2.3k</div>
                      <div className="text-xs text-muted-foreground">Produtos Vendidos</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">3 anos</div>
                      <div className="text-xs text-muted-foreground">No Marketplace</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Ver Mais Produtos deste Vendedor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}