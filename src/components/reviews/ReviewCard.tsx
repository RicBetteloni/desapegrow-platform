'use client'

import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Star } from 'lucide-react'

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  createdAt: string
  user: {
    name: string
    avatar?: string
  }
  images?: {
    url: string
    alt?: string
  }[]
  pointsAwarded?: boolean
}

interface ReviewCardProps {
  review: Review
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void
}
export function ReviewCard({ review }: ReviewCardProps) {
  const getTimeAgo = (date: string) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `há ${diffInHours} horas`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `há ${diffInDays} dias`
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {review.user.name.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <h4 className="font-medium">{review.user.name}</h4>
              <p className="text-sm text-muted-foreground">
                {getTimeAgo(review.createdAt)}
              </p>
            </div>
          </div>

          {review.pointsAwarded && (
            <Badge className="bg-green-100 text-green-800">
              +10 pontos 🪙
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">
            {review.rating}/5
          </span>
        </div>

        {review.title && (
          <h5 className="font-semibold mb-2">{review.title}</h5>
        )}

        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {review.content}
        </p>

        <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
          <Badge variant="outline" className="text-xs">
            ✅ Compra verificada
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}