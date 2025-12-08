'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  stock: number
  images: { url: string; alt?: string | null }[]
  avgRating?: number | null
  totalReviews: number
  category: {
    name: string
    icon: string
  }
  seller: {
    businessName?: string | null
    avgRating?: number | null
  }
}

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`)
      if (!response.ok) throw new Error('Produto não encontrado')
      const data = await response.json()
      setProduct(data.product)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      router.push('/marketplace')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return
    
    setAddingToCart(true)

    const currentCart = localStorage.getItem('cart')
    const cart: CartItem[] = currentCart ? JSON.parse(currentCart) : []

    const existingItemIndex = cart.findIndex((item: CartItem) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0]?.url || '/placeholder.png'
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))

    setTimeout(() => {
      setAddingToCart(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <span>🌱</span>
            <span>Desapegrow</span>
          </Link>
          
          <Link href="/marketplace">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Marketplace
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.images[selectedImage]?.url || '/placeholder.png'}
                    alt={product.images[selectedImage]?.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {discount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        -{discount}%
                      </Badge>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge variant="secondary">
                        Últimas {product.stock}!
                      </Badge>
                    )}
                  </div>

                  {/* Navegação de Imagens */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => 
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => 
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-green-600 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Categoria */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.icon} {product.category.name}
              </Badge>
            </div>

            {/* Título */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.shortDesc && (
                <p className="text-gray-600">{product.shortDesc}</p>
              )}
            </div>

            {/* Avaliações */}
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
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
                <span className="font-semibold">{product.avgRating?.toFixed(1)}</span>
                <span className="text-gray-500">({product.totalReviews} avaliações)</span>
              </div>
            )}

            {/* Preço */}
            <Card>
              <CardContent className="p-6">
                {product.comparePrice && (
                  <p className="text-sm text-gray-500 line-through mb-1">
                    De R$ {product.comparePrice.toFixed(2)}
                  </p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <Badge className="bg-red-500">
                      Economize {discount}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quantidade e Adicionar ao Carrinho */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantidade
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.stock} disponíveis
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={addToCart}
                    disabled={product.stock === 0 || addingToCart}
                  >
                    {addingToCart ? (
                      '✓ Adicionado!'
                    ) : product.stock === 0 ? (
                      'Sem Estoque'
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Entrega */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Frete Grátis</p>
                    <p className="text-sm text-gray-600">
                      Em compras acima de R$ 200,00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Compra Segura</p>
                    <p className="text-sm text-gray-600">
                      Seus dados protegidos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendedor */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Vendido por</h3>
                <p className="text-gray-700">
                  {product.seller.businessName || 'Vendedor'}
                </p>
                {product.seller.avgRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {product.seller.avgRating.toFixed(1)} avaliação do vendedor
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Descrição Completa */}
        <Card className="mt-8 max-w-6xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Descrição do Produto</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
