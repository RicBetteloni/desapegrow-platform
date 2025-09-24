// src/components/reviews/ReviewCard.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
  CheckCircle,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn, formatDate } from '../../lib/utils'

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

interface ReviewCardProps {
  review: Review
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void
}

export function ReviewCard({ review, onVoteHelpful }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = review.content.length > 300
  const displayContent =
    shouldTruncate && !isExpanded ? review.content.slice(0, 300) + '...' : review.content

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
      NOVICE: { label: 'Novato', color: 'bg-gray-100 text-gray-800' },
      CONTRIBUTOR: { label: 'Contribuidor', color: 'bg-blue-100 text-blue-800' },
      EXPERT: { label: 'Expert', color: 'bg-purple-100 text-purple-800' },
      MASTER: { label: 'Mestre', color: 'bg-orange-100 text-orange-800' },
      LEGEND: { label: 'Lenda', color: 'bg-yellow-100 text-yellow-800' },
    }
    return badges[level as keyof typeof badges] || badges.NOVICE
  }

  const reputationBadge = getReputationBadge(review.user.reputation?.level || 'NOVICE')

  return (
    <Card>
      <CardContent className="p-6">
        {/* Review Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user.avatar} />
              <AvatarFallback>
                {review.user.name.split(' ').map((n) => n[0])}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <span className="font-semibold">{review.user.name}</span>
                <Badge className={reputationBadge.color}>
                  <Award className="mr-1 h-3 w-3" />
                  {reputationBadge.label}
                </Badge>
                {review.isVerifiedPurchase && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
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
            </div>
          </div>

          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Review Title */}
        {review.title && (
          <h4 className="mb-2 text-lg font-semibold">{review.title}</h4>
        )}

        {/* Review Content */}
        <p className="mb-4 whitespace-pre-wrap text-gray-700">{displayContent}</p>

        {shouldTruncate && (
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="mb-4">
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Ver mais
              </>
            )}
          </Button>
        )}

        {/* Review Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVoteHelpful?.(review.id, true)}
                className={review.userVote === 'helpful' ? 'text-green-600' : ''}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                Útil ({review.helpfulScore})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVoteHelpful?.(review.id, false)}
                className={review.userVote === 'not_helpful' ? 'text-red-600' : ''}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>

            {review.replies && review.replies.length > 0 && (
              <Button variant="ghost" size="sm">
                <MessageSquare className="mr-1 h-4 w-4" />
                {review.replies.length} resposta{review.replies.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}