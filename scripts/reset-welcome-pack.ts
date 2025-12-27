import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetWelcomePack() {
  try {
    console.log('🔄 Resetando welcome pack...');

    // Deletar todos os itens do inventário que vieram do WELCOME_PACK
    const deleted = await prisma.virtualItem.deleteMany({
      where: {
        sourceType: 'WELCOME_PACK'
      }
    });

    console.log(`✅ ${deleted.count} itens deletados do welcome pack`);
    console.log('🎁 Você pode reivindicar o pacote novamente!');
  } catch (error) {
    console.error('❌ Erro ao resetar welcome pack:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetWelcomePack();
