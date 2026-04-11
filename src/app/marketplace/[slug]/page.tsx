// src/app/marketplace/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star, Package, Sparkles, Gift } from 'lucide-react'
import { trackGA4ViewItem, trackGA4AddToCart, getAnalytics } from '@/lib/analytics'

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  images: { url: string; alt: string }[]
  category: { name: string; slug: string }
  seller: { businessName: string }
  avgRating?: number
  totalReviews: number
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/marketplace-products/${resolvedParams.slug}`)
      const data = await response.json()
      if (!response.ok) throw new Error('Produto não encontrado')
      setProduct(data.product)
      
      // Track product view in GA4
      trackGA4ViewItem([
        {
          item_id: data.product.id,
          item_name: data.product.name,
          item_category: data.product.category?.name,
          price: data.product.price,
          item_brand: 'Desapegrow',
        }
      ])
      
      // Also track in custom analytics
      const analytics = getAnalytics()
      analytics.track('PRODUCT_VIEW', {
        productId: data.product.id,
        value: data.product.price,
        metadata: { 
          category: data.product.category?.name,
          seller: data.product.seller?.businessName
        }
      })
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return
    setAddingToCart(true)
    const cartJson = localStorage.getItem('cart')
    const cart = cartJson ? JSON.parse(cartJson) : []
    interface CartItem {
      productId: string
      name: string
      price: number
      quantity: number
      image: string
    }

    const existingItem = cart.find((item: CartItem) => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || ''
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Track add to cart in GA4
    trackGA4AddToCart([
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category?.name,
        price: product.price,
        quantity: 1,
        item_brand: 'Desapegrow',
      }
    ], product.price)
    
    // Also track in custom analytics
    const analytics = getAnalytics()
    analytics.trackCartAction('add', product.id, 1, product.price)
    
    setTimeout(() => {
      setAddingToCart(false)
      router.push('/checkout')
    }, 500)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Produto não encontrado</h2>
          <Link href="/marketplace"><Button>Voltar ao Marketplace</Button></Link>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/marketplace" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
            ← Voltar ao Marketplace
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl border-4 border-white">
              <Image
                src={product.images[0]?.url || '/placeholder.png'}
                alt={product.name}
                width={900}
                height={900}
                unoptimized
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Badge Categoria */}
            <Badge variant="outline" className="text-sm px-4 py-1">
              {product.category.name}
            </Badge>

            {/* Nome */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {product.name}
            </h1>

            {/* Avaliações */}
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.round(product.avgRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.avgRating?.toFixed(1)} ({product.totalReviews} avaliações)
                </span>
              </div>
            )}

            {/* Preço */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              {product.comparePrice && product.comparePrice > product.price && (
                <p className="text-lg text-gray-500 line-through mb-1">
                  De R$ {product.comparePrice.toFixed(2)}
                </p>
              )}
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <Badge className="bg-red-500 text-white text-sm px-3 py-1">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                📝 Descrição
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Estoque */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Disponibilidade:</span>
                </div>
                {product.stock > 0 ? (
                  <Badge className="bg-green-100 text-green-800 px-4 py-1">
                    ✓ {product.stock} em estoque
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 px-4 py-1">
                    ✗ Indisponível
                  </Badge>
                )}
              </div>
            </div>

            {/* Vendedor */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Vendido por:</span>
                <span className="text-green-600 font-bold">{product.seller.businessName}</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button 
                onClick={addToCart} 
                disabled={addingToCart || product.stock === 0} 
                className="w-full h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105" 
                size="lg"
              >
                {addingToCart ? (
                  <>⏳ Adicionando...</>
                ) : product.stock === 0 ? (
                  <>❌ Produto Indisponível</>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    Adicionar ao Carrinho
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-14 text-lg border-2 hover:bg-green-50" 
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Adicionar aos Favoritos
              </Button>
            </div>

            {/* Badges Informativos */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs font-semibold text-blue-800">Qualidade Garantida</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <Gift className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-semibold text-purple-800">Ganhe Pontos</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <Package className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-semibold text-green-800">Envio Rápido</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}