import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// CORRIJA ESTA LINHA - use o arquivo de tipos que criamos
import { ItemRarity, ItemType, SourceType } from '@/types/prisma'

// resto do código permanece igual...

// Interface para o item virtual (baseado no seu schema.prisma)
interface VirtualItemData {
  itemType: ItemType;
  rarity: ItemRarity;
  name: string;
  iconUrl: string;
  effects: Record<string, unknown>;
  sourceType: SourceType;
  realProductId?: string;
}

// Interface para o tipo de retorno da função de recompensa
interface DailyRewardResult {
  coins: number;
  items: VirtualItemData[];
  rarityRolled: ItemRarity;
  streakDay: number;
  totalStreak: number;
  rngSeed: string;
}

// MOCK: Helper para gerar recompensas (você pode expandir isso)
function getDailyRewardRNG(streak: number): DailyRewardResult {
  const baseCoins = 50 + streak * 5;
  const items: VirtualItemData[] = [];
  const rarityRolled: ItemRarity = ItemRarity.COMMON;
  return {
    coins: baseCoins,
    items,
    rarityRolled,
    streakDay: streak + 1,
    totalStreak: streak + 1,
    rngSeed: "mock_seed"
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;
    const { growId } = await req.json();

    let gameProfile = await prisma.gameProfile.findUnique({ where: { userId } });
    if (!gameProfile) {
      gameProfile = await prisma.gameProfile.create({ data: { userId } });
    }

    const today = new Date().toISOString().slice(0, 10);
    const lastReward = await prisma.dailyRewardLog.findFirst({
      where: { growId: gameProfile.id, rewardDate: { gte: new Date(today) } }
    });

    if (lastReward) {
      return NextResponse.json({ error: 'Você já resgatou sua recompensa diária hoje.' }, { status: 400 });
    }
    
    const streak = gameProfile.loginStreak;
    const { coins, items, rarityRolled, streakDay, totalStreak, rngSeed } = getDailyRewardRNG(streak);
    
    await prisma.gameProfile.update({
      where: { userId },
      data: {
        totalPoints: { increment: coins },
        availablePoints: { increment: coins },
        loginStreak: streakDay
      }
    });

    await prisma.dailyRewardLog.create({
      data: {
        userId,
        growId: gameProfile.id,
        rewardDate: new Date(),
        coinsEarned: coins,
        streakDay,
        totalStreak,
        itemsReceived: [],
        rngSeed,
        rarityRolled
      }
    });

    return NextResponse.json({
      success: true,
      reward: { coins, items, streakDay, totalStreak }
    });
  } catch (error) {
    console.error('Erro ao resgatar recompensa diária:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}