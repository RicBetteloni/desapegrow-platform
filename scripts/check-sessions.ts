import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📋 Verificando todas as sessões ativas:\n')
  
  const sessions = await prisma.session.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { expires: 'desc' }
  })
  
  sessions.forEach(session => {
    const isExpired = session.expires < new Date()
    console.log(`Session ID: ${session.sessionToken.substring(0, 20)}...`)
    console.log(`  User: ${session.user.name} (${session.user.email})`)
    console.log(`  User ID: ${session.user.id}`)
    console.log(`  Expires: ${session.expires.toLocaleString()}`)
    console.log(`  Status: ${isExpired ? '❌ EXPIRADA' : '✅ ATIVA'}`)
    console.log('')
  })
  
  console.log(`Total de sessões: ${sessions.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
