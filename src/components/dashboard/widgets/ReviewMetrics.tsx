// src/components/dashboard/widgets/ReviewMetrics.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, MessageSquare, ThumbsUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReviewMetricsData {
  summary: {
    totalReviews: number
    averageRating: number
    responseRate: number
    helpfulVotes: number
  }
  ratingDistribution: {
    5: number
    4: number
    3: number  
    2: number
    1: number
  }
  trends: {
    reviewsGrowth: number
    ratingTrend: number
    engagementGrowth: number
  }
  topReviewers: Array<{
    name: string
    reviews: number
    avgRating: number
    helpfulVotes: number
    level: string
  }>
  insights: string[]
}

interface ReviewMetricsProps {
  period?: string
  detailed?: boolean
  className?: string
}

export function ReviewMetrics({ 
  period = '30d',
  detailed = false, 
  className 
}: ReviewMetricsProps) {
  const [data, setData] = useState<ReviewMetricsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

  useEffect(() => {
    fetchReviewMetrics()
  }, [period])

  const fetchReviewMetrics = async () => {
    try {
      // Mock realistic review data
      const baseMultiplier = period === '7d' ? 0.2 : period === '30d' ? 1 : period === '90d' ? 2.5 : 8

      const mockData: ReviewMetricsData = {
        summary: {
          totalReviews: Math.round(234 * baseMultiplier),
          averageRating: 4.6 + (Math.random() - 0.5) * 0.4,
          responseRate: 78.5 + (Math.random() - 0.5) * 10,
          helpfulVotes: Math.round(892 * baseMultiplier)
        },
        ratingDistribution: {
          5: Math.round(145 * baseMultiplier),
          4: Math.round(67 * baseMultiplier), 
          3: Math.round(18 * baseMultiplier),
          2: Math.round(3 * baseMultiplier),
          1: Math.round(1 * baseMultiplier)
        },
        trends: {
          reviewsGrowth: 18.5 + (Math.random() - 0.5) * 10,
          ratingTrend: 0.3 + (Math.random() - 0.5) * 0.6,
          engagementGrowth: 25.2 + (Math.random() - 0.5) * 15
        },
        topReviewers: [
          { name: 'Maria Silva', reviews: 28, avgRating: 4.8, helpfulVotes: 156, level: 'ESPECIALISTA' },
          { name: 'João Costa', reviews: 23, avgRating: 4.6, helpfulVotes: 134, level: 'JARDINEIRO' },
          { name: 'Ana Santos', reviews: 19, avgRating: 4.9, helpfulVotes: 98, level: 'JARDINEIRO' },
          { name: 'Pedro Lima', reviews: 16, avgRating: 4.7, helpfulVotes: 87, level: 'INICIANTE' },
          { name: 'Carlos Silva', reviews: 14, avgRating: 4.5, helpfulVotes: 76, level: 'INICIANTE' }
        ],
        insights: [
          'Reviews com fotos têm 45% mais votos úteis',
          'Avaliações de ESPECIALISTAS têm maior credibilidade',
          'Produtos com >4.5 estrelas convertem 3x mais',
          'Reviews detalhados (>100 chars) são mais valiosos'
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Error fetching review metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const totalRatings = Object.values(data.ratingDistribution).reduce((sum, count) => sum + count, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Métricas de Avaliações</span>
            </CardTitle>
            <CardDescription>
              Análise detalhada das reviews e engajamento
            </CardDescription>
          </div>

          {detailed && (
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
              >
                Visão Geral
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
              >
                Detalhado
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <div className="text-2xl font-bold text-yellow-600">
              {data.summary.totalReviews.toLocaleString()}
            </div>
            <p className="text-sm text-yellow-700">Total Reviews</p>
            <div className={`text-xs flex items-center justify-center mt-1 ${
              data.trends.reviewsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(data.trends.reviewsGrowth).toFixed(1)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
              <Star className="h-5 w-5 mr-1 fill-current" />
              {data.summary.averageRating.toFixed(1)}
            </div>
            <p className="text-sm text-green-700">Nota Média</p>
            <div className={`text-xs flex items-center justify-center mt-1 ${
              data.trends.ratingTrend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(data.trends.ratingTrend).toFixed(1)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="text-2xl font-bold text-blue-600">
              {data.summary.responseRate.toFixed(1)}%
            </div>
            <p className="text-sm text-blue-700">Taxa Resposta</p>
            <div className="text-xs text-blue-600 mt-1">
              <MessageSquare className="h-3 w-3 inline mr-1" />
              Excelente
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <div className="text-2xl font-bold text-purple-600">
              {data.summary.helpfulVotes.toLocaleString()}
            </div>
            <p className="text-sm text-purple-700">Votos Úteis</p>
            <div className={`text-xs flex items-center justify-center mt-1 ${
              data.trends.engagementGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <ThumbsUp className="h-3 w-3 mr-1" />
              {Math.abs(data.trends.engagementGrowth).toFixed(1)}%
            </div>
          </motion.div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>Distribuição de Avaliações</span>
          </h4>
          
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = data.ratingDistribution[rating as keyof typeof data.ratingDistribution]
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: (5 - rating) * 0.1 }}
                      className={`h-full ${
                        rating >= 4 ? 'bg-green-500' :
                        rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm font-semibold">{count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Reviewers */}
        {(detailed || viewMode === 'detailed') && (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span>Top Avaliadores</span>
            </h4>
            
            <div className="space-y-3">
              {data.topReviewers.map((reviewer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div>
                      <p className="font-medium">{reviewer.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{reviewer.reviews} reviews</span>
                        <Badge variant="outline" className="text-xs">
                          {reviewer.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{reviewer.avgRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reviewer.helpfulVotes} votos úteis
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-800 mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>Insights Inteligentes</span>
          </h4>
          <ul className="space-y-2">
            {data.insights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-indigo-700 flex items-start space-x-2"
              >
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Gerenciar Reviews
          </Button>
          
          <Button variant="outline" size="sm">
            Ver Relatório Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}