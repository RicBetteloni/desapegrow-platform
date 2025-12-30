import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GrowthStage, PlantCareType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Mapeamento de estágios e tempo necessário (em horas)
const STAGE_DURATIONS = {
  SEED: 48, // 2 dias para germinar
  SEEDLING: 168, // 7 dias
  VEGETATIVE: 336, // 14 dias
  PRE_FLOWER: 168, // 7 dias
  FLOWERING: 504, // 21 dias
  HARVEST_READY: 0 // pronta para colher
};

const NEXT_STAGE = {
  SEED: 'SEEDLING',
  SEEDLING: 'VEGETATIVE',
  VEGETATIVE: 'PRE_FLOWER',
  PRE_FLOWER: 'FLOWERING',
  FLOWERING: 'HARVEST_READY',
  HARVEST_READY: 'HARVEST_READY'
};

function calculateGrowthProgress(
  stage: GrowthStage,
  daysGrowing: number,
  health: number,
  waterLevel: number,
  vpdLevel: number
): { shouldAdvance: boolean; healthPenalty: number; progress: number } {
  const stageDuration = STAGE_DURATIONS[stage] / 24; // converter para dias
  
  // Calcular penalidade de saúde baseado em cuidados
  let healthPenalty = 0;
  if (waterLevel < 30) healthPenalty += 10;
  else if (waterLevel < 50) healthPenalty += 5;
  
  if (vpdLevel < 0.8 || vpdLevel > 1.6) healthPenalty += 5;
  
  // Progresso (0-100%)
  const progress = Math.min(100, (daysGrowing / stageDuration) * 100);
  
  // Só avança se tiver progresso suficiente E saúde acima de 50
  const shouldAdvance = progress >= 100 && health > 50;
  
  return { shouldAdvance, healthPenalty, progress };
}

// API para cuidar da planta
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { plantId, careType, value } = await req.json();

    if (!plantId || !careType) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios faltando' }, { status: 400 });
    }

    console.log(`💧 Cuidando da planta ${plantId}: ${careType}`);

    const plant = await prisma.virtualPlant.findUnique({
      where: { id: plantId },
      include: { grow: true }
    });

    if (!plant || plant.grow.userId !== session.user.id) {
      return NextResponse.json({ error: 'Planta não encontrada' }, { status: 404 });
    }

    // Aplicar cuidado baseado no tipo
    const updates: Record<string, unknown> = { lastCareAt: new Date() };
    let message = '';
    let coinsCost = 0;

    switch (careType) {
      case PlantCareType.WATER:
        updates.waterLevel = Math.min(100, plant.waterLevel + (value || 50));
        message = '💧 Planta regada!';
        break;
        
      case PlantCareType.VPD_ADJUST:
        updates.vpdLevel = value || 1.2;
        message = '🌡️ VPD ajustado!';
        coinsCost = 10;
        break;
        
      case PlantCareType.LIGHT_ADJUST:
        updates.lightHours = Math.min(24, Math.max(12, value || 18));
        message = '💡 Iluminação ajustada!';
        break;
        
      case PlantCareType.NUTRIENT:
        updates.health = Math.min(100, plant.health + (value || 10));
        message = '🧪 Nutrientes aplicados!';
        coinsCost = 15;
        break;
        
      default:
        return NextResponse.json({ error: 'Tipo de cuidado inválido' }, { status: 400 });
    }

    // Verificar se tem coins suficientes
    if (coinsCost > 0 && plant.grow.cultivoCoins < coinsCost) {
      return NextResponse.json({ error: 'Coins insuficientes' }, { status: 400 });
    }

    // Atualizar planta
    const updatedPlant = await prisma.virtualPlant.update({
      where: { id: plantId },
      data: updates
    });

    // Descontar coins se necessário
    if (coinsCost > 0) {
      await prisma.virtualGrow.update({
        where: { id: plant.growId },
        data: { cultivoCoins: { decrement: coinsCost } }
      });
    }

    // Registrar no log
    await prisma.plantCareLog.create({
      data: {
        plantId,
        careType,
        value: value || 0,
        notes: message
      }
    });

    console.log('✅ Cuidado aplicado:', message);

    return NextResponse.json({
      success: true,
      message,
      coinsCost,
      plant: updatedPlant
    });
  } catch (error) {
    console.error('❌ Erro ao cuidar da planta:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// API para atualizar crescimento (chamado periodicamente)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { plantId } = await req.json();

    const plant = await prisma.virtualPlant.findUnique({
      where: { id: plantId },
      include: { grow: true }
    });

    if (!plant || plant.grow.userId !== session.user.id) {
      return NextResponse.json({ error: 'Planta não encontrada' }, { status: 404 });
    }

    // Calcular tempo desde último cuidado
    const hoursSinceLastCare = (Date.now() - plant.lastCareAt.getTime()) / (1000 * 60 * 60);
    
    // Degradação natural
    const waterLevel = Math.max(0, plant.waterLevel - (hoursSinceLastCare * 2));
    let health = plant.health;
    
    // Calcular progresso
    const { shouldAdvance, healthPenalty, progress } = calculateGrowthProgress(
      plant.stage,
      plant.daysGrowing,
      health,
      waterLevel,
      plant.vpdLevel
    );

    health = Math.max(0, health - healthPenalty);

    const updates: Record<string, unknown> = {
      waterLevel,
      health,
      daysGrowing: plant.stage === GrowthStage.HARVEST_READY ? plant.daysGrowing : plant.daysGrowing + (hoursSinceLastCare / 24)
    };

    if (shouldAdvance && plant.stage !== GrowthStage.HARVEST_READY) {
      updates.stage = NEXT_STAGE[plant.stage];
      console.log(`🌱 Planta ${plantId} avançou para: ${updates.stage}`);
    }

    const updatedPlant = await prisma.virtualPlant.update({
      where: { id: plantId },
      data: updates
    });

    return NextResponse.json({
      success: true,
      plant: updatedPlant,
      progress,
      advanced: shouldAdvance
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar crescimento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
