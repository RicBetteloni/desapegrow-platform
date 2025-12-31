import { prisma } from '../src/lib/prisma';
import { ItemType, ItemRarity, SourceType } from '@prisma/client';

async function addTestItem() {
  try {
    // Buscar usuário vendedor
    const user = await prisma.user.findUnique({
      where: { email: 'vendedor@desapegrow.com' }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    // Buscar VirtualGrow
    const virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: user.id }
    });

    if (!virtualGrow) {
      console.log('❌ VirtualGrow não encontrado');
      return;
    }

    // Adicionar item de teste
    const item = await prisma.virtualItem.create({
      data: {
        growId: virtualGrow.id,
        itemType: ItemType.GENETICS,
        rarity: ItemRarity.EPIC,
        name: '🔥 Fire OG',
        iconUrl: '/seeds/fire-og.png',
        sourceType: SourceType.DAILY_REWARD,
        effects: {
          growthSpeed: 1.1,
          yieldMultiplier: 1.3
        }
      }
    });

    console.log('✅ Item adicionado ao inventário!');
    console.log(`   Nome: ${item.name}`);
    console.log(`   Raridade: ${item.rarity}`);
    console.log(`\n🎯 Agora faça o seguinte:`);
    console.log(`   1. Vá para a aba "Plantas" (não fique em Inventário)`);
    console.log(`   2. Aguarde 2 segundos`);
    console.log(`   3. Observe o badge vermelho aparecer no botão "Inventário"`);

  } catch (error) {
    console.error('❌ Erro:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

addTestItem();
