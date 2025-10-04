// src/lib/productItemMapping.ts
import { ItemType, ItemRarity } from '@prisma/client';

/**
 * Sistema de mapeamento entre produtos reais e itens virtuais
 * Define como cada produto do marketplace se traduz em benefícios no Grow Virtual
 */

export interface VirtualItemEffect {
  type: 'growth_speed' | 'health_boost' | 'yield_multiplier' | 'aesthetic' | 'automation';
  value: number; // Porcentagem ou valor absoluto
  duration?: number; // Em dias, se aplicável
}

export interface ProductMapping {
  productCategorySlug: string;
  productNamePattern?: RegExp; // Padrão opcional para matchear nome
  virtualItem: {
    itemType: ItemType;
    rarity: ItemRarity;
    nameTemplate: string; // Template usando ${productName}
    iconUrl: string;
    effects: VirtualItemEffect[];
  };
}

/**
 * Mapa mestre de categorias → itens virtuais
 * Este é o coração do sistema de progressão
 */
export const PRODUCT_MAPPINGS: ProductMapping[] = [
  // ==================== ILUMINAÇÃO ====================
  {
    productCategorySlug: 'iluminacao',
    productNamePattern: /LED.*150W/i,
    virtualItem: {
      itemType: 'LIGHTING',
      rarity: 'RARE',
      nameTemplate: 'LED Pro Virtual',
      iconUrl: '/items/led-pro.png',
      effects: [
        { type: 'growth_speed', value: 25 }, // 25% mais rápido
        { type: 'yield_multiplier', value: 1.15 } // 15% mais yield
      ]
    }
  },
  {
    productCategorySlug: 'iluminacao',
    productNamePattern: /LED.*300W|HPS/i,
    virtualItem: {
      itemType: 'LIGHTING',
      rarity: 'EPIC',
      nameTemplate: 'LED Master Virtual',
      iconUrl: '/items/led-master.png',
      effects: [
        { type: 'growth_speed', value: 40 },
        { type: 'yield_multiplier', value: 1.3 }
      ]
    }
  },

  // ==================== HIDROPONIA ====================
  {
    productCategorySlug: 'hidroponia',
    virtualItem: {
      itemType: 'AUTOMATION',
      rarity: 'EPIC',
      nameTemplate: 'Sistema Hidro Virtual',
      iconUrl: '/items/hydro-system.png',
      effects: [
        { type: 'growth_speed', value: 50 },
        { type: 'automation', value: 1 }, // Reduz necessidade de cuidados manuais
        { type: 'yield_multiplier', value: 1.5 }
      ]
    }
  },

  // ==================== FERTILIZANTES ====================
  {
    productCategorySlug: 'fertilizantes',
    productNamePattern: /orgânico/i,
    virtualItem: {
      itemType: 'NUTRIENTS',
      rarity: 'COMMON',
      nameTemplate: 'Fertilizante Bio Virtual',
      iconUrl: '/items/fertilizer-organic.png',
      effects: [
        { type: 'health_boost', value: 20, duration: 7 },
        { type: 'yield_multiplier', value: 1.1 }
      ]
    }
  },
  {
    productCategorySlug: 'fertilizantes',
    productNamePattern: /premium|advanced/i,
    virtualItem: {
      itemType: 'NUTRIENTS',
      rarity: 'RARE',
      nameTemplate: 'Super Nutriente Virtual',
      iconUrl: '/items/fertilizer-premium.png',
      effects: [
        { type: 'health_boost', value: 35, duration: 14 },
        { type: 'growth_speed', value: 30 },
        { type: 'yield_multiplier', value: 1.25 }
      ]
    }
  },

  // ==================== SUBSTRATOS ====================
  {
    productCategorySlug: 'substratos',
    virtualItem: {
      itemType: 'SUBSTRATE',
      rarity: 'COMMON',
      nameTemplate: 'Substrato Premium Virtual',
      iconUrl: '/items/substrate.png',
      effects: [
        { type: 'health_boost', value: 15, duration: 30 },
        { type: 'growth_speed', value: 10 }
      ]
    }
  },

  // ==================== VENTILAÇÃO ====================
  {
    productCategorySlug: 'ventilacao',
    virtualItem: {
      itemType: 'AUTOMATION',
      rarity: 'RARE',
      nameTemplate: 'Sistema de Clima Virtual',
      iconUrl: '/items/ventilation.png',
      effects: [
        { type: 'health_boost', value: 25, duration: 90 },
        { type: 'automation', value: 1 }
      ]
    }
  },

  // ==================== GENÉTICA ESPECIAL ====================
  {
    productCategorySlug: 'sementes',
    productNamePattern: /premium|elite/i,
    virtualItem: {
      itemType: 'GENETICS',
      rarity: 'LEGENDARY',
      nameTemplate: 'Genética Elite Virtual',
      iconUrl: '/items/genetics-elite.png',
      effects: [
        { type: 'yield_multiplier', value: 2.0 }, // DOBRA o yield!
        { type: 'growth_speed', value: 20 }
      ]
    }
  }
];

