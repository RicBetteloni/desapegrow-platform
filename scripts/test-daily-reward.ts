// Teste de resgate de recompensa diária
import { PrismaClient, ItemRarity, ItemType, SourceType } from '@prisma/client'

const prisma = new PrismaClient()

async function testDailyReward() {
  try {
    console.log('🎁 Testando resgate de recompensa diária...\n')

    const user = await prisma.user.findFirst()
    if (!user) {
      console.error('❌ Nenhum usuário encontrado!')
      return
    }

    console.log(`✅ Usuário: ${user.email}\n`)

    // Buscar ou criar VirtualGrow
    let virtualGrow = await prisma.virtualGrow.findUnique({
      where: { userId: user.id }
    })

    if (!virtualGrow) {
      virtualGrow = await prisma.virtualGrow.create({
        data: { userId: user.id }
      })
    }

    console.log(`✅ VirtualGrow: ${virtualGrow.id}`)
    console.log(`   Coins antes: ${virtualGrow.cultivoCoins}\n`)

    // Simular resgate de recompensa
    const now = new Date()
    const rewardDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    console.log('📅 Data do reward:')
    console.log(`   - now: ${now.toISOString()}`)
    console.log(`   - rewardDate: ${rewardDate.toISOString()}`)
    console.log(`   - Type: ${typeof rewardDate}\n`)

    // Testar criação de DailyRewardLog
    try {
      const testReward = await prisma.dailyRewardLog.create({
        data: {
          userId: user.id,
          growId: virtualGrow.id,
          rewardDate: rewardDate,
          coinsEarned: 50,
          streakDay: 1,
          totalStreak: 1,
          itemsReceived: [],
          rngSeed: `test-${Date.now()}`,
          rarityRolled: ItemRarity.COMMON
        }
      })

      console.log('✅ DailyRewardLog criado com sucesso!')
      console.log(`   ID: ${testReward.id}`)
      console.log(`   rewardDate: ${testReward.rewardDate}`)
      console.log(`   Type: ${typeof testReward.rewardDate}\n`)

      // Testar leitura e conversão
      const readReward = await prisma.dailyRewardLog.findUnique({
        where: { id: testReward.id }
      })

      if (readReward) {
        console.log('✅ DailyRewardLog lido com sucesso!')
        const convertedDate = new Date(readReward.rewardDate)
        console.log(`   Data convertida: ${convertedDate.toISOString()}`)
        console.log(`   getTime() funciona: ${convertedDate.getTime()}\n`)

        // Limpar teste
        await prisma.dailyRewardLog.delete({
          where: { id: testReward.id }
        })
        console.log('🧹 Registro de teste removido\n')
      }

      console.log('✅ Todos os testes de recompensa passaram!')

    } catch (error) {
      console.error('❌ Erro ao criar DailyRewardLog:', error)
    }

  } catch (error) {
    console.error('❌ Erro geral:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDailyReward()
