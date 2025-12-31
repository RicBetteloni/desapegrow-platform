import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ItemRarity, ItemType, SourceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

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

// Sistema de Recompensas Diárias com Progressão
function getDailyRewardRNG(streak: number): DailyRewardResult {
  const rngSeed = `${Date.now()}-${Math.random().toString(36)}`
  const random = Math.random()
  
  // 1. COINS PROGRESSIVOS (aumenta com streak)
  let coins = 50 // Base
  
  // Bônus por streak
  if (streak >= 1) coins += streak * 10 // +10 por dia
  
  // Bônus de marcos
  if (streak === 6) coins += 100 // 7º dia
  if (streak === 13) coins += 200 // 14º dia  
  if (streak === 29) coins += 500 // 30º dia
  if (streak === 59) coins += 1000 // 60º dia
  if (streak === 99) coins += 2000 // 100º dia
  
  // 2. BAÚ SURPRESA (chance progressiva com streak)
  const items: VirtualItemData[] = []
  let rarityRolled: ItemRarity = ItemRarity.COMMON
  
  // Chance base: 50% + 2% por dia de streak (max 90%)
  const chestChance = Math.min(0.50 + (streak * 0.02), 0.90)
  
  if (random < chestChance) {
    // Sortear raridade (quanto maior o streak, melhor a raridade)
    const rarityRoll = Math.random()
    
    if (rarityRoll < 0.02 + (streak * 0.001)) { // 2% + 0.1% por streak
      rarityRolled = ItemRarity.LEGENDARY
      coins += 200
    } else if (rarityRoll < 0.08 + (streak * 0.002)) { // 8% + 0.2% por streak
      rarityRolled = ItemRarity.EPIC
      coins += 100
    } else if (rarityRoll < 0.20 + (streak * 0.005)) { // 20% + 0.5% por streak
      rarityRolled = ItemRarity.RARE
      coins += 50
    } else if (rarityRoll < 0.40) {
      rarityRolled = ItemRarity.UNCOMMON
      coins += 25
    } else {
      rarityRolled = ItemRarity.COMMON
      coins += 10
    }
    
    // Criar item do baú surpresa
    const chestItem: VirtualItemData = {
      itemType: ItemType.BOOSTER,
      rarity: rarityRolled,
      name: `Vaso Surpresa ${rarityRolled}`,
      iconUrl: `/items/chest-${rarityRolled.toLowerCase()}.png`,
      effects: { 
        surprise: true,
        rarity: rarityRolled,
        bonus_coins: coins * 0.1 
      },
      sourceType: SourceType.DAILY_REWARD
    }
    
    console.log('🎁 Item criado na função:', chestItem)
    items.push(chestItem)
  }
  
  // 3. BÔNUS DE MARCOS ESPECIAIS
  if (streak === 6 || streak === 13 || streak === 29 || streak === 59 || streak === 99) {
    // Garantir baú raro nos marcos
    const milestoneItem: VirtualItemData = {
      itemType: ItemType.SPECIAL,
      rarity: streak >= 99 ? ItemRarity.LEGENDARY : 
              streak >= 59 ? ItemRarity.EPIC : 
              streak >= 29 ? ItemRarity.RARE : ItemRarity.UNCOMMON,
      name: `Baú de Marco - Dia ${streak + 1}`,
      iconUrl: `/items/milestone-chest.png`,
      effects: { 
        milestone: true,
        day: streak + 1,
        special_bonus: true 
      },
      sourceType: SourceType.DAILY_REWARD
    }
    
    items.push(milestoneItem)
  }
  
  return {
    coins,
    items,
    rarityRolled,
    streakDay: streak + 1,
    totalStreak: streak + 1,
    rngSeed
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;

    console.log('🎁 Tentando resgatar recompensa diária para:', userId)

    // Validar se o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json({ 
        error: 'Sua sessão está inválida. Por favor, faça login novamente.',
        action: 'LOGOUT_REQUIRED'
      }, { status: 403 });
    }

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
      // Converter Date do PostgreSQL para JavaScript Date
      const lastDate = new Date(lastReward.rewardDate)
      const nextClaimTime = new Date(lastDate.getTime() + (24 * 60 * 60 * 1000))
      const hoursRemaining = Math.ceil((nextClaimTime.getTime() - Date.now()) / (1000 * 60 * 60))
      return NextResponse.json({ 
        error: `Você já resgatou hoje! Volte em ${hoursRemaining}h` 
      }, { status: 400 });
    }
    
    // Buscar último reward para calcular streak
    const allRewards = await prisma.dailyRewardLog.findMany({
      where: {
        userId,
        growId: virtualGrow.id
      },
      orderBy: {
        rewardDate: 'desc'
      },
      take: 2
    })

    let currentStreak = 0
    
    if (allRewards.length > 0) {
      // Converter Date do PostgreSQL para JavaScript Date
      const lastRewardDate = new Date(allRewards[0].rewardDate)
      const daysSinceLastReward = Math.floor((now.getTime() - lastRewardDate.getTime()) / (24 * 60 * 60 * 1000))
      
      // Se passou exatamente 1 dia, continua o streak
      if (daysSinceLastReward === 1) {
        currentStreak = allRewards[0].streakDay
      }
      // Se passou mais de 1 dia, reseta o streak
    }
    
    // Gerar recompensa
    const { coins, items, rarityRolled, streakDay, totalStreak, rngSeed } = getDailyRewardRNG(currentStreak);
    
    console.log(`✅ Recompensa gerada: ${coins} coins, ${items.length} items, streak: ${streakDay}`)

    // Atualizar coins no VirtualGrow
    await prisma.virtualGrow.update({
      where: { id: virtualGrow.id },
      data: {
        cultivoCoins: { increment: coins }
      }
    });

    // Adicionar items ao inventário se houver
    if (items.length > 0) {
      for (const item of items) {
        console.log('📦 Criando item:', JSON.stringify(item, null, 2))
        
        await prisma.virtualItem.create({
          data: {
            growId: virtualGrow.id,
            itemType: item.itemType,
            rarity: item.rarity,
            name: item.name,
            iconUrl: item.iconUrl,
            effects: item.effects,
            sourceType: item.sourceType
          }
        })
      }
      console.log(`📦 ${items.length} item(s) adicionado(s) ao inventário`)
    }

    // Registrar recompensa
    const itemNames = items.map(i => i.name)
    const rewardDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Apenas a data, sem hora
    
    await prisma.dailyRewardLog.create({
      data: {
        userId,
        growId: virtualGrow.id,
        rewardDate: rewardDate,
        coinsEarned: coins,
        streakDay,
        totalStreak,
        itemsReceived: itemNames,
        rngSeed: rngSeed,
        rarityRolled: rarityRolled
      }
    });

    console.log('🎉 Recompensa resgatada com sucesso!')

    return NextResponse.json({
      success: true,
      reward: { coins, items, streakDay, totalStreak, rarityRolled }
    });
  } catch (error) {
    console.error('❌ Erro ao resgatar recompensa diária:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
