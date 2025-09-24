// src/components/reviews/ReviewList.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
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
  X,
} from 'lucide-react'
import { cn, formatDate } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ReviewCard } from './ReviewCard'

// Simple StarRating component
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const starSize = size === 'lg' ? 24 : size === 'md' ? 18 : 14
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? `fill-yellow-400 text-yellow-400 mr-1`
              : `text-gray-300 mr-1`
          }
          width={starSize}
          height={starSize}
        />
      ))}
    </div>
  )
}

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
  className,
}: ReviewDisplayProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest')
  type FilterType = 'all' | '5' | '4' | '3' | '2' | '1' | 'images';
  const [filterBy, setFilterBy] = useState<FilterType>('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleVote = (reviewId: string, helpful: boolean) => {
    onVoteHelpful?.(reviewId, helpful)
  }

  const getReputationBadge = (level: string) => {
    const badges = {
      NOVICE: { label: 'Novato', color: 'bg-gray-100 text-gray-800' },
      CONTRIBUTOR: { label: 'Contribuidor', color: 'bg-blue-100 text-blue-800' },
      EXPERT: { label: 'Expert', color: 'bg-purple-100 text-purple-800' },
      MASTER: { label: 'Mestre', color: 'bg-orange-100 text-orange-800' },
      LEGEND: { label: 'Lenda', color: 'bg-yellow-100 text-yellow-800' },
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
            <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-200">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="mb-4 flex items-center justify-center space-x-3 md:justify-start">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={Math.round(averageRating)} size="lg" />
                  <p className="mt-1 text-sm text-muted-foreground">
                    {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="mb-3 font-semibold">Distribuição das Avaliações</h4>
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
              >
                {filter === 'all'
                  ? 'Todas'
                  : filter === 'images'
                    ? 'Com Fotos'
                    : `${filter} ⭐`}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'helpful' | 'rating')}
            className="rounded border px-3 py-1 text-sm"
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
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReviewCard review={review} onVoteHelpful={onVoteHelpful} />
            </motion.div>
          ))}
        </AnimatePresence>

        {reviews.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="space-y-4 text-center">
                <Star className="mx-auto h-12 w-12 text-muted-foreground" />
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
            className="relative max-h-4xl max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Review image"
              width={800}
              height={600}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4"
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