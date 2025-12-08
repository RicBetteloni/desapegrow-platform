// scripts/check-inventory.ts
/**
 * Script para verificar o inventário do usuário
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkInventory() {
  console.log('🔍 Verificando Inventário\n')
  console.log('=' .repeat(60))

  try {
    const user = await prisma.user.findUnique({
      where: { email: 'joao.silva@example.com' },
      include: {
        virtualGrow: {
          include: {
            inventory: true,
            plants: true
          }
        }
      }
    })

    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }

    console.log(`\n👤 Usuário: ${user.name}`)
    console.log(`📧 Email: ${user.email}`)
    
    if (!user.virtualGrow) {
      console.log('\n❌ VirtualGrow não encontrado!')
      return
    }

    const grow = user.virtualGrow

    console.log('\n💰 MOEDAS:')
    console.log(`   🪙 Cultivo Coins: ${grow.cultivoCoins}`)
    console.log(`   💎 Growth Gems: ${grow.growthGems}`)
    console.log(`   🌾 Harvest Tokens: ${grow.harvestTokens}`)

    console.log('\n📦 INVENTÁRIO:')
    console.log(`   Total: ${grow.inventory.length} items`)
    
    if (grow.inventory.length === 0) {
      console.log('   ⚠️  Inventário vazio!')
    } else {
      grow.inventory.forEach((item, idx) => {
        console.log(`\n   ${idx + 1}. ${item.name}`)
        console.log(`      ID: ${item.id}`)
        console.log(`      Tipo: ${item.itemType}`)
        console.log(`      Raridade: ${item.rarity}`)
        console.log(`      Source: ${item.sourceType}`)
        console.log(`      Created: ${item.createdAt}`)
        console.log(`      Effects:`, JSON.stringify(item.effects, null, 2))
      })
    }

    console.log('\n🌱 PLANTAS:')
    console.log(`   Total: ${grow.plants.length} plantas`)
    
    if (grow.plants.length === 0) {
      console.log('   ⚠️  Nenhuma planta!')
    } else {
      grow.plants.forEach((plant, idx) => {
        console.log(`\n   ${idx + 1}. ${plant.name || 'Sem nome'}`)
        console.log(`      Stage: ${plant.stage}`)
        console.log(`      Health: ${plant.health}`)
      })
    }

    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('\n❌ ERRO:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkInventory().catch(console.error)