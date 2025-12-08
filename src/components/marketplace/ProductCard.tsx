'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star } from 'lucide-react'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    shortDesc?: string | null
    price: number
    comparePrice?: number | null
    images: { url: string; alt?: string | null }[]
    avgRating?: number | null
    totalReviews: number
    stock: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false)

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevenir navegação do Link
    setAddingToCart(true)

    // Pegar carrinho atual do localStorage
    const currentCart = localStorage.getItem('cart')
    const cart: CartItem[] = currentCart ? JSON.parse(currentCart) : []

    // Verificar se produto já está no carrinho
    const existingItemIndex = cart.findIndex((item: CartItem) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      // Incrementar quantidade
      cart[existingItemIndex].quantity += 1
    } else {
      // Adicionar novo item
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || '/placeholder.png'
      })
    }

    // Salvar no localStorage
    localStorage.setItem('cart', JSON.stringify(cart))

    // Disparar evento customizado para atualizar CartSheet
    window.dispatchEvent(new Event('cartUpdated'))

    // Feedback visual
    setTimeout(() => {
      setAddingToCart(false)
    }, 500)
  }

  return (
    <Link href={`/produtos/${product.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-0">
          {/* Imagem */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.images[0]?.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badge de Desconto */}
            {discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}

            {/* Badge de Estoque Baixo */}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                Últimas {product.stock} unidades!
              </Badge>
            )}

            {/* Sem Estoque */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Sem Estoque</Badge>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>

            {product.shortDesc && (
              <p className="text-xs text-gray-600 line-clamp-1">
                {product.shortDesc}
              </p>
            )}

            {/* Avaliações */}
            {product.totalReviews > 0 && (
              <div className="flex items-center space-x-1 text-xs">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {product.avgRating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-500">
                  ({product.totalReviews})
                </span>
              </div>
            )}

            {/* Preços */}
            <div className="space-y-1">
              {product.comparePrice && (
                <p className="text-xs text-gray-500 line-through">
                  R$ {product.comparePrice.toFixed(2)}
                </p>
              )}
              <p className="text-xl font-bold text-green-600">
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full"
            onClick={addToCart}
            disabled={product.stock === 0 || addingToCart}
          >
            {addingToCart ? (
              '✓ Adicionado!'
            ) : product.stock === 0 ? (
              'Sem Estoque'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
