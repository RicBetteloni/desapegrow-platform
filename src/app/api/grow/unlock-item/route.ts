import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ItemType, ItemRarity, SourceType } from '@prisma/client';

// Mapeamento de produtos reais para items virtuais
interface VirtualItem {
  itemType: ItemType;
  rarity: ItemRarity;
  name: string;
  iconUrl: string;
  effects: Record<string, number | boolean>;
}

function getVirtualItemForProduct(productId: string, categorySlug: string): VirtualItem {
  const mappings: Record<string, VirtualItem> = {
    'iluminacao': {
      itemType: ItemType.LIGHTING,
      rarity: ItemRarity.RARE,
      name: 'Grow Light Virtual',
      iconUrl: '/icons/light.png',
      effects: { light_quality: 85, power_efficiency: 90 }
    },
    'fertilizantes': {
      itemType: ItemType.NUTRIENTS,
      rarity: ItemRarity.COMMON,
      name: 'Nutrient Booster',
      iconUrl: '/icons/nutrients.png',
      effects: { growth_boost: 20 }
    },
    'hidroponia': {
      itemType: ItemType.AUTOMATION,
      rarity: ItemRarity.EPIC,
      name: 'Hydro System',
      iconUrl: '/icons/hydro.png',
      effects: { auto_water: true, efficiency: 95 }
    },
    'substratos': {
      itemType: ItemType.SUBSTRATE,
      rarity: ItemRarity.COMMON,
      name: 'Premium Substrate',
      iconUrl: '/icons/substrate.png',
      effects: { root_health: 30 }
    }
  };

  return mappings[categorySlug] || {
    itemType: ItemType.DECORATION,
    rarity: ItemRarity.COMMON,
    name: 'Mystery Item',
    iconUrl: '/icons/mystery.png',
    effects: { prestige: 5 }
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { productId, categorySlug } = await req.json();
    const userId = session.user.id;

    // Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({ 
      where: { userId } 
    });
    
    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({ 
        data: { userId } 
      });
    }

    // Gerar item virtual baseado no produto
    const virtualItem = getVirtualItemForProduct(productId, categorySlug);
    
    // Criar item no inventário
    const createdItem = await prisma.virtualItem.create({
      data: {
        growId: virtualGrow.id,
        itemType: virtualItem.itemType,
        rarity: virtualItem.rarity,
        name: virtualItem.name,
        iconUrl: virtualItem.iconUrl,
        effects: virtualItem.effects,
        sourceType: SourceType.PURCHASE,
        realProductId: productId
      }
    });

    // Bonus coins por compra
    await prisma.virtualGrow.update({
      where: { userId },
      data: {
        cultivoCoins: { increment: 25 },
        experiencePoints: { increment: 15 }
      }
    });

    return NextResponse.json({
      success: true,
      item: createdItem,
      bonusCoins: 25,
      message: 'Item virtual desbloqueado! +25 Cultivo Coins'
    });

  } catch (error) {
    console.error('Erro ao desbloquear item virtual:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}