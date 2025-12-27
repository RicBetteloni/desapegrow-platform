'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Zap, Award, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Badge } from '../ui/badge'

interface RewardStatus {
  canClaim: boolean
  lastClaimDate: string | null
  nextClaimTime: string | null
  currentStreak: number
  timeUntilNext: number // em segundos
}

export function DailyRewards() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [rewardStatus, setRewardStatus] = useState<RewardStatus | null>(null)
  const [countdown, setCountdown] = useState<string>('')

  useEffect(() => {
    if (status === 'authenticated') {
      checkRewardStatus()
    }
  }, [status])

  useEffect(() => {
    if (rewardStatus && !rewardStatus.canClaim && rewardStatus.nextClaimTime) {
      const interval = setInterval(() => {
        const remaining = Math.floor((new Date(rewardStatus.nextClaimTime!).getTime() - Date.now()) / 1000)
        
        if (remaining <= 0) {
          setCountdown('00:00:00')
          checkRewardStatus()
          clearInterval(interval)
          return
        }

        const hours = Math.floor(remaining / 3600)
        const minutes = Math.floor((remaining % 3600) / 60)
        const seconds = remaining % 60
        
        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }, 1000)

      return () => clearInterval(interval)
    } else if (rewardStatus?.canClaim) {
      setCountdown('')
    }
  }, [rewardStatus])

  const checkRewardStatus = async () => {
    try {
      const response = await fetch('/api/grow/daily-reward/status')
      const data = await response.json()
      console.log('📊 Status da recompensa:', data)
      setRewardStatus(data)
    } catch (err) {
      console.error('Erro ao verificar status da recompensa:', err)
    }
  }

  const claimReward = async () => {
    if (status !== 'authenticated') {
      toast.error('🔒 Você precisa estar logado para resgatar!')
      return
    }

    if (!rewardStatus?.canClaim) {
      toast.error('⏰ Você já resgatou hoje! Volte em ' + countdown)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/grow/daily-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      console.log('🎁 Resposta recebida:', data)
      
      if (response.ok) {
        const hasItems = data.reward.items && data.reward.items.length > 0
        const isMilestone = [7, 14, 30, 60, 100].includes(data.reward.streakDay)
        
        console.log('✨ Mostrando toast com:', { hasItems, isMilestone, coins: data.reward.coins })
        
        toast.success(
          <div className="flex flex-col space-y-2">
            <p className="font-bold text-lg">🎉 Recompensa Resgatada!</p>
            <div className="space-y-1">
              <p className="text-sm font-semibold">💰 +{data.reward.coins} CultivoCoins</p>
              <p className="text-xs text-gray-700">🔥 Sequência: {data.reward.streakDay} dias</p>
              {hasItems && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {isMilestone && <p className="text-sm font-bold text-purple-600">⭐ Bônus de Marco!</p>}
                  <p className="text-sm font-semibold text-green-600">
                    🎁 +{data.reward.items.length} Vaso{data.reward.items.length > 1 ? 's' : ''} Surpresa!
                  </p>
                  <p className="text-xs text-gray-600">
                    Raridade: {data.reward.rarityRolled}
                  </p>
                </div>
              )}
            </div>
          </div>,
          { duration: 5000 }
        )
        // Aguardar um pouco antes de atualizar o status
        setTimeout(async () => {
          await checkRewardStatus()
          console.log('Status atualizado após resgate')
        }, 500)
        // Forçar reload da página para atualizar os coins no header
        window.dispatchEvent(new Event('coinsUpdated'))
      } else {
        toast.error(data.error || 'Erro ao resgatar recompensa')
      }
    } catch (err) {
      toast.error("❌ Erro ao resgatar a recompensa diária.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // FUNÇÃO TEMPORÁRIA PARA TESTES - REMOVER EM PRODUÇÃO
  const resetReward = async () => {
    setResetting(true)
    try {
      const response = await fetch('/api/grow/daily-reward/reset', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success('🔄 Recompensa resetada! Você pode resgatar novamente.')
        await checkRewardStatus()
      } else {
        toast.error(data.error || 'Erro ao resetar')
      }
    } catch (err) {
      toast.error('❌ Erro ao resetar recompensa')
      console.error(err)
    } finally {
      setResetting(false)
    }
  }

  if (!rewardStatus) {
    return (
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
        <CardContent className="p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        </CardContent>
      </Card>
    )
  }

  const canClaim = rewardStatus.canClaim

  console.log('🎁 Renderizando DailyRewards:', { canClaim, countdown, loading })

  return (
    <Card className={`border-2 transition-all ${
      canClaim 
        ? 'bg-gradient-to-r from-green-100 to-yellow-100 border-yellow-400 shadow-lg' 
        : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{canClaim ? '🎁' : '⏰'}</span>
            <div>
              <h3 className={`font-semibold ${
                canClaim ? 'text-green-800' : 'text-gray-600'
              }`}>
                Recompensa Diária
                {rewardStatus.currentStreak > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    🔥 {rewardStatus.currentStreak} dias
                  </Badge>
                )}
              </h3>
              {canClaim ? (
                <p className="text-sm text-green-700 font-medium">
                  ✨ Disponível agora!
                </p>
              ) : (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Próxima recompensa em:</p>
                  <p className="font-mono font-bold text-base text-gray-800 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {countdown}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={claimReward} 
              disabled={loading || !canClaim || status !== 'authenticated'}
              className={canClaim 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md font-bold' 
                : 'bg-gray-400 cursor-not-allowed'
              }
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Resgatando...
                </div>
              ) : canClaim ? (
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Resgatar
                </div>
              ) : (
                'Indisponível'
              )}
            </Button>
            
            {/* BOTÃO TEMPORÁRIO DE TESTE - REMOVER EM PRODUÇÃO */}
            <Button 
              onClick={resetReward}
              disabled={resetting}
              variant="outline"
              size="lg"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              {resetting ? '🔄' : '🔄 Reset (Teste)'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}