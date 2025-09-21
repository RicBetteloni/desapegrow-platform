'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Heart, Star, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: { url: string; alt?: string }[]
  avgRating?: number
  totalReviews: number
  stock: number
  category: { name: string }
  seller: { businessName?: string; user: { name: string } }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const pointsEarned = Math.floor(product.price * 0.05)
  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/produtos/${product.slug}`}>
          <Image
            src={product.images[0]?.url || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
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
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
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
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </Button>

        {/* Seller */}
        <p className="text-xs text-muted-foreground mt-2">
          por {product.seller.businessName || product.seller.user.name}
        </p>
      </CardContent>
    </Card>
  )
}