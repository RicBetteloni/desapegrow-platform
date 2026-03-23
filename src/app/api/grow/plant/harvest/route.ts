import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GrowthStage, ItemType, ItemRarity, SourceType, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

function calculateHarvestReward(
  health: number,
  size: number
): { coins: number; gems: number; rarity: ItemRarity; quality: string } {
  // Garantir valores válidos
  const safeHealth = typeof health === 'number' ? health : 0;
  const safeSize = typeof size === 'number' ? size : 0;
  
  // Calcular qualidade baseado em saúde e tempo
  let quality = 'Poor';
  let rarity: ItemRarity = ItemRarity.COMMON;
  let multiplier = 1.0;

  if (safeHealth >= 90 && safeSize >= 5.0) {
    quality = 'Perfect';
    rarity = ItemRarity.LEGENDARY;
    multiplier = 3.0;
  } else if (safeHealth >= 75 && safeSize >= 4.0) {
    quality = 'Excellent';
    rarity = ItemRarity.EPIC;
    multiplier = 2.5;
  } else if (safeHealth >= 60 && safeSize >= 3.0) {
    quality = 'Good';
    rarity = ItemRarity.RARE;
    multiplier = 2.0;
  } else if (safeHealth >= 45 && safeSize >= 2.0) {
    quality = 'Fair';
    rarity = ItemRarity.UNCOMMON;
    multiplier = 1.5;
  }

  const baseCoins = 300;
  const baseGems = 10;

  return {
    coins: Math.floor(baseCoins * multiplier),
    gems: Math.floor(baseGems * multiplier),
    rarity,
    quality
  };
}

function generateCardData(plant: Record<string, unknown>, quality: string, rarity: ItemRarity): Record<string, string | number | boolean | null> {
  const genetics = plant.genetics as Record<string, unknown>;
  const size = typeof plant.size === 'number' ? plant.size : 0;
  const daysGrowing = typeof plant.daysGrowing === 'number' ? plant.daysGrowing : 0;
  const health = typeof plant.health === 'number' ? plant.health : 0;
  
  return {
    id: String(plant.id),
    name: String(plant.name),
    strain: String(plant.strain),
    quality,
    rarity,
    thc: String(genetics?.thc || 'Unknown'),
    cbd: String(genetics?.cbd || 'Unknown'),
    totalYield: `${size.toFixed(1)}g`,
    growTime: `${daysGrowing.toFixed(0)} days`,
    finalHealth: `${health}%`,
    harvestedAt: new Date().toISOString(),
    growId: String(plant.growId)
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { plantId } = await req.json();

    if (!plantId) {
      return NextResponse.json({ error: 'ID da planta é obrigatório' }, { status: 400 });
    }

    console.log('🌿 Colhendo planta:', plantId);

    const plant = await prisma.virtualPlant.findUnique({
      where: { id: plantId },
      include: { grow: true }
    });

    if (!plant || plant.grow.userId !== session.user.id) {
      return NextResponse.json({ error: 'Planta não encontrada' }, { status: 404 });
    }

    if (plant.stage !== GrowthStage.HARVEST_READY) {
      return NextResponse.json({ 
        error: 'Planta ainda não está pronta para colheita!' 
      }, { status: 400 });
    }

    if (plant.harvestedAt) {
      return NextResponse.json({ 
        error: 'Esta planta já foi colhida!' 
      }, { status: 400 });
    }

    // Calcular recompensas
    const { coins, gems, rarity, quality } = calculateHarvestReward(
      plant.health,
      plant.size
    );

    // Gerar card NFT-style
    const cardData = generateCardData(plant, quality, rarity);

    // Atualizar planta como colhida
    await prisma.virtualPlant.update({
      where: { id: plantId },
      data: {
        harvestedAt: new Date(),
        cardGenerated: true,
        cardData: cardData as Prisma.InputJsonValue
      }
    });

    // Adicionar recompensas
    await prisma.virtualGrow.update({
      where: { id: plant.growId },
      data: {
        cultivoCoins: { increment: coins },
        growthGems: { increment: gems },
        harvestTokens: { increment: 1 }
      }
    });

    // Criar card no inventário
    const cardItem = await prisma.virtualItem.create({
      data: {
        growId: plant.growId,
        itemType: ItemType.DECORATION,
        rarity,
        name: `Card: ${plant.name} (${quality})`,
        iconUrl: `/cards/${rarity.toLowerCase()}-card.png`,
        effects: cardData as Prisma.InputJsonValue,
        sourceType: SourceType.HARVEST,
        sourceId: plantId
      }
    });

    console.log(`✅ Planta colhida! Qualidade: ${quality}, Recompensas: ${coins} coins, ${gems} gems`);

    return NextResponse.json({
      success: true,
      harvest: {
        card: cardItem,
        rewards: {
          coins,
          gems,
          harvestTokens: 1
        },
        quality,
        rarity
      }
    });
  } catch (error) {
    console.error('❌ Erro ao colher planta:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
