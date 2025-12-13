import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'joao@msn.com'
  const password = '123456'
  const name = 'João'

  console.log('🔧 Criando usuário João...\n')

  // Verificar se já existe
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    console.log('❌ Usuário já existe!')
    console.log('ID:', existing.id)
    return
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10)

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'SELLER'
    }
  })

  console.log('✅ Usuário criado:', user.id)

  // Criar perfil de vendedor
  const sellerProfile = await prisma.sellerProfile.create({
    data: {
      userId: user.id
    }
  })

  console.log('✅ Perfil de vendedor criado:', sellerProfile.id)

  // Criar game profile
  const gameProfile = await prisma.gameProfile.create({
    data: {
      userId: user.id
    }
  })

  console.log('✅ Game profile criado:', gameProfile.id)

  console.log('\n✅ Pronto! Agora você pode fazer login com:')
  console.log(`   Email: ${email}`)
  console.log(`   Senha: ${password}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
