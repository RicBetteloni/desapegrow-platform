// src/app/api/reports/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reportType, config, format = 'json' } = await request.json()

    // Generate report data based on type
    let reportData
    switch (reportType) {
      case 'sales':
        reportData = await generateSalesReport(config)
        break
      case 'gamification':
        reportData = await generateGamificationReport(config)
        break
      case 'users':
        reportData = await generateUsersReport(config)
        break
      case 'overview':
        reportData = await generateOverviewReport(config)
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Generate report file
    if (format === 'pdf') {
      // Simular geração de PDF
      const pdfContent = generatePDFContent(reportData, reportType)
      
      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${reportType}-report-${Date.now()}.pdf"`
        }
      })
    } else {
      // Return JSON data
      return NextResponse.json({
        success: true,
        data: reportData,
        generatedAt: new Date().toISOString(),
        reportType,
        format
      })
    }

  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({
      error: 'Failed to generate report'
    }, { status: 500 })
  }
}

async function generateSalesReport(config: ReportConfig) {
  const { startDate, endDate, groupBy = 'day' } = config

  // Mock realistic sales data
  const salesData = []
  const start = new Date(startDate || '2024-01-01')
  const end = new Date(endDate || new Date())
  
  // Generate daily sales data
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    const baseValue = 1000 + Math.sin(date.getDate() / 30) * 300
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0
    const revenue = Math.round(baseValue * weekendMultiplier * (0.8 + Math.random() * 0.4))
    const orders = Math.round(revenue / 250 * (0.8 + Math.random() * 0.4))
    
    salesData.push({
      date: date.toISOString().split('T')[0],
      revenue,
      orders,
      avgTicket: orders > 0 ? revenue / orders : 0
    })
  }

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)

  // Top products simulation
  const topProducts = [
    { name: 'LED Grow Light 150W Full Spectrum', sales: 145, revenue: 27455, category: 'Iluminação' },
    { name: 'Sistema Hidropônico NFT Completo', sales: 89, revenue: 26671, category: 'Hidroponia' },
    { name: 'Fertilizante Orgânico Premium 1kg', sales: 267, revenue: 12256, category: 'Fertilizantes' },
    { name: 'Substrato Fibra de Coco 15L', sales: 156, revenue: 9360, category: 'Substratos' },
    { name: 'Timer Digital Automático', sales: 98, revenue: 7840, category: 'Automação' }
  ]

  // Categories performance
  const categoriesPerformance = [
    { name: 'Equipamentos de Iluminação', revenue: 45320, orders: 89, growth: 15.2 },
    { name: 'Sistemas Hidropônicos', revenue: 38750, orders: 67, growth: 22.1 },
    { name: 'Fertilizantes e Nutrição', revenue: 28940, orders: 145, growth: 8.7 },
    { name: 'Substratos e Vasos', revenue: 18650, orders: 98, growth: 12.3 },
    { name: 'Automação e Controle', revenue: 12340, orders: 56, growth: 18.9 }
  ]

  return {
    summary: {
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      period: { startDate, endDate },
      daysAnalyzed: salesData.length
    },
    timeline: salesData,
    topProducts,
    categoriesPerformance,
    insights: [
      'Vendas de LED cresceram 34% no período',
      'Fins de semana têm 30% menos vendas em média',
      'Categoria Hidroponia teve maior crescimento',
      'Ticket médio aumentou 8% vs período anterior'
    ]
  }
}

async function generateGamificationReport(config: ReportConfig) {
  const { startDate, endDate } = config

  // Points statistics simulation
  const pointsStats = {
    totalAwarded: 127500,
    totalSpent: 23400,
    activeBalance: 104100,
    transactions: 2847
  }

  // User engagement simulation
  const userEngagement = {
    totalUsers: 1847,
    activeUsers: 523,
    engagementRate: 28.3,
    avgPointsPerUser: 69.1
  }

  // Level distribution
  const levelDistribution = [
    { level: 'INICIANTE', count: 1205, percentage: 65.2 },
    { level: 'JARDINEIRO', count: 458, percentage: 24.8 },
    { level: 'ESPECIALISTA', count: 156, percentage: 8.4 },
    { level: 'MESTRE', count: 28, percentage: 1.5 }
  ]

  // Badge statistics
  const badgeStats = [
    { name: 'Primeira Compra', earned: 234, rarity: 'common' },
    { name: 'Expert em LED', earned: 67, rarity: 'rare' },
    { name: 'Review Master', earned: 45, rarity: 'epic' },
    { name: 'Hidro Guru', earned: 23, rarity: 'legendary' },
    { name: 'Community Helper', earned: 89, rarity: 'rare' }
  ]

  // Top contributors
  const topContributors = [
    { name: 'Maria Silva', points: 2450, level: 'ESPECIALISTA', badges: 12 },
    { name: 'João Costa', points: 2100, level: 'JARDINEIRO', badges: 8 },
    { name: 'Ana Santos', points: 1890, level: 'JARDINEIRO', badges: 7 },
    { name: 'Pedro Lima', points: 1650, level: 'INICIANTE', badges: 5 },
    { name: 'Carlos Oliveira', points: 1420, level: 'INICIANTE', badges: 4 }
  ]

  return {
    summary: {
      pointsStats,
      userEngagement,
      period: { startDate, endDate }
    },
    levelDistribution,
    badgeStats,
    topContributors,
    challenges: {
      active: 12,
      completed: 89,
      participation: 34.2
    },
    insights: [
      '28% dos usuários estão ativamente engajados',
      'Badges Epic têm maior impacto no engajamento',
      'Sistema de pontos gerou 15% mais reviews',
      'Usuários ESPECIALISTA gastam 3x mais'
    ]
  }
}

