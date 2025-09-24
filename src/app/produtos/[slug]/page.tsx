'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react';
import { ReviewDisplay } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDesc?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: { url: string; alt: string }[];
  seller: {
    businessName?: string;
    user: { name: string };
  };
  category: { name: string };
  totalReviews: number;
  avgRating?: number;
}

interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  qualityRating?: number;
  valueRating?: number;
  shippingRating?: number;
  images: Array<{
    url: string;
    caption?: string;
  }>;
  helpfulScore: number;
  userVote?: 'helpful' | 'not_helpful' | null;
  isVerifiedPurchase: boolean;
  viewCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    reputation: {
      level: string;
      totalScore: number;
      badges: Array<{
        name: string;
        icon: string;
        level: string;
      }>;
    };
  };
  replies?: ReviewReply[];
}

interface ReviewReply {
  id: string;
  content: string;
  isSellerReply: boolean;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsSummary, setReviewsSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { addToCart, items } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();
  const isProductFavorited = product ? isFavorited(product.id) : false;

  const fetchProductAndReviews = async () => {
    try {
      const productRes = await fetch(`/api/marketplace-products/${params.slug}`);
      if (!productRes.ok) {
        router.push('/marketplace');
        return;
      }
      const productData = await productRes.json();
      setProduct(productData.product);

      const reviewsRes = await fetch(`/api/reviews/${productData.product.id}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews);
        setReviewsSummary({
          totalReviews: reviewsData.totalReviews,
          averageRating: reviewsData.averageRating,
          ratingDistribution: reviewsData.ratingDistribution,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      router.push('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) {
      fetchProductAndReviews();
    }
  }, [params.slug, router]);

  const onReviewSubmitted = () => {
    fetchProductAndReviews(); // Recarrega os dados após o envio de uma nova review
  };

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!product) return <div className="p-8">Produto não encontrado</div>;

const productInCart: CartItem | undefined = items.find((item: CartItem) => item.id === product.id);

interface CartItem {
id: string;
name: string;
price: number;
quantity: number;
// Add other fields as needed based on your cart implementation
}
  const isOutOfStock = product.stock === 0;
  const pointsEarned = Math.floor(product.price * 0.05);
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

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
              src={
                product.images[0]?.url ||
                'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
              }
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

              {reviewsSummary.averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(reviewsSummary.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {reviewsSummary.averageRating.toFixed(1)} ({reviewsSummary.totalReviews} avaliações)
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
                <Badge variant={isOutOfStock ? 'destructive' : 'secondary'}>
                  {isOutOfStock ? 'Esgotado' : `Em estoque: ${product.stock}`}
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
              isVerifiedPurchase={true}
              onSubmitSuccess={onReviewSubmitted}
            />

            {/* Review List */}
            <ReviewDisplay
              reviews={reviews}
              totalReviews={reviewsSummary.totalReviews}
              averageRating={reviewsSummary.averageRating}
              ratingDistribution={reviewsSummary.ratingDistribution}
            />
          </div>
        </div>
      </div>
    </div>
  );
}