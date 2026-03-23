import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ItemRarity, ItemType, SourceType, PlantStrain } from '@prisma/client';

export const dynamic = 'force-dynamic';

// ========== SISTEMA RNG - TAXAS DIFFICULT ==========
// 70% COMMON | 20% UNCOMMON | 8% RARE | 1.8% EPIC | 0.2% LEGENDARY

const RARITY_RATES = {
  COMMON: 70.0,
  UNCOMMON: 20.0,
  RARE: 8.0,
  EPIC: 1.8,
  LEGENDARY: 0.2,
};

// Pool de Seeds: 3 de cada raridade (quanto mais antiga = mais rara)
const SEED_POOL = [
  // ========== LEGENDARY - Landraces Históricas (Pré-1970s) ==========
  {
    name: '🏔️ Afghan Landrace',
    strain: PlantStrain.INDICA,
    rarity: ItemRarity.LEGENDARY,
    iconUrl: '/seeds/afghan-landrace.png',
    genetics: {
      origin: 'Hindu Kush Mountains, Afghanistan',
      lineage: 'Pure Landrace',
      thc: '10-15%',
      cbd: '3-5%',
      flowering: '7-8 weeks',
      era: 'Pré-1970s',
      historical: 'Genética milenar - Fundadora de todas as indicas modernas',
      difficulty: 'Medium'
    },
    effects: {
      growthSpeed: 0.9,
      diseaseResistance: 0.95,
      yieldMultiplier: 1.2,
      legendary: true,
      collectible: true
    }
  },
  {
    name: '🌴 Colombian Gold',
    strain: PlantStrain.SATIVA,
    rarity: ItemRarity.LEGENDARY,
    iconUrl: '/seeds/colombian-gold.png',
    genetics: {
      origin: 'Santa Marta Mountains, Colombia',
      lineage: 'Colombian Gold Landrace',
      thc: '12-16%',
      cbd: '1-2%',
      flowering: '11-13 weeks',
      era: 'Anos 1960-70s',
      historical: 'Icônica strain da era hippie - Extremamente rara',
      difficulty: 'Hard'
    },
    effects: {
      growthSpeed: 1.1,
      diseaseResistance: 0.85,
      yieldMultiplier: 1.4,
      legendary: true,
      collectible: true
    }
  },
  {
    name: '🎋 Thai Stick',
    strain: PlantStrain.SATIVA,
    rarity: ItemRarity.LEGENDARY,
    iconUrl: '/seeds/thai-stick.png',
    genetics: {
      origin: 'Thailand',
      lineage: 'Thai Landrace',
      thc: '10-14%',
      cbd: '0.5-1%',
      flowering: '12-14 weeks',
      era: 'Anos 1960-70s',
      historical: 'Lenda do Sudeste Asiático - Amarrada em bambu',
      difficulty: 'Very Hard'
    },
    effects: {
      growthSpeed: 1.2,
      diseaseResistance: 0.75,
      yieldMultiplier: 1.3,
      legendary: true,
      collectible: true
    }
  },

  // ========== EPIC - Clássicos da Era Dourada (1980s-1990s) ==========
  {
    name: '⭐ Northern Lights',
    strain: PlantStrain.INDICA,
    rarity: ItemRarity.EPIC,
    iconUrl: '/seeds/northern-lights.png',
    genetics: {
      origin: 'USA/Netherlands',
      lineage: 'Afghani × Thai',
      thc: '16-21%',
      cbd: '0.1-0.5%',
      flowering: '7-9 weeks',
      era: 'Anos 1980s',
      awards: 'Cannabis Cup Winner',
      historical: 'Base genética de inúmeras strains modernas',
      difficulty: 'Easy'
    },
    effects: {
      growthSpeed: 1.0,
      diseaseResistance: 0.9,
      yieldMultiplier: 1.5,
      epic: true
    }
  },
  {
    name: '🌊 Haze',
    strain: PlantStrain.SATIVA,
    rarity: ItemRarity.EPIC,
    iconUrl: '/seeds/haze.png',
    genetics: {
      origin: 'Santa Cruz, California',
      lineage: 'Colombian × Mexican × Thai × South Indian',
      thc: '18-23%',
      cbd: '0.1-0.3%',
      flowering: '10-12 weeks',
      era: 'Anos 1970-80s',
      awards: 'Múltiplos Cannabis Cup',
      historical: 'Criada pelos lendários Haze Brothers',
      difficulty: 'Hard'
    },
    effects: {
      growthSpeed: 1.15,
      diseaseResistance: 0.75,
      yieldMultiplier: 1.6,
      epic: true
    }
  },
  {
    name: '🦨 Skunk #1',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.EPIC,
    iconUrl: '/seeds/skunk-1.png',
    genetics: {
      origin: 'California',
      lineage: 'Afghani × Acapulco Gold × Colombian Gold',
      thc: '15-19%',
      cbd: '0.1-0.5%',
      flowering: '8-9 weeks',
      era: 'Anos 1970s',
      awards: 'Cannabis Cup 1988',
      historical: 'Primeira strain verdadeiramente estabilizada',
      difficulty: 'Easy'
    },
    effects: {
      growthSpeed: 1.1,
      diseaseResistance: 0.95,
      yieldMultiplier: 1.7,
      epic: true
    }
  },

  // ========== RARE - Famosas dos Anos 2000s ==========
  {
    name: '❄️ White Widow',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.RARE,
    iconUrl: '/seeds/white-widow.png',
    genetics: {
      origin: 'Netherlands',
      lineage: 'Brazilian × South Indian',
      thc: '20-25%',
      cbd: '0.2-0.5%',
      flowering: '8-9 weeks',
      era: 'Anos 1990s',
      breeder: 'Green House Seeds',
      awards: 'Cannabis Cup 1995',
      difficulty: 'Medium'
    },
    effects: {
      growthSpeed: 1.0,
      diseaseResistance: 0.85,
      yieldMultiplier: 1.6,
      rare: true
    }
  },
  {
    name: '🫐 Blueberry',
    strain: PlantStrain.INDICA,
    rarity: ItemRarity.RARE,
    iconUrl: '/seeds/blueberry.png',
    genetics: {
      origin: 'USA',
      lineage: 'Afghan × Thai × Purple Thai',
      thc: '19-24%',
      cbd: '0.1-0.3%',
      flowering: '7-9 weeks',
      era: 'Anos 2000s',
      breeder: 'DJ Short',
      awards: 'High Times Cannabis Cup 2000',
      flavor: 'Berry explosivo',
      difficulty: 'Medium'
    },
    effects: {
      growthSpeed: 0.95,
      diseaseResistance: 0.8,
      yieldMultiplier: 1.4,
      rare: true,
      flavorBonus: 0.3
    }
  },
  {
    name: '⛽ Sour Diesel',
    strain: PlantStrain.SATIVA,
    rarity: ItemRarity.RARE,
    iconUrl: '/seeds/sour-diesel.png',
    genetics: {
      origin: 'East Coast USA',
      lineage: 'Chemdawg × Super Skunk',
      thc: '20-25%',
      cbd: '0.1-0.2%',
      flowering: '10-11 weeks',
      era: 'Anos 1990s',
      historical: 'Dominante no mercado médico inicial',
      difficulty: 'Medium'
    },
    effects: {
      growthSpeed: 1.1,
      diseaseResistance: 0.75,
      yieldMultiplier: 1.5,
      rare: true
    }
  },

  // ========== UNCOMMON - Modernas Populares (2010s) ==========
  {
    name: '🍨 Gelato',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.UNCOMMON,
    iconUrl: '/seeds/gelato.png',
    genetics: {
      origin: 'California',
      lineage: 'Sunset Sherbet × Thin Mint GSC',
      thc: '20-25%',
      cbd: '0.1-0.5%',
      flowering: '8-9 weeks',
      era: 'Anos 2010s',
      breeder: 'Cookie Fam',
      flavor: 'Doce cremoso',
      difficulty: 'Medium'
    },
    effects: {
      growthSpeed: 1.0,
      diseaseResistance: 0.8,
      yieldMultiplier: 1.5,
      uncommon: true
    }
  },
  {
    name: '🎂 Wedding Cake',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.UNCOMMON,
    iconUrl: '/seeds/wedding-cake.png',
    genetics: {
      origin: 'California',
      lineage: 'Triangle Kush × Animal Mints',
      thc: '23-27%',
      cbd: '0.1-0.3%',
      flowering: '8-9 weeks',
      era: 'Anos 2010s',
      flavor: 'Baunilha e terra',
      difficulty: 'Medium'
    },
    effects: {
      growthSpeed: 1.05,
      diseaseResistance: 0.85,
      yieldMultiplier: 1.6,
      uncommon: true
    }
  },
  {
    name: '🦍 Gorilla Glue #4',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.UNCOMMON,
    iconUrl: '/seeds/gorilla-glue.png',
    genetics: {
      origin: 'USA',
      lineage: "Chem's Sister × Sour Dubb × Chocolate Diesel",
      thc: '25-30%',
      cbd: '0.1-0.2%',
      flowering: '8-9 weeks',
      era: 'Anos 2010s',
      awards: 'Múltiplos Cannabis Cup',
      note: 'Descoberta acidental de GG Strains',
      difficulty: 'Easy'
    },
    effects: {
      growthSpeed: 1.0,
      diseaseResistance: 0.9,
      yieldMultiplier: 1.8,
      uncommon: true,
      potencyBonus: 0.2
    }
  },

  // ========== COMMON - Cruzas Hype Atuais (2020s) ==========
  {
    name: '🍬 Runtz',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.COMMON,
    iconUrl: '/seeds/runtz.png',
    genetics: {
      origin: 'California',
      lineage: 'Zkittlez × Gelato',
      thc: '24-29%',
      cbd: '0.1-0.3%',
      flowering: '8-9 weeks',
      era: 'Anos 2020s',
      hype: 'Viral nas redes sociais',
      flavor: 'Doce tropical',
      difficulty: 'Easy'
    },
    effects: {
      growthSpeed: 1.0,
      diseaseResistance: 0.85,
      yieldMultiplier: 1.4,
      common: true
    }
  },
  {
    name: '🍦 Ice Cream Cake',
    strain: PlantStrain.INDICA,
    rarity: ItemRarity.COMMON,
    iconUrl: '/seeds/ice-cream-cake.png',
    genetics: {
      origin: 'California',
      lineage: 'Wedding Cake × Gelato 33',
      thc: '23-28%',
      cbd: '0.1-0.5%',
      flowering: '8-9 weeks',
      era: 'Anos 2020s',
      hype: 'Trending strain',
      flavor: 'Cremoso e doce',
      difficulty: 'Easy'
    },
    effects: {
      growthSpeed: 1.05,
      diseaseResistance: 0.8,
      yieldMultiplier: 1.5,
      common: true
    }
  },
  {
    name: '🍎 Apple Fritter',
    strain: PlantStrain.HYBRID,
    rarity: ItemRarity.COMMON,
    iconUrl: '/seeds/apple-fritter.png',
    genetics: {
      origin: 'California',
      lineage: 'Sour Apple × Animal Cookies',
      thc: '22-28%',
      cbd: '0.1-0.4%',
      flowering: '8-10 weeks',
      era: 'Anos 2020s',
      hype: 'Popular em dispensários',
      flavor: 'Maçã doce',
      difficulty: 'Easy'
    },
    effects: {
      growthSpeed: 1.0,
      diseaseResistance: 0.85,
      yieldMultiplier: 1.6,
      common: true
    }
  },
];

