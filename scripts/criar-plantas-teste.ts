import { PrismaClient, PlantStrain } from '@prisma/client';

const prisma = new PrismaClient();

const STAGES = ['SEED', 'SEEDLING', 'VEGETATIVE', 'PRE_FLOWER', 'FLOWERING', 'HARVEST_READY'];

const PLANT_CONFIGS = [
  {
    name: '🌰 Afghan Landrace',
    strain: PlantStrain.INDICA,
    stage: 'SEED',
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
    stage: 'SEEDLING',
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
    stage: 'VEGETATIVE',
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
    stage: 'PRE_FLOWER',
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
    stage: 'FLOWERING',
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
    stage: 'HARVEST_READY',
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
    console.log('🌱 Criando 6 plantas de teste nos 6 estágios...\n');

    // Buscar ou criar VirtualGrow do usuário de teste
    const testUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'ricardo@teste.com' },
          { email: 'ricbetteloni@hotmail.com' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (!testUser) {
      console.error('❌ Usuário não encontrado!');
      return;
    }

    console.log(`✅ Usuário encontrado: ${testUser.email}\n`);

    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: testUser.id }
    });

    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId: testUser.id }
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
          stage: config.stage as any,
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

    console.log('\n🎉 Todas as 6 plantas foram criadas com sucesso!');
    console.log('🌱 Agora você tem uma planta em cada estágio de crescimento.');

  } catch (error) {
    console.error('❌ Erro ao criar plantas de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPlants();
