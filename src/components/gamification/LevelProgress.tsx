'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Star } from 'lucide-react'

interface LevelProgressProps {
  userStats: {
    level: number
    xp: number
    nextLevelXp: number
    cultivoCoins: number
    totalBadges: number
    streak: number
    ranking: number
  }
}

export function LevelProgress({ userStats }: LevelProgressProps) {
  const progressPercentage = (userStats.xp / userStats.nextLevelXp) * 100
  const xpToNext = userStats.nextLevelXp - userStats.xp

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Seu Progresso Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-green-600">Nível {userStats.level}</div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            🌿 Jardineiro Dedicado
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso para Nível {userStats.level + 1}</span>
            <span className="text-sm text-gray-500">{userStats.xp} / {userStats.nextLevelXp} XP</span>
          </div>
          
          <Progress value={progressPercentage} className="h-4" />
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Faltam apenas <strong className="text-green-600">{xpToNext} XP</strong> para o próximo nível!
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
            <div className="text-xs text-gray-500">Dias de Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.totalBadges}</div>
            <div className="text-xs text-gray-500">Badges Ganhos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">#{userStats.ranking}</div>
            <div className="text-xs text-gray-500">Ranking Geral</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}