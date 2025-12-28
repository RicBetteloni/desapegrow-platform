import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GrowthStage, ItemType, ItemRarity, SourceType } from '@prisma/client';

function calculateHarvestReward(
  health: number,
  size: number,
  _genetics: unknown,
  _daysGrowing: number
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

function generateCardData(plant: Record<string, unknown>, quality: string, rarity: ItemRarity) {
  const genetics = plant.genetics as Record<string, unknown>;
  const size = typeof plant.size === 'number' ? plant.size : 0;
  const daysGrowing = typeof plant.daysGrowing === 'number' ? plant.daysGrowing : 0;
  const health = typeof plant.health === 'number' ? plant.health : 0;
  
  return {
    id: plant.id,
    name: plant.name,
    strain: plant.strain,
    quality,
    rarity,
    stats: {
      thc: genetics?.thc || 'Unknown',
      cbd: genetics?.cbd || 'Unknown',
      totalYield: `${size.toFixed(1)}g`,
      growTime: `${daysGrowing.toFixed(0)} days`,
      finalHealth: `${health}%`
    },
    genetics,
    harvestedAt: new Date().toISOString(),
    growId: plant.growId
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
      plant.size,
      plant.genetics,
      plant.daysGrowing
    );

    // Gerar card NFT-style
    const cardData = generateCardData(plant, quality, rarity);

    // Atualizar planta como colhida
    await prisma.virtualPlant.update({
      where: { id: plantId },
      data: {
        harvestedAt: new Date(),
        cardGenerated: true,
        cardData
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
        effects: cardData,
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
