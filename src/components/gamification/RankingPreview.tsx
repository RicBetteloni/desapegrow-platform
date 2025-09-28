'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown } from 'lucide-react'

const topUsers = [
  { name: "GrowMaster420", level: 28, xp: 45600, avatar: "👑" },
  { name: "PlantWhisperer", level: 25, xp: 38200, avatar: "🌿" },
  { name: "CultivoKing", level: 23, xp: 34800, avatar: "🏆" },
  { name: "GreenThumb", level: 21, xp: 31200, avatar: "💚" },
  { name: "HydroMaster", level: 19, xp: 27500, avatar: "💧" }
]

export function RankingPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top 5 - Hall da Fama
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                index === 0 ? 'bg-yellow-50 border-yellow-200' :
                index === 1 ? 'bg-gray-50 border-gray-200' :
                index === 2 ? 'bg-orange-50 border-orange-200' :
                'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                  {index === 1 && <Trophy className="w-5 h-5 text-gray-500" />}
                  {index === 2 && <Medal className="w-5 h-5 text-orange-500" />}
                  {index > 2 && <Award className="w-4 h-4 text-gray-400" />}
                  <span className="font-bold text-lg">#{index + 1}</span>
                </div>
                
                <div className="text-2xl">{user.avatar}</div>
                
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-600">
                    Nível {user.level} • {user.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>

              <Badge 
                variant="secondary"
                className={
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }
              >
                {index === 0 ? '👑 Lenda' :
                 index === 1 ? '🥈 Mestre' :
                 index === 2 ? '🥉 Expert' :
                 '⭐ Pro'}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-2">
              <strong>Sua posição atual: #47</strong>
            </p>
            <p className="text-xs text-green-600">
              Você está a 1.250 XP do Top 40! 🚀
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}