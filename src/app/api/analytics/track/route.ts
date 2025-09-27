// src/app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()
    const { event, data } = eventData

    // Validar dados básicos
    if (!event || !data) {
      return NextResponse.json({ error: 'Missing event or data' }, { status: 400 })
    }

    // Em produção, aqui você salvaria no banco de dados
    // await prisma.analytics.create({
    //   data: {
    //     eventType: event,
    //     userId: data.userId,
    //     productId: data.productId,
    //     date: new Date(data.timestamp),
    //     value: data.value || 0,
    //     metadata: data.metadata || {},
    //     pointsEarned: data.pointsEarned || 0
    //   }
    // })

    // Por enquanto, vamos apenas logar para debug
    console.log('[Analytics Track]', {
      event,
      userId: data.userId,
      sessionId: data.sessionId,
      timestamp: new Date(data.timestamp).toISOString(),
      metadata: data.metadata
    })

    // Processar eventos específicos que requerem ação
    await processSpecialEvents(event, data)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Retornar sucesso mesmo com erro para não quebrar o fluxo
    return NextResponse.json({ success: true })
  }
}

type EventData = OrderAchievementData | ReviewData | SignupBonusData | LevelUpData;

async function processSpecialEvents(event: string, data: EventData) {
  switch (event) {
    case 'ORDER_PLACED':
      // Processar conquistas de primeira compra, valores altos, etc.
      await processOrderAchievements(data as OrderAchievementData)
      break

    case 'PRODUCT_REVIEW':
      // Dar pontos por avaliação
      await awardReviewPoints(data as ReviewData)
      break

    case 'USER_SIGNUP':
      // Bônus de cadastro
      await awardSignupBonus(data)
      break

    case 'LEVEL_UP':
      // Notificações, badges especiais
      await processLevelUp(data as LevelUpData)
      break
  }
}

interface OrderAchievementData {
  value: number;
  userId: string;
  metadata: {
    isFirstOrder: boolean;
    itemCount: number;
  };
}

async function processOrderAchievements(data: OrderAchievementData) {
  // Simular lógica de conquistas por pedido
  const { value, userId, metadata } = data

  const achievements = []

  // Primeira compra
  if (metadata.isFirstOrder) {
    achievements.push({
      type: 'FIRST_PURCHASE',
      points: 100,
      badge: 'Primeiro Cultivador'
    })
  }

  // Compra alta
  if (value > 500) {
    achievements.push({
      type: 'HIGH_VALUE_ORDER',
      points: 50,
      badge: 'Investidor Verde'
    })
  }

  // Múltiplos produtos
  if (metadata.itemCount >= 5) {
    achievements.push({
      type: 'BULK_BUYER',
      points: 30,
      badge: 'Colecionador'
    })
  }

  // Log das conquistas (em produção salvaria no banco)
  achievements.forEach(achievement => {
    console.log('[Achievement]', userId, achievement)
  })
}

interface ReviewData {
  userId: string;
  metadata: {
    hasImages?: boolean;
    contentLength?: number;
    hasTitle?: boolean;
  };
}

async function awardReviewPoints(data: ReviewData) {
  const { userId, metadata } = data
  
  let points = 50 // Base points

  // Bonus por qualidade
  if (metadata.hasImages) points += 20
  if (metadata.contentLength && metadata.contentLength > 100) points += 15
  if (metadata.hasTitle) points += 10

  console.log('[Review Points]', userId, points, 'points awarded')
}

interface SignupBonusData {
  userId: string;
  metadata?: Record<string, unknown>;
}

async function awardSignupBonus(data: SignupBonusData) {
  const { userId } = data
  const signupBonus = 100

  console.log('[Signup Bonus]', userId, signupBonus, 'points awarded')
}

interface LevelUpData {
  userId: string;
  metadata: {
    newLevel: number;
    previousLevel: number;
  };
}

async function processLevelUp(data: LevelUpData) {
  const { userId, metadata } = data
  const { newLevel, previousLevel } = metadata

  console.log('[Level Up]', userId, `${previousLevel} -> ${newLevel}`)

  // Notificações, badges especiais, etc.
}

// API para obter métricas em tempo real
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '24h'

    // Mock de métricas em tempo real
    const realTimeMetrics = {
      activeUsers: 127,
      currentSessions: 34,
      liveEvents: 8,
      topPages: [
        { path: '/marketplace', views: 234 },
        { path: '/produtos/led-grow-light', views: 89 },
        { path: '/dashboard', views: 56 }
      ],
      recentEvents: [
        { type: 'ORDER_PLACED', value: 299.90, timestamp: Date.now() - 30000 },
        { type: 'PRODUCT_VIEW', productName: 'LED Grow Light', timestamp: Date.now() - 45000 },
        { type: 'BADGE_EARNED', badge: 'Review Master', timestamp: Date.now() - 60000 },
        { type: 'USER_SIGNUP', timestamp: Date.now() - 120000 }
      ],
      conversionFunnel: {
        visits: 1250,
        productViews: 456,
        cartAdds: 123,
        checkouts: 67,
        orders: 34
      }
    }

    return NextResponse.json(realTimeMetrics)

  } catch (error) {
    console.error('Real-time metrics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}