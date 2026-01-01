import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: ['kit-30-budclip-lst-training', 'perlita-expandida-10l-cultivo']
      }
    },
    include: {
      images: true
    }
  })

  console.log(JSON.stringify(products, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
