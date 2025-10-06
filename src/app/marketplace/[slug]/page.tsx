// src/app/marketplace/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star, Package, Sparkles, Gift } from 'lucide-react'

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
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/marketplace-products/${resolvedParams.slug}`)
      const data = await response.json()
      if (!response.ok) throw new Error('Produto não encontrado')
      setProduct(data.product)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <span>🌱</span><span>Desapegrow</span>
          </Link>
          <Link href="/marketplace"><Button variant="ghost">Marketplace</Button></Link>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
            <img src={product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="outline">{product.category.name}</Badge>
              <h1 className="text-3xl font-bold my-4">{product.name}</h1>
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <Button onClick={addToCart} disabled={addingToCart || product.stock === 0} className="w-full" size="lg">
              {addingToCart ? '⏳ Adicionando...' : <><ShoppingCart className="w-5 h-5 mr-2" />Adicionar ao Carrinho</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}