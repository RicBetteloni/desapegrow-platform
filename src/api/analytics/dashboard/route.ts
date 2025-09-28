import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ItemRarity, ItemType, SourceType } from '@prisma/client';
import { Prisma } from '@prisma/client';

// Interface para o item virtual
interface VirtualItemData {
  itemType: ItemType;
  rarity: ItemRarity;
  name: string;
  iconUrl: string;
  effects: Record<string, unknown>;
  sourceType: SourceType;
  realProductId?: string;
}

// Interface para o retorno da recompensa
interface DailyRewardResult {
  coins: number;
  items: VirtualItemData[];
  rarityRolled: ItemRarity;
  streakDay: number;
  totalStreak: number;
  rngSeed: string;
}

// Sistema de RNG para recompensas diárias
function getDailyRewardRNG(streak: number, userId: string): DailyRewardResult {
  const seed = `${userId}-${new Date().toISOString().slice(0, 10)}`;
  const baseCoins = 50 + (streak * 5);
  
  // Sistema de raridade baseado no streak
  let rarityRolled: ItemRarity;
  const random = Math.random();
  
  if (streak >= 30 && random < 0.05) rarityRolled = ItemRarity.LEGENDARY;
  else if (streak >= 14 && random < 0.15) rarityRolled = ItemRarity.EPIC;
  else if (streak >= 7 && random < 0.30) rarityRolled = ItemRarity.RARE;
  else rarityRolled = ItemRarity.COMMON;

  // Gerar items baseado na raridade
  const items: VirtualItemData[] = [];
  if (rarityRolled !== ItemRarity.COMMON) {
    items.push({
      itemType: ItemType.BOOSTER,
      rarity: rarityRolled,
      name: `${rarityRolled} Growth Booster`,
      iconUrl: '/icons/booster.png',
      effects: { growth_speed: rarityRolled === ItemRarity.LEGENDARY ? 3 : 2 },
      sourceType: SourceType.DAILY_REWARD
    });
  }

  return {
    coins: baseCoins,
    items,
    rarityRolled,
    streakDay: streak + 1,
    totalStreak: streak + 1,
    rngSeed: seed
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
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

    // Verificar se já resgatou hoje
    const today = new Date().toISOString().slice(0, 10);
    const lastReward = await prisma.dailyRewardLog.findFirst({
      where: { 
        userId,
        rewardDate: {
          gte: new Date(today)
        }
      }
    });

    if (lastReward) {
      return NextResponse.json({ 
        error: 'Você já resgatou sua recompensa diária hoje!' 
      }, { status: 400 });
    }

    // Calcular streak atual
    const currentStreak = virtualGrow.experiencePoints; // Usando como proxy do streak
    
    // Gerar recompensa
    const reward = getDailyRewardRNG(currentStreak, userId);
    
    // Atualizar VirtualGrow
    await prisma.virtualGrow.update({
      where: { userId },
      data: {
        cultivoCoins: { increment: reward.coins },
        experiencePoints: { increment: 10 }
      }
    });

    // Criar items no inventário
    for (const item of reward.items) {
      await prisma.virtualItem.create({
        data: {
          growId: virtualGrow.id,
          itemType: item.itemType,
          rarity: item.rarity,
          name: item.name,
          iconUrl: item.iconUrl,
          effects: item.effects as Prisma.InputJsonValue,
          sourceType: item.sourceType
        }
      });
    }

    // Log da recompensa
    await prisma.dailyRewardLog.create({
      data: {
        userId,
        growId: virtualGrow.id,
        rewardDate: new Date(),
        streakDay: reward.streakDay,
        totalStreak: reward.totalStreak,
        coinsEarned: reward.coins,
        itemsReceived: reward.items.map(item => item.name),
        rngSeed: reward.rngSeed,
        rarityRolled: reward.rarityRolled
      }
    });

    return NextResponse.json({
      success: true,
      reward: {
        coins: reward.coins,
        items: reward.items,
        streakDay: reward.streakDay,
        totalStreak: reward.totalStreak,
        rarityRolled: reward.rarityRolled
      }
    });

  } catch (error) {
    console.error('Erro ao resgatar recompensa diária:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}