// ========== FUNÇÃO RNG - SELECIONA 1 SEED ALEATÓRIA ==========
function selectRandomSeed(): typeof SEED_POOL[0] {
  const random = Math.random() * 100; // 0-100
  let cumulativeProbability = 0;
  let selectedRarity: ItemRarity = ItemRarity.COMMON;
  
  // Determinar raridade baseada nas taxas cumulativas
  for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
    cumulativeProbability += rate;
    if (random <= cumulativeProbability) {
      selectedRarity = rarity as ItemRarity;
      break;
    }
  }
  
  // Filtrar seeds da raridade selecionada
  const seedsOfRarity = SEED_POOL.filter(seed => seed.rarity === selectedRarity);
  
  // Selecionar aleatoriamente uma das 3 seeds dessa raridade
  const randomIndex = Math.floor(Math.random() * seedsOfRarity.length);
  return seedsOfRarity[randomIndex];
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;

    console.log('🎁 Verificando pacote de boas-vindas para:', userId);

    // Validar se o usuário existe antes de criar VirtualGrow
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!userExists) {
      console.error('❌ Usuário não encontrado:', userId);
      return NextResponse.json({ 
        error: 'Sua sessão está inválida. Por favor, faça login novamente.',
        action: 'LOGOUT_REQUIRED'
      }, { status: 403 });
    }

    console.log('✅ Usuário validado:', userExists.name, userExists.email);

    // Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId },
      include: {
        inventory: {
          where: {
            sourceType: SourceType.WELCOME_PACK
          }
        }
      }
    });

    if (!virtualGrow) {
      console.log('📝 Criando VirtualGrow...');
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId },
        include: { inventory: true }
      });
    }

    // Verificar se já recebeu o pacote de boas-vindas
    if (virtualGrow.inventory && virtualGrow.inventory.length > 0) {
      return NextResponse.json({ 
        error: 'Você já recebeu seu pacote de boas-vindas!' 
      }, { status: 400 });
    }

    console.log('🎲 Rolando RNG para pacote de boas-vindas...');

    // RNG: Selecionar 1 seed aleatória baseada nas taxas
    const selectedSeed = selectRandomSeed();
    console.log(`🌱 Seed sorteada: ${selectedSeed.name} [${selectedSeed.rarity}]`);

    // Criar a seed no inventário
    const item = await prisma.virtualItem.create({
      data: {
        growId: virtualGrow.id,
        itemType: ItemType.GENETICS,
        rarity: selectedSeed.rarity,
        name: selectedSeed.name,
        iconUrl: selectedSeed.iconUrl,
        effects: {
          ...selectedSeed.effects,
          genetics: selectedSeed.genetics,
          strain: selectedSeed.strain
        },
        sourceType: SourceType.WELCOME_PACK
      }
    });

    // Bônus: Adicionar coins iniciais
    await prisma.virtualGrow.update({
      where: { id: virtualGrow.id },
      data: {
        cultivoCoins: { increment: 50 }
      }
    });

    console.log(`✅ Pacote de boas-vindas entregue: ${selectedSeed.name} + 50 coins`);

    return NextResponse.json({
      success: true,
      welcomePack: {
        seed: item,
        rarity: selectedSeed.rarity,
        bonusCoins: 50,
        message: getRarityMessage(selectedSeed.rarity)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar pacote de boas-vindas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// ========== MENSAGENS POR RARIDADE ==========
function getRarityMessage(rarity: ItemRarity): string {
  const messages = {
    LEGENDARY: '🌟✨ LENDÁRIO! Você tirou uma LANDRACE HISTÓRICA! Genética ancestral raríssima!',
    EPIC: '💎 ÉPICO! Um clássico da era dourada! Genética lendária dos anos 80-90s!',
    RARE: '🔥 RARO! Uma strain famosa dos anos 2000s! Parabéns!',
    UNCOMMON: '⚡ INCOMUM! Uma strain moderna popular! Ótimo começo!',
    COMMON: '🌱 Sua primeira seed! Uma cruza hype da nova geração!'
  };
  return messages[rarity] || '🌱 Bem-vindo ao cultivo virtual!';
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = session.user.id;

    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId },
      include: {
        inventory: {
          where: {
            sourceType: SourceType.WELCOME_PACK
          }
        }
      }
    });

    const hasReceivedPack = virtualGrow && virtualGrow.inventory.length > 0;

    return NextResponse.json({
      hasReceivedPack,
      canClaim: !hasReceivedPack
    });
  } catch (error) {
    console.error('❌ Erro ao verificar pacote de boas-vindas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
