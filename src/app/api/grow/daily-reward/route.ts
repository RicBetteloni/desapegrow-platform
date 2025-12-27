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

    console.log('🎁 Tentando resgatar recompensa diária para:', userId)

    // Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId }
    });

    if (!virtualGrow) {
      console.log('📝 Criando VirtualGrow...')
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId }
      });
    }

    // Verificar se já resgatou nas últimas 24 horas
    const now = new Date()
    const last24h = new Date(now.getTime() - (24 * 60 * 60 * 1000))

    const lastReward = await prisma.dailyRewardLog.findFirst({
      where: {
        userId,
        growId: virtualGrow.id,
        rewardDate: { gte: last24h }
      },
      orderBy: {
        rewardDate: 'desc'
      }
    });

    if (lastReward) {
      const nextClaimTime = new Date(lastReward.rewardDate.getTime() + (24 * 60 * 60 * 1000))
      const hoursRemaining = Math.ceil((nextClaimTime.getTime() - Date.now()) / (1000 * 60 * 60))
      return NextResponse.json({ 
        error: `Você já resgatou hoje! Volte em ${hoursRemaining}h` 
      }, { status: 400 });
    }
      console.log('❌ Já resgatou hoje:', lastReward.rewardDate)
      return NextResponse.json(
        { error: 'Você já resgatou sua recompensa diária hoje!' },
        { status: 400 }
      );
    }
    
    // Calcular streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayReward = await prisma.dailyRewardLog.findFirst({
      where: {
        userId,
        growId: virtualGrow.id,
        rewardDate: {
          gte: yesterday,
          lt: today
        }
      }
    });

    const currentStreak = yesterdayReward ? (yesterdayReward.streakDay + 1) : 1;
    
    // Gerar recompensa
    const { coins, items, rarityRolled, streakDay, totalStreak, rngSeed } = getDailyRewardRNG(currentStreak - 1);
    
    console.log(`✅ Recompensa gerada: ${coins} coins, streak: ${currentStreak}`)

    // Atualizar coins no VirtualGrow
    await prisma.virtualGrow.update({
      where: { id: virtualGrow.id },
      data: {
        cultivoCoins: { increment: coins }
      }
    });

    // Registrar recompensa
    await prisma.dailyRewardLog.create({
      data: {
        userId,
        growId: virtualGrow.id,
        rewardDate: new Date(),
        coinsEarned: coins,
        streakDay: currentStreak,
        totalStreak: currentStreak,
        itemsReceived: [],
        rngSeed: rngSeed,
        rarityRolled: rarityRolled
      }
    });

    console.log('🎉 Recompensa resgatada com sucesso!')

    return NextResponse.json({
      success: true,
      reward: { coins, items, streakDay: currentStreak, totalStreak: currentStreak }
    });
  } catch (error) {
    console.error('❌ Erro ao resgatar recompensa diária:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}