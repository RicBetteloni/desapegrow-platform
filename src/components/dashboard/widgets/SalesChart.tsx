// src/components/dashboard/widgets/SalesChart.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, BarChart3, LineChart } from 'lucide-react'
import { motion } from 'framer-motion'

interface SalesDataPoint {
  date: string
  value: number
  orders: number
}

interface SalesData {
  timeline: SalesDataPoint[]
  total: number
  growth: number
  peak: {
    date: string
    value: number
  }
  avgDaily: number
}

interface SalesChartProps {
  period: string
  className?: string
}

export function SalesChart({ period, className }: SalesChartProps) {
  const [data, setData] = useState<SalesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  useEffect(() => {
    fetchSalesData()
  }, [period])

  const fetchSalesData = async () => {
    try {
      // Simular dados realistas baseados no período
      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
      const timeline: SalesDataPoint[] = []
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Gerar dados com sazonalidade e variação realista
        const baseValue = 1000 + Math.sin(i / 30) * 300
        const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.0
        const randomVariation = (Math.random() - 0.5) * 400
        const value = Math.max(200, baseValue * weekendMultiplier + randomVariation)
        
        timeline.push({
          date: date.toISOString().split('T')[0],
          value: Math.round(value),
          orders: Math.round(value / 200) + Math.round(Math.random() * 5)
        })
      }
      
      const total = timeline.reduce((sum, point) => sum + point.value, 0)
      const peak = timeline.reduce((max, point) => 
        point.value > max.value ? point : max, timeline[0])
      
      // Simular crescimento vs período anterior
      const growth = 15.2 + (Math.random() - 0.5) * 20
      
      const mockData: SalesData = {
        timeline,
        total,
        growth,
        peak,
        avgDaily: total / timeline.length
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Calcular estatísticas adicionais
  const maxValue = Math.max(...data.timeline.map(d => d.value))
  const minValue = Math.min(...data.timeline.map(d => d.value))
  const totalOrders = data.timeline.reduce((sum, point) => sum + point.orders, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Vendas ao Longo do Tempo</span>
            </CardTitle>
            <CardDescription>
              Evolução das vendas no período selecionado
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChart className="h-4 w-4 mr-1" />
              Linha
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Barras
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {data.total.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Total no Período</p>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center justify-center ${
              data.growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.growth >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data.growth).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Crescimento</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              R$ {data.peak.value.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Pico ({new Date(data.peak.date).toLocaleDateString('pt-BR')})
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">Total Pedidos</p>
          </div>
        </div>

        {/* Chart Area - Simulação Visual */}
        <div className="relative h-64 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-4 flex flex-col justify-end"
          >
            {/* Simulação de barras/linha para demonstração visual */}
            <div className="flex items-end justify-between h-full">
              {data.timeline.slice(-20).map((point, index) => {
                const height = (point.value / maxValue) * 100
                return (
                  <motion.div
                    key={point.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      chartType === 'bar' 
                        ? 'w-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm' 
                        : 'w-1 bg-blue-600 rounded-full'
                    }`}
                    title={`${point.date}: R$ ${point.value.toLocaleString('pt-BR')}`}
                  />
                )
              })}
            </div>
            
            {/* Overlay com informações */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {chartType === 'line' ? '📈' : '📊'}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {chartType === 'line' ? 'Gráfico de Linha' : 'Gráfico de Barras'} das Vendas
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.timeline.length} pontos de dados
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="font-semibold text-green-700">
              R$ {data.avgDaily.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-green-600">Média Diária</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="font-semibold text-blue-700">
              R$ {maxValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-blue-600">Melhor Dia</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded">
            <div className="font-semibold text-orange-700">
              R$ {minValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-orange-600">Menor Dia</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className={`font-semibold ${
              data.growth >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {data.growth >= 0 ? 'Crescimento' : 'Declínio'}
            </div>
            <div className={`text-xs ${
              data.growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              Tendência Geral
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-1">💡 Insights:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {data.growth >= 0 ? 'Vendas em crescimento' : 'Vendas em declínio'} no período</li>
            <li>• Melhor performance: {new Date(data.peak.date).toLocaleDateString('pt-BR')}</li>
            <li>• Média de {(totalOrders / data.timeline.length).toFixed(1)} pedidos/dia</li>
            <li>• Ticket médio: R$ {(data.total / totalOrders).toLocaleString('pt-BR')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}