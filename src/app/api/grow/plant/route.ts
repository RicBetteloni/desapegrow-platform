import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GrowthStage, ItemType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;
    
    const { seedItemId, plantName } = await req.json();

    if (!seedItemId) {
      return NextResponse.json({ error: 'ID da seed é obrigatório' }, { status: 400 });
    }

    console.log('🌱 Plantando seed:', seedItemId);

    // Buscar VirtualGrow
    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId }
    });

    if (!virtualGrow) {
      return NextResponse.json({ error: 'VirtualGrow não encontrado' }, { status: 404 });
    }

    // Verificar se a seed existe no inventário
    const seedItem = await prisma.virtualItem.findFirst({
      where: {
        id: seedItemId,
        growId: virtualGrow.id,
        itemType: ItemType.GENETICS
      }
    });

    if (!seedItem) {
      return NextResponse.json({ error: 'Seed não encontrada no inventário' }, { status: 404 });
    }

    // Extrair dados da genética
    const effects = seedItem.effects as Record<string, unknown>;
    const genetics = effects.genetics || {};
    const strain = effects.strain || 'HYBRID';

    // Criar a planta
    const plant = await prisma.virtualPlant.create({
      data: {
        growId: virtualGrow.id,
        name: plantName || seedItem.name.replace('🌱 ', '').replace('🌿 ', '').replace('✨ ', ''),
        strain: strain as any,
        genetics: genetics,
        stage: GrowthStage.SEED,
        daysGrowing: 0,
        health: 100,
        size: 0.1,
        waterLevel: 100,
        vpdLevel: 1.0,
        lightHours: 18
      }
    });

    // Remover a seed do inventário (foi plantada)
    await prisma.virtualItem.delete({
      where: { id: seedItemId }
    });

    console.log('✅ Planta criada:', plant.id);

    return NextResponse.json({
      success: true,
      plant: {
        id: plant.id,
        name: plant.name,
        strain: plant.strain,
        stage: plant.stage,
        genetics: plant.genetics
      }
    });
  } catch (error) {
    console.error('❌ Erro ao plantar seed:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
