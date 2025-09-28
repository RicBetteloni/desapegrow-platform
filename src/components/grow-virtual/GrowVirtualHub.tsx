// src/components/grow-virtual/GrowVirtualHub.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sprout, 
  Coins, 
  Gem, 
  Trophy, 
  Package, 
  Calendar,
  TrendingUp,
  Zap,
  Award,
  Leaf,
  Star,
  Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface VirtualGrowData {
  id: string
  cultivoCoins: number
  growthGems: number
  harvestTokens: number
  experiencePoints: number
  prestigeLevel: number
  plants: VirtualPlant[]
  inventory: VirtualItem[]
  dailyReward: {
    canClaim: boolean
    streakDays: number
    nextReward: string
  }
}

interface VirtualPlant {
  id: string
  name: string
  strain: string
  stage: string
  health: number
  size: number
  daysGrowing: number
}

interface VirtualItem {
  id: string
  name: string
  itemType: string
  rarity: string
  iconUrl: string
  effects: Record<string, number>
}

export function GrowVirtualHub() {
  const { data: session } = useSession()
  const [growData, setGrowData] = useState<VirtualGrowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimingReward, setClaimingReward] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<VirtualPlant | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchGrowData()
    }
  }, [session])

  const fetchGrowData = async () => {
    try {
      const response = await fetch('/api/grow/status')
      if (response.ok) {
        const data = await response.json()
        setGrowData(data.grow)
      }
    } catch (error) {
      console.error('Error fetching grow data:', error)
      // Mock data para demonstração
      setGrowData({
        id: 'mock-grow',
        cultivoCoins: 450,
        growthGems: 12,
        harvestTokens: 3,
        experiencePoints: 1250,
        prestigeLevel: 2,
        plants: [
          {
            id: '1',
            name: 'Purple Haze',
            strain: 'HYBRID',
            stage: 'FLOWERING',
            health: 95,
            size: 0.8,
            daysGrowing: 65
          },
          {
            id: '2', 
            name: 'Green Crack',
            strain: 'SATIVA',
            stage: 'VEGETATIVE',
            health: 88,
            size: 0.4,
            daysGrowing: 28
          }
        ],
        inventory: [
          {
            id: '1',
            name: 'LED Premium 200W',
            itemType: 'LIGHTING',
            rarity: 'EPIC',
            iconUrl: '💡',
            effects: { lightBonus: 25, energyEfficiency: 15 }
          },
          {
            id: '2',
            name: 'Fertilizante Orgânico+',
            itemType: 'NUTRIENTS',
            rarity: 'RARE',
            iconUrl: '🧪',
            effects: { growthSpeed: 20, healthBonus: 10 }
          }
        ],
        dailyReward: {
          canClaim: true,
          streakDays: 5,
          nextReward: '2024-12-26'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const claimDailyReward = async () => {
    if (!growData?.dailyReward.canClaim) return

    setClaimingReward(true)
    try {
      const response = await fetch('/api/grow/daily-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ growId: growData.id })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Atualizar dados localmente
        setGrowData(prev => prev ? {
          ...prev,
          cultivoCoins: prev.cultivoCoins + result.reward.coins,
          dailyReward: {
            ...prev.dailyReward,
            canClaim: false,
            streakDays: result.reward.streakDay
          }
        } : null)

        // Mostrar toast animado
        toast.success(
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎁</div>
            <div>
              <p className="font-bold">Recompensa Diária!</p>
              <p className="text-sm">+{result.reward.coins} CultivoCoins</p>
              <p className="text-xs text-green-600">Streak: {result.reward.streakDay} dias</p>
            </div>
          </div>
        )
      }
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast.error('Erro ao resgatar recompensa')
    } finally {
      setClaimingReward(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!growData) {
    return (
      <Card className="text-center p-8">
        <Sprout className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold mb-2">Bem-vindo ao Grow Virtual!</h3>
        <p className="text-gray-600 mb-4">Crie seu jardim virtual e comece sua jornada</p>
        <Button className="bg-green-600 hover:bg-green-700">
          Iniciar Grow
        </Button>
      </Card>
    )
  }

  const getPlantStageColor = (stage: string) => {
    const colors = {
      'SEED': 'bg-yellow-100 text-yellow-800',
      'SEEDLING': 'bg-green-100 text-green-800', 
      'VEGETATIVE': 'bg-blue-100 text-blue-800',
      'PRE_FLOWER': 'bg-purple-100 text-purple-800',
      'FLOWERING': 'bg-pink-100 text-pink-800',
      'HARVEST_READY': 'bg-orange-100 text-orange-800'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      'COMMON': 'text-gray-600',
      'RARE': 'text-blue-600',
      'EPIC': 'text-purple-600', 
      'LEGENDARY': 'text-yellow-600'
    }
    return colors[rarity as keyof typeof colors] || 'text-gray-600'
  }

  const experienceToNextLevel = 2000 // Simplified
  const experienceProgress = (growData.experiencePoints / experienceToNextLevel) * 100

  return (
    <div className="space-y-6">
      {/* Header com Stats */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Sprout className="h-6 w-6 text-green-600" />
                <span>Meu Grow Virtual</span>
                <Badge variant="secondary" className="ml-2">
                  Nível {growData.prestigeLevel}
                </Badge>
              </CardTitle>
              <CardDescription>
                {growData.experiencePoints.toLocaleString()} XP • {growData.plants.length} plantas ativas
              </CardDescription>
            </div>

            {/* Daily Reward */}
            {growData.dailyReward.canClaim && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Button 
                  onClick={claimDailyReward}
                  disabled={claimingReward}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse"
                >
                  {claimingReward ? 'Resgatando...' : '🎁 Resgatar Diária'}
                </Button>
                <p className="text-xs mt-1 text-gray-600">
                  Streak: {growData.dailyReward.streakDays} dias
                </p>
              </motion.div>
            )}
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Experiência</span>
              <span>{growData.experiencePoints.toLocaleString()} / {experienceToNextLevel.toLocaleString()} XP</span>
            </div>
            <Progress value={experienceProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Currencies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold text-yellow-800">{growData.cultivoCoins.toLocaleString()}</p>
            <p className="text-sm text-yellow-700">CultivoCoins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Gem className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-800">{growData.growthGems}</p>
            <p className="text-sm text-blue-700">Growth Gems</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-800">{growData.harvestTokens}</p>
            <p className="text-sm text-purple-700">Harvest Tokens</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="plants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plants">🌱 Plantas</TabsTrigger>
          <TabsTrigger value="inventory">📦 Inventário</TabsTrigger>
          <TabsTrigger value="achievements">🏆 Conquistas</TabsTrigger>
          <TabsTrigger value="market">🛒 Loja</TabsTrigger>
        </TabsList>

        {/* Plants Tab */}
        <TabsContent value="plants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {growData.plants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedPlant(plant)}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plant.name}</CardTitle>
                      <Badge className={getPlantStageColor(plant.stage)}>
                        {plant.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Plant Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Saúde</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={plant.health} className="flex-1 h-2" />
                            <span className="font-semibold">{plant.health}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Tamanho</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={plant.size * 100} className="flex-1 h-2" />
                            <span className="font-semibold">{(plant.size * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{plant.daysGrowing} dias crescendo</span>
                        <span>Strain: {plant.strain}</span>
                      </div>

                      {/* Plant Visual */}
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {plant.stage === 'SEED' ? '🌰' :
                           plant.stage === 'SEEDLING' ? '🌱' :
                           plant.stage === 'VEGETATIVE' ? '🌿' :
                           plant.stage === 'PRE_FLOWER' ? '🍀' :
                           plant.stage === 'FLOWERING' ? '🌸' : '🌳'}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Zap className="h-4 w-4 mr-1" />
                          Cuidar
                        </Button>
                        {plant.stage === 'HARVEST_READY' && (
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Star className="h-4 w-4 mr-1" />
                            Colher
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add New Plant */}
            <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors">
              <CardContent className="p-8 text-center">
                <Leaf className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold mb-2">Plantar Nova Semente</h3>
                <Button variant="outline" className="border-green-400 text-green-600 hover:bg-green-50">
                  + Adicionar Planta
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {growData.inventory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{item.iconUrl}</div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <Badge variant="outline" className={getRarityColor(item.rarity)}>
                        {item.rarity}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600 uppercase tracking-wide">{item.itemType}</p>
                      {Object.entries(item.effects).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-semibold text-green-600">+{value}</span>
                        </div>
                      ))}
                    </div>

                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Usar Item
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Primeiro Cultivo', description: 'Plante sua primeira semente', completed: true, points: 100 },
              { name: 'Mestre dos LEDs', description: 'Use 5 itens de iluminação diferentes', completed: true, points: 250 },
              { name: 'Verde Experiente', description: 'Colha 10 plantas', completed: false, points: 500 },
              { name: 'Hidro Guru', description: 'Complete um cultivo hidropônico', completed: false, points: 750 }
            ].map((achievement, index) => (
              <Card key={index} className={achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}>
                <CardContent className="p-4">
<div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`text-2xl ${achievement.completed ? '' : 'grayscale opacity-50'}`}>
                        🏆
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{achievement.name}</h3>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={achievement.completed ? 'default' : 'secondary'}>
                        +{achievement.points}
                      </Badge>
                    </div>
                  </div>
                  
                  {achievement.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-green-600 font-semibold"
                    >
                      ✅ Completado
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Semente Premium', price: 150, currency: 'coins', rarity: 'RARE', icon: '🌰' },
              { name: 'Fertilizante Mágico', price: 80, currency: 'coins', rarity: 'EPIC', icon: '✨' },
              { name: 'Auto-Watering System', price: 5, currency: 'gems', rarity: 'LEGENDARY', icon: '💧' },
              { name: 'LED Quantum', price: 200, currency: 'coins', rarity: 'EPIC', icon: '💡' },
              { name: 'Growth Accelerator', price: 2, currency: 'tokens', rarity: 'LEGENDARY', icon: '⚡' },
              { name: 'Organic Booster', price: 60, currency: 'coins', rarity: 'COMMON', icon: '🌿' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <Badge variant="outline" className={getRarityColor(item.rarity)}>
                        {item.rarity}
                      </Badge>
                    </div>

                    <div className="text-center mb-3">
                      <div className="flex items-center justify-center space-x-1">
                        {item.currency === 'coins' && <Coins className="h-4 w-4 text-yellow-600" />}
                        {item.currency === 'gems' && <Gem className="h-4 w-4 text-blue-600" />}
                        {item.currency === 'tokens' && <Trophy className="h-4 w-4 text-purple-600" />}
                        <span className="font-bold">{item.price}</span>
                      </div>
                    </div>

                    <Button size="sm" className="w-full" variant="outline">
                      Comprar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Plant Detail Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlant(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">
                  {selectedPlant.stage === 'SEED' ? '🌰' :
                   selectedPlant.stage === 'SEEDLING' ? '🌱' :
                   selectedPlant.stage === 'VEGETATIVE' ? '🌿' :
                   selectedPlant.stage === 'PRE_FLOWER' ? '🍀' :
                   selectedPlant.stage === 'FLOWERING' ? '🌸' : '🌳'}
                </div>
                <h2 className="text-2xl font-bold">{selectedPlant.name}</h2>
                <Badge className={getPlantStageColor(selectedPlant.stage)}>
                  {selectedPlant.stage.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Saúde</span>
                    <span className="text-sm">{selectedPlant.health}%</span>
                  </div>
                  <Progress value={selectedPlant.health} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Crescimento</span>
                    <span className="text-sm">{(selectedPlant.size * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={selectedPlant.size * 100} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Strain</p>
                    <p className="font-semibold">{selectedPlant.strain}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dias Crescendo</p>
                    <p className="font-semibold">{selectedPlant.daysGrowing}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Cuidar
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => setSelectedPlant(null)}
                    variant="secondary"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}