import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function criarAdmin() {
  try {
    console.log('🔍 Verificando se admin já existe...')
    
    let user = await prisma.user.findUnique({
      where: { email: 'ricardo@teste.com' }
    })

    if (user) {
      console.log('✅ Usuário já existe!')
      
      // Garantir que é ADMIN
      if (user.role !== 'ADMIN') {
        console.log('🔄 Atualizando para ADMIN...')
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' }
        })
        console.log('✅ Role atualizado para ADMIN!')
      } else {
        console.log('✅ Usuário já é ADMIN!')
      }

      console.log('\n🎉 INFORMAÇÕES DA CONTA:')
      console.log('📧 Email: ricardo@teste.com')
      console.log('🔑 Senha: admin123')
      console.log('👤 Role: ADMIN')
      console.log('📊 Acesse: http://localhost:3000/dashboard')
      console.log('📈 Acesse: http://localhost:3000/analytics')
      return
    }

    console.log('👤 Criando nova conta admin Ricardo...')
    
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Criar usuário ADMIN
    user = await prisma.user.create({
      data: {
        email: 'ricardo@teste.com',
        name: 'Ricardo Admin',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '11988888888',
        isEmailVerified: true
      }
    })

    console.log('✅ Usuário admin criado!')

    // Criar VirtualGrow
    await prisma.virtualGrow.create({
      data: {
        userId: user.id,
        cultivoCoins: 10000,
        growthGems: 500,
        harvestTokens: 100
      }
    })

    console.log('✅ Virtual Grow criado!')

    console.log('\n🎉 CONTA ADMIN CRIADA COM SUCESSO!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: ricardo@teste.com')
    console.log('🔑 Senha: admin123')
    console.log('👤 Role: ADMIN')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🔐 PÁGINAS EXCLUSIVAS DE ADMIN:')
    console.log('📊 Dashboard: http://localhost:3000/dashboard')
    console.log('📈 Analytics: http://localhost:3000/analytics')
    console.log('\n💡 Os links Dashboard e Analytics só aparecem no menu quando logado como ADMIN')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

criarAdmin()
