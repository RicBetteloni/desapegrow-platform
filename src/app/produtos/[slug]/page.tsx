'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react'
import { ReviewDisplay } from '../../../components/reviews/ReviewList'
import { ReviewForm } from '../../../components/reviews/ReviewForm'
import Image from 'next/image'
import { cn } from '../../../lib/utils'
import { useCart } from '../../../hooks/useCart'
import { useFavorites } from '../../../hooks/useFavorites'

interface Product {
  id: string
  name: string
  description: string
  shortDesc?: string
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

// Mock de reviews para demonstração
const mockReviews = [
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
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', caption: '' }],
    helpfulScore: 12,
    isVerifiedPurchase: true,
    viewCount: 150,
    reputation: {
      level: 'EXPERT',
      totalScore: 1200,
      badges: [{ name: 'Expert em Iluminação', icon: '💡', level: 'GOLD' }]
    },
    replies: []
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
    images: [],
    helpfulScore: 5,
    isVerifiedPurchase: true,
    viewCount: 80,
    reputation: {
      level: 'CONTRIBUTOR',
      totalScore: 450,
      badges: []
    },
    replies: [{
      id: 'r1',
      content: 'Olá João, obrigado pelo feedback! A sua sugestão sobre os acessórios já foi repassada para nossa equipe de produtos.',
      isSellerReply: true,
      createdAt: '2024-01-11T09:00:00Z',
      user: { name: 'Cultivo Pro', avatar: '' }
    }]
  },
];

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart, items } = useCart()
  const { toggleFavorite, isFavorited } = useFavorites()
  const isProductFavorited = product ? isFavorited(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/marketplace-products/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          router.push('/marketplace')
        }
      } catch (error) {
        console.error('Erro:', error)
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.slug, router])

  if (loading) return <div className="p-8">Carregando...</div>
  if (!product) return <div className="p-8">Produto não encontrado</div>

  const productInCart = items.find(item => item.id === product.id)
  const isOutOfStock = product.stock === 0
  const pointsEarned = Math.floor(product.price * 0.05)
  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        
        {/* Product Details Section */}
        <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0]?.url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'}
              alt={product.name}
              fill
              className="object-cover"
            />
             {discountPercent > 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4 text-sm px-3 py-1">
                -{discountPercent}%
                </Badge>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-9 w-9 rounded-full transition-all',
                    isProductFavorited
                      ? 'bg-red-100 hover:bg-red-200 text-red-600'
                      : 'bg-white/80 hover:bg-white text-gray-600'
                  )}
                  onClick={() => product && toggleFavorite(product.id)}
                >
                  <Heart className={cn('h-5 w-5', isProductFavorited && 'fill-current')} />
                </Button>
              </div>

              {product.avgRating && (
                  <div className="flex items-center space-x-1">
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
                  <span className="text-sm text-muted-foreground ml-2">
                      {product.avgRating.toFixed(1)} ({product.totalReviews} avaliações)
                  </span>
                  </div>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-green-600">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  R$ {product.comparePrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={isOutOfStock ? "destructive" : "secondary"}>
                  {isOutOfStock ? "Esgotado" : `Em estoque: ${product.stock}`}
                </Badge>
                {product.seller?.businessName && (
                  <Badge variant="outline" className="font-normal">
                    Vendido por: {product.seller.businessName}
                  </Badge>
                )}
              </div>
              
              {pointsEarned > 0 && (
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <span>⚡</span>
                  <span>Ganhe {pointsEarned} CultivoCoins com esta compra</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={isOutOfStock || productInCart?.quantity === product.stock}
                onClick={() => product && addToCart(product, 1)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Avaliações dos Clientes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Review Form */}
            <ReviewForm
              productId={product.id}
              productName={product.name}
              isVerifiedPurchase={true} // Mock: assumindo que a compra é verificada
              onSubmitSuccess={() => {
                // Lógica para atualizar a lista de reviews ou dar feedback
                console.log("Review enviado com sucesso!");
              }}
            />

          </div>
        </div>

      </div>
    </div>
  )
}