import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log('Total de produtos:', count)
  
  const products = await prisma.product.findMany({
    select: {
      name: true,
      slug: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  
  console.log('\nProdutos cadastrados:')
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} (${p.slug})`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
