import { prisma } from '../src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'ricardo' } },
        { email: { contains: 'ric' } }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true
    }
  });

  console.log('\n👥 Usuários encontrados:\n');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || 'Sem nome'}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Admin: ${user.isAdmin ? 'Sim' : 'Não'}\n`);
  });

  // Verificar quantas plantas cada um tem
  for (const user of users) {
    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: user.id },
      include: {
        plants: {
          select: {
            name: true,
            stage: true
          }
        }
      }
    });

    if (virtualGrow) {
      console.log(`🌱 Plantas de ${user.email}: ${virtualGrow.plants.length}`);
      virtualGrow.plants.forEach(plant => {
        console.log(`   - ${plant.name} (${plant.stage})`);
      });
      console.log();
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
