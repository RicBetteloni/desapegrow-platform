// src/app/api/grow/unlock-item/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  mapProductToVirtualItem, 
  getCoinsReward, 
  getGemsReward 
} from '@/lib/productItemMapping';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { productId, orderId } = await req.json();

    // Validar dados
    if (!productId || !orderId) {
      return NextResponse.json(
        { error: 'productId e orderId são obrigatórios' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Verificar se usuário tem VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId }
    });

    // Criar VirtualGrow se não existir
    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId }
      });
    }

    // Mapear produto → item virtual
    const virtualItemData = mapProductToVirtualItem(
      product.name,
      product.category.slug,
      Number(product.price)
    );

    if (!virtualItemData) {
      return NextResponse.json(
        { error: 'Não foi possível mapear produto para item virtual' },
        { status: 500 }
      );
    }

    // Calcular recompensas
    const coinsReward = getCoinsReward(virtualItemData.rarity);
    const gemsReward = getGemsReward(virtualItemData.rarity);

    // Criar item virtual no inventário
    const virtualItem = await prisma.virtualItem.create({
      data: {
        growId: virtualGrow.id,
        itemType: virtualItemData.itemType,
        rarity: virtualItemData.rarity,
        name: virtualItemData.nameTemplate,
        iconUrl: virtualItemData.iconUrl,
        effects: JSON.stringify(virtualItemData.effects), // JSON field
        sourceType: 'PURCHASE',
        sourceId: orderId,
        realProductId: productId
      }
    });

    // Atualizar moedas do VirtualGrow
    await prisma.virtualGrow.update({
      where: { id: virtualGrow.id },
      data: {
        cultivoCoins: { increment: coinsReward },
        growthGems: { increment: gemsReward }
      }
    });

    // Atualizar pontos do GameProfile
    await prisma.gameProfile.update({
      where: { userId },
      data: {
        totalPoints: { increment: coinsReward },
        availablePoints: { increment: coinsReward }
      }
    });

    // Log de transação (analytics)
    console.log('[Item Unlocked]', {
      userId,
      productId,
      itemName: virtualItem.name,
      rarity: virtualItem.rarity,
      coinsReward,
      gemsReward
    });

    return NextResponse.json({
      success: true,
      item: {
        id: virtualItem.id,
        name: virtualItem.name,
        rarity: virtualItem.rarity,
        itemType: virtualItem.itemType,
        iconUrl: virtualItem.iconUrl,
        effects: virtualItem.effects
      },
      rewards: {
        cultivoCoins: coinsReward,
        growthGems: gemsReward,
        totalCoins: virtualGrow.cultivoCoins + coinsReward,
        totalGems: virtualGrow.growthGems + gemsReward
      },
      message: `🎉 Você desbloqueou: ${virtualItem.name}!`
    });

  } catch (error) {
    console.error('Erro ao desbloquear item:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET - Listar itens do inventário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: session.user.id },
      include: {
        inventory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!virtualGrow) {
      return NextResponse.json({
        inventory: [],
        stats: {
          totalItems: 0,
          byRarity: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 }
        }
      });
    }

    // Estatísticas do inventário
    const stats = {
      totalItems: virtualGrow.inventory.length,
      byRarity: {
        COMMON: virtualGrow.inventory.filter(i => i.rarity === 'COMMON').length,
        RARE: virtualGrow.inventory.filter(i => i.rarity === 'RARE').length,
        EPIC: virtualGrow.inventory.filter(i => i.rarity === 'EPIC').length,
        LEGENDARY: virtualGrow.inventory.filter(i => i.rarity === 'LEGENDARY').length
      }
    };

    return NextResponse.json({
      inventory: virtualGrow.inventory,
      stats
    });

  } catch (error) {
    console.error('Erro ao buscar inventário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
