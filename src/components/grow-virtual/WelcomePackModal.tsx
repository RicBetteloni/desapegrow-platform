'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Gift, Sparkles, Leaf, Zap, Award, Crown, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Badge } from '../ui/badge'

interface WelcomePack {
  seed: {
    id: string
    name: string
    rarity: string
    iconUrl: string
    effects: Record<string, unknown>
  }
  rarity: string
  bonusCoins: number
  message: string
}

interface WelcomePackModalProps {
  onPackClaimed?: () => void
}

export function WelcomePackModal({ onPackClaimed }: WelcomePackModalProps) {
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [canClaim, setCanClaim] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [welcomePack, setWelcomePack] = useState<WelcomePack | null>(null)
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      checkWelcomePack()
    }
  }, [status])

  const checkWelcomePack = async () => {
    try {
      const response = await fetch('/api/grow/welcome-pack')
      const data = await response.json()
      
      if (data.canClaim) {
        setCanClaim(true)
        setShowModal(true)
      }
    } catch (err) {
      console.error('Erro ao verificar pacote de boas-vindas:', err)
    }
  }

  const claimWelcomePack = async () => {
    setLoading(true)
    setRevealing(true)
    
    try {
      // Simulação de suspense para o reveal
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const response = await fetch('/api/grow/welcome-pack', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.status === 403 && data.action === 'LOGOUT_REQUIRED') {
        toast.error(data.error || 'Sessão inválida', {
          description: 'Redirecionando para login...',
          duration: 3000
        })
        setTimeout(() => {
          window.location.href = '/api/auth/signout?callbackUrl=/auth/signin'
        }, 2000)
        return
      }
      
      if (response.ok) {
        setWelcomePack(data.welcomePack)
        
        // Toast customizado com base na raridade
        toast.success(
          <div className="flex flex-col space-y-2">
            <p className="font-bold text-lg">{data.welcomePack.message}</p>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{data.welcomePack.seed.name}</p>
              <p className="text-sm">💰 +{data.welcomePack.bonusCoins} CultivoCoins</p>
            </div>
          </div>,
          { duration: 5000 }
        )
        
        setCanClaim(false)
        
        // Chamar callback para atualizar dados do dashboard
        setTimeout(() => {
          if (onPackClaimed) {
            onPackClaimed()
          }
        }, 2000)
      } else {
        toast.error(data.error || 'Erro ao resgatar pacote')
        setRevealing(false)
      }
    } catch (err) {
      toast.error('❌ Erro ao resgatar pacote de boas-vindas')
      console.error(err)
      setRevealing(false)
    } finally {
      setLoading(false)
    }
  }

  // Função para obter o ícone e cor da raridade
  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return {
          icon: Crown,
          color: 'from-purple-600 to-pink-600',
          bg: 'bg-gradient-to-br from-purple-100 to-pink-100',
          border: 'border-purple-500',
          glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
          badge: 'bg-purple-500 text-white'
        }
      case 'EPIC':
        return {
          icon: Award,
          color: 'from-orange-500 to-red-500',
          bg: 'bg-gradient-to-br from-orange-100 to-red-100',
          border: 'border-orange-500',
          glow: 'shadow-[0_0_25px_rgba(249,115,22,0.5)]',
          badge: 'bg-orange-500 text-white'
        }
      case 'RARE':
        return {
          icon: Star,
          color: 'from-blue-500 to-cyan-500',
          bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
          border: 'border-blue-500',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
          badge: 'bg-blue-500 text-white'
        }
      case 'UNCOMMON':
        return {
          icon: Zap,
          color: 'from-green-500 to-emerald-500',
          bg: 'bg-gradient-to-br from-green-100 to-emerald-100',
          border: 'border-green-500',
          glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
          badge: 'bg-green-500 text-white'
        }
      default: // COMMON
        return {
          icon: Leaf,
          color: 'from-gray-500 to-slate-500',
          bg: 'bg-gradient-to-br from-gray-100 to-slate-100',
          border: 'border-gray-400',
          glow: '',
          badge: 'bg-gray-500 text-white'
        }
    }
  }

  if (!showModal || !canClaim) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="max-w-3xl w-full border-2 border-green-500 shadow-2xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Gift className="w-20 h-20 animate-bounce" />
              <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-yellow-300 animate-spin" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            🎁 Pacote de Boas-Vindas
          </CardTitle>
          <p className="text-green-50 mt-2">
            {welcomePack ? 'Sua primeira seed foi revelada!' : 'Teste sua sorte e receba sua primeira genética!'}
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {revealing && !welcomePack ? (
            // Estado de Revealing/Loading
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse"></div>
                <Sparkles className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white animate-spin" />
              </div>
              <p className="text-xl font-bold text-green-600 animate-pulse">
                🎲 Sorteando sua seed...
              </p>
            </div>
          ) : welcomePack ? (
            // Estado de Revealed - Mostrar seed ganhada
            <>
              {(() => {
                const style = getRarityStyle(welcomePack.rarity)
                const RarityIcon = style.icon
                
                return (
                  <div className="space-y-6">
                    <div className={`${style.bg} ${style.border} ${style.glow} p-8 rounded-xl border-4 transform scale-100 animate-in zoom-in duration-700`}>
                      <div className="flex flex-col items-center space-y-4">
                        <Badge className={`${style.badge} text-lg px-4 py-1 font-bold animate-pulse`}>
                          <RarityIcon className="w-5 h-5 mr-2" />
                          {welcomePack.rarity}
                        </Badge>
                        
                        <div className="text-center">
                          <h3 className="text-3xl font-bold mb-2">{welcomePack.seed.name}</h3>
                          
                          {welcomePack.seed.effects.genetics && (
                            <div className="space-y-1 text-sm">
                              <p className="font-semibold">
                                📊 {String((welcomePack.seed.effects.genetics as Record<string, unknown>).lineage)}
                              </p>
                              {(welcomePack.seed.effects.genetics as Record<string, unknown>).era && (
                                <p className="text-gray-700">
                                  🕰️ Era: {String((welcomePack.seed.effects.genetics as Record<string, unknown>).era)}
                                </p>
                              )}
                              {(welcomePack.seed.effects.genetics as Record<string, unknown>).historical && (
                                <p className="italic text-gray-600 mt-2">
                                  {String((welcomePack.seed.effects.genetics as Record<string, unknown>).historical)}
                                </p>
                              )}
                              {(welcomePack.seed.effects.genetics as Record<string, unknown>).thc && (
                                <p className="font-mono text-green-700">
                                  💚 THC: {String((welcomePack.seed.effects.genetics as Record<string, unknown>).thc)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">💰</span>
                        <div>
                          <p className="font-bold text-yellow-800">+{welcomePack.bonusCoins} CultivoCoins</p>
                          <p className="text-sm text-yellow-700">Use para cuidar da sua primeira planta!</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-300">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Próximo passo:</strong> Vá para o inventário e plante sua seed! Cada genética tem características únicas.
                      </p>
                    </div>

                    <div className="text-center text-xs text-gray-500 italic">
                      ⚡ Esta foi sua única chance de pacote inicial
                    </div>
                  </div>
                )
              })()}
            </>
          ) : (
            // Estado Inicial - Antes do claim
            <>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-300 space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
                    <Gift className="w-7 h-7" />
                    Sistema de Raridade
                  </h3>
                  <p className="text-gray-700">
                    Você receberá <span className="font-bold text-green-600">1 seed aleatória</span> + 50 coins!
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-300 text-center">
                    <Leaf className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                    <p className="text-xs font-bold text-gray-700">COMMON</p>
                    <p className="text-xl font-bold text-gray-600">70%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-green-400 text-center">
                    <Zap className="w-6 h-6 mx-auto mb-1 text-green-500" />
                    <p className="text-xs font-bold text-green-700">UNCOMMON</p>
                    <p className="text-xl font-bold text-green-600">20%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-blue-400 text-center">
                    <Star className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                    <p className="text-xs font-bold text-blue-700">RARE</p>
                    <p className="text-xl font-bold text-blue-600">8%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-400 text-center">
                    <Award className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                    <p className="text-xs font-bold text-orange-700">EPIC</p>
                    <p className="text-xl font-bold text-orange-600">1.8%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-purple-400 text-center col-span-2 md:col-span-1">
                    <Crown className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                    <p className="text-xs font-bold text-purple-700">LEGENDARY</p>
                    <p className="text-xl font-bold text-purple-600">0.2%</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                  <p className="text-sm text-center text-gray-700">
                    <strong className="text-yellow-700">🌟 Exclusividade:</strong> Quanto mais rara, mais histórica e valiosa a genética!
                  </p>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                <p className="text-sm text-red-800 text-center font-semibold">
                  ⚠️ ATENÇÃO: Você só pode reivindicar este pacote UMA VEZ por conta!
                </p>
              </div>

              <Button
                onClick={claimWelcomePack}
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl py-6 font-bold shadow-lg transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-2 animate-spin" />
                    Sorteando...
                  </>
                ) : (
                  <>
                    <Gift className="w-6 h-6 mr-2" />
                    🎲 Abrir Pacote e Testar a Sorte!
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
