'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Package, 
  Star,
  Zap,
  Trophy,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface DashboardData {
  kpis: {
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    conversionRate: number
    totalUsers: number
    activeUsers: number
    totalProducts: number
    totalReviews: number
    avgRating: number
    totalPoints: number
    activeChallenges: number
    topUserLevel: string
  }
  trends: {
    revenue: number
    orders: number
    users: number
    conversion: number
  }
  gameStats: {
    totalPointsAwarded: number
    badgesEarned: number
    levelsUnlocked: number
    challengesCompleted: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    points?: number
    user?: string
  }>
}

// Skeleton Loader para a Dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="h-28 bg-gray-200 rounded-lg"></div>
      <div className="h-28 bg-gray-200 rounded-lg"></div>
      <div className="h-28 bg-gray-200 rounded-lg"></div>
      <div className="h-28 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-48 bg-gray-200 rounded-lg"></div>
    <div className="h-64 bg-gray-200 rounded-lg"></div>
  </div>
)


export function MainDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      // Mock data para demonstração
      const mockData: DashboardData = {
        kpis: {
          totalRevenue: 125890,
          totalOrders: 234,
          avgOrderValue: 538.20,
          conversionRate: 3.8,
          totalUsers: 1847,
          activeUsers: 456,
          totalProducts: 89,
          totalReviews: 1234,
          avgRating: 4.7,
          totalPoints: 89750,
          activeChallenges: 12,
          topUserLevel: 'MESTRE'
        },
        trends: {
          revenue: 15.2,
          orders: 8.4,
          users: 22.1,
          conversion: -2.1
        },
        gameStats: {
          totalPointsAwarded: 89750,
          badgesEarned: 156,
          levelsUnlocked: 67,
          challengesCompleted: 89
        },
        recentActivity: [
          {
            id: '1',
            type: 'FIRST_PURCHASE',
            description: 'fez sua primeira compra',
            timestamp: 'há 2 minutos',
            points: 100,
            user: 'Maria Silva'
          },
          {
            id: '2',
            type: 'PRODUCT_REVIEW',
            description: 'avaliou um produto',
            timestamp: 'há 5 minutos',
            points: 50,
            user: 'João Costa'
          },
          {
            id: '3',
            type: 'BADGE_EARNED',
            description: 'conquistou badge Expert em LED',
            timestamp: 'há 8 minutos',
            points: 200,
            user: 'Pedro Santos'
          }
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const exportReport = async () => {
    try {
      // Simular download de relatório
      const link = document.createElement('a')
      link.href = 'data:text/plain;charset=utf-8,Relatório Dashboard Desapegrow\nGerado em: ' + new Date().toLocaleString()
      link.download = `dashboard-report-${selectedPeriod}.txt`
      link.click()
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  const KPICard = ({ 
    title, 
    value, 
    trend, 
    icon: Icon, 
    format = 'number',
    trendFormat = 'percent'
  }: {
    title: string
    value: number
    trend?: number
    icon: LucideIcon
    format?: 'number' | 'currency' | 'percent' | 'rating'
    trendFormat?: 'number' | 'percent'
  }) => {
    const formattedValue = format === 'currency' ? formatCurrency(value) :
                           format === 'percent' ? formatPercentage(value) :
                           format === 'rating' ? value.toFixed(1) :
                           formatNumber(value)

    const trendColor = !trend ? 'text-muted-foreground' :
                       trend > 0 ? 'text-green-600' :
                       trend < 0 ? 'text-red-600' : 'text-muted-foreground'

    const trendText = !trend ? '' :
                     trendFormat === 'percent' ? `${trend > 0 ? '+' : ''}${formatPercentage(Math.abs(trend))}` :
                     `${trend > 0 ? '+' : ''}${formatNumber(trend)}`

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold">{formattedValue}</p>
                {trend !== undefined && (
                  <p className={`text-xs ${trendColor} flex items-center mt-1`}>
                    {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {trendText} vs período anterior
                  </p>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Link href="/grow-virtual" className="flex items-center space-x-2 text-green-600 hover:text-green-700">
      <span>🌱</span>
      <span>Grow Virtual</span>
    </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Gamificado</h1>
          <p className="text-muted-foreground">
            Visão completa da sua plataforma em tempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>

          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Receita Total"
          value={data.kpis.totalRevenue}
          trend={data.trends.revenue}
          icon={DollarSign}
          format="currency"
        />
        
        <KPICard
          title="Pedidos"
          value={data.kpis.totalOrders}
          trend={data.trends.orders}
          icon={Package}
        />
        
        <KPICard
          title="Usuários Ativos"
          value={data.kpis.activeUsers}
          trend={data.trends.users}
          icon={Users}
        />
        
        <KPICard
          title="Taxa de Conversão"
          value={data.kpis.conversionRate}
          trend={data.trends.conversion}
          icon={Target}
          format="percent"
        />
      </div>

      {/* Gamification KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Métricas de Gamificação</span>
          </CardTitle>
          <CardDescription>
            Engajamento e atividade dos usuários na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(data.gameStats.totalPointsAwarded)}
              </div>
              <p className="text-sm text-muted-foreground">CultivoCoins Distribuídos</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(data.gameStats.badgesEarned)}
              </div>
              <p className="text-sm text-muted-foreground">Badges Conquistados</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatNumber(data.gameStats.levelsUnlocked)}
              </div>
              <p className="text-sm text-muted-foreground">Níveis Desbloqueados</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {formatNumber(data.gameStats.challengesCompleted)}
              </div>
              <p className="text-sm text-muted-foreground">Desafios Completos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="gamification">Gamificação</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-8 w-8 mr-2" />
                  Gráfico de vendas (integração com biblioteca de charts)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KPIs de Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Ticket Médio:</span>
                    <span className="font-bold">{formatCurrency(data.kpis.avgOrderValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Usuários:</span>
                    <span className="font-bold">{formatNumber(data.kpis.totalUsers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produtos Ativos:</span>
                    <span className="font-bold">{formatNumber(data.kpis.totalProducts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avaliação Média:</span>
                    <span className="font-bold flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {data.kpis.avgRating}/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Ranking da Comunidade</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { pos: 1, name: 'Maria Silva', points: 2450, badge: '🏆' },
                    { pos: 2, name: 'João Costa', points: 2100, badge: '🥈' },
                    { pos: 3, name: 'Ana Santos', points: 1890, badge: '🥉' },
                    { pos: 4, name: 'Pedro Lima', points: 1650, badge: '⭐' },
                    { pos: 5, name: 'Carlos Oliveira', points: 1420, badge: '⭐' }
                  ].map((user) => (
                    <div key={user.pos} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{user.badge}</span>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">#{user.pos} no ranking</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatNumber(user.points)}</p>
                        <p className="text-xs text-muted-foreground">CultivoCoins</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Pontos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-8 w-8 mr-2" />
                  Gráfico de distribuição de pontos
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente da Comunidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{activity.user} {activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                    {activity.points && (
                      <Badge variant="secondary">
                        <Zap className="h-3 w-3 mr-1" />
                        +{activity.points} pontos
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-8 w-8 mr-2" />
                  Gráfico de vendas por categoria
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance de Vendedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Ranking de vendedores
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-8 w-8 mr-2" />
                  Gráfico de crescimento
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retenção de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Análise de cohort
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'LED Grow Light 150W', sales: 45, revenue: 8505 },
                  { name: 'Sistema Hidropônico NFT', sales: 23, revenue: 6897 },
                  { name: 'Fertilizante Orgânico Premium', sales: 67, revenue: 3076 },
                  { name: 'Substrato Fibra de Coco', sales: 34, revenue: 2550 },
                  { name: 'Timer Digital Automático', sales: 28, revenue: 2240 }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.sales} vendas</p>
                      <p className="text-sm text-green-600">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tráfego e Visualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Gráfico de visualizações de páginas e produtos
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análise de Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-8 w-8 mr-2" />
                  Funil: Visitas {'->'} Adicionados ao carrinho {'->'} Compras
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}