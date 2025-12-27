-- Adicionar WELCOME_PACK e HARVEST ao enum SourceType
ALTER TYPE "SourceType" ADD VALUE IF NOT EXISTS 'WELCOME_PACK';
ALTER TYPE "SourceType" ADD VALUE IF NOT EXISTS 'HARVEST';

-- Criar enum PlantCareType se não existir
DO $$ BEGIN
    CREATE TYPE "PlantCareType" AS ENUM ('WATER', 'VPD_ADJUST', 'LIGHT_ADJUST', 'NUTRIENT', 'DEFOLIATION', 'TRAINING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Adicionar novas colunas ao VirtualPlant
ALTER TABLE "VirtualPlant" 
ADD COLUMN IF NOT EXISTS "waterLevel" INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS "vpdLevel" DOUBLE PRECISION DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS "lightHours" INTEGER DEFAULT 18,
ADD COLUMN IF NOT EXISTS "lastCareAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "harvestedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "cardGenerated" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "cardData" JSONB;

-- Criar tabela PlantCareLog
CREATE TABLE IF NOT EXISTS "PlantCareLog" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "careType" "PlantCareType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantCareLog_pkey" PRIMARY KEY ("id")
);

-- Adicionar foreign key se não existir
DO $$ BEGIN
    ALTER TABLE "PlantCareLog" ADD CONSTRAINT "PlantCareLog_plantId_fkey" 
    FOREIGN KEY ("plantId") REFERENCES "VirtualPlant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
