// src/components/reviews/ReviewDisplay.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Award,
  Camera,
  X
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  qualityRating?: number
  valueRating?: number
  shippingRating?: number
  images: Array<{
    url: string
    caption?: string
  }>
  helpfulScore: number
  userVote?: 'helpful' | 'not_helpful' | null
  isVerifiedPurchase: boolean
  viewCount: number
  createdAt: string
  user: {
    id: string
    name: string
    avatar?: string
    reputation: {
      level: string
      totalScore: number
      badges: Array<{
        name: string
        icon: string
        level: string
      }>
    }
  }
  replies?: ReviewReply[]
}

interface ReviewReply {
  id: string
  content: string
  isSellerReply: boolean
  createdAt: string
  user: {
    name: string
    avatar?: string
  }
}

interface ReviewDisplayProps {
  reviews: Review[]
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void
  onReply?: (reviewId: string, content: string) => void
  className?: string
}

export function ReviewDisplay({
  reviews,
  totalReviews,
  averageRating,
  ratingDistribution,
  onVoteHelpful,
  onReply,
  className
}: ReviewDisplayProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest')
  type FilterType = 'all' | '5' | '4' | '3' | '2' | '1' | 'images';
  const [filterBy, setFilterBy] = useState<FilterType>('all')
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleVote = (reviewId: string, helpful: boolean) => {
    onVoteHelpful?.(reviewId, helpful)
  }

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'xs' | 'sm' | 'lg' }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'fill-current',
            size === 'xs' && 'h-3 w-3',
            size === 'sm' && 'h-4 w-4', 
            size === 'lg' && 'h-5 w-5',
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  )

  const getReputationBadge = (level: string) => {
    const badges = {
      'NOVICE': { label: 'Novato', color: 'bg-gray-100 text-gray-800' },
      'CONTRIBUTOR': { label: 'Contribuidor', color: 'bg-blue-100 text-blue-800' },
      'EXPERT': { label: 'Expert', color: 'bg-purple-100 text-purple-800' },
      'MASTER': { label: 'Mestre', color: 'bg-orange-100 text-orange-800' },
      'LEGEND': { label: 'Lenda', color: 'bg-yellow-100 text-yellow-800' }
    }
    return badges[level as keyof typeof badges] || badges.NOVICE
  }

  const RatingDistribution = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = ratingDistribution[rating as keyof typeof ratingDistribution]
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
        
        return (
          <div key={rating} className="flex items-center space-x-3 text-sm">
            <span className="w-8 text-right">{rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: (5 - rating) * 0.1 }}
                className="h-full bg-yellow-400"
              />
            </div>
            <span className="w-8 text-muted-foreground">{count}</span>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className={cn('space-y-6', className)}>
      {/* Reviews Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={Math.round(averageRating)} size="lg" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Distribuição das Avaliações</h4>
              <RatingDistribution />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filtrar:</span>
          <div className="flex space-x-2">
            {['all', '5', '4', '3', '2', '1', 'images'].map((filter) => (
              <Button
                key={filter}
                variant={filterBy === filter ? 'default' : 'outline'}
                onClick={() => setFilterBy(filter as FilterType)}
               /* onClick={() => setFilterBy(filter as any)}*/
              >
                {filter === 'all' ? 'Todas' : 
                 filter === 'images' ? 'Com Fotos' : 
                 `${filter} ⭐`}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Ordenar:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'helpful' | 'rating')}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigas</option>
            <option value="helpful">Mais Úteis</option>
            <option value="rating">Maior Avaliação</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {reviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id)
            const shouldTruncate = review.content.length > 300
            const displayContent = shouldTruncate && !isExpanded 
              ? review.content.slice(0, 300) + '...'
              : review.content

            const reputationBadge = getReputationBadge(review.user.reputation.level)

            return (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>
                            {review.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{review.user.name}</span>
                            <Badge className={reputationBadge.color}>
                              <Award className="h-3 w-3 mr-1" />
                              {reputationBadge.label}
                            </Badge>
                            {review.isVerifiedPurchase && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Compra Verificada
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-4">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>

                          {/* User Expertise Badges */}
                          {review.user.reputation.badges.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {review.user.reputation.badges.slice(0, 3).map((badge) => (
                                <Badge
                                  key={badge.name}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <span className="mr-1">{badge.icon}</span>
                                  {badge.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                    )}

                    {/* Detailed Ratings */}
                    {(review.qualityRating || review.valueRating || review.shippingRating) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded">
                        {review.qualityRating && (
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Qualidade</p>
                            <StarRating rating={review.qualityRating} size="xs" />
                          </div>
                        )}
                        {review.valueRating && (
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Custo-Benefício</p>
                            <StarRating rating={review.valueRating} size="xs" />
                          </div>
                        )}
                        {review.shippingRating && (
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Entrega</p>
                            <StarRating rating={review.shippingRating} size="xs" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Content */}
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                      {displayContent}
                    </p>

                    {shouldTruncate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(review.id)}
                        className="mb-4"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Ver mais
                          </>
                        )}
                      </Button>
                    )}

                    {/* Review Images */}
                    {review.images.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Camera className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {review.images.length} foto{review.images.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {review.images.map((image, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="aspect-square rounded-lg overflow-hidden border cursor-pointer"
                              onClick={() => setSelectedImage(image.url)}
                            >
                              <Image
                                src={image.url}
                                alt={image.caption || `Review image ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(review.id, true)}
                            className={review.userVote === 'helpful' ? 'text-green-600' : ''}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Útil ({review.helpfulScore})
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(review.id, false)}
                            className={review.userVote === 'not_helpful' ? 'text-red-600' : ''}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>

                        {review.replies && review.replies.length > 0 && (
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {review.replies.length} resposta{review.replies.length !== 1 ? 's' : ''}
                          </Button>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {review.viewCount} visualizações
                      </span>
                    </div>

                    {/* Review Replies */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                        {review.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user.avatar} />
                              <AvatarFallback>
                                {reply.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{reply.user.name}</span>
                                {reply.isSellerReply && (
                                  <Badge variant="secondary" className="text-xs">
                                    Vendedor
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {reviews.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Nenhuma avaliação ainda</h3>
                  <p className="text-muted-foreground">
                    Seja o primeiro a avaliar este produto!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Review image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}