/**
 * Determina qual item virtual um produto desbloqueia
 */
export function mapProductToVirtualItem(
  productName: string,
  categorySlug: string,
  productPrice: number
): ProductMapping['virtualItem'] | null {
  // Primeiro tenta match por categoria + padrão de nome
  for (const mapping of PRODUCT_MAPPINGS) {
    if (mapping.productCategorySlug === categorySlug) {
      if (mapping.productNamePattern) {
        if (mapping.productNamePattern.test(productName)) {
          return mapping.virtualItem;
        }
      } else {
        // Se não tem padrão, usa o mapping padrão da categoria
        return mapping.virtualItem;
      }
    }
  }

  // Fallback: cria item COMMON genérico baseado no preço
  return createFallbackItem(productName, categorySlug, productPrice);
}

/**
 * Cria item genérico quando não há mapping específico
 */
function createFallbackItem(
  productName: string,
  categorySlug: string,
  price: number
): ProductMapping['virtualItem'] {
  // Determina raridade baseado no preço
  let rarity: ItemRarity = 'COMMON';
  let multiplier = 1.0;

  if (price > 500) {
    rarity = 'LEGENDARY';
    multiplier = 2.0;
  } else if (price > 200) {
    rarity = 'EPIC';
    multiplier = 1.5;
  } else if (price > 100) {
    rarity = 'RARE';
    multiplier = 1.25;
  }

  return {
    itemType: 'BOOSTER',
    rarity,
    nameTemplate: `${productName} Virtual`,
    iconUrl: '/items/generic-boost.png',
    effects: [
      { type: 'growth_speed', value: 10 * multiplier },
      { type: 'yield_multiplier', value: 1 + (0.1 * multiplier) }
    ]
  };
}

/**
 * Calcula o boost total de um conjunto de itens
 */
export function calculateTotalBoost(items: VirtualItemEffect[]): {
  growthSpeed: number;
  healthBoost: number;
  yieldMultiplier: number;
  automationLevel: number;
} {
  const totals = {
    growthSpeed: 0,
    healthBoost: 0,
    yieldMultiplier: 1.0,
    automationLevel: 0
  };

  for (const item of items) {
    switch (item.type) {
      case 'growth_speed':
        totals.growthSpeed += item.value;
        break;
      case 'health_boost':
        totals.healthBoost += item.value;
        break;
      case 'yield_multiplier':
        totals.yieldMultiplier *= item.value;
        break;
      case 'automation':
        totals.automationLevel += item.value;
        break;
    }
  }

  return totals;
}

/**
 * Determina recompensa de CultivoCoins baseado na raridade
 */
export function getCoinsReward(rarity: ItemRarity): number {
  const rewards = {
    COMMON: 50,
    RARE: 100,
    EPIC: 200,
    LEGENDARY: 500
  };
  return rewards[rarity];
}

/**
 * Determina recompensa de GrowthGems baseado na raridade
 */
export function getGemsReward(rarity: ItemRarity): number {
  const rewards = {
    COMMON: 5,
    RARE: 15,
    EPIC: 30,
    LEGENDARY: 100
  };
  return rewards[rarity];
}