-- Adicionar UNCOMMON ao enum ItemRarity
ALTER TYPE "ItemRarity" ADD VALUE IF NOT EXISTS 'UNCOMMON';

-- Adicionar SPECIAL ao enum ItemType
ALTER TYPE "ItemType" ADD VALUE IF NOT EXISTS 'SPECIAL';
