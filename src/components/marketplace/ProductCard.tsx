'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import { cn } from '../../lib/utils'
import { useCart } from '../../hooks/useCart'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: { url: string; alt?: string | null }[]
  avgRating?: number
  totalReviews: number
  stock: number
  category: { name: string }
  seller: { businessName?: string | null; user: { name: string } }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const { toggleFavorite, isFavorited } = useFavorites()
  
  const pointsEarned = Math.floor(product.price * 0.05)
  const { addToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState(false)
  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }

  const imageUrl = product.images[0]?.url
  const validImageUrl = imageUrl && isValidUrl(imageUrl) && !imageError
    ? imageUrl 
    : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'

  const imageAlt = product.images[0]?.alt || product.name
  const favorited = isFavorited(product.id)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/produtos/${product.slug}`}>
          <Image
            src={validImageUrl}
            alt={imageAlt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {discountPercent > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercent}%
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" className="text-xs">
              Esgotado
            </Badge>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              Últimas {product.stock}
            </Badge>
          )}
        </div>

        {/* Favorite Button - ATUALIZADO */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-2 right-2 h-8 w-8 rounded-full transition-all',
            favorited 
              ? 'bg-red-100 hover:bg-red-200 text-red-600' 
              : 'bg-white/80 hover:bg-white text-gray-600'
          )}
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(product.id)
          }}
        >
          <Heart className={cn('h-4 w-4', favorited && 'fill-current')} />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Product Name */}
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avgRating && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(product.avgRating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.totalReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.comparePrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          {/* Points Earned */}
          {pointsEarned > 0 && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <span>⚡</span>
              <span>Ganhe {pointsEarned} CultivoCoins</span>
            </div>
          )}
        </div>

        {/* Add to Cart */}
        <Button 
        className="w-full mt-3" 
        disabled={product.stock === 0 || addingToCart}
        onClick={async () => {
            setAddingToCart(true)
            addToCart(product, 1)
            // Feedback visual
            setTimeout(() => setAddingToCart(false), 500)
        }}
        >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {addingToCart ? 'Adicionando...' : product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </Button>

        {/* Seller */}
        <p className="text-xs text-muted-foreground mt-2">
          por {product.seller.businessName || product.seller.user.name}
        </p>
      </CardContent>
    </Card>
  )
}