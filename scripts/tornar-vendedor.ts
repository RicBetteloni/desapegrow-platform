import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function tornarVendedor(email: string) {
  try {
    console.log(`🔍 Buscando usuário: ${email}`)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { sellerProfile: true }
    })

    if (!user) {
      console.error('❌ Usuário não encontrado')
      return
    }

    if (user.sellerProfile) {
      console.log('✅ Usuário já é vendedor!')
      return
    }

    // Criar perfil de vendedor
    await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        businessName: user.name + ' - Loja',
        totalSales: 0,
        totalOrders: 0
      }
    })

    console.log('✅ Usuário agora é vendedor!')
    console.log('🏪 Acesse: http://localhost:3000/vendedor')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Execute com o e-mail do usuário
const email = process.argv[2]

if (!email) {
  console.error('❌ Uso: npx tsx scripts/tornar-vendedor.ts seu@email.com')
  process.exit(1)
}

tornarVendedor(email)
