import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function criarUsuarioVendedor() {
  try {
    console.log('🔍 Verificando se usuário já existe...')
    
    let user = await prisma.user.findUnique({
      where: { email: 'joao@teste.com' },
      include: { sellerProfile: true }
    })

    if (user) {
      console.log('✅ Usuário já existe!')
      
      // Garantir que é vendedor
      if (user.role !== 'SELLER') {
        console.log('🔄 Atualizando para SELLER...')
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'SELLER' }
        })
      }

      // Criar perfil de vendedor se não existir
      if (!user.sellerProfile) {
        console.log('🏪 Criando perfil de vendedor...')
        await prisma.sellerProfile.create({
          data: {
            userId: user.id,
            businessName: 'Loja do João - Teste',
            totalSales: 0,
            totalOrders: 0
          }
        })
      }

      console.log('✅ Usuário João configurado como VENDEDOR!')
      console.log('📧 Email: joao@teste.com')
      console.log('🔑 Senha: 123456')
      console.log('🏪 Acesse: http://localhost:3000/vendedor')
      return
    }

    console.log('👤 Criando novo usuário João...')
    
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Criar usuário
    user = await prisma.user.create({
      data: {
        email: 'joao@teste.com',
        name: 'João Vendedor',
        password: hashedPassword,
        role: 'SELLER',
        phone: '11999999999',
        isEmailVerified: true
      },
      include: {
        sellerProfile: true
      }
    })

    console.log('✅ Usuário criado!')

    // Criar perfil de vendedor
    if (!user?.id) {
      throw new Error('Falha ao criar usuário');
    }

    await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        businessName: 'Loja do João - Teste',
        totalSales: 0,
        totalOrders: 0
      }
    })

    console.log('✅ Perfil de vendedor criado!')

    // Criar VirtualGrow
    if (!user?.id) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.virtualGrow.create({
      data: {
        userId: user.id,
        cultivoCoins: 1000,
        growthGems: 50,
        harvestTokens: 10
      }
    })

    console.log('✅ Virtual Grow criado!')

    console.log('\n🎉 PRONTO! Usuário de teste criado:')
    console.log('📧 Email: joao@teste.com')
    console.log('🔑 Senha: 123456')
    console.log('👤 Role: SELLER')
    console.log('🏪 Acesse: http://localhost:3000/vendedor')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

criarUsuarioVendedor()
