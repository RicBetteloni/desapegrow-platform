// src/app/api/grow/inventory/route.ts
/**
 * API Route para buscar inventário do Grow Virtual
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Buscar VirtualGrow do usuário
    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: session.user.id },
      include: {
        inventory: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!virtualGrow) {
      return NextResponse.json({
        inventory: [],
        stats: {
          totalItems: 0,
          byRarity: {
            COMMON: 0,
            RARE: 0,
            EPIC: 0,
            LEGENDARY: 0
          }
        }
      })
    }

    // Calcular estatísticas
    const stats = {
      totalItems: virtualGrow.inventory.length,
      byRarity: {
        COMMON: virtualGrow.inventory.filter(i => i.rarity === 'COMMON').length,
        RARE: virtualGrow.inventory.filter(i => i.rarity === 'RARE').length,
        EPIC: virtualGrow.inventory.filter(i => i.rarity === 'EPIC').length,
        LEGENDARY: virtualGrow.inventory.filter(i => i.rarity === 'LEGENDARY').length
      }
    }

    // Transformar effects de JsonValue para array
    const inventoryWithEffects = virtualGrow.inventory.map(item => {
      let effects: any[] = []
      
      // Se effects for um objeto JSON, converter para array de ItemEffect
      if (item.effects && typeof item.effects === 'object') {
        effects = Object.entries(item.effects).map(([type, value]) => ({
          type,
          value: Number(value)
        }))
      }

      return {
        id: item.id,
        name: item.name,
        rarity: item.rarity,
        itemType: item.itemType,
        iconUrl: item.iconUrl || '',
        effects,
        createdAt: item.createdAt.toISOString(),
        isEquipped: item.isEquipped
      }
    })

    return NextResponse.json({
      inventory: inventoryWithEffects,
      stats
    })

  } catch (error) {
    console.error('Erro ao buscar inventário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar inventário' },
      { status: 500 }
    )
  }
}