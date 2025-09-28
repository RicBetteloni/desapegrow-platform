'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Calendar, Coins, Star, Zap } from 'lucide-react'

interface DailyRewardsProps {
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

export function DailyRewards({ userStats }: DailyRewardsProps) {
  const [claimed, setClaimed] = useState(false)

  const claimReward = () => {
    setClaimed(true)
    // Aqui você adicionaria a lógica real de claim
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-500" />
            Sistema de Recompensas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="text-2xl font-bold mb-2">Recompensa Diária</h3>
            <p className="text-gray-600 mb-4">
              Mantenha seu streak ativo para recompensas ainda melhores!
            </p>
            
            {!claimed ? (
              <Button size="lg" onClick={claimReward} className="bg-green-600 hover:bg-green-700">
                <Gift className="w-5 h-5 mr-2" />
                Resgatar Agora
              </Button>
            ) : (
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">
                  ✅ Resgatado hoje!
                </Badge>
                <p className="text-sm text-gray-500">
                  Volte amanhã para uma nova recompensa
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold">CultivoCoins</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {50 + userStats.streak * 5} CC
              </p>
              <p className="text-xs text-yellow-700">
                Base: 50 + Streak Bonus
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Experience</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {25 + Math.floor(userStats.streak / 7) * 10} XP
              </p>
              <p className="text-xs text-blue-700">
                +10 XP a cada 7 dias
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold">Bonus Items</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {userStats.streak >= 7 ? "1x" : "0x"}
              </p>
              <p className="text-xs text-purple-700">
                Requer 7+ dias de streak
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Calendário de Streak</h4>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({length: 14}, (_, i) => {
                const dayNumber = i + 1
                const isCompleted = dayNumber <= userStats.streak
                const isToday = dayNumber === userStats.streak + 1
                
                return (
                  <div 
                    key={i}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium ${
                      isCompleted 
                        ? 'bg-green-100 border-green-300 text-green-800' 
                        : isToday 
                        ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : dayNumber}
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Seu streak atual: <strong>{userStats.streak} dias</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}