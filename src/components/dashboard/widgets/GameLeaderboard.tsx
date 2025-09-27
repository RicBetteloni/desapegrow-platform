// src/components/dashboard/widgets/GameLeaderboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Crown, Medal, Award, Zap, TrendingUp, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeaderboardEntry {
  id: string
  position: number
  previousPosition?: number
  user: {
    id: string
    name: string
    avatar?: string
    level: string
  }
  score: number
  change: number
  badges: Array<{
    name: string
    icon: string
    rarity: string
  }>
}

interface GameLeaderboardProps {
  metric?: 'points' | 'reviews' | 'sales'
  period?: string
  limit?: number
  className?: string
}

export function GameLeaderboard({ 
  metric = 'points', 
  period = '30d',
  limit = 10,
  className 
}: GameLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState(metric)

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedMetric, period])

  const fetchLeaderboard = async () => {
    try {
      // Mock data - em produção seria chamada real para API
      const mockEntries: LeaderboardEntry[] = [
        {
          id: '1',
          position: 1,
          previousPosition: 2,
          user: {
            id: '1',
            name: 'Maria Silva',
            avatar: '',
            level: 'ESPECIALISTA'
          },
          score: selectedMetric === 'points' ? 2450 : selectedMetric === 'reviews' ? 48 : 8950,
          change: 1,
          badges: [
            { name: 'LED Expert', icon: '💡', rarity: 'gold' },
            { name: 'Review Master', icon: '⭐', rarity: 'silver' },
            { name: 'Early Adopter', icon: '🚀', rarity: 'bronze' }
          ]
        },
        {
          id: '2',
          position: 2,
          previousPosition: 1,
          user: {
            id: '2',
            name: 'João Costa',
            avatar: '',
            level: 'JARDINEIRO'
          },
          score: selectedMetric === 'points' ? 2100 : selectedMetric === 'reviews' ? 42 : 7650,
          change: -1,
          badges: [
            { name: 'Hydro Pro', icon: '💧', rarity: 'gold' },
            { name: 'Helpful Reviewer', icon: '👍', rarity: 'silver' }
          ]
        },
        {
          id: '3',
          position: 3,
          previousPosition: 3,
          user: {
            id: '3',
            name: 'Ana Santos',
            avatar: '',
            level: 'JARDINEIRO'
          },
          score: selectedMetric === 'points' ? 1890 : selectedMetric === 'reviews' ? 38 : 6420,
          change: 0,
          badges: [
            { name: 'Organic Expert', icon: '🌿', rarity: 'gold' },
            { name: 'Community Helper', icon: '🤝', rarity: 'bronze' }
          ]
        },
        {
          id: '4',
          position: 4,
          previousPosition: 6,
          user: {
            id: '4',
            name: 'Pedro Lima',
            avatar: '',
            level: 'INICIANTE'
          },
          score: selectedMetric === 'points' ? 1650 : selectedMetric === 'reviews' ? 32 : 5230,
          change: 2,
          badges: [
            { name: 'First Steps', icon: '👶', rarity: 'bronze' }
          ]
        },
        {
          id: '5',
          position: 5,
          previousPosition: 4,
          user: {
            id: '5',
            name: 'Carlos Oliveira',
            avatar: '',
            level: 'INICIANTE'
          },
          score: selectedMetric === 'points' ? 1420 : selectedMetric === 'reviews' ? 28 : 4890,
          change: -1,
          badges: [
            { name: 'Newcomer', icon: '🌱', rarity: 'bronze' }
          ]
        }
      ]
      
      setEntries(mockEntries)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">#{position}</span>
          </div>
        )
    }
  }

  const getPositionChange = (change: number) => {
    if (change === 0) return null
    
    return (
      <div className={`flex items-center text-xs ${
        change > 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {change > 0 ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(change)}
      </div>
    )
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'points':
        return 'CultivoCoins'
      case 'reviews':
        return 'Avaliações'
      case 'sales':
        return 'Vendas (R$)'
      default:
        return 'Pontos'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INICIANTE':
        return 'bg-green-100 text-green-800'
      case 'JARDINEIRO':
        return 'bg-blue-100 text-blue-800'
      case 'ESPECIALISTA':
        return 'bg-purple-100 text-purple-800'
      case 'MESTRE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Ranking da Comunidade</span>
            </CardTitle>
            <CardDescription>
              Top {limit} usuários por {getMetricLabel().toLowerCase()} nos últimos{' '}
              {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'}
            </CardDescription>
          </div>

          <div className="flex space-x-1">
            {['points', 'reviews', 'sales'].map((metricType) => (
              <Button
                key={metricType}
                variant={selectedMetric === metricType ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric(metricType as 'points' | 'reviews' | 'sales')}
              >
                {metricType === 'points' ? '🪙' : metricType === 'reviews' ? '⭐' : '💰'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                entry.position <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'hover:bg-muted/50'
              }`}
            >
              {/* Position */}
              <div className="flex items-center justify-center">
                {getPositionIcon(entry.position)}
              </div>

              {/* User Info */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-semibold">
                  {entry.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold truncate">{entry.user.name}</p>
                  <Badge variant="outline" className={`text-xs ${getLevelColor(entry.user.level)}`}>
                    {entry.user.level}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {selectedMetric === 'points' && <Zap className="inline h-3 w-3 mr-1" />}
                    {entry.score.toLocaleString()} {getMetricLabel().toLowerCase()}
                  </p>
                  
                  {getPositionChange(entry.change)}
                </div>

                {/* User Badges */}
                {entry.badges.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <span 
                        key={badgeIndex} 
                        className="text-xs bg-white/50 px-2 py-1 rounded-full border"
                        title={badge.name}
                      >
                        {badge.icon} {badge.name}
                      </span>
                    ))}
                    {entry.badges.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{entry.badges.length - 3} badges
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Position Indicator */}
              {entry.position <= 3 && (
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    entry.position === 1 ? 'text-yellow-600' :
                    entry.position === 2 ? 'text-gray-500' :
                    'text-amber-600'
                  }`}>
                    #{entry.position}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.position === 1 ? 'Líder' : 
                     entry.position === 2 ? '2º Lugar' : 
                     '3º Lugar'}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum dado disponível para o período selecionado</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="text-center">
            <h4 className="font-semibold text-green-800 mb-2">
              Participe da Competição!
            </h4>
            <p className="text-sm text-green-700 mb-3">
              Avalie produtos, faça compras e ganhe pontos para subir no ranking
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Ver Meu Ranking
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}