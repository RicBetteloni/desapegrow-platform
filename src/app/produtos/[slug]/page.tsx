'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Heart, Star, ShoppingCart, ArrowLeft, Plus, Minus, Zap, Shield, Truck } from 'lucide-react'
import { cn } from '../../../lib/utils'
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

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { toggleFavorite, isFavorited } = useFavorites()

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        router.push('/marketplace')
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      router.push('/marketplace')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando produto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produto não encontrado</p>
      </div>
    )
  }

  const pointsEarned = Math.floor(product.price * quantity * 0.05)
  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0
  const totalPrice = product.price * quantity
  const favorited = isFavorited(product.id)

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }

  const getImageUrl = (url: string) => {
    return isValidUrl(url) ? url : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
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
            <Link href="/marketplace">
              <Button variant="ghost">Marketplace</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/marketplace" className="hover:text-primary flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Marketplace</span>
          </Link>
          <span>/</span>
          <span>{product.category.name}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={getImageUrl(product.images[selectedImageIndex]?.url || product.images[0]?.url)}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {discountPercent > 0 && (
                  <Badge variant="destructive">-{discountPercent}%</Badge>
                )}
                {product.stock < 5 && product.stock > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Últimas {product.stock} unidades
                  </Badge>
                )}
              </div>

              {/* Favorite */}
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.shortDesc && (
                <p className="text-lg text-muted-foreground">{product.shortDesc}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {product.comparePrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              
              {/* Points */}
              <div className="flex items-center space-x-1 text-green-600">
                <Zap className="h-4 w-4" />
                <span className="font-medium">
                  Ganhe {pointsEarned} CultivoCoins com esta compra
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantidade:</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    ({product.stock} disponíveis)
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Você ganhará:</span>
                  <span className="text-green-600 font-medium">
                    {pointsEarned} CultivoCoins
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                disabled={product.stock === 0}
              >
                Comprar Agora
              </Button>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Frete grátis para compras acima de R$ 100</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Zap className="h-4 w-4 text-green-600" />
                <span>Ganhe pontos a cada compra</span>
              </div>
            </div>

            {/* Seller */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Vendido por: <span className="font-medium text-foreground">
                  {product.seller.businessName || product.seller.user.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Descrição do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}