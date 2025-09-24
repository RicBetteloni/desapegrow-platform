'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Star, ChevronDown } from 'lucide-react'
import { ReviewCard } from './ReviewCard'

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

interface ReviewsListProps {
  productId: string
  avgRating?: number
  totalReviews: number
}

export function ReviewsList({ productId, avgRating, totalReviews }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all')

  // Mock de reviews para demonstração
  const mockReviews: Review[] = [
    {
      id: '1',
      rating: 5,
      title: 'Excelente produto!',
      content: 'LED de ótima qualidade, chegou super rápido e bem embalado. As plantas já estão respondendo muito bem à nova iluminação. Recomendo demais!',
      createdAt: '2024-01-15T10:30:00Z',
      user: {
        name: 'Maria Silva',
        avatar: ''
      },
      pointsAwarded: true
    },
    {
      id: '2', 
      rating: 4,
      title: 'Muito bom custo-benefício',
      content: 'Para o preço, está muito bom. A qualidade da luz é boa e consumo é baixo mesmo. Só achei que podia ter vindo com mais acessórios.',
      createdAt: '2024-01-10T15:45:00Z',
      user: {
        name: 'João Costa',
        avatar: ''
      },
      pointsAwarded: true
    },
    {
      id: '3',
      rating: 5,
      title: 'Superou minhas expectativas',
      content: 'Estava com receio de comprar, mas valeu muito a pena. Meu grow melhorou 100% com esse LED. Plantas mais verdes e crescendo mais rápido.',
      createdAt: '2024-01-08T09:20:00Z',
      user: {
        name: 'Pedro Oliveira',
        avatar: ''
      },
      pointsAwarded: true
    },
    {
      id: '4',
      rating: 3,
      title: 'Produto OK, entrega demorou',
      content: 'O LED é bom, mas a entrega demorou mais do que o esperado. No mais, está funcionando bem e as plantas gostaram.',
      createdAt: '2024-01-05T14:15:00Z',
      user: {
        name: 'Ana Santos',
        avatar: ''
      },
      pointsAwarded: true
    }
  ]

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setReviews(mockReviews)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === filter)

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 3)

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>Carregando avaliações...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span>Avaliações dos Clientes</span>
          </span>
          <Badge variant="outline">
            {totalReviews} avaliações
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Resumo das Avaliações */}
        <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {avgRating?.toFixed(1) || '0.0'}
            </div>
            <div className="flex justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    avgRating && star <= Math.round(avgRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {totalReviews} avaliações
            </p>
          </div>

          <div className="flex-1">
            {/* Distribuição de Estrelas */}
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2 mb-1">
                <span className="text-sm w-3">{rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ 
                      width: `${totalReviews > 0 ? (ratingCounts[rating as keyof typeof ratingCounts] / totalReviews) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-6">
                  {ratingCounts[rating as keyof typeof ratingCounts]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas ({reviews.length})
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filter === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(rating as 1 | 2 | 3 | 4 | 5)}
              disabled={ratingCounts[rating as keyof typeof ratingCounts] === 0}
            >
              {rating} ⭐ ({ratingCounts[rating as keyof typeof ratingCounts]})
            </Button>
          ))}
        </div>

        {/* Lista de Reviews */}
        {displayedReviews.length > 0 ? (
          <div>
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}

            {/* Botão Ver Mais */}
            {filteredReviews.length > 3 && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center space-x-2"
                >
                  <span>
                    {showAll ? 'Ver menos' : `Ver mais ${filteredReviews.length - 3} avaliações`}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma avaliação encontrada para este filtro</p>
          </div>
        )}

        {/* Call to Action para Avaliação */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-800">
                🎁 Ganhe 10 CultivoCoins
              </h4>
              <p className="text-sm text-green-700">
                Avalie este produto e ganhe pontos!
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Avaliar Produto
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}