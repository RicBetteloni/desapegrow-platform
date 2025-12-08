// scripts/reset-maria-password.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function resetMaria() {
  console.log('🔐 Resetando senha da Maria Santos\n')

  try {
    const email = 'maria.santos@example.com'
    const newPassword = 'senha123'

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        virtualGrow: {
          include: {
            inventory: true
          }
        }
      }
    })

    if (!user) {
      console.log('❌ Maria Santos não encontrada!')
      return
    }

    console.log(`✅ Usuário: ${user.name}`)
    console.log(`📦 Inventário: ${user.virtualGrow?.inventory.length || 0} items\n`)

    // Mostrar itens
    if (user.virtualGrow?.inventory) {
      user.virtualGrow.inventory.forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.name} (${item.rarity})`)
      })
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    console.log('\n✅ Senha atualizada!')
    console.log('\n📝 CREDENCIAIS:')
    console.log(`   Email: ${email}`)
    console.log(`   Senha: ${newPassword}`)
    console.log('\n🌐 Faça login em: http://localhost:3000/auth/signin')

  } catch (error) {
    console.error('❌ ERRO:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetMaria().catch(console.error)