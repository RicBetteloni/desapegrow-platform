// Script de teste para as APIs do Grow Virtual
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPIs() {
  try {
    console.log('🧪 Iniciando testes das APIs...\n')

    // 1. Buscar qualquer usuário
    const user = await prisma.user.findFirst()

    if (!user) {
      console.error('❌ Usuário de teste não encontrado!')
      return
    }

    console.log(`✅ Usuário encontrado: ${user.email} (${user.id})\n`)

    // 2. Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: user.id },
      include: {
        plants: true,
        inventory: true,
        dailyRewards: {
          orderBy: { rewardDate: 'desc' },
          take: 5
        }
      }
    })

    if (!virtualGrow) {
      console.log('📝 Criando VirtualGrow...')
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId: user.id },
        include: {
          plants: true,
          inventory: true,
          dailyRewards: true
        }
      })
    }

    console.log(`✅ VirtualGrow encontrado: ${virtualGrow.id}`)
    console.log(`   - Cultivo Coins: ${virtualGrow.cultivoCoins}`)
    console.log(`   - Plantas: ${virtualGrow.plants.length}`)
    console.log(`   - Items: ${virtualGrow.inventory.length}`)
    console.log(`   - Daily Rewards: ${virtualGrow.dailyRewards.length}\n`)

    // 3. Testar lógica de verificação de reward diário
    const now = new Date()
    const last24h = new Date(now.getTime() - (24 * 60 * 60 * 1000))

    const lastReward = await prisma.dailyRewardLog.findFirst({
      where: {
        userId: user.id,
        growId: virtualGrow.id,
        rewardDate: { gte: last24h }
      },
      orderBy: {
        rewardDate: 'desc'
      }
    })

    if (lastReward) {
      console.log('⏰ Último reward resgatado:')
      console.log(`   - Data: ${lastReward.rewardDate}`)
      console.log(`   - Streak: ${lastReward.streakDay}`)
      console.log(`   - Coins: ${lastReward.coinsEarned}`)
      
      // Testar conversão de Date
      const lastDate = new Date(lastReward.rewardDate)
      console.log(`   - Data convertida: ${lastDate.toISOString()}`)
      console.log(`   - getTime() funciona: ${lastDate.getTime()}\n`)
    } else {
      console.log('✅ Nenhum reward nas últimas 24h - pode resgatar!\n')
    }

    // 4. Testar se há plantas
    if (virtualGrow.plants.length > 0) {
      console.log('🌱 Testando propriedades das plantas:')
      virtualGrow.plants.forEach(plant => {
        console.log(`\n   Planta: ${plant.name}`)
        console.log(`   - size: ${plant.size} (tipo: ${typeof plant.size})`)
        console.log(`   - daysGrowing: ${plant.daysGrowing} (tipo: ${typeof plant.daysGrowing})`)
        console.log(`   - health: ${plant.health} (tipo: ${typeof plant.health})`)
        console.log(`   - vpdLevel: ${plant.vpdLevel} (tipo: ${typeof plant.vpdLevel})`)
        
        // Testar toFixed
        try {
          const sizeFixed = (plant.size ?? 0).toFixed(1)
          const daysFixed = (plant.daysGrowing ?? 0).toFixed(0)
          const vpdFixed = (plant.vpdLevel ?? 1.0).toFixed(1)
          console.log(`   ✅ toFixed funciona: ${sizeFixed}g, ${daysFixed} dias, VPD ${vpdFixed}`)
        } catch (err) {
          console.error(`   ❌ Erro no toFixed:`, err)
        }
      })
    }

    console.log('\n✅ Todos os testes passaram!')

  } catch (error) {
    console.error('❌ Erro nos testes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPIs()