interface UserGrowthDay {
    date: string
    newUsers: number
    cumulativeUsers: number
}

async function generateUsersReport(config: ReportConfig) {
  const { startDate, endDate } = config

  // User growth simulation
  const userGrowth: UserGrowthDay[] = []
  const start = new Date(startDate || '2024-01-01')
  const end = new Date(endDate || new Date())
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const newUsers = Math.round(5 + Math.random() * 10)

    userGrowth.push({
        date: date.toISOString().split('T')[0],
        newUsers,
        cumulativeUsers: userGrowth.reduce((sum: number, day: UserGrowthDay) => sum + day.newUsers, 0) + newUsers
    } as UserGrowthDay)
  }

  // User segments
  const userSegments = [
    { segment: 'Compradores Ativos', count: 456, percentage: 24.7 },
    { segment: 'Navegadores', count: 823, percentage: 44.6 },
    { segment: 'Avaliadores', count: 234, percentage: 12.7 },
    { segment: 'Vendedores', count: 89, percentage: 4.8 },
    { segment: 'Inativos', count: 245, percentage: 13.3 }
  ]

  // Demographics simulation
  const demographics = {
    ageGroups: [
      { range: '18-25', count: 298, percentage: 16.1 },
      { range: '26-35', count: 567, percentage: 30.7 },
      { range: '36-45', count: 489, percentage: 26.5 },
      { range: '46-55', count: 312, percentage: 16.9 },
      { range: '55+', count: 181, percentage: 9.8 }
    ],
    locations: [
      { state: 'São Paulo', count: 567, percentage: 30.7 },
      { state: 'Rio de Janeiro', count: 298, percentage: 16.1 },
      { state: 'Minas Gerais', count: 234, percentage: 12.7 },
      { state: 'Paraná', count: 189, percentage: 10.2 },
      { state: 'Outros', count: 559, percentage: 30.3 }
    ]
  }

  return {
    summary: {
      totalUsers: 1847,
      newUsers: userGrowth.reduce((sum, day) => sum + day.newUsers, 0),
      activeUsers: 523,
      retentionRate: 68.4,
      period: { startDate, endDate }
    },
    growth: userGrowth,
    segments: userSegments,
    demographics,
    behavior: {
      avgSessionDuration: 8.3,
      avgPagesPerSession: 5.7,
      bounceRate: 34.2,
      conversionRate: 3.8
    },
    insights: [
      'Crescimento de 22% em novos usuários',
      'Retenção melhorou com gamificação',
      'SP e RJ concentram 47% da base',
      'Faixa 26-45 anos mais engajada'
    ]
  }
}

interface ReportConfig {
  startDate?: string
  endDate?: string
  groupBy?: string
}

async function generateOverviewReport(config: ReportConfig) {
  const sales = await generateSalesReport(config)
  const gamification = await generateGamificationReport(config)
  const users = await generateUsersReport(config)

  return {
    executive: {
      totalRevenue: sales.summary.totalRevenue,
      totalOrders: sales.summary.totalOrders,
      totalUsers: users.summary.totalUsers,
      activeUsers: users.summary.activeUsers,
      totalPoints: gamification.summary.pointsStats.totalAwarded,
      engagementRate: gamification.summary.userEngagement.engagementRate
    },
    highlights: [
      `Receita total: R$ ${sales.summary.totalRevenue.toLocaleString('pt-BR')}`,
      `${users.summary.newUsers} novos usuários no período`,
      `${gamification.summary.pointsStats.totalAwarded.toLocaleString('pt-BR')} pontos distribuídos`,
      `Taxa de engajamento: ${gamification.summary.userEngagement.engagementRate}%`
    ],
    keyMetrics: {
      sales: sales.summary,
      users: users.summary,
      gamification: gamification.summary
    },
    recommendations: [
      'Investir mais em campanhas de LED (alta conversão)',
      'Expandir programa de gamificação',
      'Focar retenção em usuários iniciantes',
      'Desenvolver funcionalidades mobile'
    ]
  }
}

function generatePDFContent(data: object, reportType: string): string {
  // Simular conteúdo PDF como string para demonstração
  const pdfMock = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
100 700 Td
(Relatório ${reportType} - Desapegrow) Tj
0 -20 Td
(Gerado em: ${new Date().toLocaleString('pt-BR')}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000206 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
356
%%EOF`

  return pdfMock
}