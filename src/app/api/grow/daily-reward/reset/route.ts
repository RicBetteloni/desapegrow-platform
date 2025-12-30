import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

// API TEMPORÁRIA PARA TESTES - REMOVER EM PRODUÇÃO
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const userId = session.user.id

    // Buscar VirtualGrow
    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId }
    })

    if (!virtualGrow) {
      return NextResponse.json({ error: 'VirtualGrow não encontrado' }, { status: 404 })
    }

    // Buscar última recompensa
    const lastReward = await prisma.dailyRewardLog.findFirst({
      where: {
        userId,
        growId: virtualGrow.id
      },
      orderBy: {
        rewardDate: 'desc'
      }
    })

    if (!lastReward) {
      return NextResponse.json({
        success: false,
        message: 'Nenhuma recompensa encontrada para resetar'
      })
    }

    // Deletar última recompensa
    await prisma.dailyRewardLog.delete({
      where: {
        id: lastReward.id
      }
    })

    console.log('🔄 Reset de recompensa diária realizado para:', userId)

    return NextResponse.json({
      success: true,
      message: 'Última recompensa resetada! Você pode resgatar novamente.'
    })

  } catch (error) {
    console.error('❌ Erro ao resetar recompensa:', error)
    return NextResponse.json(
      { error: 'Erro ao resetar recompensa' },
      { status: 500 }
    )
  }
}
