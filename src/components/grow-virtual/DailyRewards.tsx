'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Zap, Award } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Badge } from '../ui/badge'

export function DailyRewards() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  const claimReward = async () => {
    if (status !== 'authenticated') {
      toast.error('Você precisa estar logado para resgatar a recompensa diária.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/grow/daily-reward')
      const data = await response.json()
      
      if (response.ok) {
        toast.success(
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <div>
              <p className="font-semibold">Recompensa Diária Resgatada!</p>
              <p className="text-sm">Você ganhou {data.reward.coins} CultivoCoins!</p>
            </div>
          </div>
        )
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error("Erro ao resgatar a recompensa diária.")
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🎁</span>
          <div>
            <h3 className="font-semibold text-green-800">Recompensa Diária</h3>
            <p className="text-sm text-green-700">Resgate sua recompensa de hoje!</p>
          </div>
        </div>
        <Button 
          onClick={claimReward} 
          disabled={loading || status !== 'authenticated'}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {loading ? 'Carregando...' : 'Resgatar'}
        </Button>
      </CardContent>
    </Card>
  )
}