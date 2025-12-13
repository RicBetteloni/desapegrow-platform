import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Atualizando imagem do Medidor pH...\n')

  const product = await prisma.product.findUnique({
    where: { slug: 'medidor-ph-ec-digital' },
    include: { images: true }
  })

  if (!product) {
    console.log('❌ Produto não encontrado!')
    return
  }

  console.log('✅ Produto encontrado:', product.name)
  console.log('Imagens atuais:', product.images.length)

  // Deletar imagens antigas
  await prisma.productImage.deleteMany({
    where: { productId: product.id }
  })

  // Criar nova imagem
  await prisma.productImage.create({
    data: {
      productId: product.id,
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500',
      alt: 'Medidor pH e EC Digital',
      order: 0
    }
  })

  console.log('✅ Imagem atualizada com sucesso!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
