// src/app/api/grow/coins/route.ts
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

    // Buscar VirtualGrow e GameProfile
    const [virtualGrow, gameProfile] = await Promise.all([
      prisma.virtualGrow.findUnique({
        where: { userId: session.user.id }
      }),
      prisma.gameProfile.findUnique({
        where: { userId: session.user.id }
      })
    ]);

    // Se não existir, criar com valores padrão
    if (!virtualGrow) {
      const newGrow = await prisma.virtualGrow.create({
        data: { userId: session.user.id }
      });
      
      return NextResponse.json({
        cultivoCoins: newGrow.cultivoCoins,
        growthGems: newGrow.growthGems,
        harvestTokens: newGrow.harvestTokens,
        experiencePoints: newGrow.experiencePoints,
        prestigeLevel: newGrow.prestigeLevel,
        totalPoints: gameProfile?.totalPoints || 0,
        availablePoints: gameProfile?.availablePoints || 0,
        currentLevel: gameProfile?.currentLevel || 'INICIANTE'
      });
    }

    return NextResponse.json({
      cultivoCoins: virtualGrow.cultivoCoins,
      growthGems: virtualGrow.growthGems,
      harvestTokens: virtualGrow.harvestTokens,
      experiencePoints: virtualGrow.experiencePoints,
      prestigeLevel: virtualGrow.prestigeLevel,
      totalPoints: gameProfile?.totalPoints || 0,
      availablePoints: gameProfile?.availablePoints || 0,
      currentLevel: gameProfile?.currentLevel || 'INICIANTE'
    });

  } catch (error) {
    console.error('Erro ao buscar moedas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}