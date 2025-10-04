// src/app/marketplace/[slug]/page.tsx
// EXEMPLO COMPLETO: Página de produto integrada com sistema de unlock

'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CurrencyDisplayHeader from '@/components/CurrencyDisplayHeader'
import { 
  ShoppingCart, Heart, Star, Package, 
  Sparkles, Zap, Gift 
} from 'lucide-react'

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

export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  // Buscar preview do item virtual que será desbloqueado
  const [virtualItemPreview, setVirtualItemPreview] = useState<any>(null)

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/marketplace-products/${resolvedParams.slug}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error('Produto não encontrado')
      
      setProduct(data.product)
      
      // Buscar preview do item virtual
      fetchVirtualItemPreview(data.product)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVirtualItemPreview = async (product: Product) => {
    try {
      // Simular preview do item (em produção, seria uma API)
      const preview = {
        name: `${product.name} Virtual`,
        rarity: product.price > 500 ? 'LEGENDARY' : 
                product.price > 200 ? 'EPIC' :
                product.price > 100 ? 'RARE' : 'COMMON',
        effects: [
          { type: 'growth_speed', value: 25 },
          { type: 'yield_multiplier', value: 1.15 }
        ],
        coins: product.price > 500 ? 500 : 
               product.price > 200 ? 200 :
               product.price > 100 ? 100 : 50,
        gems: product.price > 500 ? 100 : 
              product.price > 200 ? 30 :
              product.price > 100 ? 15 : 5
      }
      setVirtualItemPreview(preview)
    } catch (error) {
      console.error('Erro ao buscar preview:', error)
    }
  }

  const addToCart = () => {
    if (!product) return
    
    setAddingToCart(true)
    
    // Pegar carrinho atual
    const cartJson = localStorage.getItem('cart')
    const cart = cartJson ? JSON.parse(cartJson) : []
    
    // Adicionar produto
    const existingItem = cart.find((item: any) => item.productId === product.id)
    
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
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-2">Produto não encontrado</h2>
            <Link href="/marketplace">
              <Button>Voltar ao Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header com moedas */}
      <nav className="bg-white/80