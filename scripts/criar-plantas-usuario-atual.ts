import { PrismaClient, PlantStrain, GrowthStage } from '@prisma/client';

const prisma = new PrismaClient();

const PLANT_CONFIGS = [
  {
    name: '🌰 Afghan Landrace',
    strain: PlantStrain.INDICA,
    stage: GrowthStage.SEED,
    genetics: {
      origin: 'Hindu Kush Mountains, Afghanistan',
      lineage: 'Pure Landrace',
      thc: '10-15%',
      cbd: '3-5%',
      flowering: '7-8 weeks',
      era: 'Pré-1970s',
      difficulty: 'Medium',
      rarity: 'LEGENDARY'
    },
    health: 100,
    size: 0,
    waterLevel: 80,
    vpdLevel: 1.0,
    lightHours: 18,
    daysGrowing: 1
  },
  {
    name: '🌱 Northern Lights',
    strain: PlantStrain.INDICA,
    stage: GrowthStage.SEEDLING,
    genetics: {
      origin: 'USA/Netherlands',
      lineage: 'Afghani × Thai',
      thc: '16-21%',
      cbd: '0.1-0.5%',
      flowering: '7-9 weeks',
      era: 'Anos 1980s',
      difficulty: 'Easy',
      rarity: 'EPIC'
    },
    health: 95,
    size: 0.5,
    waterLevel: 75,
    vpdLevel: 1.1,
    lightHours: 18,
    daysGrowing: 7
  },
  {
    name: '🌿 White Widow',
    strain: PlantStrain.HYBRID,
    stage: GrowthStage.VEGETATIVE,
    genetics: {
      origin: 'Netherlands',
      lineage: 'Brazilian × South Indian',
      thc: '20-25%',
      cbd: '0.2-0.5%',
      flowering: '8-9 weeks',
      era: 'Anos 1990s',
      difficulty: 'Medium',
      rarity: 'RARE'
    },
    health: 90,
    size: 2.5,
    waterLevel: 70,
    vpdLevel: 1.2,
    lightHours: 18,
    daysGrowing: 21
  },
  {
    name: '🌾 Gelato',
    strain: PlantStrain.HYBRID,
    stage: GrowthStage.PRE_FLOWER,
    genetics: {
      origin: 'California',
      lineage: 'Sunset Sherbet × Thin Mint GSC',
      thc: '20-25%',
      cbd: '0.1-0.5%',
      flowering: '8-9 weeks',
      era: 'Anos 2010s',
      difficulty: 'Medium',
      rarity: 'UNCOMMON'
    },
    health: 85,
    size: 4.0,
    waterLevel: 65,
    vpdLevel: 1.3,
    lightHours: 12,
    daysGrowing: 35
  },
  {
    name: '🌸 Runtz',
    strain: PlantStrain.HYBRID,
    stage: GrowthStage.FLOWERING,
    genetics: {
      origin: 'California',
      lineage: 'Zkittlez × Gelato',
      thc: '24-29%',
      cbd: '0.1-0.3%',
      flowering: '8-9 weeks',
      era: 'Anos 2020s',
      difficulty: 'Easy',
      rarity: 'COMMON'
    },
    health: 80,
    size: 5.5,
    waterLevel: 60,
    vpdLevel: 1.4,
    lightHours: 12,
    daysGrowing: 49
  },
  {
    name: '✨ Colombian Gold',
    strain: PlantStrain.SATIVA,
    stage: GrowthStage.HARVEST_READY,
    genetics: {
      origin: 'Santa Marta Mountains, Colombia',
      lineage: 'Colombian Gold Landrace',
      thc: '12-16%',
      cbd: '1-2%',
      flowering: '11-13 weeks',
      era: 'Anos 1960-70s',
      difficulty: 'Hard',
      rarity: 'LEGENDARY'
    },
    health: 92,
    size: 7.8,
    waterLevel: 55,
    vpdLevel: 1.5,
    lightHours: 12,
    daysGrowing: 84
  }
];

async function createTestPlants() {
  try {
    const targetUserId = 'cmjok1kzw0000vnvgbgri7e8p'; // Usuário atual
    
    console.log('🌱 Criando 6 plantas de teste para o usuário atual...\n');

    // Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: targetUserId }
    });

    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId: targetUserId }
      });
      console.log('📝 VirtualGrow criado\n');
    }

    // Deletar plantas existentes
    const deleted = await prisma.virtualPlant.deleteMany({
      where: { growId: virtualGrow.id }
    });
    console.log(`🗑️  ${deleted.count} plantas antigas deletadas\n`);

    // Criar as 6 plantas
    for (const config of PLANT_CONFIGS) {
      const plant = await prisma.virtualPlant.create({
        data: {
          growId: virtualGrow.id,
          name: config.name,
          strain: config.strain,
          stage: config.stage,
          genetics: config.genetics,
          health: config.health,
          size: config.size,
          waterLevel: config.waterLevel,
          vpdLevel: config.vpdLevel,
          lightHours: config.lightHours,
          daysGrowing: config.daysGrowing,
          lastCareAt: new Date()
        }
      });

      console.log(`✅ ${config.stage.padEnd(15)} | ${plant.name}`);
    }

    console.log('\n🎉 Todas as 6 plantas foram criadas com sucesso para o usuário atual!');
    console.log('🌱 Faça um hard refresh (Ctrl+Shift+R) na página /grow-virtual para ver as plantas.');

  } catch (error) {
    console.error('❌ Erro ao criar plantas de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPlants();
