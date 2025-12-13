'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star, Package, ChevronLeft, Store } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  images: { url: string; alt: string | null }[]
  category: { name: string; slug: string; icon: string }
  seller: { businessName: string }
  avgRating?: number
  totalReviews: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/marketplace-products/${slug}`)
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
    const existing = cart.find((i: any) => i.productId === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url
      })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    setTimeout(() => setAddingToCart(false), 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
            <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => router.push('/marketplace')} className="bg-green-600 hover:bg-green-700">
              Voltar ao Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/marketplace" className="text-gray-600 hover:text-green-600 transition">
            Marketplace
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
          <Link href={`/marketplace?category=${product.category.slug}`} className="text-gray-600 hover:text-green-600 transition">
            {product.category.name}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-100">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]?.url || '/placeholder.png'}
                  alt={product.images[selectedImage]?.alt || product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} - imagem ${idx + 1}`}
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
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              
              {product.avgRating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (product.avgRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.avgRating.toFixed(1)} ({product.totalReviews} avaliações)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-base px-3 py-1">
                  {product.category.icon} {product.category.name}
                </Badge>
                <Badge variant="outline" className="text-base px-3 py-1">
                  <Store className="w-4 h-4 mr-1" />
                  {product.seller.businessName}
                </Badge>
              </div>
            </div>

            {/* Card de Preço */}
            <Card className="border-2 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {product.comparePrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-lg">
                        R$ {product.comparePrice.toFixed(2)}
                      </span>
                      <Badge className="bg-red-500">-{discount}%</Badge>
                    </div>
                  )}
                  <div className="text-4xl font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4" />
                    <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600'}>
                      {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={addToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 shadow-lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {addingToCart ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 text-lg border-2 hover:bg-green-50"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Adicionar aos Favoritos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Descrição */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Descrição do Produto</h2>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {product.description}
            </p>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-2 border-green-100">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Envio Rápido</h3>
              <p className="text-sm text-gray-600">Entrega em até 7 dias úteis</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-2 border-green-100">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Compra Segura</h3>
              <p className="text-sm text-gray-600">Pagamento protegido</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-2 border-green-100">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Garantia</h3>
              <p className="text-sm text-gray-600">7 dias para troca ou devolução</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
