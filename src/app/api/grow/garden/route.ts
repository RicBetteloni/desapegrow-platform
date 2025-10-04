// src/app/api/grow/garden/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;

    // Buscar VirtualGrow (que tem plants e inventory)
    // NÃO GameProfile (que só tem pontos e level)
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId },
      include: { 
        plants: true,
        inventory: true 
      }
    });

    // Se não existir VirtualGrow, criar um novo
    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { 
          userId,
          // Valores padrão já estão no schema
        },
        include: {
          plants: true,
          inventory: true
        }
      });
    }

    // Também buscar GameProfile para informações de level/pontos
    const gameProfile = await prisma.gameProfile.findUnique({
      where: { userId }
    });

    return NextResponse.json({
      virtualGrow: {
        id: virtualGrow.id,
        growType: virtualGrow.growType,
        growSize: virtualGrow.growSize,
        automationLevel: virtualGrow.automationLevel,
        cultivoCoins: virtualGrow.cultivoCoins,
        growthGems: virtualGrow.growthGems,
        harvestTokens: virtualGrow.harvestTokens,
        experiencePoints: virtualGrow.experiencePoints,
        prestigeLevel: virtualGrow.prestigeLevel,
        createdAt: virtualGrow.createdAt,
        updatedAt: virtualGrow.updatedAt
      },
      plants: virtualGrow.plants || [],
      inventory: virtualGrow.inventory || [],
      gameProfile: gameProfile ? {
        currentLevel: gameProfile.currentLevel,
        totalPoints: gameProfile.totalPoints,
        availablePoints: gameProfile.availablePoints,
        loginStreak: gameProfile.loginStreak
      } : null
    });

  } catch (error) {
    console.error('Erro ao buscar jardim virtual:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}

// POST - Criar nova planta no grow
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;

    const { name, strain, genetics } = await req.json();

    // Validar dados
    if (!name || !strain) {
      return NextResponse.json(
        { error: 'Nome e genética são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId }
    });

    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId }
      });
    }

    // Criar nova planta
    const plant = await prisma.virtualPlant.create({
      data: {
        growId: virtualGrow.id,
        name,
        strain,
        genetics: genetics || {},
        stage: 'SEED',
        daysGrowing: 0,
        health: 100,
        size: 0.1
      }
    });

    return NextResponse.json({
      success: true,
      plant,
      message: '🌱 Planta criada com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao criar planta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}