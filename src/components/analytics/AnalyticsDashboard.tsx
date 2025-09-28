// src/components/analytics/AnalyticsDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity,
  BarChart3,
  Users,
  Eye,
  MousePointer,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalyticsData {
  realTimeMetrics: {
    activeUsers: number
    currentSessions: number
    pageViews: number
    conversionRate: number
    avgSessionDuration: number
    bounceRate: number
  }
  topPages: Array<{
    path: string
    views: number
    uniqueVisitors: number
    avgTime: string
    bounceRate: number
  }>
  userBehavior: {
    newVsReturning: {
      new: number
      returning: number
    }
    deviceBreakdown: {
      desktop: number
      mobile: number
      tablet: number
    }
    topCountries: Array<{
      country: string
      users: number
      sessions: number
    }>
  }
  conversionFunnel: {
    visits: number
    productViews: number
    cartAdds: number
    checkouts: number
    orders: number
    revenue: number
  }
  trafficSources: Array<{
    source: string
    sessions: number
    newUsers: number
    bounceRate: number
    avgSessionDuration: string
  }>
  recentEvents: Array<{
    type: string
    description: string
    timestamp: number
    value?: number
    location?: string
  }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
    
    // Auto refresh cada 30 segundos se habilitado
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchAnalyticsData, 30000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedPeriod, autoRefresh])

  const fetchAnalyticsData = async () => {
    try {
      setRefreshing(true)
      
      // Simular chamada para API de analytics
      const response = await fetch(`/api/analytics/track?period=${selectedPeriod}`)
      const realTimeData = await response.json()
      
      // Mock de dados analíticos mais detalhados
      const mockAnalyticsData: AnalyticsData = {
        realTimeMetrics: realTimeData,
        topPages: [
          {
            path: '/marketplace',
            views: 2341,
            uniqueVisitors: 1876,
            avgTime: '2:34',
            bounceRate: 34.2
          },
          {
            path: '/produtos/led-grow-light-150w-full-spectrum',
            views: 892,
            uniqueVisitors: 745,
            avgTime: '3:12',
            bounceRate: 28.1
          },
          {
            path: '/produtos/sistema-hidroponico-nft-completo',
            views: 567,
            uniqueVisitors: 489,
            avgTime: '4:23',
            bounceRate: 22.8
          },
          {
            path: '/dashboard',
            views: 456,
            uniqueVisitors: 234,
            avgTime: '5:45',
            bounceRate: 15.3
          },
          {
            path: '/auth/signin',
            views: 345,
            uniqueVisitors: 312,
            avgTime: '1:12',
            bounceRate: 67.4
          }
        ],
        userBehavior: {
          newVsReturning: {
            new: 67.3,
            returning: 32.7
          },
          deviceBreakdown: {
            desktop: 45.6,
            mobile: 41.2,
            tablet: 13.2
          },
          topCountries: [
            { country: 'Brasil', users: 1245, sessions: 2134 },
            { country: 'Estados Unidos', users: 89, sessions: 156 },
            { country: 'Argentina', users: 67, sessions: 98 },
            { country: 'Portugal', users: 45, sessions: 67 },
            { country: 'Canadá', users: 23, sessions: 34 }
          ]
        },
        conversionFunnel: realTimeData.conversionFunnel,
        trafficSources: [
          {
            source: 'Busca Orgânica',
            sessions: 1456,
            newUsers: 876,
            bounceRate: 32.1,
            avgSessionDuration: '3:42'
          },
          {
            source: 'Direto',
            sessions: 945,
            newUsers: 234,
            bounceRate: 28.9,
            avgSessionDuration: '4:15'
          },
          {
            source: 'Redes Sociais',
            sessions: 567,
            newUsers: 445,
            bounceRate: 45.2,
            avgSessionDuration: '2:18'
          },
          {
            source: 'Email Marketing',
            sessions: 234,
            newUsers: 89,
            bounceRate: 22.4,
            avgSessionDuration: '5:23'
          },
          {
            source: 'Referência',
            sessions: 123,
            newUsers: 98,
            bounceRate: 38.7,
            avgSessionDuration: '2:56'
          }
        ],
        recentEvents: realTimeData.recentEvents.map((event: AnalyticsData['recentEvents'][number]) => ({
          ...event,
          timestamp: event.timestamp,
          location: ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR'][Math.floor(Math.random() * 4)]
        }))
      }
      
      setData(mockAnalyticsData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  const formatNumber = (num: number) => num.toLocaleString('pt-BR')
  const formatCurrency = (num: number) => new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(num)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics em Tempo Real</h1>
          <p className="text-muted-foreground">
            Monitoramento detalhado do comportamento dos usuários
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAnalyticsData()}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className="h-4 w-4 mr-2" />
              Auto Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="1h">Última hora</option>
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
          </select>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Usuários Ativos</p>
              <p className="text-2xl font-bold">{data.realTimeMetrics.activeUsers}</p>
            </div>
            <Users className="h-8 w-8 text-green-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Sessões Ativas</p>
              <p className="text-2xl font-bold">{data.realTimeMetrics.currentSessions}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Page Views</p>
              <p className="text-2xl font-bold">{formatNumber(data.realTimeMetrics.pageViews || 8942)}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Taxa Conversão</p>
              <p className="text-2xl font-bold">{data.realTimeMetrics.conversionRate?.toFixed(1) || '3.8'}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Tempo Médio</p>
              <p className="text-2xl font-bold">{Math.floor((data.realTimeMetrics.avgSessionDuration || 312) / 60)}:{String((data.realTimeMetrics.avgSessionDuration || 312) % 60).padStart(2, '0')}</p>
            </div>
            <Clock className="h-8 w-8 text-pink-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Taxa Rejeição</p>
              <p className="text-2xl font-bold">{data.realTimeMetrics.bounceRate?.toFixed(1) || '34.2'}%</p>
            </div>
            <MousePointer className="h-8 w-8 text-indigo-100" />
          </div>
        </motion.div>
      </div>

      {/* Tabs de Analytics */}
      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
          <TabsTrigger value="acquisition">Aquisição</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        {/* Real Time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
                <CardDescription>Últimas 24 horas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{page.path}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>👥 {formatNumber(page.uniqueVisitors)} visitantes únicos</span>
                          <span>⏱️ {page.avgTime}</span>
                          <span>📊 {page.bounceRate.toFixed(1)}% rejeição</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatNumber(page.views)}</p>
                        <p className="text-xs text-muted-foreground">visualizações</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos em Tempo Real</CardTitle>
                <CardDescription>Atividade dos últimos minutos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {data.recentEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-2 rounded border-l-2 border-green-500 bg-green-50"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {event.description || event.type}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{new Date(event.timestamp).toLocaleTimeString('pt-BR')}</span>
                          {event.location && <span>📍 {event.location}</span>}
                          {event.value && <span>💰 {formatCurrency(event.value)}</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Jornada do usuário até a compra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {[
                  { label: 'Visitas', value: data.conversionFunnel.visits, color: 'bg-blue-500' },
                  { label: 'Visualizações', value: data.conversionFunnel.productViews, color: 'bg-green-500' },
                  { label: 'Carrinho', value: data.conversionFunnel.cartAdds, color: 'bg-yellow-500' },
                  { label: 'Checkout', value: data.conversionFunnel.checkouts, color: 'bg-orange-500' },
                  { label: 'Pedidos', value: data.conversionFunnel.orders, color: 'bg-purple-500' },
                  { label: 'Receita', value: data.conversionFunnel.revenue, color: 'bg-pink-500', isCurrency: true }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className={`${step.color} text-white rounded-lg p-4 mb-2`}>
                      <p className="text-2xl font-bold">
                        {step.isCurrency ? formatCurrency(step.value) : formatNumber(step.value)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{step.label}</p>
                    {index > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {((step.value / data.conversionFunnel.visits) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New vs Returning */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Novos</span>
                      <span className="font-bold">{data.userBehavior.newVsReturning.new.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${data.userBehavior.newVsReturning.new}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Recorrentes</span>
                      <span className="font-bold">{data.userBehavior.newVsReturning.returning.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${data.userBehavior.newVsReturning.returning}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-bold">{data.userBehavior.deviceBreakdown.desktop.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-bold">{data.userBehavior.deviceBreakdown.mobile.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Tablet</span>
                    </div>
                    <span className="font-bold">{data.userBehavior.deviceBreakdown.tablet.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Países</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.userBehavior.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{country.country}</span>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatNumber(country.users)}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(country.sessions)} sessões</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Acquisition Tab */}
        <TabsContent value="acquisition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fontes de Tráfego</CardTitle>
              <CardDescription>Como os usuários chegam ao seu site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trafficSources.map((source, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{source.source}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{formatNumber(source.sessions)}</p>
                      <p className="text-xs text-muted-foreground">sessões</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{formatNumber(source.newUsers)}</p>
                      <p className="text-xs text-muted-foreground">novos usuários</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{source.bounceRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">rejeição</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{source.avgSessionDuration}</p>
                      <p className="text-xs text-muted-foreground">duração média</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Taxa de Conversão Geral</span>
                    <span className="text-2xl font-bold text-green-600">3.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Valor Médio do Pedido</span>
                    <span className="text-2xl font-bold">R$ 287,40</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Receita por Visitante</span>
                    <span className="text-2xl font-bold">R$ 10,92</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Melhores Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'LED Grow Light 150W', conversions: 23, rate: 4.2 },
                    { name: 'Sistema Hidropônico', conversions: 18, rate: 3.8 },
                    { name: 'Fertilizante Orgânico', conversions: 31, rate: 6.1 }
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm font-medium">{product.name}</span>
                      <div className="text-right">
                        <p className="font-bold">{product.conversions}</p>
                        <p className="text-xs text-green-600">{product.rate}% conversão</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Personalizados</CardTitle>
              <CardDescription>Interações importantes dos usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { event: 'Produto Favoritado', count: 456, icon: '❤️' },
                  { event: 'Review Criado', count: 234, icon: '⭐' },
                  { event: 'Filtro Aplicado', count: 1234, icon: '🔍' },
                  { event: 'Carrinho Abandonado', count: 89, icon: '🛒' }
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 rounded-lg border">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="font-bold text-xl">{formatNumber(item.count)}</p>
                    <p className="text-sm text-muted-foreground">{item.event}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}