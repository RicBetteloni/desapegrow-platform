// src/lib/growHelpers.ts
/**
 * Helper functions para trabalhar com VirtualGrow
 * Usa sempre as relações corretas!
 */

import { prisma } from './prisma'
import { Prisma, SourceType, ItemType } from '@prisma/client'

/**
 * Busca ou cria VirtualGrow para um usuário
 * Garante que sempre existe um grow
 */
export async function getOrCreateVirtualGrow(userId: string) {
  let virtualGrow = await prisma.virtualGrow.findUnique({
    where: { userId },
    include: {
      plants: true,
      inventory: true
    }
  })

  if (!virtualGrow) {
    virtualGrow = await prisma.virtualGrow.create({
      data: { userId },
      include: {
        plants: true,
        inventory: true
      }
    })
  }

  return virtualGrow
}

/**
 * Busca dados completos do usuário para dashboard
 */
export async function getUserDashboardData(userId: string) {
  const [user, virtualGrow, gameProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    }),
    getOrCreateVirtualGrow(userId),
    prisma.gameProfile.findUnique({
      where: { userId }
    })
  ])

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  return {
    user,
    virtualGrow: {
      id: virtualGrow.id,
      growType: virtualGrow.growType,
      growSize: virtualGrow.growSize,
      automationLevel: virtualGrow.automationLevel,
      cultivoCoins: virtualGrow.cultivoCoins,
      growthGems: virtualGrow.growthGems,
      harvestTokens: virtualGrow.harvestTokens,
      experiencePoints: virtualGrow.experiencePoints,
      prestigeLevel: virtualGrow.prestigeLevel,
      plants: virtualGrow.plants,
      inventory: virtualGrow.inventory,
      stats: {
        totalPlants: virtualGrow.plants.length,
        totalItems: virtualGrow.inventory.length,
        rarityBreakdown: calculateRarityBreakdown(virtualGrow.inventory)
      }
    },
    gameProfile: gameProfile || null
  }
}

/**
 * Adiciona nova planta ao grow
 */
export async function addPlantToGrow(
  userId: string,
  plantData: {
    name: string
    strain: 'SATIVA' | 'INDICA' | 'HYBRID' | 'AUTOFLOWER'
    genetics?: Record<string, unknown>
  }
) {
  const virtualGrow = await getOrCreateVirtualGrow(userId)

  const plant = await prisma.virtualPlant.create({
    data: {
      growId: virtualGrow.id,
      name: plantData.name,
      strain: plantData.strain,
      genetics: plantData.genetics as Prisma.InputJsonValue || {},
      stage: 'SEED',
      daysGrowing: 0,
      health: 100,
      size: 0.1
    }
  })

  // Dar XP por plantar
  await prisma.virtualGrow.update({
    where: { id: virtualGrow.id },
    data: {
      experiencePoints: { increment: 10 }
    }
  })

  return plant
}

/**
 * Adiciona item ao inventário
 */
export async function addItemToInventory(
  userId: string,
  itemData: {
    itemType: string
    rarity: string
    name: string
    iconUrl: string
    effects: { [key: string]: unknown }[]
    sourceType: string
    sourceId?: string
    realProductId?: string
  }
) {
  const virtualGrow = await getOrCreateVirtualGrow(userId)

  const item = await prisma.virtualItem.create({
    data: {
      growId: virtualGrow.id,
      itemType: itemData.itemType as ItemType,
      rarity: itemData.rarity as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY',
      name: itemData.name,
      iconUrl: itemData.iconUrl,
      effects: itemData.effects as Prisma.InputJsonValue,
      sourceType: itemData.sourceType as SourceType,
      sourceId: itemData.sourceId,
      realProductId: itemData.realProductId
    }
  })

  return item
}

/**
 * Atualiza moedas do grow
 */
export async function updateGrowCurrency(
  userId: string,
  updates: {
    cultivoCoins?: number
    growthGems?: number
    harvestTokens?: number
    experiencePoints?: number
  }
) {
  const virtualGrow = await getOrCreateVirtualGrow(userId)

  const data: Partial<Prisma.VirtualGrowUpdateInput> = {}
  if (updates.cultivoCoins) data.cultivoCoins = { increment: updates.cultivoCoins }
  if (updates.growthGems) data.growthGems = { increment: updates.growthGems }
  if (updates.harvestTokens) data.harvestTokens = { increment: updates.harvestTokens }
  if (updates.experiencePoints) data.experiencePoints = { increment: updates.experiencePoints }

  return await prisma.virtualGrow.update({
    where: { id: virtualGrow.id },
    data
  })
}

/**
 * Avança estágio de uma planta
 */
