import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Limpando banco de dados...')
  
  // Deletar na ordem correta para respeitar as foreign keys
  await prisma.orderItem.deleteMany({})
  console.log('✅ OrderItems deletados')
  
  await prisma.order.deleteMany({})
  console.log('✅ Orders deletados')
  
  await prisma.review.deleteMany({})
  console.log('✅ Reviews deletados')
  
  await prisma.favorite.deleteMany({})
  console.log('✅ Favorites deletados')
  
  await prisma.productImage.deleteMany({})
  console.log('✅ ProductImages deletadas')
  
  await prisma.product.deleteMany({})
  console.log('✅ Products deletados')
  
  await prisma.category.deleteMany({})
  console.log('✅ Categories deletadas')
  
  console.log('\n🎉 Banco limpo! Agora rode: npx tsx prisma/seed-categories-hierarchy.ts')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
