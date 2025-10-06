// scripts/demo-unlock-system.ts
/**
 * SCRIPT DE DEMONSTRAÇÃO - Sistema de Unlock
 * 
 * Execute este script para testar o sistema completo sem precisar
 * fazer uma compra real no marketplace.
 * 
 * Como usar:
 * 1. Certifique-se que o servidor está rodando (npm run dev)
 * 2. Faça login no sistema
 * 3. Execute: npx ts-node scripts/demo-unlock-system.ts
 */

import { PrismaClient } from '@prisma/client'
import { mapProductToVirtualItem, getCoinsReward, getGemsReward } from '../src/lib/productItemMapping'

const prisma = new PrismaClient()

async function demoUnlockSystem() {
  console.log('🎮 DEMO: Sistema de Unlock de Itens Virtuais\n')
  console.log('=' .repeat(60))

  try {
    // 1. Encontrar um usuário de teste
    console.log('\n📍 Passo 1: Buscando usuário de teste...')
    let user = await prisma.user.findFirst({
      where: { email: { contains: '@example.com' } }
    })

    if (!user) {
      console.log('   ⚠️  Nenhum usuário de teste encontrado')
      console.log('   Criando usuário demo...')
      
      user = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Demo User',
          password: 'demo123',
          gameProfile: {
            create: {
              totalPoints: 0,
              availablePoints: 0
            }
          }
        },
        include: { gameProfile: true }
      })
      console.log('   ✅ Usuário criado:', user.email)
    } else {
      console.log('   ✅ Usuário encontrado:', user.email)
    }

    // 2. Garantir que tem VirtualGrow
    console.log('\n📍 Passo 2: Verificando VirtualGrow...')
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: user.id }
    })

    if (!virtualGrow) {
      console.log('   Criando VirtualGrow...')
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId: user.id }
      })
      console.log('   ✅ VirtualGrow criado')
    } else {
      console.log('   ✅ VirtualGrow já existe')
    }

    // 3. Buscar um produto
    console.log('\n📍 Passo 3: Buscando produto para demo...')
    const product = await prisma.product.findFirst({
      include: { category: true }
    })

    if (!product) {
      console.log('   ❌ Nenhum produto encontrado!')
      console.log('   Execute o seed primeiro: npx prisma db seed')
      return
    }
    console.log('   ✅ Produto:', product.name)
    console.log('   💰 Preço: R$', product.price.toString())
    console.log('   📂 Categoria:', product.category.name)

    // 4. Criar pedido demo
    console.log('\n📍 Passo 4: Criando pedido demo...')
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'DELIVERED',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price
          }
        }
      }
    })
    console.log('   ✅ Pedido criado:', order.id)

    // 5. Simular unlock de item
    console.log('\n📍 Passo 5: Desbloqueando item virtual...')
    // Funções de mapeamento já importadas no topo do arquivo
    
    const virtualItemData = mapProductToVirtualItem(
      product.name,
      product.category.slug,
      Number(product.price)
    )

    if (!virtualItemData) {
      console.log('   ❌ Erro ao mapear produto!')
      return
    }

    const coinsReward = getCoinsReward(virtualItemData.rarity)
    const gemsReward = getGemsReward(virtualItemData.rarity)

    // Criar item virtual
    const virtualItem = await prisma.virtualItem.create({
      data: {
        growId: virtualGrow.id,
        itemType: virtualItemData.itemType,
        rarity: virtualItemData.rarity,
        name: virtualItemData.nameTemplate,
        iconUrl: virtualItemData.iconUrl,
        effects: Object.fromEntries(virtualItemData.effects.map(effect => [effect.type, effect.value])),
        sourceType: 'PURCHASE',
        sourceId: order.id,
        realProductId: product.id
      }
    })

    console.log('   ✅ Item desbloqueado!')
    console.log('   📦 Nome:', virtualItem.name)
    console.log('   ⭐ Raridade:', virtualItem.rarity)
    console.log('   🎨 Tipo:', virtualItem.itemType)

    // 6. Atualizar moedas
    console.log('\n📍 Passo 6: Atualizando moedas...')
    await prisma.virtualGrow.update({
      where: { id: virtualGrow.id },
      data: {
        cultivoCoins: { increment: coinsReward },
        growthGems: { increment: gemsReward }
      }
    })

    await prisma.gameProfile.update({
      where: { userId: user.id },
      data: {
        totalPoints: { increment: coinsReward },
        availablePoints: { increment: coinsReward }
      }
    })

    console.log('   ✅ Recompensas creditadas!')
    console.log('   🪙 CultivoCoins:', coinsReward)
    console.log('   💎 GrowthGems:', gemsReward)

    // 7. Mostrar resumo final
    console.log('\n' + '='.repeat(60))
    console.log('🎉 DEMO CONCLUÍDO COM SUCESSO!\n')

    const updatedGrow = await prisma.virtualGrow.findUnique({
      where: { id: virtualGrow.id },
      include: {
        inventory: true
      }
    })

    const updatedProfile = await prisma.gameProfile.findUnique({
      where: { userId: user.id }
    })

    console.log('📊 RESUMO DO USUÁRIO:')
    console.log('   Nome:', user.name)
    console.log('   Email:', user.email)
    console.log('   Level:', updatedProfile?.currentLevel)
    console.log('   Pontos Totais:', updatedProfile?.totalPoints)
    console.log('\n💰 MOEDAS:')
    console.log('   🪙 CultivoCoins:', updatedGrow?.cultivoCoins)
    console.log('   💎 GrowthGems:', updatedGrow?.growthGems)
    console.log('   🌾 HarvestTokens:', updatedGrow?.harvestTokens)
    console.log('\n🎒 INVENTÁRIO:')
    console.log('   Total de Itens:', updatedGrow?.inventory.length)
    
    updatedGrow?.inventory.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.name} (${item.rarity})`)
    })

    console.log('\n📱 TESTE NA INTERFACE:')
    console.log('   1. Acesse: http://localhost:3000/auth/signin')
    console.log('   2. Login: demo@example.com / demo123')
    console.log('   3. Vá para Dashboard → Inventário')
    console.log('   4. Veja seu item desbloqueado! 🎁')
    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('\n❌ ERRO:', error)
    console.log('\nDicas de troubleshooting:')
    console.log('1. Verifique se o banco está rodando')
    console.log('2. Execute: npx prisma generate')
    console.log('3. Execute: npx prisma db push')
    console.log('4. Execute: npx prisma db seed')
  } finally {
    await prisma.$disconnect()
  }
}

// Executar demo
demoUnlockSystem()
  .catch(console.error)

/**
 * VARIAÇÕES DO DEMO:
 * 
 * 1. Demo de múltiplos unlocks:
 *    - Criar 5 pedidos diferentes
 *    - Desbloquear 5 itens de raridades variadas
 * 
 * 2. Demo de inventário completo:
 *    - Preencher inventário com 20+ itens
 *    - Testar filtros e busca
 * 
 * 3. Demo de leaderboard:
 *    - Criar 10 usuários com grows diferentes
 *    - Calcular rankings
 */