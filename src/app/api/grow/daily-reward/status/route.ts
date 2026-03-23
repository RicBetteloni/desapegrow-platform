import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const userId = session.user.id

    // Validar se o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    if (!userExists) {
      return NextResponse.json({ 
        error: 'Sua sessão está inválida. Por favor, faça login novamente.',
        action: 'LOGOUT_REQUIRED'
      }, { status: 403 })
    }

    // Buscar ou criar GameProfile
    let gameProfile = await prisma.gameProfile.findUnique({
      where: { userId }
    })

    if (!gameProfile) {
      gameProfile = await prisma.gameProfile.create({
        data: { userId }
      })
    }

    // Buscar VirtualGrow para usar o growId
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId }
    })

    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId }
      })
    }

    // Verificar última recompensa (últimas 24 horas)
    const now = new Date()
    const last24h = new Date(now.getTime() - (24 * 60 * 60 * 1000))

    const lastReward = await prisma.dailyRewardLog.findFirst({
      where: {
        userId,
        growId: virtualGrow.id,
        rewardDate: {
          gte: last24h
        }
      },
      orderBy: {
        rewardDate: 'desc'
      }
    })

    const canClaim = !lastReward
    let timeUntilNext = 0
    let nextClaimTime = null

    if (lastReward) {
      // Próxima recompensa é 24h após o último resgate
      // Converter Date do PostgreSQL para JavaScript Date
      const lastDate = new Date(lastReward.rewardDate)
      const nextClaim = new Date(lastDate.getTime() + (24 * 60 * 60 * 1000))
      
      nextClaimTime = nextClaim.toISOString()
      timeUntilNext = Math.max(0, Math.floor((nextClaim.getTime() - Date.now()) / 1000))
    }

    const response = {
      canClaim,
      lastClaimDate: lastReward ? new Date(lastReward.rewardDate).toISOString() : null,
      nextClaimTime,
      currentStreak: gameProfile.loginStreak || 0,
      timeUntilNext
    }

    console.log('📊 Status API retornando:', response)

    return NextResponse.json(response)

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    const name = error instanceof Error ? error.name : 'UnknownError'
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : undefined

    console.error('❌ [DAILY REWARD STATUS ERROR]:', {
      message,
      stack,
      name,
      code
    });
    return NextResponse.json(
      { 
        error: 'Erro ao verificar status',
        details: process.env.NODE_ENV === 'development' ? message : undefined
      },
      { status: 500 }
    )
  }
}
