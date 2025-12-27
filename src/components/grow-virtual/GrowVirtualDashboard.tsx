import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Coins, 
  Gem, 
  Sprout, 
  Gift, 
  Trophy, 
  Star,
  Zap,
  Package,
  Calendar,
  TrendingUp,
  Heart,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'
import { DailyRewards } from './DailyRewards'

interface VirtualGrow {
  id: string
  cultivoCoins: number
  growthGems: number
  harvestTokens: number
  experiencePoints: number
  prestigeLevel: number
  inventory: Array<{
    id: string
    name: string
    rarity: string
    itemType: string
    iconUrl: string
    effects: Record<string, number>
  }>
  plants: Array<{
    id: string
    name: string
    stage: string
    health: number
    daysGrowing: number
    size: number
  }>
  canClaimDaily: boolean
  stats: {
    totalItems: number
    totalPlants: number
    level: number
    nextLevelXP: number
  }
}

export function GrowVirtualDashboard() {
  const { data: session } = useSession()
  const [growData, setGrowData] = useState<VirtualGrow | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimingReward, setClaimingReward] = useState(false)

  useEffect(() => {
    fetchGrowData()
  }, [])

  const fetchGrowData = async () => {
    try {
      const response = await fetch('/api/grow/status')
      if (response.ok) {
        const data = await response.json()
        setGrowData(data)
      } else {
        // Se a API não existir ainda, usar dados mock
        setGrowData(getMockData())
      }
    } catch (error) {
      console.error('Erro ao carregar dados do grow:', error)
      // Usar dados mock em caso de erro
      setGrowData(getMockData())
    } finally {
      setLoading(false)
    }
  }

  const getMockData = (): VirtualGrow => ({
    id: 'mock-id',
    cultivoCoins: 150,
    growthGems: 25,
    harvestTokens: 5,
    experiencePoints: 320,
    prestigeLevel: 1,
    inventory: [
      {
        id: '1',
        name: 'LED Growth Booster',
        rarity: 'RARE',
        itemType: 'LIGHTING',
        iconUrl: '/icons/led.png',
        effects: { growth_speed: 1.5 }
      },
      {
        id: '2',
        name: 'Organic Fertilizer',
        rarity: 'COMMON',
        itemType: 'NUTRIENTS',
        iconUrl: '/icons/fertilizer.png',
        effects: { health_boost: 10 }
      }
    ],
    plants: [
      {
        id: '1',
        name: 'Mudinha Verde',
        stage: 'VEGETATIVE',
        health: 85,
        daysGrowing: 15,
        size: 0.3
      }
    ],
    canClaimDaily: true,
    stats: {
      totalItems: 2,
      totalPlants: 1,
      level: 4,
      nextLevelXP: 80
    }
  })

  const claimDailyReward = async () => {
    setClaimingReward(true)
    try {
      const response = await fetch('/api/grow/daily-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`🎉 Recompensa resgatada! +${data.reward.coins} Cultivo Coins`)
        fetchGrowData() // Recarregar dados
      } else {
        toast.error(data.error || 'Erro ao resgatar recompensa')
      }
    } catch (error) {
      // Mock success para demonstração
      toast.success('🎉 Recompensa resgatada! +50 Cultivo Coins (Demo)')
      if (growData) {
        setGrowData({
          ...growData,
          cultivoCoins: growData.cultivoCoins + 50,
          canClaimDaily: false
        })
      }
    } finally {
      setClaimingReward(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      COMMON: 'bg-gray-100 text-gray-800 border-gray-300',
      RARE: 'bg-blue-100 text-blue-800 border-blue-300',
      EPIC: 'bg-purple-100 text-purple-800 border-purple-300',
      LEGENDARY: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
    return colors[rarity as keyof typeof colors] || colors.COMMON
  }

  const getStageEmoji = (stage: string) => {
    const stages = {
      SEED: '🌰',
      SEEDLING: '🌱',
      VEGETATIVE: '🌿',
      PRE_FLOWER: '🌾',
      FLOWERING: '🌸',
      HARVEST_READY: '🍃'
    }
    return stages[stage as keyof typeof stages] || '🌱'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Verificar se growData está carregado antes de renderizar
  if (!growData || !growData.stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu Grow Virtual...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-800 flex items-center gap-2">
            🌱 Meu Grow Virtual
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Nível {growData.stats.level}
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">
            {growData.stats.nextLevelXP} XP para o próximo nível • {growData.stats.totalPlants} plantas • {growData.stats.totalItems} items
          </p>
          
          {/* Barra de XP */}
          <div className="mt-2 w-full max-w-md">
            <div className="flex justify-between text-xs mb-1">
              <span>Nível {growData.stats.level}</span>
              <span>{growData.experiencePoints % 100}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300" 
                style={{width: `${(growData.experiencePoints % 100)}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Rewards Component */}
      <DailyRewards />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Cultivo Coins</CardTitle>
            <Coins className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">
              {growData.cultivoCoins.toLocaleString()}
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Moeda principal do jogo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Growth Gems</CardTitle>
            <Gem className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {growData.growthGems.toLocaleString()}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Gemas premium raras
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Harvest Tokens</CardTitle>
            <Sprout className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {growData.harvestTokens.toLocaleString()}
            </div>
            <p className="text-xs text-green-700 mt-1">
              Tokens de colheita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">XP Total</CardTitle>
            <Star className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {growData.experiencePoints.toLocaleString()}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Experiência acumulada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="plants" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Plantas
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventário
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Conquistas
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plants">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                Minhas Plantas ({growData.stats.totalPlants})
              </CardTitle>
              <CardDescription>
                Acompanhe o crescimento das suas plantas virtuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {growData.plants.length === 0 ? (
                <div className="text-center py-12">
                  <Sprout className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma planta plantada</h3>
                  <p className="text-gray-500 mb-4">Comece seu jardim virtual plantando sua primeira semente!</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Sprout className="h-4 w-4 mr-2" />
                    Plantar primeira semente
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {growData.plants.map((plant) => (
                    <Card key={plant.id} className="border-green-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{getStageEmoji(plant.stage)}</div>
                          <h4 className="font-medium text-lg text-green-800">{plant.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {plant.stage.replace('_', ' ')} • {plant.daysGrowing} dias
                          </p>
                          
                          {/* Health Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Saúde</span>
                              <span>{plant.health}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  plant.health > 70 ? 'bg-green-500' :
                                  plant.health > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{width: `${plant.health}%`}}
                              ></div>
                            </div>
                          </div>

                          {/* Tamanho */}
                          <div className="text-xs text-gray-500 mb-3">
                            Tamanho: {(plant.size * 100).toFixed(0)}cm
                          </div>

                          <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm">
                              <Heart className="h-3 w-3 mr-1" />
                              Cuidar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3 mr-1" />
                              Config
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Inventário ({growData.stats.totalItems} items)
              </CardTitle>
              <CardDescription>
                Items virtuais desbloqueados através de compras e recompensas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {growData.inventory.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Inventário vazio</h3>
                  <p className="text-gray-500 mb-4">Faça compras no marketplace para desbloquear items virtuais!</p>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ir para Marketplace
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {growData.inventory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow bg-white">
                      <div className="text-3xl mb-3">📦</div>
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.name}</h4>
                      <Badge className={`${getRarityColor(item.rarity)} text-xs mb-2`}>
                        {item.rarity}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {item.itemType.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Conquistas & Achievements
              </CardTitle>
              <CardDescription>
                Marcos alcançados no seu grow virtual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sistema em desenvolvimento</h3>
                <p className="text-gray-500">Em breve você poderá acompanhar todas as suas conquistas!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Progresso do Jogador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nível Atual</span>
                      <span className="font-bold">{growData.stats.level}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>XP Total</span>
                      <span className="font-bold">{growData.experiencePoints}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Prestígio</span>
                      <span className="font-bold">{growData.prestigeLevel}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Login realizado hoje</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Item adicionado ao inventário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Planta evoluiu de estágio</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}