// src/types/prisma.ts - Corrigido para corresponder ao schema

export enum ItemRarity {
  COMMON = 'COMMON',
  RARE = 'RARE', 
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export enum ItemType {
  LIGHTING = 'LIGHTING',
  NUTRIENTS = 'NUTRIENTS', 
  SUBSTRATE = 'SUBSTRATE',
  TOOLS = 'TOOLS',
  GENETICS = 'GENETICS',
  AUTOMATION = 'AUTOMATION',
  DECORATION = 'DECORATION',
  BOOSTER = 'BOOSTER'
}

export enum SourceType {
  PURCHASE = 'PURCHASE',
  DAILY_REWARD = 'DAILY_REWARD',
  ACHIEVEMENT = 'ACHIEVEMENT', 
  SOCIAL_REWARD = 'SOCIAL_REWARD',
  EVENT_REWARD = 'EVENT_REWARD'
}

export enum GrowType {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
  HYDROPONIC = 'HYDROPONIC',
  GREENHOUSE = 'GREENHOUSE'
}

export enum GrowSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  WAREHOUSE = 'WAREHOUSE'
}

export enum AutoLevel {
  MANUAL = 'MANUAL',
  SEMI_AUTO = 'SEMI_AUTO',
  FULL_AUTO = 'FULL_AUTO',
  AI_DRIVEN = 'AI_DRIVEN'
}

export enum PlantStrain {
  SATIVA = 'SATIVA',
  INDICA = 'INDICA',
  HYBRID = 'HYBRID',
  AUTOFLOWER = 'AUTOFLOWER'
}

export enum GrowthStage {
  SEED = 'SEED',
  SEEDLING = 'SEEDLING',
  VEGETATIVE = 'VEGETATIVE',
  PRE_FLOWER = 'PRE_FLOWER',
  FLOWERING = 'FLOWERING',
  HARVEST_READY = 'HARVEST_READY'
}

// ... outros enums conforme seu schema