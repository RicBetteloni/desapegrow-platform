import { prisma } from '../src/lib/prisma';

async function main() {
  const userId = 'cmjok1kzw0000vnvgbgri7e8p';
  
  const plants = await prisma.virtualPlant.findMany({
    where: {
      grow: {
        userId: userId
      }
    },
    select: {
      id: true,
      name: true,
      stage: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  console.log(`\n🔍 Total de plantas para usuário ${userId}: ${plants.length}\n`);
  
  plants.forEach((plant, index) => {
    console.log(`${index + 1}. ${plant.name} (${plant.stage})`);
    console.log(`   ID: ${plant.id}`);
    console.log(`   Criada: ${plant.createdAt.toLocaleString()}\n`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
