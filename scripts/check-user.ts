import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userId = 'cmj4u9fib0000jmnzpwhxrk41'
  
  console.log('🔍 Procurando usuário:', userId)
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })
  
  if (user) {
    console.log('✅ Usuário encontrado:')
    console.log('  - Nome:', user.name)
    console.log('  - Email:', user.email)
    console.log('  - ID:', user.id)
    console.log('  - Accounts:', user.accounts.length)
    console.log('  - Sessions:', user.sessions.length)
  } else {
    console.log('❌ Usuário NÃO encontrado no banco!')
    
    console.log('\n📋 Listando todos os usuários:')
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    })
    console.table(allUsers)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
