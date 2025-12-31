import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Validar se o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json({ 
        error: 'Sua sessão está inválida. Por favor, faça login novamente.',
        action: 'LOGOUT_REQUIRED'
      }, { status: 403 });
    }

    // Buscar dados completos do grow virtual
    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId },
      include: {
        plants: true,
        inventory: {
          orderBy: { createdAt: 'desc' }
        },
        dailyRewards: {
          orderBy: { rewardDate: 'desc' },
          take: 7
        }
      }
    });

    if (!virtualGrow) {
      // Criar grow virtual se não existir
      const newGrow = await prisma.virtualGrow.create({
        data: { userId },
        include: {
          plants: true,
          inventory: true,
          dailyRewards: true
        }
      });
      return NextResponse.json(newGrow);
    }

    // Verificar se pode resgatar recompensa diária
    const today = new Date().toISOString().slice(0, 10);
    const canClaimDaily = !virtualGrow.dailyRewards.some(
      reward => new Date(reward.rewardDate).toISOString().slice(0, 10) === today
    );

    console.log(`🌱 Plantas encontradas para usuário ${userId}:`, virtualGrow.plants.length);
    virtualGrow.plants.forEach(plant => {
      console.log(`  - ${plant.name} (${plant.stage})`);
    });

    return NextResponse.json({
      ...virtualGrow,
      canClaimDaily,
      stats: {
        totalItems: virtualGrow.inventory.length,
        totalPlants: virtualGrow.plants.length,
        level: Math.floor(virtualGrow.experiencePoints / 100) + 1,
        nextLevelXP: 100 - (virtualGrow.experiencePoints % 100)
      }
    });

  } catch (error: any) {
    console.error('❌ [GROW STATUS ERROR]:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}