export async function advancePlantStage(plantId: string) {
  const plant = await prisma.virtualPlant.findUnique({
    where: { id: plantId }
  })

  if (!plant) {
    throw new Error('Planta não encontrada')
  }

  const stageOrder = [
    'SEED',
    'SEEDLING',
    'VEGETATIVE',
    'PRE_FLOWER',
    'FLOWERING',
    'HARVEST_READY'
  ]

  const currentIndex = stageOrder.indexOf(plant.stage)
  const nextStage = currentIndex < stageOrder.length - 1 
    ? stageOrder[currentIndex + 1]
    : plant.stage

  return await prisma.virtualPlant.update({
    where: { id: plantId },
    data: {
      stage: nextStage as 'SEED' | 'SEEDLING' | 'VEGETATIVE' | 'PRE_FLOWER' | 'FLOWERING' | 'HARVEST_READY',
      daysGrowing: { increment: 1 },
      size: { increment: 0.1 }
    }
  })
}

/**
 * Cuida da planta (water, nutrients, etc)
 */
export async function carePlant(
  plantId: string,
  careType: 'water' | 'nutrients' | 'prune' | 'adjust_light'
) {
  const plant = await prisma.virtualPlant.findUnique({
    where: { id: plantId }
  })

  if (!plant) {
    throw new Error('Planta não encontrada')
  }

  const healthBoost = {
    water: 5,
    nutrients: 10,
    prune: 3,
    adjust_light: 7
  }[careType]

  const newHealth = Math.min(100, plant.health + healthBoost)

  const updatedPlant = await prisma.virtualPlant.update({
    where: { id: plantId },
    data: {
      health: newHealth,
      updatedAt: new Date()
    }
  })

  // Dar XP por cuidar
  await prisma.virtualGrow.update({
    where: { id: plant.growId },
    data: {
      experiencePoints: { increment: 2 }
    }
  })

  return updatedPlant
}

/**
 * Colhe uma planta pronta
 */
export async function harvestPlant(plantId: string) {
  const plant = await prisma.virtualPlant.findUnique({
    where: { id: plantId },
    include: { grow: true }
  })

  if (!plant) {
    throw new Error('Planta não encontrada')
  }

  if (plant.stage !== 'HARVEST_READY') {
    throw new Error('Planta não está pronta para colheita')
  }

  // Calcular recompensa baseado em saúde e tamanho
  const baseYield = 100
  const healthMultiplier = plant.health / 100
  const sizeMultiplier = plant.size / 1.0
  const yieldAmount = Math.floor(baseYield * healthMultiplier * sizeMultiplier)

  // Dar recompensas
  await updateGrowCurrency(plant.grow.userId, {
    harvestTokens: yieldAmount,
    experiencePoints: 50,
    cultivoCoins: yieldAmount * 2
  })

  // Remover planta (ou resetar para nova cycle)
  await prisma.virtualPlant.delete({
    where: { id: plantId }
  })

  return {
    success: true,
    yield: yieldAmount,
    rewards: {
      harvestTokens: yieldAmount,
      experiencePoints: 50,
      cultivoCoins: yieldAmount * 2
    }
  }
}

/**
 * Calcula breakdown de raridades no inventário
 */
function calculateRarityBreakdown(inventory: { rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' }[]) {
  return {
    COMMON: inventory.filter(i => i.rarity === 'COMMON').length,
    RARE: inventory.filter(i => i.rarity === 'RARE').length,
    EPIC: inventory.filter(i => i.rarity === 'EPIC').length,
    LEGENDARY: inventory.filter(i => i.rarity === 'LEGENDARY').length
  }
}

/**
 * Calcula poder total dos itens equipados
 */
export function calculateTotalItemPower(inventory: { rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'; effects?: { value: number }[] }[]) {
  let totalPower = 0

  for (const item of inventory) {
    if (item.effects && Array.isArray(item.effects)) {
      for (const effect of item.effects) {
        const rarityMultiplier = {
          COMMON: 1,
          RARE: 1.5,
          EPIC: 2,
          LEGENDARY: 3
        }[item.rarity as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'] || 1

        totalPower += effect.value * rarityMultiplier
      }
    }
  }

  return Math.floor(totalPower)
}

/**
 * Verifica se pode fazer ação (baseado em cooldowns)
 */
export async function canPerformAction(
  userId: string,
  actionType: string
): Promise<boolean> {
  // Implementar lógica de cooldown
  // Por exemplo: só pode regar plantas a cada 6 horas
  return true // Simplificado por enquanto
}

/**
 * Exporta todas as funções úteis
 */
export const GrowHelpers = {
  getOrCreateVirtualGrow,
  getUserDashboardData,
  addPlantToGrow,
  addItemToInventory,
  updateGrowCurrency,
  advancePlantStage,
  carePlant,
  harvestPlant,
  calculateTotalItemPower,
  canPerformAction
}