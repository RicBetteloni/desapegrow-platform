'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Zap, 
  Gift, 
  Users, 
  TrendingUp, 
  Crown,
  Coins,
  Target,
  Award,
  Sparkles,
  Gamepad2,
  ShoppingCart,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'

interface UserStats {
  level: number
  xp: number
  nextLevelXp: number
  cultivoCoins: number
  totalBadges: number
  streak: number
  ranking: number
}

export function GamificationGuide() {
  const [userStats] = useState<UserStats>({
    level: 8,
    xp: 3250,
    nextLevelXp: 5000,
    cultivoCoins: 1480,
    totalBadges: 12,
    streak: 15,
    ranking: 47
  })

  const [activeTab, setActiveTab] = useState<string>('overview')
  const [showConfetti, setShowConfetti] = useState<boolean>(false)

  const handleConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🏆</div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-green-600">
          GUIA COMPLETO DE GAMIFICAÇÃO
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
          <span className="font-semibold text-green-600">Como se Tornar uma Lenda do Cultivo!</span> 
          <br />
          Descubra os segredos para dominar o marketplace!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleConfetti}>
            <Sparkles className="w-5 h-5 mr-2" />
            Ver Meu Progresso
          </Button>
          <Button size="lg" variant="outline" className="border-green-600 text-green-600">
            <Trophy className="w-5 h-5 mr-2" />
            Rankings
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{userStats.level}</div>
              <div className="text-green-100 text-sm">Nível Atual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userStats.cultivoCoins}</div>
              <div className="text-green-100 text-sm">CultivoCoins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userStats.totalBadges}</div>
              <div className="text-green-100 text-sm">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">#{userStats.ranking}</div>
              <div className="text-green-100 text-sm">Ranking</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Progresso Nível {userStats.level + 1}</span>
              <span className="text-sm">{userStats.xp}/{userStats.nextLevelXp} XP</span>
            </div>
            <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Conceito */}
      <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="text-4xl">🔥</div>
            <h2 className="text-2xl font-bold text-orange-800">O Conceito Revolucionário</h2>
            <p className="text-lg text-orange-700 max-w-4xl mx-auto">
              Na Desapegrow, cada compra é uma semente plantada no seu jardim virtual! 
              Quanto mais você cultiva, mais seu avatar digital evolui.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1 bg-white shadow-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2 p-3">
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="levels" className="flex items-center gap-2 p-3">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Níveis</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2 p-3">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2 p-3">
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="grow" className="flex items-center gap-2 p-3">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Grow</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2 p-3">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Dicas</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  CultivoCoins Economy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
                  <p className="font-semibold text-orange-800">1 CultivoCoin = R$ 0,01 desconto</p>
                  <p className="text-sm text-orange-600">Acumule e use em compras reais!</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Como Ganhar:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily rewards</span>
                      <Badge variant="secondary">50-500 CC</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Por compra</span>
                      <Badge variant="secondary">Variável</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Plant harvest</span>
                      <Badge variant="secondary">100-1000 CC</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Sistema Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold">Rankings Disponíveis:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Ranking Geral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Ranking de Compras</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Ranking Grow Virtual</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Rankings Completos
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seu Progresso Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
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
              <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} />
              <p className="mt-2 text-center text-sm">
                Faltam apenas <strong>{userStats.nextLevelXp - userStats.xp} XP</strong> para o próximo nível!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Sistema de Níveis & Experiência
              </CardTitle>
              <CardDescription>
                Descubra como ganhar XP e evoluir seus níveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Compras (Principal)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Primeira compra</span>
                      <Badge variant="secondary">500 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>R$ 0-100</span>
                      <Badge variant="secondary">50-100 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>R$ 100-300</span>
                      <Badge variant="secondary">150-300 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>R$ 600+</span>
                      <Badge className="bg-purple-100 text-purple-800">800+ XP</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Atividades Diárias</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Login diário</span>
                      <Badge variant="secondary">25 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Check-in planta</span>
                      <Badge variant="secondary">15 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Daily challenge</span>
                      <Badge className="bg-yellow-100 text-yellow-800">100 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Review produto</span>
                      <Badge variant="secondary">75 XP</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Ações Sociais</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Indicar amigo</span>
                      <Badge className="bg-purple-100 text-purple-800">200 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amigo compra</span>
                      <Badge className="bg-orange-100 text-orange-800">500 XP</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Review útil</span>
                      <Badge className="bg-green-100 text-green-800">150 XP</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Coleção de Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg bg-white">
                  <div className="text-4xl mb-2">🌰</div>
                  <div className="font-semibold text-sm mb-1">Primeira Semente</div>
                  <Badge className="text-xs bg-green-100 text-green-800">Desbloqueado</Badge>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-white opacity-50">
                  <div className="text-4xl mb-2">💡</div>
                  <div className="font-semibold text-sm mb-1">Illuminador</div>
                  <Badge className="text-xs bg-gray-100 text-gray-600">Bloqueado</Badge>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-white">
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="font-semibold text-sm mb-1">Week Warrior</div>
                  <Badge className="text-xs bg-green-100 text-green-800">Desbloqueado</Badge>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-white opacity-50">
                  <div className="text-4xl mb-2">💎</div>
                  <div className="font-semibold text-sm mb-1">Lenda</div>
                  <Badge className="text-xs bg-gray-100 text-gray-600">Bloqueado</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-500" />
                Sistema de Recompensas Diárias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl">🎁</div>
                <h3 className="text-2xl font-bold">Recompensa Diária</h3>
                <p className="text-gray-600">
                  Mantenha seu streak ativo para recompensas ainda melhores!
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">
                      {50 + userStats.streak * 5} CC
                    </div>
                    <p className="text-xs text-yellow-700">CultivoCoins</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">25 XP</div>
                    <p className="text-xs text-blue-700">Experience</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">1x</div>
                    <p className="text-xs text-purple-700">Bonus Item</p>
                  </div>
                </div>
                
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Gift className="w-5 h-5 mr-2" />
                  Resgatar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grow Virtual Tab */}
        <TabsContent value="grow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Grow Virtual: Seu Jardim Digital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Seu Jardim Virtual</h3>
                <p className="text-gray-600 mb-4">
                  Cada produto que você compra desbloqueia um item virtual correspondente!
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Acessar Grow Virtual
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-yellow-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-500" />
                  Hacks de Eficiência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">XP Maximization</h4>
                  <ul className="text-sm text-green-700 mt-1 space-y-1">
                    <li>• Stack challenges numa compra</li>
                    <li>• Compre durante events (2-3x XP)</li>
                    <li>• Never miss daily rewards</li>
                    <li>• Share every achievement</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Armadilhas Comuns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800">Não Faça</h4>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    <li>• Pular daily rewards</li>
                    <li>• Ignorar grow virtual</li>
                    <li>• Ser antisocial</li>
                    <li>• Rush prestígio</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <Crown className="w-16 h-16 mx-auto" />
                <h3 className="text-3xl font-bold">Seja Uma Lenda!</h3>
                <p className="text-purple-100 max-w-3xl mx-auto">
                  Você agora possui conhecimento secreto que 95% dos usuários não tem. 
                  Use essas estratégias, seja consistente, e em poucos meses você estará no Hall da Fama!
                </p>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Minha Jornada
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-bounce"
              style={{
                left: Math.random() * 100 + '%',
                top: '-10px',
                backgroundColor: ['#22C55E', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 3)],
                animationDelay: Math.random() * 2 + 's',
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}